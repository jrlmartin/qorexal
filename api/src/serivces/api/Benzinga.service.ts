 



import axios, { AxiosInstance } from 'axios';
import moment from 'moment-timezone';
import TurndownService from 'turndown';

/**
 * Benzinga News API Service
 * 
 * This service provides methods to interact with the Benzinga News API.
 * It allows fetching financial news articles with various filtering options
 * such as by ticker symbols, date ranges, channels, and more.
 * 
 * The service handles pagination and converts HTML content to Markdown format.
 */

/**
 * News query parameters interface
 * Defines all possible query parameters that can be passed to the Benzinga News API
 */
export interface GetNewsParams {
  /** Page offset (0-100000) for pagination */
  page?: number;
  
  /** Number of results per page (max 100) */
  pageSize?: number;
  
  /** Controls the amount of content returned:
   * - headline: title only
   * - abstract: title and teaser
   * - full: complete article with body
   */
  displayOutput?: 'headline' | 'abstract' | 'full';
  
  /** Single date to query (shorthand for identical dateFrom and dateTo) */
  date?: string;
  
  /** Start date for the query range */
  dateFrom?: string;
  
  /** End date for the query range */
  dateTo?: string;
  
  /** Filter by last updated timestamp (Unix timestamp in UTC) */
  updatedSince?: number;
  
  /** Filter by published timestamp (Unix timestamp in UTC) */
  publishedSince?: number;
  
  /** Control the sorting of results */
  sort?:
    | 'id:asc'
    | 'id:desc'
    | 'created:asc'
    | 'created:desc'
    | 'updated:asc'
    | 'updated:desc';
  
  /** Filter by International Securities Identification Numbers (max 50) */
  isin?: string;
  
  /** Filter by CUSIP identifiers (max 50, requires license) */
  cusip?: string;
  
  /** Filter by ticker symbols (max 50) */
  tickers?: string;
  
  /** Filter by channel names or IDs */
  channels?: string;
  
  /** Search for topics in Title, Tags, and Body */
  topics?: string;
  
  /** Filter by article authors */
  authors?: string;
  
  /** Filter by content types */
  content_types?: string;
}

/**
 * News item interface representing the structure of a news article returned by the API
 */
export interface NewsItem {
  /** Unique identifier of the article */
  id: number;
  
  /** Author of the article */
  author: string;
  
  /** Creation timestamp (RFC 2822 format, GMT-4) */
  created: string;
  
  /** Last update timestamp (RFC 2822 format, GMT-4) */
  updated: string;
  
  /** Article headline (plain text) */
  title: string;
  
  /** Article teaser/summary (may contain HTML) */
  teaser: string;
  
  /** Full article content (may contain HTML) */
  body: string;
  
  /** Full article content converted to Markdown format */
  bodyMarkdown?: string;
  
  /** URL where the article is published on Benzinga.com */
  url: string;
  
  /** Featured images related to the article */
  image?: Array<{
    size: string;
    url: string;
  }>;
  
  /** Topics or categories related to the article */
  channels: Array<{
    name: string;
  }>;
  
  /** Stock symbols mentioned in the article */
  stocks: Array<{
    name: string;
  }>;
  
  /** Additional tags associated with the article */
  tags: Array<{
    name: string;
  }>;
}

export class BenzingaService {
  /** Axios instance for making HTTP requests */
  private readonly axios: AxiosInstance;
  
  /** Service for converting HTML to Markdown */
  private readonly turndownService: TurndownService;

  /** 
   * API authentication token
   * This token is required for all API requests to Benzinga
   */
  token = 'bz.WWL5SVXV7URHO5NQUZWV36EADONZEEJK';

  /**
   * Initialize the Benzinga service with required dependencies
   */
  constructor() {
    // Create axios instance for HTTP requests
    this.axios = axios.create();
    
    // Initialize HTML to Markdown converter
    this.turndownService = new TurndownService();

    // Configure Markdown conversion to strip out links and images
    // This ensures cleaner Markdown output without external dependencies
    this.turndownService.addRule('removeLinks', {
      filter: 'a',
      replacement: (content: string) => content,
    });

    this.turndownService.addRule('removeImages', {
      filter: ['img', 'picture'],
      replacement: () => '',
    });
  }

  /**
   * Fetches news articles from the Benzinga API
   * 
   * @param params - Query parameters to filter and customize the news results
   * @returns Promise resolving to an array of news items
   * 
   * @example
   * // Get recent news for Apple and Microsoft
   * const news = await benzingaService.getNews({
   *   tickers: 'AAPL,MSFT',
   *   pageSize: 10,
   *   displayOutput: 'full'
   * });
   */
  async getNews(params?: GetNewsParams): Promise<Partial<NewsItem>[]> {
    const url = 'https://api.benzinga.com/api/v2/news';
    
    // Make API request with authentication token and parameters
    const { data } = await this.axios.get<NewsItem[]>(url, {
      params: {
        ...params,
        // Default to full content if not specified
        displayOutput: params?.displayOutput ?? 'full',
        // Add authentication token
        token: this.token,
      },
    });

    // Process each news item to add Markdown conversion and return
    return data.map(item => ({
      id: item.id,
      author: item.author,
      created: item.created,
      updated: item.updated,
      title: item.title,
      teaser: item.teaser,
      body: item.body,
      // Convert HTML body to Markdown if body exists
      bodyMarkdown: item.body ? this.turndownService.turndown(item.body) : '',
      url: item.url,
      channels: item.channels,
      stocks: item.stocks,
      tags: item.tags,
    }));
  }

  /**
   * Fetches all news articles published within a specified time window
   * Handles pagination automatically by making multiple API calls as needed
   * 
   * @param minutesAgo - Number of minutes in the past to fetch news from
   * @param params - Additional parameters for filtering the news
   * @returns Promise resolving to an array of all news items within the time window
   * 
   * @example
   * // Get all news from the last 60 minutes related to Tesla
   * const news = await benzingaService.getNewsBlocks(60, {
   *   tickers: 'TSLA'
   * });
   */
  async getNewsBlocks(
    minutesAgo: number,
    params?: GetNewsParams
  ): Promise<Partial<NewsItem>[]> {
    let page = 0;
    let newsBatch: Partial<NewsItem>[] = [];
    const allNewsItems: Partial<NewsItem>[] = [];
    
    // Calculate Unix timestamp for the specified minutes ago
    const publishedSince = moment().utc().subtract(minutesAgo, 'minutes').unix();

    // Continue fetching pages until an empty batch is returned
    do {
      newsBatch = await this.getNews({
        displayOutput: 'full',
        page,
        pageSize: 25, // Request 25 items per page
        publishedSince, // Filter by publication time
        ...params, // Apply any additional filters
      });

      // If we got results, add them to our collection and move to next page
      if (newsBatch.length > 0) {
        allNewsItems.push(...newsBatch);
        page++;
      }
    } while (newsBatch.length > 0);

    return allNewsItems;
  }
}