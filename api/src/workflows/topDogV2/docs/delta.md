I'll search for information about Tradier's pre-market data endpoints.

Let me search for the specific Tradier endpoint that provides pre-market data.

Let me fetch information about Tradier's specific endpoint for pre-market data:

Now let me search for information specifically about pre-market data in Tradier's response fields:

Let me also check the streaming documentation since that might contain pre-market data:

Based on my research, I can provide you with information about replacing the pre-market data functionality using Tradier API instead of FMP. Here's what I found:

## Tradier API for Pre-Market Data

Tradier offers pre-market data, but not through a dedicated "pre-market" endpoint. Instead, you can:

1. **Use their standard Quotes endpoint:** 
   ```
   GET https://api.tradier.com/v1/markets/quotes?symbols=AAPL
   ```

2. **Use their Streaming API for more accurate pre-market data:**
   The streaming trade event "has more accurate information during the pre/post market sessions." This would be the recommended approach for real-time pre-market data.

3. **For Time and Sales data with pre-market sessions:**
   When using the time and sales endpoint, you can include a parameter called `session_filter` which can be set to `all` to include pre-market trading.

## Implementation in Your Code

Here's how you would replace the FMP pre-market data with Tradier:

```typescript
// In getTradierData function
async function getTradierData(ticker: string): Promise<TradierData> {
  try {
    const data: TradierData = {};
    
    // 1. Get quote data (includes current data from whatever session is active)
    const quoteResponse = await axios.get(`${TRADIER_BASE_URL}/markets/quotes`, {
      params: { symbols: ticker },
      headers: TRADIER_HEADERS
    });
    data.quote = quoteResponse.data.quotes.quote;
    
    // 2. For specific pre-market data, you could use time and sales with session filter
    const preMarketData = await axios.get(`${TRADIER_BASE_URL}/markets/timesales`, {
      params: { 
        symbol: ticker,
        interval: '1min',
        start: getTodayPreMarketStart(), // Helper function to get today's pre-market time window
        end: getTodayMarketOpen(),       // Helper function to get today's market open time
        session_filter: 'all'            // Important: Include all sessions
      },
      headers: TRADIER_HEADERS
    });
    
    // Process pre-market data if available
    if (preMarketData.data && preMarketData.data.series && preMarketData.data.series.data) {
      // Extract latest pre-market price/volume from the time series data
      const preMarketPoints = preMarketData.data.series.data;
      if (preMarketPoints && preMarketPoints.length > 0) {
        // Get the most recent pre-market data point
        const latestPoint = preMarketPoints[preMarketPoints.length - 1];
        
        // Add to data object
        data.preMarket = {
          price: latestPoint.price,
          volume: latestPoint.volume || 0
        };
      }
    }
    
    // Rest of your existing code...
    
    return data;
  } catch (error) {
    console.error(`Error fetching Tradier data for ${ticker}:`, (error as Error).message);
    return {};
  }
}

// Helper functions for getting time windows
function getTodayPreMarketStart(): string {
  const today = new Date();
  today.setHours(8, 0, 0, 0); // Pre-market typically starts at 8:00 AM ET
  return today.toISOString().split('T')[0] + ' 08:00';
}

function getTodayMarketOpen(): string {
  const today = new Date();
  today.setHours(9, 30, 0, 0); // Regular market opens at 9:30 AM ET
  return today.toISOString().split('T')[0] + ' 09:30';
}
```

Then in the `extractPriceData` and `extractVolumeData` functions, you'd use this data instead of FMP:

```typescript
// In extractPriceData function
pre_market: tradierData.preMarket?.price || null,

// In extractVolumeData function
pre_market: tradierData.preMarket?.volume || null,
```

This approach allows you to get pre-market data from Tradier instead of FMP, with the benefit that Tradier offers pre-market trading from 8:00 a.m. to 9:30 a.m. ET and post-market from 4:00 p.m. to 5:00 p.m. ET.

For even more accurate pre-market data, consider using the streaming API mentioned earlier, but that would require a different implementation approach with websockets or HTTP streaming.