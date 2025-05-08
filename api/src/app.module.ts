import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { typeOrmConfig } from './core/rds/typeormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockCapTierEntity } from './entities/StockCapTier.entity';
import { TopDogV2Workflow } from './workflows/topDogV2/workflow.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig(__dirname)),
    TypeOrmModule.forFeature([StockCapTierEntity]),
  ],
  controllers: [AppController],
  providers: [TopDogV2Workflow],

  // providers: [/*AppGateway*/, LLMService, TopDogV1Workflow, BenzingaService, StockService, CompanyDatasetService, TopDogV2Workflow],
})
export class AppModule {}
