// src/services/algorithms/PatternRecognitionService.ts
export class PatternRecognitionService {
  // Detect common chart patterns from price data
  detectPatterns(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): {
    bullish_patterns: string[];
    bearish_patterns: string[];
    consolidation_patterns: string[];
  } {
    if (!priceData || priceData.length < 20) {
      return {
        bullish_patterns: [],
        bearish_patterns: [],
        consolidation_patterns: []
      };
    }

    const bullishPatterns: string[] = [];
    const bearishPatterns: string[] = [];
    const consolidationPatterns: string[] = [];

    // Detect Double Bottom (Bullish)
    if (this.detectDoubleBottom(priceData)) {
      bullishPatterns.push('Double Bottom');
    }
    
    // Detect Head and Shoulders (Bearish)
    if (this.detectHeadAndShoulders(priceData)) {
      bearishPatterns.push('Head and Shoulders');
    }
    
    // Detect Inverse Head and Shoulders (Bullish)
    if (this.detectInverseHeadAndShoulders(priceData)) {
      bullishPatterns.push('Inverse Head and Shoulders');
    }
    
    // Detect Bull Flag (Bullish)
    if (this.detectBullFlag(priceData)) {
      bullishPatterns.push('Bull Flag');
    }
    
    // Detect Bear Flag (Bearish)
    if (this.detectBearFlag(priceData)) {
      bearishPatterns.push('Bear Flag');
    }
    
    // Detect Rectangle (Consolidation)
    if (this.detectRectangle(priceData)) {
      consolidationPatterns.push('Rectangle');
    }
    
    // Detect Triangle (Consolidation)
    if (this.detectTriangle(priceData)) {
      consolidationPatterns.push('Triangle');
    }

    // Detect Cup and Handle (Bullish)
    if (this.detectCupAndHandle(priceData)) {
      bullishPatterns.push('Cup and Handle');
    }
    
    // Detect Double Top (Bearish)
    if (this.detectDoubleTop(priceData)) {
      bearishPatterns.push('Double Top');
    }

    return {
      bullish_patterns: bullishPatterns,
      bearish_patterns: bearishPatterns,
      consolidation_patterns: consolidationPatterns
    };
  }

  // Detect Double Bottom pattern (Bullish)
  private detectDoubleBottom(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): boolean {
    // Need at least 15 days of data
    if (priceData.length < 15) return false;
    
    // Get recent data (last 15-20 candles)
    const recentData = priceData.slice(-20);
    
    // Find local minima
    const localMinima = this.findLocalMinima(recentData.map(d => d.low), 3);
    
    // We need at least 2 minima for a double bottom
    if (localMinima.length < 2) return false;
    
    // Check the last two minima
    const lastTwo = localMinima.slice(-2);
    
    // They should be close in price (within 3%)
    const priceRange = Math.abs(recentData[lastTwo[0]].low - recentData[lastTwo[1]].low);
    const avgPrice = (recentData[lastTwo[0]].low + recentData[lastTwo[1]].low) / 2;
    const priceDiffPercent = (priceRange / avgPrice) * 100;
    
    // They should be separated by at least 5 candles
    const seperation = Math.abs(lastTwo[0] - lastTwo[1]);
    
    // Check for confirmation - price should move up after the second bottom
    let confirmation = false;
    if (lastTwo[1] < recentData.length - 3) {
      const afterSecondBottom = recentData.slice(lastTwo[1] + 1);
      const highestAfter = Math.max(...afterSecondBottom.map(d => d.high));
      const secondBottomPrice = recentData[lastTwo[1]].low;
      
      // Moves up at least 5% from the second bottom
      confirmation = (highestAfter - secondBottomPrice) / secondBottomPrice > 0.05;
    }
    
    return priceDiffPercent < 3 && seperation >= 5 && confirmation;
  }
  
  // Detect Head and Shoulders pattern (Bearish)
  private detectHeadAndShoulders(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): boolean {
    // Need at least 20 days of data
    if (priceData.length < 20) return false;
    
    // Get recent data (last 20 candles)
    const recentData = priceData.slice(-20);
    
    // Find local maxima
    const localMaxima = this.findLocalMaxima(recentData.map(d => d.high), 3);
    
    // We need at least 3 maxima for head and shoulders
    if (localMaxima.length < 3) return false;
    
    // Check the last three maxima
    const lastThree = localMaxima.slice(-3);
    
    // Middle peak should be higher than the other two
    const leftShoulder = recentData[lastThree[0]].high;
    const head = recentData[lastThree[1]].high;
    const rightShoulder = recentData[lastThree[2]].high;
    
    // Shoulders should be at similar height (within 5%)
    const shoulderDiff = Math.abs(leftShoulder - rightShoulder);
    const avgShoulderHeight = (leftShoulder + rightShoulder) / 2;
    const shoulderDiffPercent = (shoulderDiff / avgShoulderHeight) * 100;
    
    // Check if there's a neckline (connecting troughs)
    const trough1 = Math.min(...recentData.slice(lastThree[0], lastThree[1]).map(d => d.low));
    const trough2 = Math.min(...recentData.slice(lastThree[1], lastThree[2]).map(d => d.low));
    
    // Neckline should be relatively flat
    const necklineDiff = Math.abs(trough1 - trough2);
    const avgNeckline = (trough1 + trough2) / 2;
    const necklineDiffPercent = (necklineDiff / avgNeckline) * 100;
    
    // Check for confirmation - price breaks below neckline after right shoulder
    let confirmation = false;
    if (lastThree[2] < recentData.length - 2) {
      const afterRightShoulder = recentData.slice(lastThree[2] + 1);
      const lowestAfter = Math.min(...afterRightShoulder.map(d => d.low));
      
      confirmation = lowestAfter < avgNeckline;
    }
    
    return head > leftShoulder &&
           head > rightShoulder &&
           shoulderDiffPercent < 5 &&
           necklineDiffPercent < 3 &&
           confirmation;
  }
  
  // Detect Inverse Head and Shoulders pattern (Bullish)
  private detectInverseHeadAndShoulders(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): boolean {
    // Need at least 20 days of data
    if (priceData.length < 20) return false;
    
    // Get recent data (last 20 candles)
    const recentData = priceData.slice(-20);
    
    // Find local minima
    const localMinima = this.findLocalMinima(recentData.map(d => d.low), 3);
    
    // We need at least 3 minima for inverse head and shoulders
    if (localMinima.length < 3) return false;
    
    // Check the last three minima
    const lastThree = localMinima.slice(-3);
    
    // Middle trough should be lower than the other two
    const leftShoulder = recentData[lastThree[0]].low;
    const head = recentData[lastThree[1]].low;
    const rightShoulder = recentData[lastThree[2]].low;
    
    // Shoulders should be at similar height (within 5%)
    const shoulderDiff = Math.abs(leftShoulder - rightShoulder);
    const avgShoulderHeight = (leftShoulder + rightShoulder) / 2;
    const shoulderDiffPercent = (shoulderDiff / avgShoulderHeight) * 100;
    
    // Check if there's a neckline (connecting peaks)
    const peak1 = Math.max(...recentData.slice(lastThree[0], lastThree[1]).map(d => d.high));
    const peak2 = Math.max(...recentData.slice(lastThree[1], lastThree[2]).map(d => d.high));
    
    // Neckline should be relatively flat
    const necklineDiff = Math.abs(peak1 - peak2);
    const avgNeckline = (peak1 + peak2) / 2;
    const necklineDiffPercent = (necklineDiff / avgNeckline) * 100;
    
    // Check for confirmation - price breaks above neckline after right shoulder
    let confirmation = false;
    if (lastThree[2] < recentData.length - 2) {
      const afterRightShoulder = recentData.slice(lastThree[2] + 1);
      const highestAfter = Math.max(...afterRightShoulder.map(d => d.high));
      
      confirmation = highestAfter > avgNeckline;
    }
    
    return head < leftShoulder &&
           head < rightShoulder &&
           shoulderDiffPercent < 5 &&
           necklineDiffPercent < 3 &&
           confirmation;
  }
  
  // Detect Bull Flag pattern (Bullish)
  private detectBullFlag(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): boolean {
    // Need at least 15 days of data
    if (priceData.length < 15) return false;
    
    // Get recent data (last 15 candles)
    const recentData = priceData.slice(-15);
    
    // First part should be a strong uptrend (the "pole")
    const poleData = recentData.slice(0, 7); // First 7 candles
    const poleStart = poleData[0].close;
    const poleEnd = poleData[poleData.length - 1].close;
    const poleMove = (poleEnd - poleStart) / poleStart;
    
    // Should have at least 8% move for the pole
    if (poleMove < 0.08) return false;
    
    // Second part should be a consolidation/slight pullback (the "flag")
    const flagData = recentData.slice(7); // Remaining candles
    const flagHigh = Math.max(...flagData.map(d => d.high));
    const flagLow = Math.min(...flagData.map(d => d.low));
    const flagRange = (flagHigh - flagLow) / flagLow;
    
    // Flag range should be relatively tight (less than half of pole move)
    if (flagRange > poleMove / 2) return false;
    
    // Check for volume pattern - higher during pole, lower during flag
    const poleVolumeAvg = poleData.reduce((sum, d) => sum + d.volume, 0) / poleData.length;
    const flagVolumeAvg = flagData.reduce((sum, d) => sum + d.volume, 0) / flagData.length;
    
    // Flag volume should be lower than pole volume
    const lowerVolume = flagVolumeAvg < poleVolumeAvg;
    
    // Check for possible breakout after flag
    const potentialBreakout = flagData[flagData.length - 1].close > flagHigh * 0.98;
    
    return lowerVolume && (potentialBreakout || flagData.length >= 5);
  }
  
  // Detect Bear Flag pattern (Bearish)
  private detectBearFlag(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): boolean {
    // Need at least 15 days of data
    if (priceData.length < 15) return false;
    
    // Get recent data (last 15 candles)
    const recentData = priceData.slice(-15);
    
    // First part should be a strong downtrend (the "pole")
    const poleData = recentData.slice(0, 7); // First 7 candles
    const poleStart = poleData[0].close;
    const poleEnd = poleData[poleData.length - 1].close;
    const poleMove = (poleStart - poleEnd) / poleStart; // Downward move percentage
    
    // Should have at least 8% move for the pole
    if (poleMove < 0.08) return false;
    
    // Second part should be a consolidation/slight pullback (the "flag")
    const flagData = recentData.slice(7); // Remaining candles
    const flagHigh = Math.max(...flagData.map(d => d.high));
    const flagLow = Math.min(...flagData.map(d => d.low));
    const flagRange = (flagHigh - flagLow) / flagLow;
    
    // Flag range should be relatively tight (less than half of pole move)
    if (flagRange > poleMove / 2) return false;
    
    // Check for volume pattern - higher during pole, lower during flag
    const poleVolumeAvg = poleData.reduce((sum, d) => sum + d.volume, 0) / poleData.length;
    const flagVolumeAvg = flagData.reduce((sum, d) => sum + d.volume, 0) / flagData.length;
    
    // Flag volume should be lower than pole volume
    const lowerVolume = flagVolumeAvg < poleVolumeAvg;
    
    // Check for possible breakdown after flag
    const potentialBreakdown = flagData[flagData.length - 1].close < flagLow * 1.02;
    
    return lowerVolume && (potentialBreakdown || flagData.length >= 5);
  }
  
  // Detect Rectangle pattern (Consolidation)
  private detectRectangle(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): boolean {
    // Need at least 15 days of data
    if (priceData.length < 15) return false;
    
    // Get recent data (last 15 candles)
    const recentData = priceData.slice(-15);
    
    // Calculate highest high and lowest low
    const highestHigh = Math.max(...recentData.map(d => d.high));
    const lowestLow = Math.min(...recentData.map(d => d.low));
    
    // Calculate rectangle height as percentage of price
    const rectangleHeight = (highestHigh - lowestLow) / lowestLow;
    
    // Rectangle should be relatively tight (less than 10% range)
    if (rectangleHeight > 0.1) return false;
    
    // Should test upper and lower bounds multiple times
    const upperTests = recentData.filter(d => d.high > highestHigh * 0.97).length;
    const lowerTests = recentData.filter(d => d.low < lowestLow * 1.03).length;
    
    // Should test each boundary at least twice
    return upperTests >= 2 && lowerTests >= 2;
  }
  
  // Detect Triangle pattern (Consolidation)
  private detectTriangle(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): boolean {
    // Need at least 15 days of data
    if (priceData.length < 15) return false;
    
    // Get recent data (last 15 candles)
    const recentData = priceData.slice(-15);
    
    // Calculate linear regression for highs and lows
    const highRegression = this.calculateLinearRegression(
      recentData.map((_, i) => i),
      recentData.map(d => d.high)
    );
    
    const lowRegression = this.calculateLinearRegression(
      recentData.map((_, i) => i),
      recentData.map(d => d.low)
    );
    
    // Check for ascending triangle
    const isAscendingTriangle =
      Math.abs(highRegression.slope) < 0.001 && // Flat top
      lowRegression.slope > 0.001; // Rising bottom
      
    // Check for descending triangle
    const isDescendingTriangle =
      highRegression.slope < -0.001 && // Falling top
      Math.abs(lowRegression.slope) < 0.001; // Flat bottom
      
    // Check for symmetrical triangle
    const isSymmetricalTriangle =
      highRegression.slope < -0.001 && // Falling top
      lowRegression.slope > 0.001; // Rising bottom
      
    return isAscendingTriangle || isDescendingTriangle || isSymmetricalTriangle;
  }
  
  // Detect Cup and Handle pattern (Bullish)
  private detectCupAndHandle(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): boolean {
    // Need at least 20 days of data
    if (priceData.length < 20) return false;
    
    // Get recent data (last 20 candles)
    const recentData = priceData.slice(-20);
    
    // Cup should form in first 15 candles, handle in the last 5
    const cupData = recentData.slice(0, 15);
    const handleData = recentData.slice(15);
    
    // Find highest points at cup edges
    const leftEdge = cupData[0].high;
    const rightEdge = cupData[cupData.length - 1].high;
    
    // Edges should be similar in height (within 3%)
    const edgeDiff = Math.abs(leftEdge - rightEdge);
    const avgEdgeHeight = (leftEdge + rightEdge) / 2;
    const edgeDiffPercent = (edgeDiff / avgEdgeHeight) * 100;
    
    if (edgeDiffPercent > 3) return false;
    
    // Cup should have a rounded bottom
    const cupBottom = Math.min(...cupData.map(d => d.low));
    const cupDepth = (avgEdgeHeight - cupBottom) / avgEdgeHeight;
    
    // Cup should have a decent depth (at least.12%)
    if (cupDepth < 0.12) return false;
    
    // Handle should be a small pullback (less than half of cup depth)
    const handleBottom = Math.min(...handleData.map(d => d.low));
    const handleDepth = (rightEdge - handleBottom) / rightEdge;
    
    if (handleDepth > cupDepth / 2 || handleDepth < 0.03) return false;
    
    // Handle should be shorter in duration than cup
    return true;
  }
  
  // Detect Double Top pattern (Bearish)
  private detectDoubleTop(
    priceData: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): boolean {
    // Need at least 15 days of data
    if (priceData.length < 15) return false;
    
    // Get recent data (last 15-20 candles)
    const recentData = priceData.slice(-20);
    
    // Find local maxima
    const localMaxima = this.findLocalMaxima(recentData.map(d => d.high), 3);
    
    // We need at least 2 maxima for a double top
    if (localMaxima.length < 2) return false;
    
    // Check the last two maxima
    const lastTwo = localMaxima.slice(-2);
    
    // They should be close in price (within 3%)
    const priceRange = Math.abs(recentData[lastTwo[0]].high - recentData[lastTwo[1]].high);
    const avgPrice = (recentData[lastTwo[0]].high + recentData[lastTwo[1]].high) / 2;
    const priceDiffPercent = (priceRange / avgPrice) * 100;
    
    // They should be separated by at least 5 candles
    const seperation = Math.abs(lastTwo[0] - lastTwo[1]);
    
    // Check for confirmation - price should move down after the second top
    let confirmation = false;
    if (lastTwo[1] < recentData.length - 3) {
      const afterSecondTop = recentData.slice(lastTwo[1] + 1);
      const lowestAfter = Math.min(...afterSecondTop.map(d => d.low));
      const secondTopPrice = recentData[lastTwo[1]].high;
      
      // Moves down at least 5% from the second top
      confirmation = (secondTopPrice - lowestAfter) / secondTopPrice > 0.05;
    }
    
    return priceDiffPercent < 3 && seperation >= 5 && confirmation;
  }
  
  // Helper function to find local minima in a dataset
  private findLocalMinima(data: number[], window: number = 2): number[] {
    const minima: number[] = [];
    
    for (let i = window; i < data.length - window; i++) {
      let isMinimum = true;
      
      for (let j = i - window; j <= i + window; j++) {
        if (j !== i && data[j] < data[i]) {
          isMinimum = false;
          break;
        }
      }
      
      if (isMinimum) {
        minima.push(i);
      }
    }
    
    return minima;
  }
  
  // Helper function to find local maxima in a dataset
  private findLocalMaxima(data: number[], window: number = 2): number[] {
    const maxima: number[] = [];
    
    for (let i = window; i < data.length - window; i++) {
      let isMaximum = true;
      
      for (let j = i - window; j <= i + window; j++) {
        if (j !== i && data[j] > data[i]) {
          isMaximum = false;
          break;
        }
      }
      
      if (isMaximum) {
        maxima.push(i);
      }
    }
    
    return maxima;
  }
  
  // Helper function to calculate linear regression
  private calculateLinearRegression(
    x: number[],
    y: number[]
  ): { slope: number; intercept: number; r2: number } {
    const n = x.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumXX += x[i] * x[i];
      sumYY += y[i] * y[i];
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared
    const xMean = sumX / n;
    const yMean = sumY / n;
    let ssRes = 0;
    let ssTot = 0;
    
    for (let i = 0; i < n; i++) {
      const yPred = slope * x[i] + intercept;
      ssRes += Math.pow(y[i] - yPred, 2);
      ssTot += Math.pow(y[i] - yMean, 2);
    }
    
    const r2 = 1 - (ssRes / ssTot);
    
    return { slope, intercept, r2 };
  }
  
  // Cross-validate patterns from EODHD with our custom detection
  crossValidatePatterns(
    eodhdPatterns: {
      bullish_patterns: string[];
      bearish_patterns: string[];
      consolidation_patterns: string[];
    },
    customPatterns: {
      bullish_patterns: string[];
      bearish_patterns: string[];
      consolidation_patterns: string[];
    }
  ): {
    bullish_patterns: string[];
    bearish_patterns: string[];
    consolidation_patterns: string[];
  } {
    // Helper function to count matches between two pattern arrays
    const countMatches = (arr1: string[], arr2: string[]) => {
      return arr1.filter(p1 =>
        arr2.some(p2 =>
          p2.toLowerCase().includes(p1.toLowerCase()) ||
          p1.toLowerCase().includes(p2.toLowerCase())
        )
      ).length;
    };
    
    // Count matches in each category
    const bullishMatches = countMatches(eodhdPatterns.bullish_patterns, customPatterns.bullish_patterns);
    const bearishMatches = countMatches(eodhdPatterns.bearish_patterns, customPatterns.bearish_patterns);
    const consolidationMatches = countMatches(eodhdPatterns.consolidation_patterns, customPatterns.consolidation_patterns);
    
    // If there are no matches, custom patterns might be more reliable
    if (bullishMatches === 0 && bearishMatches === 0 && consolidationMatches === 0) {
      return customPatterns;
    }
    
    // Combine patterns with highest confidence first
    const combinedBullish = [
      // Matching patterns have highest confidence
      ...eodhdPatterns.bullish_patterns.filter(p1 =>
        customPatterns.bullish_patterns.some(p2 =>
          p2.toLowerCase().includes(p1.toLowerCase()) ||
          p1.toLowerCase().includes(p2.toLowerCase())
        )
      ),
      // Then add remaining patterns
      ...eodhdPatterns.bullish_patterns.filter(p1 =>
        !customPatterns.bullish_patterns.some(p2 =>
          p2.toLowerCase().includes(p1.toLowerCase()) ||
          p1.toLowerCase().includes(p2.toLowerCase())
        )
      ),
      ...customPatterns.bullish_patterns.filter(p1 =>
        !eodhdPatterns.bullish_patterns.some(p2 =>
          p2.toLowerCase().includes(p1.toLowerCase()) ||
          p1.toLowerCase().includes(p2.toLowerCase())
        )
      )
    ];
    
    const combinedBearish = [
      // Matching patterns have highest confidence
      ...eodhdPatterns.bearish_patterns.filter(p1 =>
        customPatterns.bearish_patterns.some(p2 =>
          p2.toLowerCase().includes(p1.toLowerCase()) ||
          p1.toLowerCase().includes(p2.toLowerCase())
        )
      ),
      // Then add remaining patterns
      ...eodhdPatterns.bearish_patterns.filter(p1 =>
        !customPatterns.bearish_patterns.some(p2 =>
          p2.toLowerCase().includes(p1.toLowerCase()) ||
          p1.toLowerCase().includes(p2.toLowerCase())
        )
      ),
      ...customPatterns.bearish_patterns.filter(p1 =>
        !eodhdPatterns.bearish_patterns.some(p2 =>
          p2.toLowerCase().includes(p1.toLowerCase()) ||
          p1.toLowerCase().includes(p2.toLowerCase())
        )
      )
    ];
    
    const combinedConsolidation = [
      // Matching patterns have highest confidence
      ...eodhdPatterns.consolidation_patterns.filter(p1 =>
        customPatterns.consolidation_patterns.some(p2 =>
          p2.toLowerCase().includes(p1.toLowerCase()) ||
          p1.toLowerCase().includes(p2.toLowerCase())
        )
      ),
      // Then add remaining patterns
      ...eodhdPatterns.consolidation_patterns.filter(p1 =>
        !customPatterns.consolidation_patterns.some(p2 =>
          p2.toLowerCase().includes(p1.toLowerCase()) ||
          p1.toLowerCase().includes(p2.toLowerCase())
        )
      ),
      ...customPatterns.consolidation_patterns.filter(p1 =>
        !eodhdPatterns.consolidation_patterns.some(p2 =>
          p2.toLowerCase().includes(p1.toLowerCase()) ||
          p1.toLowerCase().includes(p2.toLowerCase())
        )
      )
    ];
    
    return {
      bullish_patterns: combinedBullish,
      bearish_patterns: combinedBearish,
      consolidation_patterns: combinedConsolidation
    };
  }
}