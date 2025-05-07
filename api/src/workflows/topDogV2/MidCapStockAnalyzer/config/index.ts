// src/config/index.ts
export const config = {
    tradier: {
      apiKey: process.env.TRADIER_API_KEY || 'RMWSde4gWI5cq0vR2wJgtRvfsIwy',
      baseUrl: 'https://api.tradier.com/v1'
    },
    eodhd: {
      apiKey: process.env.EODHD_API_KEY || 'your-eodhd-api-key',
      baseUrl: 'https://eodhistoricaldata.com/api'
    },
    app: {
      stockUniverseLimit: 20, // Maximum number of stocks to include
      defaultStocks: ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META'],
      midCapRange: {
        min: 2000000000, // $2B
        max: 10000000000 // $10B
      }
    }
  };
  