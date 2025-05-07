// src/services/api/EODHDApiClient.ts
import axios from 'axios';
import { config } from '../../config';

export class EODHDApiClient {
  private baseUrl: string = 'https://eodhistoricaldata.com/api';
  private apiKey: string;
  
  constructor() {
    this.apiKey = config.eodhd.apiKey;
  }
  
  // Historical EOD data
  async getHistoricalEOD(ticker: string, from: string, to: string, period: string = 'd'): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/eod/${ticker}`, {
        params: {
          api_token: this.apiKey,
          from,
          to,
          period
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching historical EOD data:', error);
      throw error;
    }
  }
  
  // Pattern recognition
  async getPatternRecognition(ticker: string, period: number = 30): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/technical/${ticker}`, {
        params: {
          function: 'pattern_recognition',
          api_token: this.apiKey,
          order: 'desc',
          period
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching pattern recognition data:', error);
      throw error;
    }
  }
  
  // RSI data
  async getRSI(ticker: string, period: number = 14): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/technical/${ticker}`, {
        params: {
          function: 'rsi',
          api_token: this.apiKey,
          period
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching RSI data:', error);
      throw error;
    }
  }
  
  // MACD data
  async getMACD(ticker: string, fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/technical/${ticker}`, {
        params: {
          function: 'macd',
          api_token: this.apiKey,
          fast_period: fastPeriod,
          slow_period: slowPeriod,
          signal_period: signalPeriod
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching MACD data:', error);
      throw error;
    }
  }
  
  // Moving Averages
  async getMovingAverage(ticker: string, type: 'sma' | 'ema', period: number): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/technical/${ticker}`, {
        params: {
          function: type,
          api_token: this.apiKey,
          period
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching moving average data:', error);
      throw error;
    }
  }
  
  // ATR
  async getATR(ticker: string, period: number = 14): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/technical/${ticker}`, {
        params: {
          function: 'atr',
          api_token: this.apiKey,
          period
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching ATR data:', error);
      throw error;
    }
  }
  
  // Bollinger Bands
  async getBollingerBands(ticker: string, period: number = 20, stdDev: number = 2): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/technical/${ticker}`, {
        params: {
          function: 'bbands',
          api_token: this.apiKey,
          period,
          stddev: stdDev
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching Bollinger Bands data:', error);
      throw error;
    }
  }
  
  // ADX
  async getADX(ticker: string, period: number = 14): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/technical/${ticker}`, {
        params: {
          function: 'adx',
          api_token: this.apiKey,
          period
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching ADX data:', error);
      throw error;
    }
  }
  
  // Fundamentals
  async getFundamentals(ticker: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/fundamentals/${ticker}`, {
        params: {
          api_token: this.apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching fundamentals data:', error);
      throw error;
    }
  }
  
  // News articles
  async getNews(ticker: string, limit: number = 5, sentiment: boolean = true): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/news`, {
        params: {
          tickers: ticker,
          api_token: this.apiKey,
          limit,
          sentiment: sentiment ? 1 : 0
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching news data:', error);
      throw error;
    }
  }
  
  // Earnings data
  async getEarnings(ticker: string, from: string, to: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/calendar/earnings`, {
        params: {
          symbols: ticker,
          api_token: this.apiKey,
          from,
          to
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      throw error;
    }
  }
  
  // Economic calendar
  async getEconomicCalendar(from: string, to: string, country: string = 'US'): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/calendar/economic`, {
        params: {
          api_token: this.apiKey,
          from,
          to,
          country
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching economic calendar data:', error);
      throw error;
    }
  }
}