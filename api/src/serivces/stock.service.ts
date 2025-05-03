import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  MarketCapTierEnum,
  StockCapTierEntity,
} from '../entities/StockCapTier.entity';

@Injectable()
export class StockService {
  constructor(
    private readonly stockCapTierRepository: Repository<StockCapTierEntity>,
  ) {}

  async getStockCapTiers(): Promise<StockCapTierEntity[]> {
    return this.stockCapTierRepository.find();
  }

  async isStockInCapTier(
    ticker: string,
    capSize: MarketCapTierEnum,
  ): Promise<boolean> {
    const stock = await this.stockCapTierRepository.findOne({
      where: { ticker: ticker.toUpperCase() },
    });

    if (!stock) {
      return false;
    }

    return stock.capTier === capSize;
  }
}
