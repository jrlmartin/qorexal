// src/services/algorithms/SectorRotationService.ts
export class SectorRotationService {
  calculateSectorRotation(
    currentSectorData: Record<string, number>,
    historicalSectorData?: Record<string, Array<{date: string, close: number}>>
  ): {
    inflow_sectors: string[], 
    outflow_sectors: string[]
  } {
    // Create sector mapping 
    const sectorMap: Record<string, string> = {
      'XLK': 'Technology',
      'XLY': 'Consumer Discretionary',
      'XLF': 'Financials',
      'XLV': 'Healthcare',
      'XLE': 'Energy',
      'XLI': 'Industrials',
      'XLP': 'Consumer Staples',
      'XLU': 'Utilities',
      'XLB': 'Materials',
      'XLRE': 'Real Estate',
      'XLC': 'Communication Services'
    };
    
    // Sort sectors by performance
    const sortedSectors = Object.entries(currentSectorData)
      .sort(([, a], [, b]) => b - a);
    
    // Get top and bottom sectors
    const topSectors = sortedSectors.slice(0, Math.max(2, Math.floor(sortedSectors.length / 3)));
    const bottomSectors = sortedSectors.slice(-Math.max(2, Math.floor(sortedSectors.length / 3)));
    
    return {
      inflow_sectors: topSectors.map(([ticker]) => sectorMap[ticker] || ticker),
      outflow_sectors: bottomSectors.map(([ticker]) => sectorMap[ticker] || ticker)
    };
  }
}