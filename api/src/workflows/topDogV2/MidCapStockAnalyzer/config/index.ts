// src/config/index.ts
export const config = {
    tradier: {
      apiKey: process.env.TRADIER_API_KEY || 'your-tradier-api-key',
      baseUrl: 'https://api.tradier.com/v1'
    },
    eodhd: {
      apiKey: process.env.EODHD_API_KEY || 'your-eodhd-api-key',
      baseUrl: 'https://eodhistoricaldata.com/api'
    },
  };
  