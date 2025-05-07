import { Controller, Get, Query } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { LLMModelEnum, LLMService } from './util/llm.service';
import { StockService } from './serivces/stock.service';
import { MarketCapTierEnum } from './entities/StockCapTier.entity';
import { TopDogV1Workflow } from './workflows/topDogV1/topDogV1.workflow';
import { TopDogV2Workflow } from './workflows/topDogV2/workflow.service';
@Controller()
export class AppController {
  constructor(
    private readonly topDogV2Workflow: TopDogV2Workflow,
  ) {}

  @Get()
  async test(@Query('query') query: string = ''): Promise<any> {
    // this.gateway.broadcastEvent();

    const data = await this.topDogV2Workflow.process({});
    return data;
  }
}
