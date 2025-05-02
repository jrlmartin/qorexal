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
    const message = this.llmService.prep({
      prompt: 'how much is 2 + 2?',
      fallbackPrompt: 'Fallback prompt',
      deepResearch: true,
      search: false,
      model: LLMModelEnum.GPT4O_MINI,
    });

    this.gateway.broadcastEvent('processLLMEvent', message);

    return { event: 'qorexalEvent', message };
  }
}
