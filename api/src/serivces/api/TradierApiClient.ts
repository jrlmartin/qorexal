// src/services/api/TradierApiClient.ts
import axios, { AxiosResponse } from 'axios';
import { config } from './config';
import moment from 'moment-timezone';

/**
 * Interface definitions for Tradier API responses
 * Tradier's REST endpoints expect the dates and times you send to be in U.S. Eastern market time (EST / EDT), not in UTC.
 */

// Quote response interfaces
export interface Quote {
  symbol: string;
  description: string;
  exch: string;
  type: string;
  last: number;
  change: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
  bid: number;
  ask: number;
  change_percentage: number;
  average_volume: number;
  last_volume: number;
  trade_date: number;
  prevclose: number;
  week_52_high: number;
  week_52_low: number;
  bidsize: number;
  bidexch: string;
  bid_date: number;
  asksize: number;
  askexch: string;
  ask_date: number;
  root_symbols?: string[];
  // Option-specific fields
  underlying?: string;
  strike?: number;
  open_interest?: number;
  contract_size?: number;
  expiration_date?: string;
  expiration_type?: string;
  option_type?: string;
  root_symbol?: string;
  greeks?: {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
    phi: number;
    bid_iv: number;
    mid_iv: number;
    ask_iv: number;
    smv_vol?: number;     // ORATS final implied volatility
    updated_at?: number;  // Date volatility data was last updated
  };
}

export interface QuotesResponse {
  quotes: {
    quote: Quote[];
  };
}

// Historical data interfaces
export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HistoricalDataResponse {
  history: {
    day?: HistoricalDataPoint[];
  };
}

// TimeSales (intraday) data interfaces
export interface TimeSalesDataPoint {
  time: string;
  timestamp: number;
  price: number;
  open?: number;     // Only available in interval data (1min, 5min, 15min), not in tick data
  high?: number;     // Only available in interval data (1min, 5min, 15min), not in tick data
  low?: number;      // Only available in interval data (1min, 5min, 15min), not in tick data
  close?: number;    // Only available in interval data (1min, 5min, 15min), not in tick data
  volume: number;
  vwap?: number;     // Only available in interval data (1min, 5min, 15min), not in tick data
}

export interface TimeSalesResponse {
  series: {
    data: TimeSalesDataPoint[];
  };
}

// Options interfaces
export interface OptionContract {
  symbol: string;
  description: string;
  exch: string;
  type: string;
  last: number;
  change: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
  bid: number;
  ask: number;
  underlying: string;
  strike: number;
  change_percentage: number;
  average_volume: number;
  last_volume: number;
  trade_date: number;
  prevclose: number;
  week_52_high: number;
  week_52_low: number;
  bidsize: number;
  bidexch: string;
  bid_date: number;
  asksize: number;
  askexch: string;
  ask_date: number;
  open_interest: number;
  contract_size: number;
  expiration_date: string;
  expiration_type: string;
  option_type: string;
  root_symbol: string;
  greeks?: {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
    phi: number;
    bid_iv: number;
    mid_iv: number;
    ask_iv: number;
  };
}

export interface OptionsChainResponse {
  options: {
    option: OptionContract[];
  };
}

export interface OptionsExpirationResponse {
  expirations: {
    date: string | string[];
    strikes?: {
      strike: number | number[];
    };
  };
}

// Market Calendar and Clock interfaces
export interface MarketCalendarDay {
  date: string;
  status: string;
  description: string;
  open: string;
  close: string;
}

export interface MarketCalendarResponse {
  calendar: {
    days: {
      day: MarketCalendarDay[];
    };
  };
}

export interface MarketClockResponse {
  clock: {
    date: string;
    description: string;
    state: string;
    timestamp: number;
    next_change: string;
    next_state: string;
  };
}

// Pre-market data response (custom type)
export interface PreMarketData {
  price: number | null;
  volume: number;
  series: TimeSalesDataPoint[];
}

// Intraday data with VWAP (custom type)
export interface IntradayData {
  vwap: number | null;
  data: TimeSalesDataPoint[];
}

/**
 * Tradier API client for market data
 * Documentation: https://documentation.tradier.com/brokerage-api
 */
export class TradierApiClient {
  private baseUrl: string = 'https://api.tradier.com/v1';
  private apiKey: string;
  
  constructor() {
    this.apiKey = config.tradier.apiKey;
  }
  
  private get headers() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json'
    };
  }
  
  /**
   * Helper function to get the pre-market start time for a given date
   * @param date - The date to use (defaults to today)
   * @returns Formatted date-time string for the pre-market start (4:00 AM ET)
   */
  private getTodayPreMarketStart(date: Date = new Date()): string {
    const formattedDate = moment(date).tz('America/New_York').format('YYYY-MM-DD');
    return `${formattedDate} 04:00`; // Pre-market can start as early as 4:00 AM ET
  }

  /**
   * Helper function to get the market open time for a given date
   * @param date - The date to use (defaults to today)
   * @returns Formatted date-time string for market open (9:30 AM ET)
   */
  private getTodayMarketOpen(date: Date = new Date()): string {
    const formattedDate = moment(date).tz('America/New_York').format('YYYY-MM-DD');
    return `${formattedDate} 09:30`; // Regular market opens at 9:30 AM ET
  }
  
  /**
   * Helper function to get the market close time for a given date
   * @param date - The date to use (defaults to today)
   * @returns Formatted date-time string for market close (4:00 PM ET)
   */
  private getTodayMarketClose(date: Date = new Date()): string {
    const formattedDate = moment(date).tz('America/New_York').format('YYYY-MM-DD');
    return `${formattedDate} 16:00`; // Regular market closes at 4:00 PM ET
  }
  
  /**
   * Gets pre-market data for a symbol
   * Uses the timesales endpoint with a session filter to get pre-market activity
   * @param symbol - The ticker symbol to get data for
   * @param date - The date to retrieve pre-market data for (defaults to today)
   * @returns Pre-market data including latest price, total volume and time series
   */
  async getPreMarketData(symbol: string, date: Date = new Date()): Promise<PreMarketData> {
    try {
      // Set up time windows for pre-market data
      const preMarketStart = this.getTodayPreMarketStart(date);
      const marketOpen = this.getTodayMarketOpen(date);
      
      // First get time and sales data with session filter set to 'all'
      const response = await axios.get<TimeSalesResponse>(`${this.baseUrl}/markets/timesales`, {
        params: {
          symbol,
          interval: '1min',
          start: preMarketStart,
          end: marketOpen,
          session_filter: 'all' // Include all sessions (pre-market, regular, post-market)
        },
        headers: this.headers
      });
      
      // Process pre-market data
      let preMarketData: PreMarketData = {
        price: null,
        volume: 0,
        series: []
      };
      
      if (response.data && response.data.series && response.data.series.data) {
        const dataPoints = response.data.series.data;
        if (Array.isArray(dataPoints) && dataPoints.length > 0) {
          // Get the most recent pre-market data point
          const latestPoint = dataPoints[dataPoints.length - 1];
          
          preMarketData = {
            price: latestPoint.price,
            volume: dataPoints.reduce((sum: number, point: TimeSalesDataPoint) => sum + (point.volume || 0), 0),
            series: dataPoints
          };
        }
      }
      
      return preMarketData;
    } catch (error) {
      console.error('Error fetching pre-market data:', error);
      // Return default structure if API call fails
      return {
        price: null,
        volume: 0,
        series: []
      };
    }
  }
  
  /**
   * Gets historical market data for a symbol
   * Endpoint: /markets/history
   * @param symbol - The ticker symbol to get data for
   * @param start - Start date in YYYY-MM-DD format
   * @param end - End date in YYYY-MM-DD format
   * @param interval - Data interval (daily, weekly, monthly)
   * @returns Historical price data
   */
  async getHistoricalData(symbol: string, start: string, end: string, interval: string = 'daily'): Promise<HistoricalDataResponse> {
    try {
      const response = await axios.get<HistoricalDataResponse>(`${this.baseUrl}/markets/history`, {
        params: {
          symbol,
          interval,
          start,
          end
        },
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }
  
  /**
   * Gets intraday data and calculates VWAP
   * Uses the timesales endpoint to get minute-by-minute data
   * @param symbol - The ticker symbol to get data for
   * @param date - The date to retrieve intraday data for (defaults to today)
   * @returns Intraday data with calculated VWAP
   */
  async getIntradayData(symbol: string, date: Date = new Date()): Promise<IntradayData> {
    try {
      // Set up time windows for regular market hours
      const marketOpen = this.getTodayMarketOpen(date);
      const marketClose = this.getTodayMarketClose(date);
      
      // Get minute-by-minute data for the entire trading day
      const response = await axios.get<TimeSalesResponse>(`${this.baseUrl}/markets/timesales`, {
        params: {
          symbol,
          interval: '1min',
          start: marketOpen,
          end: marketClose,
          session_filter: 'open' // Only regular market hours
        },
        headers: this.headers
      });
      
      // Process and return intraday data
      let intradayData: IntradayData = {
        vwap: null,
        data: []
      };
      
      if (response.data && response.data.series && response.data.series.data) {
        const dataPoints = response.data.series.data;
        if (Array.isArray(dataPoints) && dataPoints.length > 0) {
          // Calculate VWAP using proper minute-by-minute data
          let priceVolumeSum = 0;
          let volumeSum = 0;
          
          dataPoints.forEach((point: TimeSalesDataPoint) => {
            // Use actual trade price instead of approximating with (high+low+close)/3
            priceVolumeSum += point.price * point.volume;
            volumeSum += point.volume;
          });
          
          const vwap = volumeSum > 0 ? priceVolumeSum / volumeSum : null;
          
          intradayData = {
            vwap: vwap ? parseFloat(vwap.toFixed(2)) : null,
            data: dataPoints
          };
        }
      }
      
      return intradayData;
    } catch (error) {
      console.error('Error fetching intraday data:', error);
      // Return default structure if API call fails
      return {
        vwap: null,
        data: []
      };
    }
  }
  
  /**
   * Gets real-time quotes for one or more symbols
   * Endpoint: /markets/quotes
   * @param symbols - Array of ticker symbols to get quotes for
   * @returns Real-time quotes for the requested symbols, always as an array
   */
  async getQuotes(symbols: string[]): Promise<QuotesResponse> {
    try {
      const response = await axios.get<QuotesResponse>(`${this.baseUrl}/markets/quotes`, {
        params: {
          symbols: symbols.join(',')
        },
        headers: this.headers
      });
      
      // Ensure the quote property is always an array
      if (response?.data?.quotes?.quote) {
        if (!Array.isArray(response.data.quotes.quote)) {
          response.data.quotes.quote = [response.data.quotes.quote];
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  }
  
  /**
   * Gets options chains for a symbol and expiration date
   * Endpoint: /markets/options/chains
   * @param symbol - The underlying ticker symbol
   * @param expiration - Expiration date in YYYY-MM-DD format
   * @returns Options chain data including greeks
   */
  async getOptionsChains(symbol: string, expiration: string): Promise<OptionsChainResponse> {
    try {
      const response = await axios.get<OptionsChainResponse>(`${this.baseUrl}/markets/options/chains`, {
        params: {
          symbol,
          expiration,
          greeks: true
        },
        headers: this.headers
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching options chains:', error);
      throw error;
    }
  }
  
  /**
   * Gets available options expiration dates for a symbol
   * Endpoint: /markets/options/expirations
   * @param symbol - The underlying ticker symbol
   * @returns Array of available expiration dates
   */
  async getOptionsExpirations(symbol: string): Promise<string[]> {
    try {
      const response = await axios.get<OptionsExpirationResponse>(`${this.baseUrl}/markets/options/expirations`, {
        params: {
          symbol,
          includeAllRoots: true
        },
        headers: this.headers
      });
      
      // Extract dates from response
      const expirations: string[] = [];
      if (response.data && response.data.expirations &&
          response.data.expirations.date) {
        // Handle both array and single date responses
        if (Array.isArray(response.data.expirations.date)) {
          expirations.push(...response.data.expirations.date);
        } else {
          expirations.push(response.data.expirations.date);
        }
      }
      
      return expirations;
    } catch (error) {
      console.error('Error fetching options expiration dates:', error);
      return [];
    }
  }

  /**
   * Gets available option strike prices for a symbol and expiration date
   * Endpoint: /markets/options/strikes
   * @param symbol - The underlying ticker symbol
   * @param expiration - Expiration date in YYYY-MM-DD format
   * @returns Array of available strike prices
   */
  async getOptionStrikes(symbol: string, expiration: string): Promise<number[]> {
    try {
      const response = await axios.get<OptionsExpirationResponse>(`${this.baseUrl}/markets/options/strikes`, {
        params: {
          symbol,
          expiration
        },
        headers: this.headers
      });
      
      // Extract strikes from response
      const strikes: number[] = [];
      if (response.data && response.data.expirations && 
          response.data.expirations.strikes && 
          response.data.expirations.strikes.strike) {
        // Handle both array and single strike responses
        if (Array.isArray(response.data.expirations.strikes.strike)) {
          strikes.push(...response.data.expirations.strikes.strike);
        } else {
          strikes.push(response.data.expirations.strikes.strike);
        }
      }
      
      return strikes;
    } catch (error) {
      console.error('Error fetching option strikes:', error);
      return [];
    }
  }

  /**
   * Gets time and sales data (tick data) for a symbol
   * Endpoint: /markets/timesales
   * @param symbol - The ticker symbol to get data for
   * @param interval - Interval for data points (tick, 1min, 5min, 15min)
   * @param start - Start date/time in YYYY-MM-DD HH:MM format
   * @param end - End date/time in YYYY-MM-DD HH:MM format
   * @param sessionFilter - Filter by session type (open, closed, all)
   * @returns Time and sales data for the specified parameters
   */
  async getTimeSales(
    symbol: string, 
    interval: 'tick' | '1min' | '5min' | '15min' = '1min',
    start?: string,
    end?: string,
    sessionFilter: 'all' | 'open' | 'closed' = 'all'
  ): Promise<TimeSalesResponse> {
    try {
      const response = await axios.get<TimeSalesResponse>(`${this.baseUrl}/markets/timesales`, {
        params: {
          symbol,
          interval,
          start,
          end,
          session_filter: sessionFilter
        },
        headers: this.headers
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching time and sales data:', error);
      throw error;
    }
  }

  /**
   * Gets market calendar for a specified month
   * Endpoint: /markets/calendar
   * @param year - Calendar year (YYYY)
   * @param month - Calendar month (1-12)
   * @returns Market calendar information including holidays and early closures
   */
  async getMarketCalendar(year?: number, month?: number): Promise<MarketCalendarResponse> {
    try {
      const params: Record<string, any> = {};
      if (year) params.year = year;
      if (month) params.month = month;
      
      const response = await axios.get<MarketCalendarResponse>(`${this.baseUrl}/markets/calendar`, {
        params,
        headers: this.headers
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching market calendar:', error);
      throw error;
    }
  }

  /**
   * Gets current market status (open/closed)
   * Endpoint: /markets/clock
   * @returns Current market status and times
   */
  async getMarketClock(): Promise<MarketClockResponse> {
    try {
      const response = await axios.get<MarketClockResponse>(`${this.baseUrl}/markets/clock`, {
        headers: this.headers
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching market clock:', error);
      throw error;
    }
  }

  /**
   * Search for companies by name or symbol
   * Endpoint: /markets/search
   * @param query - The search query (company name or symbol)
   * @returns Search results
   */
  async searchCompanies(query: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets/search`, {
        params: {
          q: query
        },
        headers: this.headers
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching companies:', error);
      throw error;
    }
  }

  /**
   * Look up a symbol by company name
   * Endpoint: /markets/lookup
   * @param query - The search query (company name)
   * @returns Symbol lookup results
   */
  async lookupSymbol(query: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets/lookup`, {
        params: {
          q: query
        },
        headers: this.headers
      });
      
      return response.data;
    } catch (error) {
      console.error('Error looking up symbol:', error);
      throw error;
    }
  }
}


 