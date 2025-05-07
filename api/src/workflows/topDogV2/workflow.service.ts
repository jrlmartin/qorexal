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

  async processStockData(stockData: any) {
   
    const date = '2025-05-07';
    const time = '09:30:00';

    const data = await midCapScreener.runAnalysis(
      date as string, 
      time as string
    );
    
    return data;
  }

}
