/**
 * # MidCap Stock Analyzer System Architecture
 *
 * This file contains the primary interfaces for AI-optimized data structures,
 * along with the final comprehensive type interface for the system output.
 */

//
// 1. Models (from blueprint.v2.md)
//

/**
 * Primary interfaces for AI-optimized data structure
 */
export interface DayTradingAnalysis {
  date: string;
  time: string;
  marketContext: MarketContext;
  stocks: StockAnalysis[];
  notes?: string[];
}

/**
 * Encapsulates the broader market context for a given day and time
 */
export interface MarketContext {
  indices: Record<string, IndexData>;
  sectorPerformance: Record<string, number>;
  vix: number;
  putCallRatio: number;
  sectorRotation: {
    inflowSectors: string[];
    outflowSectors: string[];
  };
  macroEvents: { time: string; event: string }[];
  marketStatus: string;
  nextMarketHoursChange: string;
}

/**
 * Details for a major index such as SPY, QQQ, etc.
 */
export interface IndexData {
  price: number;
  changePercent: number;
  previousClose: number;
  volume: number;
}

/**
 * AI-optimized analysis of a single stock on a given day
 */
export interface StockAnalysis {
  ticker: string;
  companyInfo: CompanyInfo;
  priceData: EnhancedPriceData;
  volumeData: EnhancedVolumeData;
  technicalIndicators: EnhancedTechnicalIndicators;
  optionsData: EnhancedOptionsData;
  newsData: NewsData;
  earningsData: EarningsData;
  aiMetrics: AIPredictionMetrics;
}

/**
 * Core company details
 */
export interface CompanyInfo {
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  floatShares: number;
  employees?: number;
  description?: string;
}

/**
 * Enhanced price data including intraday metrics and gap analysis
 */
export interface EnhancedPriceData {
  previousClose: number;
  preMarket: number | null;
  open: number;
  current: number;
  dayRange: { low: number; high: number };
  movingAverages: Record<string, number>;
  intraday: {
    candles: IntradayCandle[];
    openingRange: {
      high: number;
      low: number;
      breakout: boolean;
    };
    vwap: number;
  };
  gapMetrics: {
    openingGapPercent: number;
    gapDirection: 'up' | 'down' | 'flat';
  };
}

/**
 * Intraday candlestick data with VWAP
 */
export interface IntradayCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
}

/**
 * Extended volume data with statistical features
 */
export interface EnhancedVolumeData {
  preMarket: number;
  current: number;
  avg10d: number;
  relativeVolume: number;
  volumePercentile: number;
  abnormalVolume: boolean;
  volumeTrend: 'increasing' | 'decreasing' | 'stable';
  volumeAcceleration: number;
  timeRelativeVolume: number;
  distribution: {
    firstHourPercent: number;
    middayPercent: number;
    lastHourPercent: number;
  };
  volumeProfile: {
    timeSlice: string;
    volume: number;
    avgPrice: number;
  }[];
}

/**
 * Extended technical indicators combining momentum, volatility, patterns, etc.
 */
export interface EnhancedTechnicalIndicators {
  rsi: number;
  rsiSlope: number;
  macd: {
    line: number;
    signal: number;
    histogram: number;
    histogramDirection: 'up' | 'down' | 'flat';
  };
  atr: number;
  atrPercent: number;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
    width: number;
    percentB: number;
  };
  adx: number;
  patternRecognition: {
    bullishPatterns: string[];
    bearishPatterns: string[];
    consolidationPatterns: string[];
    patternStrength: number;
  };
  priceLocation: {
    percentFromHigh: number;
    percentFromLow: number;
    relativeToVwap: 'above' | 'below';
    relativeToMA: Record<string, 'above' | 'below'>;
  };
}

/**
 * Extended options data to glean market sentiment from the options chain
 */
export interface EnhancedOptionsData {
  callPutRatio: number;
  impliedVolatility: number;
  impliedVolatilityChange: number;
  unusualActivity: boolean;
  optionsFlow: {
    bullishFlowPercent: number;
    bearishFlowPercent: number;
    volumeOpenInterestRatio: number;
  };
  nearestStrikes: {
    strike: number;
    callVolume: number;
    putVolume: number;
    callOI: number;
    putOI: number;
  }[];
}

/**
 * AI-specific metrics representing the system's assessment
 */
export interface AIPredictionMetrics {
  priceVolatilityScore: number;
  trendStrengthScore: number;
  momentumScore: number;
  technicalSetupScore: number;
  sentimentScore: number;
  predictionConfidence: number;
}

/**
 * Minimal legacy Stock interface for backward compatibility
 */
export interface Stock {
  ticker: string;
  company_name: string;
  sector: string;
  industry: string;
  market_cap: number;
  float: number;
  avg_daily_volume: number;
  price_data: PriceData;
  volume_data: VolumeData;
  technical_indicators: TechnicalIndicators;
  options_data: OptionsData;
  earnings_data: EarningsData;
  news_data: NewsData;
  day_trading_metrics: DayTradingMetrics;
}

/**
 * Legacy price data interface
 */
export interface PriceData {
  // Minimal placeholder
  previous_close: number;
  pre_market: number;
  current: number;
  day_range: {
    low: number;
    high: number;
  };
  moving_averages: {
    ma_20: number;
    ma_50: number;
  };
  intraday: {
    opening_range: {
      high: number;
      low: number;
      breakout: boolean;
    };
    vwap: number;
  };
}

/**
 * Legacy volume data interface
 */
export interface VolumeData {
  pre_market: number;
  current: number;
  avg_10d: number;
  relative_volume: number;
  volume_distribution: {
    first_hour_percent: number;
  };
}

/**
 * Legacy technical indicators placeholder
 */
export interface TechnicalIndicators {
  rsi_14: number;
  macd: {
    line: number;
    signal: number;
    histogram: number;
  };
  atr_14: number;
  bollinger_bands: {
    upper: number;
    middle: number;
    lower: number;
    width: number;
  };
  adx: number;
  pattern_recognition: any;
}

/**
 * Legacy options data placeholder
 */
export interface OptionsData {
  call_put_ratio: number;
  unusual_activity: boolean;
  options_flow: {
    bullish_flow_percent: number;
  };
}

/**
 * Legacy earnings data placeholder
 */
export interface EarningsData {
  recent_report: {
    date: string;
    eps: {
      actual: number;
      estimate: number;
      surprise_percent: number;
    };
  };
  next_report_date: string | null;
  trends: any[];
}

/**
 * Legacy news data placeholder
 */
export interface NewsData {
  recent_articles: {
    date: string;
    title: string;
    teaser: string;
    content: string;
    link: string;
    symbols: string[];
    tags: string[];
  }[];
  material_news_classification: string;
}

/**
 * Legacy day trading metrics placeholder
 */
export interface DayTradingMetrics {
  volatility_score: number;
  technical_setup_score: number;
}

/**
 * Legacy market data interface
 */
export interface MarketData {
  date: string;
  time: string;
  market_data: {
    indices: Record<string, { price: number; change_percent: number }>;
    sector_performance: Record<string, number>;
  };
  stock_universe: Stock[];
  market_conditions: MarketConditions;
}

/**
 * Legacy market conditions placeholder
 */
export interface MarketConditions {
  vix: number;
  put_call_ratio: number;
  sector_rotation: {
    inflow_sectors: string[];
    outflow_sectors: string[];
  };
  macro_events: { time: string; event: string }[];
  market_status: string;
  next_market_hours_change: string;
}

//
// Final Output from blueprint.v2.md
//

/**
 * Complete market analysis output including market-wide data and analyzed stock universe
 * The system returns a MarketData object containing market context and stock analysis.
 */
export type MidCapAnalysisOutput = MarketData;