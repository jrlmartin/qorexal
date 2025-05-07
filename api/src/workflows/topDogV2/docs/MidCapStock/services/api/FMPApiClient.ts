import axios from 'axios';
import { config } from '../config';

export class FMPApiClient {
  private baseUrl: string = 'https://financialmodelingprep.com/api/v3';
  private apiKey: string;
  
  constructor() {
    this.apiKey = config.fmp.apiKey;
  }

  // Company profile and fundamentals
  async getCompanyProfile(symbol: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/profile/${symbol}`, {
        params: {
          apikey: this.apiKey
        }
      });
      
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw error;
    }
  }

  // Key metrics
  async getKeyMetrics(symbol: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/key-metrics/${symbol}`, {
        params: {
          apikey: this.apiKey,
          limit: 1
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching key metrics:', error);
      throw error;
    }
  }
} 