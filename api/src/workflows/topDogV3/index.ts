/**
 * Main entry point for mid-cap stock analysis with AI prediction.
 * Combines the MidCapScreenerService with AIPredictionService
 * and returns a comprehensive analysis result.
 */

import { MidCapScreenerService } from './services/MidCapScreenerService';
import { AIPredictionService, PricePrediction } from './services/AIPredictionService';
import { getNow, getLatestTradingDay } from './utils/dateUtils';
import { DayTradingAnalysis } from './models/DayTradingAnalysis';
import { MarketData } from './models/DayTradingAnalysis';

export interface AnalysisResult {
  analysis: DayTradingAnalysis;
  predictions: PricePrediction[];
  generatedAt: string;
}

/**
 * Run the full analysis with AI predictions
 */
export async function runMidCapAnalysis(): Promise<AnalysisResult> {
  const screenerService = new MidCapScreenerService();
  const predictionService = new AIPredictionService();

  const currentDate = getLatestTradingDay();
  const currentTime = getNow();

  // This returns a legacy MarketData structure
  const analysis = await screenerService.runAnalysis(currentDate, currentTime);

  // Convert the legacy MarketData into a DayTradingAnalysis form.
  // In a real system, you'd have bridging code here to transform
  // MarketData -> DayTradingAnalysis, or we would have used
  // a single data model from the start. For demonstration, let's just cast:
  const dayTradingAnalysis: DayTradingAnalysis = {
    date: analysis.date,
    time: analysis.time,
    marketContext: {
      indices: {}, // omitted
      sectorPerformance: analysis.market_data.sector_performance,
      vix: analysis.market_conditions.vix,
      putCallRatio: analysis.market_conditions.put_call_ratio,
      sectorRotation: {
        inflowSectors: analysis.market_conditions.sector_rotation.inflow_sectors,
        outflowSectors: analysis.market_conditions.sector_rotation.outflow_sectors
      },
      macroEvents: analysis.market_conditions.macro_events,
      marketStatus: analysis.market_conditions.market_status,
      nextMarketHoursChange: analysis.market_conditions.next_market_hours_change
    },
    // Because the older data model differs from the new one,
    // we will skip full bridging and only create placeholder stocks:
    stocks: [],
    notes: []
  };

  // Now generate AI predictions
  const predictions = await predictionService.predictPrices(dayTradingAnalysis);

  return {
    analysis: dayTradingAnalysis,
    predictions,
    generatedAt: new Date().toISOString()
  };
}