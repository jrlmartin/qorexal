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
import { TimeIntervalType, SeriesType, OutputSizeType } from '../types/stock-data.types';

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
    this.alpha = alphaVantage({ key: 'KSRQH6VLLQSZ6UGU' });
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
    outputSize: OutputSizeType = 'compact',
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
    interval: TimeIntervalType = '15min',
    outputsize: OutputSizeType = 'compact',
    markdown: boolean = true,
  ): Promise<any> {
    const data = await this.alpha.data.intraday(ticker, interval, outputsize);
    return markdown ? MarkdownFormatter.convertIntradayTimeSeriesToMarkdown(data) : data;
  }
 
  /**
   * RSI - #1 Priority
   * RSI is one of the quickest ways to judge if a stock is overbought or oversold in the short term, 
   * which is critical right after a news catalyst triggers rapid price moves.
   */
  async rsiTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = 'daily',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 20,
  ): Promise<any> {
    let data = await this.alpha.technical.atr(ticker, interval, timePeriod, seriesType);
    return markdown ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(data, 'RSI', numElements) : data;
  }
  /**
   * 
   * MACD - #2 Priority
   * MACD helps confirm emerging momentum shifts and trend changes—key to knowing if a news-driven 
   * price move has potential follow-through or is a short-lived pop.
   */
  async macdTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = 'daily',
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9,
    numElements: number = 20,
  ): Promise<any> {
    let data = await this.alpha.technical.macd(
      ticker, 
      interval, 
      seriesType,
      fastPeriod,
      slowPeriod, 
      signalPeriod,
      0, // fastmatype (default)
      0, // slowmatype (default)
      0  // signalmatype (default)
    );
    return markdown ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(data, 'MACD', numElements) : data;
  }

  async obvTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = 'daily',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 20,
  ): Promise<any> {
    return this.fetchTechnicalIndicator(
      ticker, 'obv', 'OBV', interval, timePeriod, seriesType, markdown, numElements
    );
  }

  async adxTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = 'daily',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 20,
  ): Promise<any> {
    return this.fetchTechnicalIndicator(
      ticker, 'adx', 'ADX', interval, timePeriod, seriesType, markdown, numElements
    );
  }

  async smaTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = 'daily',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 20,
  ): Promise<any> {
    return this.fetchTechnicalIndicator(
      ticker, 'sma', 'SMA', interval, timePeriod, seriesType, markdown, numElements
    );
  }

  
  async vwapTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = 'daily',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 20,
  ): Promise<any> {
    return this.fetchTechnicalIndicator(
      ticker, 'vwap', 'VWAP', interval, timePeriod, seriesType, markdown, numElements
    );
  }

  
  async emaTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = 'daily',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 20,
  ): Promise<any> {
    return this.fetchTechnicalIndicator(
      ticker, 'ema', 'EMA', interval, timePeriod, seriesType, markdown, numElements
    );
  }

  async bbandsTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = 'daily',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 20,
  ): Promise<any> {
    return this.fetchTechnicalIndicator(
      ticker, 'bbands', 'BBANDS', interval, timePeriod, seriesType, markdown, numElements
    );
  }

  async stochTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = 'daily',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 20,
  ): Promise<any> {
    return this.fetchTechnicalIndicator(
      ticker, 'stoch', 'STOCH', interval, timePeriod, seriesType, markdown, numElements
    );
  }

  async atrTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = 'daily',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 20,
  ): Promise<any> {
    // Access the technical endpoint with the specific indicator function
    let data = await this.alpha.technical.atr(ticker, interval, timePeriod, seriesType);
    return markdown ? 
      MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
        data, 'ATR', numElements
      ) : 
      data;
  }
  
      
  }
}