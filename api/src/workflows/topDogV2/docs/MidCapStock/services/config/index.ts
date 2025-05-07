// src/config/index.ts
export const config = {
    fmp: {
      apiKey: process.env.FMP_API_KEY || 'your-fmp-api-key',
      baseUrl: 'https://financialmodelingprep.com/api/v3'
    },
    tradier: {
      apiKey: process.env.TRADIER_API_KEY || 'your-tradier-api-key',
      baseUrl: 'https://api.tradier.com/v1'
    },
    eodhd: {
      apiKey: process.env.EODHD_API_KEY || 'your-eodhd-api-key',
      baseUrl: 'https://eodhistoricaldata.com/api'
    },
    app: {
      port: parseInt(process.env.PORT || '3000', 10),
      stockUniverseLimit: 20, // Maximum number of stocks to include
      defaultStocks: ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META'],
      midCapRange: {
        min: 2000000000, // $2B
        max: 10000000000 // $10B
      }
    }
  };
