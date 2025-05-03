import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { LLMService } from './util/llm.service';
import { BenzingaService } from './util/benzinga';
import { WorkFlowService } from './workflow.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppGateway, LLMService, WorkFlowService, BenzingaService],
})
export class AppModule {}
