
  # Algorithms for Sector Rotation and Day Trading Metrics

I'll create algorithms for calculating sector rotation and day trading metrics (volatility score and technical setup score), along with the endpoints needed.

## 1. Sector Rotation Algorithm

This algorithm determines which sectors are receiving inflows and outflows based on relative performance.

### Required Endpoints:
- Tradier Real-time Market Quotes (endpoint #3)
- Tradier Historical Data (endpoint #2)
- EODHD Technical Indicators - RSI (endpoint #3) - optional

### Algorithm:

```typescript
function calculateSectorRotation(
  currentSectorData: Record<string, {price: number, change_percent: number}>,
  historicalSectorData: Record<string, Array<{date: string, close: number}>>,
  rsiData?: Record<string, number>
): {
  inflow_sectors: string[], 
  outflow_sectors: string[]
} {
  // Step 1: Calculate short/medium-term performance for each sector
  const sectorPerformance: Record<string, {
    symbol: string,
    name: string,
    daily_change: number,
    week_change: number,
    month_change: number,
    rsi?: number,
    momentum_score: number
  }> = {};
  
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
  
  // Loop through each sector ETF
  for (const symbol in currentSectorData) {
    const history = historicalSectorData[symbol] || [];
    
    // Calculate various time frame returns
    const dailyChange = currentSectorData[symbol].change_percent;
    
    // Find data points for 5 days ago (week) and 20 days ago (month)
    const currentPrice = currentSectorData[symbol].price;
    const weekAgoPrice = history.length >= 5 ? history[history.length - 5].close : currentPrice;
    const monthAgoPrice = history.length >= 20 ? history[history.length - 20].close : currentPrice;
    
    const weekChange = ((currentPrice - weekAgoPrice) / weekAgoPrice) * 100;
    const monthChange = ((currentPrice - monthAgoPrice) / monthAgoPrice) * 100;
    
    // Calculate momentum score (weighted combination of timeframes)
    // 50% weight on daily, 30% on weekly, 20% on monthly
    const momentumScore = (dailyChange * 0.5) + (weekChange * 0.3) + (monthChange * 0.2);
    
    sectorPerformance[symbol] = {
      symbol,
      name: sectorMap[symbol] || symbol,
      daily_change: dailyChange,
      week_change: weekChange,
      month_change: monthChange,
      rsi: rsiData?.[symbol],
      momentum_score: momentumScore
    };
  }
  
  // Step 2: Rank sectors by momentum score
  const rankedSectors = Object.values(sectorPerformance)
    .sort((a, b) => b.momentum_score - a.momentum_score);
  
  // Step 3: Determine inflow and outflow sectors
  // Consider top 1/3 as inflow and bottom 1/3 as outflow
  const totalSectors = rankedSectors.length;
  const inThreshold = Math.floor(totalSectors / 3);
  const outThreshold = totalSectors - inThreshold;
  
  const inflowSectors = rankedSectors
    .slice(0, inThreshold)
    .map(sector => sector.name);
    
  const outflowSectors = rankedSectors
    .slice(outThreshold)
    .map(sector => sector.name);
  
  return {
    inflow_sectors: inflowSectors,
    outflow_sectors: outflowSectors
  };
}
```

## 2. Volatility Score Algorithm

Calculates a normalized volatility score (0-1) based on multiple volatility indicators.

### Required Endpoints:
- EODHD Technical Indicators - ATR (endpoint #6)
- EODHD Technical Indicators - Bollinger Bands (endpoint #7)
- Tradier Real-time Market Quotes (endpoint #3)
- Tradier Historical Data (endpoint #2)

### Algorithm:

```typescript
function calculateVolatilityScore(
  atr: number,
  bollingerBands: {upper: number, middle: number, lower: number},
  currentPrice: number,
  historicalPrices: Array<{high: number, low: number}>,
  avgVolume: number,
  currentVolume: number
): number {
  // Step 1: Calculate Bollinger Band width as a percentage of price
  const bbWidth = (bollingerBands.upper - bollingerBands.lower) / bollingerBands.middle;
  
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
  // Weights can be adjusted based on importance
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
```

## 3. Technical Setup Score Algorithm

Calculates a normalized score (0-1) for the quality of technical trading setup.

### Required Endpoints:
- EODHD Technical Indicators - RSI (endpoint #3)
- EODHD Technical Indicators - MACD (endpoint #4)
- EODHD Technical Indicators - ADX (endpoint #8)
- EODHD Technical Indicators - Pattern Recognition (endpoint #2)
- Tradier Real-time Market Quotes (endpoint #3)
- EODHD Technical Indicators - Moving Averages (endpoint #5)

### Algorithm:

```typescript
function calculateTechnicalSetupScore(
  rsi: number,
  macd: {line: number, signal: number, histogram: number},
  adx: number,
  patterns: {bullish_patterns: string[], bearish_patterns: string[]},
  price: number,
  movingAverages: {ma_20: number, ma_50: number}
): number {
  // Step 1: Evaluate RSI setup (oversold/overbought or in sweet spot)
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
  if (macd.histogram > 0 && macd.histogram > 0) {
    macdScore = 1;
  } 
  // Histogram crossed above zero (bullish signal)
  else if (macd.histogram > 0 && macd.line > macd.signal) {
    macdScore = 0.8;
  }
  // Negative but improving (potential bullish setup)
  else if (macd.histogram < 0 && macd.histogram > 0) {
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
```

## Implementation in the Full System

To incorporate these algorithms into your financial data system:

1. For Sector Rotation:
   - Add this function to the `MarketDataService` class
   - Call it after fetching sector ETF prices and historical data
   - Use the results to populate the `sector_rotation` field in `market_conditions`

2. For Day Trading Metrics:
   - Create a new `ScoreService` class that contains both algorithms
   - Call these functions for each stock after collecting all the technical indicators
   - Use the results to populate the `volatility_score` and `technical_setup_score` fields

These algorithms use a combination of the APIs we've discussed and transform the raw data into the meaningful scores shown in your sample.json. The weights and thresholds in these algorithms can be adjusted based on backtesting and optimization for your specific trading strategy.



## How to build Options?

```ts
/**
 * Extract comprehensive options data from Tradier
*/
function extractOptionsData(tradierData) {
    if (!tradierData.options || !Array.isArray(tradierData.options) || tradierData.options.length === 0) {
      return {
        call_put_ratio: null,
        put_call_oi_ratio: null,
        volume_oi_ratio: null,
        iv_skew: null,
        unusual_activity: false,
        notable_strikes: []
      };
    }
    
    const options = tradierData.options;
    
    // Split into calls and puts
    const calls = options.filter(opt => opt.option_type === 'call');
    const puts = options.filter(opt => opt.option_type === 'put');
    
    // Calculate volume-based call/put ratio
    const totalCallVolume = calls.reduce((sum, opt) => sum + (opt.volume || 0), 0);
    const totalPutVolume = puts.reduce((sum, opt) => sum + (opt.volume || 0), 0);
    const callPutRatio = totalPutVolume > 0 ? parseFloat((totalCallVolume / totalPutVolume).toFixed(2)) : null;
    
    // Calculate open interest-based put/call ratio (different from volume ratio)
    const totalCallOI = calls.reduce((sum, opt) => sum + (opt.open_interest || 0), 0);
    const totalPutOI = puts.reduce((sum, opt) => sum + (opt.open_interest || 0), 0);
    const putCallOIRatio = totalCallOI > 0 ? parseFloat((totalPutOI / totalCallOI).toFixed(2)) : null;
    
    // Calculate overall volume to open interest ratio (indicates unusual activity)
    const totalVolume = totalCallVolume + totalPutVolume;
    const totalOI = totalCallOI + totalPutOI;
    const volumeOIRatio = totalOI > 0 ? parseFloat((totalVolume / totalOI).toFixed(2)) : null;
    
    // Calculate IV skew (difference between put and call implied volatility at similar strikes)
    // Group options by strike price
    const strikeMap = new Map();
    options.forEach(opt => {
      if (!strikeMap.has(opt.strike)) {
        strikeMap.set(opt.strike, { call: null, put: null });
      }
      if (opt.option_type === 'call') {
        strikeMap.get(opt.strike).call = opt;
      } else {
        strikeMap.get(opt.strike).put = opt;
      }
    });
    
    // Calculate IV skew at ATM strikes (where both call and put exist)
    let ivSkews = [];
    for (const [strike, pair] of strikeMap.entries()) {
      if (pair.call && pair.put && pair.call.greeks && pair.put.greeks) {
        const skew = parseFloat(pair.put.greeks.mid_iv) - parseFloat(pair.call.greeks.mid_iv);
        ivSkews.push({ strike, skew });
      }
    }
    
    // Sort by strike and take the middle one (closest to ATM)
    ivSkews.sort((a, b) => a.strike - b.strike);
    const ivSkew = ivSkews.length > 0 ? ivSkews[Math.floor(ivSkews.length / 2)].skew : null;
    
    // Find most active options by volume (notable strikes)
    const notableStrikes = [...options]
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .slice(0, 5)
      .map(opt => ({
        strike: opt.strike,
        type: opt.option_type,
        expiration: opt.expiration_date,
        volume: opt.volume || 0,
        open_interest: opt.open_interest || 0,
        implied_volatility: opt.greeks ? opt.greeks.mid_iv : null
      }));
    
    // Determine if there's unusual activity
    const unusualActivity = options.some(opt => 
      (opt.volume > 3 * opt.open_interest && opt.volume > 100) || // Volume spike
      (opt.greeks && opt.greeks.mid_iv > 1.5) // High IV
    );
    
    return {
      call_put_ratio: callPutRatio,
      put_call_oi_ratio: putCallOIRatio,
      volume_oi_ratio: volumeOIRatio,
      iv_skew: ivSkew,
      unusual_activity: unusualActivity,
      notable_strikes: notableStrikes
    };
  }
  ```
