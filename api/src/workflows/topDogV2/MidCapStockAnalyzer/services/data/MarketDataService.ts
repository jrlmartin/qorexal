// src/services/data/MarketDataService.ts
import { MarketData } from '../../models/MarketData';
import { TradierApiClient } from '../api/TradierApiClient';
import { EODHDApiClient } from '../api/EODHDApiClient';
import { StockDataService } from './StockDataService';
import { SectorRotationService } from '../algorithms/SectorRotationService';
import { format } from 'date-fns';
import { config } from '../../config';

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
        economicData = await this.eodhdClient.getEconomicCalendar(date, date, 'US');
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
      
      quotes.forEach((quote: any) => {
        processedIndices[quote.symbol] = {
          price: quote.last || 0,
          change_percent: quote.change_percentage || 0
        };
      });
    }
    
    // Process sector performance data
    const sectorPerformance: Record<string, number> = {};
    
    if (sectorData.quotes && sectorData.quotes.quote) {
      const quotes = Array.isArray(sectorData.quotes.quote) 
        ? sectorData.quotes.quote 
        : [sectorData.quotes.quote];
      
      quotes.forEach((quote: any) => {
        sectorPerformance[quote.symbol] = quote.change_percentage || 0;
      });
    }
    
    // Calculate sector rotation
    const sectorRotation = this.sectorRotationService.calculateSectorRotation(sectorPerformance);
    
    // Process VIX data
    const vix = vixData.quotes?.quote?.last || 0;
    
    // Calculate put/call ratio
    let putCallRatio = 0.8; // Default value
    
    if (spyOptions.options && spyOptions.options.option) {
      const options = spyOptions.options.option;
      const calls = options.filter((opt: any) => opt.option_type === 'call');
      const puts = options.filter((opt: any) => opt.option_type === 'put');
      
      const callVolume = calls.reduce((sum: number, opt: any) => sum + (opt.volume || 0), 0);
      const putVolume = puts.reduce((sum: number, opt: any) => sum + (opt.volume || 0), 0);
      
      putCallRatio = callVolume > 0 
        ? parseFloat((putVolume / callVolume).toFixed(2))
        : 0.8;
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