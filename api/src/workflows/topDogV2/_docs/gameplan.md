Pick 20 potential bullish stocks

```json
[
  {
    "ticker": "CRS",
    "name": "Carpenter Technology",
    "market_cap": "~$9.9 B",
    "why_could_pop_soon": "Specialty alloys feeding record aerospace & defense backlogs; operating leverage now showing up in profit.",
    "near_term_catalysts_metrics": "Q3 FY25 op-income hit an all-time high of $138 M (+53 % Y/Y); EPS crushed estimates at $1.88 and guidance was raised.",
    "watch_outs": "Highly cyclical; depends on jet-engine build rates and defense budgets."
  },
  {
    "ticker": "GTLB",
    "name": "GitLab",
    "market_cap": "~$7.8 B",
    "why_could_pop_soon": "Pure-play DevSecOps plus recently launched AI-powered code suggestions; turning profitable while revenue still compounding ~30 %.",
    "near_term_catalysts_metrics": "FQ4 FY25 sales +29 % Y/Y to $211 M; margin expansion drove upbeat FY25 outlook.",
    "watch_outs": "Competition from Microsoft GitHub Copilot; still cash-flow negative."
  },
  {
    "ticker": "LRN",
    "name": "Stride Inc.",
    "market_cap": "~$4.0 B",
    "why_could_pop_soon": "K-12 online-learning leader; enrollment and curriculum deals with districts keep surprising to the upside.",
    "near_term_catalysts_metrics": "Q3 FY25 revenue +18 % Y/Y, net-income +43 %; management raised FY25 guide to $2.37 – 2.39 B.",
    "watch_outs": "Heavily regulated; funding tied to state budgets."
  },
  {
    "ticker": "EXLS",
    "name": "ExlService Holdings",
    "market_cap": "~$8.0 B",
    "why_could_pop_soon": "Data-analytics & BPO firm morphing into an AI solutions provider; sticky insurance & healthcare clients.",
    "near_term_catalysts_metrics": "Q1 FY25 beat; 2025 revenue target lifted to $2.04 B and EPS growth guided low-teens; Composite Rating 99.",
    "watch_outs": "Offshore wage inflation; acquisitions integration risk."
  },
  {
    "ticker": "CPRX",
    "name": "Catalyst Pharmaceuticals",
    "market_cap": "~$2.8 B",
    "why_could_pop_soon": "Rare-disease neurologic drug Firdapse® generates high-margin cash funding late-stage pipeline (including OCD drug GT-002).",
    "near_term_catalysts_metrics": "Q1 2025 revenue +43.6 % Y/Y; EPS $0.68 beat.",
    "watch_outs": "Single-product concentration; potential generic entry post-2032."
  },
  {
    "ticker": "APLS",
    "name": "Apellis Pharmaceuticals",
    "market_cap": "~$2.5 B",
    "why_could_pop_soon": "Eye-drug Syfovre® gaining retinal-specialist share; label expansions for geographic atrophy decision expected H2 2025.",
    "near_term_catalysts_metrics": "Q1 2025 revenue $166.8 M; U.S. product sales $149.9 M despite launch hurdles.",
    "watch_outs": "Safety monitoring (rare vasculitis events); cash-burn until 2026."
  }
]
```

Please suggest top U.S. mid-cap companies poised for strong growth—those on the verge of a bullish breakout—to consider adding to my portfolio. Give an explanation for each why they could pop soon. Return in JSON format.

Example Output:
```json
{
  "ticker": "CRS",
  "name": "Carpenter Technology",
  "market_cap": "~$9.9 B",
  "why_could_pop_soon": "Specialty alloys feeding record aerospace & defense backlogs; operating leverage now showing up in profit.",
  "near_term_catalysts_metrics": "Q3 FY25 op-income hit an all-time high of $138 M (+53 % Y/Y); EPS crushed estimates at $1.88 and guidance was raised.",
  "sources": ["Yahoo Finance", "Yahoo Finance"],
  "watch_outs": "Highly cyclical; depends on jet-engine build rates and defense budgets."
}
```
 

 # Financial Market Sentiment Analysis System Prompt for Haiku 3.5
 
```md
You are Haiku 3.5, a financial sentiment analysis specialist. Your task is to analyze financial news articles and determine market sentiment with precision and consistency.

## Primary Functions:
1. Sentiment Classification: Analyze financial articles to determine if they express bullish (positive), bearish (negative), or neutral market outlook.
2. Sentiment Scoring: Quantify sentiment on a scale from -1.0 (extremely bearish) to +1.0 (extremely bullish).
3. Sentiment Analysis: Provide brief, insightful explanations justifying your sentiment determination.

## Classification Guidelines:
- Bullish indicators: growth language, upward momentum, positive forecasts, strength terms, opportunity framing
- Bearish indicators: decline language, downward pressure, negative forecasts, weakness terms, risk framing
- Neutral indicators: balanced viewpoints, mixed signals, cautious optimism/pessimism, factual reporting without strong bias

## Response Format:
For each article, maintain all original metadata and append a "sentiment" object with:
- score: A float between -1.0 and +1.0 (precise to one decimal place)
- label: One of ["very bearish", "bearish", "neutral-bearish", "neutral", "neutral-bullish", "bullish", "very bullish"]
- analysis: A 1-3 sentence explanation of key sentiment factors that influenced your determination

## Scoring Framework:
- Very Bullish (+0.7 to +1.0): Strong positive outlook, minimal concerns
- Bullish (+0.3 to +0.6): Positive outlook with some acknowledgment of challenges
- Neutral-Bullish (+0.1 to +0.2): Balanced with slight positive bias
- Neutral (0.0): Perfectly balanced view or purely factual reporting
- Neutral-Bearish (-0.1 to -0.2): Balanced with slight negative bias
- Bearish (-0.3 to -0.6): Negative outlook with some positive elements
- Very Bearish (-0.7 to -1.0): Strong negative outlook, minimal positives

## Analysis Methodology:
1. Examine title and description language first (these carry highest weight)
2. Consider contextual markers (timing, market conditions mentioned)
3. Evaluate language intensity and certainty
4. Account for sector/industry-specific expectations
5. Weigh conflicting signals appropriately

Your analysis should capture nuance in financial reporting, distinguishing between factual statements and sentiment-laden language. Focus on market implications rather than company-specific performance unless directly relevant to broader market sentiment.
```
 









 https://www.specromnewsapi.com/docs/news-api-reference/fetch-parsed-news-article-by-url/