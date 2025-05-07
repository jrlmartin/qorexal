// src/services/data/StockDataService.ts
import {
  Stock,
  PriceData,
  VolumeData,
  TechnicalIndicators,
  OptionsData,
  EarningsData,
  NewsData,
  DayTradingMetrics,
} from '../../models/Stock';
import { TradierApiClient } from '../api/TradierApiClient';
import { EODHDApiClient } from '../api/EODHDApiClient';
import { ScoringService } from '../algorithms/ScoringService';
import { OptionsService } from '../algorithms/OptionsService';
import { addDays, format, subDays, subMonths, parse } from 'date-fns';

export class StockDataService {
  private tradierClient: TradierApiClient;
  private eodhdClient: EODHDApiClient;
  private scoringService: ScoringService;
  private optionsService: OptionsService;

  constructor() {
    this.tradierClient = new TradierApiClient();
    this.eodhdClient = new EODHDApiClient();
    this.scoringService = new ScoringService();
    this.optionsService = new OptionsService();
  }

  // Main method to gather all stock data
  async getStockData(ticker: string, dateStr: string): Promise<Stock> {
    // Parse date string to Date object
    const today = parse(dateStr, 'yyyy-MM-dd', new Date());

    // Calculate dates for API calls
    const yesterday = format(subDays(today, 1), 'yyyy-MM-dd');
    const tenDaysAgo = format(subDays(today, 10), 'yyyy-MM-dd');
    const monthAgo = format(subMonths(today, 1), 'yyyy-MM-dd');
    const nextWeek = format(addDays(today, 7), 'yyyy-MM-dd');

    // Step 1: Get basic stock information
    const [fundamentals, quote] = await Promise.all([
      this.eodhdClient.getFundamentals(ticker),
      this.tradierClient.getQuotes([ticker]),
    ]);

    // Extract quote data from response
    const quoteData = quote.quotes?.quote || {};

    // Step 2: Get historical data and technical indicators
    const [
      historicalData,
      preMarketData,
      intradayData, // New: Get intraday minute-by-minute data for accurate VWAP
      rsiData,
      macdData,
      atrData,
      bollingerBands,
      adxData,
      patternData,
      sma20Data,
      sma50Data,
      optionsData,
      earningsData,
      newsData,
    ] = await Promise.all([
      this.tradierClient.getHistoricalData(ticker, tenDaysAgo, dateStr),
      this.tradierClient.getPreMarketData(ticker, today), // Passing the Date object
      this.tradierClient.getIntradayData(ticker, today), // New: Get intraday data for VWAP
      this.eodhdClient.getRSI(ticker),
      this.eodhdClient.getMACD(ticker),
      this.eodhdClient.getATR(ticker),
      this.eodhdClient.getBollingerBands(ticker),
      this.eodhdClient.getADX(ticker),
      this.eodhdClient.getPatternRecognition(ticker),
      this.eodhdClient.getMovingAverage(ticker, 'sma', 20),
      this.eodhdClient.getMovingAverage(ticker, 'sma', 50),
      this.tradierClient.getOptionsChains(ticker, nextWeek),
      this.eodhdClient.getEarnings(ticker, yesterday, dateStr),
      this.eodhdClient.getNews(ticker, 5, true),
    ]);

    // Step 3: Process the data into our standard format
    // Process price data
    const priceData = this.processPriceData(
      quoteData,
      preMarketData,
      historicalData,
      intradayData, // Pass the intradayData parameter
      sma20Data,
      sma50Data,
    );

    // Process volume data
    const volumeData = this.processVolumeData(
      quoteData,
      preMarketData,
      historicalData,
    );

    // Process technical indicators
    const technicalIndicators = this.processTechnicalIndicators(
      rsiData,
      macdData,
      atrData,
      bollingerBands,
      adxData,
      patternData,
    );

    // Process options data
    const optionsDataProcessed = this.processOptionsData(
      optionsData?.options?.option || [],
    );

    // Process earnings data
    const earningsDataProcessed = this.processEarningsData(earningsData);

    // Process news data
    const newsDataProcessed = this.processNewsData(newsData);

    // Calculate day trading metrics - pass volumeData as additional parameter
    const dayTradingMetrics = this.calculateDayTradingMetrics(
      priceData,
      technicalIndicators,
      historicalData,
      volumeData, // Add this parameter
    );

    // Construct full stock object
    return {
      ticker,
      company_name: fundamentals?.General?.Name || ticker,
      sector: fundamentals?.General?.Sector || 'Unknown',
      industry: fundamentals?.General?.Industry || 'Unknown',
      market_cap: fundamentals?.Highlights?.MarketCapitalization || 0,
      float: fundamentals?.SharesStats?.SharesFloat || 0,
      avg_daily_volume: quoteData.average_volume || 0,
      price_data: priceData,
      volume_data: volumeData,
      technical_indicators: technicalIndicators,
      options_data: optionsDataProcessed,
      earnings_data: earningsDataProcessed,
      news_data: newsDataProcessed,
      day_trading_metrics: dayTradingMetrics,
    };
  }

  // Process raw price data into standardized format
  private processPriceData(
    quoteData: any,
    preMarketData: any,
    historicalData: any,
    intradayData: any, // Add intradayData parameter
    sma20Data: any,
    sma50Data: any,
  ): PriceData {
    // Use the pre-market price from our enhanced pre-market data
    const preMarketPrice = preMarketData?.price || quoteData.open;

    // Calculate opening range
    const day = new Date();
    const firstHourData = historicalData?.history?.day
      ? historicalData.history.day.filter((d: any) => {
          const dataDate = new Date(d.date);
          return (
            dataDate.getDate() === day.getDate() &&
            dataDate.getHours() >= 9 &&
            dataDate.getHours() <= 10
          );
        })
      : [];

    const openingHighLow =
      firstHourData.length > 0
        ? {
            high: Math.max(...firstHourData.map((d: any) => d.high)),
            low: Math.min(...firstHourData.map((d: any) => d.low)),
          }
        : { high: quoteData.high || 0, low: quoteData.low || 0 };

    // Determine if there's a breakout from opening range
    const openingRangeBreakout = quoteData.last > openingHighLow.high;

    // Calculate VWAP using minute-by-minute intraday data
    let vwap = quoteData.last || 0;
    
    // Use the VWAP calculated from minute-by-minute data if available
    if (intradayData && intradayData.vwap !== null) {
      vwap = intradayData.vwap;
    } else if (historicalData?.history?.day) {
      // Fallback to the old method if intraday data is not available
      console.warn(`Falling back to approximate VWAP calculation for ${quoteData.symbol}`);
      const todayData = historicalData.history.day.filter((d: any) => {
        const dataDate = new Date(d.date);
        return dataDate.getDate() === day.getDate();
      });

      if (todayData.length > 0) {
        const priceVolumeSum = todayData.reduce((sum: number, d: any) => {
          return sum + ((d.high + d.low + d.close) / 3) * d.volume;
        }, 0);

        const volumeSum = todayData.reduce(
          (sum: number, d: any) => sum + d.volume,
          0,
        );

        vwap = volumeSum > 0 ? priceVolumeSum / volumeSum : quoteData.last;
      }
    }

    // Get latest SMA values
    const ma20 =
      sma20Data?.data?.length > 0
        ? sma20Data.data[sma20Data.data.length - 1].sma
        : 0;

    const ma50 =
      sma50Data?.data?.length > 0
        ? sma50Data.data[sma50Data.data.length - 1].sma
        : 0;

    return {
      previous_close: quoteData.prevclose || 0,
      pre_market: preMarketPrice || 0,
      current: quoteData.last || 0,
      day_range: {
        low: quoteData.low || 0,
        high: quoteData.high || 0,
      },
      moving_averages: {
        ma_20: ma20,
        ma_50: ma50,
      },
      intraday: {
        opening_range: {
          high: openingHighLow.high,
          low: openingHighLow.low,
          breakout: openingRangeBreakout,
        },
        vwap: parseFloat(vwap.toFixed(2)),
      },
    };
  }

  // Process volume data
  private processVolumeData(
    quoteData: any,
    preMarketData: any,
    historicalData: any,
  ): VolumeData {
    // Use the accumulated pre-market volume from our enhanced pre-market data
    const preMarketVolume = preMarketData?.volume || 0;

    // Calculate first hour volume percentage
    const day = new Date();
    const dailyData = historicalData?.history?.day
      ? historicalData.history.day.filter((d: any) => {
          const dataDate = new Date(d.date);
          return dataDate.getDate() === day.getDate();
        })
      : [];

    const firstHourData = dailyData.filter((d: any) => {
      const dataDate = new Date(d.date);
      return dataDate.getHours() >= 9 && dataDate.getHours() <= 10;
    });

    const firstHourVolume = firstHourData.reduce(
      (sum: number, d: any) => sum + (d.volume || 0),
      0,
    );
    const totalVolume = quoteData.volume || 0;

    const firstHourPercent =
      totalVolume > 0 ? Math.round((firstHourVolume / totalVolume) * 100) : 0;

    // Calculate average 10-day volume
    const avg10DayVolume = quoteData.average_volume || 0;

    // Calculate relative volume
    const relativeVolume =
      avg10DayVolume > 0
        ? parseFloat((totalVolume / avg10DayVolume).toFixed(1))
        : 1.0;

    return {
      pre_market: preMarketVolume,
      current: totalVolume,
      avg_10d: avg10DayVolume,
      relative_volume: relativeVolume,
      volume_distribution: {
        first_hour_percent: firstHourPercent,
      },
    };
  }

  // Process technical indicators
  private processTechnicalIndicators(
    rsiData: any,
    macdData: any,
    atrData: any,
    bollingerBands: any,
    adxData: any,
    patternData: any,
  ): TechnicalIndicators {
    // Extract latest values
    const rsi =
      rsiData?.data?.length > 0
        ? rsiData.data[rsiData.data.length - 1].rsi
        : 50;

    const macd =
      macdData?.data?.length > 0
        ? {
            line: macdData.data[macdData.data.length - 1].macd,
            signal: macdData.data[macdData.data.length - 1].signal,
            histogram: macdData.data[macdData.data.length - 1].histogram,
          }
        : { line: 0, signal: 0, histogram: 0 };

    const atr =
      atrData?.data?.length > 0 ? atrData.data[atrData.data.length - 1].atr : 0;

    const latestBollingerBands =
      bollingerBands?.data?.length > 0
        ? {
            upper:
              bollingerBands.data[bollingerBands.data.length - 1].upper_band,
            middle:
              bollingerBands.data[bollingerBands.data.length - 1].middle_band,
            lower:
              bollingerBands.data[bollingerBands.data.length - 1].lower_band,
          }
        : { upper: 0, middle: 0, lower: 0 };

    // Calculate Bollinger Band width
    const bbWidth =
      latestBollingerBands.middle > 0
        ? parseFloat(
            (
              (latestBollingerBands.upper - latestBollingerBands.lower) /
              latestBollingerBands.middle
            ).toFixed(2),
          )
        : 0;

    const adx =
      adxData?.data?.length > 0 ? adxData.data[adxData.data.length - 1].adx : 0;

    // Process pattern recognition data
    const patterns = patternData?.data || [];
    const bullishPatterns = patterns
      .filter(
        (p: any) =>
          p.strength >= 5 && ['bullish', 'both'].includes(p.trade_signal),
      )
      .map((p: any) => p.pattern);

    const bearishPatterns = patterns
      .filter(
        (p: any) =>
          p.strength >= 5 && ['bearish', 'both'].includes(p.trade_signal),
      )
      .map((p: any) => p.pattern);

    const consolidationPatterns = patterns
      .filter((p: any) => ['consolidation', 'neutral'].includes(p.trade_signal))
      .map((p: any) => p.pattern);

    return {
      rsi_14: Math.round(rsi),
      macd,
      atr_14: parseFloat(atr.toFixed(2)),
      bollinger_bands: {
        upper: parseFloat(latestBollingerBands.upper.toFixed(2)),
        middle: parseFloat(latestBollingerBands.middle.toFixed(2)),
        lower: parseFloat(latestBollingerBands.lower.toFixed(2)),
        width: bbWidth,
      },
      adx: parseFloat(adx.toFixed(1)),
      pattern_recognition: {
        bullish_patterns: bullishPatterns,
        bearish_patterns: bearishPatterns,
        consolidation_patterns: consolidationPatterns,
      },
    };
  }

  // Process options data
  private processOptionsData(optionsData: any[]): OptionsData {
    return this.optionsService.extractOptionsData(optionsData);
  }

  // Process earnings data
  private processEarningsData(earningsData: any): EarningsData {
    const latestEarnings =
      Array.isArray(earningsData) && earningsData.length > 0
        ? earningsData[0]
        : null;

    if (!latestEarnings) {
      return {
        recent_report: {
          date: '',
          eps: {
            actual: 0,
            estimate: 0,
            surprise_percent: 0,
          },
        },
      };
    }

    return {
      recent_report: {
        date: latestEarnings.report_date || '',
        eps: {
          actual: latestEarnings.reported_eps || 0,
          estimate: latestEarnings.expected_eps || 0,
          surprise_percent: latestEarnings.surprise_pct || 0,
        },
      },
    };
  }

  // Process news data
  private processNewsData(newsData: any): NewsData {
    // Process recent articles
    const recentArticles = Array.isArray(newsData) ? newsData : [];

    // Classify news sentiment
    let newsClassification = 'neutral';

    // Check for positive news
    const hasPositiveNews = recentArticles.some(
      (article) => article.sentiment && article.sentiment.score > 0.6,
    );

    // Check for negative news
    const hasNegativeNews = recentArticles.some(
      (article) => article.sentiment && article.sentiment.score < 0.4,
    );

    // Determine overall classification
    if (hasPositiveNews && !hasNegativeNews) {
      newsClassification = 'positive_catalyst';
    } else if (hasNegativeNews && !hasPositiveNews) {
      newsClassification = 'negative_catalyst';
    } else if (hasPositiveNews && hasNegativeNews) {
      newsClassification = 'mixed';
    }

    return {
      recent_articles: recentArticles,
      material_news_classification: newsClassification,
    };
  }

  // The method signature needs to be updated to include volumeData
  private calculateDayTradingMetrics(
    priceData: PriceData,
    technicalIndicators: TechnicalIndicators,
    historicalData: any,
    volumeData: VolumeData, // Add volumeData parameter
  ): DayTradingMetrics {
    // Extract price history for volatility calculation
    const priceHistory = historicalData?.history?.day || [];

    // Convert to format needed for scoring algorithm
    const histPrices = priceHistory.map((d: any) => ({
      high: d.high,
      low: d.low,
    }));

    // Calculate volatility score - now using volumeData directly
    const volatilityScore = this.scoringService.calculateVolatilityScore(
      technicalIndicators.atr_14,
      technicalIndicators.bollinger_bands,
      priceData.current,
      histPrices,
      volumeData.avg_10d, // Use volumeData instead of priceData.volume_data
      volumeData.current, // Use volumeData instead of priceData.volume_data
    );

    // Calculate technical setup score
    const technicalSetupScore =
      this.scoringService.calculateTechnicalSetupScore(
        technicalIndicators.rsi_14,
        technicalIndicators.macd,
        technicalIndicators.adx,
        technicalIndicators.pattern_recognition,
        priceData.current,
        priceData.moving_averages,
      );

    return {
      volatility_score: volatilityScore,
      technical_setup_score: technicalSetupScore,
    };
  }
}