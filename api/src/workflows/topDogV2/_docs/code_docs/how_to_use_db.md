Below is an updated **Daily Workflow** reflecting the new schema and a **How-To Guide** for using it effectively. The schema has been refined with additional columns, confidence intervals for predictions, and new fields in each table.

---

# Daily Workflow

Below is a sample end-to-end daily workflow scenario. You might adapt it to your organization’s schedule or data pipeline.

1. **Stock Master Updates**

   * **Goal**: Keep the `stock` table up to date (e.g., if market cap changes significantly or new tickers get added).
   * **Action**:

     * If you have a daily feed of stock metadata (market cap, sector, etc.), either **insert** new rows for stocks you haven't seen before or **update** existing rows (e.g., changing `marketCapUsd`, `capTier`, etc.).

2. **Intraday Data Collection**

   * **Goal**: Gather 30-minute price intervals and store in `intraday_prices`.
   * **Action**:

     * Throughout the trading day, collect data at 30-minute intervals (from your data provider).
     * **Insert** rows into `intraday_prices` with `interval_start`, `interval_end`, and the OHLCV data (`openPrice`, `highPrice`, `lowPrice`, `closePrice`, `volume`).

3. **Daily Aggregation into `stock_prices`**

   * **Goal**: At the end of the trading day (or start of next day), aggregate intraday data to get a daily snapshot (e.g., actual high, open, close, volume).
   * **Action**:

     * Compute the day’s `actualHigh` = `MAX(highPrice)` from `intraday_prices` for each stock.
     * `openPrice` = `openPrice` from the first interval, `closePrice` = last interval, etc.
     * Insert or update a row in `stock_prices` with the aggregated daily data (use `date`, `actualHigh`, etc.).

4. **Generate Model Predictions**

   * **Goal**: Run your predictive model (e.g., LLM or any algorithm) for each stock you care about.
   * **Action**:

     * For each stock (ID in `stock.id`), generate daily high predictions at different confidence levels (`confidence100High`, `confidence90High`, etc.).
     * **Insert** a new row in `model_runs`, including:

       * `stockId`
       * `asOfDateTime` (the timestamp of the prediction run)
       * `confidence100High`, `confidence90High`, etc.
       * `modelName` (e.g., “GPT-4” or “CustomTransformer”)
       * `ghIdentifier` (any unique ID or reference to your model code or commit SHA)
     * This step is typically done **after market close** (for next day’s predictions) or **before market open** (for the same day’s predictions).

5. **Evaluate Predictions**

   * **Goal**: Once you know the **actual** high from `stock_prices` and have the predicted high(s) from `model_runs`, compute error metrics.
   * **Action**:

     * Query the row from `model_runs` for a given `stockId` and date/time range.
     * Compare your model’s predicted high (likely `confidence100High`) to `stock_prices.actualHigh`.
     * Calculate:

       * `errorValue = actualHigh - predictedHigh`
       * `errorPercentage = ((actualHigh - predictedHigh) / actualHigh) * 100`
     * **Insert** these metrics (and optional “whyWentCorrect” / “whyWentIncorrect” notes) in `predictions_evaluation`:

       * `actualHigh`
       * `errorValue`
       * `errorPercentage`
       * `modelRunId` (the row ID from `model_runs`)

6. **Reporting & Analytics**

   * **Goal**: Make your data accessible for dashboards, alerts, or further analysis.
   * **Action**:

     * Create queries or views to measure how the model performed over time (e.g., average error per sector, error distribution by confidence level, etc.).
     * Summaries could group by date, `capTier`, or `modelName`.

---

# How-To Guide for Effective Usage

Below are detailed tips and best practices to ensure you get the most out of this schema.

---

### 1. Handling Stock Metadata Updates

* **Inserting new stocks**:

  ```sql
  INSERT INTO public.stock (
    ticker, companyName, exchange, sector, industry, country,
    marketCapUsd, capTier
  ) 
  VALUES (
    'AAPL', 'Apple Inc.', 'NASDAQ', 'Technology', 'Consumer Electronics', 'USA',
    2000000000000.00, 'LARGE'
  );
  ```

* **Updating existing stocks**:

  ```sql
  UPDATE public.stock
     SET marketCapUsd = 2200000000000.00,
         updatedTs = NOW()
   WHERE ticker = 'AAPL';
  ```

* Keep `capTier` consistent by your own rules (e.g., `SMALL` < 2B, `MID` < 10B, `LARGE` >= 10B, etc.).

---

### 2. Inserting Intraday Prices

* **Every 30 minutes** during trading hours, gather OHLC data from your provider. Insert as below:

  ```sql
  INSERT INTO public.intraday_prices (
    stockId, interval_start, interval_end,
    openPrice, highPrice, lowPrice, closePrice, volume
  ) 
  VALUES (
    1,                    -- Apple’s stockId
    '2025-05-10 09:30:00',
    '2025-05-10 10:00:00',
    176.00,
    177.50,
    175.50,
    177.10,
    20000000
  );
  ```

* Use an index on `(stockId, interval_start)` for efficient intraday queries.

* (Optional) If storing extended hours data, ensure your logic excludes or flags pre/post-market intervals accordingly.

---

### 3. Aggregating Intraday to Daily (`stock_prices`)

* **At day’s end** (or early next morning), aggregate from `intraday_prices`:

  ```sql
  -- Example in PostgreSQL
  WITH daily_agg AS (
    SELECT
      ip.stockId,
      DATE(ip.interval_start) AS trading_day,
      MIN(ip.openPrice)  AS day_open,
      MAX(ip.highPrice)  AS day_high,
      MIN(ip.lowPrice)   AS day_low,
      (ARRAY_AGG(ip.closePrice ORDER BY ip.interval_end DESC))[1] AS day_close,
      SUM(ip.volume)     AS total_volume
    FROM public.intraday_prices ip
    WHERE DATE(ip.interval_start) = CURRENT_DATE - 1  -- or the date you need
    GROUP BY ip.stockId
  )
  INSERT INTO public.stock_prices (
    stockId, date, actualHigh, openPrice, closePrice, volume
  )
  SELECT
    daily_agg.stockId,
    daily_agg.trading_day,
    daily_agg.day_high,     -- actualHigh
    daily_agg.day_open,     -- openPrice
    daily_agg.day_close,    -- closePrice
    daily_agg.total_volume
  FROM daily_agg
  ON CONFLICT (stockId, date) DO UPDATE
     SET actualHigh = EXCLUDED.actualHigh,
         openPrice  = EXCLUDED.openPrice,
         closePrice = EXCLUDED.closePrice,
         volume     = EXCLUDED.volume,
         updatedTs  = NOW();
  ```

* This populates `stock_prices` for each trading day.

* Use `ON CONFLICT` to **upsert** so you can rerun if data arrives late or gets revised.

---

### 4. Recording Model Predictions (`model_runs`)

* You have columns for **4 different confidence levels**: `confidence100High`, `confidence90High`, `confidence80High`, and `confidence70High`. Decide how your model populates these:

  * For instance, `confidence100High` = “best guess of the day’s high,” `confidence90High` = “a lower high at 90% confidence,” etc.

* **Insert** a new row for each run:

  ```sql
  INSERT INTO public.model_runs (
    stockId, asOfDateTime,
    confidence100High, confidence90High, confidence80High, confidence70High,
    modelName, ghIdentifier
  )
  VALUES (
    1,  -- Apple's stockId
    '2025-05-11 08:00:00',  -- e.g., pre-market
    178.50,  177.00, 175.00, 172.00,  -- hypothetical predictions
    'GPT-4', 'commit-abc123'
  );
  ```

* **Tips**:

  * `ghIdentifier` might map to a GitHub commit or CI/CD pipeline version.
  * `modelName` can differentiate different versions of your LLM or other predictive models.
  * You can insert multiple stocks in the same run, or treat each stock separately.

---

### 5. Evaluating Predictions (`predictions_evaluation`)

* After the market closes (or next morning), you know the day’s `actualHigh` from `stock_prices`. Compare it with one or more confidence-level predictions from `model_runs`.

* **Compute error metrics**. For example, if you choose `confidence100High` as your “official” predicted high:

  ```sql
  WITH model AS (
    SELECT mr.id AS modelRunId,
           mr.confidence100High,
           sp.actualHigh
      FROM public.model_runs mr
      JOIN public.stock_prices sp
        ON mr.stockId = sp.stockId
     WHERE mr.stockId = 1                -- Apple
       AND DATE(mr.asOfDateTime) = '2025-05-11'
       AND sp.date = '2025-05-11'
  )
  INSERT INTO public.predictions_evaluation (
    modelRunId, actualHigh, errorValue, errorPercentage
  )
  SELECT
    m.modelRunId,
    m.actualHigh,
    (m.actualHigh - m.confidence100High) AS errorValue,
    CASE WHEN m.actualHigh <> 0 
         THEN ((m.actualHigh - m.confidence100High)/m.actualHigh)*100
         ELSE NULL
    END
  FROM model m;
  ```

* Optionally fill in `whyWentCorrect` or `whyWentIncorrect` if you perform a post-mortem analysis.

---

### 6. Best Practices & Advanced Tips

1. **Timestamps vs. Dates**

   * Notice that `model_runs` uses `TIMESTAMPTZ` (`asOfDateTime`) while `stock_prices` uses a `DATE` type. You’ll likely join on `(stockId)` plus a date match (e.g., `DATE(mr.asOfDateTime) = sp.date`).

2. **Data Partitioning**

   * If your intraday data grows very large, consider **table partitioning** by month or year. This improves query performance and maintenance.

3. **Deleted Records**

   * Each table has a `deletedTs` column for soft deletes. Instead of physically removing data, set `deletedTs = NOW()` to hide or archive rows in application-level queries.

4. **Multiple Confidence Predictions**

   * If you use all four confidence columns (`confidence100High`, `confidence90High`, etc.), plan an evaluation logic that picks which confidence level you want to track in `predictions_evaluation`. Alternatively, you can insert multiple rows in `predictions_evaluation` referencing the same `modelRunId` but with different predicted vs. actual comparisons.

5. **Historical Backtesting**

   * Store your old intraday data, daily prices, and predictions in these tables to do post-hoc backtesting.
   * Your `deletedTs` can help you maintain an immutable log rather than overwriting data.

6. **Indexes & Performance**

   * You already have indexes on the relevant columns (e.g., `stockId`, `date`, `interval_start`).
   * For queries that filter by `date` or `(stockId, date)`, those indexes will be crucial.

7. **Model-Versioning**

   * `ghIdentifier` can store references to your model version (e.g., commit SHA). This is extremely helpful for auditing and reproducibility.

8. **Views & Reports**

   * Create database **views** that join `model_runs` with `predictions_evaluation` and `stock_prices` for quick analytics. For example, a view might show “model name, date, predicted high, actual high, errorValue, errorPercentage.”

---

# Example Queries

Below are some handy SQL queries.

1. **Check Yesterday’s Error for All Predictions**

   ```sql
   SELECT 
     s.ticker,
     mr.modelName,
     mr.asOfDateTime,
     pe.actualHigh,
     (pe.actualHigh - mr.confidence100High) AS errorValue,
     pe.errorPercentage
   FROM public.model_runs mr
     JOIN public.predictions_evaluation pe ON mr.id = pe.modelRunId
     JOIN public.stock s ON mr.stockId = s.id
   WHERE DATE(mr.asOfDateTime) = CURRENT_DATE - 1;
   ```

2. **Average Error by Model Over Last 30 Days**

   ```sql
   SELECT
     mr.modelName,
     AVG(pe.errorValue) AS avgErrorValue,
     AVG(pe.errorPercentage) AS avgErrorPercentage
   FROM public.model_runs mr
     JOIN public.predictions_evaluation pe ON mr.id = pe.modelRunId
   WHERE mr.asOfDateTime >= CURRENT_DATE - 30
     AND mr.deletedTs IS NULL
     AND pe.deletedTs IS NULL
   GROUP BY mr.modelName;
   ```

3. **Get Intraday Price Movements for a Specific Stock & Date**

   ```sql
   SELECT
     ip.interval_start,
     ip.interval_end,
     ip.openPrice,
     ip.highPrice,
     ip.lowPrice,
     ip.closePrice,
     ip.volume
   FROM public.intraday_prices ip
   JOIN public.stock s ON ip.stockId = s.id
   WHERE s.ticker = 'AAPL'
     AND DATE(ip.interval_start) = '2025-05-10'
     AND ip.deletedTs IS NULL
   ORDER BY ip.interval_start;
   ```

---

## Final Thoughts

By following this workflow and best practices:

1. You keep a **clean separation** between **metadata** (`stock`), **daily** (`stock_prices`), **intraday** (`intraday_prices`), **predictions** (`model_runs`), and **evaluation** (`predictions_evaluation`).
2. You can **easily scale** up your data volume and complexity.
3. You have a **clear process** to load data, run models, and evaluate performance.
4. You can **trace** model versions and investigate why a prediction was off.

This design gives you a flexible yet robust foundation for daily (and intraday) stock price prediction and analytics.
