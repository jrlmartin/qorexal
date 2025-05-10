# MidCap Stock Analyzer - Revised Output Schema

Below is a proposed schema for the output object, refined to provide data more directly suited for **day trading** and **predicting intraday high** with greater confidence. It builds upon the existing structure outlined in the previous blueprint, but adds or refines certain fields specifically relevant to intraday price-action analysis and modeling.

## Overview

- The top-level object is **`DayTradingAnalysis`**, which encapsulates:
  1. **Market-level context** (e.g., major indices, sector performance, market volatility).
  2. **A collection of analyzed stocks** (mid-cap candidates).
  3. **Additional intraday metrics** focusing on:
     - Opening gap
     - First-hour vs. subsequent volume distribution
     - Intraday time-series reference data (candles)
     - Extended historical volatility references
  4. **Notes** on missing or optional data that could be leveraged for better day-high prediction if obtained.

---

## 1. DayTradingAnalysis

```ts
/**
 * Root object for the mid-cap day trading analysis.
 * Encapsulates market context, an array of analyzed stocks, and
 * overall session details relevant for day-trading predictions.
 */
export interface DayTradingAnalysis {
  /** Date of analysis in YYYY-MM-DD format (latest trading day if weekend/holiday). */
  date: string;

  /** Time of analysis snapshot in HH:MM:SS (24-hour) format. */
  time: string;

  /** Market-wide data such as major indices, sector performances, etc. */
  marketContext: MarketContext;

  /** Array of StockAnalysis objects, each containing the full data for a specific stock. */
  stocks: StockAnalysis[];

  /** Additional notes or anomalies observed (e.g., major economic event, holiday schedule). */
  notes?: string[];
}
````

---

## 2. MarketContext

```ts
/**
 * Broad market conditions that provide a backdrop for analyzing individual stocks intraday.
 */
export interface MarketContext {
  /** Major index data, e.g., SPY, QQQ, IWM, DIA. */
  indices: {
    [symbol: string]: IndexData;
  };

  /** Sector ETF performance (e.g., XLK, XLF, XLE), keyed by ETF symbol. */
  sectorPerformance: {
    [sectorSymbol: string]: number;  // Percentage change from prior close
  };

  /** VIX volatility index level, from Tradier (or similar). */
  vix: number;

  /** Calculated put/call ratio from the broad market or key ETFs like SPY. */
  putCallRatio: number;

  /** Aggregated sector rotation analysis with inflow/outflow. */
  sectorRotation: {
    inflowSectors: string[];
    outflowSectors: string[];
  };

  /** Important macro events from EODHD economic calendar (optional array). */
  macroEvents: {
    time: string;   // "HH:MM"
    event: string;  // e.g. "FOMC Meeting, GDP Release"
  }[];

  /** Market hours status from Tradier's MarketClock (e.g., "open", "close"). */
  marketStatus: string;

  /** Timestamp or time of the next state change (e.g., close, extended). */
  nextMarketHoursChange: string;
}

export interface IndexData {
  /** Latest price of the index. */
  price: number;

  /** Percent change from previous close. */
  changePercent: number;
}
```

---

## 3. StockAnalysis

```ts
/**
 * Data structure holding day-trading-focused metrics for a single mid-cap stock.
 * This includes real-time quotes, intraday data, technical indicators, volume stats, etc.
 */
export interface StockAnalysis {
  /** The stock's ticker symbol. */
  ticker: string;

  /** Company fundamentals (sector, industry, etc.). */
  companyInfo: CompanyInfo;

  /** Quote and intraday price metrics. */
  priceData: PriceData;

  /** Trading volume and distribution for intraday analysis. */
  volumeData: VolumeData;

  /** Option-related sentiment or flow data. */
  optionsData: OptionsData;

  /** Technical indicators relevant for short-term trading. */
  technicals: TechnicalIndicators;

  /** Relevant fundamentals or highlights (e.g., float, market cap). */
  fundamentals: FundamentalHighlights;

  /** Earnings release data or trends that might affect intraday volatility. */
  earningsData: EarningsData;

  /** Recent news items from Benzinga (tags, teased content). */
  newsData: NewsData;

  /**
   * Custom day-trading metrics or aggregated scoring for quick scanning:
   * - Volatility Score
   * - Technical Setup Score
   * - Opening Gap
   */
  dayTradingMetrics: DayTradingMetrics;
}
```

---

### 3.1 CompanyInfo

```ts
/**
 * Basic descriptive info about the company.
 */
export interface CompanyInfo {
  name: string;
  sector: string;
  industry: string;
}
```

---

### 3.2 PriceData

```ts
/**
 * Core price data for intraday and short-term references.
 * More extensive intraday time-series data can be stored here for ML model ingestion.
 */
export interface PriceData {
  /** The previous day’s closing price. */
  previousClose: number;

  /** Current real-time last trade price. */
  currentPrice: number;

  /** Pre-market price if available (or else fallback to prior close). */
  preMarketPrice?: number;

  /**
   * The official open price for the current trading day (e.g., first trade at 9:30).
   * This can help to calculate opening gap or certain intraday patterns.
   */
  openingPrice?: number;

  /**
   * High and low for the current day so far. If the market is closed, they reflect the completed session.
   */
  dayRange: {
    low: number;
    high: number;
  };

  /**
   * Opening range data (9:30-10:30 AM ET or user-defined).
   * Useful for day traders to measure breakouts or expansions from the first hour's range.
   */
  openingRange?: {
    high: number;
    low: number;
    breakout?: boolean; // e.g., whether the price exceeded the opening range high
  };

  /**
   * Intraday minute-by-minute or custom-interval candle data, if needed for modeling.
   * Each candle contains { timestamp, open, high, low, close, volume, vwap? }.
   */
  intradayCandles?: IntradayCandle[];

  /**
   * VWAP (Volume Weighted Average Price) for the current session.
   */
  vwap?: number;
}

export interface IntradayCandle {
  timestamp: string;   // e.g. "2025-05-10T09:31:00-04:00"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number;
}
```

---

### 3.3 VolumeData

```ts
/**
 * Data on trading volume, both intraday and historical, to identify unusual activity or liquidity.
 */
export interface VolumeData {
  /** Current day's volume (updates intraday). */
  currentVolume: number;

  /** Pre-market volume total (if available). */
  preMarketVolume?: number;

  /** 10-day average daily volume from either Tradier or EODHD historical data. */
  avg10DayVolume: number;

  /** Relative volume indicator: currentVolume / avg10DayVolume. */
  relativeVolume: number;

  /**
   * Approximate distribution of today’s volume across key intraday segments.
   * For example, first hour, midday, last hour, etc.
   */
  intradayDistribution?: {
    firstHourVolume: number;
    middayVolume: number;
    lastHourVolume: number;
  };
}
```

---

### 3.4 OptionsData

```ts
/**
 * Options-based sentiment or flow data, typically from Tradier.
 * Helps day traders gauge bullish/bearish flows or unusual volume.
 */
export interface OptionsData {
  /** Ratio of total call volume to total put volume across near expirations. */
  callPutRatio: number;

  /** Indicator for unusual options activity (e.g., volume >= 2x open interest). */
  unusualActivity: boolean;

  /** Percent of total premium spent on calls vs. puts as a measure of bullish flow. */
  bullishFlowPercent: number;
}
```

---

### 3.5 TechnicalIndicators

```ts
/**
 * Relevant short-term indicators for day trading:
 * RSI, MACD, ATR, Bollinger Bands, ADX, plus recognized patterns.
 */
export interface TechnicalIndicators {
  rsi14?: number;
  macd?: MACDData;
  atr14?: number;
  bollingerBands?: BollingerBands;
  adx14?: number;

  /** Key chart patterns recognized (e.g., double bottom, flags, triangles). */
  patternRecognition?: ChartPatternData;
}

export interface MACDData {
  line: number;
  signal: number;
  histogram: number;
}

export interface BollingerBands {
  upper: number;
  middle: number;
  lower: number;
  width?: number; // (upper - lower) / middle
}

export interface ChartPatternData {
  bullishPatterns: string[];
  bearishPatterns: string[];
  consolidationPatterns: string[];
}
```

---

### 3.6 FundamentalHighlights

```ts
/**
 * High-level fundamentals that can influence intraday trading bias.
 */
export interface FundamentalHighlights {
  /** Company market cap in USD. */
  marketCap: number;

  /** Shares float (tradable shares). */
  float: number;

  /** Optional reference to short interest or ratio if available. */
  shortInterestRatio?: number;

  /** Beta relative to a major index (e.g., S&P 500). */
  beta?: number;
}
```

---

### 3.7 EarningsData

```ts
/**
 * Recent and upcoming earnings info. Day traders pay attention to post-earnings volatility or pre-earnings runs.
 */
export interface EarningsData {
  /** Most recent earnings report details if available. */
  recent?: {
    date: string;
    actualEPS?: number;
    estimatedEPS?: number;
    surprisePercent?: number;
  };

  /** Known date of the next earnings report, if provided by the API. */
  nextReportDate?: string;

  /**
   * Historical or forward-looking trends from EODHD (optional).
   * Could include multiple data points for modeling.
   */
  earningsTrends?: any[];
}
```

---

### 3.8 NewsData

```ts
/**
 * Recent articles from Benzinga or other sources. Short text for quick scanning,
 * plus tags for classification. No official sentiment is provided by Benzinga,
 * but custom NLP can be applied externally.
 */
export interface NewsData {
  recentArticles: NewsArticle[];

  /**
   * Potential classification for "high activity" vs. "normal".
   * Could also store a custom sentiment if we run NLP.
   */
  materialNewsClassification?: string;
}

export interface NewsArticle {
  date: string;            // e.g., "2025-05-09T11:30:00-04:00"
  title: string;
  teaser: string;
  contentSnippet: string;  // short snippet from body
  url: string;
  symbols: string[];
  tags: string[];
}
```

---

### 3.9 DayTradingMetrics

```ts
/**
 * Computed metrics that help day traders gauge a stock's readiness for intraday moves,
 * such as volatility or how "technically primed" it is.
 */
export interface DayTradingMetrics {
  /**
   * Score representing intraday volatility on a scale of 0 to 1.
   * Could incorporate ATR, relative volume, Bollinger Band width, etc.
   */
  volatilityScore: number;

  /**
   * Score for the technical setup’s bullish/bearish potential, from 0 to 1,
   * factoring in RSI, MACD crosses, and pattern recognition.
   */
  technicalSetupScore: number;

  /**
   * Opening gap from previous close to the day’s open price. Could be negative or positive.
   */
  openingGapPercent?: number;

  /**
   * Additional custom signals to highlight at-a-glance status
   * (e.g., "Potential Breakout", "Overextended", "Inside Day").
   */
  customSignals?: string[];
}
```

---

## 4. Potential Missing Data / Future Enhancements

1. **Level II Order Book (Depth)**:

   * Neither Tradier nor EODHD provides full Level II quotes data. Such data can reveal hidden support/resistance for intraday trading, beneficial for day-high predictions.

2. **Real-time Sentiment**:

   * Benzinga does not provide sentiment analysis. A custom NLP pipeline or third-party sentiment scoring could better gauge bullish/bearish momentum from real-time news.

3. **High-Frequency Intraday Options Flow**:

   * The current approach only aggregates call/put volumes at the chain level. For advanced day-high modeling, real-time options sweeps or block trades can be key signals.

4. **Future Earnings Date**:

   * EODHD can provide some future earnings data, but sometimes it’s incomplete. Confirming upcoming events ensures we know if a stock is about to experience a volatility catalyst.

5. **Social Media Data**:

   * For certain mid-cap stocks, sentiment on platforms like Twitter or Reddit can drive intraday volatility. Currently not included.

---

## Conclusion

# This revised output schema places **intraday metrics** and **short-term analysis** at the forefront. The structure enables machine learning and predictive modeling to focus on time-based intraday data, technical indicators, real-time volume flow, and relevant fundamentals. By exposing fields like **`openingGapPercent`**, **`intradayCandles`**, and refined volumes, the system can better track and anticipate the conditions that lead to a stock’s intraday high. Data not currently available from our existing APIs—such as real-time order flow or social sentiment—could be integrated in the future to further enhance predictive accuracy.

```