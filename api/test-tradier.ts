import axios from 'axios';

async function testTradierApi() {
  const apiKey = 'RMWSde4gWI5cq0vR2wJgtRvfsIwy';
  const baseUrl = 'https://api.tradier.com/v1';
  
  console.log('Testing Tradier API with provided key...');
  
  try {
    // Test a simple market quotes endpoint with a well-known symbol
    const response = await axios.get(`${baseUrl}/markets/quotes`, {
      params: {
        symbols: 'AAPL'
      },
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
    console.log('Tradier API key is working correctly!');
    
  } catch (error) {
    console.error('Error testing Tradier API:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

testTradierApi(); 