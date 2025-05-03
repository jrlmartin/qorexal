import { Controller, Get } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { LLMModelEnum, LLMService } from './util/llm.service';
import { StockService } from './serivces/stock.service';
import { MarketCapTierEnum } from './entities/StockCapTier.entity';
@Controller()
export class AppController {
  constructor(
    private readonly gateway: AppGateway,
    private readonly llmService: LLMService,
    private readonly stockService: StockService
  ) {}

  @Get()
  async test(): Promise<object> {
    await this.gateway.broadCastTopDogV1();
   // this.gateway.broadcastEvent();
   // const isLargeCap = await this.stockService.isStockInCapTier('DUOL', MarketCapTierEnum.LARGE);
    
    return { event: 'qorexalEvent' };
  }
}
 