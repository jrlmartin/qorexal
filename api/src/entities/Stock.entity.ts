import { Entity, Column, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntityMixin, UUIDBaseMixin } from 'src/core/rds/entityMixins';

// Define namespace directly since the import is missing
const NAMESPACE = 'public';


export enum ModelNameEnum {
  TopDogV1 = 'TopDogV1',
  TopDogV2 = 'TopDogV2',
  TopDogV3 = 'TopDogV3',
  TopDogV4 = 'TopDogV4',
}

/**
 * Market Cap Tier Enum
 * Represents the size classification of a company based on market capitalization
 */
export enum MarketCapTierEnum {
  SMALL = 'SMALL', // < $2 billion
  MID = 'MID', // $2-10 billion
  LARGE = 'LARGE', // ≥ $10 billion
}

/**
 * Stock Entity
 * ------------------
 * Stores information about stocks and their market capitalization tiers.
 * The cap_tier is automatically determined based on market_cap_usd value.
 */
@Entity({ name: 'stock', schema: NAMESPACE })
export class Stock extends BaseEntityMixin(class {}) {
  /**
   * The stock ticker symbol (e.g., 'AAPL')
   */
  @Column({ type: 'varchar', length: 10 })
  @Index('idx_stock_ticker', { unique: true })
  ticker!: string;

  /**
   * The company name (e.g., 'Apple Inc.')
   */
  @Column({ type: 'varchar', length: 255 })
  @Index('idx_stock_company_name')
  companyName!: string;

  /**
   * The exchange where the stock is listed (e.g., 'NASDAQ')
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index('idx_stock_exchange')
  exchange!: string;

  /**
   * The sector the company belongs to (e.g., 'Technology')
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index('idx_stock_sector')
  sector!: string;

  /**
   * The specific industry within the sector (e.g., 'Consumer Electronics')
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index('idx_stock_industry')
  industry!: string;

  /**
   * The country where the company is headquartered
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  country!: string;

  /**
   * The raw market capitalization value in USD
   */
  @Column({ type: 'numeric', precision: 20, scale: 2 })
  @Index('idx_stock_market_cap')
  marketCapUsd!: number;

  /**
   * The market capitalization tier, automatically derived from marketCapUsd
   * This is handled as a virtual column in the database but managed in application logic for TypeORM
   */
  @Column({
    type: 'enum',
    enum: MarketCapTierEnum,
    enumName: 'market_cap_tier',
  })
  @Index('idx_stock_cap_tier')
  capTier!: MarketCapTierEnum;

  /**
   * The date this data was captured/relevant for
   */
  @Column({
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  @Index('idx_stock_as_of_date')
  asOfDate!: Date;
  
  /**
   * One-to-many relationship to ModelRuns
   */
  @OneToMany(() => ModelRuns, (modelRun) => modelRun.stock)
  modelRuns?: ModelRuns[];

  /**
   * One-to-many relationship to StockPrices
   */
  @OneToMany(() => StockPrice, (stockPrice) => stockPrice.stock)
  stockPrices?: StockPrice[];
  
  /**
   * One-to-many relationship to IntradayPrices
   */
  @OneToMany(() => IntradayPrice, (intradayPrice) => intradayPrice.stock)
  intradayPrices?: IntradayPrice[];

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

/**
 * ModelRuns Entity
 * ------------------
 * Stores predictions and model information for stocks
 */
@Entity({ name: 'model_runs', schema: NAMESPACE })
@Index('idx_model_runs_composite', ['stockId', 'asOfDateTime', 'modelName'])
export class ModelRuns extends UUIDBaseMixin(BaseEntityMixin(class {})) {
  // Create relationship to Stock entity
  @ManyToOne(() => Stock, (stock) => stock.modelRuns, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'stock_id' })
  stock!: Stock;
  
  @Column({ type: 'int' })
  @Index('idx_model_runs_stock_id')
  stockId!: number;

  @Column({ type: 'timestamptz' })
  @Index('idx_model_runs_as_of_date_time')
  asOfDateTime!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  confidence100High?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  confidence90High?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  confidence80High?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  confidence70High?: number;

  @Column({ type: 'varchar', length: 100 })
  @Index('idx_model_runs_model_name')
  modelName!: ModelNameEnum;

  @Column({ type: 'varchar', length: 100 })
  ghIdentifier!: string;
}

/**
 * StockPrice Entity
 * ------------------
 * Stores historical price data for stocks
 */
@Entity({ name: 'stock_prices', schema: NAMESPACE })
@Index('idx_stock_prices_stock_date', ['stockId', 'date'])
export class StockPrice extends BaseEntityMixin(class {}) {
  @ManyToOne(() => Stock, (stock) => stock.stockPrices, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'stock_id' })
  stock!: Stock;

  @Column({ type: 'int' })
  @Index('idx_stock_prices_stock_id')
  stockId!: number;

  @Column({ type: 'date' })
  @Index('idx_stock_prices_date')
  date!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  actualHigh!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  openPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  closePrice?: number;

  @Column({ type: 'bigint', nullable: true })
  volume?: number;
}

/**
 * IntradayPrice Entity
 * ------------------
 * Stores intraday price data for stocks at specific time intervals
 */
@Entity({ name: 'intraday_prices', schema: NAMESPACE })
@Index('idx_intraday_prices_stock_interval', ['stockId', 'intervalStart'])
export class IntradayPrice extends BaseEntityMixin(class {}) {
  @ManyToOne(() => Stock, (stock) => stock.intradayPrices, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'stock_id' })
  stock!: Stock;

  @Column({ type: 'int' })
  @Index('idx_intraday_prices_stock_id')
  stockId!: number;

  @Column({ type: 'timestamp', name: 'interval_start' })
  @Index('idx_intraday_prices_interval_start')
  intervalStart!: Date;

  @Column({ type: 'timestamp', name: 'interval_end' })
  intervalEnd!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  openPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  highPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  lowPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  closePrice?: number;

  @Column({ type: 'bigint', nullable: true })
  volume?: number;
}

/**
 * PredictionsEvaluation Entity
 * ------------------
 * Stores evaluation metrics for model prediction accuracy
 */
@Entity({ name: 'predictions_evaluation', schema: NAMESPACE })
@Index('idx_predictions_evaluation_model_run_id', ['modelRunId'])
export class PredictionsEvaluation extends BaseEntityMixin(class {}) {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  actualHigh!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  errorValue?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  errorPercentage?: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  evaluatedAt!: Date;

  @Column({ type: 'text', nullable: true })
  whyWentCorrect?: string;

  @Column({ type: 'text', nullable: true })
  whyWentIncorrect?: string;

  @ManyToOne(() => ModelRuns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'model_run_id' })
  modelRun!: ModelRuns;

  @Column({ type: 'int' })
  @Index('idx_predictions_evaluation_model_run_id')
  modelRunId!: number;
}