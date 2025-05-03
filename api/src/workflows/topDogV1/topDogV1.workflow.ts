// @ts-nocheck
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BenzingaService } from '../../serivces/market-api/benzinga/benzinga.service';
import * as util from 'util';
import * as moment from 'moment-timezone';
import { StockService } from 'src/serivces/stock.service';
import { AppLogger } from 'src/core/logger';
import { MarketCapTierEnum } from 'src/entities/StockCapTier.entity';

export interface LLMResponse {}

const logger = AppLogger.for('TopDogV1Workflow');

@Injectable()
export class TopDogV1Workflow {
  constructor(
    private readonly benzingaService: BenzingaService,
    private readonly stockService: StockService,
  ) {}

  private async prepNewsItemsForLLM(
    newsItems: Partial<NewsItem>[],
  ): Promise<string> {
    return newsItems.map((item) => item.title).join('\n');
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
    const mediumCapTickers = uniqueTickers.filter(async (ticker) =>
      await this.stockService.isStockInCapTier(ticker, MarketCapTierEnum.MEDIUM),
    );

    // Only return news items that have medium cap tickers
    const filteredNewsItems = newsItems.filter(
      (item) =>
        item.stocks.length === 0 ||
        item.stocks.some((stock) => mediumCapTickers.includes(stock.name)),
    );

    return filteredNewsItems;
  }

  /**
   * Process the top dog v1 workflow
   * - Pull stock news from the database within last 15 minutes
   * - Filter on medium cap news items
   * - Filter on news items with tickers in medium cap tier or no tickers
   * - Return the filtered news items
   */
  async process() {
    // Pull stock news from the database within last 15 minutes
    const newsItems = await this.benzingaService.getNewsBlocks(300, {
      displayOutput: 'full',
    });

    // Filter on medium cap news items
    const filteredNewsItems = await this.filterMediumCapNewsItems(newsItems);

    const llmPreppedNewsItems =
      await this.prepNewsItemsForLLM(filteredNewsItems);
  }
}

// const message = this.llmService.prep({
//   prompt,
//   fallbackPrompt: null,
//   model: LLMModelEnum.O1PRO,
//   search: false,
//   deepResearch: false,
// });
