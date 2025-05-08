import { BenzingaService } from './BenzingaApiClient';

async function testBenzingaApi() {
  const benzingaService = new BenzingaService();

  try {
    // Get one news item with full content to inspect structure
    const news = await benzingaService.getNews({
      displayOutput: 'full',
      pageSize: 1,
      // Add a ticker to narrow down results
      tickers: 'AAPL'
    });

    // Log the entire response to inspect structure
    console.log('Full API response:');
    console.log(JSON.stringify(news, null, 2));

    // Check if body and teaser exist
    console.log('\nBody and teaser check:');
    if (news.length > 0) {
      console.log(`Has 'body': ${news[0].body !== undefined}`);
      console.log(`Body length: ${news[0].body?.length || 0}`);
      console.log(`Has 'teaser': ${news[0].teaser !== undefined}`);
      console.log(`Teaser length: ${news[0].teaser?.length || 0}`);
    } else {
      console.log('No news items returned');
    }
  } catch (error) {
    console.error('Error testing Benzinga API:', error);
  }
}

testBenzingaApi(); 