import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  GetAnalystInsightsParams,
  AnalystInsightsResponse,
  GetBarsParams,
  BarsResponse,
  GetBullBearSaysParams,
  BullBearSaysResponse,
  ConferenceCallTranscriptResponse,
  InsiderTransactionParams,
  InsiderTransactionsResponse,
  GetMoversParams,
  MoversResponse,
  GetNewsParams,
  NewsItem,
  GetShortInterestParams,
  ShortInterestResponse,
} from './types';

@Injectable()
export class BenzingaService {
  private readonly axios: AxiosInstance;

  token = 'bz.WWL5SVXV7URHO5NQUZWV36EADONZEEJK';

  constructor( ) {
    this.axios = axios.create();
  }

  /**
   * GET Analyst Insights
   * https://api.benzinga.com/api/v1/analyst/insights
   */
  async getAnalystInsights(
    params?: GetAnalystInsightsParams,
  ): Promise<AnalystInsightsResponse[]> {
    const url = 'https://api.benzinga.com/api/v1/analyst/insights';
    const response = await this.axios.get<AnalystInsightsResponse[]>(url, {
      params: {
        ...params,
        token: this.token,
      },
    });
    return response.data;
  }

  /**
   * GET Bars
   * https://api.benzinga.com/api/v2/bars
   */
  async getBars(params: GetBarsParams): Promise<BarsResponse[]> {
    const url = 'https://api.benzinga.com/api/v2/bars';
    const response = await this.axios.get<BarsResponse[]>(url, {
      params: {
        ...params,
        token: this.token,
      },
    });
    return response.data;
  }

  /**
   * GET Bull vs Bear
   * https://api.benzinga.com/api/v1/bulls_bears_say
   */
  async getBullBearSays(
    params: GetBullBearSaysParams
  ): Promise<BullBearSaysResponse[]> {
    const url = 'https://api.benzinga.com/api/v1/bulls_bears_say';
    const response = await this.axios.get<BullBearSaysResponse[]>(url, {
      params: {
        ...params,
        token: this.token,
      },
    });
    return response.data;
  }

  /**
   * GET Conference Call Transcripts
   * https://api.benzinga.com/api/v1/earnings-call-transcripts
   */
  async getConferenceCallTranscripts(): Promise<ConferenceCallTranscriptResponse[]> {
    const url = 'https://api.benzinga.com/api/v1/earnings-call-transcripts';
    const response = await this.axios.get<ConferenceCallTranscriptResponse[]>(url, {
      params: {
        token: this.token,
      },
    });
    return response.data;
  }

  /**
   * GET Insider Transactions
   * https://api.benzinga.com/api/v1/sec/insider_transactions/filings
   */
  async getInsiderTransactions(
    params?: InsiderTransactionParams
  ): Promise<InsiderTransactionsResponse[]> {
    const url = 'https://api.benzinga.com/api/v1/sec/insider_transactions/filings';
    const response = await this.axios.get<InsiderTransactionsResponse[]>(url, {
      params: {
        ...params,
        token: this.token,
      },
    });
    return response.data;
  }

  /**
   * GET Movers
   * https://api.benzinga.com/api/v1/market/movers
   */
  async getMovers(params?: GetMoversParams): Promise<MoversResponse> {
    const url = 'https://api.benzinga.com/api/v1/market/movers';
    const response = await this.axios.get<MoversResponse>(url, {
      params: {
        ...params,
        token: this.token,
      },
    });
    return response.data;
  }

  /**
   * GET News
   * https://api.benzinga.com/api/v2/news
   */
  async getNews(params?: GetNewsParams): Promise<Partial<NewsItem>[]> {
    const url = 'https://api.benzinga.com/api/v2/news';
    const response = await this.axios.get<NewsItem[]>(url, {
      params: {
        ...params,
        token: this.token,
      },
    });
    
    return response.data.map(item => ({
      author: item.author,
      created: item.created,
      title: item.title,
      teaser: item.teaser,
      body: item.body,
     // url: item.url,
      channels: item.channels,
      stocks: item.stocks,
      tags: item.tags
    }));
  }

  /**
   * GET Short Interest
   * https://api.benzinga.com/api/v1/shortinterest
   */
  async getShortInterest(
    params?: GetShortInterestParams
  ): Promise<ShortInterestResponse> {
    const url = 'https://api.benzinga.com/api/v1/shortinterest';
    const response = await this.axios.get<ShortInterestResponse>(url, {
      params: {
        ...params,
        token: this.token,
      },
    });
    return response.data;
  }
}