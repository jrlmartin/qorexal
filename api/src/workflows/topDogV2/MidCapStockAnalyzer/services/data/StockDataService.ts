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
import { BenzingaService } from '../api/BenzingaApiClient';
import { ScoringService } from '../algorithms/ScoringService';
import { OptionsService } from '../algorithms/OptionsService';
import { PatternRecognitionService } from '../algorithms/PatternRecognitionService';
import { addDays, format, subDays, subMonths, parse } from 'date-fns';

// Define a broader set of positive and negative regex patterns:
const positivePatterns = [
  /\brise\b/i,
  /\bup\b/i,
  /\bgain\b/i,
  /\bpositive\b/i,
  /\bgrowth\b/i,
  /\bprofit\b/i,
  /\bbullish\b/i,
  /\bsurge\b/i,
  /\bsoar\b/i,
  /\brecord high\b/i,
  /\brally\b/i,
  /\bbeat\b/i,
  /\bexceed\b/i,
  /\boutperform\b/i,
  /\bstrong\b/i,
  /\boptimistic\b/i,
  /\bimprove\b/i,
  /\bincrease\b/i,
  /\bupgrade\b/i,
];

const negativePatterns = [
  /\bdrop\b/i,
  /\bdown\b/i,
  /\bfall\b/i,
  /\bnegative\b/i,
  /\bloss\b/i,
  /\bbearish\b/i,
  /\bdecline\b/i,
  /\bplunge\b/i,
  /\btumble\b/i,
  /\bdisappoint\b/i,
  /\bmiss\b/i,
  /\bbankrupt\b/i,
  /\bshort\b/i,
  /\bweak\b/i,
  /\bunderperform\b/i,
  /\bpessimistic\b/i,
  /\bworsen\b/i,
  /\bdecrease\b/i,
  /\bdowngrade\b/i,
];

export class StockDataService {
  private tradierClient: TradierApiClient;
  private eodhdClient: EODHDApiClient;
  private benzingaClient: BenzingaService;
  private scoringService: ScoringService;
  private optionsService: OptionsService;
  private patternRecognitionService: PatternRecognitionService;

  constructor() {
    this.tradierClient = new TradierApiClient();
    this.eodhdClient = new EODHDApiClient();
    this.benzingaClient = new BenzingaService();
    this.scoringService = new ScoringService();
    this.optionsService = new OptionsService();
    this.patternRecognitionService = new PatternRecognitionService();
  }

  // Main method to gather all stock data
  async getStockData(ticker: string, dateStr: string): Promise<Stock> {
    // Parse date string to Date object
    const today = parse(dateStr, 'yyyy-MM-dd', new Date());

    // Calculate dates for API calls
    const yesterday = format(subDays(today, 1), 'yyyy-MM-dd');
    const tenDaysAgo = format(subDays(today, 10), 'yyyy-MM-dd');
    const monthAgo = format(subMonths(today, 1), 'yyyy-MM-dd');

    // Step 1: Get basic stock information and options expirations
    const [fundamentals, quote, expirationDates] = await Promise.all([
      this.eodhdClient.getFundamentals(ticker),
      this.tradierClient.getQuotes([ticker]),
      this.tradierClient.getOptionsExpirations(ticker),
    ]);

    // Find the closest expiration date to today
    let closestExpiration = dateStr; // Default to today if no dates available

    if (expirationDates.length > 0) {
      // Sort dates by proximity to today (dates after today preferred)
      const futureExpirations = expirationDates.filter(
        (d) => new Date(d) >= today,
      );

      if (futureExpirations.length > 0) {
        // Use the closest future date
        futureExpirations.sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        );
        closestExpiration = futureExpirations[0];
      } else {
        // If no future dates, use the most recent past date
        expirationDates.sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime(),
        );
        closestExpiration = expirationDates[0];
      }
    }

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
      this.tradierClient.getOptionsChains(ticker, closestExpiration), // Use the valid expiration date
      this.eodhdClient.getEarnings(ticker, dateStr),
      this.benzingaClient.getNews({ tickers: ticker, pageSize: 5 }),
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
      today, // Pass today parameter
    );

    // Process volume data
    const volumeData = this.processVolumeData(
      quoteData,
      preMarketData,
      historicalData,
      today, // Pass today parameter
    );

    // Process technical indicators
    const technicalIndicators = this.processTechnicalIndicators(
      rsiData,
      macdData,
      atrData,
      bollingerBands,
      adxData,
      patternData,
      historicalData, // Pass historical data to the function
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
    today: Date, // Add today parameter
  ): PriceData {
    // Use the pre-market price from our enhanced pre-market data
    const preMarketPrice = preMarketData?.price || quoteData.open;

    // Calculate opening range using intraday data (minute-by-minute)
    let openingHighLow = { high: quoteData.high || 0, low: quoteData.low || 0 };

    if (intradayData && intradayData.data && Array.isArray(intradayData.data)) {
      // Market opens at 9:30 AM ET, so we filter for the first hour (9:30 AM to 10:30 AM)
      const firstHourData = intradayData.data.filter((d: any) => {
        const dataDate = new Date(d.time || d.date);
        const hours = dataDate.getHours();
        const minutes = dataDate.getMinutes();

        // First trading hour: 9:30 AM to 10:30 AM
        return (hours === 9 && minutes >= 30) || (hours === 10 && minutes < 30);
      });

      if (firstHourData.length > 0) {
        openingHighLow = {
          high: Math.max(...firstHourData.map((d: any) => d.high || d.price)),
          low: Math.min(...firstHourData.map((d: any) => d.low || d.price)),
        };
      }
    }

    // Determine if there's a breakout from opening range
    const openingRangeBreakout = quoteData.last > openingHighLow.high;

    // Calculate VWAP using minute-by-minute intraday data
    let vwap = quoteData.last || 0;

    // Use the VWAP calculated from minute-by-minute data if available
    if (intradayData && intradayData.vwap !== null) {
      vwap = intradayData.vwap;
    } else if (historicalData?.history?.day) {
      // Fallback to the old method if intraday data is not available
      console.warn(
        `Falling back to approximate VWAP calculation for ${quoteData.symbol}`,
      );
      const todayData = historicalData.history.day.filter((d: any) => {
        const dataDate = new Date(d.date);
        return (
          dataDate.getDate() === today.getDate() &&
          dataDate.getMonth() === today.getMonth() &&
          dataDate.getFullYear() === today.getFullYear()
        );
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
      sma20Data?.length > 0 ? sma20Data[sma20Data.length - 1].sma : 0;

    const ma50 =
      sma50Data?.length > 0 ? sma50Data[sma50Data.length - 1].sma : 0;

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
    today: Date, // Add today parameter
  ): VolumeData {
    // Use the accumulated pre-market volume from our enhanced pre-market data
    const preMarketVolume = preMarketData?.volume || 0;

    // Calculate first hour volume percentage
    const dailyData = historicalData?.history?.day
      ? historicalData.history.day.filter((d: any) => {
          const dataDate = new Date(d.date);
          return (
            dataDate.getDate() === today.getDate() &&
            dataDate.getMonth() === today.getMonth() &&
            dataDate.getFullYear() === today.getFullYear()
          );
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
    historicalData?: any, // Add optional historicalData parameter
  ): TechnicalIndicators {
    // Extract latest values
    const rsi = rsiData?.length > 0 ? rsiData[rsiData.length - 1].rsi : 50;

    const macd =
      macdData?.length > 0
        ? {
            line: macdData[macdData.length - 1].macd,
            signal: macdData[macdData.length - 1].signal,
            histogram: macdData[macdData.length - 1].histogram,
          }
        : { line: 0, signal: 0, histogram: 0 };

    const atr = atrData?.length > 0 ? atrData[atrData.length - 1].atr : 0;

    const latestBollingerBands =
      bollingerBands?.length > 0
        ? {
            upper: bollingerBands[bollingerBands.length - 1].uband,
            middle: bollingerBands[bollingerBands.length - 1].mband,
            lower: bollingerBands[bollingerBands.length - 1].lband,
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

    const adx = adxData?.length > 0 ? adxData[adxData.length - 1].adx : 0;

    // 1. Process EODHD pattern recognition data Fix - 1111
    const patterns = []; // patternData || [];
    const eodhdBullishPatterns = patterns
      .filter(
        (p: any) =>
          p.strength >= 5 && ['bullish', 'both'].includes(p.trade_signal),
      )
      .map((p: any) => p.pattern);

    const eodhdBearishPatterns = patterns
      .filter(
        (p: any) =>
          p.strength >= 5 && ['bearish', 'both'].includes(p.trade_signal),
      )
      .map((p: any) => p.pattern);

    const eodhdConsolidationPatterns = patterns
      .filter((p: any) => ['consolidation', 'neutral'].includes(p.trade_signal))
      .map((p: any) => p.pattern);

    const eodhdPatterns = {
      bullish_patterns: eodhdBullishPatterns,
      bearish_patterns: eodhdBearishPatterns,
      consolidation_patterns: eodhdConsolidationPatterns,
    };

    // 2. Use custom pattern recognition if historical data is available
    let customPatterns = {
      bullish_patterns: [] as string[],
      bearish_patterns: [] as string[],
      consolidation_patterns: [] as string[],
    };

    if (historicalData?.history?.day) {
      // Format historical data for pattern recognition
      const formattedHistoricalData = historicalData.history.day.map(
        (day: any) => ({
          date: day.date,
          open: day.open,
          high: day.high,
          low: day.low,
          close: day.close,
          volume: day.volume,
        }),
      );

      // Run custom pattern detection
      customPatterns = this.patternRecognitionService.detectPatterns(
        formattedHistoricalData,
      );
    }

    // 3. Cross-validate patterns from both sources
    const finalPatterns = this.patternRecognitionService.crossValidatePatterns(
      eodhdPatterns,
      customPatterns,
    );

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
      pattern_recognition: finalPatterns,
    };
  }

  // Process options data
  private processOptionsData(optionsData: any[]): OptionsData {
    return this.optionsService.extractOptionsData(optionsData);
  }

  /**
   * Process earnings data with improved logic
   */
  private processEarningsData(earningsData: any): EarningsData {
    // Default empty structure
    const defaultEarnings = {
      recent_report: {
        date: '',
        eps: {
          actual: 0,
          estimate: 0,
          surprise_percent: 0,
        },
      },
    };

    // Extract earnings array if nested in an object
    earningsData = earningsData?.earnings || earningsData;

    // Handle non-array responses or empty arrays
    if (!Array.isArray(earningsData) || earningsData.length === 0) {
      return defaultEarnings;
    }

    // Sort earnings data by report date, most recent first
    const sortedEarnings = [...earningsData].sort((a, b) => {
      const dateA = new Date(a.report_date || '1970-01-01');
      const dateB = new Date(b.report_date || '1970-01-01');
      return dateB.getTime() - dateA.getTime();
    });

    // Find the most recent actual earnings report (with reported EPS)
    const mostRecentActual = sortedEarnings.find(
      (e) => e.actual !== null && e.actual !== undefined,
    );

    // Find the nearest upcoming earnings report if no actual report is found
    const nearestUpcoming = sortedEarnings.find((e) => {
      const reportDate = new Date(e.report_date || '1970-01-01');
      const now = new Date();
      return reportDate > now;
    });

    // Use the most relevant earnings data (actual if available, otherwise upcoming)
    const relevantEarnings =
      mostRecentActual || nearestUpcoming || sortedEarnings[0];

    if (!relevantEarnings) {
      return defaultEarnings;
    }

    // Calculate the surprise percent if it's not directly provided
    let surprisePercent = relevantEarnings.percent;
    if (
      surprisePercent === undefined &&
      relevantEarnings.estimate &&
      relevantEarnings.actual
    ) {
      surprisePercent =
        ((relevantEarnings.actual - relevantEarnings.estimate) /
          Math.abs(relevantEarnings.estimate)) *
        100;
    }

    // Format the earnings data
    return {
      recent_report: {
        date: relevantEarnings.report_date || '',
        eps: {
          actual: relevantEarnings.actual || 0,
          estimate: relevantEarnings.estimate || 0,
          surprise_percent: surprisePercent || 0,
        },
      },
    };
  }

  // Process news data
  private processNewsData(newsData: any): NewsData {
    // Process recent articles from Benzinga
    const recentArticles = Array.isArray(newsData) ? newsData : [];

    // Classify news sentiment
    let newsClassification = 'neutral';

    let positiveArticles = 0;
    let negativeArticles = 0;

    // Check each article for sentiment keywords using regex
    recentArticles.forEach((article) => {
      // Combine title + teaser and convert to lower case for analysis
      const combinedText = `${article.title} ${article.teaser}`.toLowerCase();

      // Determine if the article has positive or negative sentiment indicators
      const hasPositive = positivePatterns.some((pattern) =>
        pattern.test(combinedText),
      );
      const hasNegative = negativePatterns.some((pattern) =>
        pattern.test(combinedText),
      );

      if (hasPositive && !hasNegative) {
        positiveArticles++;
      } else if (hasNegative && !hasPositive) {
        negativeArticles++;
      }
    });

    // Determine overall classification
    if (positiveArticles > negativeArticles) {
      newsClassification = 'positive_catalyst';
    } else if (negativeArticles > positiveArticles) {
      newsClassification = 'negative_catalyst';
    } else if (positiveArticles > 0 && negativeArticles > 0) {
      newsClassification = 'mixed';
    }
 // @ts-ignore
    return {
      recent_articles: recentArticles.map((article) => ({
        date: article.created,
        title: article.title,
        teaser: article.teaser,
        content: article.bodyMarkdown ? article.bodyMarkdown.substring(0, 1200) : '',
        link: article.url,
        symbols: article.stocks ? article.stocks.map((s: any) => s.name) : [],
        tags: article.tags ? article.tags.map((t: any) => t.name) : [],
        // sentiment: {
        //   polarity: 0, // Benzinga doesn't provide sentiment scores
        //   neg: 0,
        //   neu: 0,
        //   pos: 0
        // }
      })),
    //  material_news_classification: newsClassification,
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
