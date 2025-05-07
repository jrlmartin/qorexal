// src/services/api/TradierApiClient.ts
import axios from 'axios';
import { config } from '../../config';

export class TradierApiClient {
  private baseUrl: string = 'https://api.tradier.com/v1';
  private apiKey: string;
  
  constructor() {
    this.apiKey = config.tradier.apiKey;
  }
  
  // Pre-market data
  async getPreMarketData(symbol: string, start: string, end: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets/timesales`, {
        params: {
          symbol,
          interval: '1min',
          start,
          end,
          session_filter: 'all'
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
  
  // Historical data for moving averages, etc.
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
}