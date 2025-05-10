/**
 * Service for gathering market-wide data, including indices, sectors,
 * economic events, and stock analysis.
 */

import { TradierApiClient } from '../../../serivces/api/TradierApiClient';
import { EODHDApiClient } from '../../../serivces/api/EODHDApiClient';
import { BenzingaService } from '../../../serivces/api/Benzinga.service'; // for consistency
import { StockDataService } from './StockDataService';
import { SectorRotationService } from './SectorRotationService';
import { getDateRanges } from '../../topDogV3/utils/dateUtils';
import { QuotesResponse } from '../../../serivces/api/TradierApiClient';
import { EconomicEventsResponse } from '../../../serivces/api/EODHDApiClient';
import { OptionsChainResponse } from '../../../serivces/api/TradierApiClient';
import { MarketData, Stock, MarketConditions } from '../models/DayTradingAnalysis';

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

  /**
   * Gather comprehensive market data
   * @param date date string (YYYY-MM-DD)
   * @param time time string (HH:MM:SS)
   * @param stockTickers array of tickers to analyze
   */
  async getMarketData(date: string, time: string, stockTickers: string[]): Promise<MarketData> {
    // Major market indices to track
    const indices = ['SPY', 'QQQ', 'IWM', 'DIA'];

    // Sector ETFs for performance tracking
    const sectorETFs = [
      'XLK', // Technology
      'XLF', // Financials
      'XLE', // Energy
      'XLV', // Healthcare
      'XLY', // Consumer Discretionary
      'XLP', // Consumer Staples
      'XLI', // Industrials
      'XLB', // Materials
      'XLU', // Utilities
      'XLRE' // Real Estate
    ];

    // Get market indices data from Tradier
    const indicesData = await this.tradierClient.getQuotes(indices);
    
    // Get sector ETF data from Tradier
    const sectorETFData = await this.tradierClient.getQuotes(sectorETFs);
    
    // VIX for volatility measure
    const vixData = await this.tradierClient.getQuotes(['VIX']);
    
    // Economic calendar from EODHD
    const today = new Date(date);
    const economicCalendarData = await this.eodhdClient.getEconomicCalendar(date, date, 'US');

    // Market status from Tradier
    const marketStatusData = await this.tradierClient.getMarketClock();

    // Calculate sector rotation
    const currentSectorPerformance = this.extractSectorPerformance(sectorETFData);

    // Get historical sector data for 1 week
    const { oneWeekAgo } = getDateRanges(date);
    const historicalSectorData: Record<string, any> = {};

    for (const etf of sectorETFs) {
      const historicalData = await this.eodhdClient.getHistoricalEOD(etf, oneWeekAgo, date);
      historicalSectorData[etf] = historicalData;
    }

    const sectorRotation = await this.sectorRotationService.calculateSectorRotation(
      currentSectorPerformance,
      historicalSectorData
    );

    // Analyze each stock in the universe
    const stockUniverse: Stock[] = [];
    for (const ticker of stockTickers) {
      const stockData = await this.stockDataService.getStockData(ticker, date);
      stockUniverse.push(stockData);
    }

    // Calculate put/call ratio using SPY options
    const spyExpDates = await this.tradierClient.getOptionsExpirations('SPY');
    const nearestExpiration = spyExpDates[0];
    const spyOptions = await this.tradierClient.getOptionsChains('SPY', nearestExpiration);
    const putCallRatio = this.calculatePutCallRatio(spyOptions);

    // Compile final
    const marketData: MarketData = {
      date,
      time,
      market_data: {
        indices: this.processIndicesData(indicesData),
        sector_performance: currentSectorPerformance
      },
      stock_universe: stockUniverse,
      market_conditions: {
        vix: vixData.quotes.quote[0].last,
        put_call_ratio: putCallRatio,
        sector_rotation: {
          inflow_sectors: sectorRotation.inflow_sectors,
          outflow_sectors: sectorRotation.outflow_sectors
        },
        macro_events: this.processEconomicEvents(economicCalendarData),
        market_status: marketStatusData.clock.state,
        next_market_hours_change: marketStatusData.clock.next_change
      }
    };

    return marketData;
  }

  private processIndicesData(indicesData: QuotesResponse): Record<string, { price: number; change_percent: number }> {
    const result: Record<string, { price: number; change_percent: number }> = {};
    for (const quote of indicesData.quotes.quote) {
      result[quote.symbol] = {
        price: quote.last,
        change_percent: quote.change_percentage
      };
    }
    return result;
  }

  private extractSectorPerformance(sectorETFData: QuotesResponse): Record<string, number> {
    const result: Record<string, number> = {};
    for (const quote of sectorETFData.quotes.quote) {
      result[quote.symbol] = quote.change_percentage;
    }
    return result;
  }

  private processEconomicEvents(calendarData: EconomicEventsResponse): { time: string; event: string }[] {
    return calendarData.events.map(event => ({
      time: event.date.split(' ')[1] || '00:00:00',
      event: `${event.event_name} (${event.country}) - Actual: ${event.actual}, Estimate: ${event.estimate}, Previous: ${event.previous}`
    }));
  }

  private calculatePutCallRatio(optionsData: OptionsChainResponse): number {
    let callVolume = 0;
    let putVolume = 0;
    for (const option of optionsData.options.option) {
      if (option.option_type === 'call') {
        callVolume += option.volume || 0;
      } else if (option.option_type === 'put') {
        putVolume += option.volume || 0;
      }
    }
    if (callVolume === 0) return 0;
    return parseFloat((putVolume / callVolume).toFixed(2));
  }
}