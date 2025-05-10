// src/services/api/EODHDApiClient.ts
import axios, { AxiosError } from 'axios';
import { config } from './config';
import moment from 'moment-timezone';

// Response type interfaces
export interface TechnicalIndicatorDataPoint {
  date: string;
  close: number;
  [key: string]: any;
}

export interface RSIResponse {
  date: string;
  close: number;
  rsi: number;
}

export interface MACDResponse {
  date: string;
  close: number;
  macd: number;
  signal: number;
  divergence: number;
}

export interface StochasticResponse {
  date: string;
  close: number;
  k: number;
  d: number;
}

export interface StochasticRSIResponse {
  date: string;
  close: number;
  k: number;
  d: number;
}

export interface BollingerBandsResponse {
  date: string;
  close: number;
  lband: number;
  mband: number;
  uband: number;
}

export interface MovingAverageResponse {
  date: string;
  close: number;
  [key: string]: any; // This will be sma, ema, or wma based on the type
}

export interface DMIResponse {
  date: string;
  close: number;
  plus_di: number;
  minus_di: number;
  dx: number;
}

export interface ADXResponse {
  date: string;
  close: number;
  adx: number;
}

export interface ATRResponse {
  date: string;
  close: number;
  atr: number;
}

export interface CCIResponse {
  date: string;
  close: number;
  cci: number;
}

export interface SARResponse {
  date: string;
  close: number;
  sar: number;
}

export interface BetaResponse {
  date: string;
  close: number;
  beta: number;
}

export interface HistoricalEODResponse {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}

export interface VolumeResponse {
  date: string;
  close: number;
  avgvol: number;
}

export interface VolumeByCurrencyResponse {
  date: string;
  close: number;
  avgvolccy: number;
}

export interface VolatilityResponse {
  date: string;
  close: number;
  volatility: number;
}

export interface StandardDeviationResponse {
  date: string;
  close: number;
  stddev: number;
}

export interface SlopeResponse {
  date: string;
  close: number;
  slope: number;
}

export interface SplitAdjustedResponse {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Calendar API Response Interfaces
export interface EarningsData {
  code: string;
  exchange_short_name: string;
  report_date: string;
  before_after_market: string;
  currency: string;
  actual: number | null;
  estimate: number | null;
  difference: number | null;
  percent: number | null;
  fiscal_year: number;
  fiscal_quarter: number;
}

export interface EarningsResponse {
  earnings: EarningsData[];
}

export interface EarningsTrendData {
  code: string;
  trend: {
    date: string;
    actual: number | null;
    estimate: number | null;
    difference: number | null;
    surprise_percent: number | null;
    pe: number | null;
    eps: number | null;
    eps_year_ago: number | null;
    eps_growth_quarterly: number | null;
    revenue: number | null;
    revenue_year_ago: number | null;
    revenue_growth_quarterly: number | null;
    revenue_growth_ttm: number | null;
    eps_growth_ttm: number | null;
  }[];
}

export interface EarningsTrendsResponse {
  trends: EarningsTrendData[];
}

export interface IPOData {
  code: string;
  company: string;
  exchange: string;
  exchange_short_name: string;
  currency: string;
  start_date: string;
  filing_date: string | null;
  amended_date: string | null;
  price_from: number | null;
  price_to: number | null;
  offer_price: number | null;
  shares: number | null;
  deal_status: string | null;
}

export interface IPOsResponse {
  ipos: IPOData[];
}

export interface SplitData {
  code: string;
  exchange_short_name: string;
  date: string;
  split_text: string;
  optionable: boolean;
  old_shares: number;
  new_shares: number;
}

export interface SplitsResponse {
  splits: SplitData[];
}

export interface EconomicEventData {
  /**
   * Name of the economic indicator or event
   */
  event_name: string;
  /**
   * Date and time of the event in format "YYYY-MM-DD HH:MM:SS"
   */
  date: string;
  /**
   * Country code in ISO 3166 format (2 symbols)
   */
  country: string;
  /**
   * Actual value released for the economic indicator
   * Can be a string (for non-numeric indicators) or a number
   */
  actual: string | number | null;
  /**
   * Previous reported value for the same economic indicator
   */
  previous: string | number | null;
  /**
   * Forecasted/estimated value before the actual release
   */
  estimate: string | number | null;
  /**
   * Impact level of the economic event (e.g., "Low", "Medium", "High")
   */
  impact: string;
  /**
   * Numeric change from previous value to actual value
   */
  change: number | null;
  /**
   * Percentage change from previous value to actual value
   */
  change_percentage?: number | null;
  /**
   * Additional type information about the economic event
   */
  type?: string;
}

export interface EconomicEventsResponse {
  /**
   * Array of economic events matching the query parameters
   */
  events: EconomicEventData[];
}

// Stock Fundamentals Interface with detailed types
export interface StockFundamentals {
  General: GeneralData;
  Highlights?: HighlightsData;
  Valuation?: ValuationData;
  SharesStats?: SharesStatsData;
  Technicals?: TechnicalsData;
  SplitsDividends?: SplitsDividendsData;
  AnalystRatings?: AnalystRatingsData;
  Holders?: HoldersData;
  InsiderTransactions?: InsiderTransaction[];
  ESGScores?: ESGScoresData;
  outstandingShares?: OutstandingSharesData;
  Earnings?: EarningsData;
  Financials?: FinancialsData;
  [key: string]: any;
}

export interface GeneralData {
  Code: string;
  Type: string;
  Name: string;
  Exchange: string;
  CurrencyCode: string;
  CurrencyName: string;
  CurrencySymbol: string;
  CountryName: string;
  CountryISO: string;
  OpenFigi?: string;
  ISIN: string;
  LEI?: string;
  PrimaryTicker?: string;
  CUSIP: string;
  CIK?: string;
  EmployerIdNumber?: string;
  FiscalYearEnd?: string;
  IPODate?: string;
  InternationalDomestic?: string;
  Sector?: string;
  Industry?: string;
  GicSector?: string;
  GicGroup?: string;
  GicIndustry?: string;
  GicSubIndustry?: string;
  HomeCategory?: string;
  IsDelisted: boolean;
  Description: string;
  Address?: string;
  AddressData?: {
    Street: string;
    City: string;
    State: string;
    Country: string;
    ZIP: string;
  };
  Listings?: {
    [key: string]: {
      Code: string;
      Exchange: string;
      Name: string;
    };
  };
  Officers?: {
    [key: string]: {
      Name: string;
      Title: string;
      YearBorn: string;
    };
  };
  Phone?: string;
  WebURL?: string;
  LogoURL?: string;
  FullTimeEmployees?: number;
  UpdatedAt?: string;
}

export interface HighlightsData {
  MarketCapitalization: number;
  MarketCapitalizationMln?: number;
  EBITDA?: number;
  PERatio?: number;
  PEGRatio?: number;
  WallStreetTargetPrice?: number;
  BookValue?: number;
  DividendShare?: number;
  DividendYield?: number;
  EarningsShare?: number;
  EPSEstimateCurrentYear?: number;
  EPSEstimateNextYear?: number;
  EPSEstimateNextQuarter?: number;
  EPSEstimateCurrentQuarter?: number;
  MostRecentQuarter?: string;
  ProfitMargin?: number;
  OperatingMarginTTM?: number;
  ReturnOnAssetsTTM?: number;
  ReturnOnEquityTTM?: number;
  RevenueTTM?: number;
  RevenuePerShareTTM?: number;
  QuarterlyRevenueGrowthYOY?: number;
  GrossProfitTTM?: number;
  DilutedEpsTTM?: number;
  QuarterlyEarningsGrowthYOY?: number;
}

export interface ValuationData {
  TrailingPE?: number;
  ForwardPE?: number;
  PriceSalesTTM?: number;
  PriceBookMRQ?: number;
  EnterpriseValue?: number;
  EnterpriseValueRevenue?: number;
  EnterpriseValueEbitda?: number;
}

export interface SharesStatsData {
  SharesOutstanding?: number;
  SharesFloat?: number;
  PercentInsiders?: number;
  PercentInstitutions?: number;
  SharesShort?: number | null;
  SharesShortPriorMonth?: number | null;
  ShortRatio?: number | null;
  ShortPercentOutstanding?: number | null;
  ShortPercentFloat?: number;
}

export interface TechnicalsData {
  Beta?: number;
  "52WeekHigh"?: number;
  "52WeekLow"?: number;
  "50DayMA"?: number;
  "200DayMA"?: number;
  SharesShort?: number;
  SharesShortPriorMonth?: number;
  ShortRatio?: number;
  ShortPercent?: number;
}

export interface SplitsDividendsData {
  ForwardAnnualDividendRate?: number;
  ForwardAnnualDividendYield?: number;
  PayoutRatio?: number;
  DividendDate?: string;
  ExDividendDate?: string;
  LastSplitFactor?: string;
  LastSplitDate?: string;
  NumberDividendsByYear?: {
    [key: string]: {
      Year: number;
      Count: number;
    };
  };
}

export interface AnalystRatingsData {
  Rating?: number;
  TargetPrice?: number;
  StrongBuy?: number;
  Buy?: number;
  Hold?: number;
  Sell?: number;
  StrongSell?: number;
}

export interface HoldersData {
  Institutions?: {
    [key: string]: InstitutionHolder;
  };
  Funds?: {
    [key: string]: FundHolder;
  };
}

export interface InstitutionHolder {
  name: string;
  date: string;
  totalShares: number;
  totalAssets: number;
  currentShares: number;
  change: number;
  change_p: number;
}

export interface FundHolder {
  name: string;
  date: string;
  totalShares: number;
  totalAssets: number;
  currentShares: number;
  change: number;
  change_p: number;
}

export interface InsiderTransaction {
  date: string;
  ownerCik: string | null;
  ownerName: string;
  transactionDate: string;
  transactionCode: string;
  transactionAmount: number;
  transactionPrice: number;
  transactionAcquiredDisposed: string;
  postTransactionAmount: number | null;
  secLink: string | null;
}

export interface ESGScoresData {
  [key: string]: any;
}

export interface OutstandingSharesData {
  [key: string]: any;
}

export interface EarningsData {
  [key: string]: any;
}

export interface FinancialsData {
  [key: string]: any;
}
// Options API Response Interfaces
export interface OptionsAttribute {
  contract: string;
  underlying_symbol: string;
  exp_date: string;
  expiration_type: string;
  type: string;
  strike: number;
  exchange: string;
  currency: string;
  open: number | null;
  high: number | null;
  low: number | null;
  last: number | null;
  last_size: number | null;
  change: number | null;
  pctchange: number | null;
  previous: number | null;
  previous_date: string | null;
  bid: number | null;
  bid_date: string | null;
  bid_size: number | null;
  ask: number | null;
  ask_date: string | null;
  ask_size: number | null;
  moneyness: number | null;
  volume: number | null;
  volume_change: number | null;
  volume_pctchange: number | null;
  open_interest: number | null;
  open_interest_change: number | null;
  open_interest_pctchange: number | null;
  volatility: number | null;
  volatility_change: number | null;
  volatility_pctchange: number | null;
  theoretical: number | null;
  delta: number | null;
  gamma: number | null;
  theta: number | null;
  vega: number | null;
  rho: number | null;
  tradetime: string | null;
  vol_oi_ratio: number | null;
  dte: number | null;
  midpoint: number | null;
}

export interface OptionsDataItem {
  id: string;
  type: string;
  attributes: OptionsAttribute;
}

export interface OptionsMetadata {
  offset: number;
  limit: number;
  total: number;
  fields: string[];
}

export interface OptionsContractsResponse {
  meta: OptionsMetadata;
  data: OptionsDataItem[];
}

export interface OptionsEODResponse {
  meta: OptionsMetadata;
  data: OptionsDataItem[];
}


// Consolidated Fundamentals type stays the same
export type Fundamentals = StockFundamentals;

export class EODHDApiClient {
  private baseUrl: string = 'https://eodhistoricaldata.com/api';
  private apiKey: string;

  constructor() {
    this.apiKey = config.eodhd.apiKey;

    // Check if the API key is present and warn if it's not
    if (!this.apiKey || this.apiKey.length < 10) {
      console.warn(
        'EODHD API key is missing or appears to be invalid. Some functions may not work correctly.',
      );
    }
  }

  /**
   * Helper method: formats the ticker to the expected EODHD format.
   * If the user passes "AAPL.US", we just uppercase it.
   * Otherwise, if no dot is present, we assume ".US".
   */
  private formatTicker(ticker: string): string {
    if (ticker.includes('.')) {
      return ticker.toUpperCase();
    }
    return `${ticker.toUpperCase()}.US`;
  }

  /**
   * Retrieves fundamental data for a given ticker
   *
   * Supports:
   * Stock fundamentals - use regular stock ticker format (e.g., 'AAPL')
   
   *
   * @param ticker Symbol/ISIN/CUSIP of the instrument
   * @returns Fundamentals data specific to the instrument type (stock or bond)
   */
  async getFundamentals(ticker: string): Promise<Fundamentals> {
    try {
      const formattedTicker = this.formatTicker(ticker);

      // Choose appropriate API endpoint
      const endpoint = `${this.baseUrl}/fundamentals/${formattedTicker}`;

      const response = await axios.get(endpoint, {
        params: {
          api_token: this.apiKey,
          fmt: 'json',
        },
      });

      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching fundamentals data for ${ticker}:`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }

  /**
   * Economic Calendar API - Get economic events data
   *
   * This endpoint provides comprehensive information about economic events worldwide, including
   * economic indicators, central bank meetings, government reports, and other significant events
   * that impact financial markets.
   *
   * The data includes event name, date, country, actual figures, previous values, estimates,
   * impact level, and percentage change.
   *
   * @param from Optional start date in YYYY-MM-DD format. If omitted, defaults to current date.
   * @param to Optional end date in YYYY-MM-DD format. If omitted, defaults to current date.
   * @param country Optional country code in ISO 3166 format (2 symbols). Defaults to 'US'.
   * @param comparison Optional comparison type. Possible values: 'mom' (month-over-month),
   *                   'qoq' (quarter-over-quarter), 'yoy' (year-over-year).
   * @param type Optional filter for specific types of events, e.g., "House Price Index".
   *             Uses URL encoding (e.g., "House%20Price%20Index").
   * @param offset Optional pagination offset. Possible values: 0-1000. Default: 0.
   * @param limit Optional pagination limit. Possible values: 0-1000. Default: 50.
   * @returns Economic events data for the specified period, country and filters
   */
  async getEconomicCalendar(
    from?: string,
    to?: string,
    country: string = 'US',
    comparison?: 'mom' | 'qoq' | 'yoy',
    type?: string,
    offset?: number,
    limit?: number,
  ): Promise<EconomicEventsResponse> {
    try {
      const params: Record<string, any> = {
        api_token: this.apiKey,
        fmt: 'json',
      };

      // Add all optional parameters if provided
      if (from) params.from = from;
      if (to) params.to = to;
      if (country) params.country = country;
      if (comparison) params.comparison = comparison;
      if (type) params.type = type;
      if (offset !== undefined) params.offset = offset;
      if (limit !== undefined) params.limit = limit;

      const response = await axios.get(`${this.baseUrl}/economic-events`, {
        params,
      });
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching economic calendar data:`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }

  // Calendar

  /**
   * Earnings data API - Get upcoming and historical earnings data
   *
   * This endpoint provides comprehensive earnings data, including historical and upcoming earnings dates,
   * along with information about actual and estimated earnings figures, and the difference between them.
   *
   * Data is available from January 2015 and up to several months into the future.
   *
   * @param from Optional start date in YYYY-MM-DD format. If not provided, today's date will be used.
   * @param to Optional end date in YYYY-MM-DD format. If not provided, today + 7 days will be used.
   * @param symbols Optional specific ticker symbols to query. If provided, from/to parameters will be used
   *                for the date range of these specific symbols only. Can be a single symbol or an array.
   * @param days Optional number of days to look before and after the reference date (default: 90).
   *             Only used if one of from/to is provided but not both.
   * @returns Earnings data for the specified period or symbols
   */
  async getEarnings(
    from?: string,
    to?: string,
    symbols?: string | string[],
    days: number = 90,
  ): Promise<EarningsResponse> {
    try {
      const params: Record<string, any> = {
        api_token: this.apiKey,
        fmt: 'json',
      };

      // Handle date parameters
      if (from && to) {
        // If both dates are provided, use them directly
        params.from = from;
        params.to = to;
      } else if (from) {
        // If only from is provided, calculate to as from + days
        params.from = from;
        const fromDate = moment.utc(from);
        const toDate = moment.utc(fromDate).add(days, 'days');
        params.to = toDate.format('YYYY-MM-DD');
      } else if (to) {
        // If only to is provided, calculate from as to - days
        params.to = to;
        const toDate = moment.utc(to);
        const fromDate = moment.utc(toDate).subtract(days, 'days');
        params.from = fromDate.format('YYYY-MM-DD');
      } else {
        // If neither is provided, use current date ± days
        const currentDate = moment.utc();
        const fromDate = moment.utc(currentDate).subtract(days, 'days');
        const toDate = moment.utc(currentDate).add(days, 'days');
        params.from = fromDate.format('YYYY-MM-DD');
        params.to = toDate.format('YYYY-MM-DD');
      }

      // Add symbols if provided
      if (symbols) {
        if (Array.isArray(symbols)) {
          params.symbols = symbols.map((s) => this.formatTicker(s)).join(',');
        } else {
          params.symbols = this.formatTicker(symbols);
        }
      }

      const response = await axios.get(`${this.baseUrl}/calendar/earnings`, {
        params,
      });
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching earnings data:`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }

  /**
   * Earnings Trends API - Get historical earnings trends for specific securities
   *
   * This endpoint provides detailed earnings trend data for specified symbols, including historical
   * actual vs estimated earnings, surprises, PE ratios, revenue growth, and more.
   *
   * The data is only available in JSON format due to its complex structure.
   *
   * @param symbols Required ticker symbols to query. Must be provided to get historical and upcoming
   *                earnings trend data. Can be a single symbol or an array of symbols.
   * @returns Earnings trends data for the specified symbols
   */
  async getEarningsTrends(
    symbols: string | string[],
  ): Promise<EarningsTrendsResponse> {
    try {
      let formattedSymbols: string;

      if (Array.isArray(symbols)) {
        formattedSymbols = symbols.map((s) => this.formatTicker(s)).join(',');
      } else {
        formattedSymbols = this.formatTicker(symbols);
      }

      const response = await axios.get(`${this.baseUrl}/calendar/trends`, {
        params: {
          api_token: this.apiKey,
          symbols: formattedSymbols,
          fmt: 'json',
        },
      });
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching earnings trends data:`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }

  /**
   * Upcoming IPOs API - Get information about upcoming and historical IPOs
   *
   * This endpoint provides comprehensive data about Initial Public Offerings (IPOs),
   * including company details, exchange information, filing dates, price ranges,
   * share counts, and current status.
   *
   * Data is available from January 2015 and up to 2-3 weeks into the future.
   *
   * @param from Optional start date in YYYY-MM-DD format. If not provided, today's date will be used.
   * @param to Optional end date in YYYY-MM-DD format. If not provided, today + 7 days will be used.
   * @returns IPO data for the specified period
   */
  async getUpcomingIPOs(from?: string, to?: string): Promise<IPOsResponse> {
    try {
      const params: Record<string, any> = {
        api_token: this.apiKey,
        fmt: 'json',
      };

      if (from) params.from = from;
      if (to) params.to = to;

      const response = await axios.get(`${this.baseUrl}/calendar/ipos`, {
        params,
      });
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching upcoming IPOs data:`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }

  /**
   * Upcoming Splits API - Get information about upcoming and historical stock splits
   *
   * This endpoint provides data about stock splits, including split ratios, dates,
   * and related company information. The output includes fields like split_text
   * (textual representation of the split), old_shares and new_shares (the split ratio),
   * and whether the stock is optionable.
   *
   * Data is available from January 2015 and up to several months into the future.
   * Full historical data is available through the Splits and Dividends API.
   *
   * @param from Optional start date in YYYY-MM-DD format. If not provided, today's date will be used.
   * @param to Optional end date in YYYY-MM-DD format. If not provided, today + 7 days will be used.
   * @returns Stock split data for the specified period
   */
  async getUpcomingSplits(from?: string, to?: string): Promise<SplitsResponse> {
    try {
      const params: Record<string, any> = {
        api_token: this.apiKey,
        fmt: 'json',
      };

      if (from) params.from = from;
      if (to) params.to = to;

      const response = await axios.get(`${this.baseUrl}/calendar/splits`, {
        params,
      });
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching upcoming splits data:`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }

  // Techncial Indicators

  /**
   * Helper method: makes a GET request to the "technical" endpoint with standard params
   * and returns the response data or a default fallback if there's an error.
   */
  private async fetchTechnicalData(
    functionName: string,
    ticker: string,
    extraParams: Record<string, any> = {},
  ): Promise<any> {
    try {
      const formattedTicker = this.formatTicker(ticker);
      const params = {
        function: functionName,
        api_token: this.apiKey,
        fmt: 'json',
        ...extraParams,
      };

      const response = await axios.get(
        `${this.baseUrl}/technical/${formattedTicker}`,
        { params },
      );
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching ${functionName} data for ${ticker}:`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }

  /**
   * Pattern Recognition (Broken)
   */
  async getPatternRecognition(
    ticker: string,
    period: number = 30,
  ): Promise<TechnicalIndicatorDataPoint[]> {
    try {
      return await this.fetchTechnicalData('pattern_recognition', ticker, {
        order: 'desc',
        period,
      });
    } catch (error) {
      console.error(
        `Error fetching pattern recognition data for ${ticker}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * RSI data
   *
   * The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements.
   * RSI oscillates between 0 and 100. Traditionally, RSI is considered overbought when above 70 and oversold when below 30.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 14)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @param splitadjustedOnly Optional, set to true to use split-adjusted data only (no dividend adjustments). Default is false
   * @returns Array of data points containing date, close price, and RSI value
   */
  async getRSI(
    ticker: string,
    period: number = 14,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
    splitadjustedOnly: boolean = false,
  ): Promise<RSIResponse[]> {
    return this.fetchTechnicalData('rsi', ticker, {
      period,
      from,
      to,
      order,
      splitadjusted_only: splitadjustedOnly ? '1' : '0',
    });
  }

  /**
   * MACD data
   *
   * Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator that shows the relationship
   * between two moving averages of a security's price. The MACD is calculated by subtracting the 26-period EMA from
   * the 12-period EMA. The result of that calculation is the MACD line. A 9-period EMA of the MACD called the "signal line,"
   * is then plotted on top of the MACD line, which can function as a trigger for buy and sell signals.
   *
   * @param ticker Symbol of the instrument
   * @param fastPeriod Short-term EMA period (default: 12)
   * @param slowPeriod Long-term EMA period (default: 26)
   * @param signalPeriod Signal line EMA period (default: 9)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @param splitadjustedOnly Optional, set to true to use split-adjusted data only (no dividend adjustments). Default is false
   * @returns Array of data points containing date, close price, MACD line, signal line, and histogram (divergence between MACD and signal)
   */
  async getMACD(
    ticker: string,
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
    splitadjustedOnly: boolean = false,
  ): Promise<MACDResponse[]> {
    return this.fetchTechnicalData('macd', ticker, {
      fast_period: fastPeriod,
      slow_period: slowPeriod,
      signal_period: signalPeriod,
      from,
      to,
      order,
      splitadjusted_only: splitadjustedOnly ? '1' : '0',
    });
  }

  /**
   * Moving Averages (SMA or EMA)
   *
   * Moving averages smooth out price data to create a single flowing line, making it easier to identify trends.
   * - SMA (Simple Moving Average): Calculates the average price over a specified period
   * - EMA (Exponential Moving Average): Gives more weight to recent prices, reacting more quickly to price changes
   *
   * @param ticker Symbol of the instrument
   * @param type Type of moving average: 'sma' for Simple Moving Average or 'ema' for Exponential Moving Average
   * @param period Number of periods for calculation
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @param splitadjustedOnly Optional, set to true to use split-adjusted data only (no dividend adjustments). Default is false
   * @returns Array of data points containing date, close price, and the corresponding moving average value
   */
  async getMovingAverage(
    ticker: string,
    type: 'sma' | 'ema',
    period: number,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
    splitadjustedOnly: boolean = false,
  ): Promise<MovingAverageResponse[]> {
    return this.fetchTechnicalData(type, ticker, {
      period,
      from,
      to,
      order,
      splitadjusted_only: splitadjustedOnly ? '1' : '0',
    });
  }

  /**
   * ATR
   *
   * Average True Range (ATR) is a technical analysis indicator that measures market volatility.
   * It's typically derived from the 14-day moving average of a series of true range indicators.
   * ATR is not used as an indication of price direction, just volatility.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 14)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, and ATR value
   */
  async getATR(
    ticker: string,
    period: number = 14,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<ATRResponse[]> {
    return this.fetchTechnicalData('atr', ticker, {
      period,
      from,
      to,
      order,
    });
  }

  /**
   * Bollinger Bands
   *
   * Bollinger Bands consist of a middle band (SMA) with upper and lower bands set at standard deviation levels above
   * and below the middle band. They can be used to identify overbought and oversold levels, trend direction, and potential reversals.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for the SMA calculation (default: 20)
   * @param stdDev Number of standard deviations for the upper and lower bands (default: 2)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, and the lower, middle, and upper bands
   */
  async getBollingerBands(
    ticker: string,
    period: number = 20,
    stdDev: number = 2,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<BollingerBandsResponse[]> {
    return this.fetchTechnicalData('bbands', ticker, {
      period,
      stddev: stdDev,
      from,
      to,
      order,
    });
  }

  /**
   * ADX
   *
   * Average Directional Index (ADX) is a technical analysis indicator used to quantify trend strength.
   * ADX calculations are based on a moving average of price range expansion over a specific period.
   * ADX is non-directional; it registers trend strength regardless of whether the trend is up or down.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 14)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, and ADX value
   */
  async getADX(
    ticker: string,
    period: number = 14,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<ADXResponse[]> {
    return this.fetchTechnicalData('adx', ticker, {
      period,
      from,
      to,
      order,
    });
  }

  /**
   * Stochastic Technical Indicator
   *
   * The Stochastic Oscillator is a momentum indicator that shows the location of the current close relative to the high-low
   * range over a set number of periods. The indicator ranges from 0 to 100. Readings above 80 are considered overbought,
   * while readings below 20 are considered oversold.
   *
   * @param ticker Symbol of the instrument
   * @param fastKPeriod Number of periods for %K calculation (default: 14)
   * @param slowKPeriod Number of periods for %K slowing (default: 3)
   * @param slowDPeriod Number of periods for %D calculation (default: 3)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, %K value, and %D value
   */
  async getStochastic(
    ticker: string,
    fastKPeriod: number = 14,
    slowKPeriod: number = 3,
    slowDPeriod: number = 3,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<StochasticResponse[]> {
    return this.fetchTechnicalData('stochastic', ticker, {
      fast_kperiod: fastKPeriod,
      slow_kperiod: slowKPeriod,
      slow_dperiod: slowDPeriod,
      from,
      to,
      order,
    });
  }

  /**
   * Stochastic Relative Strength Index
   *
   * Stochastic RSI combines two momentum oscillators: Stochastic and RSI. It applies the Stochastic formula to RSI values
   * instead of price data. The result is an indicator that oscillates between 0 and 1, providing overbought/oversold signals.
   *
   * @param ticker Symbol of the instrument
   * @param fastKPeriod Number of periods for %K calculation (default: 14)
   * @param fastDPeriod Number of periods for %D calculation (default: 14)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, %K value, and %D value
   */
  async getStochasticRSI(
    ticker: string,
    fastKPeriod: number = 14,
    fastDPeriod: number = 14,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<StochasticRSIResponse[]> {
    return this.fetchTechnicalData('stochrsi', ticker, {
      fast_kperiod: fastKPeriod,
      fast_dperiod: fastDPeriod,
      from,
      to,
      order,
    });
  }

  /**
   * Standard Deviation
   *
   * Standard Deviation measures the dispersion of a dataset relative to its mean. In trading, a high standard
   * deviation indicates a high volatility, while a low standard deviation indicates a period of stability/low volatility.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 50)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, and standard deviation value
   */
  async getStandardDeviation(
    ticker: string,
    period: number = 50,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<StandardDeviationResponse[]> {
    return this.fetchTechnicalData('stddev', ticker, {
      period,
      from,
      to,
      order,
    });
  }

  /**
   * Slope (Linear Regression)
   *
   * The Slope indicator measures the rate of change in prices over a specified period.
   * It uses linear regression to determine the direction and rate of price movement.
   * A positive slope indicates an uptrend, while a negative slope indicates a downtrend.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 50)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @param splitadjustedOnly Optional, set to true to use split-adjusted data only (no dividend adjustments). Default is false
   * @returns Array of data points containing date, close price, and slope value
   */
  async getSlope(
    ticker: string,
    period: number = 50,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
    splitadjustedOnly: boolean = false,
  ): Promise<SlopeResponse[]> {
    return this.fetchTechnicalData('slope', ticker, {
      period,
      from,
      to,
      order,
      splitadjusted_only: splitadjustedOnly ? '1' : '0',
    });
  }

  /**
   * Directional Movement Index (DMI/DX)
   *
   * The Directional Movement Index (DMI) identifies the direction of price movement by comparing consecutive highs and lows.
   * It consists of the Plus Directional Indicator (+DI) and Minus Directional Indicator (-DI). When +DI is above -DI,
   * there is more upward pressure, and when -DI is above +DI, there is more downward pressure on price.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 50)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, +DI, -DI, and DX values
   */
  async getDMI(
    ticker: string,
    period: number = 50,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<DMIResponse[]> {
    return this.fetchTechnicalData('dmi', ticker, {
      period,
      from,
      to,
      order,
    });
  }

  /**
   * Commodity Channel Index (CCI)
   *
   * The Commodity Channel Index (CCI) is an oscillator that measures the current price level relative to an average price level
   * over a specific period. CCI can be used to identify cyclical turns in commodities, stocks, or currencies.
   * Readings above +100 imply an overbought condition, while readings below -100 imply an oversold condition.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 50)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, and CCI value
   */
  async getCCI(
    ticker: string,
    period: number = 50,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<CCIResponse[]> {
    return this.fetchTechnicalData('cci', ticker, {
      period,
      from,
      to,
      order,
    });
  }

  /**
   * Parabolic SAR
   *
   * Parabolic SAR (Stop And Reverse) is a technical indicator used to determine the direction of price momentum and
   * potential price reversals. The indicator appears as a series of dots placed above or below price bars.
   * A dot below the price is considered bullish, while a dot above the price is considered bearish.
   *
   * @param ticker Symbol of the instrument
   * @param acceleration Acceleration factor, increases with each period (default: 0.02)
   * @param maximum Maximum acceleration factor (default: 0.20)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, and SAR value
   */
  async getParabolicSAR(
    ticker: string,
    acceleration: number = 0.02,
    maximum: number = 0.2,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<SARResponse[]> {
    return this.fetchTechnicalData('sar', ticker, {
      acceleration,
      maximum,
      from,
      to,
      order,
    });
  }

  /**
   * Beta
   *
   * Beta measures the volatility of a security compared to the market (or another security).
   * A beta of 1 indicates that the security's price moves with the market.
   * A beta greater than 1 indicates the security is more volatile than the market.
   * A beta less than 1 means the security is less volatile than the market.
   *
   * @param ticker Symbol of the instrument
   * @param code2 Symbol of the benchmark instrument (default: 'GSPC.INDX' for S&P 500)
   * @param period Number of periods for calculation (default: 50)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, and beta value
   */
  async getBeta(
    ticker: string,
    code2: string = 'GSPC.INDX',
    period: number = 50,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<BetaResponse[]> {
    return this.fetchTechnicalData('beta', ticker, {
      code2,
      period,
      from,
      to,
      order,
    });
  }

  /**
   * Average Volume
   *
   * Average Volume calculates the average number of shares traded over a specified period.
   * It's used to determine the liquidity of a security and can help identify unusual trading activity.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 50)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, and average volume
   */
  async getAverageVolume(
    ticker: string,
    period: number = 50,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<VolumeResponse[]> {
    return this.fetchTechnicalData('avgvol', ticker, {
      period,
      from,
      to,
      order,
    });
  }

  /**
   * Average Volume by Price (Currency)
   *
   * Average Volume by Price calculates the average trading volume in currency terms over a specified period.
   * This indicator represents the average monetary value of trading activity, which is useful for comparing
   * securities with different price levels.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 50)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, close price, and average volume in currency
   */
  async getAverageVolumeByPrice(
    ticker: string,
    period: number = 50,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<VolumeByCurrencyResponse[]> {
    return this.fetchTechnicalData('avgvolccy', ticker, {
      period,
      from,
      to,
      order,
    });
  }

  /**
   * Weighted Moving Average (WMA)
   *
   * Weighted Moving Average is a type of moving average that assigns a greater weight to recent data points.
   * Unlike EMA which exponentially weights older data, WMA uses a linear weighting scheme, giving the highest
   * weight to the most recent price and decreasing weights linearly for older prices.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 50)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @param splitadjustedOnly Optional, set to true to use split-adjusted data only (no dividend adjustments). Default is false
   * @returns Array of data points containing date, close price, and WMA value
   */
  async getWMA(
    ticker: string,
    period: number = 50,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
    splitadjustedOnly: boolean = false,
  ): Promise<MovingAverageResponse[]> {
    return this.fetchTechnicalData('wma', ticker, {
      period,
      from,
      to,
      order,
      splitadjusted_only: splitadjustedOnly ? '1' : '0',
    });
  }

  /**
   * Volatility
   *
   * Volatility measures the dispersion of returns for a given security or market index.
   * Higher volatility indicates greater risk as prices have potential to change dramatically in either direction.
   * This indicator calculates historical volatility based on standard deviation of price changes over a specified period.
   *
   * @param ticker Symbol of the instrument
   * @param period Number of periods for calculation (default: 50)
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @param splitadjustedOnly Optional, set to true to use split-adjusted data only (no dividend adjustments). Default is false
   * @returns Array of data points containing date, close price, and volatility value
   */
  async getVolatility(
    ticker: string,
    period: number = 50,
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
    splitadjustedOnly: boolean = false,
  ): Promise<VolatilityResponse[]> {
    return this.fetchTechnicalData('volatility', ticker, {
      period,
      from,
      to,
      order,
      splitadjusted_only: splitadjustedOnly ? '1' : '0',
    });
  }

  /**
   * Split Adjusted Data
   *
   * Returns price data adjusted only for stock splits, not dividends.
   * This is useful for technical analysis where you want prices adjusted for splits
   * but not for dividend payments, which can affect the price patterns.
   *
   * @param ticker Symbol of the instrument
   * @param aggPeriod Aggregation period: 'd' for daily, 'w' for weekly, 'm' for monthly (default: 'd')
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @returns Array of data points containing date, open, high, low, close, and volume values adjusted for splits
   */
  async getSplitAdjustedData(
    ticker: string,
    aggPeriod: 'd' | 'w' | 'm' = 'd',
    from?: string,
    to?: string,
    order: 'a' | 'd' = 'a',
  ): Promise<SplitAdjustedResponse[]> {
    return this.fetchTechnicalData('splitadjusted', ticker, {
      agg_period: aggPeriod,
      from,
      to,
      order,
    });
  }

  /**
   * Retrieves historical End-of-Day stock price data
   *
   * @param ticker Symbol of the instrument (e.g., 'AAPL', 'TSLA', 'AMZN')
   * @param from Optional start date in YYYY-MM-DD format
   * @param to Optional end date in YYYY-MM-DD format
   * @param period Optional time period: 'd' for daily, 'w' for weekly, 'm' for monthly. Default is 'd'
   * @param order Optional order of results: 'a' for ascending (old to new), 'd' for descending (new to old). Default is 'a'
   * @param filter Optional field to filter results (e.g., 'last_close')
   * @returns Array of historical price data points (open, high, low, close, adjusted_close, volume)
   */
  async getHistoricalEOD(
    ticker: string,
    from?: string,
    to?: string,
    period: 'd' | 'w' | 'm' = 'd',
    order: 'a' | 'd' = 'a',
    filter?: string
  ): Promise<HistoricalEODResponse[]> {
    try {
      const formattedTicker = this.formatTicker(ticker);
      
      const params: Record<string, any> = {
        api_token: this.apiKey,
        fmt: 'json',
      };

      // Add optional parameters if provided
      if (from) params.from = from;
      if (to) params.to = to;
      if (period) params.period = period;
      if (order) params.order = order;
      if (filter) params.filter = filter;

      const response = await axios.get(`${this.baseUrl}/eod/${formattedTicker}`, {
        params,
      });
      
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching historical EOD data for ${ticker}:`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }

  // Options

  /**
   * Get Options contracts data
   * 
   * This endpoint provides data about available options contracts for a specific underlying symbol.
   * It allows filtering by type (call/put), strike price, expiration date, and other parameters.
   * 
   * @param underlyingSymbol Symbol of the underlying instrument (e.g., 'AAPL', 'TSLA')
   * @param type Optional type of options: 'call' or 'put'
   * @param strikeFrom Optional minimum strike price to filter by
   * @param strikeTo Optional maximum strike price to filter by
   * @param expDateFrom Optional start date for option expiration in YYYY-MM-DD format
   * @param expDateTo Optional end date for option expiration in YYYY-MM-DD format
   * @param tradeDateFrom Optional start date for trading period in YYYY-MM-DD format
   * @param tradeDateTo Optional end date for trading period in YYYY-MM-DD format
   * @param sort Optional sorting field (e.g., 'exp_date', 'strike')
   * @param limit Optional number of results to return (default: 1000)
   * @param offset Optional pagination offset (default: 0)
   * @returns Options contracts data matching the specified filters
   */
  async getOptionsContracts(
    underlyingSymbol: string,
    type?: 'call' | 'put',
    strikeFrom?: number,
    strikeTo?: number,
    expDateFrom?: string,
    expDateTo?: string,
    tradeDateFrom?: string,
    tradeDateTo?: string,
    sort?: string,
    limit: number = 1000,
    offset: number = 0
  ): Promise<OptionsContractsResponse> {
    try {
      const params: Record<string, any> = {
        api_token: this.apiKey,
      };

      // Add filter parameters
      if (underlyingSymbol) params['filter[underlying_symbol]'] = underlyingSymbol;
      if (type) params['filter[type]'] = type;
      if (strikeFrom) params['filter[strike_from]'] = strikeFrom;
      if (strikeTo) params['filter[strike_to]'] = strikeTo;
      if (expDateFrom) params['filter[exp_date_from]'] = expDateFrom;
      if (expDateTo) params['filter[exp_date_to]'] = expDateTo;
      if (tradeDateFrom) params['filter[tradetime_from]'] = tradeDateFrom;
      if (tradeDateTo) params['filter[tradetime_to]'] = tradeDateTo;
      
      // Add sorting and pagination
      if (sort) params.sort = sort;
      if (limit) params.limit = limit;
      if (offset !== undefined) params.offset = offset;

      const response = await axios.get(`${this.baseUrl}/mp/unicornbay/options/contracts`, {
        params,
      });
      
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching options contracts for ${underlyingSymbol}:`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }

  /**
   * Get End-of-Day (EOD) Options data
   * 
   * This endpoint provides historical EOD data for options contracts with various filtering capabilities.
   * 
   * @param underlyingSymbol Symbol of the underlying instrument (e.g., 'AAPL', 'TSLA')
   * @param type Optional type of options: 'call' or 'put'
   * @param strikeFrom Optional minimum strike price to filter by
   * @param strikeTo Optional maximum strike price to filter by
   * @param expDateFrom Optional start date for option expiration in YYYY-MM-DD format
   * @param expDateTo Optional end date for option expiration in YYYY-MM-DD format
   * @param tradeDateFrom Optional start date for trading period in YYYY-MM-DD format
   * @param tradeDateTo Optional end date for trading period in YYYY-MM-DD format
   * @param sort Optional sorting field (e.g., 'exp_date', 'strike')
   * @param limit Optional number of results to return (default: 1000)
   * @param offset Optional pagination offset (default: 0)
   * @returns EOD options data matching the specified filters
   */
  async getOptionsEOD(
    underlyingSymbol: string,
    type?: 'call' | 'put',
    strikeFrom?: number,
    strikeTo?: number,
    expDateFrom?: string,
    expDateTo?: string,
    tradeDateFrom?: string,
    tradeDateTo?: string,
    sort?: string,
    limit: number = 1000,
    offset: number = 0
  ): Promise<OptionsEODResponse> {
    try {
      const params: Record<string, any> = {
        api_token: this.apiKey,
      };

      // Add filter parameters
      if (underlyingSymbol) params['filter[underlying_symbol]'] = underlyingSymbol;
      if (type) params['filter[type]'] = type;
      if (strikeFrom) params['filter[strike_from]'] = strikeFrom;
      if (strikeTo) params['filter[strike_to]'] = strikeTo;
      if (expDateFrom) params['filter[exp_date_from]'] = expDateFrom;
      if (expDateTo) params['filter[exp_date_to]'] = expDateTo;
      if (tradeDateFrom) params['filter[tradetime_from]'] = tradeDateFrom;
      if (tradeDateTo) params['filter[tradetime_to]'] = tradeDateTo;
      
      // Add sorting and pagination
      if (sort) params.sort = sort;
      if (limit) params.limit = limit;
      if (offset !== undefined) params.offset = offset;

      const response = await axios.get(`${this.baseUrl}/mp/unicornbay/options/eod`, {
        params,
      });
      
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching EOD options data for ${underlyingSymbol}:`,
        (error as AxiosError).message,
      );
      throw error;
    }
  }
}
