/**
 * Service for gathering individual stock data, including fundamentals, quotes,
 * intraday stats, technical indicators, options, earnings, and news.
 */

import { TradierApiClient } from '../../../serivces/api/TradierApiClient';
import { EODHDApiClient } from '../../../serivces/api/EODHDApiClient';
import { BenzingaService } from '../../../serivces/api/Benzinga.service';
import { ScoringService } from './ScoringService';
import { OptionsService } from './OptionsService';
import { PatternRecognitionService } from './PatternRecognitionService';
import { TimeSeriesProcessor } from './TimeSeriesProcessor';
import { getDateRanges, getMarketOpenTime } from '../../topDogV3/utils/dateUtils';
import {
  Stock,
  PriceData,
  VolumeData,
  TechnicalIndicators,
  OptionsData,
  EarningsData,
  NewsData,
  DayTradingMetrics
} from '../models/DayTradingAnalysis';

export class StockDataService {
  private tradierClient: TradierApiClient;
  private eodhdClient: EODHDApiClient;
  private benzingaClient: BenzingaService;
  private scoringService: ScoringService;
  private optionsService: OptionsService;
  private patternRecognitionService: PatternRecognitionService;
  private timeSeriesProcessor: TimeSeriesProcessor;

  constructor() {
    this.tradierClient = new TradierApiClient();
    this.eodhdClient = new EODHDApiClient();
    this.benzingaClient = new BenzingaService();
    this.scoringService = new ScoringService();
    this.optionsService = new OptionsService();
    this.patternRecognitionService = new PatternRecognitionService();
    this.timeSeriesProcessor = new TimeSeriesProcessor();
  }

  /**
   * Legacy method maintained for backward compatibility
   * Returns a Stock object with partial data
   */
  async getStockData(ticker: string, dateStr: string): Promise<Stock> {
    const today = new Date(dateStr);

    // Fundamentals
    const fundamentals = await this.eodhdClient.getFundamentals(ticker);

    // Current quote
    const quoteData = await this.tradierClient.getQuotes([ticker]);
    // Pre-market
    const preMarketData = await this.tradierClient.getPreMarketData(ticker, today);

    // Historical data (1 month)
    const { oneMonthAgo } = getDateRanges(dateStr);
    const historicalData = await this.eodhdClient.getHistoricalEOD(ticker, oneMonthAgo, dateStr);

    // Intraday data from Tradier
    const intradayData = await this.tradierClient.getIntradayData(ticker, today);

    // Technicals
    const rsiData = await this.eodhdClient.getRSI(ticker);
    const macdData = await this.eodhdClient.getMACD(ticker);
    const bollingerBands = await this.eodhdClient.getBollingerBands(ticker);
    const adxData = await this.eodhdClient.getADX(ticker);
    const atrData = await this.eodhdClient.getATR(ticker);

    // MAs
    const sma20Data = await this.eodhdClient.getMovingAverage(ticker, 'sma', 20);
    const sma50Data = await this.eodhdClient.getMovingAverage(ticker, 'sma', 50);

    // Options
    const expirations = await this.tradierClient.getOptionsExpirations(ticker);
    let optionsData = null;
    if (expirations.length > 0) {
      const nearestExpiration = expirations[0];
      optionsData = await this.tradierClient.getOptionsChains(ticker, nearestExpiration);
    }

    // Earnings
    const earningsData = await this.eodhdClient.getEarnings(null, null, ticker);
    const earningsTrends = await this.eodhdClient.getEarningsTrends(ticker);

    // News
    const newsData = await this.benzingaClient.getNewsBlocks(24 * 60, { tickers: ticker });

    // Pattern recognition
    const patternData = await this.patternRecognitionService.detectPatterns(historicalData);

    // Process partial data
    const priceData = this.processPriceData(
      quoteData.quotes.quote[0],
      preMarketData,
      historicalData,
      intradayData,
      sma20Data,
      sma50Data,
      today
    );
    const volumeData = this.processVolumeData(
      quoteData.quotes.quote[0],
      preMarketData,
      historicalData,
      today
    );
    const technicalIndicators = this.processTechnicalIndicators(
      rsiData,
      macdData,
      atrData,
      bollingerBands,
      adxData,
      patternData,
      historicalData
    );
    const processedOptionsData = optionsData
      ? this.optionsService.extractOptionsData(optionsData.options.option)
      : null;

    const processedEarningsData = this.processEarningsData(earningsData, earningsTrends);

    const processedNewsData = this.processNewsData(newsData);

    // Day trading metrics
    const dayTradingMetrics = this.calculateDayTradingMetrics(
      priceData,
      technicalIndicators,
      historicalData,
      volumeData
    );

    return {
      ticker,
      company_name: fundamentals.General.Name,
      sector: fundamentals.General.Sector || 'Unknown',
      industry: fundamentals.General.Industry || 'Unknown',
      market_cap: fundamentals.Highlights?.MarketCapitalization || 0,
      float: fundamentals.SharesStats?.SharesFloat || 0,
      avg_daily_volume: quoteData.quotes.quote[0].average_volume || 0,
      price_data: priceData,
      volume_data: volumeData,
      technical_indicators: technicalIndicators,
      options_data: processedOptionsData || {
        call_put_ratio: 0,
        unusual_activity: false,
        options_flow: { bullish_flow_percent: 0 }
      },
      earnings_data: processedEarningsData,
      news_data: processedNewsData,
      day_trading_metrics: dayTradingMetrics
    };
  }

  //
  // Legacy / partial processing methods
  //

  private processPriceData(
    quoteData: any,
    preMarketData: any,
    historicalData: any,
    intradayData: any,
    sma20Data: any,
    sma50Data: any,
    today: Date
  ): PriceData {
    const preMarketPrice = preMarketData.price;
    const previousClose = quoteData.prevclose;
    const currentPrice = quoteData.last;
    const dayRange = { low: quoteData.low, high: quoteData.high };
    const movingAverages = {
      ma_20: sma20Data[sma20Data.length - 1]?.sma || 0,
      ma_50: sma50Data[sma50Data.length - 1]?.sma || 0
    };

    // Opening range
    const marketOpen = getMarketOpenTime();
    const firstHourEnd = new Date(today);
    firstHourEnd.setHours(marketOpen.getHours() + 1);

    const firstHourData = intradayData.data.filter(
      (d: any) => new Date(d.time) >= marketOpen && new Date(d.time) <= firstHourEnd
    );

    let openingRangeHigh = 0;
    let openingRangeLow = Infinity;
    for (const data of firstHourData) {
      if (data.high && data.high > openingRangeHigh) openingRangeHigh = data.high;
      if (data.low && data.low < openingRangeLow) openingRangeLow = data.low;
    }
    if (openingRangeLow === Infinity) {
      openingRangeHigh = dayRange.high;
      openingRangeLow = dayRange.low;
    }
    const breakout = currentPrice > openingRangeHigh;

    return {
      previous_close: previousClose,
      pre_market: preMarketPrice || previousClose,
      current: currentPrice,
      day_range: dayRange,
      moving_averages: movingAverages,
      intraday: {
        opening_range: {
          high: openingRangeHigh,
          low: openingRangeLow,
          breakout
        },
        vwap: intradayData.vwap || 0
      }
    };
  }

  private processVolumeData(
    quoteData: any,
    preMarketData: any,
    historicalData: any,
    today: Date
  ): VolumeData {
    const preMarketVolume = preMarketData.volume || 0;
    const currentVolume = quoteData.volume || 0;

    // 10-day average
    let avg10DayVolume = 0;
    if (historicalData && historicalData.length >= 10) {
      const last10Days = historicalData.slice(0, 10);
      const totalVolume = last10Days.reduce((sum: number, day: any) => sum + day.volume, 0);
      avg10DayVolume = totalVolume / 10;
    } else {
      avg10DayVolume = quoteData.average_volume || 0;
    }

    const relativeVolume = avg10DayVolume > 0 ? currentVolume / avg10DayVolume : 0;

    return {
      pre_market: preMarketVolume,
      current: currentVolume,
      avg_10d: avg10DayVolume,
      relative_volume: parseFloat(relativeVolume.toFixed(2)),
      volume_distribution: {
        first_hour_percent: 0.25 // placeholder
      }
    };
  }

  private processTechnicalIndicators(
    rsiData: any,
    macdData: any,
    atrData: any,
    bollingerBands: any,
    adxData: any,
    patternData: any,
    historicalData?: any
  ): TechnicalIndicators {
    const rsi = rsiData[rsiData.length - 1]?.rsi || 50;
    const macd = {
      line: macdData[macdData.length - 1]?.macd || 0,
      signal: macdData[macdData.length - 1]?.signal || 0,
      histogram: macdData[macdData.length - 1]?.divergence || 0
    };
    const atr = atrData[atrData.length - 1]?.atr || 0;
    const lastBB = bollingerBands[bollingerBands.length - 1] || {
      lband: 0,
      mband: 0,
      uband: 0
    };
    const bollinger = {
      upper: lastBB.uband,
      middle: lastBB.mband,
      lower: lastBB.lband,
      width: lastBB.mband > 0 ? (lastBB.uband - lastBB.lband) / lastBB.mband : 0
    };
    const adx = adxData[adxData.length - 1]?.adx || 0;

    return {
      rsi_14: parseFloat(rsi.toFixed(2)),
      macd: {
        line: parseFloat(macd.line.toFixed(2)),
        signal: parseFloat(macd.signal.toFixed(2)),
        histogram: parseFloat(macd.histogram.toFixed(2))
      },
      atr_14: parseFloat(atr.toFixed(2)),
      bollinger_bands: {
        upper: parseFloat(bollinger.upper.toFixed(2)),
        middle: parseFloat(bollinger.middle.toFixed(2)),
        lower: parseFloat(bollinger.lower.toFixed(2)),
        width: parseFloat(bollinger.width.toFixed(2))
      },
      adx: parseFloat(adx.toFixed(2)),
      pattern_recognition: patternData || {
        bullish_patterns: [],
        bearish_patterns: [],
        consolidation_patterns: []
      }
    };
  }

  private processEarningsData(earningsData: any, earningsTrends: any): EarningsData {
    let recentReport = {
      date: 'N/A',
      eps: {
        actual: 0,
        estimate: 0,
        surprise_percent: 0
      }
    };
    if (earningsData && earningsData.earnings && earningsData.earnings.length > 0) {
      const sortedEarnings = [...earningsData.earnings].sort(
        (a, b) => new Date(b.report_date).getTime() - new Date(a.report_date).getTime()
      );
      const latest = sortedEarnings[0];
      recentReport = {
        date: latest.report_date,
        eps: {
          actual: latest.actual !== null ? latest.actual : 0,
          estimate: latest.estimate !== null ? latest.estimate : 0,
          surprise_percent: latest.percent !== null ? latest.percent : 0
        }
      };
    }
    return {
      recent_report: recentReport,
      next_report_date: null,
      trends: earningsTrends?.trends || []
    };
  }

  private processNewsData(newsData: any): NewsData {
    const recentArticles = newsData.map((item: any) => ({
      date: item.created,
      title: item.title,
      teaser: item.teaser,
      content: item.bodyMarkdown ? item.bodyMarkdown.substring(0, 200) + '...' : '',
      link: item.url,
      symbols: item.stocks ? item.stocks.map((s: any) => s.name) : [],
      tags: item.tags ? item.tags.map((t: any) => t.name) : []
    }));
    return {
      recent_articles: recentArticles,
      material_news_classification: recentArticles.length > 5 ? 'high_activity' : 'normal'
    };
  }

  private calculateDayTradingMetrics(
    priceData: PriceData,
    technicalIndicators: TechnicalIndicators,
    historicalData: any,
    volumeData: VolumeData
  ): DayTradingMetrics {
    const volatilityScore = this.scoringService.calculateVolatilityScore(
      technicalIndicators.atr_14,
      technicalIndicators.bollinger_bands,
      priceData.current,
      historicalData,
      volumeData.avg_10d,
      volumeData.current
    );
    const technicalSetupScore = this.scoringService.calculateTechnicalSetupScore(
      technicalIndicators.rsi_14,
      technicalIndicators.macd,
      technicalIndicators.adx,
      technicalIndicators.pattern_recognition,
      priceData.current,
      priceData.moving_averages
    );
    return {
      volatility_score: volatilityScore,
      technical_setup_score: technicalSetupScore
    };
  }
}