# MidCap Stock Analyzer System Architecture

Based on the codebase, I'll create a skeleton structure outlining the main classes, their methods, and high-level pseudocode to describe the system architecture.

## 1. Models

### Stock.ts

```typescript
// Core data models representing a stock and its properties
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

// Additional interfaces for specific stock data categories
export interface PriceData { /* price-related fields */ }
export interface VolumeData { /* volume-related fields */ }
export interface TechnicalIndicators { /* technical indicator fields */ }
export interface OptionsData { /* options fields */ }
export interface EarningsData { /* earnings fields */ }
export interface NewsData { /* news fields */ }
export interface DayTradingMetrics { /* day trading metrics fields */ }
export interface MarketConditions { /* market condition fields */ }
```

### MarketData.ts

```typescript
// Model representing market-wide data
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
```

## 2. API Clients

### TradierApiClient.ts


```typescript
// Client for accessing Tradier market data API
export class TradierApiClient {
  constructor() {
    // Initialize with API key
  }

  // Real-time quotes
  async getQuotes(symbols: string[]): Promise<QuotesResponse> {
    // Call Tradier quotes API endpoint
    // Process and return response
  }

  // Historical price data
  async getHistoricalData(symbol: string, start: string, end: string, interval: string = 'daily'): Promise<HistoricalDataResponse> {
    // Call Tradier historical data API endpoint
    // Process and return response
  }

  // Pre-market data
  async getPreMarketData(symbol: string, date: Date = new Date()): Promise<PreMarketData> {
    // Call timesales API with pre-market hours filter
    // Process and return pre-market data
  }

  // Intraday data with VWAP calculation
  async getIntradayData(symbol: string, date: Date = new Date()): Promise<IntradayData> {
    // Get minute-by-minute data for the trading day
    // Calculate VWAP
    // Return structured intraday data
  }

  // Options chain data
  async getOptionsChains(symbol: string, expiration: string): Promise<OptionsChainResponse> {
    // Call options chains API endpoint
    // Process and return response
  }

  // Options expirations
  async getOptionsExpirations(symbol: string): Promise<string[]> {
    // Call options expirations API endpoint
    // Extract and return array of expiration dates
  }

  // Additional API methods...
}
```

### EODHDApiClient.ts

```typescript
// Client for accessing EOD Historical Data API
export class EODHDApiClient {
  constructor() {
    // Initialize with API key
  }

  // Fundamental company data
  async getFundamentals(ticker: string): Promise<Fundamentals> {
    // Call fundamentals API endpoint
    // Process and return response
  }

  // Technical indicators
  async getRSI(ticker: string, period: number = 14, from?: string, to?: string): Promise<RSIResponse[]> {
    // Call technical RSI endpoint
    // Process and return response
  }

  async getMACD(ticker: string, fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): Promise<MACDResponse[]> {
    // Call technical MACD endpoint
    // Process and return response
  }

  async getBollingerBands(ticker: string, period: number = 20, stdDev: number = 2): Promise<BollingerBandsResponse[]> {
    // Call technical Bollinger Bands endpoint
    // Process and return response
  }

  async getADX(ticker: string, period: number = 14): Promise<ADXResponse[]> {
    // Call technical ADX endpoint
    // Process and return response
  }

  async getATR(ticker: string, period: number = 14): Promise<ATRResponse[]> {
    // Call technical ATR endpoint
    // Process and return response
  }

  async getMovingAverage(ticker: string, type: 'sma' | 'ema', period: number): Promise<MovingAverageResponse[]> {
    // Call technical moving average endpoint
    // Process and return response
  }

  async getPatternRecognition(ticker: string, period: number = 30): Promise<any[]> {
    // Call pattern recognition endpoint
    // Process and return response
  }

  // Calendar data methods
  async getEarnings(from?: string, to?: string, symbols?: string | string[]): Promise<EarningsResponse> {
    // Call earnings calendar endpoint
    // Process and return response
  }

  async getEconomicCalendar(from?: string, to?: string, country: string = 'US'): Promise<EconomicEventsResponse> {
    // Call economic calendar endpoint
    // Process and return response
  }

  // Additional API methods...
}
```

### BenzingaService.ts

```typescript
// Client for accessing Benzinga news API
export class BenzingaService {
  constructor() {
    // Initialize with API key and HTTP client
  }

  // Get news articles
  async getNews(params?: GetNewsParams): Promise<Partial<NewsItem>[]> {
    // Call Benzinga news API endpoint
    // Process HTML to Markdown conversion
    // Return formatted news items
  }

  // Get news within a time window
  async getNewsBlocks(minutesAgo: number, params?: GetNewsParams): Promise<Partial<NewsItem>[]> {
    // Calculate timestamp for specified minutes ago
    // Fetch all news pages until no more results
    // Combine and return news items
  }
}
```

## 3. Core Services

### MidCapScreenerService.ts

```typescript
// Main service for mid-cap stock analysis
export class MidCapScreenerService {
  private marketDataService: MarketDataService;
  private eodhdClient: EODHDApiClient;
  
  constructor() {
    // Initialize dependencies
  }

  // Find mid-cap stocks that match criteria
  async findMidCapStocks(limit: number = 10): Promise<string[]> {
    // In a real implementation, would query a database or use a screening API
    // For demo, returns a list of pre-defined stocks
    // Filter and limit results
  }

  // Run the full analysis pipeline
  async runAnalysis(date?: string, time?: string): Promise<any> {
    // Get current date if not provided
    // Find stocks to analyze
    // Get market data for these stocks
    // Return complete analysis results
  }
}
```

### MarketDataService.ts

```typescript
// Service for gathering market-wide data
export class MarketDataService {
  private tradierClient: TradierApiClient;
  private eodhdClient: EODHDApiClient;
  private stockDataService: StockDataService;
  private sectorRotationService: SectorRotationService;
  
  constructor() {
    // Initialize dependencies
  }

  // Gather comprehensive market data
  async getMarketData(date: string, time: string, stockTickers: string[]): Promise<MarketData> {
    // Get market indices data (SPY, QQQ, IWM)
    // Get sector ETF data
    // Get VIX data
    // Get economic calendar
    // Calculate market-wide put/call ratio
    // Get data for each stock in the universe
    // Process indices data
    // Process sector performance
    // Calculate sector rotation
    // Process VIX and put/call ratio
    // Compile full market data object
  }
}
```

### StockDataService.ts

```typescript
// Service for gathering individual stock data
export class StockDataService {
  private tradierClient: TradierApiClient;
  private eodhdClient: EODHDApiClient;
  private benzingaClient: BenzingaService;
  private scoringService: ScoringService;
  private optionsService: OptionsService;
  private patternRecognitionService: PatternRecognitionService;

  constructor() {
    // Initialize dependencies
  }

  // Gather comprehensive data for a single stock
  async getStockData(ticker: string, dateStr: string): Promise<Stock> {
    // Get basic stock information
    // Get historical data and technical indicators
    // Process price data
    // Process volume data
    // Process technical indicators
    // Process options data
    // Process earnings data
    // Process news data
    // Calculate day trading metrics
    // Construct and return complete stock object
  }

  // Helper methods for data processing
  private processPriceData(quoteData: any, preMarketData: any, historicalData: any, intradayData: any, 
                         sma20Data: any, sma50Data: any, today: Date): PriceData {
    // Process pre-market price
    // Calculate opening range
    // Determine if price broke out of opening range
    // Calculate VWAP
    // Process moving averages
    // Return complete price data
  }

  private processVolumeData(quoteData: any, preMarketData: any, historicalData: any, today: Date): VolumeData {
    // Process pre-market volume
    // Calculate first hour volume percentage
    // Calculate relative volume
    // Return volume data
  }

  private processTechnicalIndicators(rsiData: any, macdData: any, atrData: any, bollingerBands: any, 
                                   adxData: any, patternData: any, historicalData?: any): TechnicalIndicators {
    // Extract latest indicator values
    // Calculate Bollinger Band width
    // Process pattern recognition data
    // Use custom pattern detection if historical data available
    // Cross-validate patterns from multiple sources
    // Return technical indicators data
  }

  private processOptionsData(optionsData: any[]): OptionsData {
    // Use OptionsService to extract relevant data
    // Return options data
  }

  private processEarningsData(earningsData: any): EarningsData {
    // Find most recent earnings report
    // Calculate surprise percentage
    // Return earnings data
  }

  private processNewsData(newsData: any): NewsData {
    // Process recent articles
    // Classify news sentiment
    // Return news data
  }

  private calculateDayTradingMetrics(priceData: PriceData, technicalIndicators: TechnicalIndicators, 
                                  historicalData: any, volumeData: VolumeData): DayTradingMetrics {
    // Calculate volatility score
    // Calculate technical setup score
    // Return metrics
  }
}
```

## 4. Algorithm Services

### ScoringService.ts

```typescript
// Service for calculating various stock scores
export class ScoringService {
  // Calculate volatility score (0-1)
  calculateVolatilityScore(
    atr: number,
    bollingerBands: {upper: number, middle: number, lower: number, width: number},
    currentPrice: number,
    historicalPrices: Array<{high: number, low: number}>,
    avgVolume: number,
    currentVolume: number
  ): number {
    // Use Bollinger Band width as volatility measure
    // Normalize ATR as percentage of price
    // Calculate historical price volatility
    // Calculate relative volume ratio
    // Combine factors with weights
    // Return normalized score (0-1)
  }
  
  // Calculate technical setup score (0-1)
  calculateTechnicalSetupScore(
    rsi: number,
    macd: {line: number, signal: number, histogram: number},
    adx: number,
    patterns: {bullish_patterns: string[], bearish_patterns: string[], consolidation_patterns: string[]},
    price: number,
    movingAverages: {ma_20: number, ma_50: number}
  ): number {
    // Evaluate RSI setup
    // Evaluate MACD setup
    // Evaluate ADX for trend strength
    // Evaluate chart patterns
    // Evaluate price relative to moving averages
    // Combine scores with weights
    // Return normalized score (0-1)
  }
}
```

### PatternRecognitionService.ts

```typescript
// Service for chart pattern detection
export class PatternRecognitionService {
  // Detect common chart patterns from price data
  detectPatterns(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): {
    bullish_patterns: string[];
    bearish_patterns: string[];
    consolidation_patterns: string[];
  } {
    // Check if enough data points
    // Detect Double Bottom (Bullish)
    // Detect Head and Shoulders (Bearish)
    // Detect Inverse Head and Shoulders (Bullish)
    // Detect Bull Flag (Bullish)
    // Detect Bear Flag (Bearish)
    // Detect Rectangle (Consolidation)
    // Detect Triangle (Consolidation)
    // Detect Cup and Handle (Bullish)
    // Detect Double Top (Bearish)
    // Return all detected patterns
  }

  // Various pattern detection methods
  private detectDoubleBottom(priceData: Array<any>): boolean {
    // Find local minima
    // Check for two similar price bottoms
    // Verify separation between bottoms
    // Confirm price movement after second bottom
    // Return true if pattern detected
  }

  // Additional pattern detection methods...

  // Helper methods for pattern detection
  private findLocalMinima(data: number[], window: number = 2): number[] {
    // Iterate through data points
    // Identify local minimum points
    // Return array of indices
  }

  private findLocalMaxima(data: number[], window: number = 2): number[] {
    // Iterate through data points
    // Identify local maximum points
    // Return array of indices
  }

  private calculateLinearRegression(x: number[], y: number[]): { slope: number; intercept: number; r2: number } {
    // Calculate linear regression parameters
    // Return slope, intercept, and r-squared
  }

  // Cross-validate patterns from multiple sources
  crossValidatePatterns(
    eodhdPatterns: {
      bullish_patterns: string[];
      bearish_patterns: string[];
      consolidation_patterns: string[];
    },
    customPatterns: {
      bullish_patterns: string[];
      bearish_patterns: string[];
      consolidation_patterns: string[];
    }
  ): {
    bullish_patterns: string[];
    bearish_patterns: string[];
    consolidation_patterns: string[];
  } {
    // Count matches between pattern sets
    // Combine patterns with confidence weighting
    // Return consolidated pattern set
  }
}
```

### OptionsService.ts

```typescript
// Service for options data analysis
export class OptionsService {
  // Extract relevant options data metrics
  extractOptionsData(optionsData: any[]): any {
    // Split into calls and puts
    // Calculate volume-based call/put ratio
    // Calculate bullish flow percent based on premium
    // Determine if there's unusual activity
    // Return processed options data
  }
}
```

### SectorRotationService.ts

```typescript
// Service for sector rotation analysis
export class SectorRotationService {
  // Analyze sector rotation based on performance
  calculateSectorRotation(
    currentSectorData: Record<string, number>,
    historicalSectorData?: Record<string, Array<{date: string, close: number}>>
  ): {
    inflow_sectors: string[], 
    outflow_sectors: string[]
  } {
    // Create sector mapping for ETF symbols
    // Sort sectors by performance
    // Identify top performing sectors (inflow)
    // Identify bottom performing sectors (outflow)
    // Return sector rotation data
  }
}
```

## 5. Utilities

### dateUtils.ts

```typescript
// Utility functions for date handling in market context
export const getLatestTradingDay = (date = new Date()): string => {
  // If weekend, go back to Friday
  // Return formatted date
}

export const getMarketOpenTime = (): string => {
  // Return market open time (9:30 AM ET)
}

export const getPreMarketStart = (date = new Date()): string => {
  // Return pre-market start time (4:00 AM ET)
}

export const getMarketOpenDateTime = (date = new Date()): string => {
  // Return full date-time for market open
}

export const formatDateForApi = (date: Date): string => {
  // Format date for API requests
}

export const parseDateString = (dateStr: string): Date => {
  // Handle different date formats
  // Return Date object
}

export const getNow = (): string => {
  // Return current date-time in format for stock system
}

export const getDateRanges = (date: Date | string) => {
  // Return object with various date ranges:
  // today, yesterday, oneWeekAgo, etc.
}
```

## 6. Main Entry Point

### index.ts

```typescript
// Main entry point for mid-cap stock analysis
import { MidCapScreenerService } from "./services/MidCapScreenerService";
import { getNow } from "./utils/dateUtils";

// Function to run the full analysis
async function runMidCapAnalysis() {
  // Create the screener service
  // Get current date and time
  // Run the analysis
  // Return results
}

export { runMidCapAnalysis };
```

# Final Output

# Comprehensive Type Interface for MidCap Stock Analyzer Output

Below is a detailed type interface for the output produced by the MidCap Stock Analyzer system, with complete descriptions for each field and subfield:

```typescript
/**
 * Complete market analysis output including market-wide data and analyzed stock universe
 * The system returns an array of MarketData objects, typically containing a single object.
 */
type MidCapAnalysisOutput = MarketData[];

/**
 * Comprehensive market data snapshot for a specific date and time
 * Includes overall market indicators, sector performance, and detailed analysis of individual stocks
 */
interface MarketData {
  /** Date of the market data snapshot in YYYY-MM-DD format */
  date: string;
  
  /** Time of the market data snapshot in HH:MM:SS format */
  time: string;
  
  /** Market-wide indicators and sector performance */
  market_data: {
    /** Major market indices with current price and percent change */
    indices: {
      /** 
       * Key is the index symbol (e.g., 'SPY', 'QQQ', 'IWM'), 
       * value contains current price and percentage change
       */
      [indexSymbol: string]: { 
        /** Current price of the index */
        price: number; 
        /** Percentage change from previous close */
        change_percent: number; 
      };
    };
    
    /** 
     * Sector ETF performance by percentage change
     * Key is the sector ETF symbol (e.g., 'XLK', 'XLF', 'XLE'),
     * value is the percentage change from previous close
     */
    sector_performance: {
      [sectorETF: string]: number;
    };
  };
  
  /** Array of analyzed stocks with comprehensive data */
  stock_universe: Stock[];
  
  /** Broader market condition indicators */
  market_conditions: MarketConditions;
}

/**
 * Market-wide conditions used for contextual analysis
 */
interface MarketConditions {
  /** VIX volatility index value */
  vix: number;
  
  /** Market-wide put/call ratio - higher values indicate bearish sentiment */
  put_call_ratio: number;
  
  /** Sector rotation analysis based on relative performance */
  sector_rotation: {
    /** Sectors showing positive price movement and capital inflow */
    inflow_sectors: string[];
    
    /** Sectors showing negative price movement and capital outflow */
    outflow_sectors: string[];
  };
  
  /** 
   * Major economic events for the day that may impact market action
   * From the Economic Calendar API 
   */
  macro_events: {
    /** Time of the economic event in HH:MM format */
    time: string;
    
    /** Description of the economic event */
    event: string;
  }[];
}

/**
 * Comprehensive data for an individual stock
 * Contains all technical, fundamental, and market data points for analysis
 */
interface Stock {
  /** Ticker symbol of the stock */
  ticker: string;
  
  /** Full company name */
  company_name: string;
  
  /** Economic sector classification (e.g., "Technology", "Healthcare") */
  sector: string;
  
  /** More specific industry classification */
  industry: string;
  
  /** Market capitalization in USD */
  market_cap: number;
  
  /** Number of shares available for public trading (float) */
  float: number;
  
  /** Average daily trading volume over the past 10 days */
  avg_daily_volume: number;
  
  /** Current and historical price data */
  price_data: PriceData;
  
  /** Trading volume metrics */
  volume_data: VolumeData;
  
  /** Technical analysis indicators */
  technical_indicators: TechnicalIndicators;
  
  /** Options market data for sentiment analysis */
  options_data: OptionsData;
  
  /** Recent earnings information */
  earnings_data: EarningsData;
  
  /** Recent news and sentiment analysis */
  news_data: NewsData;
  
  /** Calculated metrics for day trading suitability */
  day_trading_metrics: DayTradingMetrics;
}

/**
 * Price-related data points and metrics for a stock
 */
interface PriceData {
  /** Previous day's closing price */
  previous_close: number;
  
  /** Pre-market price if available, otherwise opening price */
  pre_market: number;
  
  /** Current price (last traded price) */
  current: number;
  
  /** Daily high and low prices */
  day_range: { 
    /** Lowest price of the current trading day */
    low: number; 
    
    /** Highest price of the current trading day */
    high: number; 
  };
  
  /** Key moving averages for trend analysis */
  moving_averages: {
    /** 20-day simple moving average */
    ma_20: number;
    
    /** 50-day simple moving average */
    ma_50: number;
  };
  
  /** Intraday trading metrics */
  intraday: {
    /** First hour trading range (9:30-10:30 AM ET) */
    opening_range: { 
      /** Highest price during the first hour of trading */
      high: number; 
      
      /** Lowest price during the first hour of trading */
      low: number; 
      
      /** Whether price has broken above the opening range high (bullish signal) */
      breakout: boolean; 
    };
    
    /** Volume Weighted Average Price - key intraday reference level */
    vwap: number;
  };
}

/**
 * Volume-related metrics and analysis
 */
interface VolumeData {
  /** Pre-market trading volume */
  pre_market: number;
  
  /** Current total trading volume */
  current: number;
  
  /** Average daily volume over last 10 trading days */
  avg_10d: number;
  
  /** Ratio of current volume to average volume (higher values indicate unusual activity) */
  relative_volume: number;
  
  /** Volume distribution metrics for intraday analysis */
  volume_distribution: {
    /** Percentage of day's volume that occurred in the first trading hour */
    first_hour_percent: number;
  };
}

/**
 * Technical analysis indicators for trend and momentum assessment
 */
interface TechnicalIndicators {
  /** 14-period Relative Strength Index (0-100 scale) */
  rsi_14: number;
  
  /** Moving Average Convergence/Divergence indicator */
  macd: { 
    /** MACD line value (12-day EMA minus 26-day EMA) */
    line: number; 
    
    /** Signal line value (9-day EMA of MACD line) */
    signal: number; 
    
    /** MACD histogram (MACD line minus signal line) */
    histogram: number; 
  };
  
  /** 14-period Average True Range - volatility measure */
  atr_14: number;
  
  /** Bollinger Bands for volatility and potential reversal points */
  bollinger_bands: {
    /** Upper band (typically 2 standard deviations above middle band) */
    upper: number;
    
    /** Middle band (20-day moving average) */
    middle: number;
    
    /** Lower band (typically 2 standard deviations below middle band) */
    lower: number;
    
    /** Width ratio indicating volatility ((upper-lower)/middle) */
    width: number;
  };
  
  /** Average Directional Index - measures trend strength (0-100 scale) */
  adx: number;
  
  /** Detected chart patterns from price action analysis */
  pattern_recognition: {
    /** Identified bullish chart patterns */
    bullish_patterns: string[];
    
    /** Identified bearish chart patterns */
    bearish_patterns: string[];
    
    /** Identified consolidation/neutral chart patterns */
    consolidation_patterns: string[];
  };
}

/**
 * Options market data for sentiment and volatility analysis
 */
interface OptionsData {
  /** Ratio of call to put volume (above 1 indicates bullish sentiment) */
  call_put_ratio: number;
  
  /** Whether unusual options activity has been detected */
  unusual_activity: boolean;
  
  /** Options flow metrics */
  options_flow: {
    /** Percentage of options premium allocated to bullish positions */
    bullish_flow_percent: number;
  };
}

/**
 * Recent earnings data and surprises
 */
interface EarningsData {
  /** Most recent earnings report information */
  recent_report: {
    /** Date of earnings report in YYYY-MM-DD format */
    date: string;
    
    /** Earnings per share metrics */
    eps: {
      /** Actual reported EPS */
      actual: number;
      
      /** Analyst consensus EPS estimate */
      estimate: number;
      
      /** Percentage by which actual EPS beat/missed estimates */
      surprise_percent: number;
    };
  };
}

/**
 * Recent news and sentiment analysis
 */
interface NewsData {
  /** Recent news articles about the stock */
  recent_articles: {
    /** Publication date/time */
    date: string;
    
    /** Article headline */
    title: string;
    
    /** Brief summary or teaser text */
    teaser: string;
    
    /** Truncated main content */
    content: string;
    
    /** URL to full article */
    link: string;
    
    /** Stock symbols mentioned in the article */
    symbols: string[];
    
    /** Topic tags associated with the article */
    tags: string[];
  }[];
  
  /** Classification of news impact (positive_catalyst, negative_catalyst, neutral, mixed) */
  material_news_classification: string;
}

/**
 * Calculated metrics for day trading suitability assessment
 */
interface DayTradingMetrics {
  /** Composite score measuring price volatility (0-1 scale) */
  volatility_score: number;
  
  /** Composite score measuring strength of technical setup (0-1 scale) */
  technical_setup_score: number;
}
```

## Key Components and Relationships

This interface structure represents the complete output of the MidCap Stock Analyzer system. The top-level object is an array containing a `MarketData` instance, which provides:

1. **Market-wide context** (indices, sector performance, VIX, put/call ratio)
2. **Sector rotation analysis** (inflow and outflow sectors)
3. **Macroeconomic events** affecting the trading day
4. **Detailed analysis of individual stocks** in the `stock_universe` array

Each stock in the universe contains comprehensive data including price, volume, technical indicators, options sentiment, earnings information, news sentiment, and calculated day trading metrics. These metrics help traders identify the most promising mid-cap stocks for potential day trading opportunities.

The scoring system in particular (represented by `volatility_score` and `technical_setup_score` in the `DayTradingMetrics` interface) provides quick assessment of each stock's suitability for day trading based on multiple weighted factors synthesized into easy-to-interpret scores on a 0-1 scale.