/**
 * Main service for mid-cap stock screening and selection.
 * This service relies on EODHDApiClient for fundamentals and uses
 * a local approach or ETF-based approach to retrieve mid-cap tickers.
 */

import { EODHDApiClient } from '../../../serivces/api/EODHDApiClient';
import { config } from '../../../serivces/api/config'; // Re-use config
import { getLatestTradingDay, getNow } from '../../topDogV3/utils/dateUtils';
import { MarketData } from '../models/DayTradingAnalysis'; // referencing the legacy MarketData
import { MarketDataService } from './MarketDataService';

export class MidCapScreenerService {
  private eodhdClient: EODHDApiClient;
  private midCapRange: { min: number; max: number };
  private stockUniverseLimit: number;

  constructor() {
    // Initialize dependencies
    this.eodhdClient = new EODHDApiClient();
    // Get configuration from config.ts
    this.midCapRange = config.app.midCapRange; // $2B-$10B
    this.stockUniverseLimit = config.app.stockUniverseLimit; // 20
  }

  /**
   * Find mid-cap stocks based on market cap range
   * Implementation Gap: No direct endpoint to query all stocks by market cap.
   * For MVP, use a predefined list or an ETF's holdings.
   */
  async findMidCapStocks(limit: number = this.stockUniverseLimit): Promise<string[]> {
    // Basic approach: Use predefined list from config.app.defaultStocks
    const midCapStocks: string[] = [];
    const preDefinedStocks = config.app.defaultStocks;

    // Add predefined stocks to maintain consistency
    midCapStocks.push(...preDefinedStocks);

    // If we need more, in a real implementation we'd query a watchlist or local DB
    // and filter by market cap using eodhdClient.getFundamentals for each ticker.

    return midCapStocks.slice(0, limit);
  }

  /**
   * Run the full analysis pipeline for mid-cap stocks
   */
  async runAnalysis(date?: string, time?: string): Promise<MarketData> {
    // Get current date/time if not provided
    const analysisDate = date || getLatestTradingDay();
    const analysisTime = time || getNow();

    // Find mid-cap stocks to analyze
    const stockTickers = await this.findMidCapStocks();

    // Gather market data with analyzed stocks
    const marketDataService = new MarketDataService();
    const marketData = await marketDataService.getMarketData(
      analysisDate,
      analysisTime,
      stockTickers
    );

    return marketData;
  }
}