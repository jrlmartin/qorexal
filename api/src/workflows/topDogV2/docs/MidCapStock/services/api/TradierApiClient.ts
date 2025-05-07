import axios from 'axios';
import { config } from '../config';

export class TradierApiClient {
  private baseUrl: string = 'https://api.tradier.com/v1';
  private apiKey: string;
  
  constructor() {
    this.apiKey = config.tradier.apiKey;
  }
  
  // Pre-market data
  async getPreMarketData(symbol: string, date: string): Promise<any> {
    try {
      // Format date for API
      const formattedDate = new Date(date).toISOString().split('T')[0];
      
      // Get pre-market data from 4:00 AM to 9:30 AM
      const start = `${formattedDate} 04:00`;
      const end = `${formattedDate} 09:30`;
      
      const response = await axios.get(`${this.baseUrl}/markets/timesales`, {
        params: {
          symbol,
          interval: '1min',
          start,
          end,
          session_filter: 'all'  // Include pre-market data
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching pre-market data:', error);
      throw error;
    }
  }
  
  // Historical data
  async getHistoricalData(symbol: string, start: string, end: string, interval: string = 'daily'): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets/history`, {
        params: {
          symbol,
          interval,
          start,
          end
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }
  
  // Real-time quotes
  async getQuotes(symbols: string[]): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets/quotes`, {
        params: {
          symbols: symbols.join(',')
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  }
  
  // Options chains
  async getOptionsChains(symbol: string, expiration: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets/options/chains`, {
        params: {
          symbol,
          expiration,
          greeks: true
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching options chains:', error);
      throw error;
    }
  }
  
  // Intraday time and sales data (for VWAP calculation)
  async getTimeSales(symbol: string, date: string, interval: string = '1min'): Promise<any> {
    try {
      // Format date for API
      const formattedDate = new Date(date).toISOString().split('T')[0];
      
      // Get full day data
      const start = `${formattedDate} 09:30`;
      const end = `${formattedDate} 16:00`;
      
      const response = await axios.get(`${this.baseUrl}/markets/timesales`, {
        params: {
          symbol,
          interval,
          start,
          end
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching time and sales data:', error);
      throw error;
    }
  }
  
  // Market calendar
  async getMarketCalendar(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets/calendar`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching market calendar:', error);
      throw error;
    }
  }
  
  // Market status
  async getMarketStatus(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets/clock`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching market status:', error);
      throw error;
    }
  }
} 