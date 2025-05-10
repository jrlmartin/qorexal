import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { typeOrmConfig } from './core/rds/typeormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock, ModelRuns, StockPrice, IntradayPrice, PredictionsEvaluation } from './entities/Stock.entity';
import { TopDogV2Workflow } from './workflows/topDogV2/workflow.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig(__dirname)),
    TypeOrmModule.forFeature([Stock, ModelRuns, StockPrice, IntradayPrice, PredictionsEvaluation]),
  ],
  controllers: [AppController],
  providers: [TopDogV2Workflow],

  // providers: [/*AppGateway*/, LLMService, TopDogV1Workflow, BenzingaService, StockService, CompanyDatasetService, TopDogV2Workflow],
})
export class AppModule {}
