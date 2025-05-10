# MidCap Stock Analyzer System Architecture

High-level pseudocode to describe the system architecture, optimized for the available API services (Benzinga, EODHD, and Tradier).

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

  constructor() {
    // Initialize dependencies
    this.tradierClient = new TradierApiClient();
    this.eodhdClient = new EODHDApiClient();
    this.benzingaClient = new BenzingaService();
    this.scoringService = new ScoringService();
    this.optionsService = new OptionsService();
    this.patternRecognitionService = new PatternRecognitionService();
  }

  // Gather comprehensive data for a single stock
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

  // Helper methods for data processing
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

## 6. Main Entry Point

### index.ts

```typescript
// Main entry point for mid-cap stock analysis
import { MidCapScreenerService } from "./services/MidCapScreenerService";
import { getNow, getLatestTradingDay } from "./utils/dateUtils";

// Function to run the full analysis
async function runMidCapAnalysis() {
  // Create the screener service
  const screenerService = new MidCapScreenerService();
  
  // Get current date and time
  const currentDate = getLatestTradingDay();
  const currentTime = getNow();
  
  // Run the analysis
  const results = await screenerService.runAnalysis(currentDate, currentTime);
  
  // Return results
  return results;
}

export { runMidCapAnalysis };
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