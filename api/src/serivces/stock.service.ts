import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual, Between, Raw } from 'typeorm';
import {
  Stock,
  ModelRuns,
  StockPrice,
  IntradayPrice,
  PredictionsEvaluation,
  MarketCapTierEnum,
  ModelNameEnum
} from '../entities/Stock.entity';

/**
 * StockService
 * -----------
 * Provides methods to handle all major scenarios from how_to_use_db.md:
 *   1. Upserting Stock metadata
 *   2. Inserting intraday prices
 *   3. Aggregating intraday to daily
 *   4. Creating model runs (predictions)
 *   5. Evaluating predictions
 *   6. Retrieving intraday data, errors, etc.
 */
@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,

    @InjectRepository(ModelRuns)
    private readonly modelRunsRepo: Repository<ModelRuns>,

    @InjectRepository(StockPrice)
    private readonly stockPriceRepo: Repository<StockPrice>,

    @InjectRepository(IntradayPrice)
    private readonly intradayPriceRepo: Repository<IntradayPrice>,

    @InjectRepository(PredictionsEvaluation)
    private readonly predictionsEvalRepo: Repository<PredictionsEvaluation>,
  ) {}

  /**
   * 1. Upsert Stock Metadata
   * 
   * Creates a new stock row if it doesn't exist, or updates existing metadata (like marketCapUsd, sector, etc.).
   * The 'capTier' is set automatically in Stock entity's lifecycle hooks (beforeInsert/ beforeUpdate).
   * 
   * @param ticker 
   * @param companyName 
   * @param exchange 
   * @param sector 
   * @param industry 
   * @param country 
   * @param marketCapUsd 
   */
  async upsertStock(
    ticker: string,
    companyName: string,
    exchange?: string,
    sector?: string,
    industry?: string,
    country?: string,
    marketCapUsd?: number,
  ): Promise<Stock> {
    // check if stock exists
    let stock = await this.stockRepo.findOne({
      where: { ticker: ticker.toUpperCase() },
    });

    if (!stock) {
      stock = this.stockRepo.create({
        ticker: ticker.toUpperCase(),
        companyName,
        exchange,
        sector,
        industry,
        country,
        marketCapUsd: marketCapUsd ?? 0,
      });
    } else {
      // Update fields
      if (companyName) stock.companyName = companyName;
      if (exchange) stock.exchange = exchange;
      if (sector) stock.sector = sector;
      if (industry) stock.industry = industry;
      if (country) stock.country = country;
      if (marketCapUsd !== undefined) {
        stock.marketCapUsd = marketCapUsd;
      }
    }
    return this.stockRepo.save(stock);
  }

  /**
   * 2. Insert Intraday Prices
   * 
   * @param stockId 
   * @param intervalStart 
   * @param intervalEnd 
   * @param openPrice 
   * @param highPrice 
   * @param lowPrice 
   * @param closePrice 
   * @param volume 
   */
  async insertIntradayPrice(
    stockId: number,
    intervalStart: Date,
    intervalEnd: Date,
    openPrice: number,
    highPrice: number,
    lowPrice: number,
    closePrice: number,
    volume: number,
  ): Promise<IntradayPrice> {
    const intradayPrice = this.intradayPriceRepo.create({
      stockId,
      intervalStart,
      intervalEnd,
      openPrice,
      highPrice,
      lowPrice,
      closePrice,
      volume,
    });
    return this.intradayPriceRepo.save(intradayPrice);
  }

  /**
   * 2.1 Optional: Batch Insert Intraday Prices
   * 
   * @param intradayData an array of partial IntradayPrice objects
   */
  async bulkInsertIntradayPrices(intradayData: Partial<IntradayPrice>[]): Promise<IntradayPrice[]> {
    const newRecords = this.intradayPriceRepo.create(intradayData);
    return this.intradayPriceRepo.save(newRecords);
  }

  /**
   * 3. Aggregate Intraday Data into Daily StockPrices
   * 
   * Aggregates the previous day's (or specified date's) intraday data to produce daily open/close/high/volume.
   * - By default, aggregates data for 'targetDate' (e.g. CURRENT_DATE - 1)
   * - Uses an upsert approach (ON CONFLICT-like in TypeORM) to insert or update the daily row in stock_prices.
   * 
   * @param targetDate Typically the prior trading day (YYYY-MM-DD)
   */
  async aggregateDailyData(targetDate: Date): Promise<void> {
    // We can do a raw SQL approach or do it in TypeORM. 
    // Here is a minimal raw query approach (PostgreSQL-style).
    const dateStr = targetDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    await this.stockPriceRepo.query(
      `
      WITH daily_agg AS (
        SELECT
          ip.stock_id AS stockId,
          DATE(ip.interval_start) AS trading_day,
          MIN(ip.open_price)  AS day_open,
          MAX(ip.high_price)  AS day_high,
          MIN(ip.low_price)   AS day_low,
          -- Get the LAST closePrice by ordering descending by interval_end
          (ARRAY_AGG(ip.close_price ORDER BY ip.interval_end DESC))[1] AS day_close,
          SUM(ip.volume)      AS total_volume
        FROM public.intraday_prices ip
        WHERE DATE(ip.interval_start) = $1
          AND ip.deleted_ts IS NULL
        GROUP BY ip.stock_id
      )
      INSERT INTO public.stock_prices (
        stock_id, date, actual_high, open_price, close_price, volume
      )
      SELECT
        daily_agg.stockId,
        daily_agg.trading_day,
        daily_agg.day_high,     -- actualHigh
        daily_agg.day_open,     -- openPrice
        daily_agg.day_close,    -- closePrice
        daily_agg.total_volume
      FROM daily_agg
      ON CONFLICT (stock_id, date) DO UPDATE
          SET actual_high = EXCLUDED.actual_high,
              open_price  = EXCLUDED.open_price,
              close_price = EXCLUDED.close_price,
              volume      = EXCLUDED.volume,
              updated_ts  = NOW()
      `,
      [dateStr],
    );
  }

  /**
   * 4. Create a Model Run (Predictions)
   * 
   * Inserts a row in 'model_runs' with up to 4 confidence-level predictions.
   * 
   * @param stockId 
   * @param asOfDateTime 
   * @param confidence100High 
   * @param confidence90High 
   * @param confidence80High 
   * @param confidence70High 
   * @param modelName 
   * @param ghIdentifier 
   */
  async createModelRun(
    stockId: number,
    asOfDateTime: Date,
    confidence100High: number,
    confidence90High: number,
    confidence80High: number,
    confidence70High: number,
    modelName: ModelNameEnum,
    ghIdentifier: string,
  ): Promise<ModelRuns> {
    const newRun = this.modelRunsRepo.create({
      stockId,
      asOfDateTime,
      confidence100High,
      confidence90High,
      confidence80High,
      confidence70High,
      modelName,
      ghIdentifier,
    });
    return this.modelRunsRepo.save(newRun);
  }

  /**
   * 5. Evaluate Predictions
   * 
   * Compares the daily actualHigh from stock_prices to model_runs.confidence100High (or other confidence).
   * Then inserts a new row in 'predictions_evaluation'.
   * 
   * @param modelRunId 
   * @param actualHigh 
   * @param confidenceLevel which confidence to compare ('confidence100High', 'confidence90High', etc.)
   * @param whyCorrect 
   * @param whyIncorrect 
   */
  async evaluatePrediction(
    modelRunName: ModelNameEnum,  // model_runs primary key (uuid)
    actualHigh: number,
    confidenceLevel: keyof ModelRuns = 'confidence100High', 
    whyCorrect?: string,
    whyIncorrect?: string,
  ): Promise<PredictionsEvaluation> {
    const modelRun = await this.modelRunsRepo.findOne({
      where: { modelName: modelRunName },
    });
    if (!modelRun) {
      throw new Error(`ModelRun not found for id: ${modelRunName}`);
    }

    const predictedHigh = modelRun[confidenceLevel] ?? null;
    if (predictedHigh === null) {
      throw new Error(`No prediction found for confidence level ${confidenceLevel}`);
    }

    const errorValue = actualHigh - Number(predictedHigh);
    const errorPercentage = actualHigh !== 0
      ? (errorValue / actualHigh) * 100
      : null;

    const evalRow = this.predictionsEvalRepo.create({
      modelRunId: modelRun.id,
      actualHigh,
      errorValue,
      errorPercentage: errorPercentage !== null ? Number(errorPercentage.toFixed(2)) : null,
      whyWentCorrect: whyCorrect,
      whyWentIncorrect: whyIncorrect,
    });

    return this.predictionsEvalRepo.save(evalRow);
  }

  /**
   * 6. Retrieve Intraday Prices for a Ticker & Date
   * 
   * Example for how to get intraday data for a specific date (YYYY-MM-DD).
   * 
   * @param ticker 
   * @param date 
   */
  async getIntradayPricesForDate(
    ticker: string,
    date: Date,
  ): Promise<IntradayPrice[]> {
    // find the stock first
    const stock = await this.stockRepo.findOne({
      where: { ticker: ticker.toUpperCase() },
    });
    if (!stock) {
      return [];
    }
    const dateStr = date.toISOString().split('T')[0];
    return this.intradayPriceRepo.find({
      where: {
        stockId: stock.id,
        intervalStart: Raw(alias => `DATE(${alias}) = :dt`, { dt: dateStr }),
      },
      order: { intervalStart: 'ASC' },
    });
  }

  /**
   * 6.1 Retrieve Yesterday's Prediction Errors (Example)
   * 
   * @param date 
   */
  async getYesterdayErrors(date: Date): Promise<any[]> {
    const dateStr = date.toISOString().split('T')[0];
    // Example: fetch modelName, asOfDateTime, actualHigh, errorValue, errorPercentage
    return this.modelRunsRepo.query(
      `
      SELECT s.ticker,
             mr.model_name AS "modelName",
             mr.as_of_date_time AS "asOfDateTime",
             pe.actual_high AS "actualHigh",
             (pe.actual_high - mr.confidence100_high) AS "errorValue",
             pe.error_percentage AS "errorPercentage"
        FROM public.model_runs mr
        JOIN public.predictions_evaluation pe
          ON mr.id = pe.model_run_id
        JOIN public.stock s
          ON mr.stock_id = s.id
       WHERE DATE(mr.as_of_date_time) = $1
         AND mr.deleted_ts IS NULL
         AND pe.deleted_ts IS NULL
      `,
      [dateStr],
    );
  }
}