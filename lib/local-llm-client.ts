/**
 * Enhanced Local LLM Client for FarmGuard
 * Supports LocalAI, Ollama, and AI Backend with circuit breaker pattern
 * Implements fallback strategy and health monitoring
 */

import { LOCAL_AI_CONFIG } from './api-config'

// Types
interface LLMRequest {
  prompt: string
  model?: string
  temperature?: number
  max_tokens?: number
  language?: string
  context?: string[]
  stream?: boolean
}

interface LLMResponse {
  content: string
  model: string
  source: string
  response_time: number
  tokens_used?: number
  confidence?: number
  language?: string
  metadata?: any
}

interface CircuitBreakerState {
  failures: number
  successes: number
  lastFailureTime: number
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN'
}

interface ProviderHealth {
  provider: string
  healthy: boolean
  lastCheck: number
  responseTime?: number
  error?: string
}

type AIProvider = 'localai' | 'ollama' | 'ai_backend' | 'openai' | 'mock'

// Circuit breaker for each provider
const circuitBreakers = new Map<AIProvider, CircuitBreakerState>()
const providerHealth = new Map<AIProvider, ProviderHealth>()

// Initialize circuit breakers
const initCircuitBreaker = (provider: AIProvider): CircuitBreakerState => {
  return {
    failures: 0,
    successes: 0,
    lastFailureTime: 0,
    state: 'CLOSED'
  }
}

// Circuit breaker logic
const shouldAllowRequest = (provider: AIProvider): boolean => {
  const breaker = circuitBreakers.get(provider) || initCircuitBreaker(provider)
  const now = Date.now()
  
  switch (breaker.state) {
    case 'CLOSED':
      return true
      
    case 'OPEN':
      if (now - breaker.lastFailureTime > LOCAL_AI_CONFIG.CIRCUIT_BREAKER.TIMEOUT) {
        breaker.state = 'HALF_OPEN'
        circuitBreakers.set(provider, breaker)
        return true
      }
      return false
      
    case 'HALF_OPEN':
      return true
      
    default:
      return true
  }
}

const recordSuccess = (provider: AIProvider): void => {
  const breaker = circuitBreakers.get(provider) || initCircuitBreaker(provider)
  breaker.successes++
  breaker.failures = 0
  
  if (breaker.state === 'HALF_OPEN' && 
      breaker.successes >= LOCAL_AI_CONFIG.CIRCUIT_BREAKER.SUCCESS_THRESHOLD) {
    breaker.state = 'CLOSED'
  }
  
  circuitBreakers.set(provider, breaker)
}

const recordFailure = (provider: AIProvider): void => {
  const breaker = circuitBreakers.get(provider) || initCircuitBreaker(provider)
  breaker.failures++
  breaker.lastFailureTime = Date.now()
  
  if (breaker.failures >= LOCAL_AI_CONFIG.CIRCUIT_BREAKER.FAILURE_THRESHOLD) {
    breaker.state = 'OPEN'
  }
  
  circuitBreakers.set(provider, breaker)
}

// Health check functions
export const checkLocalAIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `${LOCAL_AI_CONFIG.LOCALAI.BASE_URL}${LOCAL_AI_CONFIG.LOCALAI.ENDPOINTS.HEALTH}`,
      {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      }
    )
    
    const isHealthy = response.ok
    updateProviderHealth('localai', isHealthy)
    return isHealthy
  } catch (error) {
    console.warn('LocalAI health check failed:', error)
    updateProviderHealth('localai', false, error)
    return false
  }
}

export const checkOllamaHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `${LOCAL_AI_CONFIG.OLLAMA.BASE_URL}${LOCAL_AI_CONFIG.OLLAMA.ENDPOINTS.HEALTH}`,
      {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      }
    )
    
    const isHealthy = response.ok
    updateProviderHealth('ollama', isHealthy)
    return isHealthy
  } catch (error) {
    console.warn('Ollama health check failed:', error)
    updateProviderHealth('ollama', false, error)
    return false
  }
}

export const checkAIBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `${LOCAL_AI_CONFIG.AI_BACKEND.BASE_URL}${LOCAL_AI_CONFIG.AI_BACKEND.ENDPOINTS.HEALTH}`,
      {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      }
    )
    
    const isHealthy = response.ok
    updateProviderHealth('ai_backend', isHealthy)
    return isHealthy
  } catch (error) {
    console.warn('AI Backend health check failed:', error)
    updateProviderHealth('ai_backend', false, error)
    return false
  }
}

const updateProviderHealth = (
  provider: AIProvider, 
  healthy: boolean, 
  error?: any
): void => {
  providerHealth.set(provider, {
    provider,
    healthy,
    lastCheck: Date.now(),
    error: error ? String(error) : undefined
  })
}

// Provider implementations
const callLocalAI = async (request: LLMRequest): Promise<LLMResponse> => {
  const startTime = Date.now()
  
  const messages = [
    {
      role: 'system',
      content: `You are FarmGuard AI, an agricultural assistant for Indian farmers. Provide practical, actionable advice. Respond in ${request.language || 'English'}.`
    },
    {
      role: 'user',
      content: request.prompt
    }
  ]

  if (request.context && request.context.length > 0) {
    messages.unshift({
      role: 'system',
      content: `Context information:\n${request.context.join('\n\n')}`
    })
  }
  
  const response = await fetch(
    `${LOCAL_AI_CONFIG.LOCALAI.BASE_URL}${LOCAL_AI_CONFIG.LOCALAI.ENDPOINTS.COMPLETIONS}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(LOCAL_AI_CONFIG.LOCALAI.API_KEY && {
          'Authorization': `Bearer ${LOCAL_AI_CONFIG.LOCALAI.API_KEY}`
        })
      },
      body: JSON.stringify({
        model: request.model || LOCAL_AI_CONFIG.MODELS.CHAT.LOCALAI,
        messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
        stream: request.stream || false
      }),
      signal: AbortSignal.timeout(LOCAL_AI_CONFIG.LOCALAI.TIMEOUT)
    }
  )

  if (!response.ok) {
    throw new Error(`LocalAI API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const responseTime = Date.now() - startTime

  return {
    content: data.choices[0]?.message?.content || 'No response generated',
    model: data.model || request.model || LOCAL_AI_CONFIG.MODELS.CHAT.LOCALAI,
    source: 'localai',
    response_time: responseTime,
    tokens_used: data.usage?.total_tokens,
    language: request.language,
    metadata: {
      usage: data.usage,
      finish_reason: data.choices[0]?.finish_reason
    }
  }
}

const callOllama = async (request: LLMRequest): Promise<LLMResponse> => {
  const startTime = Date.now()
  
  let prompt = request.prompt
  if (request.context && request.context.length > 0) {
    prompt = `Context:\n${request.context.join('\n\n')}\n\nQuestion: ${request.prompt}`
  }

  const response = await fetch(
    `${LOCAL_AI_CONFIG.OLLAMA.BASE_URL}${LOCAL_AI_CONFIG.OLLAMA.ENDPOINTS.GENERATE}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model || LOCAL_AI_CONFIG.MODELS.CHAT.OLLAMA,
        prompt,
        system: `You are FarmGuard AI, an agricultural assistant for Indian farmers. Provide practical, actionable advice. Respond in ${request.language || 'English'}.`,
        temperature: request.temperature || 0.7,
        stream: false,
        options: {
          num_predict: request.max_tokens || 1000
        }
      }),
      signal: AbortSignal.timeout(LOCAL_AI_CONFIG.OLLAMA.TIMEOUT)
    }
  )

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const responseTime = Date.now() - startTime

  return {
    content: data.response || 'No response generated',
    model: data.model || request.model || LOCAL_AI_CONFIG.MODELS.CHAT.OLLAMA,
    source: 'ollama',
    response_time: responseTime,
    language: request.language,
    metadata: {
      total_duration: data.total_duration,
      load_duration: data.load_duration,
      prompt_eval_count: data.prompt_eval_count,
      eval_count: data.eval_count
    }
  }
}

const callAIBackend = async (request: LLMRequest): Promise<LLMResponse> => {
  const startTime = Date.now()
  
  const response = await fetch(
    `${LOCAL_AI_CONFIG.AI_BACKEND.BASE_URL}${LOCAL_AI_CONFIG.AI_BACKEND.ENDPOINTS.CHAT}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: request.prompt,
        model: request.model,
        language: request.language,
        context: request.context,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000
      }),
      signal: AbortSignal.timeout(LOCAL_AI_CONFIG.AI_BACKEND.TIMEOUT)
    }
  )

  if (!response.ok) {
    throw new Error(`AI Backend error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const responseTime = Date.now() - startTime

  return {
    content: data.content || data.response || 'No response generated',
    model: data.model || request.model || 'ai-backend',
    source: 'ai_backend',
    response_time: responseTime,
    tokens_used: data.tokens_used,
    confidence: data.confidence,
    language: data.language || request.language,
    metadata: data.metadata
  }
}

// Main client function with fallback logic
export const callLocalLLM = async (request: LLMRequest): Promise<LLMResponse> => {
  const providers = LOCAL_AI_CONFIG.PROVIDER_PRIORITY.FALLBACK_ORDER as AIProvider[]
  let lastError: Error | null = null

  // Try each provider in order
  for (const provider of providers) {
    if (provider === 'openai' || provider === 'mock') {
      continue // Skip external providers in local client
    }

    // Check circuit breaker
    if (!shouldAllowRequest(provider)) {
      console.warn(`Circuit breaker OPEN for ${provider}, skipping...`)
      continue
    }

    try {
      let response: LLMResponse

      switch (provider) {
        case 'localai':
          response = await callLocalAI(request)
          break
        case 'ollama':
          response = await callOllama(request)
          break
        case 'ai_backend':
          response = await callAIBackend(request)
          break
        default:
          continue
      }

      // Record success and return response
      recordSuccess(provider)
      updateProviderHealth(provider, true)
      
      console.log(`✅ ${provider.toUpperCase()} responded in ${response.response_time}ms`)
      return response

    } catch (error) {
      lastError = error as Error
      recordFailure(provider)
      updateProviderHealth(provider, false, error)
      
      console.error(`❌ ${provider.toUpperCase()} failed:`, error)
      
      // Continue to next provider
      continue
    }
  }

  // If all providers failed, throw the last error
  throw new Error(
    `All local AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`
  )
}

// Utility functions
export const getProviderHealth = (): Map<AIProvider, ProviderHealth> => {
  return new Map(providerHealth)
}

export const getCircuitBreakerState = (): Map<AIProvider, CircuitBreakerState> => {
  return new Map(circuitBreakers)
}

export const resetCircuitBreaker = (provider: AIProvider): void => {
  circuitBreakers.set(provider, initCircuitBreaker(provider))
}

// Periodic health checks (run every 5 minutes)
let healthCheckInterval: NodeJS.Timeout | null = null

export const startHealthMonitoring = (): void => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
  }

  healthCheckInterval = setInterval(async () => {
    try {
      await Promise.allSettled([
        checkLocalAIHealth(),
        checkOllamaHealth(),
        checkAIBackendHealth()
      ])
    } catch (error) {
      console.error('Health check error:', error)
    }
  }, 300000) // 5 minutes
}

export const stopHealthMonitoring = (): void => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
    healthCheckInterval = null
  }
}

// Auto-start health monitoring
if (typeof window === 'undefined') {
  // Server-side only
  startHealthMonitoring()
}