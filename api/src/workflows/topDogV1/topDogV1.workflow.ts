// @ts-nocheck
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BenzingaService } from '../../serivces/market-api/benzinga/benzinga.service';
import * as util from 'util';
import * as moment from 'moment-timezone';
import { StockService } from 'src/serivces/stock.service';
import { AppLogger } from 'src/core/logger';
import { MarketCapTierEnum } from 'src/entities/Stock.entity';
import * as TurndownService from 'turndown';
import { NewsItem } from 'src/serivces/market-api/benzinga/types';
import step1Prompt from './prompts';
import { CompanyDatasetService } from 'src/serivces/company-dataset.service';

export interface LLMResponse {}

const logger = AppLogger.for('TopDogV1Workflow');

@Injectable()
export class TopDogV1Workflow {
  private turndownService: TurndownService;

  constructor(
    private readonly benzingaService: BenzingaService,
    private readonly stockService: StockService,
    private readonly companyDatasetService: CompanyDatasetService
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
  async process(ticker: string, step: number, payload?: any) {
 
    
    const longProfile = await this.companyDatasetService.longProfile(ticker);
    const newsBlocks = await this.benzingaService.getNewsBlocks(60*24*5, { tickers: ticker });
    
    const newsMarkdown = this.prepNewsItemsForLLM(newsBlocks);

    return `
You are a financial analyst assistant specializing in stock market analysis.
Your task is to analyze the provided NVIDIA (NVDA) data comprehensively and present insights in a clear, structured format.

# Company Data
<company>
    ${longProfile}
</company>
 
# News
<news>
    ${newsMarkdown}
</news>

Follow these guidelines:
<instructions>
1. PRICE MOVEMENT ANALYSIS:
   - Identify key price trends from daily adjusted time series data
   - Calculate short returns (today, 1 day, 5 days)
   - Analyze price volatility and trading volume patterns
   - Identify support and resistance levels
   - Note any significant price gaps or anomalies

2. TECHNICAL INDICATOR ANALYSIS:
   - Interpret the RSI (Relative Strength Index) for overbought/oversold conditions
   - Analyze MACD (Moving Average Convergence Divergence) for trend strength and momentum
   - Evaluate OBV (On-Balance Volume) for volume pressure confirmation
   - Examine EMA (Exponential Moving Average) for trend direction
   - Assess Bollinger Bands for volatility and potential price targets
   - Review Stochastic Oscillator for momentum shifts
   - Consider ATR (Average True Range) for volatility measurement
   - Use SMA (Simple Moving Average) for trend confirmation
   - Analyze VWAP (Volume Weighted Average Price) for institutional interest
   - Combine multiple indicators for consensus signals

3. NEWS SENTIMENT ANALYSIS:
   - Summarize recent news articles affecting NVIDIA
   - Identify positive, negative, or neutral sentiment in media coverage
   - Extract key events, product announcements, or regulatory changes
   - Highlight market reactions to news events
   - Note any recurring themes or concerns in media coverage

4. FUTURE OUTLOOK:
   - Synthesize technical and fundamental analysis for short-term outlook
   - Consider growth opportunities mentioned in news articles
   - Discuss potential catalysts for price movement
   - Address analyst ratings and price targets when available

5. PREDICT PRICE MOVEMENT:
   - Predict price at opening tomorrow. 
   - Predict price at noon EST tomorrow.
   - Predict price at closing tomorrow.
   
</instructions>

Present your analysis in a clear, structured format with appropriate headings and bullet points where necessary. Use visualizations to illustrate key points if helpful. Avoid making definitive investment recommendations, but rather present evidence-based analysis that enables informed decision-making.
    `

   
    
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
