// src/services/data/StockDataService.ts
import { Stock, PriceData, VolumeData, TechnicalIndicators, OptionsData, EarningsData, NewsData, DayTradingMetrics } from '../../models/Stock';
import { FMPApiClient } from '../api/FMPApiClient';
import { TradierApiClient } from '../api/TradierApiClient';
import { EODHDApiClient } from '../api/EODHDApiClient';
import { addDays, format, subDays, subMonths } from 'date-fns';
import { ScoringService } from '../algorithms/ScoringService';
import { OptionsService } from '../algorithms/OptionsService';

export class StockDataService {
  private fmpClient: FMPApiClient;
  private tradierClient: TradierApiClient;
  private eodhdClient: EODHDApiClient;
  private scoringService: ScoringService;
  private optionsService: OptionsService;
  
  constructor() {
    this.fmpClient = new FMPApiClient();
    this.tradierClient = new TradierApiClient();
    this.eodhdClient = new EODHDApiClient();
    this.scoringService = new ScoringService();
    this.optionsService = new OptionsService();
  }
  
  // Main method to gather all stock data
  async getStockData(ticker: string, date: string): Promise<Stock> {
    // Current date info for API calls
    const today = new Date(date);
    const yesterday = format(subDays(today, 1), 'yyyy-MM-dd');
    const tenDaysAgo = format(subDays(today, 10), 'yyyy-MM-dd');
    const monthAgo = format(subMonths(today, 1), 'yyyy-MM-dd');
    const nextWeek = format(addDays(today, 7), 'yyyy-MM-dd');
    
    // Step 1: Get basic stock information and market data
    const [
      companyProfile,       // FMP: Company profile
      tradierQuote,         // Tradier: Current quote (includes more detailed data)
      preMarketData,        // Tradier: Pre-market data
      timeSalesData,        // Tradier: Intraday data for VWAP, opening range
      historicalDaily,      // Tradier: Historical daily data
      financialMetrics      // FMP: Key financial metrics
    ] = await Promise.all([
      this.fmpClient.getCompanyProfile(ticker),
      this.tradierClient.getQuotes([ticker]),
      this.tradierClient.getPreMarketData(ticker, date),
      this.tradierClient.getTimeSales(ticker, date),
      this.tradierClient.getHistoricalData(ticker, tenDaysAgo, date),
      this.fmpClient.getKeyMetrics(ticker)
    ]);
    
    // Step 2: Get technical indicators
    const [
      rsiData,              // EODHD: RSI indicator
      macdData,             // EODHD: MACD indicator
      atrData,              // EODHD: ATR indicator
      bollingerBands,       // EODHD: Bollinger Bands indicator
      adxData,              // EODHD: ADX indicator
      patternData,          // EODHD: Pattern recognition
      ma20Data,             // EODHD: 20-day SMA
      ma50Data,             // EODHD: 50-day SMA
      optionsData,          // Tradier: Options chains
      earningsData,         // EODHD: Earnings data
      newsData              // EODHD: Recent news
    ] = await Promise.all([
      this.eodhdClient.getRSI(ticker),
      this.eodhdClient.getMACD(ticker),
      this.eodhdClient.getATR(ticker),
      this.eodhdClient.getBollingerBands(ticker),
      this.eodhdClient.getADX(ticker),
      this.eodhdClient.getPatternRecognition(ticker),
      this.eodhdClient.getMovingAverage(ticker, 'sma', 20),
      this.eodhdClient.getMovingAverage(ticker, 'sma', 50),
      this.tradierClient.getOptionsChains(ticker, nextWeek),
      this.eodhdClient.getEarnings(ticker, monthAgo, date),
      this.eodhdClient.getNews(ticker, 5, true)
    ]);
    
    // Step 3: Process the data into our standard format
    // Process price data including pre-market
    const priceData = this.processPriceData(
      tradierQuote, 
      preMarketData, 
      timeSalesData,
      ma20Data,
      ma50Data
    );
    
    // Process volume data
    const volumeData = this.processVolumeData(
      tradierQuote, 
      preMarketData, 
      timeSalesData
    );
    
    // Process technical indicators
    const technicalIndicators = this.processTechnicalIndicators(
      rsiData, 
      macdData, 
      atrData, 
      bollingerBands, 
      adxData, 
      patternData
    );
    
    // Process options data
    const optionsDataProcessed = this.processOptionsData(optionsData);
    
    // Process earnings data
    const earningsDataProcessed = this.processEarningsData(earningsData);
    
    // Process news data
    const newsDataProcessed = this.processNewsData(newsData);
    
    // Calculate day trading metrics
    const dayTradingMetrics = this.calculateDayTradingMetrics(
      priceData, 
      volumeData,
      technicalIndicators, 
      historicalDaily
    );
    
    // Get quote data for parsing
    const quoteData = tradierQuote?.quotes?.quote || {};
    
    // Construct full stock object
    return {
      ticker,
      company_name: companyProfile?.companyName || ticker,
      sector: companyProfile?.sector || 'Unknown',
      industry: companyProfile?.industry || 'Unknown',
      market_cap: companyProfile?.mktCap || 0,
      float: financialMetrics?.length > 0 ? financialMetrics[0].sharesMln * 1000000 : 0,
      avg_daily_volume: quoteData.average_volume || 0,
      price_data: priceData,
      volume_data: volumeData,
      technical_indicators: technicalIndicators,
      options_data: optionsDataProcessed,
      earnings_data: earningsDataProcessed,
      news_data: newsDataProcessed,
      day_trading_metrics: dayTradingMetrics
    };
  }
  
  // Process price data including pre-market and intraday metrics
  private processPriceData(
    quoteData: any,
    preMarketData: any,
    timeSalesData: any,
    ma20Data: any,
    ma50Data: any
  ): PriceData {
    // Extract quote info
    const quote = quoteData?.quotes?.quote || {};
    
    // Extract pre-market data
    let preMarketPrice = quote.open; // Default to regular open if pre-market unavailable
    
    if (preMarketData?.series?.data && preMarketData.series.data.length > 0) {
      // Get the last pre-market data point
      const lastPreMarketData = preMarketData.series.data[preMarketData.series.data.length - 1];
      preMarketPrice = lastPreMarketData.price;
    }
    
    // Calculate opening range (first hour)
    let openingHigh = quote.high || 0;
    let openingLow = quote.low || 0;
    let openingRangeBreakout = false;
    
    if (timeSalesData?.series?.data && timeSalesData.series.data.length > 0) {
      // Filter for first hour (9:30 AM to 10:30 AM)
      const marketOpen = new Date(`${timeSalesData.series.data[0].time}`);
      const firstHourEnd = new Date(marketOpen);
      firstHourEnd.setHours(firstHourEnd.getHours() + 1);
      
      const firstHourData = timeSalesData.series.data.filter((d: any) => {
        const timestamp = new Date(d.time);
        return timestamp >= marketOpen && timestamp <= firstHourEnd;
      });
      
      if (firstHourData.length > 0) {
        // Find high and low of opening range
        openingHigh = Math.max(...firstHourData.map((d: any) => d.price));
        openingLow = Math.min(...firstHourData.map((d: any) => d.price));
        
        // Check if current price has broken out of the opening range
        const currentPrice = quote.last || 0;
        openingRangeBreakout = currentPrice > openingHigh;
      }
    }
    
    // Calculate VWAP
    let vwap = quote.last || 0;
    
    if (timeSalesData?.series?.data && timeSalesData.series.data.length > 0) {
      let sumPriceVolume = 0;
      let sumVolume = 0;
      
      timeSalesData.series.data.forEach((d: any) => {
        sumPriceVolume += d.price * d.volume;
        sumVolume += d.volume;
      });
      
      if (sumVolume > 0) {
        vwap = sumPriceVolume / sumVolume;
      }
    }
    
    // Extract moving averages
    const ma20 = ma20Data?.data?.length > 0 
      ? ma20Data.data[ma20Data.data.length - 1].sma
      : 0;
      
    const ma50 = ma50Data?.data?.length > 0 
      ? ma50Data.data[ma50Data.data.length - 1].sma
      : 0;
    
    return {
      previous_close: quote.prevclose || 0,
      pre_market: preMarketPrice,
      current: quote.last || 0,
      day_range: {
        low: quote.low || 0,
        high: quote.high || 0
      },
      moving_averages: {
        ma_20: ma20,
        ma_50: ma50
      },
      intraday: {
        opening_range: {
          high: openingHigh,
          low: openingLow,
          breakout: openingRangeBreakout
        },
        vwap: parseFloat(vwap.toFixed(2))
      }
    };
  }
  
  // Process volume data
  private processVolumeData(
    quoteData: any,
    preMarketData: any,
    timeSalesData: any
  ): VolumeData {
    // Extract quote info
    const quote = quoteData?.quotes?.quote || {};
    
    // Calculate pre-market volume
    let preMarketVolume = 0;
    
    if (preMarketData?.series?.data && preMarketData.series.data.length > 0) {
      preMarketVolume = preMarketData.series.data.reduce((sum: number, bar: any) => sum + bar.volume, 0);
    }
    
    // Calculate first hour volume percentage
    let firstHourVolume = 0;
    let firstHourPercent = 0;
    
    if (timeSalesData?.series?.data && timeSalesData.series.data.length > 0) {
      const marketOpen = new Date(`${timeSalesData.series.data[0].time}`);
      const firstHourEnd = new Date(marketOpen);
      firstHourEnd.setHours(firstHourEnd.getHours() + 1);
      
      const firstHourData = timeSalesData.series.data.filter((d: any) => {
        const timestamp = new Date(d.time);
        return timestamp >= marketOpen && timestamp <= firstHourEnd;
      });
      
      if (firstHourData.length > 0) {
        firstHourVolume = firstHourData.reduce((sum: number, bar: any) => sum + bar.volume, 0);
        
        const totalVolume = quote.volume || timeSalesData.series.data.reduce(
          (sum: number, bar: any) => sum + bar.volume, 0
        );
        
        if (totalVolume > 0) {
          firstHourPercent = Math.round((firstHourVolume / totalVolume) * 100);
        }
      }
    }
    
    // Calculate relative volume
    const avgVolume = quote.average_volume || 0;
    const currentVolume = quote.volume || 0;
    const relativeVolume = avgVolume > 0 ? parseFloat((currentVolume / avgVolume).toFixed(1)) : 1.0;
    
    return {
      pre_market: preMarketVolume,
      current: currentVolume,
      avg_10d: avgVolume,
      relative_volume: relativeVolume,
      volume_distribution: {
        first_hour_percent: firstHourPercent
      }
    };
  }
  
  // Process technical indicators
  private processTechnicalIndicators(
    rsiData: any,
    macdData: any,
    atrData: any,
    bollingerBands: any,
    adxData: any,
    patternData: any
  ): TechnicalIndicators {
    // Extract latest RSI value
    const rsi = rsiData?.data?.length > 0 
      ? rsiData.data[rsiData.data.length - 1].rsi
      : 50;
    
    // Extract latest MACD values
    const macd = macdData?.data?.length > 0 
      ? {
          line: macdData.data[macdData.data.length - 1].macd,
          signal: macdData.data[macdData.data.length - 1].signal,
          histogram: macdData.data[macdData.data.length - 1].histogram
        }
      : { line: 0, signal: 0, histogram: 0 };
    
    // Extract latest ATR value
    const atr = atrData?.data?.length > 0 
      ? atrData.data[atrData.data.length - 1].atr
      : 0;
    
    // Extract latest Bollinger Bands values
    const bbands = bollingerBands?.data?.length > 0 
      ? {
          upper: bollingerBands.data[bollingerBands.data.length - 1].upper_band,
          middle: bollingerBands.data[bollingerBands.data.length - 1].middle_band,
          lower: bollingerBands.data[bollingerBands.data.length - 1].lower_band
        }
      : { upper: 0, middle: 0, lower: 0 };
    
    // Calculate Bollinger Bands width
    const bbWidth = bbands.middle > 0 
      ? parseFloat(((bbands.upper - bbands.lower) / bbands.middle).toFixed(2))
      : 0;
    
    // Extract latest ADX value
    const adx = adxData?.data?.length > 0 
      ? adxData.data[adxData.data.length - 1].adx
      : 0;
    
    // Process pattern recognition data
    const patterns = patternData?.data || [];
    
    // Group patterns by type
    const bullishPatterns = [];
    const bearishPatterns = [];
    const consolidationPatterns = [];
    
    patterns.forEach((pattern: any) => {
      if (pattern.direction === 'bullish') {
        bullishPatterns.push(pattern.pattern);
      } else if (pattern.direction === 'bearish') {
        bearishPatterns.push(pattern.pattern);
      } else {
        consolidationPatterns.push(pattern.pattern);
      }
    });
    
    return {
      rsi_14: Math.round(rsi),
      macd,
      atr_14: parseFloat(atr.toFixed(2)),
      bollinger_bands: {
        upper: parseFloat(bbands.upper.toFixed(2)),
        middle: parseFloat(bbands.middle.toFixed(2)),
        lower: parseFloat(bbands.lower.toFixed(2)),
        width: bbWidth
      },
      adx: parseFloat(adx.toFixed(1)),
      pattern_recognition: {
        bullish_patterns: bullishPatterns,
        bearish_patterns: bearishPatterns,
        consolidation_patterns: consolidationPatterns
      }
    };
  }
  
  // Process options data using algorithm from edge-cases.md
  private processOptionsData(optionsData: any): OptionsData {
    // Use the options service to extract data according to the algorithm
    return this.optionsService.extractOptionsData(optionsData?.options?.option || []);
  }
  
  // Process earnings data
  private processEarningsData(earningsData: any): EarningsData {
    // Find the most recent earnings report
    const recentReport = Array.isArray(earningsData) && earningsData.length > 0
      ? earningsData[0]
      : null;
    
    if (!recentReport) {
      return {
        recent_report: {
          date: '',
          eps: {
            actual: 0,
            estimate: 0,
            surprise_percent: 0
          }
        }
      };
    }
    
    return {
      recent_report: {
        date: recentReport.report_date || '',
        eps: {
          actual: recentReport.reported_eps || 0,
          estimate: recentReport.expected_eps || 0,
          surprise_percent: recentReport.surprise_pct || 0
        }
      }
    };
  }
  
  // Process news data
  private processNewsData(newsData: any): NewsData {
    // Process and filter news data
    const recentArticles = Array.isArray(newsData) ? newsData : [];
    
    // Determine news sentiment classification
    let materialNewsClassification = 'neutral';
    
    // Check if there are any significantly positive news
    const positiveNews = recentArticles.filter(article => 
      article.sentiment && article.sentiment.score > 0.6
    );
    
    // Check if there are any significantly negative news
    const negativeNews = recentArticles.filter(article => 
      article.sentiment && article.sentiment.score < 0.4
    );
    
    if (positiveNews.length > 0 && negativeNews.length === 0) {
      materialNewsClassification = 'positive_catalyst';
    } else if (negativeNews.length > 0 && positiveNews.length === 0) {
      materialNewsClassification = 'negative_catalyst';
    } else if (positiveNews.length > 0 && negativeNews.length > 0) {
      materialNewsClassification = 'mixed';
    }
    
    return {
      recent_articles: recentArticles,
      material_news_classification: materialNewsClassification
    };
  }
  
  // Calculate day trading metrics using algorithms from edge-cases.md
  private calculateDayTradingMetrics(
    priceData: PriceData,
    volumeData: VolumeData,
    technicalIndicators: TechnicalIndicators,
    historicalData: any
  ): DayTradingMetrics {
    // Prepare historical price data for volatility calculation
    const histPrices = historicalData?.history?.day 
      ? historicalData.history.day.map((day: any) => ({
          high: day.high,
          low: day.low
        }))
      : [];
    
    // Calculate volatility score using scoring service
    const volatilityScore = this.scoringService.calculateVolatilityScore(
      technicalIndicators.atr_14,
      technicalIndicators.bollinger_bands,
      priceData.current,
      histPrices,
      volumeData.avg_10d,
      volumeData.current
    );
    
    // Calculate technical setup score using scoring service
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