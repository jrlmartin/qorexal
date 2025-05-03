import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { LLMService } from './util/llm.service';
import { BenzingaService } from './util/benzinga';
import { WorkFlowService } from './workflow.service';
import { typeOrmConfig } from './core/rds/typeormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockCapTierEntity } from './entities/StockCapTier.entity';
import { StockService } from './serivces/stock.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig(__dirname)),
    TypeOrmModule.forFeature([StockCapTierEntity]),
  ],
  controllers: [AppController],
  providers: [AppGateway, LLMService, WorkFlowService, BenzingaService, StockService],
})
export class AppModule {}
