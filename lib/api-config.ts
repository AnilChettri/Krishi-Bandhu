// API Configuration for FarmGuard - Hybrid Stack Implementation
export const API_CONFIG = {
  // Provider Configuration
  PROVIDER: {
    PRIMARY: process.env.AI_PROVIDER || 'localai', // localai, ollama, openai
    FALLBACK_PROVIDER: process.env.AI_FALLBACK_PROVIDER || 'openai',
    ENABLE_LOCAL_AI: process.env.ENABLE_LOCAL_AI !== 'false',
    LOCAL_AI_TIMEOUT: parseInt(process.env.LOCAL_AI_TIMEOUT || '45000'), // 45 seconds
    FALLBACK_PROVIDER_TIMEOUT: parseInt(process.env.FALLBACK_PROVIDER_TIMEOUT || '30000'), // 30 seconds
  },

  // OpenAI Configuration (External Fallback)
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
    // Primary weather API keys (supports multiple for rotation)
    API_KEYS: (process.env.WEATHER_API_KEYS || process.env.NEXT_PUBLIC_WEATHER_API_KEYS || '').
      split(',').filter(k => k.trim()),
    API_KEY: process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY,
    
    // Alternative weather providers for fallback
    WEATHERAPI_KEY: process.env.WEATHERAPI_KEY || process.env.NEXT_PUBLIC_WEATHERAPI_KEY,
    ACCUWEATHER_KEY: process.env.ACCUWEATHER_KEY || process.env.NEXT_PUBLIC_ACCUWEATHER_KEY,
    
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    HOURLY_FORECAST_URL: 'https://api.openweathermap.org/data/2.5/forecast',
    WEATHERAPI_URL: 'http://api.weatherapi.com/v1',
    UNITS: 'metric',
    DEFAULT_LAT: Number(process.env.WEATHER_DEFAULT_LAT) || 30.9010, // Ludhiana, Punjab (farming region)
    DEFAULT_LON: Number(process.env.WEATHER_DEFAULT_LON) || 75.8573,
    DEFAULT_CITY: process.env.WEATHER_DEFAULT_CITY || 'Ludhiana',
    
    // Cache and resilience settings
    CACHE_TTL: parseInt(process.env.WEATHER_CACHE_TTL || '1800000'), // 30 minutes
    FALLBACK_ENABLED: process.env.WEATHER_FALLBACK_ENABLED !== 'false',
    BACKGROUND_REFRESH: process.env.WEATHER_BACKGROUND_REFRESH !== 'false'
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

// Local AI Configuration
export const LOCAL_AI_CONFIG = {
  ENABLED: process.env.USE_LOCAL_AI === 'true' || process.env.NEXT_PUBLIC_USE_LOCAL_AI === 'true',
  
  // LocalAI configuration
  LOCALAI: {
    BASE_URL: process.env.LOCALAI_URL || process.env.NEXT_PUBLIC_LOCALAI_URL || 'http://localhost:8080',
    API_KEY: process.env.LOCALAI_API_KEY, // Optional for LocalAI
    TIMEOUT: 45000, // 45 seconds for model loading
    MODEL_CHAT: 'farmguard-chat',
    MODEL_QUICK: 'farmguard-quick',
    MODEL_EMBEDDING: 'text-embedding',
    ENDPOINTS: {
      COMPLETIONS: '/v1/chat/completions',
      EMBEDDINGS: '/v1/embeddings',
      MODELS: '/v1/models',
      HEALTH: '/readyz'
    }
  },
  
  // Ollama configuration (alternative to LocalAI)
  OLLAMA: {
    BASE_URL: process.env.OLLAMA_URL || process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434',
    TIMEOUT: 60000, // 60 seconds for larger models
    MODEL_CHAT: process.env.OLLAMA_MODEL || 'mistral:7b-instruct',
    MODEL_EMBEDDING: 'nomic-embed-text',
    ENDPOINTS: {
      GENERATE: '/api/generate',
      CHAT: '/api/chat',
      EMBEDDINGS: '/api/embeddings',
      MODELS: '/api/tags',
      HEALTH: '/api/version'
    }
  },
  
  // AI Backend configuration (FastAPI)
  AI_BACKEND: {
    BASE_URL: process.env.AI_BACKEND_URL || process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:8000',
    TIMEOUT: 30000, // 30 seconds
    ENDPOINTS: {
      CHAT: '/ai/chat',
      STREAM: '/ai/stream',
      RAG: '/ai/rag',
      MODELS: '/ai/models',
      WEATHER: '/weather/analysis',
      CROPS: '/crops/recommendations',
      MARKET: '/market/analysis',
      HEALTH: '/health'
    }
  },
  
  // Provider priority and configuration
  PROVIDER_PRIORITY: {
    PRIMARY: process.env.AI_PROVIDER || 'localai', // localai, ollama, ai_backend
    FALLBACK_ORDER: ['localai', 'ollama', 'ai_backend', 'openai', 'mock'],
    SWITCH_THRESHOLD: parseInt(process.env.PROVIDER_SWITCH_THRESHOLD || '3'), // Switch provider after N consecutive failures
    HEALTH_CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL || '300000'), // 5 minutes
    MAX_RETRIES: parseInt(process.env.MAX_RETRIES || '3'),
    RETRY_DELAY: parseInt(process.env.RETRY_DELAY || '1000'), // 1 second
  },
  
  // Circuit Breaker Configuration
  CIRCUIT_BREAKER: {
    FAILURE_THRESHOLD: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5'), // Number of failures before opening circuit
    SUCCESS_THRESHOLD: parseInt(process.env.CIRCUIT_BREAKER_SUCCESS_THRESHOLD || '3'), // Number of successes before closing circuit
    TIMEOUT: parseInt(process.env.CIRCUIT_BREAKER_COOLDOWN_MS || '60000'), // 1 minute timeout when circuit is open
    MONITOR_WINDOW: 300000, // 5 minute monitoring window
    HALF_OPEN_MAX_REQUESTS: 1, // Number of requests to allow in HALF_OPEN state
    RECOVERY_TIMEOUT: 30000, // 30 seconds before attempting recovery
  },

  // Features Configuration
  FEATURES: {
    SPEECH_TO_TEXT: process.env.ENABLE_SPEECH_TO_TEXT !== 'false',
    TEXT_TO_SPEECH: process.env.ENABLE_TEXT_TO_SPEECH !== 'false',
    TRANSLATION: process.env.ENABLE_TRANSLATION !== 'false',
    OFFLINE_MODE: process.env.ENABLE_OFFLINE_MODE === 'true',
    RAG_ENABLED: process.env.ENABLE_RAG !== 'false',
    IMAGE_ANALYSIS: process.env.ENABLE_IMAGE_ANALYSIS !== 'false',
    HUMAN_REVIEW: process.env.ENABLE_HUMAN_REVIEW !== 'false',
    RATE_LIMITING: process.env.ENABLE_RATE_LIMITING !== 'false',
    METRICS_COLLECTION: process.env.ENABLE_METRICS !== 'false',
    CACHE_ENABLED: process.env.ENABLE_CACHE !== 'false',
  },
  
  // Model configuration
  MODELS: {
    CHAT: {
      LOCALAI: 'farmguard-chat',
      OLLAMA: process.env.OLLAMA_MODEL || 'mistral:7b-instruct',
      OPENAI: 'gpt-3.5-turbo'
    },
    EMBEDDING: {
      LOCALAI: 'text-embedding',
      OLLAMA: 'nomic-embed-text',
      OPENAI: 'text-embedding-ada-002'
    },
    QUICK: {
      LOCALAI: 'farmguard-quick',
      OLLAMA: 'phi3:mini',
      OPENAI: 'gpt-3.5-turbo'
    }
  },
  
  // Fallback Configuration
  FALLBACK: {
    ENABLED: process.env.ENABLE_FALLBACK !== 'false',
    USE_MOCK_ON_ERROR: process.env.USE_MOCK_ON_ERROR !== 'false',
    RETRY_ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS || '3'),
    RETRY_DELAY: parseInt(process.env.RETRY_DELAY || '1000'), // 1 second
    EXPONENTIAL_BACKOFF: process.env.ENABLE_EXPONENTIAL_BACKOFF !== 'false',
    MAX_RETRY_DELAY: parseInt(process.env.MAX_RETRY_DELAY || '10000'), // 10 seconds
    FALLBACK_TO_EXTERNAL: process.env.ENABLE_EXTERNAL_FALLBACK !== 'false',
    EMERGENCY_FALLBACK: process.env.ENABLE_EMERGENCY_FALLBACK !== 'false',
  },

  // Monitoring and Observability
  MONITORING: {
    ENABLED: process.env.ENABLE_MONITORING !== 'false',
    METRICS_PORT: parseInt(process.env.METRICS_PORT || '9090'),
    PROMETHEUS_ENDPOINT: '/metrics',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    REQUEST_LOGGING: process.env.ENABLE_REQUEST_LOGGING !== 'false',
    RESPONSE_TIME_LOGGING: process.env.ENABLE_RESPONSE_TIME_LOGGING !== 'false',
    ERROR_TRACKING: process.env.ENABLE_ERROR_TRACKING !== 'false',
    SENTRY_DSN: process.env.SENTRY_DSN,
    SAMPLE_RATE: parseFloat(process.env.TRACE_SAMPLE_RATE || '0.1'),
  },

  // Rate Limiting
  RATE_LIMITING: {
    ENABLED: process.env.ENABLE_RATE_LIMITING !== 'false',
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    SKIP_SUCCESSFUL_REQUESTS: process.env.RATE_LIMIT_SKIP_SUCCESS !== 'false',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // Caching
  CACHE: {
    ENABLED: process.env.ENABLE_CACHE !== 'false',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    TTL: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour
    MAX_SIZE: parseInt(process.env.CACHE_MAX_SIZE || '1000'),
    STRATEGY: process.env.CACHE_STRATEGY || 'lru', // lru, fifo
  },

  // Security
  SECURITY: {
    ENABLE_INPUT_SANITIZATION: process.env.ENABLE_INPUT_SANITIZATION !== 'false',
    MAX_INPUT_LENGTH: parseInt(process.env.MAX_INPUT_LENGTH || '2000'),
    ALLOWED_LANGUAGES: process.env.ALLOWED_LANGUAGES?.split(',') || ['en', 'hi', 'kn', 'pa', 'ta', 'te', 'mr', 'gu', 'bn', 'ml'],
    BLOCKED_PATTERNS: [
      /password/i,
      /secret/i,
      /token/i,
      /key/i,
      /api[_\-]?key/i,
    ],
    RATE_LIMIT_BY_IP: process.env.ENABLE_IP_RATE_LIMIT !== 'false',
  },

  // Performance
  PERFORMANCE: {
    TIMEOUT: parseInt(process.env.GLOBAL_TIMEOUT || '30000'), // 30 seconds
    KEEP_ALIVE: process.env.ENABLE_KEEP_ALIVE !== 'false',
    COMPRESSION: process.env.ENABLE_COMPRESSION !== 'false',
    MAX_CONCURRENT_REQUESTS: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '50'),
  },
}

// Helper function to check if local AI is available
export async function checkLocalAIHealth(): Promise<boolean> {
  if (!LOCAL_AI_CONFIG.ENABLED) {
    return false
  }
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(`${LOCAL_AI_CONFIG.LOCALAI.BASE_URL}${LOCAL_AI_CONFIG.LOCALAI.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.warn('Local AI health check failed:', error)
    return false
  }
}

// Helper function to call local AI with fallback
export async function callLocalAI(endpoint: string, data: any, options: RequestInit = {}): Promise<any> {
  const url = `${LOCAL_AI_CONFIG.LOCALAI.BASE_URL}${endpoint}`
  
  for (let attempt = 1; attempt <= LOCAL_AI_CONFIG.FALLBACK.RETRY_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), LOCAL_AI_CONFIG.LOCALAI.TIMEOUT)
      
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options
      }
      
      const response = await fetch(url, requestOptions)
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
      
    } catch (error) {
      console.error(`Local AI call attempt ${attempt} failed:`, error)
      
      if (attempt === LOCAL_AI_CONFIG.FALLBACK.RETRY_ATTEMPTS) {
        if (LOCAL_AI_CONFIG.FALLBACK.USE_MOCK_ON_ERROR) {
          console.warn('Falling back to mock response')
          throw new Error('LOCAL_AI_UNAVAILABLE')
        }
        throw error
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, LOCAL_AI_CONFIG.FALLBACK.RETRY_DELAY * attempt))
    }
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
