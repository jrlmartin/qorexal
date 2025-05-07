# Complete API Endpoint List with URLs and Parameters

## TRADIER API Endpoints

1. **Pre-market Price & Volume**
   - URL: `https://api.tradier.com/v1/markets/timesales`
   - Parameters: 
     - `symbol` (ticker)
     - `interval` (time interval)
     - `start` (start datetime)
     - `end` (end datetime)
     - `session_filter=all` (to include pre-market data)

2. **Historical Data for Gap Calculation**
   - URL: `https://api.tradier.com/v1/markets/history`
   - Parameters:
     - `symbol` (ticker)
     - `interval` (daily, weekly, monthly)
     - `start` (start date)
     - `end` (end date)

3. **Real-time Market Quotes**
   - URL: `https://api.tradier.com/v1/markets/quotes`
   - Parameters:
     - `symbols` (comma-separated list of tickers, e.g., `SPY,QQQ,IWM`)

4. **Options Chains Data**
   - URL: `https://api.tradier.com/v1/markets/options/chains`
   - Parameters:
     - `symbol` (ticker)
     - `expiration` (expiration date)
     - `greeks` (boolean for including greeks calculations)

## EODHD (EOD Historical Data) API Endpoints

1. **Historical EOD Data**
   - URL: `https://eodhistoricaldata.com/api/eod/{ticker}`
   - Parameters:
     - `api_token` (your API key)
     - `from` (start date)
     - `to` (end date)
     - `period` (d for daily, w for weekly, m for monthly)

2. **Technical Indicators - Pattern Recognition**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=pattern_recognition`
     - `api_token` (your API key)
     - `order` (asc/desc)
     - `period` (lookback period)

3. **Technical Indicators - RSI**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=rsi`
     - `api_token` (your API key)
     - `period` (typically 14)

4. **Technical Indicators - MACD**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=macd`
     - `api_token` (your API key)
     - `fast_period` (typically 12)
     - `slow_period` (typically 26)
     - `signal_period` (typically 9)

5. **Technical Indicators - Moving Averages**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=sma` or `function=ema`
     - `api_token` (your API key)
     - `period` (number of periods)

6. **Technical Indicators - ATR**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=atr`
     - `api_token` (your API key)
     - `period` (typically 14)

7. **Technical Indicators - Bollinger Bands**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=bbands`
     - `api_token` (your API key)
     - `period` (typically 20)
     - `stddev` (typically 2)

8. **Technical Indicators - ADX**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=adx`
     - `api_token` (your API key)
     - `period` (typically 14)

9. **Fundamentals Data**
   - URL: `https://eodhistoricaldata.com/api/fundamentals/{ticker}`
   - Parameters:
     - `api_token` (your API key)

10. **Insider Transactions**
    - URL: `https://eodhistoricaldata.com/api/insider-transactions`
    - Parameters:
      - `ticker={ticker}`
      - `api_token` (your API key)
      - `limit` (number of results)

11. **Options Data**
    - URL: `https://eodhistoricaldata.com/api/options/{ticker}`
    - Parameters:
      - `api_token` (your API key)
      - `from` (start date)
      - `to` (end date)

12. **News Articles**
    - URL: `https://eodhistoricaldata.com/api/news`
    - Parameters:
      - `tickers={ticker}`
      - `api_token` (your API key)
      - `limit` (number of articles)
      - `sentiment=1` (include sentiment analysis)

13. **Analyst Ratings**
    - URL: `https://eodhistoricaldata.com/api/calendar/ratings`
    - Parameters:
      - `symbols={ticker}`
      - `api_token` (your API key)
      - `from` (start date)
      - `to` (end date)

14. **Earnings Calendar**
    - URL: `https://eodhistoricaldata.com/api/calendar/earnings`
    - Parameters:
      - `symbols={ticker}`
      - `api_token` (your API key)
      - `from` (start date)
      - `to` (end date)

15. **Economic Calendar**
    - URL: `https://eodhistoricaldata.com/api/calendar/economic`
    - Parameters:
      - `api_token` (your API key)
      - `from` (start date)
      - `to` (end date)
      - `country` (optional country filter)

## BENZINGA API Endpoints

1. **Get News**
   - URL: `https://api.benzinga.com/api/v2/news`
   - Parameters:
     - `token` (your API key)
     - `displayOutput` (set to "full" for longform news content)
     - `pageSize` (number of results returned)
     - `page` (page offset, limited to 0-100000)
     - `date` (specific date to query, shorthand for date_from and date_to)
     - `dateFrom` (date to query from, sorted by published date)
     - `dateTo` (date to query to, sorted by published date)
     - `sortBy` (control results sorting, default is "created,DESC")
     - `isin` (one or more ISINs separated by comma, max 50)
     - `cusip` (one or more CUSIPs separated by comma, max 50)
     - `tickers` (one or more ticker symbols separated by comma, max 50)
     - `channels` (filter by specific news channels, including "WIIM" for Why is it Moving data)
     - `updatedSince` (timestamp to get only content updated since that time)
     - `searchText` (one or more words/phrases separated by comma; searches Title, Tags, and Body)
     - `id` (the unique identifier of a specific article)
   - Return Payload:
     ```json
     [
       {
         "id": 37100544,
         "author": "John Doe",
         "created": "Tue, 07 May 2025 13:25:36 -0400",
         "updated": "Tue, 07 May 2025 13:25:37 -0400",
         "title": "Major Company Reports Earnings",
         "teaser": "First sentence of the article up to 256 characters...",
         "body": "Full text of the news article...",
         "url": "https://www.benzinga.com/news/25/05/article-path",
         "image": "https://www.benzinga.com/images/story/2025/image-name.jpg",
         "channels": [
           "Earnings",
           "News",
           "Tech"
         ],
         "stocks": [
           {
             "name": "Sample Company Inc",
             "symbol": "SMPL"
           }
         ],
         "tags": [
           "Quarterly Results",
           "Revenue Growth"
         ]
       },
       // Additional news items...
     ]
     ```
 