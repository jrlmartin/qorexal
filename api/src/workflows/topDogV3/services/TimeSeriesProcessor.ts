/**
 * Service for processing time-series data (like time-sales) into candles
 * and analyzing intraday volume distribution, opening gap metrics, etc.
 */

export interface IntradayCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
}

export class TimeSeriesProcessor {
  /**
   * Convert raw time-sales data to a list of interval-based candlesticks
   */
  processTimeSalesToCandles(
    timeSalesData: any[],
    interval: '1min' | '5min' | '15min' = '1min'
  ): IntradayCandle[] {
    if (!timeSalesData || timeSalesData.length === 0) return [];

    const sortedData = [...timeSalesData].sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    const candles: IntradayCandle[] = [];
    let currentCandle: any = null;
    let currentIntervalStart: Date | null = null;
    const intervalMs = interval === '1min' ? 60000 : interval === '5min' ? 300000 : 900000;

    for (const dataPoint of sortedData) {
      const timestamp = new Date(dataPoint.time);
      if (!currentIntervalStart || timestamp.getTime() >= currentIntervalStart.getTime() + intervalMs) {
        if (currentCandle) {
          candles.push(this.finalizeCandle(currentCandle));
        }
        currentIntervalStart = new Date(Math.floor(timestamp.getTime() / intervalMs) * intervalMs);
        currentCandle = {
          time: currentIntervalStart.toISOString(),
          open: dataPoint.price,
          high: dataPoint.price,
          low: dataPoint.price,
          close: dataPoint.price,
          volume: dataPoint.volume || 0,
          volumePrice: (dataPoint.price * (dataPoint.volume || 0)),
          count: 1
        };
      } else {
        currentCandle.high = Math.max(currentCandle.high, dataPoint.price);
        currentCandle.low = Math.min(currentCandle.low, dataPoint.price);
        currentCandle.close = dataPoint.price;
        currentCandle.volume += (dataPoint.volume || 0);
        currentCandle.volumePrice += (dataPoint.price * (dataPoint.volume || 0));
        currentCandle.count++;
      }
    }
    if (currentCandle) {
      candles.push(this.finalizeCandle(currentCandle));
    }
    return candles;
  }

  /**
   * Analyze first-hour metrics (9:30-10:30 AM typically)
   */
  calculateFirstHourMetrics(candles: IntradayCandle[]): {
    highPrice: number;
    lowPrice: number;
    volume: number;
    volumePercentage: number;
    breakout: boolean;
    vwap: number;
    priceRange: number;
    volatility: number;
    momentum: number;
    opening15MinVolume: number;
    openingHalfHourVolume: number;
    timeSegments: { time: string; volume: number; priceChange: number }[];
  } {
    if (!candles || candles.length === 0) {
      return {
        highPrice: 0,
        lowPrice: 0,
        volume: 0,
        volumePercentage: 0,
        breakout: false,
        vwap: 0,
        priceRange: 0,
        volatility: 0,
        momentum: 0,
        opening15MinVolume: 0,
        openingHalfHourVolume: 0,
        timeSegments: []
      };
    }

    const marketOpen = new Date(candles[0].time);
    const firstHourEnd = new Date(marketOpen);
    firstHourEnd.setHours(marketOpen.getHours() + 1);

    const first15MinEnd = new Date(marketOpen);
    first15MinEnd.setMinutes(marketOpen.getMinutes() + 15);
    const first30MinEnd = new Date(marketOpen);
    first30MinEnd.setMinutes(marketOpen.getMinutes() + 30);

    const firstHourCandles = candles.filter(c => new Date(c.time) < firstHourEnd);
    const first15MinCandles = candles.filter(c => new Date(c.time) < first15MinEnd);
    const first30MinCandles = candles.filter(c => new Date(c.time) < first30MinEnd);

    let highPrice = -Infinity;
    let lowPrice = Infinity;
    let firstHourVolume = 0;
    let firstHourVolumePrice = 0;
    let opening15MinVolume = 0;
    let openingHalfHourVolume = 0;
    let openPrice = firstHourCandles.length > 0 ? firstHourCandles[0].open : 0;
    let closePrice = firstHourCandles.length > 0 ? firstHourCandles[firstHourCandles.length - 1].close : 0;

    for (const candle of firstHourCandles) {
      highPrice = Math.max(highPrice, candle.high);
      lowPrice = Math.min(lowPrice, candle.low);
      firstHourVolume += candle.volume;
      firstHourVolumePrice += (candle.volume * candle.vwap);
    }
    for (const candle of first15MinCandles) {
      opening15MinVolume += candle.volume;
    }
    for (const candle of first30MinCandles) {
      openingHalfHourVolume += candle.volume;
    }

    if (highPrice === -Infinity) {
      highPrice = 0;
      lowPrice = 0;
    }
    const totalVolume = candles.reduce((sum, c) => sum + c.volume, 0);
    const firstHourVwap = firstHourVolume > 0 ? (firstHourVolumePrice / firstHourVolume) : 0;
    const priceRange = (highPrice > 0 && lowPrice > 0)
      ? ((highPrice - lowPrice) / lowPrice) * 100 : 0;
    let volatility = 0;
    if (firstHourCandles.length > 1) {
      const closes = firstHourCandles.map(c => c.close);
      const avg = closes.reduce((sum, c) => sum + c, 0) / closes.length;
      const variance = closes.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / closes.length;
      volatility = Math.sqrt(variance) / avg * 100;
    }
    const momentum = (openPrice > 0) ? ((closePrice - openPrice) / openPrice) * 100 : 0;

    const timeSegments: { time: string; volume: number; priceChange: number }[] = [];
    let segmentStart = new Date(marketOpen);
    for (let i = 0; i < 4; i++) {
      const segmentEnd = new Date(segmentStart);
      segmentEnd.setMinutes(segmentStart.getMinutes() + 15);
      const segmentCandles = firstHourCandles.filter(c => {
        const cTime = new Date(c.time);
        return cTime >= segmentStart && cTime < segmentEnd;
      });
      if (segmentCandles.length > 0) {
        const segVol = segmentCandles.reduce((sum, c) => sum + c.volume, 0);
        const segOpen = segmentCandles[0].open;
        const segClose = segmentCandles[segmentCandles.length - 1].close;
        const segPriceChange = segOpen > 0 ? ((segClose - segOpen) / segOpen) * 100 : 0;
        timeSegments.push({
          time: segmentStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          volume: segVol,
          priceChange: parseFloat(segPriceChange.toFixed(2))
        });
      }
      segmentStart = segmentEnd;
    }

    const currentPrice = candles[candles.length - 1].close;
    const breakout = currentPrice > highPrice;

    return {
      highPrice,
      lowPrice,
      volume: firstHourVolume,
      volumePercentage: totalVolume > 0 ? (firstHourVolume / totalVolume) * 100 : 0,
      breakout,
      vwap: firstHourVwap,
      priceRange: parseFloat(priceRange.toFixed(2)),
      volatility: parseFloat(volatility.toFixed(2)),
      momentum: parseFloat(momentum.toFixed(2)),
      opening15MinVolume,
      openingHalfHourVolume,
      timeSegments
    };
  }

  /**
   * Analyze volume distribution for the entire trading day
   */
  calculateVolumeDistribution(candles: IntradayCandle[]): {
    firstHourVolume: number;
    middayVolume: number;
    lastHourVolume: number;
    volumeProfile: { timeSlice: string; volume: number; avgPrice: number }[];
  } {
    if (!candles || candles.length === 0) {
      return {
        firstHourVolume: 0,
        middayVolume: 0,
        lastHourVolume: 0,
        volumeProfile: []
      };
    }
    const marketOpen = new Date(candles[0].time);
    const marketClose = new Date(candles[candles.length - 1].time);
    const firstHourEnd = new Date(marketOpen);
    firstHourEnd.setHours(marketOpen.getHours() + 1);
    const lastHourStart = new Date(marketClose);
    lastHourStart.setHours(marketClose.getHours() - 1);

    let firstHourVolume = 0;
    let middayVolume = 0;
    let lastHourVolume = 0;
    const volumeProfile: { timeSlice: string; volume: number; avgPrice: number }[] = [];

    let currentSliceStart = new Date(marketOpen);
    let currentSliceVolume = 0;
    let currentSliceVolumePrice = 0;

    for (const candle of candles) {
      const candleTime = new Date(candle.time);
      if (candleTime < firstHourEnd) {
        firstHourVolume += candle.volume;
      } else if (candleTime >= lastHourStart) {
        lastHourVolume += candle.volume;
      } else {
        middayVolume += candle.volume;
      }

      if (candleTime.getTime() >= currentSliceStart.getTime() + 1800000) { // 30 min
        if (currentSliceVolume > 0) {
          volumeProfile.push({
            timeSlice: currentSliceStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            volume: currentSliceVolume,
            avgPrice: currentSliceVolumePrice / currentSliceVolume
          });
        }
        currentSliceStart = new Date(Math.floor(candleTime.getTime() / 1800000) * 1800000);
        currentSliceVolume = candle.volume;
        currentSliceVolumePrice = candle.volume * candle.vwap;
      } else {
        currentSliceVolume += candle.volume;
        currentSliceVolumePrice += candle.volume * candle.vwap;
      }
    }
    if (currentSliceVolume > 0) {
      volumeProfile.push({
        timeSlice: currentSliceStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        volume: currentSliceVolume,
        avgPrice: currentSliceVolumePrice / currentSliceVolume
      });
    }

    return {
      firstHourVolume,
      middayVolume,
      lastHourVolume,
      volumeProfile
    };
  }

  /**
   * Calculate opening gap metrics
   */
  calculateOpeningGapMetrics(previousClose: number, openPrice: number): {
    openingGapPercent: number;
    gapDirection: 'up' | 'down' | 'flat';
  } {
    if (!previousClose || !openPrice) {
      return {
        openingGapPercent: 0,
        gapDirection: 'flat'
      };
    }
    const gapPercent = ((openPrice - previousClose) / previousClose) * 100;
    let direction: 'up' | 'down' | 'flat';
    if (gapPercent > 0.5) {
      direction = 'up';
    } else if (gapPercent < -0.5) {
      direction = 'down';
    } else {
      direction = 'flat';
    }
    return {
      openingGapPercent: parseFloat(gapPercent.toFixed(2)),
      gapDirection: direction
    };
  }

  private finalizeCandle(candle: any): IntradayCandle {
    const vwap = candle.volume > 0 ? candle.volumePrice / candle.volume : candle.close;
    return {
      time: candle.time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      vwap: parseFloat(vwap.toFixed(2))
    };
  }
}