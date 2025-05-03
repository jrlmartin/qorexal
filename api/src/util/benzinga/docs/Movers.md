**Cleaning up HTML to Markdown**

The user wants to convert the raw HTML documentation for the GET /movers endpoint into markdown. I need to focus on extracting the following details:

* Title: "GET Movers"
* Description: "Returns market movers"
* Endpoint: "GET /movers"
* Authentication, query parameters, and response schema tables, adding examples in multiple languages including cURL, Python, and JavaScript. The HTML only includes the JavaScript snippet, so I'll make sure to turn it into a complete markdown doc with all the needed sections.

**Cleaning up documentation**

It seems the documentation has separate panels for each language, but only the JavaScript panel is expanded. Since the user wants a cleaned-up version, I'll include the JavaScript code snippet as the main example. I'll also include the response structure as part of the docs. Despite the absence of a cURL example in the HTML, I'll focus on providing just the JavaScript fetch code for simplicity. I'll also clean up the authorization and query parameters with clear explanations for each, and wrap it all in a neat markdown format.


Thought for 14 seconds


**GET /api/v1/market/movers**

Returns market movers.

```http
GET https://api.benzinga.com/api/v1/market/movers?apikey=YOUR_API_KEY[&maxResults=...&from=...&to=...&session=...&screenerQuery=...]
```

---

### Authorization

| Parameter | Type   | In    | Required | Description   |
| --------- | ------ | ----- | -------- | ------------- |
| `apikey`  | string | query | Yes      | Your API key. |

---

### Query Parameters

| Parameter       | Type    | In    | Required | Description                                                                                                                                                   |
| --------------- | ------- | ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxResults`    | integer | query | No       | Maximum number of gainers/losers to return (up to 1000).                                                                                                      |
| `from`          | string  | query | No       | Start of period — date or relative. Supports:<br>- `yyyy-mm-dd`<br>- `yyyy-mm-ddThh:mm:ss`<br>- `1d`, `-1w`, `-1y`, `YTD`                                     |
| `to`            | string  | query | No       | End of period — date or timestamp. Supports:<br>- `yyyy-mm-dd`<br>- `yyyy-mm-ddThh:mm:ss`                                                                     |
| `session`       | string  | query | No       | Market session. Options:<br>- `REGULAR` *(default)*<br>- `PRE_MARKET`<br>- `AFTER_MARKET`<br>(`PRE_MARKET`/`AFTER_MARKET` only return that session’s movers.) |
| `screenerQuery` | string  | query | No       | Semicolon-separated filters, e.g.:<br>`marketcap_gt_1b;close_gt_5;sector_in_technology,healthcare;marketcap_gt_300m;marketcap_lt_2b`                          |

---

### Code Example (JavaScript)

```javascript
const options = { method: 'GET' };

fetch('https://api.benzinga.com/api/v1/market/movers?apikey=YOUR_API_KEY', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

---

### Response

**Status**: `200 OK`
**Content-Type**: `application/json`

```json
{
  "processingTimeMillis": 123,
  "result": {
    "fromDate": "2023-11-07T05:31:56Z",
    "toDate":   "2023-11-07T05:31:56Z",
    "snapTo":   "<string>",
    "usePreviousClose": true,
    "gainers": [
      {
        "symbol":         "<string>",
        "change":         123,
        "changePercent":  123,
        "volume":         123,
        "close":          123,
        "companyName":    "<string>",
        "averageVolume":  123,
        "previousClose":  123
      }
    ],
    "losers": [
      {
        "symbol":         "<string>",
        "change":         123,
        "changePercent":  123,
        "volume":         123,
        "close":          123,
        "companyName":    "<string>",
        "averageVolume":  123,
        "previousClose":  123
      }
    ]
  }
}
```

#### Top-Level Fields

* **processingTimeMillis** (`integer`)
  Server processing time in milliseconds.
* **result** (`object`)

  * **fromDate** (`string`) — Start of the period used to calculate movers.
  * **toDate** (`string`) — End of the period used to calculate movers.
  * **snapTo** (`string`) — *Not available.*
  * **usePreviousClose** (`boolean`) — `true` if using the previous session’s close for change calculations.
  * **gainers** (`array<object>`) — List of top gainers.
  * **losers** (`array<object>`) — List of top losers.

##### Gainers/Losers Object

| Field           | Type    | Description                                         |
| --------------- | ------- | --------------------------------------------------- |
| `symbol`        | string  | Ticker symbol (e.g. `AAPL`, `MSFT`).                |
| `change`        | number  | Absolute price change.                              |
| `changePercent` | number  | Percentage price change.                            |
| `volume`        | number  | Trading volume over the period.                     |
| `close`         | number  | Last known price (may be up to one-minute delayed). |
| `companyName`   | string  | Company’s full name.                                |
| `averageVolume` | integer | 50-day average volume.                              |
| `previousClose` | number  | Previous session’s close price.                     |
