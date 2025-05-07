// src/services/algorithms/OptionsService.ts
export class OptionsService {
  // Extract options data using algorithm from edge-cases.md
  extractOptionsData(optionsData: any[]): any {
    if (!optionsData || !Array.isArray(optionsData) || optionsData.length === 0) {
      return {
        call_put_ratio: null,
        unusual_activity: false,
        options_flow: { bullish_flow_percent: 50 }
      };
    }
    
    // Split into calls and puts
    const calls = optionsData.filter(opt => opt.option_type === 'call');
    const puts = optionsData.filter(opt => opt.option_type === 'put');
    
    // Calculate volume-based call/put ratio
    const totalCallVolume = calls.reduce((sum, opt) => sum + (opt.volume || 0), 0);
    const totalPutVolume = puts.reduce((sum, opt) => sum + (opt.volume || 0), 0);
    const callPutRatio = totalPutVolume > 0 ? parseFloat((totalCallVolume / totalPutVolume).toFixed(2)) : null;
    
    // Calculate bullish flow percent based on premium
    const callPremium = calls.reduce((sum, opt) => {
      const premium = (opt.volume || 0) * (opt.last || 0) * 100; // Each contract is for 100 shares
      return sum + premium;
    }, 0);
    
    const putPremium = puts.reduce((sum, opt) => {
      const premium = (opt.volume || 0) * (opt.last || 0) * 100;
      return sum + premium;
    }, 0);
    
    const totalPremium = callPremium + putPremium;
    const bullishFlowPercent = totalPremium > 0 
      ? parseFloat(((callPremium / totalPremium) * 100).toFixed(0)) 
      : 50;
    
    // Determine if there's unusual activity
    const unusualActivity = optionsData.some(opt => 
      (opt.volume > 3 * (opt.open_interest || 1) && opt.volume > 100) || // Volume spike
      (opt.greeks && opt.greeks.mid_iv > 1.5) // High IV
    );
    
    return {
      call_put_ratio: callPutRatio || 1,
      unusual_activity: unusualActivity,
      options_flow: {
        bullish_flow_percent: bullishFlowPercent
      }
    };
  }
}

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