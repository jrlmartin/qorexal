import { Controller, Get } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { LLMModelEnum, LLMService } from './util/llm.service';

@Controller()
export class AppController {
  constructor(
    private readonly gateway: AppGateway,
    private readonly llmService: LLMService,
  ) {}

  @Get()
  getHello(): object {
    this.gateway.broadcastEvent();
 
    return { event: 'qorexalEvent' };
  }
}
 