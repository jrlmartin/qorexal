The goal is for `o1 pro` to anlayze a dataset to find the mid cap stocks that could be most bullish for day trading based on news articles with additional analytics.  The goal is to find the top 1 ~ 3 stocks that could be most bullish for day trading.

 Based on the data set, what are the key items that we need to analyze to make the best prediction?
 Are there any items that we can remove to make the analysis more efficient?
 

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
        "52w_range": {"low": 245.12, "high": 475.80},
        "moving_averages": {
          "ma_20": 380.25,
          "ma_50": 352.14
        },
        "intraday": {
          "opening_range": {"high": 475.80, "low": 472.15, "breakout": true},
          "vwap": 473.85,
          "key_levels": {
            "support": [470.00, 465.50],
            "resistance": [475.80, 480.00]
          }
        }
      },
      "volume_data": {
        "pre_market": 1800000,
        "current": 3840000,
        "avg_10d": 1100000,
        "relative_volume": 3.2,
        "volume_distribution": {
          "first_hour_percent": 42
        },
        "volume_spikes": [
          {"time": "09:45", "volume": 120000, "price_change": 0.8},
          {"time": "11:15", "volume": 85000, "price_change": 0.3}
        ]
      },
      "technical_indicators": {
        "rsi_14": 72,
        "macd": {"line": 15.2, "signal": 10.8, "histogram": 4.4},
        "additional_indicators": {
          "money_flow_index": 76,
          "on_balance_volume": 8750000
        }
      },
      "options_data": {
        "call_put_ratio": 3.8,
        "unusual_activity": true,
        "notable_strikes": [
          {"strike": 480, "type": "call", "volume": 2850, "open_interest": 1200},
          {"strike": 500, "type": "call", "volume": 3200, "open_interest": 950}
        ],
        "options_flow": {
          "total_premium": 3850000,
          "bullish_flow_percent": 78,
          "large_orders": [
            {"time": "09:50", "strike": 480, "type": "call", "size": 450, "premium": 675000}
          ]
        }
      },
      "short_interest": {
        "percent_of_float": 0.042,
        "days_to_cover": 1.8
      },
      "earnings_data": {
        "recent_report": {
          "date": "2025-05-01",
          "eps": {
            "actual": 0.72,
            "estimate": 0.51,
            "surprise_percent": 41.2
          },
          "revenue": {
            "actual": 230740000,
            "estimate": 222980000,
            "surprise_percent": 3.5
          }
        }
      },
      "social_sentiment": {
        "twitter_mentions_24h": 5200,
        "twitter_sentiment": 0.78,
        "reddit_mentions_24h": 820,
        "reddit_sentiment": 0.82,
        "mention_velocity": {
          "24h_change_percent": 215,
          "peak_time": "09:15"
        }
      },
      "news_data": {
        "recent_articles": [
          {
            "timestamp": "2025-05-05T16:30:00",
            "source": "MarketWatch",
            "headline": "Duolingo smashes earnings estimates, raises full-year outlook",
            "summary": "Language learning platform reports 41% EPS beat and raises guidance",
            "sentiment_score": 0.92,
            "relevance_score": 0.98,
            "categories": ["earnings", "guidance", "growth"]
          },
          {
            "timestamp": "2025-05-06T08:15:00",
            "source": "CNBC",
            "headline": "Morgan Stanley upgrades Duolingo to Overweight, sets $520 price target",
            "summary": "Analyst cites accelerating user growth and monetization improvements",
            "sentiment_score": 0.88,
            "relevance_score": 0.95,
            "categories": ["analyst", "upgrade", "price target"]
          },
          {
            "timestamp": "2025-05-06T09:25:00",
            "source": "Bloomberg",
            "headline": "Duolingo announces expansion into professional skills training market",
            "summary": "New product line targets corporate training with AI-powered approach",
            "sentiment_score": 0.85,
            "relevance_score": 0.90,
            "categories": ["product", "expansion", "corporate"]
          }
        ],
        "news_impact_score": 0.91,
        "news_volume_vs_avg": 3.2,
        "material_news_classification": "positive_catalyst"
      },
      "historical_patterns": {
        "post_earnings_reactions": [
          {"date": "2025-02-04", "next_day_change": 0.094},
          {"date": "2024-11-06", "next_day_change": 0.078}
        ],
        "news_reaction_patterns": {
          "analyst_upgrades": {"avg_move": 0.058, "success_rate": 0.82},
          "product_announcements": {"avg_move": 0.043, "success_rate": 0.75}
        }
      },
      "day_trading_metrics": {
        "liquidity_score": 0.92,
        "volatility_score": 0.85,
        "news_catalyst_score": 0.95,
        "technical_setup_score": 0.88,
        "overall_bullish_rating": 0.91,
        "optimal_entry_zones": [
          {"price_range": [472.00, 473.50], "strength": "moderate"},
          {"price_range": [470.00, 471.00], "strength": "strong"}
        ],
        "profit_targets": [478.00, 482.50],
        "stop_loss_levels": [468.50],
        "risk_reward_ratio": 3.2
      }
    },
    {
      "ticker": "RIVN",
      "company_name": "Rivian Automotive Inc",
      "sector": "Consumer Discretionary",
      "industry": "Auto Manufacturers",
      "market_cap": 7200000000,
      "float": 412000000,
      "avg_daily_volume": 8500000,
      "price_data": {
        "previous_close": 10.85,
        "pre_market": 13.42,
        "current": 13.68,
        "day_range": {"low": 13.25, "high": 13.95},
        "52w_range": {"low": 8.26, "high": 24.95},
        "moving_averages": {
          "ma_20": 11.20,
          "ma_50": 10.75
        },
        "intraday": {
          "opening_range": {"high": 13.85, "low": 13.32, "breakout": true},
          "vwap": 13.58,
          "key_levels": {
            "support": [13.00, 12.50],
            "resistance": [14.00, 14.50]
          }
        }
      },
      "volume_data": {
        "pre_market": 4200000,
        "current": 28900000,
        "avg_10d": 9200000,
        "relative_volume": 3.1,
        "volume_distribution": {
          "first_hour_percent": 45
        },
        "volume_spikes": [
          {"time": "09:35", "volume": 1850000, "price_change": 0.95},
          {"time": "10:05", "volume": 1200000, "price_change": 0.45}
        ]
      },
      "technical_indicators": {
        "rsi_14": 68,
        "macd": {"line": 0.85, "signal": 0.32, "histogram": 0.53},
        "additional_indicators": {
          "money_flow_index": 72,
          "on_balance_volume": 98500000
        }
      },
      "options_data": {
        "call_put_ratio": 4.2,
        "unusual_activity": true,
        "notable_strikes": [
          {"strike": 14, "type": "call", "volume": 21500, "open_interest": 8700},
          {"strike": 15, "type": "call", "volume": 18750, "open_interest": 6200}
        ],
        "options_flow": {
          "total_premium": 4250000,
          "bullish_flow_percent": 82,
          "large_orders": [
            {"time": "09:40", "strike": 14, "type": "call", "size": 2500, "premium": 875000}
          ]
        }
      },
      "short_interest": {
        "percent_of_float": 0.21,
        "days_to_cover": 3.2
      },
      "earnings_data": {
        "recent_report": {
          "date": "2025-05-05",
          "eps": {
            "actual": -0.12,
            "estimate": -0.35,
            "surprise_percent": 65.7
          },
          "revenue": {
            "actual": 1250000000,
            "estimate": 1150000000,
            "surprise_percent": 8.7
          }
        }
      },
      "social_sentiment": {
        "twitter_mentions_24h": 12500,
        "twitter_sentiment": 0.81,
        "reddit_mentions_24h": 1850,
        "reddit_sentiment": 0.79,
        "mention_velocity": {
          "24h_change_percent": 320,
          "peak_time": "09:05"
        }
      },
      "news_data": {
        "recent_articles": [
          {
            "timestamp": "2025-05-05T17:15:00",
            "source": "Reuters",
            "headline": "Rivian crushes Q1 delivery expectations, narrows loss significantly",
            "summary": "EV maker reports 65% smaller loss than expected with record deliveries",
            "sentiment_score": 0.90,
            "relevance_score": 0.95,
            "categories": ["earnings", "deliveries", "growth"]
          },
          {
            "timestamp": "2025-05-06T07:30:00",
            "source": "CNBC",
            "headline": "Goldman Sachs upgrades Rivian to Buy, cites inflection point in production",
            "summary": "Analyst highlights improving production efficiency and battery tech advantages",
            "sentiment_score": 0.88,
            "relevance_score": 0.92,
            "categories": ["analyst", "upgrade", "production"]
          },
          {
            "timestamp": "2025-05-06T09:15:00",
            "source": "Electrek",
            "headline": "Rivian announces new strategic partnership with major ride-sharing company",
            "summary": "10,000 vehicle order over next two years signals commercial market expansion",
            "sentiment_score": 0.92,
            "relevance_score": 0.93,
            "categories": ["partnership", "commercial", "expansion"]
          }
        ],
        "news_impact_score": 0.93,
        "news_volume_vs_avg": 4.5,
        "material_news_classification": "positive_catalyst"
      },
      "historical_patterns": {
        "post_earnings_reactions": [
          {"date": "2025-02-03", "next_day_change": 0.125},
          {"date": "2024-11-04", "next_day_change": 0.082}
        ],
        "news_reaction_patterns": {
          "analyst_upgrades": {"avg_move": 0.068, "success_rate": 0.79},
          "partnership_announcements": {"avg_move": 0.085, "success_rate": 0.82}
        }
      },
      "day_trading_metrics": {
        "liquidity_score": 0.95,
        "volatility_score": 0.88,
        "news_catalyst_score": 0.93,
        "technical_setup_score": 0.85,
        "overall_bullish_rating": 0.92,
        "optimal_entry_zones": [
          {"price_range": [13.20, 13.40], "strength": "moderate"},
          {"price_range": [12.90, 13.10], "strength": "strong"}
        ],
        "profit_targets": [14.25, 14.75],
        "stop_loss_levels": [12.75],
        "risk_reward_ratio": 3.4
      }
    },
    {
      "ticker": "ETSY",
      "company_name": "Etsy Inc",
      "sector": "Consumer Discretionary",
      "industry": "Internet Retail",
      "market_cap": 6800000000,
      "float": 125000000,
      "avg_daily_volume": 4500000,
      "price_data": {
        "previous_close": 53.25,
        "pre_market": 61.40,
        "current": 62.75,
        "day_range": {"low": 60.85, "high": 63.50},
        "52w_range": {"low": 48.75, "high": 92.45},
        "moving_averages": {
          "ma_20": 55.40,
          "ma_50": 52.85
        },
        "intraday": {
          "opening_range": {"high": 63.25, "low": 60.95, "breakout": true},
          "vwap": 62.30,
          "key_levels": {
            "support": [60.00, 58.50],
            "resistance": [64.00, 65.50]
          }
        }
      },
      "volume_data": {
        "pre_market": 1250000,
        "current": 11500000,
        "avg_10d": 3800000,
        "relative_volume": 3.0,
        "volume_distribution": {
          "first_hour_percent": 38
        },
        "volume_spikes": [
          {"time": "09:35", "volume": 750000, "price_change": 1.25},
          {"time": "10:15", "volume": 520000, "price_change": 0.75}
        ]
      },
      "technical_indicators": {
        "rsi_14": 70,
        "macd": {"line": 2.45, "signal": 1.20, "histogram": 1.25},
        "additional_indicators": {
          "money_flow_index": 74,
          "on_balance_volume": 32500000
        }
      },
      "options_data": {
        "call_put_ratio": 3.5,
        "unusual_activity": true,
        "notable_strikes": [
          {"strike": 65, "type": "call", "volume": 5200, "open_interest": 2100},
          {"strike": 70, "type": "call", "volume": 4800, "open_interest": 1750}
        ],
        "options_flow": {
          "total_premium": 2850000,
          "bullish_flow_percent": 76,
          "large_orders": [
            {"time": "09:45", "strike": 65, "type": "call", "size": 1200, "premium": 480000}
          ]
        }
      },
      "short_interest": {
        "percent_of_float": 0.12,
        "days_to_cover": 2.5
      },
      "earnings_data": {
        "recent_report": {
          "date": "2025-05-05",
          "eps": {
            "actual": 0.95,
            "estimate": 0.68,
            "surprise_percent": 39.7
          },
          "revenue": {
            "actual": 750250000,
            "estimate": 695000000,
            "surprise_percent": 7.9
          }
        }
      },
      "social_sentiment": {
        "twitter_mentions_24h": 3850,
        "twitter_sentiment": 0.76,
        "reddit_mentions_24h": 580,
        "reddit_sentiment": 0.80,
        "mention_velocity": {
          "24h_change_percent": 180,
          "peak_time": "09:20"
        }
      },
      "news_data": {
        "recent_articles": [
          {
            "timestamp": "2025-05-05T16:45:00",
            "source": "Bloomberg",
            "headline": "Etsy beats earnings expectations on strong marketplace growth",
            "summary": "E-commerce platform reports nearly 40% earnings surprise with improved margins",
            "sentiment_score": 0.89,
            "relevance_score": 0.96,
            "categories": ["earnings", "growth", "margins"]
          },
          {
            "timestamp": "2025-05-06T08:00:00",
            "source": "Barron's",
            "headline": "Three analysts upgrade Etsy following strong quarterly results",
            "summary": "Consensus emerges that turnaround strategy is gaining traction",
            "sentiment_score": 0.86,
            "relevance_score": 0.94,
            "categories": ["analyst", "upgrade", "turnaround"]
          },
          {
            "timestamp": "2025-05-06T09:30:00",
            "source": "CNBC",
            "headline": "Etsy announces new AI-powered search and recommendation engine",
            "summary": "Enhanced platform features expected to boost buyer conversion rates",
            "sentiment_score": 0.82,
            "relevance_score": 0.90,
            "categories": ["product", "AI", "technology"]
          }
        ],
        "news_impact_score": 0.87,
        "news_volume_vs_avg": 3.8,
        "material_news_classification": "positive_catalyst"
      },
      "historical_patterns": {
        "post_earnings_reactions": [
          {"date": "2025-02-05", "next_day_change": 0.082},
          {"date": "2024-11-07", "next_day_change": 0.065}
        ],
        "news_reaction_patterns": {
          "analyst_upgrades": {"avg_move": 0.052, "success_rate": 0.77},
          "product_announcements": {"avg_move": 0.048, "success_rate": 0.72}
        }
      },
      "day_trading_metrics": {
        "liquidity_score": 0.90,
        "volatility_score": 0.82,
        "news_catalyst_score": 0.89,
        "technical_setup_score": 0.84,
        "overall_bullish_rating": 0.88,
        "optimal_entry_zones": [
          {"price_range": [61.50, 62.25], "strength": "moderate"},
          {"price_range": [60.50, 61.25], "strength": "strong"}
        ],
        "profit_targets": [64.50, 66.00],
        "stop_loss_levels": [59.75],
        "risk_reward_ratio": 2.9
      }
    }
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
]
...
]
```