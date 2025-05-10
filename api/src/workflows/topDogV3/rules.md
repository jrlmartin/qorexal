Rules:
1. Rule: Prefer Optional Chaining for Deep Property Access 
    - Avoid  response.data.quotes && response.data.quotes.quote and instead do response?.data?.quotes?.quote

2. There can never be undefined values coming back from the api requests, always check using value check defined function.

```ts
// Helper function to check for undefined or null values
function vcd<T>(value: T | undefined | null, fieldName: string): T {
  if (value === undefined) {
    throw new Error(`Critical data missing: ${fieldName}`);
  }
  return value;
}
```

3. Date & Timezone Rules
   - Always use moment-timezone library for date and time.
   - EODHD API Service uses UTC timezone
   - Tradoer API uses EST timezone 
   - Benzinga uses EST timezone
   - The NodeJS script runs locally on a machine that is dependent on local time zone.
