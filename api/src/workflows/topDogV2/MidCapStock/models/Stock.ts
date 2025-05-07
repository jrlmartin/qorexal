
// src/models/Stock.ts
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

export interface PriceData {
  previous_close: number;
  pre_market: number;
  current: number;
  day_range: { low: number; high: number };
  moving_averages: {
    ma_20: number;
    ma_50: number;
  };
  intraday: {
    opening_range: { high: number; low: number; breakout: boolean };
    vwap: number;
  };
}

export interface VolumeData {
  pre_market: number;
  current: number;
  avg_10d: number;
  relative_volume: number;
  volume_distribution: {
    first_hour_percent: number;
  };
}

export interface TechnicalIndicators {
  rsi_14: number;
  macd: { line: number; signal: number; histogram: number };
  atr_14: number;
  bollinger_bands: {
    upper: number;
    middle: number;
    lower: number;
    width: number;
  };
  adx: number;
  pattern_recognition: {
    bullish_patterns: string[];
    bearish_patterns: string[];
    consolidation_patterns: string[];
  };
}

export interface OptionsData {
  call_put_ratio: number;
  unusual_activity: boolean;
  options_flow: {
    bullish_flow_percent: number;
  };
}

export interface EarningsData {
  recent_report: {
    date: string;
    eps: {
      actual: number;
      estimate: number;
      surprise_percent: number;
    };
  };
}

export interface NewsData {
  recent_articles: any[]; // Will be refined with proper typing
  material_news_classification: string;
}

export interface DayTradingMetrics {
  volatility_score: number;
  technical_setup_score: number;
}

export interface MarketConditions {
  vix: number;
  put_call_ratio: number;
  sector_rotation: {
    inflow_sectors: string[];
    outflow_sectors: string[];
  };
  macro_events: { time: string; event: string }[];
}