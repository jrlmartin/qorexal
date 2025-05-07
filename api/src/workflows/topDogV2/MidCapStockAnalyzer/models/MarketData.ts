import { MarketConditions, Stock } from "./Stock";

// src/models/MarketData.ts
export interface MarketData {
  date: string;
  time: string;
  market_data: {
    indices: Record<string, { price: number; change_percent: number }>;
    sector_performance: Record<string, number>;
  };
  stock_universe: Stock[];
  market_conditions: MarketConditions;
}
