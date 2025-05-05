import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MarketCapTierEnum,
  StockCapTierEntity,
} from '../entities/StockCapTier.entity';
import * as alphaVantage from 'alphavantage';
import axios from 'axios';
import { BenzingaService } from './market-api/benzinga';
import { MarkdownFormatter } from '../helpers/markdown-formatter.helper';
import {
  TimeIntervalType,
  SeriesType,
  OutputSizeType,
} from '../types/stock-data.types';

const ALPHA_VANTAGE_API_KEY = 'KSRQH6VLLQSZ6UGU';

// Type alias for the return type of the alphavantage function
type AlphaVantageClient = ReturnType<typeof alphaVantage>;

/**
 * Service for handling stock-related operations, including market cap tier classification
 * and stock data retrieval from external APIs
 */
@Injectable()
export class CompanyDatasetService {
  private readonly alpha: AlphaVantageClient;

  constructor(
    @InjectRepository(StockCapTierEntity)
    private readonly stockCapTierRepository: Repository<StockCapTierEntity>,
    private readonly benzinga: BenzingaService,
  ) {
    // Initialize Alpha Vantage API client with API key
    this.alpha = alphaVantage({ key: ALPHA_VANTAGE_API_KEY });
  }

  /**
   * Retrieves company overview data for a given ticker and converts it to markdown format
   * @param ticker The stock symbol to retrieve data for
   * @param markdown Whether to return the data in markdown format (defaults to true)
   * @returns Promise resolving to a markdown string of the company overview
   */
  async companyOverview(
    ticker: string,
    markdown: boolean = true,
  ): Promise<string> {
    const overview = await this.alpha.fundamental.company_overview(ticker);
    return markdown
      ? MarkdownFormatter.convertCompanyOverviewToMarkdown(overview)
      : overview;
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
    return markdown
      ? MarkdownFormatter.convertIntradayTimeSeriesToMarkdown(data)
      : data;
  }

  /**
   * Retrieves extended intraday time series data for a given ticker
   * @param ticker The stock symbol to retrieve data for
   * @param interval The time interval between data points
   * @param adjusted Whether to return adjusted data (defaults to true)
   * @returns Promise resolving to the intraday time series data
   * 
   * extended_hours if we want to see the stock right at opening bell
   */
  async intradayTimeSeries(
    ticker: string,
    interval: TimeIntervalType = '5min',
    outputsize: OutputSizeType = 'compact', // compact returns only the latest 100 data points in the intraday time series
    markdown: boolean = true,
  ): Promise<any> {
    try {
        // Missing from Alpha Vantage sdk
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'TIME_SERIES_INTRADAY',
            symbol: ticker,
            interval: interval,
            apikey: ALPHA_VANTAGE_API_KEY,
          },
        });
  
        const data = response.data;
  
        return markdown
        ? MarkdownFormatter.convertIntradayTimeSeriesToMarkdown(data)
        : data;
      } catch (error) {
        throw new Error(`Failed to fetch VWAP data: ${error.message}`);
      }
  }

  // Technical Indicators

  /**
   * RSI - #1 Priority
   * RSI is one of the quickest ways to judge if a stock is overbought or oversold in the short term,
   * which is critical right after a news catalyst triggers rapid price moves.
   */
  async rsiTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = '5min',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 100,
  ): Promise<any> {
    let data = await this.alpha.technical.rsi(
      ticker,
      interval,
      timePeriod,
      seriesType,
    );
    return markdown
      ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
          data,
          'RSI',
          numElements,
        )
      : data;
  }
  /**
   *
   * MACD - #2 Priority
   * MACD helps confirm emerging momentum shifts and trend changes—key to knowing if a news-driven
   * price move has potential follow-through or is a short-lived pop.
   */
  async macdTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = '5min',
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9,
    numElements: number = 100,
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
      0, // signalmatype (default)
    );
    return markdown
      ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
          data,
          'MACD',
          numElements,
        )
      : data;
  }

  /**
   * OBV - #3 Priority
   * OBV confirms whether volume is aligning with the price move (i.e., are buyers or sellers pushing the move?).
   *  A price rally or drop with strong supporting volume after news often signals more momentum.
   */
  async obvTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = '5min',
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 100,
  ): Promise<any> {
    let data = await this.alpha.technical.obv(
      ticker,
      interval,
      null,
      seriesType,
    );
    return markdown
      ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
          data,
          'OBV',
          numElements,
        )
      : data;
  }

  /**
   * EMA - #4 Priority
   */
  async emaTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = '5min',
    timePeriod: number = 20, // Common default
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 100,
  ): Promise<any> {
    let data = await this.alpha.technical.ema(
      ticker,
      interval,
      timePeriod,
      seriesType,
    );
    return markdown
      ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
          data,
          'EMA',
          numElements,
        )
      : data;
  }

  /**
   * BBANDS - #5 Priority
   */
  async bbandsTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = '5min',
    timePeriod: number = 20, // Common BBANDS default
    seriesType: SeriesType = 'close',
    nbdevup: number = 2, // Standard dev up
    nbdevdn: number = 2, // Standard dev down
    markdown: boolean = true,
    numElements: number = 100,
  ): Promise<any> {
    let data = await this.alpha.technical.bbands(
      ticker,
      interval,
      timePeriod,
      seriesType,
      nbdevup,
      nbdevdn,
      0, // matype=0 => SMA; default for Bollinger
    );
    // Fix the "EMA" label to "BBANDS" in markdown output:
    return markdown
      ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
          data,
          'BBANDS',
          numElements,
        )
      : data;
  }

  /**
   * STOCH - #6 Priority
   */
  async stochTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = '5min',
    fastkperiod: number = 14,
    slowkperiod: number = 3,
    slowdperiod: number = 3,
    slowkmatype: number = 0,
    slowdmatype: number = 0,
    markdown: boolean = true,
    numElements: number = 100,
  ): Promise<any> {
    let data = await this.alpha.technical.stoch(
      ticker,
      interval,
      fastkperiod,
      slowkperiod,
      slowdperiod,
      slowkmatype,
      slowdmatype,
    );
    return markdown
      ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
          data,
          'STOCH',
          numElements,
        )
      : data;
  }

  /**
   * ADX - #7 Priority
   * ADX measures the strength of a trend but doesn't tell you if it's bullish or bearish—just how strong it is.
   * For momentum trading, a strong ADX reading suggests a sustained price move rather than a fleeting spike.
   */
  async adxTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = '5min',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 100,
  ): Promise<any> {
    let data = await this.alpha.technical.adx(
      ticker,
      interval,
      timePeriod,
      seriesType,
    );
    return markdown
      ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
          data,
          'ADX',
          numElements,
        )
      : data;
  }

  /**
   * ATR - #8 Priority
   */
  async atrTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = '5min',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 100,
  ): Promise<any> {
    // Access the technical endpoint with the specific indicator function
    let data = await this.alpha.technical.atr(
      ticker,
      interval,
      timePeriod,
      seriesType,
    );
    return markdown
      ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
          data,
          'ATR',
          numElements,
        )
      : data;
  }

  /**
   * VWAP - #9 Priority
   * VVWAP is more commonly used intraday to gauge whether the current price is above or below the day's "true"
   * average price (weighted by volume). Particularly helpful if you intend to trade on an intraday basis right after a news event.
   */
  async vwapTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = '5min',
    markdown: boolean = true,
    numElements: number = 100,
  ): Promise<any> {
    try {
      // Missing from Alpha Vantage sdk
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'VWAP',
          symbol: ticker,
          interval: interval,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });

      const data = response.data;

      return markdown
        ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
            data,
            'VWAP',
            numElements,
          )
        : data;
    } catch (error) {
      throw new Error(`Failed to fetch VWAP data: ${error.message}`);
    }
  }

  /**
   * VWAP - #10 Priority
   */
  async smaTechnicalIndicator(
    ticker: string,
    interval: TimeIntervalType = '5min',
    timePeriod: number = 14,
    seriesType: SeriesType = 'close',
    markdown: boolean = true,
    numElements: number = 100,
  ): Promise<any> {
    let data = await this.alpha.technical.sma(
      ticker,
      interval,
      timePeriod,
      seriesType,
    );
    return markdown
      ? MarkdownFormatter.convertTechnicalIndicatorToMarkdown(
          data,
          'SMA',
          numElements,
        )
      : data;
  }

  async singleStockProfile(ticker: string): Promise<any> {
    const data = await this.alpha.fundamental.company_overview(ticker);
    return data;
  }

  async longProfile(ticker: string): Promise<any> {
    const companyOverview = await this.companyOverview(ticker, true);
    
    // Daily adjusted data
    const dailyData = await this.dailyAdjustedTimeSeries(ticker, 'compact', true);
    
    // Intraday data
    const intradayData = await this.intradayTimeSeries(ticker, '5min', 'compact', true);
    
    // Technical indicators
    const rsi = await this.rsiTechnicalIndicator(ticker, '5min', 14, 'close', true);
    const macd = await this.macdTechnicalIndicator(ticker, '5min', 'close', true);
    const obv = await this.obvTechnicalIndicator(ticker, '5min', 'close', true);
    const ema = await this.emaTechnicalIndicator(ticker, '5min', 20, 'close', true);
    const bbands = await this.bbandsTechnicalIndicator(ticker, '5min', 20, 'close', 2, 2, true);
    const stoch = await this.stochTechnicalIndicator(ticker, '5min', 14, 3, 3, 0, 0, true);
    const adx = await this.adxTechnicalIndicator(ticker, '5min', 14, 'close', true);
    const atr = await this.atrTechnicalIndicator(ticker, '5min', 14, 'close', true);
    const sma = await this.smaTechnicalIndicator(ticker, '5min', 14, 'close', true);
    const vwap = await this.vwapTechnicalIndicator(ticker, '5min', true);

    // Combine all data into a structured markdown document
    const markdownReport = `
# ${ticker} Comprehensive Stock Profile

## Company Overview
${companyOverview}

## Stock Price Data

### Daily Adjusted Time Series
${dailyData}

### Intraday Time Series (5-min)
${intradayData}

## Technical Indicators

### RSI (Relative Strength Index)
${rsi}

### MACD (Moving Average Convergence Divergence)
${macd}

### OBV (On-Balance Volume)
${obv}

### EMA (Exponential Moving Average)
${ema}

### Bollinger Bands
${bbands}

### Stochastic Oscillator
${stoch}

### ADX (Average Directional Index)
${adx}

### ATR (Average True Range)
${atr}

### SMA (Simple Moving Average)
${sma}

### VWAP (Volume Weighted Average Price)
${vwap}
`;

    return markdownReport;
  }
}
