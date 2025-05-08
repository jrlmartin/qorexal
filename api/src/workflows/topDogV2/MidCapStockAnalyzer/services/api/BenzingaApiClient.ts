import axios, { AxiosInstance } from 'axios';
import * as moment from 'moment-timezone';
import * as Turndown from 'turndown';
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
  sort?:
    | 'id:asc'
    | 'id:desc'
    | 'created:asc'
    | 'created:desc'
    | 'updated:asc'
    | 'updated:desc';
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
  bodyMarkdown?: string;
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

export class BenzingaService {
  private readonly axios: AxiosInstance;
  private readonly turndownService: any;

  token = 'bz.WWL5SVXV7URHO5NQUZWV36EADONZEEJK';

  constructor() {
    this.axios = axios.create();
    this.turndownService = new Turndown();
    
    // Add rules to strip out links and images
    this.turndownService.addRule('removeLinks', {
      filter: 'a',
      replacement: function(content) {
        return content;
      }
    });

    this.turndownService.addRule('removeImages', {
      filter: ['img', 'picture'],
      replacement: function() {
        return '';
      }
    });
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
        displayOutput: params?.displayOutput || 'full',
        token: this.token,
      },
    });

    console.log(response.data);

    return response.data.map((item) => ({
      id: item.id,
      author: item.author,
      created: item.created,
      updated: item.updated,
      title: item.title,
      teaser: item.teaser,
      body: item.body,
      bodyMarkdown: item.body ? this.turndownService.turndown(item.body) : '',
      url: item.url,
      channels: item.channels,
      stocks: item.stocks,
      tags: item.tags,
    }));
  }

  /**
   * Gets all news blocks paginated by minutesAgo
   * @param minutesAgo Number of minutes ago to fetch news from
   * @param params Additional parameters for the news API
   * @returns Array of news items
   */
  async getNewsBlocks(
    minutesAgo: number,
    params?: GetNewsParams,
  ): Promise<Partial<NewsItem>[]> {
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
        ...params,
      });

      if (currentBatch.length > 0) {
        finalizedList.push(...currentBatch);
        page++;
      }
    } while (currentBatch.length > 0);

    return finalizedList;
  }
}
