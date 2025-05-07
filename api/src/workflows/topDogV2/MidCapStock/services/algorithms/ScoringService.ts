// src/services/algorithms/ScoringService.ts
export class ScoringService {
  // Calculate volatility score (0-1)
  calculateVolatilityScore(
    atr: number,
    bollingerBands: {upper: number, middle: number, lower: number, width: number},
    currentPrice: number,
    historicalPrices: Array<{high: number, low: number}>,
    avgVolume: number,
    currentVolume: number
  ): number {
    // Step 1: Use Bollinger Band width
    const bbWidth = bollingerBands.width;
    
    // Step 2: Normalize ATR as a percentage of price
    const atrPercent = atr / currentPrice;
    
    // Step 3: Calculate historical price volatility (10-day)
    const volatilityHistory = historicalPrices.map(day => {
      return (day.high - day.low) / ((day.high + day.low) / 2);
    });
    
    const avgHistoricalVolatility = volatilityHistory.reduce((sum, v) => sum + v, 0) / 
      volatilityHistory.length;
    
    // Step 4: Calculate relative volume ratio
    const relativeVolume = currentVolume / avgVolume;
    
    // Step 5: Combine factors into a volatility score (0-1 scale)
    const bbWidthWeight = 0.3;
    const atrWeight = 0.3;
    const histVolWeight = 0.2;
    const relVolumeWeight = 0.2;
    
    // Normalize each component to approximately 0-1 scale
    const normalizedBBWidth = Math.min(bbWidth / 0.1, 1); 
    const normalizedATR = Math.min(atrPercent / 0.05, 1);
    const normalizedHistVol = Math.min(avgHistoricalVolatility / 0.04, 1);
    const normalizedRelVolume = Math.min(relativeVolume / 3, 1);
    
    const volatilityScore = 
      (normalizedBBWidth * bbWidthWeight) +
      (normalizedATR * atrWeight) +
      (normalizedHistVol * histVolWeight) +
      (normalizedRelVolume * relVolumeWeight);
    
    return parseFloat(volatilityScore.toFixed(2));
  }
  
  // Calculate technical setup score (0-1)
  calculateTechnicalSetupScore(
    rsi: number,
    macd: {line: number, signal: number, histogram: number},
    adx: number,
    patterns: {bullish_patterns: string[], bearish_patterns: string[], consolidation_patterns: string[]},
    price: number,
    movingAverages: {ma_20: number, ma_50: number}
  ): number {
    // Step 1: Evaluate RSI setup
    let rsiScore = 0;
    if (rsi >= 40 && rsi <= 80) { // In "sweet spot" for uptrend
      rsiScore = 1;
    } else if (rsi > 80) { // Overbought
      rsiScore = -0.5;
    } else if (rsi < 30) { // Oversold, potential bounce
      rsiScore = 0.7;
    } else {
      rsiScore = 0.3; // Neutral
    }
    
    // Step 2: Evaluate MACD setup
    let macdScore = 0;
    // Positive histogram and growing (bullish)
    if (macd.histogram > 0) {
      macdScore = 1;
    } 
    // Histogram crossed above zero (bullish signal)
    else if (macd.line > macd.signal) {
      macdScore = 0.8;
    }
    // Negative but improving (potential bullish setup)
    else if (macd.histogram < 0 && macd.line > macd.signal) {
      macdScore = 0.6;
    }
    // Negative and worsening (bearish)
    else {
      macdScore = -0.5;
    }
    
    // Step 3: Evaluate ADX for trend strength
    let adxScore = 0;
    if (adx > 30) { // Strong trend
      adxScore = 1;
    } else if (adx > 20) { // Moderate trend
      adxScore = 0.7;
    } else if (adx > 15) { // Weak trend
      adxScore = 0.4;
    } else { // No trend
      adxScore = 0.1;
    }
    
    // Step 4: Evaluate chart patterns
    let patternScore = 0;
    const bullishPatternCount = patterns.bullish_patterns.length;
    const bearishPatternCount = patterns.bearish_patterns.length;
    
    // More bullish than bearish patterns
    if (bullishPatternCount > bearishPatternCount) {
      patternScore = Math.min(bullishPatternCount * 0.2, 1);
    } 
    // More bearish than bullish patterns
    else if (bearishPatternCount > bullishPatternCount) {
      patternScore = -Math.min(bearishPatternCount * 0.2, 1);
    }
    // Equal number, slight positive bias for pattern presence
    else if (bullishPatternCount > 0) {
      patternScore = 0.1;
    }
    
    // Step 5: Evaluate price relative to moving averages
    let maScore = 0;
    if (price > movingAverages.ma_20 && movingAverages.ma_20 > movingAverages.ma_50) {
      // Price above both MAs and 20 above 50 (strong uptrend)
      maScore = 1;
    } else if (price > movingAverages.ma_20) {
      // Price above short-term MA (potential uptrend)
      maScore = 0.7;
    } else if (price > movingAverages.ma_50) {
      // Price above long-term MA but below short-term (consolidation)
      maScore = 0.3;
    } else {
      // Price below both MAs (downtrend)
      maScore = -0.5;
    }
    
    // Step 6: Combine scores with weights
    const rsiWeight = 0.15;
    const macdWeight = 0.25;
    const adxWeight = 0.15;
    const patternWeight = 0.2;
    const maWeight = 0.25;
    
    // Calculate weighted score
    let rawScore = 
      (rsiScore * rsiWeight) +
      (macdScore * macdWeight) +
      (adxScore * adxWeight) +
      (patternScore * patternWeight) +
      (maScore * maWeight);
    
    // Normalize to 0-1 scale
    rawScore = (rawScore + 1) / 2; // Convert from -1...1 to 0...1
    rawScore = Math.max(0, Math.min(1, rawScore)); // Ensure within bounds
    
    return parseFloat(rawScore.toFixed(2));
  }
}

