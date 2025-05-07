```json
[
{
  "date": "2025-05-07",
  "time": "09:30:00",
  "market_data": {
    "indices": {
      "SPY": {"price": 535.67, "change_percent": 0.6},
      "QQQ": {"price": 470.18, "change_percent": 0.4},
      "IWM": {"price": 237.12, "change_percent": 0.6}
    },
    "sector_performance": {
      "XLK": 0.8,
      "XLY": 0.5,
      "XLF": 0.6,
      "XLV": -0.1,
      "XLE": -0.3
    },
    "market_breadth": {
      "advance_decline_ratio": "N/A",
      "up_volume_percent": "N/A",
      "stocks_above_vwap_percent": "N/A"
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
          "twitter_sentiment": "N/A",
          "mention_velocity": {
            "24h_change_percent": "N/A"
          }
        },
        "news_data": {
          "recent_articles": [
            {
              "timestamp": "2025-05-07T08:15:00",
              "source": "Benzinga",
              "headline": "Morgan Stanley upgrades Duolingo to Overweight, sets $520 price target",
              "summary": "Analyst cites accelerating user growth and monetization improvements",
              "sentiment_score": 0.88,
              "categories": ["analyst", "upgrade", "price target"]
            }
          ],
          "news_impact_score": "N/A",
          "material_news_classification": "positive_catalyst"
        },
        "day_trading_metrics": {
          "liquidity_score": "N/A",
          "volatility_score": "N/A",
          "news_catalyst_score": "N/A",
          "technical_setup_score": "N/A",
          "overall_bullish_rating": "N/A"
        }
      }
  ],
  "market_conditions": {
    "vix": 18.5,
    "put_call_ratio": 0.82,
    "market_regime": "N/A",
    "sector_rotation": {
      "inflow_sectors": ["Technology", "Consumer Discretionary"],
      "outflow_sectors": ["Energy", "Utilities"]
    },
    "macro_events": [
      {"time": "10:00", "event": "Consumer Confidence", "impact": "N/A", "market_reaction": "N/A"}
    ]
  }
}
]
```

**Data Source Notes:**

1. **Market Data**
   - Indices data: TRADIER `/markets/quotes?symbols=SPY,QQQ,IWM`
   - Sector performance: EODHD `/eod/XLK,XLY,XLF,XLV,XLE`
   - Market breadth metrics: Marked as "N/A" as they're not directly available from the listed APIs

2. **Stock Universe**
   - Company fundamentals: EODHD `/fundamentals/{ticker}`
   - Float data: EODHD `/fundamentals/{ticker}`
   - Pre-market data: TRADIER `/markets/timesales` with session_filter=all
   - Moving averages: EODHD `/technical/{ticker}?function=sma` or `/technical/{ticker}?function=ema`
   - Intraday VWAP: Calculated from TRADIER `/markets/timesales` data
   - Volume data: TRADIER `/markets/timesales` for current, EODHD for historical averages
   - Technical indicators: EODHD `/technical/{ticker}?function=rsi` and `/technical/{ticker}?function=macd`
   - Options data: EODHD `/options/{ticker}` and calculations from this data
   - Earnings data: EODHD `/calendar/earnings?symbols={ticker}`
   - Social sentiment: Not available from listed APIs, marked as "N/A"
   - News data: Benzinga Full Newsfeed
   - Day trading metrics: Custom calculations required based on available data

3. **Market Conditions**
   - VIX: TRADIER `/markets/quotes?symbols=VIX` for real-time data
   - Put/call ratio: Calculated from EODHD `/options/index` data
   - Sector rotation: From Benzinga Movers
   - Macro events: EODHD `/economic-events`

4. **Custom Calculations Required**
   - Overall bullish ratings and scores
   - Liquidity and volatility metrics 
   - News impact assessment
   - Market regime classification
   - Impact and market reaction assessments