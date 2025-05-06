import { Controller, Get, Query } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { LLMModelEnum, LLMService } from './util/llm.service';
import { StockService } from './serivces/stock.service';
import { MarketCapTierEnum } from './entities/StockCapTier.entity';
import { TopDogV1Workflow } from './workflows/topDogV1/topDogV1.workflow';

@Controller()
export class AppController {
  constructor(
    private readonly gateway: AppGateway,
    private readonly llmService: LLMService,
    private readonly stockService: StockService,
    private readonly topDogV1Workflow: TopDogV1Workflow
  ) {}

  @Get()
  async test(@Query('query') query: string = ''): Promise<any> {
    this.gateway.broadcastEvent();



   // return await this.topDogV1Workflow.process(query, 1);
 //    await this.gateway.broadCastTopDogV1();
   // this.gateway.broadcastEvent();
   // const isLargeCap = await this.stockService.isStockInCapTier('DUOL', MarketCapTierEnum.LARGE);
    
    return { event: 'qorexalEvent' };
  }
}
 