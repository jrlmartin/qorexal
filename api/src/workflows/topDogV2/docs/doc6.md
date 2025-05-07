# Updated API Endpoints for Mid Cap Stock Day Trading Analytics

I'll update all tables and the JSON by removing items that are marked as "N/A" or not available through the current endpoints:

## 1. Pre-market Activity

| Data Point | API | Endpoint | Data Returned |
|------------|-----|----------|--------------|
| Pre-market price movement | TRADIER | `/markets/timesales` with `session_filter=all` | Pre-market price, price changes, percentage movement |
| Pre-market volume | TRADIER | `/markets/timesales` with `session_filter=all` | Volume traded before market open |
| Gap information | TRADIER | Calculate from `/markets/history` | Previous close vs. pre-market price, gap percentage |
| Opening range | TRADIER | `/markets/timesales` with time filters | High/low prices during market open |
| VWAP calculation | TRADIER | `/markets/timesales` | Data for volume-weighted average price calculations |

## 2. Technical Indicators

| Data Point | API | Endpoint | Data Returned |
|------------|-----|----------|--------------|
| Trading volume (current) | TRADIER | `/markets/timesales` | Real-time intraday volume with timestamps |
| Trading volume (historical) | EODHD | `/eod/{ticker}` | Historical volume patterns for comparison |
| Relative volume | EODHD | `/eod/{ticker}` | Data to calculate current volume vs. average |
| Price action patterns | EODHD | `/technical/{ticker}?function=pattern_recognition` | Identified chart patterns (breakouts, cup & handle, etc.) |
| RSI | EODHD | `/technical/{ticker}?function=rsi` | Relative Strength Index values with periods |
| MACD | EODHD | `/technical/{ticker}?function=macd` | MACD line, signal line, and histogram values |
| Moving averages | EODHD | `/technical/{ticker}?function=sma` or `?function=ema` | Simple/exponential moving averages for multiple timeframes |
| Volatility (ATR) | EODHD | `/technical/{ticker}?function=atr` | Average True Range for volatility measurement |
| Volatility (Bollinger) | EODHD | `/technical/{ticker}?function=bbands` | Upper/middle/lower bands and bandwidth |
| Trend strength (ADX) | EODHD | `/technical/{ticker}?function=adx` | Average Directional Index for trend strength |
| Support/resistance levels | EODHD | Calculated from `/eod/{ticker}` | Key price levels for trading decisions |

## 3. Market Structure Data

| Data Point | API | Endpoint | Data Returned |
|------------|-----|----------|--------------|
| Float size | EODHD | `/fundamentals/{ticker}` | Total floating shares available |
| Market capitalization | EODHD | `/fundamentals/{ticker}` | Current market cap valuation |
| Short interest percentage | FMP | `/stock/short-interest/{ticker}` | Percentage of float sold short |
| Shares short | FMP | `/stock/short-interest/{ticker}` | Absolute number of shares short |
| Days to cover | FMP | `/stock/short-interest/{ticker}` | Ratio of shares short to avg daily volume |
| Borrow fee | FMP | `/stock/short-interest/{ticker}` | Cost to borrow shares for shorting |
| Short interest changes | FMP | `/stock/short-interest/{ticker}` | Historical data for 2-week and 1-month changes |
| Threshold list status | FMP | `/stock/threshold-securities` | Whether stock appears on threshold securities list |
| Institutional ownership | EODHD | `/insider-transactions/?ticker={ticker}` | Recent institutional buying/selling activity |

## 4. Options Flow

| Data Point | API | Endpoint | Data Returned |
|------------|-----|----------|--------------|
| Options chain data | EODHD | `/options/{ticker}` | Full options chain with strikes, expiries, premiums |
| Open interest | EODHD | `/options/{ticker}` | Number of outstanding contracts per strike |
| Call/put ratios | EODHD | `/options/{ticker}` | Data to calculate ratio (bullish/bearish sentiment) |
| Implied volatility | EODHD | `/options/{ticker}` | Expected volatility derived from options pricing |
| Unusual options activity | TRADIER | `/markets/options/chains` | Volume spikes, large trades, unusual strike interest |
| Options flow direction | TRADIER | `/markets/options/chains` | Data to determine bullish/bearish flow percentage |
| Strike concentration | EODHD | `/options/{ticker}` | Concentration of activity at specific strikes |

## 5. Sentiment Data

| Data Point | API | Endpoint | Data Returned |
|------------|-----|----------|--------------|
| News articles | EODHD | `/news?tickers={ticker}` | Recent news headlines and articles |
| News sentiment | EODHD | `/news?tickers={ticker}&sentiment=1` | Sentiment scores for news articles |
| Material news classification | EODHD | `/news?tickers={ticker}&sentiment=1` | Categorization of news impact |
| Analyst ratings | EODHD | `/calendar/ratings?symbols={ticker}` | Buy/sell/hold ratings and price targets |
| Rating changes | EODHD | `/calendar/ratings?symbols={ticker}` | Recent upgrades/downgrades |

## 6. Earnings Data

| Data Point | API | Endpoint | Data Returned |
|------------|-----|----------|--------------|
| Recent earnings date | EODHD | `/calendar/earnings?symbols={ticker}` | Date of most recent earnings report |
| EPS actual | EODHD | `/calendar/earnings?symbols={ticker}` | Actual earnings per share |
| EPS estimate | EODHD | `/calendar/earnings?symbols={ticker}` | Analyst consensus estimate |
| Surprise percentage | EODHD | `/calendar/earnings?symbols={ticker}` | Percent difference between actual and estimate |
| Revenue actual | EODHD | `/calendar/earnings?symbols={ticker}` | Actual revenue reported |
| Revenue estimate | EODHD | `/calendar/earnings?symbols={ticker}` | Analyst revenue projections |
| Next earnings date | EODHD | `/calendar/earnings?symbols={ticker}` | Upcoming earnings announcement date |

## 7. Market Conditions

| Data Point | API | Endpoint | Data Returned |
|------------|-----|----------|--------------|
| Index performance | TRADIER | `/markets/quotes?symbols=SPY,QQQ,IWM` | Current prices and percentage changes |
| Sector performance | TRADIER | `/markets/quotes?symbols=XLK,XLY,XLF,XLV,XLE` | Performance of sector ETFs |
| VIX | TRADIER | `/markets/quotes?symbols=VIX` | Current volatility index value |
| Put/call ratio | EODHD | Calculated from `/options/SPY` | Market-wide sentiment indicator |
| Sector rotation | TRADIER | `/markets/quotes` with sector ETFs | Identify inflow/outflow sectors |
| Macro events | EODHD | `/calendar/economic` | Scheduled economic announcements |

## 8. Day Trading Metrics

| Data Point | API | Endpoint | Data Returned |
|------------|-----|----------|--------------|
| Volatility score | Custom calculation | `/technical/{ticker}?function=atr` and `/technical/{ticker}?function=bbands` | Score based on ATR and Bollinger Band width |
| Technical setup score | Custom calculation | Multiple technical endpoints | Score based on pattern recognition and indicator alignment |
| Relative strength | Custom calculation | Multiple index comparison | Stock performance vs. broader market/sector |

# Updated JSON with Removed N/A Items

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
          "macd": {"line": 15.2, "signal": 10.8, "histogram": 4.4},
          "atr_14": 12.45,
          "bollinger_bands": {
            "upper": 482.36,
            "middle": 380.25,
            "lower": 278.14,
            "width": 0.54
          },
          "adx": 38.6,
          "pattern_recognition": {
            "bullish_patterns": ["breakout", "cup_and_handle"],
            "bearish_patterns": [],
            "consolidation_patterns": []
          }
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
          "material_news_classification": "positive_catalyst"
        },
        "day_trading_metrics": {
          "volatility_score": 0.85,
          "technical_setup_score": 0.92
        }
      }
  ],
  "market_conditions": {
    "vix": 18.5,
    "put_call_ratio": 0.82,
    "sector_rotation": {
      "inflow_sectors": ["Technology", "Consumer Discretionary"],
      "outflow_sectors": ["Energy", "Utilities"]
    },
    "macro_events": [
      {"time": "10:00", "event": "Consumer Confidence"}
    ]
  }
}
]
```

Changes made:
1. Removed "social_sentiment" section from JSON as it contained only "N/A" values
2. Removed "liquidity_score" from day_trading_metrics as it was marked "N/A"
3. Removed "Social media mentions" and "Mention velocity" from the Sentiment Data table
4. Removed "liquidity_score" from the Day Trading Metrics table