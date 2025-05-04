import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { LLMService } from './util/llm.service';
 
import { typeOrmConfig } from './core/rds/typeormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockCapTierEntity } from './entities/StockCapTier.entity';
import { StockService } from './serivces/stock.service';
import { BenzingaService } from './serivces/market-api/benzinga';
import { TopDogV1Workflow } from './workflows/topDogV1/topDogV1.workflow';
import { ConpanyDataSetService } from './serivces/company-dataset.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig(__dirname)),
    TypeOrmModule.forFeature([StockCapTierEntity]),
  ],
  controllers: [AppController],
  providers: [AppGateway, LLMService, TopDogV1Workflow, BenzingaService, StockService, TopDogV1Workflow, ConpanyDataSetService],
})
export class AppModule {}
