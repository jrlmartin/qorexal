import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MarketCapTierEnum,
  StockCapTierEntity,
} from '../entities/StockCapTier.entity';
import * as alphaVantage from 'alphavantage';
import { BenzingaService } from './market-api/benzinga';
import { MarkdownFormatter } from '../helpers/markdown-formatter.helper';

// Type alias for the return type of the alphavantage function
type AlphaVantageClient = ReturnType<typeof alphaVantage>;

/**
 * Service for handling stock-related operations, including market cap tier classification
 * and stock data retrieval from external APIs
 */
@Injectable()
export class ConpanyDataSetService {
  private readonly alpha: AlphaVantageClient;

  constructor(
    @InjectRepository(StockCapTierEntity)
    private readonly stockCapTierRepository: Repository<StockCapTierEntity>,
    private readonly benzinga: BenzingaService,

  ) {
    // Initialize Alpha Vantage API client with API key
    this.alpha = alphaVantage({ key: 'CM9Z7GP4R48740XD' });
  }

  /**
   * Retrieves company overview data for a given ticker and converts it to markdown format
   * @param ticker The stock symbol to retrieve data for
   * @param markdown Whether to return the data in markdown format (defaults to true)
   * @returns Promise resolving to a markdown string of the company overview
   */
  async companyOverview(ticker: string, markdown: boolean = true): Promise<string> {
    const overview = await this.alpha.fundamental.company_overview(ticker);
    return markdown ? MarkdownFormatter.convertCompanyOverviewToMarkdown(overview) : overview;
  }

  /**
   * Retrieves daily adjusted time series data for a given ticker
   * @param ticker The stock symbol to retrieve data for
   * @param outputSize Whether to return full or compact data (defaults to compact)
   * @returns Promise resolving to the time series data
   */
  async dailyAdjustedTimeSeries(
    ticker: string,
    outputSize: 'full' | 'compact' = 'full',
    markdown: boolean = true,
  ): Promise<any> {
    const data = await this.alpha.data.daily_adjusted(ticker, outputSize);
    return markdown ? MarkdownFormatter.convertIntradayTimeSeriesToMarkdown(data) : data;
  }

  /**
   * Retrieves extended intraday time series data for a given ticker
   * @param ticker The stock symbol to retrieve data for
   * @param interval The time interval between data points
   * @param adjusted Whether to return adjusted data (defaults to true)
   * @returns Promise resolving to the intraday time series data
   */
  async intradayExtendedTimeSeries(
    ticker: string,
    interval: '1min' | '5min' | '15min' | '30min' | '60min' = '15min',
    outputsize:  'full' | 'compact' = 'compact',
    markdown: boolean = true,
  ): Promise<any> {
    const data = await this.alpha.data.intraday(ticker, outputsize, 'json', interval);
    return markdown ? MarkdownFormatter.convertIntradayTimeSeriesToMarkdown(data) : data;
  }

  /**
   * Retrieves the Relative Strength Index (RSI) technical indicator for a given ticker
   * @param ticker The stock symbol to retrieve data for
   * @param interval The time interval between data points
   * @param timePeriod The time period to calculate RSI (defaults to 14)
   * @param seriesType The price series type to use (defaults to 'close')
   * @param markdown Whether to return the data in markdown format (defaults to true)
   * @returns Promise resolving to the RSI technical indicator data
   */
  async rsiTechnicalIndicator(
    ticker: string,
    interval: 'daily' | 'weekly' | 'monthly' | '1min' | '5min' | '15min' | '30min' | '60min' = 'daily',
    timePeriod: number = 14,
    seriesType: 'close' | 'open' | 'high' | 'low' = 'close',
    markdown: boolean = true,
  ): Promise<any> {
    // Access the technical endpoint with the RSI function
    const data = await this.alpha.technical.rsi(ticker, interval, timePeriod, seriesType);
    return markdown ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(data, 'RSI', interval, timePeriod, seriesType) : data;
  }
//   ## 2. Technical Indicators

// ### a) RSI
// **Base Function:** RSI
// **Explanation**
//  - Momentum oscillator used to evaluate overbought/oversold conditions.

// #### Required Parameters
// * function=RSI
// * symbol=SYMBOL
// * interval=daily
// * time_period=14
// * series_type=close
// * apikey=YOUR_API_KEY

// #### Optional Parameters
// * datatype=json|csv

// **Recommended URL**
// https://www.alphavantage.co/query?function=RSI
// &symbol=IBM
// &interval=daily
// &time_period=14
// &series_type=close
// &apikey=YOUR_API_KEY

}
