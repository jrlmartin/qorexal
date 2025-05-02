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
      prompt: 'What is the capital of France? Return the answer in JSON format.',
      fallbackPrompt: 'Fallback prompt',
      deepResearch: false,
      search: false,
      model: LLMModelEnum.GPT4O_MINI,
    });

    this.gateway.broadcastEvent('processLLMEvent', message);

    return { event: 'qorexalEvent', message };
  }
}
