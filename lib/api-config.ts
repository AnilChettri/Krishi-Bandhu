// API Configuration for FarmGuard
export const API_CONFIG = {
  OPENAI: {
    API_KEY: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    BASE_URL: 'https://api.openai.com/v1',
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7
  },
  
  COHERE: {
    API_KEY: process.env.COHERE_API_KEY || process.env.NEXT_PUBLIC_COHERE_API_KEY,
    BASE_URL: 'https://api.cohere.ai/v1',
    MODEL: 'command-light',
    MAX_TOKENS: 500
  },
  
  WEATHER: {
    API_KEY: process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY || '91360454e88e0ed9028745c4d7c6aacc',
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    HOURLY_FORECAST_URL: 'https://api.openweathermap.org/data/2.5/forecast',
    UNITS: 'metric',
    DEFAULT_LAT: Number(process.env.WEATHER_DEFAULT_LAT) || 30.9010, // Ludhiana, Punjab (farming region)
    DEFAULT_LON: Number(process.env.WEATHER_DEFAULT_LON) || 75.8573,
    DEFAULT_CITY: process.env.WEATHER_DEFAULT_CITY || 'Ludhiana'
  },
  
  // Application settings
  APP: {
    BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    USE_MOCK_DATA: process.env.USE_MOCK_DATA === 'true' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
    DEBUG: process.env.DEBUG === 'true' || process.env.NEXT_PUBLIC_DEBUG === 'true'
  },
  
  // Mock data endpoints for development
  MOCK_ENDPOINTS: {
    WEATHER: '/api/mock/weather',
    MARKET_PRICES: '/api/mock/market-prices',
    CROP_SUGGESTIONS: '/api/mock/crop-suggestions',
    AI_ASSISTANT: '/api/mock/ai-assistant'
  }
}

// Validate API keys on startup
export function validateAPIKeys() {
  const required = ['OPENAI_API_KEY', 'COHERE_API_KEY']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.warn(`Missing API keys: ${missing.join(', ')}`)
    return false
  }
  
  return true
}

// Rate limiting configuration
export const RATE_LIMITS = {
  AI_ASSISTANT: {
    requests: 50,
    window: 3600000 // 1 hour
  },
  WEATHER: {
    requests: 1000,
    window: 3600000 // 1 hour  
  }
}
