/**
 * Service for engineering features for machine learning model consumption.
 */

import {
  EnhancedPriceData,
  EnhancedTechnicalIndicators,
  EnhancedVolumeData,
  MarketContext,
  StockAnalysis,
  EnhancedOptionsData
} from '../models/DayTradingAnalysis';

export class FeatureEngineeringService {
  generateTechnicalFeatures(
    priceData: EnhancedPriceData,
    technicals: EnhancedTechnicalIndicators
  ): Record<string, number> {
    const features: Record<string, number> = {};

    // Momentum
    features['rsi'] = technicals.rsi;
    features['rsi_slope'] = technicals.rsiSlope;
    features['macd_hist'] = technicals.macd.histogram;
    features['macd_hist_dir'] = technicals.macd.histogramDirection === 'up' ? 1 :
      technicals.macd.histogramDirection === 'down' ? -1 : 0;

    // Volatility
    features['bb_width'] = technicals.bollingerBands.width;
    features['percent_b'] = technicals.bollingerBands.percentB;
    features['atr_percent'] = technicals.atrPercent;

    // Trend
    features['adx'] = technicals.adx;
    features['above_vwap'] = priceData.current > priceData.intraday.vwap ? 1 : 0;
    features['above_ma20'] = priceData.current > (priceData.movingAverages['ma20'] || 0) ? 1 : 0;
    features['above_ma50'] = priceData.current > (priceData.movingAverages['ma50'] || 0) ? 1 : 0;

    // Price location
    features['pct_from_high'] = technicals.priceLocation.percentFromHigh;
    features['pct_from_low'] = technicals.priceLocation.percentFromLow;

    // Gap
    features['gap_percent'] = priceData.gapMetrics.openingGapPercent;
    features['gap_direction'] = priceData.gapMetrics.gapDirection === 'up' ? 1 :
      priceData.gapMetrics.gapDirection === 'down' ? -1 : 0;

    // Pattern strength
    features['pattern_strength'] = technicals.patternRecognition.patternStrength;
    features['bullish_patterns'] = technicals.patternRecognition.bullishPatterns.length;
    features['bearish_patterns'] = technicals.patternRecognition.bearishPatterns.length;

    return features;
  }

  generateVolumeFeatures(
    volumeData: EnhancedVolumeData,
    priceData: EnhancedPriceData
  ): Record<string, number> {
    const features: Record<string, number> = {};
    features['rel_volume'] = volumeData.relativeVolume;
    features['first_hour_vol_pct'] = volumeData.distribution.firstHourPercent;
    features['last_hour_vol_pct'] = volumeData.distribution.lastHourPercent;

    let volumeAcceleration = 0;
    if (priceData.intraday.candles.length >= 3) {
      const recentCandles = priceData.intraday.candles.slice(-3);
      const olderVolume = recentCandles[0].volume;
      const newerVolume = recentCandles[2].volume;
      volumeAcceleration = ((newerVolume - olderVolume) / olderVolume) * 100;
    }
    features['volume_acceleration'] = volumeAcceleration;

    let priceVolumeDivergence = 0;
    if (priceData.intraday.candles.length >= 3) {
      const recentCandles = priceData.intraday.candles.slice(-3);
      const priceTrend = recentCandles[2].close > recentCandles[0].close ? 1 : -1;
      const volumeTrend = recentCandles[2].volume > recentCandles[0].volume ? 1 : -1;
      priceVolumeDivergence = priceTrend !== volumeTrend ? 1 : 0;
    }
    features['price_volume_divergence'] = priceVolumeDivergence;

    return features;
  }

  generateMarketContextFeatures(
    marketContext: MarketContext,
    stockSector: string
  ): Record<string, number> {
    const features: Record<string, number> = {};

    features['spy_change'] = marketContext.indices['SPY']?.changePercent || 0;
    features['qqq_change'] = marketContext.indices['QQQ']?.changePercent || 0;
    features['iwm_change'] = marketContext.indices['IWM']?.changePercent || 0;
    features['vix'] = marketContext.vix;
    features['put_call_ratio'] = marketContext.putCallRatio;

    // Attempt to find sector performance
    let sectorPerf = 0;
    for (const [etf, perf] of Object.entries(marketContext.sectorPerformance)) {
      // naive approach: we match the exact sector name in sectorRotation
      // or skip if not found
      // In a real system, we'd map the sector name to the ETF properly
    }
    features['sector_performance'] = sectorPerf; // simplified

    const sectorInflow = marketContext.sectorRotation.inflowSectors.includes(stockSector) ? 1 : 0;
    const sectorOutflow = marketContext.sectorRotation.outflowSectors.includes(stockSector) ? 1 : 0;
    features['sector_inflow'] = sectorInflow;
    features['sector_outflow'] = sectorOutflow;
    features['market_open'] = marketContext.marketStatus === 'open' ? 1 : 0;

    return features;
  }

  generateOptionsFeatures(optionsData: EnhancedOptionsData): Record<string, number> {
    const features: Record<string, number> = {};
    features['call_put_ratio'] = optionsData.callPutRatio;
    features['implied_volatility'] = optionsData.impliedVolatility;
    features['iv_change'] = optionsData.impliedVolatilityChange;
    features['unusual_activity'] = optionsData.unusualActivity ? 1 : 0;
    features['bullish_flow_pct'] = optionsData.optionsFlow.bullishFlowPercent;
    features['bearish_flow_pct'] = optionsData.optionsFlow.bearishFlowPercent;
    features['vol_oi_ratio'] = optionsData.optionsFlow.volumeOpenInterestRatio;
    return features;
  }

  /**
   * Build a feature matrix for ML modeling
   */
  buildFeatureMatrix(
    stock: StockAnalysis,
    marketContext: MarketContext
  ): number[][] {
    const technicalFeatures = this.generateTechnicalFeatures(stock.priceData, stock.technicalIndicators);
    const volumeFeatures = this.generateVolumeFeatures(stock.volumeData, stock.priceData);
    const marketFeatures = this.generateMarketContextFeatures(marketContext, stock.companyInfo.sector);
    const optionsFeatures = this.generateOptionsFeatures(stock.optionsData);

    const normalized = this.normalizeFeatures({
      ...technicalFeatures,
      ...volumeFeatures,
      ...marketFeatures,
      ...optionsFeatures
    });

    const timeseriesFeatures: number[][] = [];
    const candles = stock.priceData.intraday.candles;
    const lookback = Math.min(5, candles.length);
    for (let i = candles.length - lookback; i < candles.length; i++) {
      const c = candles[i];
      const candleFeatures = [
        c.open / stock.priceData.previousClose - 1,
        c.high / stock.priceData.previousClose - 1,
        c.low / stock.priceData.previousClose - 1,
        c.close / stock.priceData.previousClose - 1,
        c.volume / stock.volumeData.avg10d,
        (c.vwap / stock.priceData.previousClose) - 1
      ];
      timeseriesFeatures.push(candleFeatures);
    }

    return [
      Object.values(normalized),
      ...timeseriesFeatures
    ];
  }

  private normalizeFeatures(features: Record<string, number>): Record<string, number> {
    const normalized: Record<string, number> = {};
    const normalizers: Record<string, (val: number) => number> = {
      rsi: (val) => val / 100,
      sector_performance: (val) => Math.max(-10, Math.min(10, val)) / 10,
      gap_percent: (val) => Math.max(-10, Math.min(10, val)) / 10,
      vix: (val) => {
        if (val < 10) return 0;
        if (val > 40) return 1;
        return (val - 10) / 30;
      },
      put_call_ratio: (val) => {
        if (val < 0.5) return 0;
        if (val > 2) return 1;
        return (val - 0.5) / 1.5;
      },
      adx: (val) => val / 100,
      rel_volume: (val) => {
        if (val < 0.5) return 0;
        if (val > 3) return 1;
        return (val - 0.5) / 2.5;
      }
    };

    for (const [key, value] of Object.entries(features)) {
      if (normalizers[key]) {
        normalized[key] = normalizers[key](value);
      } else {
        normalized[key] = Math.max(-1, Math.min(1, value));
      }
    }
    return normalized;
  }
}