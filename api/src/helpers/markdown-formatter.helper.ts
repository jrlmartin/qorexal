/**
 * Helper functions for formatting data into markdown
 */
export class MarkdownFormatter {
  /**
   * Converts company overview data to markdown format
   * @param data The company overview data
   * @returns A markdown string representation of the data
   */
  static convertCompanyOverviewToMarkdown(data: any): string {
    if (!data) return 'No data available';

    let markdown = `# ${data.Name} (${data.Symbol})\n\n`;
    
    // Company Profile
    markdown += `## Company Profile\n\n`;
    markdown += `- **Symbol**: ${data.Symbol}\n`;
    markdown += `- **Name**: ${data.Name}\n`;
    markdown += `- **Asset Type**: ${data.AssetType}\n`;
    markdown += `- **Exchange**: ${data.Exchange}\n`;
    markdown += `- **Currency**: ${data.Currency}\n`;
    markdown += `- **Country**: ${data.Country}\n`;
    markdown += `- **Sector**: ${data.Sector}\n`;
    markdown += `- **Industry**: ${data.Industry}\n`;
    markdown += `- **Address**: ${data.Address}\n`;
    markdown += `- **Official Site**: ${data.OfficialSite}\n`;
    markdown += `- **CIK**: ${data.CIK}\n`;
    markdown += `- **Fiscal Year End**: ${data.FiscalYearEnd}\n\n`;
    
    // Company Description
    markdown += `## Description\n\n${data.Description}\n\n`;
    
    // Financial Metrics
    markdown += `## Financial Metrics\n\n`;
    markdown += `### Valuation\n\n`;
    markdown += `- **Market Cap**: $${MarkdownFormatter.formatNumber(data.MarketCapitalization)}\n`;
    markdown += `- **EBITDA**: $${MarkdownFormatter.formatNumber(data.EBITDA)}\n`;
    markdown += `- **PE Ratio**: ${data.PERatio}\n`;
    markdown += `- **PEG Ratio**: ${data.PEGRatio}\n`;
    markdown += `- **Book Value**: $${data.BookValue}\n`;
    markdown += `- **Price to Sales Ratio (TTM)**: ${data.PriceToSalesRatioTTM}\n`;
    markdown += `- **Price to Book Ratio**: ${data.PriceToBookRatio}\n`;
    markdown += `- **Enterprise Value to Revenue**: ${data.EVToRevenue}\n`;
    markdown += `- **Enterprise Value to EBITDA**: ${data.EVToEBITDA}\n`;
    markdown += `- **Forward PE**: ${data.ForwardPE}\n`;
    markdown += `- **Trailing PE**: ${data.TrailingPE}\n\n`;
    
    markdown += `### Dividends\n\n`;
    markdown += `- **Dividend Per Share**: $${data.DividendPerShare}\n`;
    markdown += `- **Dividend Yield**: ${(parseFloat(data.DividendYield) * 100).toFixed(2)}%\n`;
    markdown += `- **Dividend Date**: ${data.DividendDate}\n`;
    markdown += `- **Ex-Dividend Date**: ${data.ExDividendDate}\n\n`;
    
    markdown += `### Earnings & Revenue\n\n`;
    markdown += `- **Latest Quarter**: ${data.LatestQuarter}\n`;
    markdown += `- **EPS**: $${data.EPS}\n`;
    markdown += `- **Diluted EPS (TTM)**: $${data.DilutedEPSTTM}\n`;
    markdown += `- **Revenue Per Share (TTM)**: $${data.RevenuePerShareTTM}\n`;
    markdown += `- **Revenue (TTM)**: $${MarkdownFormatter.formatNumber(data.RevenueTTM)}\n`;
    markdown += `- **Gross Profit (TTM)**: $${MarkdownFormatter.formatNumber(data.GrossProfitTTM)}\n`;
    markdown += `- **Quarterly Earnings Growth (YoY)**: ${(parseFloat(data.QuarterlyEarningsGrowthYOY) * 100).toFixed(2)}%\n`;
    markdown += `- **Quarterly Revenue Growth (YoY)**: ${(parseFloat(data.QuarterlyRevenueGrowthYOY) * 100).toFixed(2)}%\n\n`;
    
    markdown += `### Profitability\n\n`;
    markdown += `- **Profit Margin**: ${(parseFloat(data.ProfitMargin) * 100).toFixed(2)}%\n`;
    markdown += `- **Operating Margin (TTM)**: ${(parseFloat(data.OperatingMarginTTM) * 100).toFixed(2)}%\n`;
    markdown += `- **Return on Assets (TTM)**: ${(parseFloat(data.ReturnOnAssetsTTM) * 100).toFixed(2)}%\n`;
    markdown += `- **Return on Equity (TTM)**: ${(parseFloat(data.ReturnOnEquityTTM) * 100).toFixed(2)}%\n\n`;
    
    // Stock Performance
    markdown += `## Stock Performance\n\n`;
    markdown += `- **52-Week High**: $${data['52WeekHigh']}\n`;
    markdown += `- **52-Week Low**: $${data['52WeekLow']}\n`;
    markdown += `- **50-Day Moving Average**: $${data['50DayMovingAverage']}\n`;
    markdown += `- **200-Day Moving Average**: $${data['200DayMovingAverage']}\n`;
    markdown += `- **Beta**: ${data.Beta}\n`;
    markdown += `- **Shares Outstanding**: ${MarkdownFormatter.formatNumber(data.SharesOutstanding)}\n\n`;
    
    // Analyst Ratings
    markdown += `## Analyst Ratings\n\n`;
    markdown += `- **Target Price**: $${data.AnalystTargetPrice}\n`;
    markdown += `- **Strong Buy**: ${data.AnalystRatingStrongBuy}\n`;
    markdown += `- **Buy**: ${data.AnalystRatingBuy}\n`;
    markdown += `- **Hold**: ${data.AnalystRatingHold}\n`;
    markdown += `- **Sell**: ${data.AnalystRatingSell}\n`;
    markdown += `- **Strong Sell**: ${data.AnalystRatingStrongSell}\n`;
    
    return markdown;
  }

  static convertIntradayTimeSeriesToMarkdown(data: any): string {
    if (!data) return '';
    
    let markdown = `## Intraday Time Series\n\n`;
    markdown += `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n`;
    
    return markdown;
  }

  /**
   * Converts technical indicator data to markdown format
   * @param data The technical indicator data
   * @param indicatorName The name of the technical indicator (e.g., 'RSI')
   * @param timePeriod The time period of the technical indicator
   * @param seriesType The type of series to use for the technical indicator
   * @param numElements Optional limit on number of elements to include
   * @returns A markdown string representation of the technical indicator data
   */
  static convertTechnicalIndicatorToMarkdown(
    data: any, 
    indicatorName: string, 
    numElements?: number
  ): string {
    if (!data) return '';
    
    let markdown = `## ${indicatorName} Technical Indicator\n\n`;
    
    if (numElements) {
      markdown += `- **Elements Shown**: ${numElements}\n`;
    }
    
    markdown += `\n`;
    
    // If data has Technical Analysis key and numElements is specified, limit the data
    if (data['Technical Analysis: ' + indicatorName] && numElements) {
      const technicalData = data['Technical Analysis: ' + indicatorName];
      const dates = Object.keys(technicalData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      const limitedDates = dates.slice(0, numElements);
      
      const limitedData = {
        'Meta Data': data['Meta Data'],
        ['Technical Analysis: ' + indicatorName]: {}
      };
      
      limitedDates.forEach(date => {
        limitedData['Technical Analysis: ' + indicatorName][date] = technicalData[date];
      });
      
      markdown += `\`\`\`json\n${JSON.stringify(limitedData, null, 2)}\n\`\`\`\n\n`;
    } else {
      markdown += `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n`;
    }
    
    return markdown;
  }

  /**
   * Helper method to format large numbers with commas
   * @param num The number to format
   * @returns Formatted number string with commas
   */
  static formatNumber(num: string | number): string {
    if (!num) return 'N/A';
    
    const value = typeof num === 'string' ? parseFloat(num) : num;
    return value.toLocaleString('en-US');
  }
} 