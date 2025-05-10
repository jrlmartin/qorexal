# MidCap Stock Analyzer System Architecture

High-level pseudocode to describe the system architecture, optimized for the available API services (Benzinga, EODHD, and Tradier).

## 1. Models

### DayTradingAnalysis.ts

```typescript
// Primary interfaces for AI-optimized data structure
export interface DayTradingAnalysis {
  date: string;
  time: string;
  marketContext: MarketContext;
  stocks: StockAnalysis[];
  notes?: string[];
}

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

export interface IndexData {
  price: number;
  changePercent: number;
  previousClose: number;
  volume: number;
}

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

export interface CompanyInfo {
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  floatShares: number;
  employees?: number;
  description?: string;
}

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

export interface IntradayCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
}

export interface EnhancedVolumeData {
  preMarket: number;
  current: number;
  avg10d: number;
  relativeVolume: number;
  volumePercentile: number;       // Percentile rank compared to 10-day history
  abnormalVolume: boolean;        // True if volume is statistically abnormal
  volumeTrend: 'increasing' | 'decreasing' | 'stable'; // Volume trend over last 5 days
  volumeAcceleration: number;     // Rate of volume change in current period
  timeRelativeVolume: number;     // Volume relative to typical volume at this time of day
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

export interface AIPredictionMetrics {
  priceVolatilityScore: number;
  trendStrengthScore: number;
  momentumScore: number;
  technicalSetupScore: number;
  sentimentScore: number;
  predictionConfidence: number;
}

// Legacy interfaces maintained for backward compatibility
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

// Legacy data interfaces
export interface PriceData { /* price-related fields */ }
export interface VolumeData { /* volume-related fields */ }
export interface TechnicalIndicators { /* technical indicator fields */ }
export interface OptionsData { /* options fields */ }
export interface EarningsData { /* earnings fields */ }
export interface NewsData { /* news fields */ }
export interface DayTradingMetrics { /* day trading metrics fields */ }
export interface MarketConditions { /* market condition fields */ }

// Legacy market data interface
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
  private baseUrl: string = 'https://api.tradier.com/v1';
  private apiKey: string;
  
  constructor() {
    // Initialize with API key from config
    this.apiKey = config.tradier.apiKey;
  }

  // Real-time quotes
  async getQuotes(symbols: string[]): Promise<QuotesResponse> {
    // Call Tradier quotes API endpoint with symbols param
    // Process and return response with detailed quote data
  }

  // Historical price data
  async getHistoricalData(symbol: string, start: string, end: string, interval: string = 'daily'): Promise<HistoricalDataResponse> {
    // Call Tradier historical data API endpoint
    // Returns OHLCV data for specified date range
  }

  // Time and sales data (tick data)
  async getTimeSales(
    symbol: string, 
    interval: 'tick' | '1min' | '5min' | '15min' = '1min',
    start?: string,
    end?: string,
    sessionFilter: 'all' | 'open' | 'closed' = 'all'
  ): Promise<TimeSalesResponse> {
    // Get detailed time and sales data with flexible filtering
    // Used for pre-market data and intraday analysis
  }

  // Options chain data
  async getOptionsChains(symbol: string, expiration: string): Promise<OptionsChainResponse> {
    // Call options chains API endpoint
    // Process and return response with detailed options data
  }

  // Options expirations
  async getOptionsExpirations(symbol: string): Promise<string[]> {
    // Call options expirations API endpoint
    // Extract and return array of expiration dates
  }

  // Symbol lookup
  async lookupSymbol(query: string): Promise<any> {
    // Look up a symbol by company name
    // Returns matching symbols and additional metadata
  }

  // Helper methods for pre-market and intraday data
  async getPreMarketData(symbol: string, date: Date = new Date()): Promise<PreMarketData> {
    // Use timesales API with pre-market session filter
    // Process and return pre-market price and volume data
  }

  async getIntradayData(symbol: string, date: Date = new Date()): Promise<IntradayData> {
    // Get minute-by-minute data for the trading day
    // Calculate VWAP and other intraday metrics
    // Return structured intraday data
  }
  
  // Market status methods
  async getMarketClock(): Promise<MarketClockResponse> {
    // Get current market status (open/closed)
    // Return detailed market hours information
  }
  
  async getMarketCalendar(year?: number, month?: number): Promise<MarketCalendarResponse> {
    // Get market calendar including holidays and early closures
    // Return calendar data for specified period
  }
}
```

### EODHDApiClient.ts

```typescript
// Client for accessing EOD Historical Data API
export class EODHDApiClient {
  private baseUrl: string = 'https://eodhistoricaldata.com/api';
  private apiKey: string;
  
  constructor() {
    // Initialize with API key from config
    this.apiKey = config.eodhd.apiKey;
  }

  // Fundamental company data
  async getFundamentals(ticker: string): Promise<Fundamentals> {
    // Call fundamentals API endpoint
    // Process and return comprehensive company data including:
    // - General info (name, sector, industry, etc.)
    // - Market cap, float, shares outstanding
    // - Financial highlights
    // - Valuation metrics
  }

  // Historical EOD data
  async getHistoricalEOD(
    ticker: string,
    from?: string,
    to?: string,
    period: 'd' | 'w' | 'm' = 'd',
    order: 'a' | 'd' = 'a',
    filter?: string
  ): Promise<HistoricalEODResponse[]> {
    // Get historical end-of-day price data
    // Returns OHLCV with additional metrics
  }

  // Technical indicators - modular implementation

  // RSI indicator
  async getRSI(ticker: string, period: number = 14, from?: string, to?: string): Promise<RSIResponse[]> {
    // Get Relative Strength Index values
    // Returns array with date, close price, and RSI values
  }

  // MACD indicator
  async getMACD(ticker: string, fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): Promise<MACDResponse[]> {
    // Get Moving Average Convergence/Divergence values
    // Returns array with MACD line, signal line, and histogram values
  }

  // Bollinger Bands
  async getBollingerBands(ticker: string, period: number = 20, stdDev: number = 2): Promise<BollingerBandsResponse[]> {
    // Get Bollinger Bands values (upper, middle, lower bands)
    // Returns array with all three band values for each date
  }

  // ADX indicator
  async getADX(ticker: string, period: number = 14): Promise<ADXResponse[]> {
    // Get Average Directional Index values
    // Returns array with ADX values for trend strength measurement
  }

  // ATR indicator
  async getATR(ticker: string, period: number = 14): Promise<ATRResponse[]> {
    // Get Average True Range values
    // Returns array with ATR values for volatility measurement
  }

  // Moving Average
  async getMovingAverage(ticker: string, type: 'sma' | 'ema', period: number): Promise<MovingAverageResponse[]> {
    // Get Simple or Exponential Moving Average values
    // Returns array with moving average values for specified period
  }

  // Calendar and Economic Data

  // Earnings data
  async getEarnings(from?: string, to?: string, symbols?: string | string[]): Promise<EarningsResponse> {
    // Get earnings data for specified symbols or date range
    // Returns earnings dates, estimates, actuals, and surprises
  }

  // Economic Calendar
  async getEconomicCalendar(
    from?: string,
    to?: string,
    country: string = 'US',
    comparison?: 'mom' | 'qoq' | 'yoy',
    type?: string,
    offset?: number,
    limit?: number
  ): Promise<EconomicEventsResponse> {
    // Get economic events data worldwide
    // Filter by country, date range, and comparison type
  }

  // Earnings Trends
  async getEarningsTrends(symbols: string | string[]): Promise<EarningsTrendsResponse> {
    // Get historical earnings trend data
    // Includes actual vs estimates, surprises, PE ratios, etc.
  }
}
```

### BenzingaService.ts

```typescript
// Client for accessing Benzinga news API
export class BenzingaService {
  private readonly axios: AxiosInstance;
  private readonly turndownService: TurndownService;
  token = 'bz.WWL5SVXV7URHO5NQUZWV36EADONZEEJK';
  
  constructor() {
    // Initialize HTTP client and HTML to Markdown converter
    // Configure Turndown to strip links and images
  }

  // Get news articles
  async getNews(params?: GetNewsParams): Promise<Partial<NewsItem>[]> {
    // Call Benzinga news API endpoint with parameters
    // Convert HTML content to Markdown
    // Process and return formatted news items
  }

  // Get news within a time window
  async getNewsBlocks(minutesAgo: number, params?: GetNewsParams): Promise<Partial<NewsItem>[]> {
    // Calculate timestamp for specified minutes ago
    // Fetch all news pages until no more results
    // Paginate through results automatically
    // Combine and return news items
  }
}

/**
 * News query parameters interface
 */
export interface GetNewsParams {
  page?: number;               // Page offset (0-100000)
  pageSize?: number;           // Number of results per page (max 100)
  displayOutput?: 'headline' | 'abstract' | 'full';  // Content level
  date?: string;               // Single date to query
  dateFrom?: string;           // Start date for query range
  dateTo?: string;             // End date for query range 
  updatedSince?: number;       // Filter by last updated timestamp
  publishedSince?: number;     // Filter by published timestamp
  sort?: string;               // Result sorting control
  isin?: string;               // Filter by ISINs (max 50)
  cusip?: string;              // Filter by CUSIPs (max 50)
  tickers?: string;            // Filter by ticker symbols (max 50)
  channels?: string;           // Filter by channel names/IDs
  topics?: string;             // Search in Title, Tags, Body
  authors?: string;            // Filter by article authors
  content_types?: string;      // Filter by content types
}
```

## 3. Core Services

### MidCapScreenerService.ts

```typescript
// Main service for mid-cap stock screening and selection
export class MidCapScreenerService {
  private eodhdClient: EODHDApiClient;
  private midCapRange: { min: number; max: number };
  private stockUniverseLimit: number;
  
  constructor() {
    // Initialize dependencies
    this.eodhdClient = new EODHDApiClient();
    // Get configuration from config.ts
    this.midCapRange = config.app.midCapRange; // $2B-$10B
    this.stockUniverseLimit = config.app.stockUniverseLimit; // 20
  }

  /**
   * Find mid-cap stocks based on market cap range
   * Implementation Gap: No efficient endpoint exists to directly query all stocks within a market cap range
   * Solution: Use a database of pre-screened stocks or query known mid-cap ETF holdings
   */
  async findMidCapStocks(limit: number = this.stockUniverseLimit): Promise<string[]> {
    // Options for implementation:
    // 1. Maintain a local database of stock fundamentals updated daily
    // 2. Query holdings of mid-cap ETFs like IJH (iShares Core S&P Mid-Cap ETF)
    // 3. Use a set of pre-defined mid-cap stocks from config (limited approach)
    
    // For MVP implementation: Use predefined list from config.app.defaultStocks
    // and supplement with manual screening of additional stocks
    
    const midCapStocks: string[] = [];
    const preDefinedStocks = config.app.defaultStocks;
    
    // Add predefined stocks to maintain consistency
    midCapStocks.push(...preDefinedStocks);
    
    // If we need more stocks, we can iterate through a larger watchlist
    // and filter by market cap with getFundamentals call for each
    if (midCapStocks.length < limit) {
      // In a real implementation, we would have a database with precalculated market caps
      // For now, we'll just use what we have
    }
    
    // Limit results to requested amount
    return midCapStocks.slice(0, limit);
  }

  // Run the full analysis pipeline
  async runAnalysis(date?: string, time?: string): Promise<MarketData> {
    // Get current date/time if not provided
    const analysisDate = date || getLatestTradingDay();
    const analysisTime = time || getNow();
    
    // Find mid-cap stocks to analyze
    const stockTickers = await this.findMidCapStocks();
    
    // Get market data with analyzed stocks
    const marketDataService = new MarketDataService();
    const marketData = await marketDataService.getMarketData(
      analysisDate,
      analysisTime,
      stockTickers
    );
    
    return marketData;
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
    this.tradierClient = new TradierApiClient();
    this.eodhdClient = new EODHDApiClient();
    this.stockDataService = new StockDataService();
    this.sectorRotationService = new SectorRotationService();
  }

  // Gather comprehensive market data
  async getMarketData(date: string, time: string, stockTickers: string[]): Promise<MarketData> {
    // Market indices to track (using Tradier for real-time data)
    const indices = ['SPY', 'QQQ', 'IWM', 'DIA'];
    
    // Sector ETFs for performance tracking
    const sectorETFs = [
      'XLK', // Technology
      'XLF', // Financials
      'XLE', // Energy
      'XLV', // Healthcare
      'XLY', // Consumer Discretionary
      'XLP', // Consumer Staples
      'XLI', // Industrials
      'XLB', // Materials
      'XLU', // Utilities
      'XLRE' // Real Estate
    ];
    
    // Get market indices data from Tradier (better real-time awareness)
    const indicesData = await this.tradierClient.getQuotes(indices);
    
    // Get sector ETF data from Tradier for current performance
    const sectorETFData = await this.tradierClient.getQuotes(sectorETFs);
    
    // Get VIX data for volatility measurement
    const vixData = await this.tradierClient.getQuotes(['VIX']);
    
    // Get economic calendar from EODHD (more comprehensive calendar data)
    const today = new Date(date);
    const economicCalendarData = await this.eodhdClient.getEconomicCalendar(
      date,
      date,
      'US'
    );
    
    // Get market status from Tradier
    const marketStatusData = await this.tradierClient.getMarketClock();
    
    // Calculate sector rotation using SectorRotationService
    // Use both current data from Tradier and historical data from EODHD
    const currentSectorPerformance = this.extractSectorPerformance(sectorETFData);
    
    // Get historical sector data for trend analysis (1 week)
    const oneWeekAgo = getDateRanges(date).oneWeekAgo;
    const historicalSectorData: Record<string, any> = {};
    
    // For each sector ETF, get historical data
    for (const etf of sectorETFs) {
      const historicalData = await this.eodhdClient.getHistoricalEOD(
        etf,
        oneWeekAgo,
        date
      );
      historicalSectorData[etf] = historicalData;
    }
    
    // Calculate sector rotation based on current and historical data
    const sectorRotation = await this.sectorRotationService.calculateSectorRotation(
      currentSectorPerformance,
      historicalSectorData
    );
    
    // Analyze each stock in the universe
    const stockUniverse: Stock[] = [];
    for (const ticker of stockTickers) {
      const stockData = await this.stockDataService.getStockData(ticker, date);
      stockUniverse.push(stockData);
    }
    
    // Calculate market-wide put/call ratio using Tradier options data
    // We'll use SPY options as proxy for market sentiment
    const spyExpDates = await this.tradierClient.getOptionsExpirations('SPY');
    const nearestExpiration = spyExpDates[0]; // First is closest
    const spyOptions = await this.tradierClient.getOptionsChains('SPY', nearestExpiration);
    
    // Extract call and put volume
    const putCallRatio = this.calculatePutCallRatio(spyOptions);
    
    // Compile market data
    const marketData: MarketData = {
      date,
      time,
      market_data: {
        indices: this.processIndicesData(indicesData),
        sector_performance: currentSectorPerformance
      },
      stock_universe: stockUniverse,
      market_conditions: {
        vix: vixData.quotes.quote[0].last,
        put_call_ratio: putCallRatio,
        sector_rotation: sectorRotation,
        macro_events: this.processEconomicEvents(economicCalendarData),
        market_status: marketStatusData.clock.state,
        next_market_hours_change: marketStatusData.clock.next_change
      }
    };
    
    return marketData;
  }
  
  // Helper methods for data processing
  
  private processIndicesData(indicesData: QuotesResponse): Record<string, { price: number; change_percent: number }> {
    const result: Record<string, { price: number; change_percent: number }> = {};
    
    for (const quote of indicesData.quotes.quote) {
      result[quote.symbol] = {
        price: quote.last,
        change_percent: quote.change_percentage
      };
    }
    
    return result;
  }
  
  private extractSectorPerformance(sectorETFData: QuotesResponse): Record<string, number> {
    const result: Record<string, number> = {};
    
    for (const quote of sectorETFData.quotes.quote) {
      result[quote.symbol] = quote.change_percentage;
    }
    
    return result;
  }
  
  private processEconomicEvents(calendarData: EconomicEventsResponse): { time: string; event: string }[] {
    return calendarData.events.map(event => ({
      time: event.date.split(' ')[1] || '00:00:00',
      event: `${event.event_name} (${event.country}) - Actual: ${event.actual}, Estimate: ${event.estimate}, Previous: ${event.previous}`
    }));
  }
  
  private calculatePutCallRatio(optionsData: OptionsChainResponse): number {
    let callVolume = 0;
    let putVolume = 0;
    
    for (const option of optionsData.options.option) {
      if (option.option_type === 'call') {
        callVolume += option.volume || 0;
      } else if (option.option_type === 'put') {
        putVolume += option.volume || 0;
      }
    }
    
    // Avoid division by zero
    if (callVolume === 0) return 0;
    
    return parseFloat((putVolume / callVolume).toFixed(2));
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
  private timeSeriesProcessor: TimeSeriesProcessor;

  constructor() {
    // Initialize dependencies
    this.tradierClient = new TradierApiClient();
    this.eodhdClient = new EODHDApiClient();
    this.benzingaClient = new BenzingaService();
    this.scoringService = new ScoringService();
    this.optionsService = new OptionsService();
    this.patternRecognitionService = new PatternRecognitionService();
    this.timeSeriesProcessor = new TimeSeriesProcessor();
  }

  // Enhanced method for AI-optimized stock data collection
  async getEnhancedStockData(ticker: string, dateStr: string): Promise<StockAnalysis> {
    const today = new Date(dateStr);
    
    // Get basic stock information from EODHD (more complete fundamentals)
    const fundamentals = await this.eodhdClient.getFundamentals(ticker);
    
    // Get current quote from Tradier (real-time awareness)
    const quoteData = await this.tradierClient.getQuotes([ticker]);
    
    // Get pre-market data from Tradier (specialized pre-market endpoint)
    const preMarketData = await this.tradierClient.getPreMarketData(ticker, today);
    
    // Get historical data from EODHD (more flexible filtering)
    const { oneMonthAgo } = getDateRanges(dateStr);
    const historicalData = await this.eodhdClient.getHistoricalEOD(
      ticker,
      oneMonthAgo,
      dateStr
    );
    
    // Get time sales data (tick data) for intraday analysis
    // This will provide more detailed intraday data than the standard intraday endpoint
    const marketOpen = getMarketOpenTime();
    const marketOpenStr = `${dateStr} ${marketOpen.getHours()}:${marketOpen.getMinutes()}`;
    const now = new Date();
    const nowStr = `${dateStr} ${now.getHours()}:${now.getMinutes()}`;
    
    const timeSalesData = await this.tradierClient.getTimeSales(
      ticker,
      '1min',
      marketOpenStr,
      nowStr,
      'all'
    );
    
    // Process intraday candles using TimeSeriesProcessor
    const intradayCandles = this.timeSeriesProcessor.processTimeSalesToCandles(
      timeSalesData.series.data,
      '1min'
    );
    
    // Calculate VWAP for the day
    const vwap = this.calculateVWAP(intradayCandles);
    
    // Get intraday data with standard VWAP from Tradier as backup
    const intradayData = await this.tradierClient.getIntradayData(ticker, today);
    
    // Get technical indicators from EODHD (more comprehensive indicators)
    const rsiData = await this.eodhdClient.getRSI(ticker);
    const macdData = await this.eodhdClient.getMACD(ticker);
    const bollingerBands = await this.eodhdClient.getBollingerBands(ticker);
    const adxData = await this.eodhdClient.getADX(ticker);
    const atrData = await this.eodhdClient.getATR(ticker);
    
    // Get moving averages from EODHD
    const sma20Data = await this.eodhdClient.getMovingAverage(ticker, 'sma', 20);
    const sma50Data = await this.eodhdClient.getMovingAverage(ticker, 'sma', 50);
    const sma200Data = await this.eodhdClient.getMovingAverage(ticker, 'sma', 200);
    
    // Calculate RSI slope (RSI momentum)
    const rsiSlope = this.calculateRSISlope(rsiData);
    
    // Get options data from Tradier (better options data with Greeks)
    const expirations = await this.tradierClient.getOptionsExpirations(ticker);
    let optionsData = null;
    let impliedVolatilityData = null;
    if (expirations.length > 0) {
      // Get nearest expiration
      const nearestExpiration = expirations[0];
      optionsData = await this.tradierClient.getOptionsChains(ticker, nearestExpiration);
      
      // Calculate implied volatility metrics
      impliedVolatilityData = this.calculateImpliedVolatilityMetrics(optionsData.options.option);
    }
    
    // Get earnings data from EODHD (historical earnings surprises)
    const earningsData = await this.eodhdClient.getEarnings(null, null, ticker);
    const earningsTrends = await this.eodhdClient.getEarningsTrends(ticker);
    
    // Get news data from Benzinga (rich metadata with stock tagging)
    const newsData = await this.benzingaClient.getNewsBlocks(
      24 * 60, // Last 24 hours
      { tickers: ticker }
    );
    
    // Pattern recognition using custom implementation
    const patternData = await this.patternRecognitionService.detectPatterns(historicalData);
    
    // Calculate first hour metrics
    const firstHourMetrics = this.timeSeriesProcessor.calculateFirstHourMetrics(intradayCandles);
    
    // Calculate volume distribution
    const volumeDistribution = this.timeSeriesProcessor.calculateVolumeDistribution(intradayCandles);
    
    // Calculate opening gap metrics
    const gapMetrics = this.timeSeriesProcessor.calculateOpeningGapMetrics(
      quoteData.quotes.quote[0].prevclose,
      quoteData.quotes.quote[0].open
    );
    
    // Process all collected data into AI-optimized format
    const companyInfo = this.processCompanyInfo(fundamentals);
    
    const enhancedPriceData = this.processEnhancedPriceData(
      quoteData.quotes.quote[0],
      preMarketData,
      intradayCandles,
      firstHourMetrics,
      vwap,
      gapMetrics,
      sma20Data,
      sma50Data,
      sma200Data
    );
    
    const enhancedVolumeData = this.processEnhancedVolumeData(
      quoteData.quotes.quote[0],
      preMarketData,
      historicalData,
      volumeDistribution
    );
    
    const enhancedTechnicalIndicators = this.processEnhancedTechnicalIndicators(
      rsiData,
      rsiSlope,
      macdData,
      atrData,
      bollingerBands,
      adxData,
      patternData,
      quoteData.quotes.quote[0],
      enhancedPriceData
    );
    
    // Process options data using OptionsService
    const enhancedOptionsData = optionsData ?
      this.processEnhancedOptionsData(optionsData.options.option, impliedVolatilityData) :
      null;
    
    const processedEarningsData = this.processEarningsData(earningsData, earningsTrends);
    
    const processedNewsData = this.processNewsData(newsData);
    
    // Calculate AI prediction metrics using ScoringService
    const aiMetrics = this.calculateAIPredictionMetrics(
      enhancedPriceData,
      enhancedTechnicalIndicators,
      enhancedVolumeData
    );
    
    // Construct and return complete StockAnalysis object
    return {
      ticker,
      companyInfo,
      priceData: enhancedPriceData,
      volumeData: enhancedVolumeData,
      technicalIndicators: enhancedTechnicalIndicators,
      optionsData: enhancedOptionsData || {
        callPutRatio: 0,
        impliedVolatility: 0,
        impliedVolatilityChange: 0,
        unusualActivity: false,
        optionsFlow: {
          bullishFlowPercent: 0,
          bearishFlowPercent: 0,
          volumeOpenInterestRatio: 0
        },
        nearestStrikes: []
      },
      earningsData: processedEarningsData,
      newsData: processedNewsData,
      aiMetrics
    };
  }

  // Legacy method maintained for backward compatibility
  async getStockData(ticker: string, dateStr: string): Promise<Stock> {
    const today = new Date(dateStr);
    
    // Get basic stock information from EODHD (more complete fundamentals)
    const fundamentals = await this.eodhdClient.getFundamentals(ticker);
    
    // Get current quote from Tradier (real-time awareness)
    const quoteData = await this.tradierClient.getQuotes([ticker]);
    
    // Get pre-market data from Tradier (specialized pre-market endpoint)
    const preMarketData = await this.tradierClient.getPreMarketData(ticker, today);
    
    // Get historical data from EODHD (more flexible filtering)
    const { oneMonthAgo } = getDateRanges(dateStr);
    const historicalData = await this.eodhdClient.getHistoricalEOD(
      ticker,
      oneMonthAgo,
      dateStr
    );
    
    // Get intraday data with VWAP from Tradier (better time granularity)
    const intradayData = await this.tradierClient.getIntradayData(ticker, today);
    
    // Get technical indicators from EODHD (more comprehensive indicators)
    const rsiData = await this.eodhdClient.getRSI(ticker);
    const macdData = await this.eodhdClient.getMACD(ticker);
    const bollingerBands = await this.eodhdClient.getBollingerBands(ticker);
    const adxData = await this.eodhdClient.getADX(ticker);
    const atrData = await this.eodhdClient.getATR(ticker);
    
    // Get moving averages from EODHD
    const sma20Data = await this.eodhdClient.getMovingAverage(ticker, 'sma', 20);
    const sma50Data = await this.eodhdClient.getMovingAverage(ticker, 'sma', 50);
    
    // Get options data from Tradier (better options data with Greeks)
    const expirations = await this.tradierClient.getOptionsExpirations(ticker);
    let optionsData = null;
    if (expirations.length > 0) {
      // Get nearest expiration
      const nearestExpiration = expirations[0];
      optionsData = await this.tradierClient.getOptionsChains(ticker, nearestExpiration);
    }
    
    // Get earnings data from EODHD (historical earnings surprises)
    const earningsData = await this.eodhdClient.getEarnings(null, null, ticker);
    const earningsTrends = await this.eodhdClient.getEarningsTrends(ticker);
    
    // Get news data from Benzinga (rich metadata with stock tagging)
    const newsData = await this.benzingaClient.getNewsBlocks(
      24 * 60, // Last 24 hours
      { tickers: ticker }
    );
    
    // Note: Pattern recognition is marked as "Broken" in EODHD
    // Use custom implementation in PatternRecognitionService
    const patternData = await this.patternRecognitionService.detectPatterns(historicalData);
    
    // Process all collected data
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
    
    // Process options data using OptionsService
    const processedOptionsData = optionsData ? this.optionsService.extractOptionsData(optionsData.options.option) : null;
    
    const processedEarningsData = this.processEarningsData(earningsData, earningsTrends);
    
    const processedNewsData = this.processNewsData(newsData);
    
    // Calculate day trading metrics using ScoringService
    const dayTradingMetrics = this.calculateDayTradingMetrics(
      priceData,
      technicalIndicators,
      historicalData,
      volumeData
    );
    
    // Construct and return complete stock object
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

  // New helper methods for enhanced data processing

  private processCompanyInfo(fundamentals: any): CompanyInfo {
    return {
      name: fundamentals.General.Name,
      sector: fundamentals.General.Sector || 'Unknown',
      industry: fundamentals.General.Industry || 'Unknown',
      marketCap: fundamentals.Highlights?.MarketCapitalization || 0,
      floatShares: fundamentals.SharesStats?.SharesFloat || 0,
      employees: fundamentals.General.FullTimeEmployees,
      description: fundamentals.General.Description
    };
  }

  private processEnhancedPriceData(
    quoteData: any,
    preMarketData: any,
    intradayCandles: IntradayCandle[],
    firstHourMetrics: any,
    vwap: number,
    gapMetrics: any,
    sma20Data: any,
    sma50Data: any,
    sma200Data: any
  ): EnhancedPriceData {
    // Process pre-market price
    const preMarketPrice = preMarketData.price;
    
    // Get previous close
    const previousClose = quoteData.prevclose;
    
    // Get open price
    const openPrice = quoteData.open;
    
    // Current price
    const currentPrice = quoteData.last;
    
    // Day range
    const dayRange = {
      low: quoteData.low,
      high: quoteData.high
    };
    
    // Calculate moving averages (use most recent values)
    const movingAverages: Record<string, number> = {
      'ma20': sma20Data[sma20Data.length - 1]?.sma || 0,
      'ma50': sma50Data[sma50Data.length - 1]?.sma || 0,
      'ma200': sma200Data[sma200Data.length - 1]?.sma || 0
    };
    
    return {
      previousClose,
      preMarket: preMarketPrice,
      open: openPrice,
      current: currentPrice,
      dayRange,
      movingAverages,
      intraday: {
        candles: intradayCandles,
        openingRange: {
          high: firstHourMetrics.highPrice,
          low: firstHourMetrics.lowPrice,
          breakout: firstHourMetrics.breakout
        },
        vwap
      },
      gapMetrics
    };
  }

  /**
   * Calculate enhanced relative volume metrics using historical data
   * This method performs detailed statistical analysis on volume patterns
   * to provide more accurate relative volume measurements
   */
  private calculateRelativeVolume(
    currentVolume: number,
    historicalData: any[],
    time?: string
  ): {
    relativeVolume: number;
    avgVolume: number;
    volumePercentile: number;
    volumeTrend: 'increasing' | 'decreasing' | 'stable';
    abnormalVolume: boolean;
    timeRelativeVolume: number;
  } {
    // Default return if no historical data
    if (!historicalData || historicalData.length === 0) {
      return {
        relativeVolume: 0,
        avgVolume: 0,
        volumePercentile: 0,
        volumeTrend: 'stable',
        abnormalVolume: false,
        timeRelativeVolume: 0
      };
    }
    
    // Sort historical data by date (newest first)
    const sortedData = [...historicalData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Get the most recent 10 trading days
    const recent10DaysData = sortedData.slice(0, Math.min(sortedData.length, 10));
    
    // Extract volumes
    const volumes = recent10DaysData.map(day => day.volume);
    
    // Calculate 10-day average volume
    const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
    const avgVolume = totalVolume / volumes.length;
    
    // Calculate basic relative volume
    const relativeVolume = avgVolume > 0 ? currentVolume / avgVolume : 0;
    
    // Calculate volume standard deviation for better outlier detection
    let volumeStdDev = 0;
    if (volumes.length > 1) {
      const squaredDiffs = volumes.map(vol => Math.pow(vol - avgVolume, 2));
      const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / volumes.length;
      volumeStdDev = Math.sqrt(variance);
    }
    
    // Determine if current volume is abnormal (greater than 2 standard deviations from mean)
    const abnormalVolume = Math.abs(currentVolume - avgVolume) > volumeStdDev * 2;
    
    // Calculate volume percentile (what percentile of the last 10 days is today's volume?)
    const sortedVolumes = [...volumes].sort((a, b) => a - b);
    let volumePercentile = 0;
    
    for (let i = 0; i < sortedVolumes.length; i++) {
      if (currentVolume <= sortedVolumes[i]) {
        volumePercentile = (i / sortedVolumes.length) * 100;
        break;
      }
    }
    
    // If current volume is higher than all historical volumes
    if (volumePercentile === 0 && currentVolume > sortedVolumes[sortedVolumes.length - 1]) {
      volumePercentile = 100;
    }
    
    // Calculate volume trend over the last 5 days
    let volumeTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (volumes.length >= 5) {
      const last5Volumes = volumes.slice(0, 5);
      
      // Simple linear regression
      const xValues = [0, 1, 2, 3, 4]; // Indices
      const yValues = last5Volumes;
      
      const n = xValues.length;
      const sumX = xValues.reduce((sum, x) => sum + x, 0);
      const sumY = yValues.reduce((sum, y) => sum + y, 0);
      const sumXY = xValues.reduce((sum, x, i) => sum + (x * yValues[i]), 0);
      const sumXX = xValues.reduce((sum, x) => sum + (x * x), 0);
      
      // Calculate slope
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      
      // Determine trend based on slope
      if (slope > avgVolume * 0.05) { // 5% of average volume as threshold
        volumeTrend = 'increasing';
      } else if (slope < -avgVolume * 0.05) {
        volumeTrend = 'decreasing';
      }
    }
    
    // Calculate time-specific relative volume if time is provided
    // This compares current volume to typical volume at this time of day
    let timeRelativeVolume = relativeVolume;
    if (time) {
      // In a real implementation, this would use historical intraday data
      // to compare current volume at specific time to average volume at same time
      // For now, use a simplified approximation based on time of day
      const hour = parseInt(time.split(':')[0]);
      
      // Adjust for typical U-shaped volume curve (high at open and close)
      if (hour < 10) { // Morning (9:30-10:00)
        timeRelativeVolume = relativeVolume / 1.2; // Morning typically has 20% higher volume
      } else if (hour >= 15) { // Afternoon (15:00-16:00)
        timeRelativeVolume = relativeVolume / 1.1; // Afternoon typically has 10% higher volume
      }
    }
    
    return {
      relativeVolume: parseFloat(relativeVolume.toFixed(2)),
      avgVolume: parseFloat(avgVolume.toFixed(0)),
      volumePercentile: parseFloat(volumePercentile.toFixed(0)),
      volumeTrend,
      abnormalVolume,
      timeRelativeVolume: parseFloat(timeRelativeVolume.toFixed(2))
    };
  }

  private processEnhancedVolumeData(
    quoteData: any,
    preMarketData: any,
    historicalData: any,
    volumeDistribution: any
  ): EnhancedVolumeData {
    // Get pre-market volume
    const preMarketVolume = preMarketData.volume || 0;
    
    // Current volume
    const currentVolume = quoteData.volume || 0;
    
    // Get current time
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;
    
    // Calculate enhanced relative volume using historical EODHD data
    const relativeVolumeMetrics = this.calculateRelativeVolume(
      currentVolume,
      historicalData,
      currentTime
    );
    
    // Create volume profile data for display
    const volumeProfile = volumeDistribution.volumeProfile;
    
    // Calculate intraday volume acceleration (comparing current period to previous)
    let volumeAcceleration = 0;
    if (volumeDistribution.volumeProfile && volumeDistribution.volumeProfile.length >= 2) {
      const recentPeriod = volumeDistribution.volumeProfile[volumeDistribution.volumeProfile.length - 1];
      const previousPeriod = volumeDistribution.volumeProfile[volumeDistribution.volumeProfile.length - 2];
      
      if (previousPeriod.volume > 0) {
        volumeAcceleration = ((recentPeriod.volume - previousPeriod.volume) / previousPeriod.volume) * 100;
      }
    }
    
    return {
      preMarket: preMarketVolume,
      current: currentVolume,
      avg10d: relativeVolumeMetrics.avgVolume,
      relativeVolume: relativeVolumeMetrics.relativeVolume,
      volumePercentile: relativeVolumeMetrics.volumePercentile,
      abnormalVolume: relativeVolumeMetrics.abnormalVolume,
      volumeTrend: relativeVolumeMetrics.volumeTrend,
      volumeAcceleration: parseFloat(volumeAcceleration.toFixed(2)),
      timeRelativeVolume: relativeVolumeMetrics.timeRelativeVolume,
      distribution: {
        firstHourPercent: volumeDistribution.firstHourVolume > 0 ?
          (volumeDistribution.firstHourVolume / currentVolume) * 100 : 0,
        middayPercent: volumeDistribution.middayVolume > 0 ?
          (volumeDistribution.middayVolume / currentVolume) * 100 : 0,
        lastHourPercent: volumeDistribution.lastHourVolume > 0 ?
          (volumeDistribution.lastHourVolume / currentVolume) * 100 : 0
      },
      volumeProfile
    };
  }

  private processEnhancedTechnicalIndicators(
    rsiData: any,
    rsiSlope: number,
    macdData: any,
    atrData: any,
    bollingerBands: any,
    adxData: any,
    patternData: any,
    quoteData: any,
    priceData: EnhancedPriceData
  ): EnhancedTechnicalIndicators {
    // Extract latest indicator values
    const rsi = rsiData[rsiData.length - 1]?.rsi || 50;
    
    const macd = {
      line: macdData[macdData.length - 1]?.macd || 0,
      signal: macdData[macdData.length - 1]?.signal || 0,
      histogram: macdData[macdData.length - 1]?.divergence || 0
    };
    
    // Determine MACD histogram direction
    let histogramDirection: 'up' | 'down' | 'flat' = 'flat';
    if (macdData && macdData.length >= 2) {
      const currentHist = macdData[macdData.length - 1]?.divergence || 0;
      const prevHist = macdData[macdData.length - 2]?.divergence || 0;
      
      if (currentHist > prevHist + 0.01) {
        histogramDirection = 'up';
      } else if (currentHist < prevHist - 0.01) {
        histogramDirection = 'down';
      }
    }
    
    const atr = atrData[atrData.length - 1]?.atr || 0;
    const atrPercent = quoteData.last > 0 ? (atr / quoteData.last) * 100 : 0;
    
    const lastBB = bollingerBands[bollingerBands.length - 1] || {
      lband: 0,
      mband: 0,
      uband: 0
    };
    
    // Calculate percentB (where price is within Bollinger Bands)
    const price = quoteData.last;
    let percentB = 0.5;
    if (lastBB.uband > lastBB.lband) {
      percentB = (price - lastBB.lband) / (lastBB.uband - lastBB.lband);
    }
    
    const bollinger = {
      upper: lastBB.uband,
      middle: lastBB.mband,
      lower: lastBB.lband,
      width: lastBB.mband > 0 ? (lastBB.uband - lastBB.lband) / lastBB.mband : 0,
      percentB
    };
    
    const adx = adxData[adxData.length - 1]?.adx || 0;
    
    // Calculate price location metrics
    const highestPrice = quoteData.week_52_high || 0;
    const lowestPrice = quoteData.week_52_low || 0;
    
    let percentFromHigh = 0;
    if (highestPrice > 0) {
      percentFromHigh = ((highestPrice - price) / highestPrice) * 100;
    }
    
    let percentFromLow = 0;
    if (lowestPrice > 0 && price > lowestPrice) {
      percentFromLow = ((price - lowestPrice) / lowestPrice) * 100;
    }
    
    // Determine relative to VWAP
    const relativeToVwap = price > priceData.intraday.vwap ? 'above' : 'below';
    
    // Determine relative to moving averages
    const relativeToMA: Record<string, 'above' | 'below'> = {};
    for (const [key, value] of Object.entries(priceData.movingAverages)) {
      relativeToMA[key] = price > value ? 'above' : 'below';
    }
    
    // Calculate pattern strength (0-1)
    const patternStrength = this.calculatePatternStrength(patternData);
    
    return {
      rsi,
      rsiSlope,
      macd: {
        line: parseFloat(macd.line.toFixed(2)),
        signal: parseFloat(macd.signal.toFixed(2)),
        histogram: parseFloat(macd.histogram.toFixed(2)),
        histogramDirection
      },
      atr: parseFloat(atr.toFixed(2)),
      atrPercent: parseFloat(atrPercent.toFixed(2)),
      bollingerBands: {
        upper: parseFloat(bollinger.upper.toFixed(2)),
        middle: parseFloat(bollinger.middle.toFixed(2)),
        lower: parseFloat(bollinger.lower.toFixed(2)),
        width: parseFloat(bollinger.width.toFixed(2)),
        percentB: parseFloat(bollinger.percentB.toFixed(2))
      },
      adx: parseFloat(adx.toFixed(2)),
      patternRecognition: {
        bullishPatterns: patternData.bullish_patterns || [],
        bearishPatterns: patternData.bearish_patterns || [],
        consolidationPatterns: patternData.consolidation_patterns || [],
        patternStrength
      },
      priceLocation: {
        percentFromHigh: parseFloat(percentFromHigh.toFixed(2)),
        percentFromLow: parseFloat(percentFromLow.toFixed(2)),
        relativeToVwap,
        relativeToMA
      }
    };
  }

  private processEnhancedOptionsData(
    optionsData: any[],
    impliedVolatilityData: any
  ): EnhancedOptionsData {
    // Use OptionsService to extract basic data
    const basicOptionsData = this.optionsService.extractOptionsData(optionsData);
    
    // Split into calls and puts
    const calls = optionsData.filter(opt => opt.option_type === 'call');
    const puts = optionsData.filter(opt => opt.option_type === 'put');
    
    // Calculate implied volatility metrics
    const impliedVolatility = impliedVolatilityData?.current || 0;
    const impliedVolatilityChange = impliedVolatilityData?.change || 0;
    
    // Calculate nearest strikes (closest to current price)
    const nearestStrikes = this.getNearestStrikes(optionsData, 3);
    
    return {
      callPutRatio: basicOptionsData.call_put_ratio,
      impliedVolatility,
      impliedVolatilityChange,
      unusualActivity: basicOptionsData.unusual_activity,
      optionsFlow: {
        bullishFlowPercent: basicOptionsData.options_flow.bullish_flow_percent,
        bearishFlowPercent: 100 - basicOptionsData.options_flow.bullish_flow_percent,
        volumeOpenInterestRatio: this.calculateVolumeOpenInterestRatio(optionsData)
      },
      nearestStrikes
    };
  }

  private calculateAIPredictionMetrics(
    priceData: EnhancedPriceData,
    technicalIndicators: EnhancedTechnicalIndicators,
    volumeData: EnhancedVolumeData
  ): AIPredictionMetrics {
    // Calculate volatility score
    const priceVolatilityScore = this.scoringService.calculateVolatilityScore(
      technicalIndicators.atr,
      technicalIndicators.bollingerBands,
      priceData.current,
      [], // Not using historical data here
      volumeData.avg10d,
      volumeData.current
    );
    
    // Calculate trend strength score using ADX and moving averages
    const trendStrengthScore = this.calculateTrendStrengthScore(
      technicalIndicators.adx,
      priceData.movingAverages,
      priceData.current
    );
    
    // Calculate momentum score using RSI, MACD, and price performance
    const momentumScore = this.calculateMomentumScore(
      technicalIndicators.rsi,
      technicalIndicators.rsiSlope,
      technicalIndicators.macd
    );
    
    // Calculate technical setup score
    const technicalSetupScore = this.scoringService.calculateTechnicalSetupScore(
      technicalIndicators.rsi,
      technicalIndicators.macd,
      technicalIndicators.adx,
      technicalIndicators.patternRecognition,
      priceData.current,
      priceData.movingAverages
    );
    
    // Sentiment score would require NLP on news data
    // For now, use a simple approximation based on price action and volume
    const sentimentScore = this.calculateSimpleSentiment(
      priceData,
      volumeData
    );
    
    // Calculate prediction confidence by combining multiple signals
    const predictionConfidence = this.calculatePredictionConfidence(
      priceVolatilityScore,
      trendStrengthScore,
      momentumScore,
      technicalSetupScore,
      sentimentScore
    );
    
    return {
      priceVolatilityScore: parseFloat(priceVolatilityScore.toFixed(2)),
      trendStrengthScore: parseFloat(trendStrengthScore.toFixed(2)),
      momentumScore: parseFloat(momentumScore.toFixed(2)),
      technicalSetupScore: parseFloat(technicalSetupScore.toFixed(2)),
      sentimentScore: parseFloat(sentimentScore.toFixed(2)),
      predictionConfidence: parseFloat(predictionConfidence.toFixed(2))
    };
  }

  // Legacy helper methods for data processing remain unchanged

  private processPriceData(quoteData: any, preMarketData: any, historicalData: any, intradayData: any, 
                         sma20Data: any, sma50Data: any, today: Date): PriceData {
    // Process pre-market price
    const preMarketPrice = preMarketData.price;
    
    // Get previous close
    const previousClose = quoteData.prevclose;
    
    // Current price
    const currentPrice = quoteData.last;
    
    // Day range
    const dayRange = {
      low: quoteData.low,
      high: quoteData.high
    };
    
    // Calculate moving averages (use most recent values)
    const movingAverages = {
      ma_20: sma20Data[sma20Data.length - 1]?.sma || 0,
      ma_50: sma50Data[sma50Data.length - 1]?.sma || 0
    };
    
    // Calculate opening range (first hour high/low)
    // Extract first hour data from intraday data
    const marketOpen = getMarketOpenTime();
    const firstHourEnd = new Date(today);
    firstHourEnd.setHours(marketOpen.getHours() + 1);
    
    // Filter intraday data for first hour
    const firstHourData = intradayData.data.filter(
      d => new Date(d.time) >= marketOpen && new Date(d.time) <= firstHourEnd
    );
    
    // Calculate opening range high and low
    let openingRangeHigh = 0;
    let openingRangeLow = Infinity;
    
    for (const data of firstHourData) {
      if (data.high && data.high > openingRangeHigh) openingRangeHigh = data.high;
      if (data.low && data.low < openingRangeLow) openingRangeLow = data.low;
    }
    
    // If we couldn't find first hour data, use day range
    if (openingRangeLow === Infinity) {
      openingRangeHigh = dayRange.high;
      openingRangeLow = dayRange.low;
    }
    
    // Determine if price broke out of opening range
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
          breakout: breakout
        },
        vwap: intradayData.vwap || 0
      }
    };
  }
  
  private processVolumeData(quoteData: any, preMarketData: any, historicalData: any, today: Date): VolumeData {
    // Get pre-market volume
    const preMarketVolume = preMarketData.volume || 0;
    
    // Current volume
    const currentVolume = quoteData.volume || 0;
    
    // Calculate average 10-day volume
    let avg10DayVolume = 0;
    if (historicalData && historicalData.length >= 10) {
      const last10Days = historicalData.slice(0, 10);
      const totalVolume = last10Days.reduce((sum: number, day: any) => sum + day.volume, 0);
      avg10DayVolume = totalVolume / 10;
    } else {
      // Fallback to Tradier's average volume
      avg10DayVolume = quoteData.average_volume || 0;
    }
    
    // Calculate relative volume
    const relativeVolume = avg10DayVolume > 0 ? currentVolume / avg10DayVolume : 0;
    
    // Calculate first hour volume percentage
    // This calculation requires intraday data with volume by time period
    // Simple approximation: if we're early in the day, assume first hour is 25% of volume
    // For more accurate calculation, we'd need to use Tradier's getTimeSales with proper filtering
    const firstHourVolumePercent = 0.25; // Placeholder - would be more accurate with full data
    
    return {
      pre_market: preMarketVolume,
      current: currentVolume,
      avg_10d: avg10DayVolume,
      relative_volume: parseFloat(relativeVolume.toFixed(2)),
      volume_distribution: {
        first_hour_percent: firstHourVolumePercent
      }
    };
  }

  private processTechnicalIndicators(rsiData: any, macdData: any, atrData: any, bollingerBands: any, 
                                   adxData: any, patternData: any, historicalData?: any): TechnicalIndicators {
    // Extract latest indicator values
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

  private processOptionsData(optionsData: any[]): OptionsData {
    // Use OptionsService to extract relevant data
    return this.optionsService.extractOptionsData(optionsData);
  }

  private processEarningsData(earningsData: any, earningsTrends: any): EarningsData {
    // Find most recent earnings report
    let recentReport = {
      date: 'N/A',
      eps: {
        actual: 0,
        estimate: 0,
        surprise_percent: 0
      }
    };
    
    if (earningsData && earningsData.earnings && earningsData.earnings.length > 0) {
      // Sort by report date (descending)
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
      next_report_date: null, // Would need a separate endpoint for future earnings dates
      trends: earningsTrends?.trends || []
    };
  }

  private processNewsData(newsData: any): NewsData {
    // Process recent articles
    const recentArticles = newsData.map((item: any) => ({
      date: item.created,
      title: item.title,
      teaser: item.teaser,
      content: item.bodyMarkdown ? item.bodyMarkdown.substring(0, 200) + '...' : '',
      link: item.url,
      symbols: item.stocks ? item.stocks.map((s: any) => s.name) : [],
      tags: item.tags ? item.tags.map((t: any) => t.name) : []
    }));
    
    // Note: Sentiment analysis requires custom implementation
    // Benzinga doesn't provide sentiment scores
    // Implementation Gap: News sentiment analysis
    
    return {
      recent_articles: recentArticles,
      // Simple classification based on recent news volume
      material_news_classification: recentArticles.length > 5 ? 'high_activity' : 'normal'
    };
  }

  private calculateDayTradingMetrics(priceData: PriceData, technicalIndicators: TechnicalIndicators, 
                                  historicalData: any, volumeData: VolumeData): DayTradingMetrics {
    // Calculate volatility score using ScoringService
    const volatilityScore = this.scoringService.calculateVolatilityScore(
      technicalIndicators.atr_14,
      technicalIndicators.bollinger_bands,
      priceData.current,
      historicalData,
      volumeData.avg_10d,
      volumeData.current
    );
    
    // Calculate technical setup score
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

  // Advanced AI-specific helper methods

  private calculateVWAP(candles: IntradayCandle[]): number {
    if (!candles || candles.length === 0) {
      return 0;
    }
    
    let totalVolume = 0;
    let volumePriceSum = 0;
    
    for (const candle of candles) {
      totalVolume += candle.volume;
      // Use typical price (high + low + close) / 3 for VWAP calculation
      const typicalPrice = (candle.high + candle.low + candle.close) / 3;
      volumePriceSum += typicalPrice * candle.volume;
    }
    
    if (totalVolume === 0) {
      return 0;
    }
    
    return parseFloat((volumePriceSum / totalVolume).toFixed(2));
  }

  private calculateRSISlope(rsiData: any[]): number {
    if (!rsiData || rsiData.length < 5) {
      return 0;
    }
    
    // Use the last 5 RSI values to calculate slope
    const recentRSI = rsiData.slice(-5);
    
    // Extract RSI values
    const values = recentRSI.map(data => data.rsi);
    
    // Simple linear regression for slope
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i + 1);
    
    const sumX = indices.reduce((sum, x) => sum + x, 0);
    const sumY = values.reduce((sum, y) => sum + y, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + (x * values[i]), 0);
    const sumXX = indices.reduce((sum, x) => sum + (x * x), 0);
    
    // Calculate slope
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    return parseFloat(slope.toFixed(2));
  }

  private calculateImpliedVolatilityMetrics(optionsData: any[]): {
    current: number;
    change: number;
  } {
    if (!optionsData || optionsData.length === 0) {
      return {
        current: 0,
        change: 0
      };
    }
    
    // Filter for ATM options (near the money)
    const atmOptions = optionsData.filter(option => option.greeks &&
      Math.abs(option.delta - 0.5) < 0.2 // Delta close to 0.5 means near the money
    );
    
    if (atmOptions.length === 0) {
      return {
        current: 0,
        change: 0
      };
    }
    
    // Average the IV of ATM options
    let totalIV = 0;
    let count = 0;
    
    for (const option of atmOptions) {
      if (option.greeks && option.greeks.mid_iv) {
        totalIV += option.greeks.mid_iv;
        count++;
      }
    }
    
    const avgIV = count > 0 ? totalIV / count : 0;
    
    // Calculate IV change (ideally would compare to historical IV)
    // Without historical data, use a simple approximation by comparing calls vs puts
    const callIV = this.averageIV(atmOptions.filter(o => o.option_type === 'call'));
    const putIV = this.averageIV(atmOptions.filter(o => o.option_type === 'put'));
    
    // IV skew (call IV vs put IV) can indicate expected direction
    const ivChange = callIV - putIV;
    
    return {
      current: parseFloat(avgIV.toFixed(2)),
      change: parseFloat(ivChange.toFixed(2))
    };
  }
  
  private averageIV(options: any[]): number {
    if (!options || options.length === 0) {
      return 0;
    }
    
    let totalIV = 0;
    let count = 0;
    
    for (const option of options) {
      if (option.greeks && option.greeks.mid_iv) {
        totalIV += option.greeks.mid_iv;
        count++;
      }
    }
    
    return count > 0 ? totalIV / count : 0;
  }

  private getNearestStrikes(optionsData: any[], count: number): {
    strike: number;
    callVolume: number;
    putVolume: number;
    callOI: number;
    putOI: number;
  }[] {
    if (!optionsData || optionsData.length === 0) {
      return [];
    }
    
    // Get the underlying price by looking at the first option
    const underlyingPrice = optionsData[0].underlying_price ||
                           optionsData[0].quote?.last || 0;
    
    if (underlyingPrice === 0) {
      return [];
    }
    
    // Get unique strike prices
    const strikes = [...new Set(optionsData.map(o => o.strike))];
    
    // Sort by distance from current price
    strikes.sort((a, b) =>
      Math.abs(a - underlyingPrice) - Math.abs(b - underlyingPrice)
    );
    
    // Take the nearest strikes
    const nearestStrikes = strikes.slice(0, count);
    
    // Gather data for each strike
    return nearestStrikes.map(strike => {
      const strikeCalls = optionsData.filter(
        o => o.strike === strike && o.option_type === 'call'
      );
      
      const strikePuts = optionsData.filter(
        o => o.strike === strike && o.option_type === 'put'
      );
      
      const callVolume = strikeCalls.reduce((sum, o) => sum + (o.volume || 0), 0);
      const putVolume = strikePuts.reduce((sum, o) => sum + (o.volume || 0), 0);
      const callOI = strikeCalls.reduce((sum, o) => sum + (o.open_interest || 0), 0);
      const putOI = strikePuts.reduce((sum, o) => sum + (o.open_interest || 0), 0);
      
      return {
        strike,
        callVolume,
        putVolume,
        callOI,
        putOI
      };
    });
  }

  private calculateVolumeOpenInterestRatio(optionsData: any[]): number {
    if (!optionsData || optionsData.length === 0) {
      return 0;
    }
    
    const totalVolume = optionsData.reduce((sum, o) => sum + (o.volume || 0), 0);
    const totalOI = optionsData.reduce((sum, o) => sum + (o.open_interest || 0), 0);
    
    if (totalOI === 0) {
      return 0;
    }
    
    return parseFloat((totalVolume / totalOI).toFixed(2));
  }

  private calculatePatternStrength(patternData: any): number {
    if (!patternData) {
      return 0;
    }
    
    // Count patterns
    const bullishCount = patternData.bullish_patterns?.length || 0;
    const bearishCount = patternData.bearish_patterns?.length || 0;
    const consolidationCount = patternData.consolidation_patterns?.length || 0;
    
    // Weight the count (bullish and bearish patterns are stronger signals)
    const weightedCount = (bullishCount * 2) + (bearishCount * 2) + consolidationCount;
    
    // Normalize to 0-1 range
    return Math.min(weightedCount / 10, 1);
  }

  private calculateTrendStrengthScore(
    adx: number,
    movingAverages: Record<string, number>,
    currentPrice: number
  ): number {
    // ADX above 25 indicates strong trend
    const adxStrength = adx > 30 ? 0.9 :
                       adx > 25 ? 0.7 :
                       adx > 20 ? 0.5 :
                       adx > 15 ? 0.3 : 0.1;
    
    // Check for proper moving average alignment
    // (MA20 > MA50 > MA200 indicates strong uptrend)
    const ma20 = movingAverages['ma20'] || 0;
    const ma50 = movingAverages['ma50'] || 0;
    const ma200 = movingAverages['ma200'] || 0;
    
    let maAlignment = 0;
    if (ma20 > ma50 && ma50 > ma200) {
      // Strong uptrend alignment
      maAlignment = 0.9;
    } else if (ma20 > ma50) {
      // Medium-term uptrend
      maAlignment = 0.7;
    } else if (ma20 < ma50 && ma50 < ma200) {
      // Strong downtrend alignment
      maAlignment = 0.2; // Lower score for downtrend
    } else if (ma20 < ma50) {
      // Medium-term downtrend
      maAlignment = 0.3;
    } else {
      // No clear trend alignment
      maAlignment = 0.5;
    }
    
    // Check price relative to key moving averages
    const priceAboveMa20 = currentPrice > ma20;
    const priceAboveMa50 = currentPrice > ma50;
    const priceAboveMa200 = currentPrice > ma200;
    
    const priceMAScore = (priceAboveMa20 ? 0.33 : 0) +
                         (priceAboveMa50 ? 0.33 : 0) +
                         (priceAboveMa200 ? 0.34 : 0);
    
    // Combine factors with weights
    const weights = {
      adx: 0.4,         // ADX is primary trend strength indicator
      maAlignment: 0.3, // MA alignment is good confirmation
      priceMA: 0.3      // Price relative to MAs
    };
    
    return (adxStrength * weights.adx) +
           (maAlignment * weights.maAlignment) +
           (priceMAScore * weights.priceMA);
  }

  private calculateMomentumScore(
    rsi: number,
    rsiSlope: number,
    macd: { line: number; signal: number; histogram: number; histogramDirection: string }
  ): number {
    // RSI momentum score (higher when RSI is trending strongly)
    const rsiScore = (rsi > 70) ? 0.9 :  // Overbought - strong bullish momentum
                    (rsi > 60) ? 0.7 :   // Strong bullish momentum
                    (rsi > 50) ? 0.6 :   // Moderate bullish momentum
                    (rsi > 40) ? 0.4 :   // Moderate bearish momentum
                    (rsi > 30) ? 0.3 :   // Strong bearish momentum
                    0.1;                 // Oversold - strong bearish momentum
    
    // RSI slope (change) score
    const rsiSlopeScore = (rsiSlope > 3) ? 0.9 :   // Strong upward momentum
                         (rsiSlope > 1) ? 0.7 :    // Moderate upward momentum
                         (rsiSlope > -1) ? 0.5 :   // Flat momentum
                         (rsiSlope > -3) ? 0.3 :   // Moderate downward momentum
                         0.1;                      // Strong downward momentum
    
    // MACD momentum score
    const macdScore = (macd.histogram > 0.5 && macd.histogramDirection === 'up') ? 0.9 :  // Strong bullish
                     (macd.histogram > 0 && macd.histogramDirection === 'up') ? 0.7 :     // Moderate bullish
                     (macd.histogram > 0) ? 0.6 :                                         // Weakly bullish
                     (macd.histogram > -0.5) ? 0.4 :                                      // Weakly bearish
                     (macd.histogram > -1) ? 0.3 :                                        // Moderate bearish
                     0.1;                                                                 // Strong bearish
    
    // MACD crossover score
    const macdCrossover = macd.line > macd.signal ? 0.7 : 0.3;
    
    // Combine factors with weights
    const weights = {
      rsi: 0.3,
      rsiSlope: 0.3,
      macd: 0.3,
      macdCrossover: 0.1
    };
    
    return (rsiScore * weights.rsi) +
           (rsiSlopeScore * weights.rsiSlope) +
           (macdScore * weights.macd) +
           (macdCrossover * weights.macdCrossover);
  }

  private calculateSimpleSentiment(
    priceData: EnhancedPriceData,
    volumeData: EnhancedVolumeData
  ): number {
    // Simple sentiment indicators:
    // 1. Price vs Previous Close
    const priceChange = ((priceData.current - priceData.previousClose) / priceData.previousClose) * 100;
    const priceChangeScore = (priceChange > 3) ? 0.9 :
                            (priceChange > 1) ? 0.7 :
                            (priceChange > 0) ? 0.6 :
                            (priceChange > -1) ? 0.4 :
                            (priceChange > -3) ? 0.2 :
                            0.1;
    
    // 2. Price vs VWAP
    const vwapScore = priceData.current > priceData.intraday.vwap ? 0.7 : 0.3;
    
    // 3. Volume ratio
    const volumeScore = (volumeData.relativeVolume > 2) ? 0.9 :
                       (volumeData.relativeVolume > 1.5) ? 0.8 :
                       (volumeData.relativeVolume > 1) ? 0.7 :
                       (volumeData.relativeVolume > 0.8) ? 0.5 :
                       (volumeData.relativeVolume > 0.5) ? 0.3 :
                       0.2;
    
    // 4. Breakout from opening range
    const breakoutScore = priceData.intraday.openingRange.breakout ? 0.8 : 0.5;
    
    // Weights
    const weights = {
      priceChange: 0.4,
      vwap: 0.2,
      volume: 0.2,
      breakout: 0.2
    };
    
    return (priceChangeScore * weights.priceChange) +
           (vwapScore * weights.vwap) +
           (volumeScore * weights.volume) +
           (breakoutScore * weights.breakout);
  }

  private calculatePredictionConfidence(
    volatilityScore: number,
    trendScore: number,
    momentumScore: number,
    technicalScore: number,
    sentimentScore: number
  ): number {
    // Higher confidence when multiple signals align
    // Penalize high volatility with low trend strength
    
    // Confidence in trend direction
    const trendConfidence = (trendScore > 0.7 && momentumScore > 0.7) ? 0.9 :
                           (trendScore > 0.6 && momentumScore > 0.6) ? 0.8 :
                           (trendScore > 0.5 && momentumScore > 0.5) ? 0.7 :
                           0.5;
    
    // Confidence based on technical setup
    const setupConfidence = (technicalScore > 0.8) ? 0.9 :
                           (technicalScore > 0.7) ? 0.8 :
                           (technicalScore > 0.6) ? 0.7 :
                           (technicalScore > 0.5) ? 0.6 :
                           0.5;
    
    // Higher confidence with sentiment alignment
    const alignedSentiment = (
      (trendScore > 0.6 && sentimentScore > 0.6) ||
      (trendScore < 0.4 && sentimentScore < 0.4)
    );
    
    const sentimentFactor = alignedSentiment ? 1.1 : 0.9;
    
    // Higher volatility = higher uncertainty = lower confidence
    // But some volatility is needed for meaningful movement
    const volatilityFactor = (volatilityScore > 0.8) ? 0.8 :
                            (volatilityScore > 0.6) ? 0.9 :
                            (volatilityScore > 0.4) ? 1.0 :
                            (volatilityScore > 0.2) ? 0.9 :
                            0.7;
    
    // Base confidence from trend and setup
    const baseConfidence = (trendConfidence * 0.6) + (setupConfidence * 0.4);
    
    // Apply sentiment and volatility modifiers
    return Math.min(baseConfidence * sentimentFactor * volatilityFactor, 0.95);
  }
}

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
    // Algorithm to calculate volatility score:
    
    // 1. Normalize ATR as percentage of price
    const atrPercent = currentPrice > 0 ? atr / currentPrice : 0;
    
    // 2. Use Bollinger Band width as volatility measure
    const bbWidth = bollingerBands.width;
    
    // 3. Calculate historical price volatility
    let priceVolatility = 0;
    if (historicalPrices && historicalPrices.length > 0) {
      const ranges = historicalPrices.map(p => (p.high - p.low) / ((p.high + p.low) / 2));
      const avgRange = ranges.reduce((sum, range) => sum + range, 0) / ranges.length;
      priceVolatility = avgRange;
    }
    
    // 4. Calculate relative volume ratio
    const volumeRatio = avgVolume > 0 ? currentVolume / avgVolume : 1;
    
    // 5. Combine factors with weights
    const factors = [
      { value: atrPercent * 10, weight: 0.3 },    // ATR percentage (scaled)
      { value: bbWidth, weight: 0.3 },           // BB width
      { value: priceVolatility * 10, weight: 0.2 }, // Historical volatility (scaled)
      { value: Math.min(volumeRatio / 3, 1), weight: 0.2 } // Volume ratio (capped)
    ];
    
    // Calculate weighted average
    const weightedSum = factors.reduce((sum, factor) => sum + factor.value * factor.weight, 0);
    const weightSum = factors.reduce((sum, factor) => sum + factor.weight, 0);
    
    // Normalize to 0-1 range, capping at 1
    return Math.min(weightedSum / weightSum, 1);
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
    // Algorithm to calculate technical setup score:
    
    // 1. Evaluate RSI setup (bullish when RSI is recovering from oversold)
    const rsiScore = (rsi >= 40 && rsi <= 60) ? 0.7 : // Neutral zone
                    (rsi > 60 && rsi < 70) ? 0.9 :   // Bullish but not overbought
                    (rsi >= 30 && rsi < 40) ? 0.6 :  // Recovering from oversold
                    (rsi < 30) ? 0.3 :               // Oversold
                    (rsi >= 70) ? 0.4 : 0.5;         // Overbought
    
    // 2. Evaluate MACD setup
    // Bullish when MACD line crosses above signal line
    const macdCrossover = macd.line > macd.signal;
    const macdPositive = macd.histogram > 0;
    const macdScore = (macdCrossover && macdPositive) ? 0.9 :
                      (macdCrossover) ? 0.7 :
                      (macdPositive) ? 0.6 : 0.3;
    
    // 3. Evaluate ADX for trend strength
    // ADX > 25 indicates strong trend
    const adxScore = adx > 30 ? 0.9 :
                    adx > 20 ? 0.7 :
                    adx > 15 ? 0.5 : 0.3;
    
    // 4. Evaluate chart patterns
    const bullishPatterns = patterns.bullish_patterns.length;
    const bearishPatterns = patterns.bearish_patterns.length;
    const patternScore = bullishPatterns > bearishPatterns ? 0.8 :
                         bullishPatterns === bearishPatterns ? 0.5 : 0.2;
    
    // 5. Evaluate price relative to moving averages
    // Bullish when price > MA20 > MA50 (uptrend)
    const ma20Above50 = movingAverages.ma_20 > movingAverages.ma_50;
    const priceAboveMAs = price > movingAverages.ma_20;
    const maScore = (priceAboveMAs && ma20Above50) ? 0.9 :
                   (priceAboveMAs) ? 0.7 :
                   (price > movingAverages.ma_50) ? 0.5 : 0.3;
    
    // 6. Combine scores with weights
    const weights = {
      rsi: 0.2,
      macd: 0.25,
      adx: 0.15,
      pattern: 0.2,
      ma: 0.2
    };
    
    const weightedScore = (
      rsiScore * weights.rsi +
      macdScore * weights.macd +
      adxScore * weights.adx +
      patternScore * weights.pattern +
      maScore * weights.ma
    );
    
    // Return normalized score (0-1)
    return Math.min(Math.max(weightedScore, 0), 1);
  }
}
```

### PatternRecognitionService.ts

```typescript
// Service for chart pattern detection
export class PatternRecognitionService {
  // Detect common chart patterns from price data
  /**
   * Implementation Note: The EODHD's pattern_recognition endpoint is marked as "Broken"
   * This service implements custom pattern detection from historical price data
   */
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
    // Check if enough data points (need at least 30 days for reliable patterns)
    if (!priceData || priceData.length < 30) {
      return {
        bullish_patterns: [],
        bearish_patterns: [],
        consolidation_patterns: []
      };
    }
    
    // Sort price data by date (oldest to newest)
    const sortedData = [...priceData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Extract arrays of price components for easier analysis
    const closes = sortedData.map(d => d.close);
    const highs = sortedData.map(d => d.high);
    const lows = sortedData.map(d => d.low);
    const volumes = sortedData.map(d => d.volume);
    
    // Initialize pattern collections
    const bullishPatterns: string[] = [];
    const bearishPatterns: string[] = [];
    const consolidationPatterns: string[] = [];
    
    // Detect Double Bottom (Bullish)
    if (this.detectDoubleBottom(lows, closes)) {
      bullishPatterns.push('Double Bottom');
    }
    
    // Detect Head and Shoulders (Bearish)
    if (this.detectHeadAndShoulders(highs, closes)) {
      bearishPatterns.push('Head and Shoulders');
    }
    
    // Detect Inverse Head and Shoulders (Bullish)
    if (this.detectInverseHeadAndShoulders(lows, closes)) {
      bullishPatterns.push('Inverse Head and Shoulders');
    }
    
    // Detect Bull Flag (Bullish)
    if (this.detectBullFlag(closes, volumes)) {
      bullishPatterns.push('Bull Flag');
    }
    
    // Detect Bear Flag (Bearish)
    if (this.detectBearFlag(closes, volumes)) {
      bearishPatterns.push('Bear Flag');
    }
    
    // Detect Rectangle (Consolidation)
    if (this.detectRectangle(highs, lows)) {
      consolidationPatterns.push('Rectangle');
    }
    
    // Detect Triangle (Consolidation)
    const triangleType = this.detectTriangle(highs, lows);
    if (triangleType === 'ascending') {
      bullishPatterns.push('Ascending Triangle');
    } else if (triangleType === 'descending') {
      bearishPatterns.push('Descending Triangle');
    } else if (triangleType === 'symmetric') {
      consolidationPatterns.push('Symmetric Triangle');
    }
    
    // Detect Cup and Handle (Bullish)
    if (this.detectCupAndHandle(closes)) {
      bullishPatterns.push('Cup and Handle');
    }
    
    // Detect Double Top (Bearish)
    if (this.detectDoubleTop(highs, closes)) {
      bearishPatterns.push('Double Top');
    }
    
    return {
      bullish_patterns: bullishPatterns,
      bearish_patterns: bearishPatterns,
      consolidation_patterns: consolidationPatterns
    };
  }

  // Various pattern detection methods
  private detectDoubleBottom(lows: number[], closes: number[]): boolean {
    // Find local minima in the lows
    const minimaIndices = this.findLocalMinima(lows, 3);
    
    // Need at least 2 minima for a double bottom
    if (minimaIndices.length < 2) return false;
    
    // Look at the last two minima
    const n = minimaIndices.length;
    const firstBottomIdx = minimaIndices[n - 2];
    const secondBottomIdx = minimaIndices[n - 1];
    
    // Bottoms should be at similar levels (within 3%)
    const firstBottomValue = lows[firstBottomIdx];
    const secondBottomValue = lows[secondBottomIdx];
    const percentDiff = Math.abs(secondBottomValue - firstBottomValue) / firstBottomValue * 100;
    const similarBottoms = percentDiff < 3;
    
    // Bottoms should be separated by at least 10 periods
    const adequateSeparation = secondBottomIdx - firstBottomIdx >= 10;
    
    // Price should have risen after the second bottom
    const riseAfterSecondBottom = closes[closes.length - 1] > secondBottomValue * 1.03;
    
    return similarBottoms && adequateSeparation && riseAfterSecondBottom;
  }

  private detectHeadAndShoulders(highs: number[], closes: number[]): boolean {
    // Implementation for Head and Shoulders pattern detection
    // Find 3 peaks with the middle one higher than the others
    // Requires complex analysis of peaks, neckline, volume, etc.
    
    // Simplified check: Look for 3 peaks with middle one higher
    const peakIndices = this.findLocalMaxima(highs, 3);
    
    if (peakIndices.length < 3) return false;
    
    // Get the last 3 peaks
    const n = peakIndices.length;
    const peak1 = peakIndices[n - 3];
    const peak2 = peakIndices[n - 2];
    const peak3 = peakIndices[n - 1];
    
    // Check if middle peak is higher than the other two
    const middlePeakHigher = highs[peak2] > highs[peak1] && highs[peak2] > highs[peak3];
    
    // Check if the first and third peaks are at similar levels
    const p1 = highs[peak1];
    const p3 = highs[peak3];
    const shouldersSimilar = Math.abs(p3 - p1) / p1 < 0.05;
    
    // Price should have fallen after the right shoulder
    const dropAfterRightShoulder = closes[closes.length - 1] < closes[peak3];
    
    return middlePeakHigher && shouldersSimilar && dropAfterRightShoulder;
  }

  // Other pattern detection methods (InverseHeadAndShoulders, BullFlag, etc.) would be implemented similarly

  // Helper methods for pattern detection
  private findLocalMinima(data: number[], window: number = 2): number[] {
    const indices: number[] = [];
    
    for (let i = window; i < data.length - window; i++) {
      let isMinimum = true;
      
      for (let j = i - window; j <= i + window; j++) {
        if (j !== i && data[j] < data[i]) {
          isMinimum = false;
          break;
        }
      }
      
      if (isMinimum) {
        indices.push(i);
      }
    }
    
    return indices;
  }

  private findLocalMaxima(data: number[], window: number = 2): number[] {
    const indices: number[] = [];
    
    for (let i = window; i < data.length - window; i++) {
      let isMaximum = true;
      
      for (let j = i - window; j <= i + window; j++) {
        if (j !== i && data[j] > data[i]) {
          isMaximum = false;
          break;
        }
      }
      
      if (isMaximum) {
        indices.push(i);
      }
    }
    
    return indices;
  }

  private calculateLinearRegression(x: number[], y: number[]): { slope: number; intercept: number; r2: number } {
    const n = x.length;
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared
    const yMean = sumY / n;
    const totalSS = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
    const regressionSS = y.reduce((sum, val, i) => {
      const yPred = slope * x[i] + intercept;
      return sum + Math.pow(yPred - yMean, 2);
    }, 0);
    const r2 = regressionSS / totalSS;
    
    return { slope, intercept, r2 };
  }

  private detectInverseHeadAndShoulders(/* parameters */): boolean {
    // Implementation similar to detectHeadAndShoulders but inverted
    return false; // Placeholder
  }

  private detectBullFlag(/* parameters */): boolean {
    // Implementation for bull flag pattern
    return false; // Placeholder
  }

  private detectBearFlag(/* parameters */): boolean {
    // Implementation for bear flag pattern
    return false; // Placeholder
  }

  private detectRectangle(/* parameters */): boolean {
    // Implementation for rectangle pattern
    return false; // Placeholder
  }

  private detectTriangle(highs: number[], lows: number[]): 'ascending' | 'descending' | 'symmetric' | null {
    // Implementation would analyze upper and lower trend lines
    return null; // Placeholder
  }

  private detectCupAndHandle(/* parameters */): boolean {
    // Implementation for cup and handle pattern
    return false; // Placeholder
  }

  private detectDoubleTop(/* parameters */): boolean {
    // Implementation for double top pattern
    return false; // Placeholder
  }
}
```

### OptionsService.ts

```typescript
// Service for options data analysis
export class OptionsService {
  // Extract relevant options data metrics
  extractOptionsData(optionsData: any[]): OptionsData {
    if (!optionsData || optionsData.length === 0) {
      return {
        call_put_ratio: 0,
        unusual_activity: false,
        options_flow: {
          bullish_flow_percent: 0
        }
      };
    }
    
    // Split into calls and puts
    const calls = optionsData.filter(opt => opt.option_type === 'call');
    const puts = optionsData.filter(opt => opt.option_type === 'put');
    
    // Calculate volume-based call/put ratio
    const callVolume = calls.reduce((sum, opt) => sum + (opt.volume || 0), 0);
    const putVolume = puts.reduce((sum, opt) => sum + (opt.volume || 0), 0);
    
    const callPutRatio = putVolume === 0 ?
      callVolume > 0 ? 999 : 0 : // Avoid division by zero
      parseFloat((callVolume / putVolume).toFixed(2));
    
    // Calculate option premium (price * volume * contract_size)
    const callPremium = calls.reduce((sum, opt) => sum + (opt.last || 0) * (opt.volume || 0) * (opt.contract_size || 100), 0);
    const putPremium = puts.reduce((sum, opt) => sum + (opt.last || 0) * (opt.volume || 0) * (opt.contract_size || 100), 0);
    
    const totalPremium = callPremium + putPremium;
    const bullishFlowPercent = totalPremium === 0 ?
      50 : // Default to neutral
      parseFloat(((callPremium / totalPremium) * 100).toFixed(2));
    
    // Detect unusual activity
    // Basic heuristic: unusual if call or put volume is 2x+ the open interest
    let unusualActivity = false;
    for (const opt of optionsData) {
      if (opt.open_interest && opt.volume && opt.volume > opt.open_interest * 2) {
        unusualActivity = true;
        break;
      }
    }
    
    return {
      call_put_ratio: callPutRatio,
      unusual_activity: unusualActivity,
      options_flow: {
        bullish_flow_percent: bullishFlowPercent
      }
    };
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
    // Create sector mapping for ETF symbols to sector names
    const sectorMapping: Record<string, string> = {
      'XLK': 'Technology',
      'XLF': 'Financials',
      'XLE': 'Energy',
      'XLV': 'Healthcare',
      'XLY': 'Consumer Discretionary',
      'XLP': 'Consumer Staples',
      'XLI': 'Industrials',
      'XLB': 'Materials',
      'XLU': 'Utilities',
      'XLRE': 'Real Estate'
    };
    
    // Create array of sectors with performance
    const sectorsWithPerformance = Object.entries(currentSectorData)
      .map(([symbol, performance]) => ({
        symbol,
        sector: sectorMapping[symbol] || symbol,
        performance
      }));
    
    // Sort by performance (descending)
    sectorsWithPerformance.sort((a, b) => b.performance - a.performance);
    
    // Calculate relative strength using historical data if available
    if (historicalSectorData) {
      for (const sectorInfo of sectorsWithPerformance) {
        const historicalData = historicalSectorData[sectorInfo.symbol];
        
        if (historicalData && historicalData.length >= 5) {
          // Calculate 5-day momentum
          const oldest = historicalData[0].close;
          const newest = historicalData[historicalData.length - 1].close;
          const momentum = ((newest - oldest) / oldest) * 100;
          
          // Add to sector info
          sectorInfo.momentum = momentum;
        }
      }
      
      // Re-sort based on combined current performance and momentum
      sectorsWithPerformance.sort((a, b) => {
        const aCombined = a.performance + (a.momentum || 0);
        const bCombined = b.performance + (b.momentum || 0);
        return bCombined - aCombined;
      });
    }
    
    // Top 3 sectors are inflow
    const inflowSectors = sectorsWithPerformance
      .slice(0, 3)
      .map(s => s.sector);
    
    // Bottom 3 sectors are outflow
    const outflowSectors = sectorsWithPerformance
      .slice(-3)
      .map(s => s.sector);
    
    return {
      inflow_sectors: inflowSectors,
      outflow_sectors: outflowSectors
    };
  }
}
```

## 5. Utilities

### dateUtils.ts

```typescript
// Utility functions for date handling in market context
export const getLatestTradingDay = (date = new Date()): string => {
  const day = date.getDay();
  
  // If weekend, go back to Friday
  if (day === 0) { // Sunday
    date.setDate(date.getDate() - 2);
  } else if (day === 6) { // Saturday
    date.setDate(date.getDate() - 1);
  }
  
  return formatDateForApi(date);
}

export const getMarketOpenTime = (): Date => {
  const now = new Date();
  now.setHours(9, 30, 0, 0); // 9:30 AM ET
  return now;
}

export const getPreMarketStart = (date = new Date()): string => {
  const formatted = formatDateForApi(date);
  return `${formatted} 04:00:00`; // 4:00 AM ET
}

export const getMarketOpenDateTime = (date = new Date()): string => {
  const formatted = formatDateForApi(date);
  return `${formatted} 09:30:00`; // 9:30 AM ET
}

export const formatDateForApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export const parseDateString = (dateStr: string): Date => {
  return new Date(dateStr);
}

export const getNow = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}

export const getDateRanges = (date: Date | string) => {
  const currentDate = typeof date === 'string' ? new Date(date) : new Date(date);
  
  // Clone date
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const threeMonthsAgo = new Date(currentDate);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const sixMonthsAgo = new Date(currentDate);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const oneYearAgo = new Date(currentDate);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  return {
    today: formatDateForApi(currentDate),
    yesterday: formatDateForApi(yesterday),
    oneWeekAgo: formatDateForApi(oneWeekAgo),
    oneMonthAgo: formatDateForApi(oneMonthAgo),
    threeMonthsAgo: formatDateForApi(threeMonthsAgo),
    sixMonthsAgo: formatDateForApi(sixMonthsAgo),
    oneYearAgo: formatDateForApi(oneYearAgo)
  };
}
```

## 6. AI Prediction Services

### TimeSeriesProcessor.ts

```typescript
// Service for processing time-series data for AI consumption
export class TimeSeriesProcessor {
  // Process raw time sales data into regular interval candles
  processTimeSalesToCandles(
    timeSalesData: any[],
    interval: '1min' | '5min' | '15min' = '1min'
  ): IntradayCandle[] {
    if (!timeSalesData || timeSalesData.length === 0) {
      return [];
    }
    
    // Sort time sales by timestamp (ascending)
    const sortedData = [...timeSalesData].sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    
    // Group time sales into specified intervals
    const candles: IntradayCandle[] = [];
    let currentCandle: any = null;
    let currentIntervalStart: Date | null = null;
    
    // Determine interval in milliseconds
    const intervalMs = interval === '1min' ? 60000 :
                        interval === '5min' ? 300000 : 900000; // 15min
    
    for (const dataPoint of sortedData) {
      const timestamp = new Date(dataPoint.time);
      
      // Check if we need to start a new candle
      if (!currentIntervalStart ||
          timestamp.getTime() >= currentIntervalStart.getTime() + intervalMs) {
        
        // Save the previous candle if it exists
        if (currentCandle) {
          candles.push(this.finalizeCandle(currentCandle));
        }
        
        // Start a new interval
        currentIntervalStart = new Date(
          Math.floor(timestamp.getTime() / intervalMs) * intervalMs
        );
        
        // Initialize new candle
        currentCandle = {
          time: currentIntervalStart.toISOString(),
          open: dataPoint.price,
          high: dataPoint.price,
          low: dataPoint.price,
          close: dataPoint.price,
          volume: dataPoint.volume || 0,
          volumePrice: (dataPoint.price * (dataPoint.volume || 0)),
          count: 1
        };
      } else {
        // Update the current candle
        currentCandle.high = Math.max(currentCandle.high, dataPoint.price);
        currentCandle.low = Math.min(currentCandle.low, dataPoint.price);
        currentCandle.close = dataPoint.price;
        currentCandle.volume += (dataPoint.volume || 0);
        currentCandle.volumePrice += (dataPoint.price * (dataPoint.volume || 0));
        currentCandle.count++;
      }
    }
    
    // Add the last candle if it exists
    if (currentCandle) {
      candles.push(this.finalizeCandle(currentCandle));
    }
    
    return candles;
  }
  
  // Calculate first-hour metrics (9:30-10:30 AM ET)
  calculateFirstHourMetrics(candles: IntradayCandle[]): {
    highPrice: number,
    lowPrice: number,
    volume: number,
    volumePercentage: number,
    breakout: boolean,
    vwap: number,
    priceRange: number,
    volatility: number,
    momentum: number,
    opening15MinVolume: number,
    openingHalfHourVolume: number,
    timeSegments: {time: string, volume: number, priceChange: number}[]
  } {
    if (!candles || candles.length === 0) {
      return {
        highPrice: 0,
        lowPrice: 0,
        volume: 0,
        volumePercentage: 0,
        breakout: false,
        vwap: 0,
        priceRange: 0,
        volatility: 0,
        momentum: 0,
        opening15MinVolume: 0,
        openingHalfHourVolume: 0,
        timeSegments: []
      };
    }
    
    // Filter for first hour candles (assuming 9:30-10:30 AM ET)
    const marketOpen = new Date(candles[0].time);
    const firstHourEnd = new Date(marketOpen);
    firstHourEnd.setHours(marketOpen.getHours() + 1);
    
    // Filter for first 15 minutes and first 30 minutes for sub-periods
    const first15MinEnd = new Date(marketOpen);
    first15MinEnd.setMinutes(marketOpen.getMinutes() + 15);
    
    const first30MinEnd = new Date(marketOpen);
    first30MinEnd.setMinutes(marketOpen.getMinutes() + 30);
    
    const firstHourCandles = candles.filter(
      candle => new Date(candle.time) < firstHourEnd
    );
    
    const first15MinCandles = candles.filter(
      candle => new Date(candle.time) < first15MinEnd
    );
    
    const first30MinCandles = candles.filter(
      candle => new Date(candle.time) < first30MinEnd
    );
    
    // Calculate metrics
    let highPrice = -Infinity;
    let lowPrice = Infinity;
    let firstHourVolume = 0;
    let firstHourVolumePrice = 0;
    let opening15MinVolume = 0;
    let openingHalfHourVolume = 0;
    let openPrice = firstHourCandles.length > 0 ? firstHourCandles[0].open : 0;
    let closePrice = firstHourCandles.length > 0 ? firstHourCandles[firstHourCandles.length - 1].close : 0;
    
    // Calculate metrics for the first hour
    for (const candle of firstHourCandles) {
      highPrice = Math.max(highPrice, candle.high);
      lowPrice = Math.min(lowPrice, candle.low);
      firstHourVolume += candle.volume;
      firstHourVolumePrice += candle.volume * candle.vwap;
    }
    
    // Calculate metrics for the first 15 minutes
    for (const candle of first15MinCandles) {
      opening15MinVolume += candle.volume;
    }
    
    // Calculate metrics for the first 30 minutes
    for (const candle of first30MinCandles) {
      openingHalfHourVolume += candle.volume;
    }
    
    // If we couldn't find first hour data
    if (highPrice === -Infinity) {
      highPrice = 0;
      lowPrice = 0;
    }
    
    // Total day volume
    const totalVolume = candles.reduce((sum, candle) => sum + candle.volume, 0);
    
    // Calculate VWAP for first hour
    const firstHourVwap = firstHourVolume > 0 ?
      firstHourVolumePrice / firstHourVolume : 0;
    
    // Calculate price range for first hour (as percentage)
    const priceRange = (highPrice > 0 && lowPrice > 0) ?
      ((highPrice - lowPrice) / lowPrice) * 100 : 0;
    
    // Calculate first hour volatility using standard deviation of price changes
    let volatility = 0;
    if (firstHourCandles.length > 1) {
      const closes = firstHourCandles.map(c => c.close);
      const avg = closes.reduce((sum, c) => sum + c, 0) / closes.length;
      const variance = closes.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / closes.length;
      volatility = Math.sqrt(variance) / avg * 100; // percentage
    }
    
    // Calculate first hour momentum (close relative to open)
    const momentum = (openPrice > 0) ?
      ((closePrice - openPrice) / openPrice) * 100 : 0;
    
    // Create time segments analysis (15-minute segments)
    const timeSegments: {time: string, volume: number, priceChange: number}[] = [];
    
    // Divide first hour into 15-minute segments
    if (firstHourCandles.length > 0) {
      let segmentStart = new Date(marketOpen);
      
      for (let i = 0; i < 4; i++) { // 4 segments of 15 minutes
        const segmentEnd = new Date(segmentStart);
        segmentEnd.setMinutes(segmentStart.getMinutes() + 15);
        
        const segmentCandles = firstHourCandles.filter(
          candle => {
            const candleTime = new Date(candle.time);
            return candleTime >= segmentStart && candleTime < segmentEnd;
          }
        );
        
        if (segmentCandles.length > 0) {
          const segmentVolume = segmentCandles.reduce((sum, candle) => sum + candle.volume, 0);
          const segmentOpen = segmentCandles[0].open;
          const segmentClose = segmentCandles[segmentCandles.length - 1].close;
          const segmentPriceChange = (segmentOpen > 0) ?
            ((segmentClose - segmentOpen) / segmentOpen) * 100 : 0;
          
          timeSegments.push({
            time: segmentStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            volume: segmentVolume,
            priceChange: parseFloat(segmentPriceChange.toFixed(2))
          });
        }
        
        segmentStart = segmentEnd;
      }
    }
    
    // Check if current price broke out of the first hour range
    // We use the last candle's close as the current price
    const currentPrice = candles[candles.length - 1].close;
    const breakout = currentPrice > highPrice;
    
    return {
      highPrice,
      lowPrice,
      volume: firstHourVolume,
      volumePercentage: totalVolume > 0 ? (firstHourVolume / totalVolume) * 100 : 0,
      breakout,
      vwap: firstHourVwap,
      priceRange: parseFloat(priceRange.toFixed(2)),
      volatility: parseFloat(volatility.toFixed(2)),
      momentum: parseFloat(momentum.toFixed(2)),
      opening15MinVolume,
      openingHalfHourVolume,
      timeSegments
    };
  }
  
  // Analyze volume distribution throughout the day
  calculateVolumeDistribution(
    candles: IntradayCandle[]
  ): {
    firstHourVolume: number,
    middayVolume: number,
    lastHourVolume: number,
    volumeProfile: { timeSlice: string; volume: number; avgPrice: number }[]
  } {
    if (!candles || candles.length === 0) {
      return {
        firstHourVolume: 0,
        middayVolume: 0,
        lastHourVolume: 0,
        volumeProfile: []
      };
    }
    
    // Calculate market open and close times
    const marketOpen = new Date(candles[0].time);
    const marketClose = new Date(candles[candles.length - 1].time);
    
    // First hour end time
    const firstHourEnd = new Date(marketOpen);
    firstHourEnd.setHours(marketOpen.getHours() + 1);
    
    // Last hour start time
    const lastHourStart = new Date(marketClose);
    lastHourStart.setHours(marketClose.getHours() - 1);
    
    let firstHourVolume = 0;
    let middayVolume = 0;
    let lastHourVolume = 0;
    
    // Create volume profile with 30-minute slices
    const volumeProfile: { timeSlice: string; volume: number; avgPrice: number }[] = [];
    let currentSliceStart = new Date(marketOpen);
    let currentSliceVolume = 0;
    let currentSliceVolumePrice = 0;
    
    // Process each candle
    for (const candle of candles) {
      const candleTime = new Date(candle.time);
      
      // Determine which period this candle belongs to
      if (candleTime < firstHourEnd) {
        firstHourVolume += candle.volume;
      } else if (candleTime >= lastHourStart) {
        lastHourVolume += candle.volume;
      } else {
        middayVolume += candle.volume;
      }
      
      // Update volume profile
      // Check if we need to start a new 30-minute slice
      if (candleTime.getTime() >= currentSliceStart.getTime() + 1800000) { // 30 minutes
        // Save current slice if it has volume
        if (currentSliceVolume > 0) {
          volumeProfile.push({
            timeSlice: currentSliceStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            volume: currentSliceVolume,
            avgPrice: currentSliceVolumePrice / currentSliceVolume
          });
        }
        
        // Start a new slice
        currentSliceStart = new Date(
          Math.floor(candleTime.getTime() / 1800000) * 1800000
        );
        currentSliceVolume = candle.volume;
        currentSliceVolumePrice = candle.volume * candle.vwap;
      } else {
        // Update current slice
        currentSliceVolume += candle.volume;
        currentSliceVolumePrice += candle.volume * candle.vwap;
      }
    }
    
    // Add the last slice if it has volume
    if (currentSliceVolume > 0) {
      volumeProfile.push({
        timeSlice: currentSliceStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        volume: currentSliceVolume,
        avgPrice: currentSliceVolumePrice / currentSliceVolume
      });
    }
    
    return {
      firstHourVolume,
      middayVolume,
      lastHourVolume,
      volumeProfile
    };
  }
  
  // Calculate opening gap metrics
  calculateOpeningGapMetrics(
    previousClose: number,
    openPrice: number
  ): {
    openingGapPercent: number,
    gapDirection: 'up' | 'down' | 'flat'
  } {
    if (!previousClose || !openPrice) {
      return {
        openingGapPercent: 0,
        gapDirection: 'flat'
      };
    }
    
    const gapPercent = ((openPrice - previousClose) / previousClose) * 100;
    
    let direction: 'up' | 'down' | 'flat';
    if (gapPercent > 0.5) {
      direction = 'up';
    } else if (gapPercent < -0.5) {
      direction = 'down';
    } else {
      direction = 'flat';
    }
    
    return {
      openingGapPercent: parseFloat(gapPercent.toFixed(2)),
      gapDirection: direction
    };
  }
  
  // Helper method to finalize candle calculations
  private finalizeCandle(candle: any): IntradayCandle {
    // Calculate VWAP for the candle
    const vwap = candle.volume > 0 ?
      candle.volumePrice / candle.volume : candle.close;
    
    return {
      time: candle.time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      vwap: parseFloat(vwap.toFixed(2))
    };
  }
}
```

### FeatureEngineeringService.ts

```typescript
// Service for engineering features for ML model consumption
export class FeatureEngineeringService {
  // Generate enhanced technical features for ML consumption
  generateTechnicalFeatures(
    priceData: EnhancedPriceData,
    technicals: EnhancedTechnicalIndicators
  ): Record<string, number> {
    const features: Record<string, number> = {};
    
    // Momentum features
    features['rsi'] = technicals.rsi;
    features['rsi_slope'] = technicals.rsiSlope;
    features['macd_hist'] = technicals.macd.histogram;
    features['macd_hist_dir'] = technicals.macd.histogramDirection === 'up' ? 1 :
                              technicals.macd.histogramDirection === 'down' ? -1 : 0;
    
    // Volatility features
    features['bb_width'] = technicals.bollingerBands.width;
    features['percent_b'] = technicals.bollingerBands.percentB;
    features['atr_percent'] = technicals.atrPercent;
    
    // Trend features
    features['adx'] = technicals.adx;
    features['above_vwap'] = priceData.current > priceData.intraday.vwap ? 1 : 0;
    features['above_ma20'] = priceData.current > (priceData.movingAverages['ma20'] || 0) ? 1 : 0;
    features['above_ma50'] = priceData.current > (priceData.movingAverages['ma50'] || 0) ? 1 : 0;
    
    // Price location features
    features['pct_from_high'] = technicals.priceLocation.percentFromHigh;
    features['pct_from_low'] = technicals.priceLocation.percentFromLow;
    
    // Gap features
    features['gap_percent'] = priceData.gapMetrics.openingGapPercent;
    features['gap_direction'] = priceData.gapMetrics.gapDirection === 'up' ? 1 :
                             priceData.gapMetrics.gapDirection === 'down' ? -1 : 0;
    
    // Pattern strength
    features['pattern_strength'] = technicals.patternRecognition.patternStrength;
    features['bullish_patterns'] = technicals.patternRecognition.bullishPatterns.length;
    features['bearish_patterns'] = technicals.patternRecognition.bearishPatterns.length;
    
    return features;
  }
  
  // Generate volume-based features for ML consumption
  generateVolumeFeatures(
    volumeData: EnhancedVolumeData,
    priceData: EnhancedPriceData
  ): Record<string, number> {
    const features: Record<string, number> = {};
    
    // Volume metrics
    features['rel_volume'] = volumeData.relativeVolume;
    features['first_hour_vol_pct'] = volumeData.distribution.firstHourPercent;
    features['last_hour_vol_pct'] = volumeData.distribution.lastHourPercent;
    
    // Volume acceleration (change in volume pace)
    let volumeAcceleration = 0;
    if (priceData.intraday.candles.length >= 3) {
      const recentCandles = priceData.intraday.candles.slice(-3);
      const olderVolume = recentCandles[0].volume;
      const newerVolume = recentCandles[2].volume;
      volumeAcceleration = ((newerVolume - olderVolume) / olderVolume) * 100;
    }
    features['volume_acceleration'] = volumeAcceleration;
    
    // Price-volume divergence (price up on declining volume or down on rising volume)
    let priceVolumeDivergence = 0;
    if (priceData.intraday.candles.length >= 3) {
      const recentCandles = priceData.intraday.candles.slice(-3);
      const priceTrend = recentCandles[2].close > recentCandles[0].close ? 1 : -1;
      const volumeTrend = recentCandles[2].volume > recentCandles[0].volume ? 1 : -1;
      priceVolumeDivergence = priceTrend !== volumeTrend ? 1 : 0;
    }
    features['price_volume_divergence'] = priceVolumeDivergence;
    
    return features;
  }
  
  // Generate market context features for ML consumption
  generateMarketContextFeatures(
    marketContext: MarketContext,
    stockSector: string
  ): Record<string, number> {
    const features: Record<string, number> = {};
    
    // Market indices performance
    features['spy_change'] = marketContext.indices['SPY']?.changePercent || 0;
    features['qqq_change'] = marketContext.indices['QQQ']?.changePercent || 0;
    features['iwm_change'] = marketContext.indices['IWM']?.changePercent || 0;
    
    // Volatility
    features['vix'] = marketContext.vix;
    
    // Options sentiment
    features['put_call_ratio'] = marketContext.putCallRatio;
    
    // Sector relative strength
    // Find sector performance for stock's sector
    const sectorPerformance = Object.entries(marketContext.sectorPerformance).find(
      ([key, _]) => {
        const sectorMapping: Record<string, string> = {
          'XLK': 'Technology',
          'XLF': 'Financials',
          'XLE': 'Energy',
          'XLV': 'Healthcare',
          'XLY': 'Consumer Discretionary',
          'XLP': 'Consumer Staples',
          'XLI': 'Industrials',
          'XLB': 'Materials',
          'XLU': 'Utilities',
          'XLRE': 'Real Estate'
        };
        return sectorMapping[key] === stockSector;
      }
    );
    
    features['sector_performance'] = sectorPerformance ? sectorPerformance[1] : 0;
    
    // Sector rotation (inflow/outflow)
    const sectorInflow = marketContext.sectorRotation.inflowSectors.includes(stockSector) ? 1 : 0;
    const sectorOutflow = marketContext.sectorRotation.outflowSectors.includes(stockSector) ? 1 : 0;
    
    features['sector_inflow'] = sectorInflow;
    features['sector_outflow'] = sectorOutflow;
    
    // Market status (binary feature)
    features['market_open'] = marketContext.marketStatus === 'open' ? 1 : 0;
    
    return features;
  }
  
  // Generate options-based features for ML consumption
  generateOptionsFeatures(
    optionsData: EnhancedOptionsData
  ): Record<string, number> {
    const features: Record<string, number> = {};
    
    features['call_put_ratio'] = optionsData.callPutRatio;
    features['implied_volatility'] = optionsData.impliedVolatility;
    features['iv_change'] = optionsData.impliedVolatilityChange;
    features['unusual_activity'] = optionsData.unusualActivity ? 1 : 0;
    features['bullish_flow_pct'] = optionsData.optionsFlow.bullishFlowPercent;
    features['bearish_flow_pct'] = optionsData.optionsFlow.bearishFlowPercent;
    features['vol_oi_ratio'] = optionsData.optionsFlow.volumeOpenInterestRatio;
    
    return features;
  }
  
  // Create a composite feature matrix for ML prediction
  buildFeatureMatrix(
    stock: StockAnalysis,
    marketContext: MarketContext
  ): number[][] {
    // Generate all feature groups
    const technicalFeatures = this.generateTechnicalFeatures(
      stock.priceData,
      stock.technicalIndicators
    );
    
    const volumeFeatures = this.generateVolumeFeatures(
      stock.volumeData,
      stock.priceData
    );
    
    const marketFeatures = this.generateMarketContextFeatures(
      marketContext,
      stock.companyInfo.sector
    );
    
    const optionsFeatures = this.generateOptionsFeatures(
      stock.optionsData
    );
    
    // Normalize features to appropriate ranges
    const normalizedFeatures = this.normalizeFeatures({
      ...technicalFeatures,
      ...volumeFeatures,
      ...marketFeatures,
      ...optionsFeatures
    });
    
    // Create timeframes for prediction (recent candles)
    const timeseriesFeatures: number[][] = [];
    const candles = stock.priceData.intraday.candles;
    
    // Create feature vectors for each of the last 5 candles (for recurrent models)
    const lookback = Math.min(5, candles.length);
    for (let i = candles.length - lookback; i < candles.length; i++) {
      const candle = candles[i];
      
      // Create feature vector for this candle
      const candleFeatures = [
        candle.open / stock.priceData.previousClose - 1, // Normalized open
        candle.high / stock.priceData.previousClose - 1, // Normalized high
        candle.low / stock.priceData.previousClose - 1,  // Normalized low
        candle.close / stock.priceData.previousClose - 1, // Normalized close
        candle.volume / stock.volumeData.avg10d,         // Relative volume
        (candle.vwap / stock.priceData.previousClose) - 1 // Normalized vwap
      ];
      
      timeseriesFeatures.push(candleFeatures);
    }
    
    // Combine static features and timeseries features
    return [
      Object.values(normalizedFeatures),
      ...timeseriesFeatures
    ];
  }
  
  // Normalize features to appropriate ranges for ML models
  private normalizeFeatures(features: Record<string, number>): Record<string, number> {
    const normalizedFeatures: Record<string, number> = {};
    
    // Define normalization ranges for different feature types
    const normalizers: Record<string, (val: number) => number> = {
      // RSI is already 0-100, normalize to 0-1
      'rsi': (val) => val / 100,
      
      // Percentages already in good range, cap outliers
      'sector_performance': (val) => Math.max(-10, Math.min(10, val)) / 10,
      'gap_percent': (val) => Math.max(-10, Math.min(10, val)) / 10,
      
      // Features that should be normalized relative to their typical range
      'vix': (val) => {
        // VIX typically ranges 10-30, with extremes at 9-80
        if (val < 10) return 0;
        if (val > 40) return 1;
        return (val - 10) / 30;
      },
      
      'put_call_ratio': (val) => {
        // Put-call ratio typically 0.5-1.5
        if (val < 0.5) return 0;
        if (val > 2) return 1;
        return (val - 0.5) / 1.5;
      },
      
      'adx': (val) => val / 100, // ADX is 0-100
      
      'rel_volume': (val) => {
        // Relative volume typically 0.5-3
        if (val < 0.5) return 0;
        if (val > 3) return 1;
        return (val - 0.5) / 2.5;
      }
    };
    
    // Apply normalizers where defined, otherwise cap at -1 to 1
    for (const [key, value] of Object.entries(features)) {
      if (normalizers[key]) {
        normalizedFeatures[key] = normalizers[key](value);
      } else {
        // Default normalization: cap between -1 and 1
        normalizedFeatures[key] = Math.max(-1, Math.min(1, value));
      }
    }
    
    return normalizedFeatures;
  }
}
```

### AIPredictionService.ts

```typescript
// Service for making price predictions using AI/ML
export interface PricePrediction {
  ticker: string;
  currentPrice: number;
  predictedHighPrice: number;
  predictedHighConfidence: number;
  timeToHighEstimate: string;
  predictedLowPrice: number;
  predictedLowConfidence: number;
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
}

export class AIPredictionService {
  private featureEngineeringService: FeatureEngineeringService;
  
  constructor() {
    this.featureEngineeringService = new FeatureEngineeringService();
  }
  
  // Process a full DayTradingAnalysis into predictions
  async predictPrices(analysis: DayTradingAnalysis): Promise<PricePrediction[]> {
    const predictions: PricePrediction[] = [];
    
    for (const stock of analysis.stocks) {
      // Prepare model input features
      const modelInput = this.prepareModelInput(stock, analysis.marketContext);
      
      // In a real implementation, this would call an actual ML model
      // For now, we'll use a rule-based prediction approach
      const prediction = this.generatePrediction(stock, modelInput);
      
      predictions.push(prediction);
    }
    
    return predictions;
  }
  
  // Convert a stock analysis into AI-friendly feature vectors
  private prepareModelInput(
    stock: StockAnalysis,
    marketContext: MarketContext
  ): number[][] {
    // Use FeatureEngineeringService to build a feature matrix
    return this.featureEngineeringService.buildFeatureMatrix(stock, marketContext);
  }
  
  // Generate a prediction based on features
  // This is a placeholder for a real ML model call
  private generatePrediction(
    stock: StockAnalysis,
    features: number[][]
  ): PricePrediction {
    const currentPrice = stock.priceData.current;
    
    // In a real implementation, this would use the ML model's output
    // For now, we'll use a basic algorithm based on technical indicators
    
    // Determine sentiment based on technicals
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    const technicals = stock.technicalIndicators;
    
    // Simple rules based on RSI, MACD, and price vs VWAP
    if (
      technicals.rsi > 60 &&
      technicals.macd.histogram > 0 &&
      stock.priceData.current > stock.priceData.intraday.vwap
    ) {
      sentiment = 'bullish';
    } else if (
      technicals.rsi < 40 &&
      technicals.macd.histogram < 0 &&
      stock.priceData.current < stock.priceData.intraday.vwap
    ) {
      sentiment = 'bearish';
    }
    
    // Calculate predicted price movement based on technicals and volatility
    const avgVolatilityPercent = technicals.atrPercent;
    const volatilityMultiplier = sentiment === 'bullish' ? 2.0 :
                               sentiment === 'bearish' ? -2.0 : 0.5;
    
    const expectedMovePercent = avgVolatilityPercent * volatilityMultiplier;
    
    // Calculate predicted high and low prices
    const predictedHighPrice = currentPrice * (1 + Math.abs(expectedMovePercent) / 100);
    const predictedLowPrice = currentPrice * (1 - Math.abs(expectedMovePercent) / 100);
    
    // Calculate confidence based on strength of technical signals
    const strengthFactors = [
      Math.abs(technicals.rsi - 50) / 50, // 0-1 based on distance from RSI midpoint
      Math.abs(technicals.macd.histogram) / 2, // Normalized MACD histogram strength
      technicals.adx / 100, // 0-1 ADX strength
      stock.aiMetrics.technicalSetupScore, // 0-1 technical setup score
      stock.volumeData.relativeVolume > 1 ? 0.7 : 0.3 // Higher confidence with higher volume
    ];
    
    const confidenceScore = strengthFactors.reduce((sum, factor) => sum + factor, 0) /
                          strengthFactors.length;
    
    // Higher confidence score if sentiment matches actual pattern detection
    const patternMatchesSentiment = (
      (sentiment === 'bullish' && technicals.patternRecognition.bullishPatterns.length > 0) ||
      (sentiment === 'bearish' && technicals.patternRecognition.bearishPatterns.length > 0)
    );
    
    const finalConfidenceScore = patternMatchesSentiment ?
      Math.min(confidenceScore * 1.3, 0.95) : confidenceScore;
    
    // Estimate time to reach target (based on volatility and trading hours remaining)
    const timeToTarget = this.estimateTimeToTarget(expectedMovePercent, stock.aiMetrics.momentumScore);
    
    return {
      ticker: stock.ticker,
      currentPrice: currentPrice,
      predictedHighPrice: parseFloat(predictedHighPrice.toFixed(2)),
      predictedHighConfidence: parseFloat((finalConfidenceScore).toFixed(2)),
      timeToHighEstimate: timeToTarget,
      predictedLowPrice: parseFloat(predictedLowPrice.toFixed(2)),
      predictedLowConfidence: parseFloat((finalConfidenceScore * 0.8).toFixed(2)),
      overallSentiment: sentiment
    };
  }
  
  // Estimate time to reach price target based on volatility and momentum
  private estimateTimeToTarget(
    expectedMovePercent: number,
    momentumScore: number
  ): string {
    // This is a simplified placeholder algorithm
    // A real implementation would consider market hours remaining, historical volatility, etc.
    
    const absMove = Math.abs(expectedMovePercent);
    
    if (absMove < 0.5 || momentumScore < 0.2) {
      return "End of Week";
    } else if (absMove < 1.5 || momentumScore < 0.5) {
      return "End of Day";
    } else if (absMove < 3 || momentumScore < 0.7) {
      return "Next 2 Hours";
    } else {
      return "Next Hour";
    }
  }
  
  // In a production environment, this service would include methods for:
  // 1. Communicating with an ML model API
  // 2. Preprocessing features for that specific model
  // 3. Validating and calibrating predictions
  // 4. Tracking prediction accuracy over time
}
```

## 7. Main Entry Point

### index.ts

```typescript
// Main entry point for mid-cap stock analysis with AI prediction
import { MidCapScreenerService } from "./services/MidCapScreenerService";
import { AIPredictionService } from "./services/AIPredictionService";
import { getNow, getLatestTradingDay } from "./utils/dateUtils";
import { DayTradingAnalysis } from "./models/DayTradingAnalysis";
import { PricePrediction } from "./services/AIPredictionService";

export interface AnalysisResult {
  analysis: DayTradingAnalysis;
  predictions: PricePrediction[];
  generatedAt: string;
}

// Function to run the full analysis with AI predictions
export async function runMidCapAnalysis(): Promise<AnalysisResult> {
  // Create the services
  const screenerService = new MidCapScreenerService();
  const predictionService = new AIPredictionService();
  
  // Get current date and time
  const currentDate = getLatestTradingDay();
  const currentTime = getNow();
  
  // Run the stock analysis
  const analysis = await screenerService.runAnalysis(currentDate, currentTime);
  
  // Generate price predictions
  const predictions = await predictionService.predictPrices(analysis);
  
  return {
    analysis,
    predictions,
    generatedAt: new Date().toISOString()
  };
}
```

# Final Output

# Comprehensive Type Interface for MidCap Stock Analyzer Output

Below is a detailed type interface for the output produced by the MidCap Stock Analyzer system, with complete descriptions for each field and subfield. This interface reflects what is actually achievable with the available API services from Benzinga, EODHD, and Tradier:

```typescript
/**
 * Complete market analysis output including market-wide data and analyzed stock universe
 * The system returns a MarketData object containing market context and stock analysis.
 */
type MidCapAnalysisOutput = MarketData;

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
   * From the EODHD Economic Calendar API
   */
  macro_events: {
    /** Time of the economic event in HH:MM format */
    time: string;
    
    /** Description of the economic event */
    event: string;
  }[];
  
  /** Current market trading status from Tradier Market Clock API */
  market_status: string;
  
  /** When the next market hours change will occur (e.g., time when market will close) */
  next_market_hours_change: string;
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
  
  /** Date of next earnings report (null if unknown) */
  next_report_date: string | null;
  
  /** Historical earnings trend data */
  trends: any[];
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
  
  /**
   * Classification of news volume (high_activity, normal)
   * Note: Actual sentiment analysis is not available directly from the APIs
   * and would require custom NLP implementation
   */
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

## Identified Gaps and Implementation Notes

1. **Stock Screening for Mid-Caps**:
   - **Gap**: No direct API for efficiently screening the universe of stocks by market cap.
   - **Solution**: Use predefined list of mid-cap stocks, query holdings of a mid-cap ETF like IJH, or maintain a local database of all stocks with their market caps that's updated daily.

2. **Pattern Recognition**:
   - **Gap**: EODHD's pattern recognition endpoint is marked as "Broken".
   - **Solution**: Implemented custom pattern detection algorithm that analyzes historical price data to identify common chart patterns.

3. **News Sentiment Analysis**:
   - **Gap**: No direct sentiment scoring from Benzinga API.
   - **Solution**: Currently using news volume as a basic indicator; a full implementation would require custom NLP for sentiment analysis of news content.

4. **First Hour Volume Percentage**:
   - **Gap**: Requires detailed time-series volume data filtering.
   - **Solution**: Can be calculated from Tradier's getTimeSales data by filtering for the 9:30-10:30 AM timeframe, but currently using an approximation.

5. **Next Earnings Date**:
   - **Gap**: Current EODHD API calls don't directly provide future earnings dates.
   - **Solution**: Currently set to null in the interface; would need additional API sources or web scraping to get this data reliably.

The implementation leverages each API for its strengths:
- Tradier for real-time quotes, pre-market data, intraday data with VWAP, and options chains
- EODHD for fundamentals, technical indicators, and economic calendar
- Benzinga for financial news with stock tagging

This architecture makes optimal use of the available API services to produce a comprehensive analysis of mid-cap stocks for potential day trading opportunities.