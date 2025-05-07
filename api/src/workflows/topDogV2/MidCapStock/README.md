# TopDog V2 Mid-Cap Stock Analyzer

A comprehensive Node.js application that analyzes mid-cap stocks using data from multiple financial APIs. This application fetches, processes, and analyzes market data to identify trading opportunities with detailed technical analysis.

## Overview

TopDog V2 pulls data from Tradier and EODHD APIs to analyze stocks with comprehensive metrics including:

- Pre-market and current market price data
- Volume analysis and distribution
- Technical indicators (RSI, MACD, ATR, Bollinger Bands, ADX)
- Options flow analysis
- Pattern recognition
- News sentiment analysis
- Volatility and technical setup scoring

The system is designed to help identify high-quality trading setups for mid-cap stocks with significant momentum.

## Project Structure

```
src/
├── config/               # Configuration files (API keys, URLs, parameters)
│   └── index.ts          # Main configuration
├── models/               # TypeScript interfaces for data structures
│   ├── MarketData.ts     # Market-wide data interface
│   └── Stock.ts          # Individual stock data interface
├── services/
│   ├── api/              # API client services
│   │   ├── TradierApiClient.ts    # Tradier API wrapper
│   │   └── EODHDApiClient.ts      # EODHD API wrapper
│   ├── algorithms/       # Scoring and analysis algorithms
│   │   ├── ScoringService.ts       # Volatility and technical setup scoring
│   │   ├── OptionsService.ts       # Options data processing
│   │   └── SectorRotationService.ts # Sector rotation analysis
│   ├── data/             # Data processing services
│   │   ├── StockDataService.ts     # Process individual stock data
│   │   └── MarketDataService.ts    # Process market-wide data
│   └── MidCapScreenerService.ts  # Main orchestration service
├── utils/                # Helper utilities
│   └── dateUtils.ts      # Date handling utilities
├── app.ts                # Express application setup
└── index.ts              # Application entry point
```

## Key Components

### 1. Models

TypeScript interfaces that define the structure of data:

- `MarketData`: Market-wide information including indices, sector performance, and market conditions
- `Stock`: Individual stock data with price, volume, technical, and fundamental information

### 2. API Clients

Wrappers around external financial APIs:

- `TradierApiClient`: Handles fetching data from Tradier API (pre-market data, quotes, options, historical data)
- `EODHDApiClient`: Handles fetching data from EODHD API (technical indicators, news, fundamentals)

### 3. Algorithm Services

Services that implement scoring and analysis algorithms:

- `ScoringService`: Calculates volatility and technical setup scores based on various indicators
- `OptionsService`: Processes options data to extract sentiment and unusual activity
- `SectorRotationService`: Identifies sectors receiving inflows and outflows

### 4. Data Processing Services

Services that transform raw API data into structured, consistent formats:

- `StockDataService`: Processes individual stock data from multiple APIs
- `MarketDataService`: Processes market-wide data and combines individual stock analyses

### 5. Utilities

Helper functions for common operations:

- `dateUtils`: Functions for handling dates, timezones, and time windows for API calls

## Data Flow

1. `MidCapScreenerService` initiates the data gathering process
2. `MarketDataService` fetches market-wide data and coordinates stock data collection
3. `StockDataService` fetches and processes data for each individual stock
4. API clients (`TradierApiClient` and `EODHDApiClient`) make actual API calls
5. Algorithm services analyze the data to generate scores and insights
6. Processed data is structured according to the models and returned via the API endpoint

## API Integrations

### Tradier API

Used for real-time and historical market data:

- Pre-market data via timesales endpoint with session_filter=all
- Historical data for technical analysis
- Real-time quotes for current market prices
- Options chains for options analysis

### EODHD API

Used for technical indicators and fundamentals:

- Technical indicators (RSI, MACD, ATR, Bollinger Bands, ADX)
- Pattern recognition for chart patterns
- Fundamentals data for company information
- News data for sentiment analysis
- Earnings data for earnings reports

## Key Algorithms

### Volatility Score Calculation

Combines multiple volatility indicators into a normalized score (0-1):

- ATR (Average True Range) as percentage of price
- Bollinger Band width
- Historical price volatility
- Relative volume

### Technical Setup Score Calculation

Evaluates the quality of a technical trading setup based on:

- RSI (Relative Strength Index) position
- MACD (Moving Average Convergence Divergence) state
- ADX (Average Directional Index) for trend strength
- Presence of bullish/bearish patterns
- Price position relative to moving averages

### Sector Rotation Analysis

Identifies sectors receiving capital inflows and outflows based on:

- Current day performance
- Relative strength vs. market
- Recent momentum trends

### Options Flow Analysis

Analyzes options data to identify sentiment and unusual activity:

- Call/put volume ratio
- Unusual volume relative to open interest
- Implied volatility analysis

## Installation and Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your API keys:
   ```
   TRADIER_API_KEY=your_tradier_api_key
   EODHD_API_KEY=your_eodhd_api_key
   PORT=3000
   ```
4. Build the application:
   ```
   npm run build
   ```
5. Start the server:
   ```
   npm start
   ```

## Usage

The application exposes an API endpoint that returns market analysis data:

```
GET /api/market-data
```

Optional query parameters:
- `date`: The date to analyze (format: YYYY-MM-DD)
- `time`: The time of day to analyze (format: HH:MM:SS)

Example response format follows the structure defined in `sample.json`.

## Pre-Market Data Handling

Pre-market data is crucial for identifying gap plays and early momentum. The application:

1. Fetches pre-market timesales data using Tradier's API with `session_filter=all`
2. Extracts the latest pre-market price before market open
3. Calculates accumulated pre-market volume
4. Integrates this information into price and volume analysis

### Implementation Notes

The `TradierApiClient.getPreMarketData()` method:
- Defines time windows for pre-market activity (4:00 AM to 9:30 AM ET)
- Gets minute-by-minute data for the specified period
- Processes the data to extract the latest price and accumulated volume

## Limitations and Known Issues

1. **API Rate Limits**: Both Tradier and EODHD have rate limits that may affect the number of stocks that can be analyzed simultaneously.

2. **Intraday VWAP Calculation**: VWAP calculation requires minute-by-minute data which may not be completely accurate with the current implementation.

3. **Pattern Recognition Quality**: The quality of pattern recognition depends on the EODHD implementation.

4. **Pre-market Data Availability**: Pre-market data may not be available for all stocks, especially those with lower liquidity.

5. **Stock Universe Selection**: The current implementation uses a static list of mid-cap stocks. A more sophisticated screening mechanism could be implemented.

## Future Enhancements

1. Add database integration for historical data storage and backtesting
2. Implement more sophisticated stock screening algorithms
3. Add machine learning models for pattern recognition and predictive analytics
4. Create a frontend dashboard for visualizing the analysis
5. Add real-time WebSocket-based data updates
6. Implement trading signals based on analysis results

## Contributing

Contributions are welcome! Please follow the standard GitHub workflow:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.