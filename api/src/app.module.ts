import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { LLMService } from './util/llm.service';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppGateway, LLMService],
})
export class AppModule {}
