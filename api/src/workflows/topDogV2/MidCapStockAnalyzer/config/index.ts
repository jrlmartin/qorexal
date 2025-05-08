// src/config/index.ts
export const config = {
    tradier: {
      apiKey:  'RMWSde4gWI5cq0vR2wJgtRvfsIwy',
      baseUrl: 'https://api.tradier.com/v1'
    },
    eodhd: {
      apiKey: '681bf3941affe4.50760934', // You need to provide a valid EODHD API key
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
  