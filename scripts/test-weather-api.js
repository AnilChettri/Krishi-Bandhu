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

async function testWeatherAPI() {
  const apiKey = env.WEATHER_API_KEY;
  
  if (!apiKey || apiKey === 'GET_YOUR_FREE_KEY') {
    console.log('❌ Weather API key not configured');
    return;
  }

  console.log('🌦️ Testing Weather API with your key...');
  
  // Test for Ludhiana, Punjab (major farming area)
  const lat = 30.9010;
  const lon = 75.8573;
  
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  return new Promise((resolve) => {
    const req = https.request(url, {
      method: 'GET',
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const weatherData = JSON.parse(data);
          
          if (res.statusCode === 200 && weatherData.list) {
            console.log('✅ Weather API is working!');
            console.log(`📍 Location: ${weatherData.city.name}, ${weatherData.city.country}`);
            console.log(`🌡️ Current: ${Math.round(weatherData.list[0].main.temp)}°C`);
            console.log(`🌦️ Condition: ${weatherData.list[0].weather[0].description}`);
            console.log(`💧 Humidity: ${weatherData.list[0].main.humidity}%`);
            console.log(`💨 Wind: ${Math.round(weatherData.list[0].wind.speed * 3.6)} km/h`);
            
            // Check for severe weather conditions
            const temp = weatherData.list[0].main.temp;
            const windSpeed = weatherData.list[0].wind.speed * 3.6;
            const condition = weatherData.list[0].weather[0].main;
            
            console.log('\n🚨 Alert Check:');
            if (temp > 40) {
              console.log('⚠️ HIGH TEMPERATURE ALERT - Heat stress conditions!');
            }
            if (windSpeed > 30) {
              console.log('⚠️ HIGH WIND ALERT - Strong winds detected!');
            }
            if (condition.includes('Rain') || condition.includes('Thunderstorm')) {
              console.log('⚠️ PRECIPITATION ALERT - Rain/storm conditions!');
            }
            if (temp > 40 || windSpeed > 30 || condition.includes('Rain') || condition.includes('Thunderstorm')) {
              console.log('🔔 Your dashboard will show blinking alerts for these conditions!');
            } else {
              console.log('✅ No severe weather alerts for current conditions');
            }
            
          } else {
            console.log('❌ Weather API returned error:', weatherData.message || 'Unknown error');
          }
        } catch (error) {
          console.log('❌ Failed to parse weather response:', error.message);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log('❌ Weather API request failed:', error.message);
      resolve();
    });

    req.on('timeout', () => {
      console.log('❌ Weather API request timed out');
      resolve();
    });

    req.end();
  });
}

async function main() {
  console.log('🧪 Testing FarmGuard Real-Time APIs\n');
  
  await testWeatherAPI();
  
  console.log('\n📋 Next Steps:');
  console.log('1. Run "npm run dev" to start your dashboard');
  console.log('2. Navigate to /dashboard to see real-time weather data');
  console.log('3. Weather alerts will blink and show sound notifications for severe conditions');
  console.log('4. Critical alerts will show full-screen overlays with emergency instructions');
}

main().catch(console.error);