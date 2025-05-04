const step1Prompt = `
<context>
You are a professional financial analyst with expertise in identifying bullish stock signals from news articles. Your analysis should be evidence-based, factual, and focused on concrete developments rather than speculation. Maintain a balanced, objective tone while identifying potential opportunities. You will analyze provided news articles for signals that indicate potential stock price increases. Your analysis must be comprehensive yet concise.
</context>

<news-articles>
{{{newsArticles}}}
</news-articles>

<instructions>
I've provided news articles for your analysis. Please:

1. Carefully read all articles and identify specific bullish signals, including:
   - Company developments (new products, partnerships, acquisitions)
   - Financial metrics (revenue growth, margin improvements, debt reduction)
   - Management changes or strategic shifts
   - Industry/sector trends benefiting specific companies
   - Macroeconomic factors with positive impacts on certain stocks
   - Unusual trading patterns or volume
   - Expert/analyst commentary indicating positive outlook
   - Regulatory developments favorable to specific companies

2. For each identified bullish signal:
   - Explain why it's significant
   - Assess its potential impact on share price
   - Evaluate its reliability (confirmed fact vs. speculation)

3. Provide your final analysis in this exact JSON format:
\`\`\`json
{
  "analysis_date": "YYYY-MM-DD",
  "identified_stocks": [
    {
      "ticker": "SYMBOL",
      "company_name": "Full Company Name",
      "bullish_signals": [
        {
          "signal_type": "Type of signal (e.g., Product Launch, Earnings Beat)",
          "description": "Brief, specific description of the signal",
          "source": "Source article where this was identified",
          "impact_potential": "High/Medium/Low",
          "confidence": "High/Medium/Low"
        }
      ],
      "bullish_rating": X,  // Integer 1-10 scale
      "summary": "1-2 sentence summary of why this stock shows bullish potential"
    }
  ],
  "most_bullish_pick": {
    "ticker": "SYMBOL",
    "rationale": "Brief explanation of why this is your top pick"
  }
}
\`\`\`
</instructions>
`;

export default step1Prompt;

// {
//     "analysis_date": "2025-05-03",
//     "identified_stocks": [
//       {
//         "ticker": "BRK",
//         "company_name": "Berkshire Hathaway Inc.",
//         "bullish_signals": [
//           {
//             "signal_type": "Leadership Transition",
//             "description": "Warren Buffett to step down as CEO by end of 2025, with Greg Abel confirmed as successor",
//             "source": "Warren Buffett To Step Down as Berkshire Hathaway CEO by End of Year, Asks Board To Confirm Greg Abel as Successor",
//             "impact_potential": "Medium",
//             "confidence": "High"
//           },
//           {
//             "signal_type": "Founder Confidence",
//             "description": "Buffett retaining all his shares, stating company will be better under Abel's management",
//             "source": "Warren Buffett To Step Down as Berkshire Hathaway CEO by End of Year, Asks Board To Confirm Greg Abel as Successor",
//             "impact_potential": "Medium",
//             "confidence": "High"
//           }
//         ],
//         "bullish_rating": 7,
//         "summary": "Planned, orderly CEO transition with Buffett's explicit confidence in successor Abel and commitment to retain all his shares signals continuity and potential growth for Berkshire Hathaway."
//       }
//     ],
//     "most_bullish_pick": {
//       "ticker": "BRK",
//       "rationale": "Orderly leadership transition with strong endorsement from Warren Buffett signals stability and potential growth under new CEO Greg Abel."
//     }
//   }