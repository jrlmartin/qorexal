/**
 * Service for custom chart pattern detection since EODHD's pattern_recognition is unavailable.
 */

export class PatternRecognitionService {

  /**
   * Detect common chart patterns from price data
   */
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
    if (!priceData || priceData.length < 30) {
      return {
        bullish_patterns: [],
        bearish_patterns: [],
        consolidation_patterns: []
      };
    }
    const sortedData = [...priceData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const closes = sortedData.map(d => d.close);
    const highs = sortedData.map(d => d.high);
    const lows = sortedData.map(d => d.low);
    const volumes = sortedData.map(d => d.volume);

    const bullishPatterns: string[] = [];
    const bearishPatterns: string[] = [];
    const consolidationPatterns: string[] = [];

    // Basic example patterns
    if (this.detectDoubleBottom(lows, closes)) {
      bullishPatterns.push('Double Bottom');
    }
    if (this.detectHeadAndShoulders(highs, closes)) {
      bearishPatterns.push('Head and Shoulders');
    }
    if (this.detectInverseHeadAndShoulders(lows, closes)) {
      bullishPatterns.push('Inverse Head and Shoulders');
    }
    if (this.detectBullFlag(closes, volumes)) {
      bullishPatterns.push('Bull Flag');
    }
    if (this.detectBearFlag(closes, volumes)) {
      bearishPatterns.push('Bear Flag');
    }
    if (this.detectRectangle(highs, lows)) {
      consolidationPatterns.push('Rectangle');
    }
    const triangleType = this.detectTriangle(highs, lows);
    if (triangleType === 'ascending') {
      bullishPatterns.push('Ascending Triangle');
    } else if (triangleType === 'descending') {
      bearishPatterns.push('Descending Triangle');
    } else if (triangleType === 'symmetric') {
      consolidationPatterns.push('Symmetric Triangle');
    }
    if (this.detectCupAndHandle(closes)) {
      bullishPatterns.push('Cup and Handle');
    }
    if (this.detectDoubleTop(highs, closes)) {
      bearishPatterns.push('Double Top');
    }

    return {
      bullish_patterns: bullishPatterns,
      bearish_patterns: bearishPatterns,
      consolidation_patterns: consolidationPatterns
    };
  }

  //
  // Example placeholder implementations
  //
  private detectDoubleBottom(lows: number[], closes: number[]): boolean {
    const minimaIndices = this.findLocalMinima(lows, 3);
    if (minimaIndices.length < 2) return false;
    const n = minimaIndices.length;
    const firstBottomIdx = minimaIndices[n - 2];
    const secondBottomIdx = minimaIndices[n - 1];
    const firstBottomValue = lows[firstBottomIdx];
    const secondBottomValue = lows[secondBottomIdx];
    const percentDiff = Math.abs(secondBottomValue - firstBottomValue) / firstBottomValue * 100;
    const similarBottoms = percentDiff < 3;
    const adequateSeparation = secondBottomIdx - firstBottomIdx >= 10;
    const riseAfterSecondBottom = closes[closes.length - 1] > secondBottomValue * 1.03;
    return similarBottoms && adequateSeparation && riseAfterSecondBottom;
  }

  private detectHeadAndShoulders(highs: number[], closes: number[]): boolean {
    const peakIndices = this.findLocalMaxima(highs, 3);
    if (peakIndices.length < 3) return false;
    const n = peakIndices.length;
    const peak1 = peakIndices[n - 3];
    const peak2 = peakIndices[n - 2];
    const peak3 = peakIndices[n - 1];
    const middlePeakHigher = highs[peak2] > highs[peak1] && highs[peak2] > highs[peak3];
    const p1 = highs[peak1];
    const p3 = highs[peak3];
    const shouldersSimilar = Math.abs(p3 - p1) / p1 < 0.05;
    const dropAfterRightShoulder = closes[closes.length - 1] < closes[peak3];
    return middlePeakHigher && shouldersSimilar && dropAfterRightShoulder;
  }

  private detectInverseHeadAndShoulders(lows: number[], closes: number[]): boolean {
    // Placeholder
    return false;
  }

  private detectBullFlag(closes: number[], volumes: number[]): boolean {
    // Placeholder
    return false;
  }

  private detectBearFlag(closes: number[], volumes: number[]): boolean {
    // Placeholder
    return false;
  }

  private detectRectangle(highs: number[], lows: number[]): boolean {
    // Placeholder
    return false;
  }

  private detectTriangle(highs: number[], lows: number[]): 'ascending' | 'descending' | 'symmetric' | null {
    // Placeholder
    return null;
  }

  private detectCupAndHandle(closes: number[]): boolean {
    // Placeholder
    return false;
  }

  private detectDoubleTop(highs: number[], closes: number[]): boolean {
    // Placeholder
    return false;
  }

  //
  // Helper methods
  //
  private findLocalMinima(data: number[], window = 2): number[] {
    const indices: number[] = [];
    for (let i = window; i < data.length - window; i++) {
      let isMinimum = true;
      for (let j = i - window; j <= i + window; j++) {
        if (j !== i && data[j] < data[i]) {
          isMinimum = false;
          break;
        }
      }
      if (isMinimum) indices.push(i);
    }
    return indices;
  }

  private findLocalMaxima(data: number[], window = 2): number[] {
    const indices: number[] = [];
    for (let i = window; i < data.length - window; i++) {
      let isMaximum = true;
      for (let j = i - window; j <= i + window; j++) {
        if (j !== i && data[j] > data[i]) {
          isMaximum = false;
          break;
        }
      }
      if (isMaximum) indices.push(i);
    }
    return indices;
  }
}