 // src/services/MidCapScreenerService.ts
 import { MarketDataService } from './data/MarketDataService';
 import { EODHDApiClient } from './api/EODHDApiClient';
 import { config } from '../config';
 import { getLatestTradingDay, getMarketOpenTime } from '../utils/dateUtils';
 
 export class MidCapScreenerService {
   private marketDataService: MarketDataService;
   private eodhdClient: EODHDApiClient;
   
   constructor() {
     this.marketDataService = new MarketDataService();
     this.eodhdClient = new EODHDApiClient();
   }
   
   // Find mid-cap stocks that match criteria
   async findMidCapStocks(limit: number = 10): Promise<string[]> {
     try {
       // This is a simplified approach - in reality, you'd likely have a database
       // of pre-filtered stocks or use a more sophisticated screening API
       
       // For demo purposes, return a static list of mid-cap stocks
       return [
         'AMZN', // Amazon
         'NVDA', // Nvidia
         'AAPL', // Apple
         'MSFT', // Microsoft
         'GOOG', // Google
         'TSLA', // Tesla
         'TSM', // Taiwan Semiconductor
         'QCOM', // Qualcomm
         
        //  'PINS', // Pinterest
        //  'SNAP', // Snap
        //  'ETSY', // Etsy
        //  'RBLX', // Roblox
        //  'ZS',   // Zscaler
        //  'DDOG', // Datadog
        //  'CRWD', // CrowdStrike
        //  'SNOW', // Snowflake
        //  'NET'   // Cloudflare
       ].slice(0, limit);
     } catch (error) {
       console.error('Error finding mid-cap stocks:', error);
       return config.app.defaultStocks.slice(0, limit);
     }
   }
   
   // Main method to run the full analysis
   async runAnalysis(date?: string, time?: string): Promise<any> {
     // Use current date if not provided
     const targetDate = date || getLatestTradingDay();
     const marketTime = time || getMarketOpenTime();
     
     // Step 1: Find mid-cap stocks to analyze
     const stockTickers = await this.findMidCapStocks(config.app.stockUniverseLimit);
     
     // Step 2: Get full market data including these stocks
     const marketData = await this.marketDataService.getMarketData(
       targetDate, 
       marketTime, 
       stockTickers
     );
     
     return [marketData]; // Wrapped in array to match sample.json format
   }
 }