import { Injectable } from '@nestjs/common';
import { AppLogger } from 'src/core/logger';

import { MidCapScreenerService } from './MidCapStockAnalyzer/services/MidCapScreenerService';

export interface LLMResponse {}

const logger = AppLogger.for('TopDogV1Workflow');

@Injectable()
export class TopDogV2Workflow {
  private midCapScreener: MidCapScreenerService;

  constructor() {
    this.midCapScreener = new MidCapScreenerService();
  }

  async process(stockData: any) {
    const date = '2025-05-07';
    const time = '09:30:00';

    const data = await this.midCapScreener.runAnalysis(
      date as string,
      time as string,
    );

    return data;
  }
}
