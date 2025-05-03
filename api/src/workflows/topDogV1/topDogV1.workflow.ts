// @ts-nocheck
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BenzingaService } from '../../serivces/market-api/benzinga/benzinga.service';
import * as util from 'util';
import * as moment from 'moment-timezone';

export interface LLMResponse {}

@Injectable()
export class TopDogV1Workflow {
  constructor(private readonly benzingaService: BenzingaService) {}

  async process() {
    // Pull stock news from the database within last 15 minutes
    const newsItems = await this.benzingaService.getNewsBlocks(15, {
      displayOutput: 'full',
      pageSize: 25
    });

    // Process the news items here
    console.log(`Retrieved ${newsItems.length} news items from the last 15 minutes`);
  }
}


// const message = this.llmService.prep({
//   prompt,
//   fallbackPrompt: null,
//   model: LLMModelEnum.O1PRO,
//   search: false,
//   deepResearch: false,
// });