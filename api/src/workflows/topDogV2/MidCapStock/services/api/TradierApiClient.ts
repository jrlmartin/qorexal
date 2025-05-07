// src/services/api/TradierApiClient.ts
import axios from 'axios';
import { config } from '../../config';
import { format, subDays } from 'date-fns';

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
  
  // Helper functions for getting time windows
  private getTodayPreMarketStart(date: Date = new Date()): string {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return `${formattedDate} 04:00`; // Pre-market can start as early as 4:00 AM ET
  }

  private getTodayMarketOpen(date: Date = new Date()): string {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return `${formattedDate} 09:30`; // Regular market opens at 9:30 AM ET
  }
  
  // Get pre-market data
  async getPreMarketData(symbol: string, date: Date = new Date()): Promise<any> {
    try {
      // Set up time windows for pre-market data
      const preMarketStart = this.getTodayPreMarketStart(date);
      const marketOpen = this.getTodayMarketOpen(date);
      
      // First get time and sales data with session filter set to 'all'
      const response = await axios.get(`${this.baseUrl}/markets/timesales`, {
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
      let preMarketData = {
        price: null,
        volume: 0,
        series: [] as any[]
      };
      
      if (response.data && response.data.series && response.data.series.data) {
        const dataPoints = response.data.series.data;
        if (Array.isArray(dataPoints) && dataPoints.length > 0) {
          // Get the most recent pre-market data point
          const latestPoint = dataPoints[dataPoints.length - 1];
          
          preMarketData = {
            price: latestPoint.price,
            volume: dataPoints.reduce((sum: number, point: any) => sum + (point.volume || 0), 0),
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
        headers: this.headers
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
        headers: this.headers
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
        headers: this.headers
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching options chains:', error);
      throw error;
    }
  }
}