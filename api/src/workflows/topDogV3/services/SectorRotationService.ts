/**
 * Service for analyzing sector rotation based on current performance and short-term momentum.
 */

export class SectorRotationService {
  /**
   * Analyze sector rotation based on performance
   */
  calculateSectorRotation(
    currentSectorData: Record<string, number>,
    historicalSectorData?: Record<string, Array<{ date: string; close: number }>>
  ): {
    inflow_sectors: string[];
    outflow_sectors: string[];
  } {
    const sectorMapping: Record<string, string> = {
      'XLK': 'Technology',
      'XLF': 'Financials',
      'XLE': 'Energy',
      'XLV': 'Healthcare',
      'XLY': 'Consumer Discretionary',
      'XLP': 'Consumer Staples',
      'XLI': 'Industrials',
      'XLB': 'Materials',
      'XLU': 'Utilities',
      'XLRE': 'Real Estate'
    };

    const sectorsWithPerformance = Object.entries(currentSectorData).map(([symbol, performance]) => ({
      symbol,
      sector: sectorMapping[symbol] || symbol,
      performance
    }));

    sectorsWithPerformance.sort((a, b) => b.performance - a.performance);

    if (historicalSectorData) {
      for (const sectorInfo of sectorsWithPerformance) {
        const hData = historicalSectorData[sectorInfo.symbol];
        if (hData && hData.length >= 5) {
          const oldest = hData[0].close;
          const newest = hData[hData.length - 1].close;
          const momentum = ((newest - oldest) / oldest) * 100;
          sectorInfo['momentum'] = momentum;
        }
      }
      sectorsWithPerformance.sort((a, b) => {
        const aCombined = a.performance + (a['momentum'] || 0);
        const bCombined = b.performance + (b['momentum'] || 0);
        return bCombined - aCombined;
      });
    }

    const inflowSectors = sectorsWithPerformance.slice(0, 3).map(s => s.sector);
    const outflowSectors = sectorsWithPerformance.slice(-3).map(s => s.sector);

    return {
      inflow_sectors: inflowSectors,
      outflow_sectors: outflowSectors
    };
  }
}