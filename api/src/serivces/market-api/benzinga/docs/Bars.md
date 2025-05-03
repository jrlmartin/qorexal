Thought for a couple of seconds


**GET /api/v2/bars**
*Retrieve historical bar (candlestick) data for one or more symbols*

```http
GET https://api.benzinga.com/api/v2/bars
    ?symbols=AAPL,MSFT
    &from=2025-01-01
    &to=2025-01-31
    &interval=1D
```

---

### Authorization

| Name  | In    | Type   | Required | Description           |
| ----- | ----- | ------ | -------- | --------------------- |
| token | query | string | Yes      | Your API access token |

---

### Headers

| Name   | In     | Type                                    | Required                         | Description                         |
| ------ | ------ | --------------------------------------- | -------------------------------- | ----------------------------------- |
| accept | header | `application/json` or `application/xml` | No (default: `application/json`) | Response format (XML is deprecated) |

---

### Query Parameters

| Name     | In    | Type   | Required | Description                                                                                                                                               |
| -------- | ----- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbols  | query | string | Yes      | Comma-separated ticker symbols (e.g. `AAPL,MSFT`)                                                                                                         |
| from     | query | string | No       | Start of the date range. Supports ISO date (`YYYY-MM-DD`) or relative periods: `YTD`, `1M`/`1MONTH`, `1D`/`1DAY` etc. (`YTD` → first trading day of year) |
| to       | query | string | No       | End of the date range. ISO date (`YYYY-MM-DD`)                                                                                                            |
| interval | query | string | No       | Candle size. E.g. `1D` (daily), `1W`, `1H`, `5M`, `15M`, `30M`. Defaults to 5-minute bars for ≤5 days, daily bars for longer spans.                       |

---

### Example (JavaScript)

```javascript
const params = new URLSearchParams({
  symbols: 'AAPL,MSFT',
  from:    '2025-01-01',
  to:      '2025-01-31',
  interval:'1D',
  token:   'YOUR_API_TOKEN'
});

fetch(`https://api.benzinga.com/api/v2/bars?${params}`, { method: 'GET' })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

### Response

**Status**: `200 OK`
**Content-Type**: `application/json`

```json
[
  {
    "symbol":   "AAPL",
    "interval": 1,
    "candles": [
      {
        "open":     172.15,
        "high":     174.02,
        "low":      171.80,
        "close":    173.50,
        "volume":   34215600,
        "time":     1704067200000,
        "dateTime": "2025-01-31T00:00:00.000-05:00"
      },
      { … }
    ]
  },
  {
    "symbol":   "MSFT",
    "interval": 1,
    "candles": [ … ]
  }
]
```

| Field        | Type      | Description                                                                                       |
| ------------ | --------- | ------------------------------------------------------------------------------------------------- |
| `symbol`     | string    | The ticker symbol                                                                                 |
| `interval`   | integer   | Candle size in units defined by your `interval` param (e.g. `1` = daily if you passed `1D`)       |
| `candles`    | object\[] | Array of bar objects                                                                              |
|   `open`     | float     | Opening price of the period                                                                       |
|   `high`     | float     | Highest price of the period                                                                       |
|   `low`      | float     | Lowest price of the period                                                                        |
|   `close`    | float     | Closing price of the period (only after market close)                                             |
|   `volume`   | integer   | Traded volume during the period                                                                   |
|   `time`     | integer   | Unix timestamp in milliseconds                                                                    |
|   `dateTime` | string    | ISO-8601 datetime aligned to the start of the candle (or pre-market session start for daily bars) |

---

With this endpoint you can dynamically chart historical prices at your desired granularity.
