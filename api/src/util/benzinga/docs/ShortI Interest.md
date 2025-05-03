**Converting HTML to Markdown**

The user asked to clean up HTML into Markdown, likely for an API documentation snippet, with details like the title, description, and endpoint info. It looks like they only need the first part of the document, as seen in their past requests. The snippet includes elements like a header for "Short Interest," an endpoint description, and specific API paths. I'll convert this into a well-structured markdown format, focusing on the title, endpoint, and description sections.

**Converting HTML to Markdown**

Looks like the user wants to convert a whole HTML block into Markdown, focusing on API documentation for "Short Interest". The key parts to include are the category, endpoint description, and the API request details. We’ll format this section with typical Markdown, like:

```
## Short Interest
### GET /api/v1/shortinterest
Returns short interest data for stocks, including data like total short interest and days to cover.
```

I'll also incorporate the JavaScript code example, leaving out others like cURL, since those were only in the original HTML with tabs.


Thought for 6 seconds


**Short Interest**

**GET** `/api/v1/shortinterest`

Returns short interest data for stocks, including data such as total short interest, days to cover, and more.

```javascript
const options = { method: 'GET' };

fetch('https://api.benzinga.com/api/v1/shortinterest', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

**Response (200 OK)**
*Content-Type: application/json*

```json
{
  "shortInterestData": {
    "AAPL": {
      "data": [
        {
          "recordDate": "2022-01-11",
          "symbol": "AAPL",
          "company": "Apple Inc. Common Stock",
          "totalShortInterest": "95908325",
          "daysToCover": 1.01,
          "shortPercentOfFloat": 0.59,
          "shortPriorMo": "113277024",
          "percentChangeMoMo": -15.33,
          "sharesFloat": "16324519396",
          "averageDailyVolume": "95019341",
          "sharesOutstanding": "16334371000",
          "exchange": "NNM",
          "sector": "Technology",
          "industry": "Consumer Electronics",
          "exchangeReceiptDate": "2022-01-04",
          "settlementDate": "2021-12-31"
        },
        {
          "recordDate": "2022-01-26",
          "symbol": "AAPL",
          "company": "Apple Inc. Common Stock",
          "totalShortInterest": "90492581",
          "daysToCover": 1,
          "shortPercentOfFloat": 0.55,
          "shortPriorMo": "95908325",
          "percentChangeMoMo": -5.65,
          "sharesFloat": "16309589396",
          "averageDailyVolume": "90514428",
          "sharesOutstanding": "16319441000",
          "exchange": "NNM",
          "sector": "Technology",
          "industry": "Consumer Electronics",
          "exchangeReceiptDate": "2022-01-19",
          "settlementDate": "2022-01-14"
        },
        {
          "recordDate": "2022-02-09",
          "symbol": "AAPL",
          "company": "Apple Inc. Common Stock",
          "totalShortInterest": "91388112",
          "daysToCover": 1,
          "shortPercentOfFloat": 0.56,
          "shortPriorMo": "90492581",
          "percentChangeMoMo": 0.99,
          "sharesFloat": "16309589396",
          "averageDailyVolume": "120320268",
          "sharesOutstanding": "16319441000",
          "exchange": "NNM",
          "sector": "Technology",
          "industry": "Consumer Electronics",
          "exchangeReceiptDate": "2022-02-02",
          "settlementDate": "2022-01-31"
        },
        {
          "recordDate": "2022-02-25",
          "symbol": "AAPL",
          "company": "Apple Inc. Common Stock",
          "totalShortInterest": "108944701",
          "daysToCover": 1.32,
          "shortPercentOfFloat": 0.67,
          "shortPriorMo": "91388112",
          "percentChangeMoMo": 19.21,
          "sharesFloat": "16309589396",
          "averageDailyVolume": "82330433",
          "sharesOutstanding": "16319441000",
          "exchange": "NNM",
          "sector": "Technology",
          "industry": "Consumer Electronics",
          "exchangeReceiptDate": "2022-02-17",
          "settlementDate": "2022-02-15"
        }
      ]
    }
  }
}
```
