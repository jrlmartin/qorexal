// @ts-nocheck
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BenzingaService } from '../../serivces/market-api/benzinga/benzinga.service';
import * as util from 'util';
import * as moment from 'moment-timezone';
import { StockService } from 'src/serivces/stock.service';
import { AppLogger } from 'src/core/logger';
import { MarketCapTierEnum } from 'src/entities/StockCapTier.entity';
import * as TurndownService from 'turndown';
import { NewsItem } from 'src/serivces/market-api/benzinga/types';
import step1Prompt from './prompts';

export interface LLMResponse {}

const logger = AppLogger.for('TopDogV1Workflow');

@Injectable()
export class TopDogV1Workflow {
  private turndownService: TurndownService;

  constructor(
    private readonly benzingaService: BenzingaService,
    private readonly stockService: StockService,
  ) {
    this.turndownService = new TurndownService();
  }

  /**
   * Prepares a news item for the LLM
   * @param newsItem - The news item to prepare
   * @returns The prepared news item
   */
  private prepNewsItemForLLM(newsItem: NewsItem): string {
    const { title, body, stocks, url, channels, created, tags } = newsItem;

    // Convert HTML content to markdown if body exists and contdains HTML
    const markdownBody = body ? this.turndownService.turndown(body) : '';

    // Return formatted news item
    return `
<news-article>
## Article ID: ${newsItem.id}
## Stocks: ${stocks ? stocks.map((stock) => stock.name).join(', ') : ''}
## Published (UTC): ${created || ''}
## Title: ${title || ''}
## URL: ${url || ''}
## Tags: ${tags ? tags.map((tag) => tag.name).join(', ') : ''}
## Channels: ${channels ? channels.map((channel) => channel.name).join(', ') : ''}
## Content: ${markdownBody}
</news-article>
`;
  }

  private prepNewsItemsForLLM(newsItems: Partial<NewsItem>[]): string {
    return newsItems.map((item) => this.prepNewsItemForLLM(item)).join('\n');
  }

  /**
   * Filter on medium cap news items
   * - w/ tickers in medium cap tier or no tickers
   */
  private async filterMediumCapNewsItems(
    newsItems: Partial<NewsItem>[],
  ): Partial<NewsItem>[] {
    // Get all the tickers from the news items
    const tickers = newsItems.map((item) =>
      item.stocks.map((stock) => stock.name),
    );

    // Get all the unique tickers
    const uniqueTickers = [...new Set(tickers.flat())];

    // Check if tickers are medium cap
    const mediumCapTickers = uniqueTickers.filter(
      async (ticker) =>
        await this.stockService.isStockInCapTier(
          ticker,
          MarketCapTierEnum.MEDIUM,
        ),
    );

    // Only return news items that have medium cap tickers
    const filteredNewsItems = newsItems.filter(
      (item) =>
        item.stocks.length === 0 ||
        item.stocks.some((stock) => mediumCapTickers.includes(stock.name)),
    );

    return filteredNewsItems;
  }

  private async step1() {
    // Pull stock news from the database within last 15 minutes
    const newsItems = await this.benzingaService.getNewsBlocks(300, {
      displayOutput: 'full',
    });

    // Filter on medium cap stock news items
    const filteredNewsItems = await this.filterMediumCapNewsItems(newsItems);

    const llmPreppedNewsItems =
      await this.prepNewsItemsForLLM(filteredNewsItems);

    const prompt = step1Prompt.replace(
      '{{{newsArticles}}}',
      llmPreppedNewsItems,
    );

    console.log(prompt);

    return prompt;
  }

  private async step2(payload: any) {

  }

  private async step3(payload: any) {

  }

  /**
   * Process the top dog v1 workflow
   * - Pull stock news from the database within last 15 minutes
   * - Filter on medium cap news items
   * - Filter on news items with tickers in medium cap tier or no tickers
   * - Return the filtered news items
   */
  async process(step: number, payload?: any) {
    return await this.stockService.shortCompanyProfile('IBM');
    switch (step) {
      case 1:
        return this.step1();
      case 2:
        return this.step2(payload);
      case 3:
        return this.step3(payload);
    }
  }
}
