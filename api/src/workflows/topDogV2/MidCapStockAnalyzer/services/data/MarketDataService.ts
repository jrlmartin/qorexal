import { MarketData } from '../../models/MarketData';
import { StockDataService } from './StockDataService';
import { SectorRotationService } from '../algorithms/SectorRotationService';
import { config } from '../../config';
import { TradierApiClient } from 'src/serivces/api/TradierApiClient';
import { EODHDApiClient } from 'src/serivces/api/EODHDApiClient';
 
// Helper function to check for undefined or null values
function validateCriticalData<T>(value: T | undefined | null, fieldName: string, context?: string): T {
  if (value === undefined || value === null) {
    throw new Error(`Critical data missing: ${fieldName}${context ? ` for ${context}` : ''}`);
  }
  return value;
}

export class MarketDataService {
  private tradierClient: TradierApiClient;
  private eodhdClient: EODHDApiClient;
  private stockDataService: StockDataService;
  private sectorRotationService: SectorRotationService;
  
  constructor() {
    this.tradierClient = new TradierApiClient();
    this.eodhdClient = new EODHDApiClient();
    this.stockDataService = new StockDataService();
    this.sectorRotationService = new SectorRotationService();
  }
  
  // Main method to gather all market data
  async getMarketData(date: string, time: string, stockTickers: string[]): Promise<MarketData> {
    // Step 1: Get market indices data
    const indices = ['SPY', 'QQQ', 'IWM'];
    const indicesData = await this.tradierClient.getQuotes(indices);
    
    // Step 2: Get sector ETF data for sector performance
    const sectorETFs = ['XLK', 'XLY', 'XLF', 'XLV', 'XLE', 'XLI', 'XLP', 'XLU', 'XLB', 'XLRE', 'XLC'];
    const sectorData = await this.tradierClient.getQuotes(sectorETFs);
    
    // Step 3: Get VIX data
    const vixData = await this.tradierClient.getQuotes(['VIX']);
    
    // Step 4: Get economic calendar - Skip if API key is missing
    let economicData = [];
    if (config.eodhd.apiKey) {
      try {
        const response  = await this.eodhdClient.getEconomicCalendar(date, date, 'US');
        economicData = validateCriticalData(response.events, 'events', `events ${response.events}`);
      } catch (error) {
        console.error('Error fetching economic calendar data:', error);
        economicData = [];
      }
    }
    
    // Step 5: Calculate market-wide put/call ratio (can be approximated from index options)
    const spyOptions = await this.tradierClient.getOptionsChains('SPY', date);
    
    // Step 6: Get data for each stock in the universe
    const stockDataPromises = stockTickers.map(ticker => 
      this.stockDataService.getStockData(ticker, date)
    );
    
    const stockUniverse = await Promise.all(stockDataPromises);
    
    // Process indices data
    const processedIndices: Record<string, { price: number; change_percent: number }> = {};
    
    if (indicesData.quotes && indicesData.quotes.quote) {
      const quotes = Array.isArray(indicesData.quotes.quote) 
        ? indicesData.quotes.quote 
        : [indicesData.quotes.quote];
      
      quotes.forEach((quote) => {
        processedIndices[quote.symbol] = {
          price: validateCriticalData(quote.last, 'price', `index ${quote.symbol}`),
          change_percent: validateCriticalData(quote.change_percentage, 'change_percentage', `index ${quote.symbol}`)
        };
      });
    }
    
    // Process sector performance data
    const sectorPerformance: Record<string, number> = {};
    
    if (sectorData.quotes && sectorData.quotes.quote) {
      const quotes = Array.isArray(sectorData.quotes.quote) 
        ? sectorData.quotes.quote 
        : [sectorData.quotes.quote];
      
      quotes.forEach((quote) => {
        sectorPerformance[quote.symbol] = validateCriticalData(
          quote.change_percentage, 
          'change_percentage', 
          `sector ETF ${quote.symbol}`
        );
      });
    }
    
    // Calculate sector rotation
    const sectorRotation = this.sectorRotationService.calculateSectorRotation(sectorPerformance);
    
    // Process VIX data
    let vix: number;
    if (vixData.quotes && vixData.quotes.quote) {
      const vixQuote = Array.isArray(vixData.quotes.quote) 
        ? vixData.quotes.quote[0] 
        : vixData.quotes.quote;
      
      vix = validateCriticalData(vixQuote?.last, 'VIX price');
    } else {
      throw new Error('Critical data missing: VIX data not available');
    }
    
    // Calculate put/call ratio
    let putCallRatio: number;
    
    if (spyOptions.options && spyOptions.options.option) {
      const options = spyOptions.options.option;
      const calls = options.filter((opt) => opt.option_type === 'call');
      const puts = options.filter((opt) => opt.option_type === 'put');
      
      const callVolume = calls.reduce((sum: number, opt) => {
        return sum + validateCriticalData(opt.volume, 'volume', `call option ${opt.symbol}`);
      }, 0);
      
      const putVolume = puts.reduce((sum: number, opt) => {
        return sum + validateCriticalData(opt.volume, 'volume', `put option ${opt.symbol}`);
      }, 0);
      
      if (callVolume === 0) {
        throw new Error('Critical data issue: call option volume is zero, cannot calculate put/call ratio');
      }
      
      putCallRatio = parseFloat((putVolume / callVolume).toFixed(2));
    } else {
      throw new Error('Critical data missing: options data not available for put/call ratio calculation');
    }
    
    // Process economic events
    const macroEvents = economicData;
    
    // Construct full market data object
    return {
      date,
      time,
      market_data: {
        indices: processedIndices,
        sector_performance: sectorPerformance
      },
      stock_universe: stockUniverse,
      market_conditions: {
        vix,
        put_call_ratio: putCallRatio,
        sector_rotation: sectorRotation,
        macro_events: macroEvents
      }
    };
  }
}