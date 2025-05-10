/**
 * Service for calculating various stock scores used in day trading analysis.
 */

export class ScoringService {

  /**
   * Calculate volatility score (0-1)
   * Higher score indicates higher volatility and volume-based action
   */
  calculateVolatilityScore(
    atr: number,
    bollingerBands: { upper: number; middle: number; lower: number; width: number },
    currentPrice: number,
    historicalPrices: Array<{ high: number; low: number }> | undefined,
    avgVolume: number,
    currentVolume: number
  ): number {
    const atrPercent = currentPrice > 0 ? atr / currentPrice : 0;
    const bbWidth = bollingerBands.width;
    let priceVolatility = 0;
    if (historicalPrices && historicalPrices.length > 0) {
      const ranges = historicalPrices.map(
        p => (p.high - p.low) / ((p.high + p.low) / 2)
      );
      const avgRange = ranges.reduce((sum, r) => sum + r, 0) / ranges.length;
      priceVolatility = avgRange;
    }
    const volumeRatio = avgVolume > 0 ? currentVolume / avgVolume : 1;

    const factors = [
      { value: atrPercent * 10, weight: 0.3 },
      { value: bbWidth, weight: 0.3 },
      { value: priceVolatility * 10, weight: 0.2 },
      { value: Math.min(volumeRatio / 3, 1), weight: 0.2 }
    ];

    const weightedSum = factors.reduce((sum, f) => sum + f.value * f.weight, 0);
    const weightSum = factors.reduce((sum, f) => sum + f.weight, 0);

    return Math.min(weightedSum / weightSum, 1);
  }

  /**
   * Calculate technical setup score (0-1)
   * Based on RSI, MACD, ADX, pattern recognition, and price vs MA alignment
   */
  calculateTechnicalSetupScore(
    rsi: number,
    macd: { line: number; signal: number; histogram: number },
    adx: number,
    patterns: { bullish_patterns: string[]; bearish_patterns: string[]; consolidation_patterns: string[] },
    price: number,
    movingAverages: { ma_20: number; ma_50: number }
  ): number {
    // RSI
    const rsiScore = (rsi >= 40 && rsi <= 60) ? 0.7 :
      (rsi > 60 && rsi < 70) ? 0.9 :
      (rsi >= 30 && rsi < 40) ? 0.6 :
      (rsi < 30) ? 0.3 :
      (rsi >= 70) ? 0.4 : 0.5;

    // MACD
    const macdCrossover = macd.line > macd.signal;
    const macdPositive = macd.histogram > 0;
    const macdScore = (macdCrossover && macdPositive) ? 0.9 :
      (macdCrossover) ? 0.7 :
      (macdPositive) ? 0.6 : 0.3;

    // ADX
    const adxScore = adx > 30 ? 0.9 :
      adx > 20 ? 0.7 :
      adx > 15 ? 0.5 : 0.3;

    // Patterns
    const bullishCount = patterns.bullish_patterns.length;
    const bearishCount = patterns.bearish_patterns.length;
    const patternScore = bullishCount > bearishCount ? 0.8 :
      bullishCount === bearishCount ? 0.5 : 0.2;

    // Price vs MA
    const ma20Above50 = movingAverages.ma_20 > movingAverages.ma_50;
    const priceAboveMAs = price > movingAverages.ma_20;
    const maScore = (priceAboveMAs && ma20Above50) ? 0.9 :
      (priceAboveMAs) ? 0.7 :
      (price > movingAverages.ma_50) ? 0.5 : 0.3;

    const weights = {
      rsi: 0.2,
      macd: 0.25,
      adx: 0.15,
      pattern: 0.2,
      ma: 0.2
    };

    const weightedScore = (
      rsiScore * weights.rsi +
      macdScore * weights.macd +
      adxScore * weights.adx +
      patternScore * weights.pattern +
      maScore * weights.ma
    );

    return Math.min(Math.max(weightedScore, 0), 1);
  }
}