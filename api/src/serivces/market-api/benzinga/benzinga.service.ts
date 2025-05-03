import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as moment from 'moment-timezone';
import {
  GetNewsParams,
  NewsItem,
} from './types';

@Injectable()
export class BenzingaService {
  private readonly axios: AxiosInstance;

  token = 'bz.WWL5SVXV7URHO5NQUZWV36EADONZEEJK';

  constructor( ) {
    this.axios = axios.create();
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
      createdCst: moment(item.created).tz('America/Chicago').format('MM/DD/YY h:mm A'),
      updated: item.updated,
      updatedCst: moment(item.updated).tz('America/Chicago').format('MM/DD/YY h:mm A'),
      title: item.title,
      teaser: item.teaser,
      body: item.body,
      url: item.url,
      channels: item.channels,
      stocks: item.stocks,
      tags: item.tags
    }));
  }

  /**
   * Gets all news blocks paginated by minutesAgo
   * @param minutesAgo Number of minutes ago to fetch news from
   * @param params Additional parameters for the news API
   * @returns Array of news items
   */
  async getNewsBlocks(minutesAgo: number, params?: GetNewsParams): Promise<Partial<NewsItem>[]> {
    let page = 0;
    let currentBatch = [];
    const finalizedList = [];
    const publishedSince = moment().subtract(minutesAgo, 'minutes').unix();

    do {
      currentBatch = await this.getNews({
        displayOutput: 'full',
        page: page,
        pageSize: 25,
        publishedSince,
        ...params
      });

      if (currentBatch.length > 0) {
        finalizedList.push(...currentBatch);
        page++;
      }
    } while (currentBatch.length > 0);

    return finalizedList;
  }
}