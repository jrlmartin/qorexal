# Complete API Endpoint List with URLs, Parameters, and Return Object Schemas

## TRADIER API Endpoints

1. **Pre-market Price & Volume**
   - URL: `https://api.tradier.com/v1/markets/timesales`
   - Parameters: 
     - `symbol` (ticker)
     - `interval` (time interval)
     - `start` (start datetime)
     - `end` (end datetime)
     - `session_filter=all` (to include pre-market data)
   - Return Payload:
     ```json
     {
       "series": {
         "data": [
           {
             "time": "2023-01-19T09:30:00",
             "timestamp": 1674134400,
             "price": 135.27,
             "volume": 5821
           },
           // Additional data points...
         ]
       }
     }
     ```

2. **Historical Data for Gap Calculation**
   - URL: `https://api.tradier.com/v1/markets/history`
   - Parameters:
     - `symbol` (ticker)
     - `interval` (daily, weekly, monthly)
     - `start` (start date)
     - `end` (end date)
   - Return Payload:
     ```json
     {
       "history": {
         "day": [
           {
             "date": "2023-01-25",
             "open": 141.32,
             "high": 142.43,
             "low": 138.81,
             "close": 141.86,
             "volume": 67516936
           },
           // Additional days...
         ]
       }
     }
     ```

3. **Real-time Market Quotes**
   - URL: `https://api.tradier.com/v1/markets/quotes`
   - Parameters:
     - `symbols` (comma-separated list of tickers, e.g., `SPY,QQQ,IWM`)
   - Return Payload:
     ```json
     {
       "quotes": {
         "quote": [
           {
             "symbol": "AAPL",
             "description": "APPLE INC",
             "exch": "Q",
             "type": "stock",
             "last": 161.25,
             "change": 1.32,
             "volume": 3428592,
             "open": 160.11,
             "high": 161.63,
             "low": 159.75,
             "close": null,
             "bid": 161.24,
             "ask": 161.25,
             "change_percentage": 0.83,
             "average_volume": 56292441,
             "last_volume": 100,
             "trade_date": 1674239271364,
             "prevclose": 159.93
           },
           // Additional quotes...
         ]
       }
     }
     ```

4. **Options Chains Data**
   - URL: `https://api.tradier.com/v1/markets/options/chains`
   - Parameters:
     - `symbol` (ticker)
     - `expiration` (expiration date)
     - `greeks` (boolean for including greeks calculations)
   - Return Payload:
     ```json
     {
       "options": {
         "option": [
           {
             "symbol": "AAPL230127C00160000",
             "description": "AAPL Jan 27 2023 $160.00 Call",
             "exch": "Z",
             "type": "option",
             "last": 2.15,
             "change": 0.39,
             "volume": 6221,
             "open": 1.75,
             "high": 2.19,
             "low": 1.75,
             "close": null,
             "bid": 2.14,
             "ask": 2.17,
             "underlying": "AAPL",
             "strike": 160.0,
             "greeks": {
               "delta": 0.5842,
               "gamma": 0.1185,
               "theta": -0.1336,
               "vega": 0.1569,
               "rho": 0.0297,
               "phi": -0.0343,
               "bid_iv": 0.312,
               "mid_iv": 0.3165,
               "ask_iv": 0.321
             },
             "expiration_date": "2023-01-27",
             "expiration_type": "standard",
             "option_type": "call",
             "root_symbol": "AAPL"
           },
           // Additional options...
         ]
       }
     }
     ```

## EODHD (EOD Historical Data) API Endpoints

1. **Historical EOD Data**
   - URL: `https://eodhistoricaldata.com/api/eod/{ticker}`
   - Parameters:
     - `api_token` (your API key)
     - `from` (start date)
     - `to` (end date)
     - `period` (d for daily, w for weekly, m for monthly)
   - Return Payload:
     ```json
     [
       {
         "date": "2023-01-01",
         "open": 130.28,
         "high": 132.42,
         "low": 129.89,
         "close": 131.86,
         "adjusted_close": 131.86,
         "volume": 70649332
       },
       // Additional days...
     ]
     ```

2. **Technical Indicators - Pattern Recognition**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=pattern_recognition`
     - `api_token` (your API key)
     - `order` (asc/desc)
     - `period` (lookback period)
   - Return Payload:
     ```json
     {
       "code": "AAPL.US",
       "function": "pattern_recognition",
       "name": "APPLE INC",
       "exchange": "US",
       "data": [
         {
           "date": "2023-01-25",
           "pattern": "bullish_engulfing",
           "strength": 8
         },
         // Additional patterns...
       ]
     }
     ```

3. **Technical Indicators - RSI**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=rsi`
     - `api_token` (your API key)
     - `period` (typically 14)
   - Return Payload:
     ```json
     {
       "code": "AAPL.US",
       "function": "rsi",
       "name": "APPLE INC",
       "exchange": "US",
       "data": [
         {
           "date": "2023-01-25",
           "rsi": 62.48
         },
         // Additional data points...
       ]
     }
     ```

4. **Technical Indicators - MACD**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=macd`
     - `api_token` (your API key)
     - `fast_period` (typically 12)
     - `slow_period` (typically 26)
     - `signal_period` (typically 9)
   - Return Payload:
     ```json
     {
       "code": "AAPL.US",
       "function": "macd",
       "name": "APPLE INC",
       "exchange": "US",
       "data": [
         {
           "date": "2023-01-25",
           "macd": 2.86,
           "signal": 2.32,
           "histogram": 0.54
         },
         // Additional data points...
       ]
     }
     ```

5. **Technical Indicators - Moving Averages**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=sma` or `function=ema`
     - `api_token` (your API key)
     - `period` (number of periods)
   - Return Payload:
     ```json
     {
       "code": "AAPL.US",
       "function": "sma",
       "name": "APPLE INC",
       "exchange": "US",
       "data": [
         {
           "date": "2023-01-25",
           "sma": 145.37
         },
         // Additional data points...
       ]
     }
     ```

6. **Technical Indicators - ATR**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=atr`
     - `api_token` (your API key)
     - `period` (typically 14)
   - Return Payload:
     ```json
     {
       "code": "AAPL.US",
       "function": "atr",
       "name": "APPLE INC",
       "exchange": "US",
       "data": [
         {
           "date": "2023-01-25",
           "atr": 3.67
         },
         // Additional data points...
       ]
     }
     ```

7. **Technical Indicators - Bollinger Bands**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=bbands`
     - `api_token` (your API key)
     - `period` (typically 20)
     - `stddev` (typically 2)
   - Return Payload:
     ```json
     {
       "code": "AAPL.US",
       "function": "bbands",
       "name": "APPLE INC",
       "exchange": "US",
       "data": [
         {
           "date": "2023-01-25",
           "upper_band": 156.42,
           "middle_band": 145.37,
           "lower_band": 134.32
         },
         // Additional data points...
       ]
     }
     ```

8. **Technical Indicators - ADX**
   - URL: `https://eodhistoricaldata.com/api/technical/{ticker}`
   - Parameters:
     - `function=adx`
     - `api_token` (your API key)
     - `period` (typically 14)
   - Return Payload:
     ```json
     {
       "code": "AAPL.US",
       "function": "adx",
       "name": "APPLE INC",
       "exchange": "US",
       "data": [
         {
           "date": "2023-01-25",
           "adx": 24.86,
           "pdi": 28.74,
           "mdi": 18.32
         },
         // Additional data points...
       ]
     }
     ```

9. **Fundamentals Data**
   - URL: `https://eodhistoricaldata.com/api/fundamentals/{ticker}`
   - Parameters:
     - `api_token` (your API key)
   - Return Payload:
     ```json
     {
       "General": {
         "Code": "AAPL.US",
         "Type": "Common Stock",
         "Name": "APPLE INC",
         "Exchange": "NASDAQ",
         "CurrencyCode": "USD",
         "CurrencyName": "US Dollar",
         "CurrencySymbol": "$",
         "CountryName": "USA",
         "CountryISO": "US",
         "Description": "Apple Inc. designs, manufactures, and markets smartphones...",
         "Industry": "Consumer Electronics",
         "Sector": "Technology",
         "GicSector": "Information Technology",
         "GicGroup": "Technology Hardware & Equipment",
         "Employees": 164000,
         "WebURL": "https://www.apple.com"
       },
       "Highlights": {
         "MarketCapitalization": 2458343256000,
         "EBITDA": 130541996000,
         "PERatio": 26.42,
         "PEGRatio": 2.21,
         "DividendYield": 0.0058
       },
       "Financials": {
         "Balance_Sheet": { /* Balance sheet data */ },
         "Income_Statement": { /* Income statement data */ },
         "Cash_Flow": { /* Cash flow data */ }
       },
       // Additional fundamentals data...
     }
     ```

10. **Insider Transactions**
    - URL: `https://eodhistoricaldata.com/api/insider-transactions`
    - Parameters:
      - `ticker={ticker}`
      - `api_token` (your API key)
      - `limit` (number of results)
    - Return Payload:
      ```json
      [
        {
          "code": "AAPL.US",
          "date": "2023-01-20",
          "date_reported": "2023-01-22",
          "filing_date": "2023-01-22",
          "ticker": "AAPL",
          "company_name": "APPLE INC",
          "insider_name": "JOHN DOE",
          "position": "Officer",
          "transaction_type": "Sale",
          "transaction_date": "2023-01-20",
          "transaction_price": 145.38,
          "transaction_volume": 10000,
          "transaction_value": 1453800
        },
        // Additional transactions...
      ]
      ```

11. **Options Data**
    - URL: `https://eodhistoricaldata.com/api/options/{ticker}`
    - Parameters:
      - `api_token` (your API key)
      - `from` (start date)
      - `to` (end date)
    - Return Payload:
      ```json
      {
        "code": "AAPL.US",
        "exchange": "NASDAQ",
        "lastTradeDate": "2023-01-25",
        "lastVolume": 65890321,
        "lastPrice": 161.86,
        "expirations": ["2023-02-03", "2023-02-10", "2023-02-17"],
        "options": {
          "2023-02-03": {
            "calls": [
              {
                "contractName": "AAPL230203C00160000",
                "strike": 160.0,
                "lastPrice": 2.86,
                "bid": 2.84,
                "ask": 2.88,
                "change": 0.38,
                "volume": 4562,
                "openInterest": 8902,
                "impliedVolatility": 0.291
              },
              // Additional calls...
            ],
            "puts": [
              {
                "contractName": "AAPL230203P00160000",
                "strike": 160.0,
                "lastPrice": 1.24,
                "bid": 1.22,
                "ask": 1.27,
                "change": -0.15,
                "volume": 3845,
                "openInterest": 7236,
                "impliedVolatility": 0.284
              },
              // Additional puts...
            ]
          },
          // Additional expiration dates...
        }
      }
      ```

12. **News Articles**
    - URL: `https://eodhistoricaldata.com/api/news`
    - Parameters:
      - `tickers={ticker}`
      - `api_token` (your API key)
      - `limit` (number of articles)
      - `sentiment=1` (include sentiment analysis)
    - Return Payload:
      ```json
      [
        {
          "title": "Apple Reports Record Quarterly Earnings",
          "content": "Apple Inc. reported record quarterly earnings exceeding analyst expectations...",
          "link": "https://example.com/news/apple-reports-earnings",
          "symbols": ["AAPL.US"],
          "published": "2023-01-25T16:30:00Z",
          "source": "Financial News Daily",
          "source_url": "https://example.com",
          "tags": ["Earnings", "Technology", "Stocks"],
          "sentiment": {
            "score": 0.78,
            "label": "positive"
          }
        },
        // Additional news articles...
      ]
      ```

13. **Analyst Ratings**
    - URL: `https://eodhistoricaldata.com/api/calendar/ratings`
    - Parameters:
      - `symbols={ticker}`
      - `api_token` (your API key)
      - `from` (start date)
      - `to` (end date)
    - Return Payload:
      ```json
      [
        {
          "code": "AAPL.US",
          "exchange": "US",
          "date": "2023-01-25",
          "analyst": "Morgan Stanley",
          "rating": "Overweight",
          "rating_prev": "Overweight",
          "target_price": 175.0,
          "target_price_prev": 168.0
        },
        // Additional ratings...
      ]
      ```

14. **Earnings Calendar**
    - URL: `https://eodhistoricaldata.com/api/calendar/earnings`
    - Parameters:
      - `symbols={ticker}`
      - `api_token` (your API key)
      - `from` (start date)
      - `to` (end date)
    - Return Payload:
      ```json
      [
        {
          "code": "AAPL.US",
          "exchange": "US",
          "report_date": "2023-01-25",
          "before_after_market": "After",
          "expected_eps": 1.94,
          "reported_eps": 2.10,
          "surprise_pct": 8.25,
          "fiscal_quarter": "Q1 2023",
          "fiscal_year_end": "2023-09-30"
        },
        // Additional earnings reports...
      ]
      ```

15. **Economic Calendar**
    - URL: `https://eodhistoricaldata.com/api/calendar/economic`
    - Parameters:
      - `api_token` (your API key)
      - `from` (start date)
      - `to` (end date)
      - `country` (optional country filter)
    - Return Payload:
      ```json
      [
        {
          "date": "2023-01-25T13:30:00Z",
          "country": "US",
          "indicator": "GDP Growth Rate QoQ Adv",
          "period": "Q4 2022",
          "actual": 2.9,
          "previous": 3.2,
          "forecast": 2.6,
          "importance": "high"
        },
        // Additional economic events...
      ]
      ```