import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import moment from 'moment';

// API Keys - Replace with your actual keys
const ALPHA_VANTAGE_API_KEY: string = 'KSRQH6VLLQSZ6UGU';
const FMP_API_KEY: string = 'ebaV0L1kbiAmj1aZiMW1LM7YM8qnRXMd';
const TRADIER_API_KEY: string = 'RMWSde4gWI5cq0vR2wJgtRvfsIwy';

// Base URLs
const AV_BASE_URL: string = 'https://www.alphavantage.co/query';
const FMP_BASE_URL: string = 'https://financialmodelingprep.com/api/v3';
const TRADIER_BASE_URL: string = 'https://api.tradier.com/v1';

// Headers for Tradier API
const TRADIER_HEADERS = {
  'Authorization': `Bearer ${TRADIER_API_KEY}`,
  'Accept': 'application/json'
};

// Interfaces for data structures
interface MarketData {
  indices: Record<string, {
    price: number;
    change_percent: number;
  }>;
  sector_performance: Record<string, number>;
}

interface StockData {
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
  news_articles: NewsArticle[];
  options_data: OptionsData;
  short_interest: ShortInterest;
  earnings_data: EarningsData;
  social_sentiment: Record<string, any>;
  historical_patterns: HistoricalPatterns;
}

interface PriceData {
  previous_close: number;
  pre_market: number | null;
  current: number;
  day_range: {
    low: number;
    high: number;
  };
  "52w_range": {
    low: number | null;
    high: number | null;
  };
  moving_averages: {
    ma_20: number | null;
    ma_50: number | null;
    ma_200: number | null;
  };
}

interface VolumeData {
  pre_market: number | null;
  current: number;
  avg_10d: number;
  relative_volume: number | null;
}

interface TechnicalIndicators {
  rsi_14: number;
  macd: {
    line: number;
    signal: number;
    histogram: number;
  };
  bollinger_bands: {
    upper: number;
    middle: number;
    lower: number;
  };
}

interface NewsArticle {
  id: string;
  published_utc: string;
  title: string;
  url: string;
  tags: string[];
  sentiment_score: number;
  key_metrics_mentioned: Record<string, string>;
  analyst_actions: AnalystAction[];
}

interface AnalystAction {
  firm: string;
  action: string;
  previous_target: number;
  new_target: number;
}

interface OptionsData {
  call_put_ratio: number | null;
  unusual_activity: boolean;
  notable_strikes: {
    strike: number;
    type: string;
    volume: number;
    open_interest: number;
  }[];
}

interface ShortInterest {
  percent_of_float: number | null;
  days_to_cover: number | null;
  shares_short: number | null;
}

interface EarningsData {
  recent_report: {
    date: string | null;
    eps: {
      actual: number | null;
      estimate: number | null;
      surprise_percent: number | null;
    };
    revenue: {
      actual: number | null;
      estimate: number | null;
      surprise_percent: number | null;
    };
    guidance: {
      previous: number | null;
      updated: number | null;
    };
  };
  next_report_date: string | null;
}

interface HistoricalPatterns {
  post_earnings_reactions: any[];
  gap_fill_probability: number | null;
}

interface AlphaVantageData {
  overview?: any;
  quote?: any;
  daily?: Record<string, any>;
  rsi?: Record<string, any>;
  macd?: Record<string, any>;
  bbands?: Record<string, any>;
  news?: any[];
  earnings?: any;
  balanceSheet?: any;
  income?: any;
  cashFlow?: any;
}

interface FMPData {
  profile?: any;
  quote?: any;
  ratings?: any[];
  institutional?: any[];
  shortInterest?: any[];
}

interface TradierData {
  quote?: any;
  options?: any[];
  optionsMetrics?: any;
  preMarket?: {
    price: number;
    volume: number;
  };
}

interface DailyPrice {
  date: string;
  close: number;
}

interface OptionsContract {
  strike: number;
  option_type: string;
  volume: number;
  open_interest: number;
}

interface FinalData {
  date: string;
  market_data: MarketData;
  stock_universe: StockData[];
}

/**
 * Main function to build the comprehensive dataset
 */
async function buildStockAnalysisJSON(): Promise<FinalData> {
  try {
    console.log('Starting data collection process...');
    
    // 1. Get today's date
    const today = moment();
    const dateStr = today.format('YYYY-MM-DD');
    
    // 2. Get market data (indices and sector performance)
    console.log('Fetching market data...');
    const marketData = await getMarketData();
    
    // 3. Get mid-cap stock universe
    console.log('Identifying mid-cap universe...');
    const midCapTickers = await getMidCapStocks();
    console.log(`Found ${midCapTickers.length} mid-cap stocks to analyze`);
    
    // 4. Process each stock (limiting to first 5 for demonstration)
    console.log('Processing individual stocks...');
    const stockUniverse: StockData[] = [];
    for (const ticker of midCapTickers.slice(0, 5)) {
      console.log(`Processing ${ticker}...`);
      
      // Collect data from all sources
      const alphaVantageData = await getAlphaVantageData(ticker);
      const fmpData = await getFMPData(ticker);
      const tradierData = await getTradierData(ticker);
      
      // Merge data into unified structure
      const stockData = mergeStockData(ticker, alphaVantageData, fmpData, tradierData);
      stockUniverse.push(stockData);
      
      // Respect API rate limits with delay
      await delay(500);
    }
    
    // 5. Assemble final result
    const finalData: FinalData = {
      date: dateStr,
      market_data: marketData,
      stock_universe: stockUniverse
    };
    
    // 6. Save to file
    fs.writeFileSync('stock_analysis_data.json', JSON.stringify(finalData, null, 2));
    console.log('Data collection complete! Saved to stock_analysis_data.json');
    
    return finalData;
  } catch (error) {
    console.error('Error building dataset:', (error as Error).message);
    throw error;
  }
}

/**
 * Get overall market data (indices and sector performance)
 */
async function getMarketData(): Promise<MarketData> {
  try {
    // Market indices to track
    const indices: string[] = ['SPY', 'QQQ', 'IWM'];
    const sectors: string[] = ['XLK', 'XLY', 'XLF', 'XLV', 'XLE'];
    
    const marketData: MarketData = {
      indices: {},
      sector_performance: {}
    };
    
    // Get data for market indices
    for (const symbol of indices) {
      const response = await axios.get(`${AV_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
      
      if (response.data && response.data['Global Quote']) {
        const quote = response.data['Global Quote'];
        marketData.indices[symbol] = {
          price: parseFloat(quote['05. price']),
          change_percent: parseFloat(quote['10. change percent'].replace('%', ''))
        };
      }
      
      // Respect Alpha Vantage rate limits
      await delay(500);
    }
    
    // Get sector performance
    for (const sector of sectors) {
      const response = await axios.get(`${AV_BASE_URL}?function=GLOBAL_QUOTE&symbol=${sector}&apikey=${ALPHA_VANTAGE_API_KEY}`);
      
      if (response.data && response.data['Global Quote']) {
        const quote = response.data['Global Quote'];
        marketData.sector_performance[sector] = parseFloat(quote['10. change percent'].replace('%', ''));
      }
      
      // Respect Alpha Vantage rate limits
      await delay(500);
    }
    
    return marketData;
  } catch (error) {
    console.error('Error fetching market data:', (error as Error).message);
    // Return a skeleton structure if error occurs
    return {
      indices: {},
      sector_performance: {}
    };
  }
}

/**
 * Get list of mid-cap stocks from Financial Modeling Prep
 * Note: This function cannot be fully replaced with Alpha Vantage
 */
async function getMidCapStocks(): Promise<string[]> {
  try {
    // Get stocks from S&P 500 and filter by market cap
    const response = await axios.get(`${FMP_BASE_URL}/stock-screener?marketCapMoreThan=2000000000&marketCapLowerThan=10000000000&limit=100&apikey=${FMP_API_KEY}`);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data.map((stock: any) => stock.symbol);
    } else {
      console.error('Invalid response from FMP stock screener');
      // Fallback to a default list
      return ['DUOL', 'FIVE', 'DECK', 'AXON', 'TFII'];
    }
  } catch (error) {
    console.error('Error fetching mid-cap stocks:', (error as Error).message);
    // Fallback to a default list
    return ['DUOL', 'FIVE', 'DECK', 'AXON', 'TFII'];
  }
}

/**
 * Get Alpha Vantage data for a specific stock
 * Enhanced to include more Alpha Vantage endpoints
 */
async function getAlphaVantageData(ticker: string): Promise<AlphaVantageData> {
  try {
    const data: AlphaVantageData = {};
    
    // 1. Get overview data
    const overviewResponse = await axios.get(`${AV_BASE_URL}?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.overview = overviewResponse.data;
    await delay(500);
    
    // 2. Get quote data
    const quoteResponse = await axios.get(`${AV_BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.quote = quoteResponse.data['Global Quote'];
    await delay(500);
    
    // 3. Get daily price data
    const dailyResponse = await axios.get(`${AV_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.daily = dailyResponse.data['Time Series (Daily)'];
    await delay(500);
    
    // 4. Get technical indicators
    // RSI
    const rsiResponse = await axios.get(`${AV_BASE_URL}?function=RSI&symbol=${ticker}&interval=daily&time_period=14&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.rsi = rsiResponse.data['Technical Analysis: RSI'];
    await delay(500);
    
    // MACD
    const macdResponse = await axios.get(`${AV_BASE_URL}?function=MACD&symbol=${ticker}&interval=daily&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.macd = macdResponse.data['Technical Analysis: MACD'];
    await delay(500);
    
    // Bollinger Bands
    const bbandsResponse = await axios.get(`${AV_BASE_URL}?function=BBANDS&symbol=${ticker}&interval=daily&time_period=20&series_type=close&nbdevup=2&nbdevdn=2&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.bbands = bbandsResponse.data['Technical Analysis: BBANDS'];
    await delay(500);
    
    // 5. Get news sentiment
    const newsResponse = await axios.get(`${AV_BASE_URL}?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.news = newsResponse.data.feed;
    await delay(500);
    
    // 6. Get earnings data
    const earningsResponse = await axios.get(`${AV_BASE_URL}?function=EARNINGS&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.earnings = earningsResponse.data;
    await delay(500);
    
    // 7. Get financial statements
    // Balance Sheet
    const balanceSheetResponse = await axios.get(`${AV_BASE_URL}?function=BALANCE_SHEET&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.balanceSheet = balanceSheetResponse.data;
    await delay(500);
    
    // Income Statement
    const incomeResponse = await axios.get(`${AV_BASE_URL}?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.income = incomeResponse.data;
    await delay(500);
    
    // Cash Flow
    const cashFlowResponse = await axios.get(`${AV_BASE_URL}?function=CASH_FLOW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    data.cashFlow = cashFlowResponse.data;
    
    return data;
  } catch (error) {
    console.error(`Error fetching Alpha Vantage data for ${ticker}:`, (error as Error).message);
    return {};
  }
}

/**
 * Get Financial Modeling Prep data for a specific stock
 * Note: This function cannot be fully replaced with Alpha Vantage
 */
async function getFMPData(ticker: string): Promise<FMPData> {
  try {
    const data: FMPData = {};
    
    // 1. Get company profile (includes float data) - Float Data: Share float typically changes very slowly (quarterly or less frequently), so an 8-hour delay is negligible.
    const profileResponse = await axios.get(`${FMP_BASE_URL}/profile/${ticker}?apikey=${FMP_API_KEY}`);
    data.profile = profileResponse.data[0];
    
    // 2. Get quote/pre-market data (FIND A REPLACEMENT FOR THIS)
    const quoteResponse = await axios.get(`${FMP_BASE_URL}/quote/${ticker}?apikey=${FMP_API_KEY}`);
    data.quote = quoteResponse.data[0];
    
    // 3. Get analyst ratings (Benzinga's Analyst Ratings API when you can afford it)
    const ratingsResponse = await axios.get(`${FMP_BASE_URL}/analyst-stock-recommendations/${ticker}?apikey=${FMP_API_KEY}`);
    data.ratings = ratingsResponse.data;
    
    // 4. Get institutional ownership - OK
    const institutionalResponse = await axios.get(`${FMP_BASE_URL}/institutional-holder/${ticker}?apikey=${FMP_API_KEY}`);
    data.institutional = institutionalResponse.data;
    
    // 5. Get short interest - Short interest is typically reported bi-monthly by exchanges, so an 8-hour delay doesn't significantly impact accuracy.
    const shortInterestResponse = await axios.get(`${FMP_BASE_URL}/stock/short-interest/${ticker}?apikey=${FMP_API_KEY}`);
    data.shortInterest = shortInterestResponse.data;
    
    return data;
  } catch (error) {
    console.error(`Error fetching FMP data for ${ticker}:`, (error as Error).message);
    return {};
  }
}

/**
 * Get Tradier data for a specific stock
 */
async function getTradierData(ticker: string): Promise<TradierData> {
  try {
    const data: TradierData = {};
    
    // 1. Get quote data
    const quoteResponse = await axios.get(`${TRADIER_BASE_URL}/markets/quotes`, {
      params: { symbols: ticker },
      headers: TRADIER_HEADERS
    });
    data.quote = quoteResponse.data.quotes.quote;
    
    // 2. Get options chains
    // Get nearest Friday or other expiration
    const expirationDate = getNearestOptionsExpirationDate();
    
    const optionsResponse = await axios.get(`${TRADIER_BASE_URL}/markets/options/chains`, {
      params: { 
        symbol: ticker,
        expiration: expirationDate
      },
      headers: TRADIER_HEADERS
    });
    data.options = optionsResponse.data.options.option || [];

    return data;
  } catch (error) {
    console.error(`Error fetching Tradier data for ${ticker}:`, (error as Error).message);
    return {};
  }
}

/**
 * Merge all data sources into the unified JSON structure
 * Updated to prioritize Alpha Vantage data where possible
 */
function mergeStockData(
  ticker: string, 
  avData: AlphaVantageData, 
  fmpData: FMPData, 
  tradierData: TradierData
): StockData {
  // Extract necessary data from each source
  try {
    const stockData: StockData = {
      ticker,
      company_name: avData.overview?.Name || fmpData.profile?.companyName || '',
      sector: avData.overview?.Sector || fmpData.profile?.sector || '',
      industry: avData.overview?.Industry || fmpData.profile?.industry || '',
      market_cap: parseFloat(avData.overview?.MarketCapitalization || fmpData.profile?.mktCap || 0),
      float: parseFloat(fmpData.profile?.float || 0), // No direct Alpha Vantage replacement
      avg_daily_volume: parseFloat(avData.overview?.AverageDailyVolume10Day || avData.overview?.AverageVolume || fmpData.quote?.avgVolume || 0),
      
      price_data: extractPriceData(avData, fmpData),
      volume_data: extractVolumeData(avData, fmpData, tradierData),
      technical_indicators: extractTechnicalIndicators(avData),
      news_articles: extractNewsArticles(avData),
      options_data: extractOptionsData(tradierData),
      short_interest: extractShortInterest(fmpData), // No direct Alpha Vantage replacement
      earnings_data: extractEarningsData(avData, fmpData),
      social_sentiment: extractSocialSentiment(avData),
      historical_patterns: extractHistoricalPatterns(avData)
    };
    
    return stockData;
  } catch (error) {
    console.error(`Error merging data for ${ticker}:`, (error as Error).message);
    return { 
      ticker,
      company_name: '',
      sector: '',
      industry: '',
      market_cap: 0,
      float: 0,
      avg_daily_volume: 0,
      price_data: {
        previous_close: 0,
        pre_market: null,
        current: 0,
        day_range: { low: 0, high: 0 },
        "52w_range": { low: null, high: null },
        moving_averages: { ma_20: null, ma_50: null, ma_200: null }
      },
      volume_data: {
        pre_market: null,
        current: 0,
        avg_10d: 0,
        relative_volume: null
      },
      technical_indicators: {
        rsi_14: 0,
        macd: { line: 0, signal: 0, histogram: 0 },
        bollinger_bands: { upper: 0, middle: 0, lower: 0 }
      },
      news_articles: [],
      options_data: {
        call_put_ratio: null,
        unusual_activity: false,
        notable_strikes: []
      },
      short_interest: {
        percent_of_float: null,
        days_to_cover: null,
        shares_short: null
      },
      earnings_data: {
        recent_report: {
          date: null,
          eps: { actual: null, estimate: null, surprise_percent: null },
          revenue: { actual: null, estimate: null, surprise_percent: null },
          guidance: { previous: null, updated: null }
        },
        next_report_date: null
      },
      social_sentiment: {},
      historical_patterns: {
        post_earnings_reactions: [],
        gap_fill_probability: null
      }
    };
  }
}

/**
 * Extract price data from all sources
 * Updated to prioritize Alpha Vantage data
 */
function extractPriceData(
  avData: AlphaVantageData, 
  fmpData: FMPData, 
): PriceData {
  const latestDailyDate = avData.daily ? Object.keys(avData.daily)[0] : null;
  const latestDaily = latestDailyDate && avData.daily ? avData.daily[latestDailyDate] : {};
  
  // Get daily data for 52-week range
  const dailyPrices: DailyPrice[] = avData.daily 
    ? Object.entries(avData.daily).map(([date, data]) => ({
        date,
        close: parseFloat(data['4. close'])
      })).slice(0, Math.min(252, Object.keys(avData.daily).length))
    : [];
  
  return {
    previous_close: parseFloat(avData.quote?.['08. previous close']),
    pre_market: fmpData.quote?.preMarketPrice || null, // No Alpha Vantage equivalent
    current: parseFloat(avData.quote?.['05. price']),
    day_range: {
      low: parseFloat(avData.quote?.['04. low']),
      high: parseFloat(avData.quote?.['03. high'])
    },
    "52w_range": {
      low: dailyPrices.length > 0 ? Math.min(...dailyPrices.map(d => d.close)) : null,
      high: dailyPrices.length > 0 ? Math.max(...dailyPrices.map(d => d.close)) : null
    },
    moving_averages: calculateMovingAverages(dailyPrices)
  };
}

/**
 * Extract volume data from all sources
 * Updated to prioritize Alpha Vantage data
 */
function extractVolumeData(
  avData: AlphaVantageData, 
  fmpData: FMPData, 
  tradierData: TradierData
): VolumeData {
  // Calculate average volume from daily data if available
  const dailyVolumes: number[] = avData.daily 
    ? Object.entries(avData.daily).map(([date, data]) => parseFloat(data['5. volume']))
    : [];
  
  // Get last 10 days of volume
  const last10DaysVolume = dailyVolumes.slice(0, 10);
  const avgVolume10d = last10DaysVolume.length > 0 
    ? last10DaysVolume.reduce((sum, vol) => sum + vol, 0) / last10DaysVolume.length 
    : 0;
  
  const currentVolume = parseFloat(avData.quote?.['06. volume']);
  
  return {
    pre_market: fmpData.quote?.preMarketVolume || null, // No Alpha Vantage equivalent
    current: currentVolume,
    avg_10d: avgVolume10d,
    relative_volume: avgVolume10d > 0 ? currentVolume / avgVolume10d : null
  };
}

/**
 * Extract technical indicators from Alpha Vantage data
 */
function extractTechnicalIndicators(avData: AlphaVantageData): TechnicalIndicators {
  // Get latest values for each indicator
  const latestRsiDate = avData.rsi ? Object.keys(avData.rsi)[0] : null;
  const latestRsi = latestRsiDate && avData.rsi ? avData.rsi[latestRsiDate] : {};
  
  const latestMacdDate = avData.macd ? Object.keys(avData.macd)[0] : null;
  const latestMacd = latestMacdDate && avData.macd ? avData.macd[latestMacdDate] : {};
  
  const latestBbandsDate = avData.bbands ? Object.keys(avData.bbands)[0] : null;
  const latestBbands = latestBbandsDate && avData.bbands ? avData.bbands[latestBbandsDate] : {};
  
  return {
    rsi_14: parseFloat(latestRsi?.RSI || 0),
    macd: {
      line: parseFloat(latestMacd?.MACD || 0),
      signal: parseFloat(latestMacd?.['MACD_Signal'] || 0),
      histogram: parseFloat(latestMacd?.['MACD_Hist'] || 0)
    },
    bollinger_bands: {
      upper: parseFloat(latestBbands?.['Real Upper Band'] || 0),
      middle: parseFloat(latestBbands?.['Real Middle Band'] || 0),
      lower: parseFloat(latestBbands?.['Real Lower Band'] || 0)
    }
  };
}

/**
 * Extract news articles from Alpha Vantage data
 */
function extractNewsArticles(avData: AlphaVantageData): NewsArticle[] {
  if (!avData.news || !Array.isArray(avData.news)) {
    return [];
  }
  
  return avData.news.slice(0, 5).map(article => ({
    id: article.id || generateUniqueId(),
    published_utc: article.time_published,
    title: article.title,
    url: article.url,
    tags: [], // Not provided by Alpha Vantage
    sentiment_score: article.overall_sentiment_score,
    key_metrics_mentioned: extractKeyMetricsFromText(article.summary),
    analyst_actions: extractAnalystActionsFromText(article.summary)
  }));
}

/**
 * Extract comprehensive options data from Tradier
*/
function extractOptionsData(tradierData) {
    if (!tradierData.options || !Array.isArray(tradierData.options) || tradierData.options.length === 0) {
      return {
        call_put_ratio: null,
        put_call_oi_ratio: null,
        volume_oi_ratio: null,
        iv_skew: null,
        unusual_activity: false,
        notable_strikes: []
      };
    }
    
    const options = tradierData.options;
    
    // Split into calls and puts
    const calls = options.filter(opt => opt.option_type === 'call');
    const puts = options.filter(opt => opt.option_type === 'put');
    
    // Calculate volume-based call/put ratio
    const totalCallVolume = calls.reduce((sum, opt) => sum + (opt.volume || 0), 0);
    const totalPutVolume = puts.reduce((sum, opt) => sum + (opt.volume || 0), 0);
    const callPutRatio = totalPutVolume > 0 ? parseFloat((totalCallVolume / totalPutVolume).toFixed(2)) : null;
    
    // Calculate open interest-based put/call ratio (different from volume ratio)
    const totalCallOI = calls.reduce((sum, opt) => sum + (opt.open_interest || 0), 0);
    const totalPutOI = puts.reduce((sum, opt) => sum + (opt.open_interest || 0), 0);
    const putCallOIRatio = totalCallOI > 0 ? parseFloat((totalPutOI / totalCallOI).toFixed(2)) : null;
    
    // Calculate overall volume to open interest ratio (indicates unusual activity)
    const totalVolume = totalCallVolume + totalPutVolume;
    const totalOI = totalCallOI + totalPutOI;
    const volumeOIRatio = totalOI > 0 ? parseFloat((totalVolume / totalOI).toFixed(2)) : null;
    
    // Calculate IV skew (difference between put and call implied volatility at similar strikes)
    // Group options by strike price
    const strikeMap = new Map();
    options.forEach(opt => {
      if (!strikeMap.has(opt.strike)) {
        strikeMap.set(opt.strike, { call: null, put: null });
      }
      if (opt.option_type === 'call') {
        strikeMap.get(opt.strike).call = opt;
      } else {
        strikeMap.get(opt.strike).put = opt;
      }
    });
    
    // Calculate IV skew at ATM strikes (where both call and put exist)
    let ivSkews = [];
    for (const [strike, pair] of strikeMap.entries()) {
      if (pair.call && pair.put && pair.call.greeks && pair.put.greeks) {
        const skew = parseFloat(pair.put.greeks.mid_iv) - parseFloat(pair.call.greeks.mid_iv);
        ivSkews.push({ strike, skew });
      }
    }
    
    // Sort by strike and take the middle one (closest to ATM)
    ivSkews.sort((a, b) => a.strike - b.strike);
    const ivSkew = ivSkews.length > 0 ? ivSkews[Math.floor(ivSkews.length / 2)].skew : null;
    
    // Find most active options by volume (notable strikes)
    const notableStrikes = [...options]
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .slice(0, 5)
      .map(opt => ({
        strike: opt.strike,
        type: opt.option_type,
        expiration: opt.expiration_date,
        volume: opt.volume || 0,
        open_interest: opt.open_interest || 0,
        implied_volatility: opt.greeks ? opt.greeks.mid_iv : null
      }));
    
    // Determine if there's unusual activity
    const unusualActivity = options.some(opt => 
      (opt.volume > 3 * opt.open_interest && opt.volume > 100) || // Volume spike
      (opt.greeks && opt.greeks.mid_iv > 1.5) // High IV
    );
    
    return {
      call_put_ratio: callPutRatio,
      put_call_oi_ratio: putCallOIRatio,
      volume_oi_ratio: volumeOIRatio,
      iv_skew: ivSkew,
      unusual_activity: unusualActivity,
      notable_strikes: notableStrikes
    };
  }


/**
 * Extract short interest data from FMP
 * Note: This function cannot be fully replaced with Alpha Vantage
 */
function extractShortInterest(fmpData: FMPData): ShortInterest {
  if (!fmpData.shortInterest || !Array.isArray(fmpData.shortInterest) || fmpData.shortInterest.length === 0) {
    return {
      percent_of_float: null,
      days_to_cover: null,
      shares_short: null
    };
  }
  
  const latest = fmpData.shortInterest[0];
  
  return {
    percent_of_float: latest.shortPercentOfFloat || null,
    days_to_cover: latest.daysToCover || null,
    shares_short: latest.shortInterest || null
  };
}

/**
 * Extract earnings data from Alpha Vantage with FMP fallback
 * Updated to prioritize Alpha Vantage data
 */
function extractEarningsData(avData: AlphaVantageData, fmpData: FMPData): EarningsData {
  // Get data from Alpha Vantage earnings endpoint
  let recentReport = {
    date: null,
    eps: {
      actual: null,
      estimate: null,
      surprise_percent: null
    },
    revenue: {
      actual: null,
      estimate: null,
      surprise_percent: null
    },
    guidance: {
      previous: null,
      updated: null
    }
  };
  
  // Try to get data from Alpha Vantage's earnings endpoint
  if (avData.earnings && avData.earnings.quarterlyEarnings && avData.earnings.quarterlyEarnings.length > 0) {
    const latestEarnings = avData.earnings.quarterlyEarnings[0];
    
    recentReport = {
      date: latestEarnings.reportedDate || null,
      eps: {
        actual: latestEarnings.reportedEPS ? parseFloat(latestEarnings.reportedEPS) : null,
        estimate: latestEarnings.estimatedEPS ? parseFloat(latestEarnings.estimatedEPS) : null,
        surprise_percent: latestEarnings.surprisePercentage ? parseFloat(latestEarnings.surprisePercentage) : null
      },
      revenue: {
        actual: null, // Alpha Vantage earnings doesn't include revenue
        estimate: null,
        surprise_percent: null
      },
      guidance: {
        previous: null, // Alpha Vantage doesn't provide guidance
        updated: null
      }
    };
  }
  
  return {
    recent_report: recentReport,
    next_report_date: avData.overview?.EarningsDate || null
  };
}

/**
 * Extract social sentiment from Alpha Vantage news data
 * New function that replaces any FMP approach
 */
function extractSocialSentiment(avData: AlphaVantageData): Record<string, any> {
  if (!avData.news || !Array.isArray(avData.news)) {
    return {};
  }
  
  // Calculate average sentiment from news articles
  const sentiments = avData.news.map(article => article.overall_sentiment_score).filter(score => score !== undefined);
  const avgSentiment = sentiments.length > 0 
    ? sentiments.reduce((sum, score) => sum + score, 0) / sentiments.length
    : null;
  
  return {
    average_sentiment: avgSentiment,
    sentiment_count: sentiments.length,
    sentiment_trend: 'neutral' // Placeholder, would need historical data to determine trend
  };
}

/**
 * Extract historical patterns from Alpha Vantage data
 */
function extractHistoricalPatterns(avData: AlphaVantageData): HistoricalPatterns {
  // This would require more complex analysis of historical data
  return {
    post_earnings_reactions: [],
    gap_fill_probability: null
  };
}

/**
 * Calculate moving averages from daily price data
 */
function calculateMovingAverages(dailyPrices: DailyPrice[]): {
  ma_20: number | null;
  ma_50: number | null;
  ma_200: number | null;
} {
  if (!dailyPrices || dailyPrices.length === 0) {
    return {
      ma_20: null,
      ma_50: null,
      ma_200: null
    };
  }
  
  const ma20 = calculateMA(dailyPrices, 20);
  const ma50 = calculateMA(dailyPrices, 50);
  const ma200 = calculateMA(dailyPrices, 200);
  
  return {
    ma_20: ma20,
    ma_50: ma50,
    ma_200: ma200
  };
}

/**
 * Calculate a single moving average for the specified period
 */
function calculateMA(data: DailyPrice[], period: number): number | null {
  if (!data || data.length < period) {
    return null;
  }
  
  const prices = data.slice(0, period).map(d => d.close);
  return prices.reduce((sum, price) => sum + price, 0) / period;
}



/**
 * Extract key metrics mentioned in news text using simple pattern matching
 * In a production environment, you would use NLP for better extraction
 */
function extractKeyMetricsFromText(text: string | undefined): Record<string, string> {
  if (!text) return {};
  
  const metrics: Record<string, string> = {};
  
  // Simple regex patterns for common metrics
  const patterns: Record<string, RegExp> = {
    revenue_growth: /(\d+\.?\d*)% growth/i,
    revenue: /revenue of \$?(\d+\.?\d*)(?: million| billion)?/i,
    eps: /EPS of \$?(\d+\.?\d*)/i,
    subscriber_count: /(\d+\.?\d*)(?: million| billion)? subscribers/i,
    user_growth: /user growth of (\d+\.?\d*)%/i
  };
  
  // Extract metrics using patterns
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      metrics[key] = match[1];
    }
  }
  
  return metrics;
}

/**
 * Extract analyst actions from news text using simple pattern matching
 * In a production environment, you would use NLP for better extraction
 */
function extractAnalystActionsFromText(text: string | undefined): AnalystAction[] {
  if (!text) return [];
  
  const actions: AnalystAction[] = [];
  
  // Very basic pattern matching for analyst actions
  // This is overly simplified and would need more robust implementation
  const analystPattern = /([\w\s]+) (raised|lowered|maintained|upgraded|downgraded).+?from\s+\$?(\d+\.?\d*) to\s+\$?(\d+\.?\d*)/gi;
  
  let match: RegExpExecArray | null;
  while ((match = analystPattern.exec(text)) !== null) {
    actions.push({
      firm: match[1].trim(),
      action: match[2].toLowerCase(),
      previous_target: parseFloat(match[3]),
      new_target: parseFloat(match[4])
    });
  }
  
  return actions;
}

/**
 * Get the nearest options expiration date (typically a Friday)
 */
function getNearestOptionsExpirationDate(): string {
  const today = moment();
  const dayOfWeek = today.day(); // 0 = Sunday, 6 = Saturday
  
  // Calculate days until Friday (or next Friday if today is Friday after market close)
  let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
  
  // If it's Friday and past 4 PM ET, use next Friday
  if (dayOfWeek === 5 && today.hours() >= 16) {
    daysUntilFriday = 7;
  }
  
  // Set to nearest Friday
  const nearestFriday = moment(today).add(daysUntilFriday, 'days');
  
  // Format as YYYY-MM-DD
  return nearestFriday.format('YYYY-MM-DD');
}

/**
 * Generate a unique ID for articles that don't have one
 */
function generateUniqueId(): string {
  return 'gen_' + Math.random().toString(36).substring(2, 15);
}

/**
 * Helper function for delay between API calls to respect rate limits
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper functions for getting time windows
function getTodayPreMarketStart(): string {
    return moment().set({hour: 8, minute: 0, second: 0, millisecond: 0}).format('YYYY-MM-DD HH:mm'); ; // Pre-market typically starts at 8:00 AM ET
}
  
function getTodayMarketOpen(): string {
    return moment().set({hour: 9, minute: 30, second: 0, millisecond: 0}).format('YYYY-MM-DD HH:mm'); // Regular market opens at 9:30 AM ET
}

// Run the data collection and JSON assembly
buildStockAnalysisJSON().catch(console.error);

// Export functions for external use
export {
  buildStockAnalysisJSON,
  getMarketData,
  getMidCapStocks,
  getAlphaVantageData,
  getFMPData,
  getTradierData
};