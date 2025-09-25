const https = require('https');
const fs = require('fs');

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
const env = {};
envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

async function testOpenAI(key) {
  return new Promise((resolve) => {
    if (!key || key === 'your_openai_key_here') {
      resolve({ valid: false, error: 'No key provided' });
      return;
    }

    const req = https.request('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'User-Agent': 'FarmGuard/1.0'
      },
      timeout: 10000
    }, (res) => {
      resolve({ 
        valid: res.statusCode === 200, 
        status: res.statusCode,
        error: res.statusCode !== 200 ? `HTTP ${res.statusCode}` : null
      });
    });

    req.on('error', (error) => {
      resolve({ valid: false, error: error.message });
    });

    req.on('timeout', () => {
      resolve({ valid: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function testCohere(key) {
  return new Promise((resolve) => {
    if (!key || key === 'your_cohere_key_here') {
      resolve({ valid: false, error: 'No key provided' });
      return;
    }

    const req = https.request('https://api.cohere.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'User-Agent': 'FarmGuard/1.0'
      },
      timeout: 10000
    }, (res) => {
      resolve({ 
        valid: res.statusCode === 200, 
        status: res.statusCode,
        error: res.statusCode !== 200 ? `HTTP ${res.statusCode}` : null
      });
    });

    req.on('error', (error) => {
      resolve({ valid: false, error: error.message });
    });

    req.on('timeout', () => {
      resolve({ valid: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function main() {
  console.log('🔍 Testing existing API keys...\n');

  // Test OpenAI
  console.log('Testing OpenAI API key...');
  const openaiResult = await testOpenAI(env.OPENAI_API_KEY);
  console.log(`OpenAI: ${openaiResult.valid ? '✅ VALID' : '❌ INVALID'} ${openaiResult.error || ''}`);

  // Test Cohere
  console.log('Testing Cohere API key...');
  const cohereResult = await testCohere(env.COHERE_API_KEY);
  console.log(`Cohere: ${cohereResult.valid ? '✅ VALID' : '❌ INVALID'} ${cohereResult.error || ''}`);

  // Weather key status
  const weatherKey = env.WEATHER_API_KEY;
  console.log(`Weather: ${weatherKey === 'your_weather_api_key_here' ? '❌ NOT SET' : '❓ NEEDS TESTING'}`);

  console.log('\n📝 Summary:');
  const workingKeys = [openaiResult.valid, cohereResult.valid].filter(Boolean).length;
  console.log(`${workingKeys}/2 AI keys are working`);
  
  if (workingKeys > 0) {
    console.log('✅ AI functionality will use real APIs');
  } else {
    console.log('⚠️  AI will use local models only');
  }

  if (weatherKey === 'your_weather_api_key_here') {
    console.log('🌦️  PRIORITY: Get a weather API key for real-time weather');
    console.log('   Free at: https://openweathermap.org/api');
  }
}

main().catch(console.error);