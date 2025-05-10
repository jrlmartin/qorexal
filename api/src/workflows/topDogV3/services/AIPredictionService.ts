/**
 * Service for making price predictions using AI/ML or heuristic approach.
 */

import { FeatureEngineeringService } from './FeatureEngineeringService';
import { DayTradingAnalysis, StockAnalysis } from '../models/DayTradingAnalysis';

export interface PricePrediction {
  ticker: string;
  currentPrice: number;
  predictedHighPrice: number;
  predictedHighConfidence: number;
  timeToHighEstimate: string;
  predictedLowPrice: number;
  predictedLowConfidence: number;
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
}

export class AIPredictionService {
  private featureEngineeringService: FeatureEngineeringService;

  constructor() {
    this.featureEngineeringService = new FeatureEngineeringService();
  }

  /**
   * Process a full DayTradingAnalysis into predictions
   */
  async predictPrices(analysis: DayTradingAnalysis): Promise<PricePrediction[]> {
    const predictions: PricePrediction[] = [];
    for (const stock of analysis.stocks) {
      const modelInput = this.prepareModelInput(stock, analysis.marketContext);
      const prediction = this.generatePrediction(stock, modelInput);
      predictions.push(prediction);
    }
    return predictions;
  }

  private prepareModelInput(
    stock: StockAnalysis,
    marketContext: any
  ): number[][] {
    return this.featureEngineeringService.buildFeatureMatrix(stock, marketContext);
  }

  private generatePrediction(
    stock: StockAnalysis,
    features: number[][]
  ): PricePrediction {
    const currentPrice = stock.priceData.current;
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    const technicals = stock.technicalIndicators;
    if (
      technicals.rsi > 60 &&
      technicals.macd.histogram > 0 &&
      currentPrice > stock.priceData.intraday.vwap
    ) {
      sentiment = 'bullish';
    } else if (
      technicals.rsi < 40 &&
      technicals.macd.histogram < 0 &&
      currentPrice < stock.priceData.intraday.vwap
    ) {
      sentiment = 'bearish';
    }

    const avgVolatilityPercent = technicals.atrPercent;
    const volatilityMultiplier = sentiment === 'bullish' ? 2.0 :
      sentiment === 'bearish' ? -2.0 : 0.5;
    const expectedMovePercent = avgVolatilityPercent * volatilityMultiplier;

    const predictedHighPrice = currentPrice * (1 + Math.abs(expectedMovePercent) / 100);
    const predictedLowPrice = currentPrice * (1 - Math.abs(expectedMovePercent) / 100);

    const strengthFactors = [
      Math.abs(technicals.rsi - 50) / 50,
      Math.abs(technicals.macd.histogram) / 2,
      technicals.adx / 100,
      stock.aiMetrics.technicalSetupScore,
      stock.volumeData.relativeVolume > 1 ? 0.7 : 0.3
    ];
    let confidenceScore = strengthFactors.reduce((sum, f) => sum + f, 0) / strengthFactors.length;

    const patternMatches = (
      (sentiment === 'bullish' && technicals.patternRecognition.bullishPatterns.length > 0) ||
      (sentiment === 'bearish' && technicals.patternRecognition.bearishPatterns.length > 0)
    );
    if (patternMatches) {
      confidenceScore = Math.min(confidenceScore * 1.3, 0.95);
    }

    const timeToTarget = this.estimateTimeToTarget(expectedMovePercent, stock.aiMetrics.momentumScore);

    return {
      ticker: stock.ticker,
      currentPrice,
      predictedHighPrice: parseFloat(predictedHighPrice.toFixed(2)),
      predictedHighConfidence: parseFloat(confidenceScore.toFixed(2)),
      timeToHighEstimate: timeToTarget,
      predictedLowPrice: parseFloat(predictedLowPrice.toFixed(2)),
      predictedLowConfidence: parseFloat((confidenceScore * 0.8).toFixed(2)),
      overallSentiment: sentiment
    };
  }

  private estimateTimeToTarget(
    expectedMovePercent: number,
    momentumScore: number
  ): string {
    const absMove = Math.abs(expectedMovePercent);
    if (absMove < 0.5 || momentumScore < 0.2) {
      return 'End of Week';
    } else if (absMove < 1.5 || momentumScore < 0.5) {
      return 'End of Day';
    } else if (absMove < 3 || momentumScore < 0.7) {
      return 'Next 2 Hours';
    } else {
      return 'Next Hour';
    }
  }
}