/**
 * Analyst Insights
 */
export interface GetAnalystInsightsParams {
    page?: number;
    pageSize?: number;
    symbols?: string;
    analyst?: string;
    rating_id?: string;
    search_keys_type?: 'firm_id' | 'firm';
    search_keys?: string;
  }
  
  export interface AnalystInsightsResponse {
    action: string;
    analyst_insights: string;
    date: string;
    firm: string;
    firm_id: string;
    id: string;
    pt: string;
    rating: string;
    rating_id: string;
    security: {
      cik: string;
      exchange: string;
      isin: string;
      name: string;
      symbol: string;
    };
    updated: number;
  }
  
  /**
   * Bars
   */
  export interface GetBarsParams {
    symbols: string; // comma-separated
    from?: string;
    to?: string;
    interval?: string; // '1D', '5M', etc.
  }
  
  export interface BarsResponse {
    symbol: string;
    interval: number;
    candles: Array<{
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
      time: number;     // Unix timestamp in ms
      dateTime: string; // ISO8601 date string
    }>;
  }
  
  /**
   * Bull vs Bear
   */
  export interface GetBullBearSaysParams {
    symbols: string;
  }
  
  export interface BullBearSaysResponse {
    id: string;
    ticker: string;
    exchange: string;
    bear_case: string;
    bull_case: string;
    created_at: string;
    updated_at: string;
  }
  
  /**
   * Conference Call Transcripts
   */
  export interface ConferenceCallTranscriptResponse {
    id: string;
    security: {
      ticker: string;
      exchange: string;
      company_name: string;
      cik: string;
      isin: string;
    };
    transcript_full: string;
    m3u8_url: string;
    summaries: string[];
    summary_full: string;
    call_id: string;
    start_time: string;
    date: string;
  }
  
  /**
   * Insider Transactions
   */
  export interface InsiderTransactionParams {
    date?: string;
    date_from?: string;
    date_to?: string;
    fields?: string;
    pagesize?: number;
    page?: number;
    search_keys?: string;
    search_keys_type?: 'symbol' | 'accession_number' | 'id';
    updated_since?: number;
  }
  
  export interface InsiderTransactionsResponse {
    id: string;
    accession_number: string;
    company_cik: string;
    company_name: string;
    company_symbol: string;
    filing_date: string;
    footnotes: Array<{
      id: string;
      text: string;
    }>;
    form_type: string;
    html_url: string;
    owner: {
      insider_cik: string;
      insider_name: string;
      insider_title: string;
      is_director: boolean;
      is_officer: boolean;
      is_other_relation: boolean;
      is_ten_percent_owner: boolean;
      raw_signature: string;
    };
    transactions: Array<{
      is_derivative: boolean;
      acquired_or_disposed: string;
      conversion_exercise_price_derivative: string;
      date_deemed_execution: string;
      date_exercisable: string;
      date_expiration: string;
      date_transaction: string;
      post_transaction_quantity: number;
      price_per_share: string;
      security_title: string;
      shares: number;
      transaction_code: string;
      transaction_id: string;
      underlying_security_title: string;
      underlying_shares: number;
      voluntarily_reported: string;
    }>;
    updated: number;
  }
  
  /**
   * Movers
   */
  export interface GetMoversParams {
    maxResults?: number;
    from?: string;
    to?: string;
    session?: 'REGULAR' | 'PRE_MARKET' | 'AFTER_MARKET';
    screenerQuery?: string;
  }
  
  export interface MoversResponse {
    processingTimeMillis: number;
    result: {
      fromDate: string;
      toDate: string;
      snapTo: string;
      usePreviousClose: boolean;
      gainers: Mover[];
      losers: Mover[];
    };
  }
  
  export interface Mover {
    symbol: string;
    change: number;
    changePercent: number;
    volume: number;
    close: number;
    companyName: string;
    averageVolume: number;
    previousClose: number;
  }
  
  /**
   * News
   */
  export interface GetNewsParams {
    page?: number;
    pageSize?: number;
    displayOutput?: 'headline' | 'abstract' | 'full';
    date?: string;
    dateFrom?: string;
    dateTo?: string;
    updatedSince?: number;
    publishedSince?: number;
    sort?: 'id:asc'|'id:desc'|'created:asc'|'created:desc'|'updated:asc'|'updated:desc';
    isin?: string;
    cusip?: string;
    tickers?: string;
    channels?: string;
    topics?: string;
    authors?: string;
    content_types?: string;
  }
  
  export interface NewsItem {
    id: number;
    author: string;
    created: string;
    updated: string;
    title: string;
    teaser: string;
    body: string;
    url: string;
    image: Array<{
      size: string;
      url: string;
    }>;
    channels: Array<{
      name: string;
    }>;
    stocks: Array<{
      name: string;
    }>;
    tags: Array<{
      name: string;
    }>;
  }
  
  /**
   * Short Interest
   */
  export interface GetShortInterestParams {
    // Additional short interest query params can be added here, if needed
    symbols?: string;
    // e.g. date range, etc. as required
  }
  
  export interface ShortInterestResponse {
    shortInterestData: {
      [symbol: string]: {
        data: Array<{
          recordDate: string;
          symbol: string;
          company: string;
          totalShortInterest: string;
          daysToCover: number;
          shortPercentOfFloat: number;
          shortPriorMo: string;
          percentChangeMoMo: number;
          sharesFloat: string;
          averageDailyVolume: string;
          sharesOutstanding: string;
          exchange: string;
          sector: string;
          industry: string;
          exchangeReceiptDate: string;
          settlementDate: string;
        }>;
      };
    };
  }