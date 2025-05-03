# Newsfeed & Why is it Moving v2 - Get News

## Overview

Get the news items from the Benzinga Newsfeed API (v2).

## Endpoint

```http
GET https://api.benzinga.com/api/v2/news
```

### Request Headers

* `accept` *(required, enum<string>)*: Response format. Default: `application/json`

### Authorization

Pass your API key as a query parameter:

* `token` *(required, string)*: Your Benzinga API key

## Query Parameters

| Parameter        | Type    | Default        | Description                                                                                             |
| ---------------- | ------- | -------------- | ------------------------------------------------------------------------------------------------------- |
| `page`           | integer | 0              | Page offset (0–100000). Use other filters to limit results.                                             |
| `pageSize`       | integer | 15             | Number of results to return (≤100).                                                                     |
| `displayOutput`  | enum    | headline       | Amount of content: `headline`, `abstract`, or `full`.                                                   |
| `date`           | string  | ‑              | Shorthand for `dateFrom` and `dateTo`.                                                                  |
| `dateFrom`       | string  | ‑              | Start date (sorted by published date).                                                                  |
| `dateTo`         | string  | ‑              | End date (sorted by published date).                                                                    |
| `updatedSince`   | integer | ‑              | Last updated Unix timestamp (UTC).                                                                      |
| `publishedSince` | integer | ‑              | Last published Unix timestamp (UTC).                                                                    |
| `sort`           | enum    | `created:desc` | Sort order. Options: `id:asc`, `id:desc`, `created:asc`, `created:desc`, `updated:asc`, `updated:desc`. |
| `isin`           | string  | ‑              | Comma-separated list of ISINs (max 50).                                                                 |
| `cusip`          | string  | ‑              | Comma-separated list of CUSIPs (max 50). License required.                                              |
| `tickers`        | string  | ‑              | Comma-separated list of ticker symbols (max 50).                                                        |
| `channels`       | string  | ‑              | Comma-separated list of channel names or IDs.                                                           |
| `topics`         | string  | ‑              | Comma-separated list of search terms (title, tags, body).                                               |
| `authors`        | string  | ‑              | Comma-separated list of authors.                                                                        |
| `content_types`  | string  | ‑              | Comma-separated list of content types.                                                                  |

## Example Request

```js
const options = {
  method: 'GET',
  headers: { accept: '<accept>' }
};

fetch('https://api.benzinga.com/api/v2/news?token=YOUR_API_KEY', options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

## Example Response

```json
[
  {
    "id": 37100544,
    "author": "Shanthi Rexaline",
    "created": "Tue, 13 Feb 2024 13:25:36 -0400",
    "updated": "Tue, 13 Feb 2024 13:25:37 -0400",
    "title": "Nvidia, AMD, Broadcom Among Biggest Beneficiaries Of AI Explosion To $400B Market: Analysts",
    "teaser": "Mizuho predicts a market estimate of $400 billion for AI by 2027. One analyst said this company will likely win the AI race.",
    "body": "<p>…</p>",
    "url": "https://www.benzinga.com/...",
    "image": [
      { "size": "small", "url": "https://cdn.benzinga.com/..._0.jpeg" },
      { "size": "large", "url": "https://cdn.benzinga.com/..._0.jpeg" },
      { "size": "thumb", "url": "https://cdn.benzinga.com/..._0.jpeg" }
    ],
    "channels": [ { "name": "Analyst Color" }, { "name": "Equities" }, … ],
    "stocks": [ { "name": "AMD" }, { "name": "NVDA" }, … ],
    "tags": [ { "name": "AI" }, { "name": "semiconductors" }, … ]
  }
]
```

## Response Fields

* **id** *(integer)*: Unique article identifier.
* **author** *(string)*: Article author.
* **created** *(string)*: Creation timestamp (RFC 2822).
* **updated** *(string)*: Last update timestamp (RFC 2822).
* **title** *(string)*: Headline.
* **teaser** *(string)*: Short summary or first sentence (HTML allowed).
* **body** *(string)*: Full content (HTML allowed).
* **url** *(string)*: URL on benzinga.com.
* **image** *(array)*: Featured images (size + URL).
* **channels** *(array)*: Related channels/categories.
* **stocks** *(array)*: Stocks mentioned.
* **tags** *(array)*: Additional tags/themes.
