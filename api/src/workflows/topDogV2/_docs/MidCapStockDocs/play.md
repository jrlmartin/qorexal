 The goal is for `o1 pro` to anlayze a dataset to find the mid cap stocks that could be most bullish for day trading based on news articles and additional analytics.

## Details

1. **Pre-market Activity**
   - Pre-market price movement and volume
   - Gap information and percentage change

2. **Technical Indicators**
   - Trading volume (current, historical averages, unusual spikes)
   - Price action patterns (breakouts, support/resistance)
   - Momentum indicators (RSI, MACD)
   - Moving averages (50-day, 200-day crossovers)

3. **Market Structure Data**
   - Float size (smaller floats tend to move more dramatically)
   - Short interest percentage (potential for short squeezes)
   - Recent institutional ownership changes

4. **Options Flow**
   - Unusual options activity
   - Changes in open interest
   - Call/put ratios and sweeps

5. **Sentiment Data**
   - Social media mentions and sentiment analysis
   - Analyst rating changes and price target revisions
   - Trading forum discussion volume

6. **Market Context**
   - Sector performance
   - Overall market direction
   - Economic calendar events

7. **Historical Pattern Analysis**
   - How the stock has previously reacted to similar news
   - Success rate of similar technical setups

 

## Sample Input Data Format

```json
[
{
  "date": "2025-05-06",
  "time": "16:00:00",
  "market_data": {
    "indices": {
      "SPY": {"price": 532.47, "change_percent": 0.8},
      "QQQ": {"price": 468.23, "change_percent": 1.2},
      "IWM": {"price": 235.68, "change_percent": 0.5}
    },
    "sector_performance": {
      "XLK": 1.3,
      "XLY": 1.1,
      "XLF": 0.3,
      "XLV": -0.2,
      "XLE": -0.5
    },
    "market_breadth": {
      "advance_decline_ratio": 1.8,
      "up_volume_percent": 65,
      "stocks_above_vwap_percent": 58
    }
  },
  "stock_universe": [
      {
        "ticker": "DUOL",
        "company_name": "Duolingo Inc",
        "sector": "Technology",
        "industry": "Education & Training Services",
        "market_cap": 8500000000,
        "float": 28500000,
        "avg_daily_volume": 1200000,
        "price_data": {
          "previous_close": 400.11,
          "pre_market": 474.13,
          "current": 474.13,
          "day_range": {"low": 470.25, "high": 475.80},
          "moving_averages": {
            "ma_20": 380.25,
            "ma_50": 352.14
          },
          "intraday": {
            "opening_range": {"high": 475.80, "low": 472.15, "breakout": true},
            "vwap": 473.85
          }
        },
        "volume_data": {
          "pre_market": 1800000,
          "current": 3840000,
          "avg_10d": 1100000,
          "relative_volume": 3.2,
          "volume_distribution": {
            "first_hour_percent": 42
          }
        },
        "technical_indicators": {
          "rsi_14": 72,
          "macd": {"line": 15.2, "signal": 10.8, "histogram": 4.4}
        },
        "options_data": {
          "call_put_ratio": 3.8,
          "unusual_activity": true,
          "options_flow": {
            "bullish_flow_percent": 78
          }
        },
        "earnings_data": {
          "recent_report": {
            "date": "2025-05-01",
            "eps": {
              "actual": 0.72,
              "estimate": 0.51,
              "surprise_percent": 41.2
            }
          }
        },
        "social_sentiment": {
          "twitter_sentiment": 0.78,
          "mention_velocity": {
            "24h_change_percent": 215
          }
        },
        "news_data": {
          "recent_articles": [
            {
              "timestamp": "2025-05-06T08:15:00",
              "source": "CNBC",
              "headline": "Morgan Stanley upgrades Duolingo to Overweight, sets $520 price target",
              "summary": "Analyst cites accelerating user growth and monetization improvements",
              "sentiment_score": 0.88,
              "categories": ["analyst", "upgrade", "price target"]
            }
          ],
          "news_impact_score": 0.91,
          "material_news_classification": "positive_catalyst"
        },
        "day_trading_metrics": {
          "liquidity_score": 0.92,
          "volatility_score": 0.85,
          "news_catalyst_score": 0.95,
          "technical_setup_score": 0.88,
          "overall_bullish_rating": 0.91
        }
      },
     
  ],
  "market_conditions": {
    "vix": 18.5,
    "put_call_ratio": 0.82,
    "market_regime": "bullish",
    "sector_rotation": {
      "inflow_sectors": ["Technology", "Consumer Discretionary"],
      "outflow_sectors": ["Energy", "Utilities"]
    },
    "macro_events": [
      {"time": "10:00", "event": "Consumer Confidence", "impact": "positive", "market_reaction": "rally"}
    ]
  }
}
]
```


## Instructions

1. Help me identify the endpoints that could be used to build the json
   - Available APIs we can use are EODHD, TRADIER, and FMP, Benzinga  
   - For Benzinga, i only have Nasdaq Basic, Full Newsfeed, and Movers
   - if there is data that can't be used by one of these apis, then DON'T GUESS, say N/A
   - priority: if there is same data from multiple services, then EODHD => TRADIER => EODHD
2. Don't write any code, just find the api endpoints that can give the data

## How the APIs can be used

### 1. Pre-market Activity
-  TRADIER provides historical end-of-day (EOD) data but does not appear to specifically offer pre-market data in their standard packages
```ts
 // 2. For specific pre-market data, you could use time and sales with session filter
    const preMarketData = await axios.get(`${TRADIER_BASE_URL}/markets/timesales`, {
      params: { 
        symbol: ticker,
        interval: '1min',
        start: getTodayPreMarketStart(), // Helper function to get today's pre-market time window
        end: getTodayMarketOpen(),       // Helper function to get today's market open time
        session_filter: 'all'            // Important: Include all sessions
      },
      headers: TRADIER_HEADERS
    });
```

### 2. Technical Indicators
- EODHD offers over 100 technical indicators through their Technical Analysis Indicators API
- They provide average volume data for 14, 50, and 200 days
- Technical indicators include MACD, Stochastic Oscillator, Linear Regression Slope, RSI, SMA, EMA, and WMA
- They also offer Bollinger Bands which provide price and volatility data

### 3. Market Structure Data
- EODHD covers fundamental data for stocks, equities, ETFs, mutual funds, and indices across 70+ exchanges worldwide
- Their historical market cap data is available through specific API endpoints
- The service includes insider transactions data covering all US companies filing Form 4 with the SEC

### 4. Options Flow
- EODHD offers a US Stock Options Data API with daily updated options data for 6,000 top-traded US stocks
- The options data includes bid/ask prices, Greeks (Delta, Gamma, Theta, Vega), implied volatility, trading metrics, open interest, volume, and contract details
- Historical options data is available for the past year

### 5. Sentiment Data
- EODHD provides a Financial News API with news aggregation and in-house sentiment analysis
- The system generates daily sentiment scores for stocks, ETFs, Forex, and Cryptocurrencies based on positive and negative mentions

### 6. Market Context
- EODHD offers financial data for global markets across 70+ exchanges
- Their Screener API allows filtering tickers by various parameters including market capitalization, earnings per share, dividend yield, and industry

### 7. Historical Pattern Analysis
- EODHD provides historical EOD data, intraday data, and real-time prices with both free and advanced plans
- Their Screener API can identify patterns like stocks hitting new 50/200 day highs or lows


### 8. Short interest percentage data availability is unclear
```ts
    // 5. Get short interest - Short interest is typically reported bi-monthly by exchanges, so an 8-hour delay doesn't significantly impact accuracy.
    const shortInterestResponse = await axios.get(`${FMP_BASE_URL}/stock/short-interest/${ticker}?apikey=${FMP_API_KEY}`);
```

 