import { Injectable } from '@nestjs/common';
import { AppLogger } from 'src/core/logger';

import { MidCapScreenerService } from './MidCapStockAnalyzer/services/MidCapScreenerService';
import { getNow } from './MidCapStockAnalyzer/utils/dateUtils';

export interface LLMResponse {}

const logger = AppLogger.for('TopDogV1Workflow');


const prompt =  `
<context>
You are StockSage, an expert technical trading analyst with 15+ years of experience in market analysis and day trading. Your specialty is analyzing intraday data to identify high-probability trading opportunities. 
</context>

Please look though the json schema to better understand the data set:
<json-schema>
{
  type: JsonType.array,
  items: {
    anyOf: [
      {
        // ------------------------------
        // SHAPE #1: MARKET-LEVEL OBJECT
        // ------------------------------
        type: JsonType.object,
        properties: {
          date: {
            type: JsonType.string,
            description: "The current date for the data snapshot."
          },
          time: {
            type: JsonType.string,
            description: "The current time for the data snapshot."
          },
          market_data: {
            type: JsonType.object,
            description: "Contains index and sector performance data.",
            properties: {
              indices: {
                type: JsonType.object,
                description: "Index price info by symbol, e.g., SPY, QQQ.",
                additionalProperties: {
                  type: JsonType.object,
                  properties: {
                    price: {
                      type: JsonType.number,
                      description: "The index price."
                    },
                    change_percent: {
                      type: JsonType.number,
                      description: "Percent change from the previous close."
                    }
                  },
                  required: ["price", "change_percent"],
                  additionalProperties: false
                }
              },
              sector_performance: {
                type: JsonType.object,
                description: "Performance by sector ticker (e.g., XLK, XLY).",
                additionalProperties: {
                  type: JsonType.number,
                  description: "Percentage return for that sector."
                }
              }
            },
            required: ["indices","sector_performance"],
            additionalProperties: false
          },
          stock_universe: {
            type: JsonType.array,
            description: "List of individual stocks with detailed data.",
            items: {
              type: JsonType.object,
              properties: {
                ticker: {
                  type: JsonType.string,
                  description: "The stock symbol."
                },
                company_name: {
                  type: JsonType.string,
                  description: "Full company name."
                },
                sector: {
                  type: JsonType.string,
                  description: "Broad sector classification."
                },
                industry: {
                  type: JsonType.string,
                  description: "Industry classification."
                },
                market_cap: {
                  type: JsonType.number,
                  description: "Company's market capitalization in dollars."
                },
                float: {
                  type: JsonType.number,
                  description: "Number of publicly available shares."
                },
                avg_daily_volume: {
                  type: JsonType.number,
                  description: "Average daily volume."
                },
                price_data: {
                  type: JsonType.object,
                  description: "Pricing details: previous close, day range, intraday stats.",
                  properties: {
                    previous_close: {
                      type: JsonType.number,
                      description: "Previous close price."
                    },
                    pre_market: {
                      type: JsonType.number,
                      description: "Pre-market price."
                    },
                    current: {
                      type: JsonType.number,
                      description: "Current trading price."
                    },
                    day_range: {
                      type: JsonType.object,
                      properties: {
                        low: { type: JsonType.number },
                        high: { type: JsonType.number }
                      },
                      required: ["low","high"],
                      additionalProperties: false
                    },
                    moving_averages: {
                      type: JsonType.object,
                      description: "Typical moving averages (e.g. 20-day, 50-day).",
                      additionalProperties: {
                        type: JsonType.number
                      }
                    },
                    intraday: {
                      type: JsonType.object,
                      properties: {
                        opening_range: {
                          type: JsonType.object,
                          properties: {
                            high: { type: JsonType.number },
                            low: { type: JsonType.number },
                            breakout: { type: JsonType.boolean }
                          },
                          required: ["high","low","breakout"],
                          additionalProperties: false
                        },
                        vwap: {
                          type: JsonType.number,
                          description: "Volume-weighted average price."
                        }
                      },
                      required: ["opening_range","vwap"],
                      additionalProperties: false
                    }
                  },
                  required: ["previous_close","pre_market","current"],
                  additionalProperties: false
                },
                volume_data: {
                  type: JsonType.object,
                  description: "Trading volume statistics.",
                  properties: {
                    pre_market: {
                      type: JsonType.number,
                      description: "Pre-market volume."
                    },
                    current: {
                      type: JsonType.number,
                      description: "Latest intraday volume."
                    },
                    avg_10d: {
                      type: JsonType.number,
                      description: "10-day average volume."
                    },
                    relative_volume: {
                      type: JsonType.number,
                      description: "Ratio comparing current volume to avg."
                    },
                    volume_distribution: {
                      type: JsonType.object,
                      properties: {
                        first_hour_percent: {
                          type: JsonType.number,
                          description: "% of total volume in first hour."
                        }
                      },
                      additionalProperties: false
                    }
                  },
                  required: ["current"],
                  additionalProperties: false
                },
                technical_indicators: {
                  type: JsonType.object,
                  description: "Common technical signals/indicators.",
                  properties: {
                    rsi_14: {
                      type: JsonType.number,
                      description: "14-period RSI."
                    },
                    macd: {
                      type: JsonType.object,
                      properties: {
                        line: { type: JsonType.number },
                        signal: { type: JsonType.number }
                      },
                      required: ["line","signal"],
                      additionalProperties: false
                    },
                    atr_14: {
                      type: JsonType.number,
                      description: "14-day Average True Range."
                    },
                    bollinger_bands: {
                      type: JsonType.object,
                      properties: {
                        upper: { type: JsonType.number },
                        middle: { type: JsonType.number },
                        lower: { type: JsonType.number },
                        width: { type: JsonType.number }
                      },
                      required: ["upper","middle","lower"],
                      additionalProperties: false
                    },
                    adx: {
                      type: JsonType.number,
                      description: "Average Directional Index."
                    },
                    pattern_recognition: {
                      type: JsonType.object,
                      properties: {
                        bullish_patterns: {
                          type: JsonType.array,
                          items: { type: JsonType.string }
                        },
                        bearish_patterns: {
                          type: JsonType.array,
                          items: { type: JsonType.string }
                        },
                        consolidation_patterns: {
                          type: JsonType.array,
                          items: { type: JsonType.string }
                        }
                      },
                      additionalProperties: false
                    }
                  },
                  additionalProperties: false
                },
                options_data: {
                  type: JsonType.object,
                  description: "Options flow & metrics.",
                  properties: {
                    call_put_ratio: { type: JsonType.number },
                    unusual_activity: { type: JsonType.boolean },
                    options_flow: {
                      type: JsonType.object,
                      properties: {
                        bullish_flow_percent: {
                          type: JsonType.number,
                          description: "% of overall options flow that is bullish."
                        }
                      },
                      additionalProperties: false
                    }
                  },
                  required: ["call_put_ratio","unusual_activity"],
                  additionalProperties: false
                },
                earnings_data: {
                  type: JsonType.object,
                  description: "Recent earnings info.",
                  properties: {
                    recent_report: {
                      type: JsonType.object,
                      properties: {
                        date: { type: JsonType.string },
                        eps: {
                          type: JsonType.object,
                          properties: {
                            actual: { type: JsonType.number },
                            estimate: { type: JsonType.number },
                            surprise_percent: { type: JsonType.number }
                          },
                          required: ["actual","estimate"],
                          additionalProperties: false
                        }
                      },
                      required: ["date","eps"],
                      additionalProperties: false
                    }
                  },
                  additionalProperties: false
                },
                news_data: {
                  type: JsonType.object,
                  description: "Recent news articles relevant to the company.",
                  properties: {
                    recent_articles: {
                      type: JsonType.array,
                      items: {
                        type: JsonType.object,
                        properties: {
                          date: { type: JsonType.string },
                          title: { type: JsonType.string },
                          teaser: { type: JsonType.string },
                          content: { type: JsonType.string },
                          link: { type: JsonType.string },
                          symbols: {
                            type: JsonType.array,
                            items: { type: JsonType.string }
                          },
                          tags: {
                            type: JsonType.array,
                            items: { type: JsonType.string }
                          }
                        },
                        required: ["date","title"],
                        additionalProperties: false
                      }
                    }
                  },
                  additionalProperties: false
                }
              },
              required: ["ticker","company_name","price_data","volume_data"],
              additionalProperties: false
            }
          },
          day_trading_metrics: {
            type: JsonType.object,
            description: "Short-term trading metrics like volatility scores.",
            properties: {
              volatility_score: {
                type: JsonType.number,
                description: "Custom measure of volatility for short-term trading."
              },
              technical_setup_score: {
                type: JsonType.number,
                description: "Custom measure indicating technical readiness."
              }
            },
            additionalProperties: false
          }
        },
        required: [
          "date",
          "time",
          "market_data",
          "stock_universe",
          "material_news_classification",
          "day_trading_metrics"
        ],
        additionalProperties: false
      },
      {
        // ------------------------------
        // SHAPE #2: SINGLE STOCK OBJECT
        // (Similar structure as items in stock_universe)
        // ------------------------------
        type: JsonType.object,
        properties: {
          ticker: {
            type: JsonType.string,
            description: "Stock symbol (e.g., 'NVDA')."
          },
          company_name: {
            type: JsonType.string,
            description: "Name of the company."
          },
          sector: {
            type: JsonType.string,
            description: "Broad sector classification."
          },
          industry: {
            type: JsonType.string,
            description: "Industry classification."
          },
          market_cap: {
            type: JsonType.number,
            description: "Company market cap in dollars."
          },
          float: {
            type: JsonType.number,
            description: "Number of shares available to the public."
          },
          avg_daily_volume: {
            type: JsonType.number,
            description: "Average daily trading volume."
          },
          price_data: {
            // Same shape as above:
            type: JsonType.object,
            description: "All the price details: current price, day range, etc.",
            properties: {
              previous_close: { type: JsonType.number },
              pre_market: { type: JsonType.number },
              current: { type: JsonType.number },
              day_range: {
                type: JsonType.object,
                properties: {
                  low: { type: JsonType.number },
                  high: { type: JsonType.number }
                },
                required: ["low","high"],
                additionalProperties: false
              },
              moving_averages: {
                type: JsonType.object,
                additionalProperties: {
                  type: JsonType.number
                }
              },
              intraday: {
                type: JsonType.object,
                properties: {
                  opening_range: {
                    type: JsonType.object,
                    properties: {
                      high: { type: JsonType.number },
                      low: { type: JsonType.number },
                      breakout: { type: JsonType.boolean }
                    },
                    required: ["high","low","breakout"],
                    additionalProperties: false
                  },
                  vwap: { type: JsonType.number }
                },
                required: ["opening_range","vwap"],
                additionalProperties: false
              }
            },
            required: ["previous_close","pre_market","current"],
            additionalProperties: false
          },
          volume_data: {
            // Same shape as above
            type: JsonType.object,
            description: "Volume-related data.",
            properties: {
              pre_market: { type: JsonType.number },
              current: { type: JsonType.number },
              avg_10d: { type: JsonType.number },
              relative_volume: { type: JsonType.number },
              volume_distribution: {
                type: JsonType.object,
                properties: {
                  first_hour_percent: { type: JsonType.number }
                },
                additionalProperties: false
              }
            },
            required: ["current"],
            additionalProperties: false
          },
          technical_indicators: {
            type: JsonType.object,
            properties: {
              rsi_14: { type: JsonType.number },
              macd: {
                type: JsonType.object,
                properties: {
                  line: { type: JsonType.number },
                  signal: { type: JsonType.number }
                },
                required: ["line","signal"],
                additionalProperties: false
              },
              atr_14: { type: JsonType.number },
              bollinger_bands: {
                type: JsonType.object,
                properties: {
                  upper: { type: JsonType.number },
                  middle: { type: JsonType.number },
                  lower: { type: JsonType.number },
                  width: { type: JsonType.number }
                },
                required: ["upper","middle","lower"],
                additionalProperties: false
              },
              adx: { type: JsonType.number },
              pattern_recognition: {
                type: JsonType.object,
                properties: {
                  bullish_patterns: {
                    type: JsonType.array,
                    items: { type: JsonType.string }
                  },
                  bearish_patterns: {
                    type: JsonType.array,
                    items: { type: JsonType.string }
                  },
                  consolidation_patterns: {
                    type: JsonType.array,
                    items: { type: JsonType.string }
                  }
                },
                additionalProperties: false
              }
            },
            additionalProperties: false
          },
          options_data: {
            type: JsonType.object,
            properties: {
              call_put_ratio: { type: JsonType.number },
              unusual_activity: { type: JsonType.boolean },
              options_flow: {
                type: JsonType.object,
                properties: {
                  bullish_flow_percent: { type: JsonType.number }
                },
                additionalProperties: false
              }
            },
            required: ["call_put_ratio","unusual_activity"],
            additionalProperties: false
          },
          earnings_data: {
            type: JsonType.object,
            properties: {
              recent_report: {
                type: JsonType.object,
                properties: {
                  date: { type: JsonType.string },
                  eps: {
                    type: JsonType.object,
                    properties: {
                      actual: { type: JsonType.number },
                      estimate: { type: JsonType.number },
                      surprise_percent: { type: JsonType.number }
                    },
                    required: ["actual","estimate"],
                    additionalProperties: false
                  }
                },
                required: ["date","eps"],
                additionalProperties: false
              }
            },
            additionalProperties: false
          },
          news_data: {
            type: JsonType.object,
            properties: {
              recent_articles: {
                type: JsonType.array,
                items: {
                  type: JsonType.object,
                  properties: {
                    date: { type: JsonType.string },
                    title: { type: JsonType.string },
                    teaser: { type: JsonType.string },
                    content: { type: JsonType.string },
                    link: { type: JsonType.string },
                    symbols: {
                      type: JsonType.array,
                      items: { type: JsonType.string }
                    },
                    tags: {
                      type: JsonType.array,
                      items: { type: JsonType.string }
                    }
                  },
                  required: ["date","title"],
                  additionalProperties: false
                }
              }
            },
            additionalProperties: false
          },
          material_news_classification: {
            type: JsonType.string,
            description: "High-level classification of the news."
          },
          day_trading_metrics: {
            type: JsonType.object,
            description: "Intraday metrics (volatility, technical setup).",
            properties: {
              volatility_score: { type: JsonType.number },
              technical_setup_score: { type: JsonType.number }
            },
            additionalProperties: false
          }
        },
        required: [
          "ticker",
          "company_name",
          "price_data",
          "volume_data"
        ],
        additionalProperties: false
      },
      {
        // ------------------------------
        // SHAPE #3: MARKET CONDITIONS
        // ------------------------------
        type: JsonType.object,
        properties: {
          market_conditions: {
            type: JsonType.object,
            description: "Broader market condition data (VIX, sector rotations, etc.).",
            properties: {
              vix: {
                type: JsonType.number,
                description: "The current VIX level."
              },
              put_call_ratio: {
                type: JsonType.number,
                description: "Overall put-to-call ratio."
              },
              sector_rotation: {
                type: JsonType.object,
                properties: {
                  inflow_sectors: {
                    type: JsonType.array,
                    items: { type: JsonType.string },
                    description: "Sectors receiving capital inflows."
                  },
                  outflow_sectors: {
                    type: JsonType.array,
                    items: { type: JsonType.string },
                    description: "Sectors seeing capital outflows."
                  }
                },
                required: ["inflow_sectors","outflow_sectors"],
                additionalProperties: false
              },
              macro_events: {
                type: JsonType.array,
                description: "List of major upcoming macro or economic events.",
                items: { type: JsonType.string }
              }
            },
            required: ["vix","put_call_ratio","sector_rotation","macro_events"],
            additionalProperties: false
          }
        },
        required: ["market_conditions"],
        additionalProperties: false
      }
    ]
  }
};
</json-schema>

Here is the data set to analyze:
<data-set>
{{{dataSet}}}
</data-set>
 
<instructions>
You have JSON data containing multiple stocks with technical indicators, options flow, news classification, and other metrics. Your task is to:
1. Ingest and interpret the provided stock market JSON data.
2. Determine the single most bullish stock based on the data (news, technical indicators, options flow, etc.).
   - VERY IMPORTANT: READ THE NEWS ARTICLES AND UNDERSTAND THE SENTIMENT.
   - Analyze how the news content might impact the company based on similar historical events.
   - Consider how the market has previously reacted to similar news for this company or sector.
   - Identify patterns between news content and subsequent price movements.
3. Predict a realistic closing price for that stock by the end of today's trading session.
</instructions>
`;

@Injectable()
export class TopDogV2Workflow {
  private midCapScreener: MidCapScreenerService;

  constructor() {
    this.midCapScreener = new MidCapScreenerService();
  }

  async process(stockData: any) {
    // Get current date and time in the format compatible with the stock system
    const now = getNow();
    // Extract date and time parts
    const [date, time] = now.split(' ');
    const data = await this.midCapScreener.runAnalysis(
      date as string,
      time as string,
    );




    return prompt.replace('{{{dataSet}}}', JSON.stringify(data));
  }
}
