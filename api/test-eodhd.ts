import axios from 'axios';

async function testEODHDApi() {
  // You need to replace this with your actual EODHD API key
  const apiKey = 'your-eodhd-api-key';
  const baseUrl = 'https://eodhistoricaldata.com/api';
  
  console.log('Testing EODHD API with provided key...');
  
  try {
    // Test the economic calendar endpoint - the one that's failing in your app
    const from = '2023-05-01';
    const to = '2023-05-07';
    const country = 'US';
    
    const response = await axios.get(`${baseUrl}/calendar/economic`, {
      params: {
        api_token: apiKey,
        from,
        to,
        country
      }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data Sample:', JSON.stringify(response.data.slice(0, 2), null, 2));
    console.log('EODHD API key is working correctly!');
    
  } catch (error) {
    console.error('Error testing EODHD API:');
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

testEODHDApi(); 