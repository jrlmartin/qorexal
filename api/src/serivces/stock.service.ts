import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MarketCapTierEnum,
  StockCapTierEntity,
} from '../entities/StockCapTier.entity';
import * as alphaVantage from 'alphavantage';
import { BenzingaService } from './market-api/benzinga';

/**
 * Service for handling stock-related operations, including market cap tier classification
 * and stock data retrieval from external APIs
 */
@Injectable()
export class StockService {
  private readonly alpha: any;

  constructor(
    @InjectRepository(StockCapTierEntity)
    private readonly stockCapTierRepository: Repository<StockCapTierEntity>,
    private readonly benzinga: BenzingaService,
  ) {
    // Initialize Alpha Vantage API client with API key
    this.alpha = alphaVantage({ key: 'CM9Z7GP4R48740XD' });
  }

  /**
   * Retrieves all stock cap tier entities from the database
   * @returns Promise resolving to an array of StockCapTierEntity objects
   */
  async getStockCapTiers(): Promise<StockCapTierEntity[]> {
    return this.stockCapTierRepository.find();
  }

  /**
   * Checks if a stock is in a specific market cap tier
   * If the stock is not in the database, fetches data from Alpha Vantage API and saves it
   * 
   * @param ticker - Stock ticker symbol
   * @param capSize - Market cap tier to check against
   * @returns Promise resolving to a boolean indicating if the stock is in the specified cap tier
   */
  async isStockInCapTier(
    ticker: string,
    capSize: MarketCapTierEnum,
  ): Promise<boolean> {
    // Normalize ticker to uppercase
    ticker = ticker.toUpperCase();

    // Check if stock exists in database
    const stock = await this.stockCapTierRepository.findOne({
      where: { ticker },
    });

    if (stock) {
      return stock.capTier === capSize;
    }

    // Fetch stock data from Alpha Vantage API
    const overview = await this.alpha.fundamental.company_overview(ticker);

    const {
      Name,
      Symbol,
      Exchange,
      Sector,
      Industry,
      Country,
      MarketCapitalization,
    } = overview;

    // Create a new stock cap tier entity
    const newStock = new StockCapTierEntity();
    newStock.ticker = Symbol || ticker;
    newStock.companyName = Name || ticker;
    newStock.exchange = Exchange;
    newStock.sector = Sector;
    newStock.industry = Industry;
    newStock.country = Country;
    newStock.marketCapUsd = MarketCapitalization || 0;

    // Save the new stock cap tier entity to database
    const savedStock = await this.stockCapTierRepository.save(newStock);

    // Check if saved stock matches the requested cap tier
    return savedStock.capTier === capSize;
  }
}
