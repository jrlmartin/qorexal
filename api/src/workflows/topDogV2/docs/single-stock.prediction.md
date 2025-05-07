# Additional Data for End-of-Day Price Prediction

For end-of-day price prediction on a single stock, you'll need different data than for day trading multiple stocks. Here's what I recommend adding beyond the basic data we've already discussed:

## High-Priority Intraday Data

1. **Intraday Price Candles**
   - 1-minute and 5-minute candlestick data
   - Alpha Vantage provides this via their `TIME_SERIES_INTRADAY` endpoint with intervals down to 1 minute
   - Focus on patterns forming in the last 60-90 minutes of trading

2. **Volume Profile**
   - Volume by price levels (VBVP)
   - Volume patterns in final trading hour
   - Volume-weighted average price (VWAP) distance

3. **Market Breadth Data**
   - Advance/decline ratio for stock's sector
   - Up/down volume ratio
   - Tradier can provide this through market statistics endpoints

4. **Order Flow Imbalance**
   - Buying vs. selling pressure
   - Large block trades
   - Available through specialized order flow data providers like Bookmap or Quantitative Brokers

## Technical Indicators Specific to EOD Prediction

1. **Auction Indicators**
   - MOC (Market On Close) order imbalances
   - NYSE & NASDAQ publish these ~3:50 PM ET
   - Strong predictors of closing price direction

2. **Mean Reversion Metrics**
   - Distance from daily VWAP
   - Bollinger Band closing tendencies
   - Daily pivot point relationships

3. **Late-Day Momentum Signals**
   - Rate of change (ROC) in final trading hour
   - 15-minute RSI trends
   - Final hour volume vs. average final hour volume

## Market Context Data

1. **Index Futures Momentum**
   - S&P 500 and Nasdaq futures direction in final hour
   - Sector ETF movement correlation
   - FMP provides real-time ETF data

2. **VIX Movement**
   - Intraday volatility index changes
   - Put/call ratio shifts throughout day
   - Alpha Vantage can track this with their intraday endpoints

3. **Interest Rate Movements**
   - Treasury yield changes (especially for rate-sensitive stocks)
   - Fed funds futures movement

## Additional Data Sources

1. **For Order Imbalance Data**:
   - IEX Cloud provides closing auction imbalance data
   - Bloomberg Terminal (expensive but comprehensive)

2. **For High-Resolution Intraday Data**:
   - Polygon.io offers tick-by-tick historical data
   - Alpha Vantage Premium for minute-level data

3. **For Market Microstructure Data**:
   - Limit order book data from exchange direct feeds (expensive)
   - Simplified order flow from retail brokers' APIs

## Implementation Approach

For EOD price prediction, your script would need to:

1. Collect data throughout the trading day
2. Run more frequent analysis in the final 60-90 minutes 
3. Weight recent data more heavily than morning data
4. Apply different models based on market regime (trending vs. range-bound)

This approach would be more focused on directional prediction rather than identifying stocks with movement potential, making it a different application than our original day trading scanner.