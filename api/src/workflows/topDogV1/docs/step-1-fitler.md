If you want to keep resource usage light and still do a decent initial filter for “bullish” stocks, focus on just a few high-impact data points in addition to the article text. Here’s a minimal set you might gather for Step 1:

1. **Text-Based Sentiment**

   * **Article Sentiment Score** (e.g., a simple polarity measure from the headlines or summary).
   * **Keyword Check** (e.g., “outperform,” “beats earnings,” “strong guidance,” etc.).

2. **Recent Price & Volume Snapshot**

   * **Percent Change (Intraday or Past Day)** to confirm there’s some actual bullish market reaction.
   * **Volume vs. Average Volume**: Even a simple “Volume is above or below the daily average” can show whether traders are paying attention.

3. **Very Light Context**

   * **Sector** (or industry) to confirm if the move is stock-specific or part of a broader sector upswing.
   * **Source Credibility** (optional): a quick check if the article comes from a high-signal or low-signal outlet.

With these 2–3 data points plus the article text, you can weed out any “bullish in text, but no real market follow-through” stocks. Stocks that pass this filter (positive sentiment + noticeable price/volume action) move on to deeper analysis (Step 2). This approach avoids collecting full-blown fundamental data or running in-depth sentiment analysis across social media at this early stage, keeping it fast and resource-efficient.


Here’s a deeper look at how to handle **Recent Price & Volume Snapshot** in your quick filtering:

### 1. Percent Change (Intraday or Past Day)

* **What It Is**: A simple metric comparing the stock’s current price to either:

  * The start of the trading day (intraday change), or
  * The previous closing price (day-over-day change).
* **Why It Matters**:

  * If the stock is genuinely reacting to bullish news, you might see an uptick in price.
  * A modest move (e.g., +1% or +2%) might not be hugely telling by itself, but combined with unusual volume or strong sentiment, it could confirm real interest.
  * A bigger move (e.g., +5%, +10%, or more) typically signals a potentially significant catalyst.

### 2. Volume vs. Average Volume

* **What It Is**: Comparing today’s (or the latest session’s) trading volume to the stock’s typical daily volume or to its moving average volume (e.g., 10-day, 30-day average).
* **Why It Matters**:

  * Volume spikes often reflect increased market participation. If a stock has volume 2–3 times higher than usual, it’s a sign traders are reacting to something (like fresh news).
  * A stock can have bullish headlines but show no volume spike. That discrepancy can indicate the market is ignoring the news—or that it’s not truly material.

### 3. How to Combine These Two Metrics

1. **Compute Price Change**: You can do something like:

   $$
   \text{Intraday Percent Change} = \frac{\text{Current Price} - \text{Open Price}}{\text{Open Price}} \times 100\%
   $$

   or

   $$
   \text{Day-Over-Day Percent Change} = \frac{\text{Current Price} - \text{Previous Close}}{\text{Previous Close}} \times 100\%
   $$

2. **Compare Volume to Historical Averages**:

   $$
   \text{Volume Ratio} = \frac{\text{Current Day's Volume}}{\text{Average Volume Over X Days}}
   $$

   * If $\text{Volume Ratio} \geq 2$, that’s a strong sign of unusual activity. Even $\text{Volume Ratio} \approx 1.5$ can be noteworthy depending on the stock.

3. **Filter Thresholds**:

   * Set minimal or moderate thresholds for each metric (e.g., a positive price change of at least +2% or a volume ratio above 1.2).
   * If a stock meets or exceeds those thresholds **and** the article’s sentiment/keywords look bullish, you keep it for the next round.
   * If not, discard it to save resources.

---

### Practical Example

* **Stock A** has a bullish article mentioning a huge product launch.

  * **Price**: Up +3% intraday.
  * **Volume**: 2.5x higher than its 20-day average volume by mid-afternoon.
* **Stock B** also has a seemingly bullish article.

  * **Price**: Up only +0.5% intraday.
  * **Volume**: Roughly the same as normal.

In a quick filter, **Stock A** seems more compelling because both price and volume confirm the news is getting market attention—so it moves on for deeper analysis. **Stock B** might get filtered out if you have limited capacity to analyze every lead.

---

By focusing on these two factors—**percent change** and **volume vs. average volume**—you get a solid “first cut” for identifying news that the market is actually responding to, without requiring a lot of extra data.

----
----

Below is a simple example of how you might capture **Text-Based Sentiment** (#1) in JSON. This minimal structure includes:

* **`articleId`**: ID or reference to the news article.
* **`headline`**: The headline/title of the article.
* **`contentSnippet`**: A short excerpt of the article’s content (optional).
* **`sentimentScore`**: A numeric rating (e.g., -1 to +1 or 0 to 1) indicating how bullish/bearish the article is.
* **`keywordsFound`**: Important bullish keywords or phrases detected.

```json
{
  "articleId": "12345",
  "headline": "XYZ Corp Achieves Record Earnings and Raises Guidance",
  "contentSnippet": "XYZ Corp announced quarterly earnings exceeding analyst expectations...",
  "sentimentScore": 0.85,
  "keywordsFound": [
    "record earnings",
    "raises guidance",
    "positive outlook"
  ]
}
```

### Explanation of Fields

* **articleId**
  A unique identifier (e.g., from your database or the publisher) to link sentiment data back to the original article.

* **headline**
  The article’s headline or title—often the first (and sometimes only) piece of text used for a quick initial sentiment check.

* **contentSnippet** (Optional)
  A short excerpt from the body of the article. You might use just a few sentences if you want to keep things lightweight.

* **sentimentScore**
  A numerical score representing the text’s sentiment. You could use a scale like:

  * **-1.0** (very negative) to **+1.0** (very positive), or
  * **0** to **1.0**, where higher is more bullish.

* **keywordsFound**
  A list of any important bullish/bearish terms (e.g., “outperform,” “beat estimates,” “positive guidance,” “strong buy,” etc.) that triggered or influenced the sentiment analysis.

This JSON is just one example structure; you can adapt it based on the tools or libraries you’re using for sentiment analysis.


2. Volume vs. Average Volume
What It Is: Comparing today’s (or the latest session’s) trading volume to the stock’s typical daily volume or to its moving average volume (e.g., 10-day, 30-day average).

Why It Matters:

Volume spikes often reflect increased market participation. If a stock has volume 2–3 times higher than usual, it’s a sign traders are reacting to something (like fresh news).

A stock can have bullish headlines but show no volume spike. That discrepancy can indicate the market is ignoring the news—or that it’s not truly material.

-----
-----

Below is a **sample JSON** structure for tracking a stock’s **percent change**—both **intraday** (from the day’s open) and **day-over-day** (from the previous close). This example includes a timestamp, previous close, open price, current price, and computed percentage changes.

```json
[
  {
    "symbol": "AAPL",
    "timestamp": "2025-05-06T14:30:00Z",
    "previousClose": 168.50,
    "openPrice": 169.10,
    "currentPrice": 172.34,
    "percentChangeFromPreviousClose": 2.28,
    "percentChangeIntraday": 1.92
  },
  {
    "symbol": "TSLA",
    "timestamp": "2025-05-06T14:30:00Z",
    "previousClose": 850.00,
    "openPrice": 852.50,
    "currentPrice": 897.00,
    "percentChangeFromPreviousClose": 5.53,
    "percentChangeIntraday": 5.23
  }
]
```

**Explanation of Fields:**

* **symbol**: The stock’s ticker symbol (e.g., AAPL for Apple).
* **timestamp**: The date/time (in UTC) when this data snapshot was taken.
* **previousClose**: The final price at the close of the previous trading day.
* **openPrice**: The initial price at the start of the current trading day.
* **currentPrice**: The most recent price at the time of the snapshot.
* **percentChangeFromPreviousClose**: The **day-over-day** change, measured from the previous close to the current price.
* **percentChangeIntraday**: The **intraday** change, measured from the day’s open price to the current price.

-----
-----

Below is a sample JSON structure that illustrates how you might capture **volume vs. average volume** data for quick filtering:

```json
{
  "ticker": "AAPL",
  "date": "2025-05-06",
  "currentVolume": 145000000,
  "averageVolume10Day": 95000000,
  "averageVolume30Day": 90000000,
  "volumeRatio10Day": 1.53,
  "volumeRatio30Day": 1.61
}
```

### Field Descriptions

* **ticker**: The stock symbol (e.g., "AAPL" for Apple).
* **date**: The date or trading session this volume data is from.
* **currentVolume**: The most recent trading volume figure (e.g., today’s total volume so far).
* **averageVolume10Day**: The stock’s average volume over the past 10 trading days.
* **averageVolume30Day**: The stock’s average volume over the past 30 trading days.
* **volumeRatio10Day**: A quick ratio of the current volume vs. the 10-day average (e.g., `currentVolume / averageVolume10Day`).
* **volumeRatio30Day**: A quick ratio of the current volume vs. the 30-day average (e.g., `currentVolume / averageVolume30Day`).

You might use one or both of these ratios in your filtering logic. For instance, if `volumeRatio10Day` is greater than a certain threshold (e.g., 1.5), it indicates that today’s trading volume is 50% higher than usual—a sign of potentially significant market interest.

----
----
Below is sample JSON data that illustrates how you might combine **Intraday/Day-over-Day Price Change** and **Volume Ratio** to decide which stocks to keep for deeper analysis. Each example includes:

* **Open Price**, **Current Price**, **Previous Close** for calculating percentage changes.
* **Current Volume** and **Average Volume** for calculating the volume ratio.
* Computed metrics (**intradayPercentChange**, **dayOverDayPercentChange**, **volumeRatio**).
* Simple filter thresholds and a final boolean on whether the stock meets the criteria.

---

```json
[
  {
    "symbol": "AAPL",
    "openPrice": 150.00,
    "currentPrice": 157.00,
    "previousClose": 148.00,
    "currentVolume": 82000000,
    "averageVolume": 50000000,
    "intradayPercentChange": 4.67,
    "dayOverDayPercentChange": 6.08,
    "volumeRatio": 1.64,
    "thresholds": {
      "priceChangePercent": 2.0,
      "volumeRatio": 1.2
    },
    "meetsCriteria": true
  },
  {
    "symbol": "TSLA",
    "openPrice": 250.00,
    "currentPrice": 251.25,
    "previousClose": 249.50,
    "currentVolume": 15000000,
    "averageVolume": 20000000,
    "intradayPercentChange": 0.50,
    "dayOverDayPercentChange": 0.70,
    "volumeRatio": 0.75,
    "thresholds": {
      "priceChangePercent": 2.0,
      "volumeRatio": 1.2
    },
    "meetsCriteria": false
  },
  {
    "symbol": "AMZN",
    "openPrice": 120.00,
    "currentPrice": 123.60,
    "previousClose": 119.00,
    "currentVolume": 35000000,
    "averageVolume": 25000000,
    "intradayPercentChange": 3.00,
    "dayOverDayPercentChange": 3.87,
    "volumeRatio": 1.40,
    "thresholds": {
      "priceChangePercent": 2.0,
      "volumeRatio": 1.2
    },
    "meetsCriteria": true
  }
]
```

### How These Values Were Derived

1. **Intraday Percent Change**

   $$
   \text{Intraday Change} = \frac{\text{currentPrice} - \text{openPrice}}{\text{openPrice}} \times 100\%
   $$

2. **Day-Over-Day Percent Change**

   $$
   \text{Day-Over-Day} = \frac{\text{currentPrice} - \text{previousClose}}{\text{previousClose}} \times 100\%
   $$

3. **Volume Ratio**

   $$
   \text{Volume Ratio} = \frac{\text{currentVolume}}{\text{averageVolume}}
   $$

4. **Thresholds & Final Decision**

   * **priceChangePercent threshold**: The minimum positive price change required (e.g., 2.0%).
   * **volumeRatio threshold**: The minimum volume ratio (e.g., 1.2) to consider it “significantly higher” than average.
   * **meetsCriteria**: `true` if both the price change and volume ratio exceed thresholds (and, in a real system, if the sentiment from the article is bullish).

Use this kind of data structure to quickly filter stocks for the next level of analysis.

----
----

**Short Answer:**
Yes, this is a practical and efficient first-pass filter for identifying potentially bullish stocks. By combining light text-based sentiment (headline/keyword checks) with quick market-confirmation signals (price change and volume versus average), you can weed out many false positives. It won’t catch every promising stock, but it will give you a good “bang-for-buck” approach to focus your deeper analysis where it’s most likely to matter.

---

## Why This Plan Works

1. **Headline/Keyword Sentiment**

   * **Fast & Lightweight:** Headlines (or a snippet) are quick to analyze computationally and often capture the main thrust of the news.
   * **High-Level Signal:** If the text mentions “strong buy,” “beats estimates,” or “raises guidance,” there’s a good chance the market will view it positively.

2. **Price & Volume as Market Confirmation**

   * **Percent Change**: Shows whether the market is reacting right now—rather than just trusting the article’s wording.
   * **Volume Spikes**: Higher-than-usual volume suggests genuine investor/trader interest.
   * **Combined Effect**: Price upticks plus a volume spike are a strong confirmation that the bullish news is resonating.

3. **Very Light Context**

   * **Sector Check**: Helps distinguish stock-specific moves from broad sector moves.
   * **Source Credibility (Optional)**: Lets you disregard “clickbait” or less reliable outlets quickly.

4. **Keeps Resource Usage Low**

   * By focusing on a few key points (headline sentiment, price action, volume), you avoid a heavy fundamental or multi-platform social media analysis.
   * This speeds up Step 1 (the quick filter), reserving deeper resources for the second stage when a stock passes the initial screen.

---

## Potential Caveats & Limitations

1. **Headline-Only Sentiment Can Be Tricky**

   * **Possible Mismatches**: Sometimes headlines are misleading, or the real nuance is in the article body. A quick snippet is helpful but not foolproof.
   * **Solution**: If you find too many false positives/negatives, add a slightly more robust sentiment check (e.g., scanning the first paragraph).

2. **Intraday Noise**

   * **Volatility**: Stocks can spike briefly in the morning and revert later. If you only measure once, you might catch a transient pop.
   * **Solution**: Consider checking the metrics again after 30–60 minutes to confirm consistency if your resources allow it.

3. **Threshold Setting**

   * **Arbitrary or Generic Thresholds** (e.g., +2% price change, 1.2× volume ratio) may not be suitable for very volatile or very stable stocks.
   * **Solution**: Fine-tune thresholds per sector, or use rolling volatility metrics to adjust the filter.

4. **Overlooked Fundamental Factors**

   * At this stage, you’re ignoring deeper fundamentals (P/E ratios, debt levels, etc.).
   * **Solution**: That’s okay for Step 1. The plan explicitly defers fundamental analysis until a stock passes the filter.

5. **Broader Market Conditions**

   * On especially bullish or bearish market days, individual stock moves may be swept up by overall sentiment.
   * **Solution**: Track sector/market indices. If every stock is up due to macro events, raise the bar on your thresholds (or at least factor it into your final scoring).

---

## When This Plan Is Most Useful

* **High Volume of News**: If you monitor dozens or hundreds of headlines daily, this filter helps you quickly narrow the list.
* **Limited Computing Resources**: You want to avoid doing full fundamental scrapes or complex AI/NLP on every single article.
* **Intraday Trading or Short-Term Strategies**: Rapid recognition of “hot” stocks is crucial; a quick filter helps you jump on opportunities faster.
* **Supplement to Deeper Analysis**: This plan ensures you don’t expend more in-depth analysis (Step 2) on stocks that don’t show any real traction in the market.

---

## Final Verdict

* **Yes, It Will Work**: For an **initial** filter, combining minimal sentiment signals (from headlines/keywords) with market-confirming metrics (price change + volume vs. average) is a **solid**, **efficient** approach.
* **Proceed to Step 2**: Once you flag a stock as “potentially bullish,” you can afford to invest time in reading the full article, checking fundamentals, comparing analyst ratings, or doing more nuanced sentiment analysis (e.g., social media, transcripts, etc.).

Overall, the plan strikes a balance between speed (low data requirements) and effectiveness (price + volume confirmation). It won’t be perfect, but it’s a reliable way to filter out a large chunk of noise before applying deeper research.

----
----

# PHASE 2

----
----

Below is one possible **high-to-low priority** ranking of those extra data points for a quick, Step 1 filter. The order reflects how **impactful** and **easy to incorporate** they typically are—while still keeping things lightweight.

---

## 1. **Basic Relative Performance vs. Sector**

* **Why #1?**

  * It’s *very* easy to compare the stock’s 1-day (or intraday) % change to a relevant sector index or ETF (e.g., \$XLK\$ for tech).
  * Quickly reveals if the stock’s move is *truly* special or just part of a broad sector rally.
  * Minimal extra data needed (just the sector ETF price vs. the stock’s price).

**Tip:** If the sector is +0.5% but your stock is +3% on high volume, that’s a stronger bullish signal.

---

## 2. **Quick Analyst/Insider Signal**

* **Why #2?**

  * **Analyst Upgrades/Downgrades:** High-impact catalysts often drive immediate market reactions. Checking for a “recent upgrade” flag is easy.
  * **Insider Buying:** Also a strong vote of confidence if an exec or director is actively purchasing shares (simple Boolean: “Insider buying in last 2 weeks?”).
* **Lightweight**: You don’t need full details—just a yes/no or short blurb.

**Tip:** If you see a positive headline *plus* a same-week upgrade from a major bank, that’s a strong double-confirmation.

---

## 3. **Short Interest (High-Level)**

* **Why #3?**

  * A high short-interest ratio (e.g., 20–30% of float) plus good news can trigger short covering → bigger upside moves.
  * Checking short interest is usually a single data point (short % of float or short-interest ratio).
* **Slight Caution**: Short interest data can be lagging (updates often biweekly). Still, as a broad indicator, it’s low-maintenance to include.

**Tip:** Mark a stock as “potential short squeeze” if short interest is above a threshold (e.g., >15%).

---

## 4. **Simple Social Media “Buzz”**

* **Why #4?**

  * Quick gauge of retail hype—particularly relevant for small-cap or “meme” stocks.
  * Can be done with a single “mention volume ratio” (e.g., comparing current mention count to a typical baseline).
* **Why Not Higher?**

  * Data quality and noise can be high. Unless you already have a simple pipeline to measure mentions or hashtags, it can be more overhead than sector or short-interest checks.

**Tip:** If the ticker’s Twitter mentions are 3× normal, but the price hasn’t moved yet, you might catch an early wave of interest.

---

## 5. **Quick Technical Check (One or Two Indicators)**

* **Why #5?**

  * Technical triggers (e.g., 52-week high breakout) can be bullish, but daily price/volume + sector check often covers the biggest part of that story already.
  * A “golden cross” or 50/200 day moving average check *is* easy, but might add less incremental value compared to the first four signals.
* **Still Useful**:

  * If the stock is near a major technical level (e.g., an all-time high), it can attract momentum traders.

**Tip:** Keep it as a simple flag (like “near 52-week high: true/false?”) rather than a full technical analysis suite.

---

# Summary Ranking

1. **Basic Relative Performance vs. Sector**
2. **Quick Analyst/Insider Signal**
3. **Short Interest (High-Level)**
4. **Simple Social Media “Buzz”**
5. **Quick Technical Check**

All five are *relatively* low effort. By prioritizing them in this order, you add high-value confirmations (sector outperformance, analyst upgrades, high short interest) before layering in the extras (social buzz, simple technical flags). This keeps Step 1 efficient yet more robust than just headline sentiment + price/volume alone.
