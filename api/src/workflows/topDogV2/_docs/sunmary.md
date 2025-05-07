1. Get benzinga news for 30 minute interval 
2. Extract all tickers from stocks array within each article, next create a unique list of stocks
3. Filter out only mid cap stocks and save to db
4. Feed into buildStockAnaluysis to generate full anlytics json
   - within buildStockAnaluysis call Benzinga again with full range of stock news from start of day including premarket


