// src/services/api/EODHDApiClient.ts
import axios from 'axios';
import { config } from '../../config';

export class EODHDApiClient {
  private baseUrl: string = 'https://eodhistoricaldata.com/api';
  private apiKey: string;

  constructor() {
    this.apiKey = config.eodhd.apiKey;

    // Check if the API key is present and warn if it's not
    if (!this.apiKey || this.apiKey.length < 10) {
      console.warn(
        'EODHD API key is missing or appears to be invalid. Some functions will not work correctly.',
      );
    }
  }

  // Historical EOD data
  async getHistoricalEOD(
    ticker: string,
    from: string,
    to: string,
    period: string = 'd',
  ): Promise<any> {
    try {
      const formattedTicker = ticker.toUpperCase() + '.US';

      const response = await axios.get(
        `${this.baseUrl}/eod/${formattedTicker}`,
        {
          params: {
            api_token: this.apiKey,
            from,
            to,
            period,
            fmt: 'json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching historical EOD data:', error);
      throw error;
    }
  }

  // Pattern recognition - 1111 Need to Fix
  async getPatternRecognition(
    ticker: string,
    period: number = 30,
  ): Promise<any> {
    return { data: [] };

    try {
      const formattedTicker = ticker.toUpperCase() + '.US';

      const response = await axios.get(
        `${this.baseUrl}/technical/${formattedTicker}`,
        {
          params: {
            function: 'pattern_recognition',
            api_token: this.apiKey,
            order: 'desc',
            period,
            fmt: 'json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching pattern recognition data:', error);

      return { data: [] };
    }
  }

  // RSI data
  async getRSI(ticker: string, period: number = 14): Promise<any> {
    try {
      // Format ticker - EODHD API usually requires uppercase with exchange suffix
      const formattedTicker = ticker.toUpperCase() + '.US';

      const response = await axios.get(
        `${this.baseUrl}/technical/${formattedTicker}`,
        {
          params: {
            function: 'rsi',
            api_token: this.apiKey,
            period,
            fmt: 'json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching RSI data for ${ticker}:`, error);
      // Return empty data structure instead of throwing
      return { data: [] };
    }
  }

  // MACD data
  async getMACD(
    ticker: string,
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9,
  ): Promise<any> {
    try {
      // Format ticker - EODHD API usually requires uppercase with exchange suffix
      const formattedTicker = ticker.toUpperCase() + '.US';

      const response = await axios.get(
        `${this.baseUrl}/technical/${formattedTicker}`,
        {
          params: {
            function: 'macd',
            api_token: this.apiKey,
            fast_period: fastPeriod,
            slow_period: slowPeriod,
            signal_period: signalPeriod,
            fmt: 'json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching MACD data for ${ticker}:`, error);
      // Return empty data structure instead of throwing
      return { data: [] };
    }
  }

  // Moving Averages
  async getMovingAverage(
    ticker: string,
    type: 'sma' | 'ema',
    period: number,
  ): Promise<any> {
    try {
      // Format ticker - EODHD API usually requires uppercase with exchange suffix
      const formattedTicker = ticker.toUpperCase() + '.US';

      const response = await axios.get(
        `${this.baseUrl}/technical/${formattedTicker}`,
        {
          params: {
            function: type,
            api_token: this.apiKey,
            period,
            fmt: 'json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching moving average data for ${ticker}:`, error);
      // Return empty data structure instead of throwing
      return { data: [] };
    }
  }

  // ATR
  async getATR(ticker: string, period: number = 14): Promise<any> {
    try {
      // Format ticker - EODHD API usually requires uppercase with exchange suffix
      const formattedTicker = ticker.toUpperCase() + '.US';

      const response = await axios.get(
        `${this.baseUrl}/technical/${formattedTicker}`,
        {
          params: {
            function: 'atr',
            api_token: this.apiKey,
            period,
            fmt: 'json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching ATR data for ${ticker}:`, error);
      // Return empty data structure instead of throwing
      return { data: [] };
    }
  }

  // Bollinger Bands
  async getBollingerBands(
    ticker: string,
    period: number = 20,
    stdDev: number = 2,
  ): Promise<any> {
    try {
      // Format ticker - EODHD API usually requires uppercase with exchange suffix
      const formattedTicker = ticker.toUpperCase() + '.US';

      const response = await axios.get(
        `${this.baseUrl}/technical/${formattedTicker}`,
        {
          params: {
            function: 'bbands',
            api_token: this.apiKey,
            period,
            stddev: stdDev,
            fmt: 'json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        `Error fetching Bollinger Bands data for ${ticker}:`,
        error,
      );
      // Return empty data structure instead of throwing
      return { data: [] };
    }
  }

  // ADX
  async getADX(ticker: string, period: number = 14): Promise<any> {
    try {
      // Format ticker - EODHD API usually requires uppercase with exchange suffix
      const formattedTicker = ticker.toUpperCase() + '.US';

      const response = await axios.get(
        `${this.baseUrl}/technical/${formattedTicker}`,
        {
          params: {
            function: 'adx',
            api_token: this.apiKey,
            period,
            fmt: 'json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching ADX data for ${ticker}:`, error);
      // Return empty data structure instead of throwing
      return { data: [] };
    }
  }

  // Fundamentals
  async getFundamentals(ticker: string): Promise<any> {
    try {
      // Format ticker - EODHD API usually requires uppercase with exchange suffix
      const formattedTicker = ticker.toUpperCase() + '.US';

      const response = await axios.get(
        `${this.baseUrl}/fundamentals/${formattedTicker}`,
        {
          params: {
            api_token: this.apiKey,
            fmt: 'json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching fundamentals data for ${ticker}:`, error);
      // Return empty data structure instead of throwing
      return {
        General: { Name: ticker, Sector: 'Unknown', Industry: 'Unknown' },
      };
    }
  }

  // News articles
  async getNews(
    ticker: string,
    limit: number = 5,
    sentiment: boolean = true,
  ): Promise<any> {
    try {
      // EODHD API usually requires uppercase for news articles
      const formattedTicker = ticker.toUpperCase();

      const response = await axios.get(`${this.baseUrl}/news`, {
        params: {
          tickers: formattedTicker,
          api_token: this.apiKey,
          limit,
          sentiment: sentiment ? 1 : 0,
          fmt: 'json',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching news data for ${ticker}:`, error);
      // Return empty array instead of throwing
      return [];
    }
  }

  // Earnings data
  async getEarnings(ticker: string, from: string, to: string): Promise<any> {
    try {
      // Format ticker - EODHD API usually requires uppercase for earnings
      const formattedTicker = ticker.toUpperCase();

      const response = await axios.get(`${this.baseUrl}/calendar/earnings`, {
        params: {
          symbols: formattedTicker,
          api_token: this.apiKey,
          from,
          to,
          fmt: 'json',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching earnings data for ${ticker}:`, error);
      // Return empty array instead of throwing
      return [];
    }
  }

  // Economic calendar
  async getEconomicCalendar(
    from: string,
    to: string,
    country: string = 'US',
  ): Promise<any> {
    // 1111 Need to Fix
    return [];

    try {
      const response = await axios.get(`${this.baseUrl}/calendar/economic`, {
        params: {
          api_token: this.apiKey,
          from,
          to,
          country,
          fmt: 'json',
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        `Error fetching economic calendar data from ${from} to ${to}:`,
        error,
      );
      // Return empty array instead of throwing
      return [];
    }
  }
}
