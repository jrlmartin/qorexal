**Converting HTML to markdown**

The user wants to convert an HTML snippet into markdown. The snippet includes a title, description, request example, code sample, response example, JSON snippet, and field definitions. I will carefully extract each part and convert it to markdown format without adding any extra text or titles. This will strictly be a clean markdown version without requiring browsing or further information. The focus is on translating the HTML structure into markdown syntax. I'll get started on the conversion.

**Converting HTML to markdown**

The user wants to clean up an HTML snippet into markdown. The snippet includes documentation for the GET /earnings-call-transcripts endpoint, with details like authorization, query parameters, response format, and field definitions. I will convert the content into markdown format, keeping it simple and clear. I’ll structure it with headings for the different sections, use triple backticks for code, and convert any descriptive parts like the "Try it" button to text. I'll start with the GET endpoint title and provide the markdown documentation.


Thought for 6 seconds


**Conference Call Transcripts**

**Endpoint**
`GET /api/v1/earnings-call-transcripts`

**Description**
Get the transcripts from conference calls and their summaries.

---

## Authorization

| Name  | In    | Type   | Required | Description                          |
| ----- | ----- | ------ | -------- | ------------------------------------ |
| token | query | string | Yes      | Authentication token for API access. |

---

## Request

```http
GET https://api.benzinga.com/api/v1/earnings-call-transcripts?token=YOUR_TOKEN
```

<details>
<summary>JavaScript example</summary>

```js
const options = { method: 'GET' };

fetch('https://api.benzinga.com/api/v1/earnings-call-transcripts?token=YOUR_TOKEN', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

</details>

---

## Response (200 OK)

*Content-Type: application/json*

```json
{
  "id": "6697d8a6c180cee7aaafbdd7",
  "security": {
    "ticker": "EQBK",
    "exchange": "NYS",
    "company_name": "",
    "cik": "1227500",
    "isin": "US29460X1090"
  },
  "transcript_full": "Hello, everyone, and welcome to the Equity Bank Shares...
  ",
  "m3u8_url": "https://broadcast2-use1-cdn.media.prod.tokbox.com/.../playlist.m3u8",
  "summaries": [
    "Equity Bancshares Inc. has reported its Q2 2024 results, citing a record high..."
  ],
  "summary_full": "",
  "call_id": "667bb52f5b3ba10001e48a9c",
  "start_time": "10:00:00",
  "date": "2024-07-17"
}
```

---

## Response Fields

* **id** *(string)*
  Unique identifier for the transcript.

* **security** *(object)*
  Information about the company whose call was transcribed.

  * **ticker** *(string)* — Stock ticker symbol.
  * **exchange** *(string)* — Exchange where the stock is listed.
  * **company\_name** *(string)* — Name of the company.
  * **cik** *(string)* — Central Index Key (CIK) of the company.
  * **isin** *(string)* — International Securities Identification Number (ISIN).

* **transcript\_full** *(string)*
  Full text of the conference call transcript.

* **m3u8\_url** *(string)*
  URL to the audio recording (HLS playlist) of the conference call.

* **summaries** *(string\[])*
  Brief bullet-point summaries of key call highlights.

* **summary\_full** *(string)*
  A single, comprehensive summary of the entire call.

* **call\_id** *(string)*
  Unique identifier for the call session.

* **start\_time** *(string)*
  Time the call began (HH\:MM\:SS).

* **date** *(string)*
  Date of the conference call (YYYY-MM-DD).
