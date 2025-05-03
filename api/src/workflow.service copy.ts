import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BenzingaService } from './util/benzinga';
import * as util from 'util';
import * as moment from 'moment-timezone';

export interface LLMResponse {}

@Injectable()
export class WorkFlowService {
  constructor(private readonly benzingaService: BenzingaService) {}

  /**
   * Converts a date and hour in CST to a Unix timestamp
   * @param date - The date in YYYY-MM-DD format
   * @param hour - The hour in 24-hour format (0-23)
   * @returns Unix timestamp in seconds
   */
  private cstToUnixTimestamp(date: string, hour: number = 0): number {
    return moment(`${date} ${hour}:00`, 'YYYY-MM-DD HH:mm')
      .tz('America/Chicago')
      .unix();
  }

  async TopDog2() {
    let page = 0;
    let currentBatch = [];
    const finalizedList = [];

    do {
      currentBatch = await this.benzingaService.getNews({
        displayOutput: 'full',
        page: page,
        pageSize: 25,
        date: '2025-05-01',
        publishedSince: this.cstToUnixTimestamp('2025-05-01', 1),
       // tickers: 'DUOL',
      });

      if (currentBatch.length > 0) {
        console.log(
          util.inspect(currentBatch, false, null, true /* enable colors */),
        );
        console.log('count', currentBatch.length);
        console.log('page', page);
        finalizedList.push(...currentBatch);
        page++;
      }
    } while (currentBatch.length > 0);

    console.log('Total items collected:', finalizedList.length);

    const prompt = `
        You are tasked with analyzing recent news articles to identify any anomalies or indicators that could make a stock bullish. Here are the news articles to analyze:

        <news_articles>
         ${JSON.stringify(finalizedList.slice(0, 25))}
        </news_articles>

        Your task is to carefully examine each news article and identify any information that could be considered an anomaly or a bullish indicator for a stock. An anomaly is an unusual or 
        unexpected event that deviates from the norm. A bullish indicator is any sign that suggests a stock's price is likely to rise.

        Analyze all the articles and give a me the most bullish stock.

        Return your findings in JSON format.
          
            {
                "stockToBy": "string",
                "bullishRating": number,
                "buyRightNow": boolean,
                "willItSkyRocketToday": boolean
            }
       
    `;

    return prompt;
  }

  async TopDog() {
    let page = 0;
    let currentBatch = [];
    const finalizedList = [];

 
      currentBatch = await this.benzingaService.getNews({
        displayOutput: 'full',
        page: 0,
        pageSize: 25,
        date: '2025-05-01',
        publishedSince: this.cstToUnixTimestamp('2025-05-01', 2),
          tickers: 'DUOL',
      });

 

    console.log('Total items collected:', currentBatch.length);

    const prompt = `
        You are tasked with analyzing recent news articles to identify any anomalies or indicators that could make a stock bullish. Here are the news articles to analyze:

        <stock_background>
            <stock_info>
            <stock_name>duol</stock_name>
            <stock_ticker>DUOL</stock_ticker>
            <background> 
                Duolingo (DUOL) Stock Background - April 30, 2025
                Based on my research, here's a comprehensive background of Duolingo (DUOL) stock as of April 30, 2025:
                Stock Price Information

                Closing Price on April 30, 2025: $389.48 This represented a 1.13% increase in the trading day TradingView
                Previous Close: $385.13
                Trading Range on April 30: $371.31 (low) to $390.41 (high)
                52-Week Range: $145.05 (low) to $441.77 (high)
            </background>
           <stock_info>
        </stock_background>

        <news_articles>
         ${JSON.stringify(currentBatch.slice(0, 25))}
        </news_articles>

        Your task is to carefully examine each news article and identify any information that could be considered an anomaly or a bullish indicator for a stock. An anomaly is an unusual or 
        unexpected event that deviates from the norm. A bullish indicator is any sign that suggests a stock's price is likely to rise.

        Analyze all the articles and give a me the most bullish stock.

        Return your findings in JSON format.
          
            {
                "stockToBy": "string",
                "bullishRating": number,
                "buyRightNow": boolean,
                "predictedClosingPrice": number
            }
       
    `;

    return prompt;
  }
}
