import { Entity, Column, Index } from 'typeorm';
import { BaseEntityMixin } from 'src/core/rds/entityMixins';

// Define namespace directly since the import is missing
const NAMESPACE = 'public';

/**
 * Market Cap Tier Enum
 * Represents the size classification of a company based on market capitalization
 */
export enum MarketCapTierEnum {
  SMALL = 'SMALL',  // < $2 billion
  MID = 'MID',      // $2-10 billion
  LARGE = 'LARGE',  // ≥ $10 billion
}

/**
 * StockCapTierEntity
 * ------------------
 * Stores information about stocks and their market capitalization tiers.
 * The cap_tier is automatically determined based on market_cap_usd value.
 */
@Entity({ name: 'stock_cap_tiers', schema: NAMESPACE })
export class StockCapTierEntity extends BaseEntityMixin(class {}) {
  /**
   * The stock ticker symbol (e.g., 'AAPL')
   */
  @Column({ type: 'varchar', length: 10 })
  @Index('idx_ticker')
  ticker!: string;

  /**
   * The company name (e.g., 'Apple Inc.')
   */
  @Column({ type: 'varchar', length: 255 })
  companyName!: string;

  /**
   * The raw market capitalization value in USD
   */
  @Column({ type: 'numeric', precision: 20, scale: 2 })
  marketCapUsd!: number;

  /**
   * The market capitalization tier, automatically derived from marketCapUsd
   * This is handled as a virtual column in the database but managed in application logic for TypeORM
   */
  @Column({
    type: 'enum',
    enum: MarketCapTierEnum,
    enumName: 'market_cap_tier'
  })
  @Index('idx_stock_cap_tier')
  capTier!: MarketCapTierEnum;

  /**
   * The date this data was captured/relevant for
   */
  @Column({ 
    type: 'date', 
    default: () => 'CURRENT_DATE' 
  })
  asOfDate!: Date;

  /**
   * Calculates the appropriate market cap tier based on the market cap value
   * This mimics the GENERATED ALWAYS AS functionality in the database
   */
  calculateCapTier(): MarketCapTierEnum {
    if (this.marketCapUsd < 2_000_000_000) {
      return MarketCapTierEnum.SMALL;
    } else if (this.marketCapUsd < 10_000_000_000) {
      return MarketCapTierEnum.MID;
    } else {
      return MarketCapTierEnum.LARGE;
    }
  }

  /**
   * Automatically sets the capTier before inserting or updating
   */
  beforeInsert() {
    this.capTier = this.calculateCapTier();
  }

  /**
   * Automatically updates the capTier before updating the entity
   */
  beforeUpdate() {
    this.capTier = this.calculateCapTier();
  }
} 