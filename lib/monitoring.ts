/**
 * Monitoring and Observability Module for FarmGuard
 * Implements Prometheus metrics, logging, and performance tracking
 */

import { API_CONFIG, LOCAL_AI_CONFIG } from './api-config'

// Types
interface MetricData {
  name: string
  value: number
  labels?: Record<string, string>
  timestamp?: number
}

interface HistogramData {
  name: string
  value: number
  labels?: Record<string, string>
  buckets?: number[]
}

interface PerformanceMetrics {
  requestCount: number
  responseTimeSum: number
  errorCount: number
  lastRequestTime: number
  averageResponseTime: number
}

// Metrics storage
const counters = new Map<string, number>()
const gauges = new Map<string, number>()
const histograms = new Map<string, number[]>()
const performanceMetrics = new Map<string, PerformanceMetrics>()

// Initialize metrics
const initializeMetrics = () => {
  // Request metrics
  counters.set('farmguard_requests_total', 0)
  counters.set('farmguard_errors_total', 0)
  counters.set('farmguard_llm_requests_total', 0)
  counters.set('farmguard_llm_errors_total', 0)
  
  // Response time metrics
  gauges.set('farmguard_response_time_seconds', 0)
  gauges.set('farmguard_llm_response_time_seconds', 0)
  gauges.set('farmguard_active_requests', 0)
  
  // Provider metrics
  counters.set('farmguard_provider_requests_total', 0)
  counters.set('farmguard_provider_errors_total', 0)
  gauges.set('farmguard_provider_health', 1)
  
  // Feature usage metrics
  counters.set('farmguard_rag_requests_total', 0)
  counters.set('farmguard_image_analysis_requests_total', 0)
  counters.set('farmguard_voice_requests_total', 0)
  
  // Cache metrics
  counters.set('farmguard_cache_hits_total', 0)
  counters.set('farmguard_cache_misses_total', 0)
  gauges.set('farmguard_cache_size', 0)
}

// Utility functions
const incrementCounter = (name: string, labels?: Record<string, string>, value: number = 1) => {
  if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) return
  
  const key = labels ? `${name}_${JSON.stringify(labels)}` : name
  const current = counters.get(key) || 0
  counters.set(key, current + value)
  
  if (LOCAL_AI_CONFIG.MONITORING.REQUEST_LOGGING) {
    console.log(`[METRIC] Counter ${name} incremented by ${value}`, labels)
  }
}

const setGauge = (name: string, value: number, labels?: Record<string, string>) => {
  if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) return
  
  const key = labels ? `${name}_${JSON.stringify(labels)}` : name
  gauges.set(key, value)
  
  if (LOCAL_AI_CONFIG.MONITORING.REQUEST_LOGGING) {
    console.log(`[METRIC] Gauge ${name} set to ${value}`, labels)
  }
}

const observeHistogram = (name: string, value: number, labels?: Record<string, string>) => {
  if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) return
  
  const key = labels ? `${name}_${JSON.stringify(labels)}` : name
  const values = histograms.get(key) || []
  values.push(value)
  histograms.set(key, values)
  
  if (LOCAL_AI_CONFIG.MONITORING.RESPONSE_TIME_LOGGING) {
    console.log(`[METRIC] Histogram ${name} observed value ${value}`, labels)
  }
}

// Performance tracking
const trackPerformance = (endpoint: string, responseTime: number, isError: boolean = false) => {
  if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) return
  
  const metrics = performanceMetrics.get(endpoint) || {
    requestCount: 0,
    responseTimeSum: 0,
    errorCount: 0,
    lastRequestTime: 0,
    averageResponseTime: 0
  }
  
  metrics.requestCount++
  metrics.responseTimeSum += responseTime
  metrics.lastRequestTime = Date.now()
  
  if (isError) {
    metrics.errorCount++
  }
  
  metrics.averageResponseTime = metrics.responseTimeSum / metrics.requestCount
  performanceMetrics.set(endpoint, metrics)
  
  // Update global metrics
  incrementCounter('farmguard_requests_total', { endpoint })
  setGauge('farmguard_response_time_seconds', responseTime / 1000, { endpoint })
  
  if (isError) {
    incrementCounter('farmguard_errors_total', { endpoint })
  }
}

// LLM-specific metrics
export const trackLLMRequest = (provider: string, model: string, responseTime: number, isError: boolean = false) => {
  if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) return
  
  const labels = { provider, model }
  
  incrementCounter('farmguard_llm_requests_total', labels)
  observeHistogram('farmguard_llm_response_time_seconds', responseTime / 1000, labels)
  setGauge('farmguard_llm_response_time_seconds', responseTime / 1000, labels)
  
  if (isError) {
    incrementCounter('farmguard_llm_errors_total', labels)
  }
  
  if (LOCAL_AI_CONFIG.MONITORING.RESPONSE_TIME_LOGGING) {
    console.log(`[LLM] ${provider}/${model} - ${responseTime}ms - Error: ${isError}`)
  }
}

// Provider health tracking
export const trackProviderHealth = (provider: string, isHealthy: boolean, responseTime?: number) => {
  if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) return
  
  setGauge('farmguard_provider_health', isHealthy ? 1 : 0, { provider })
  
  if (responseTime) {
    observeHistogram('farmguard_provider_health_check_duration_seconds', responseTime / 1000, { provider })
  }
  
  if (LOCAL_AI_CONFIG.MONITORING.REQUEST_LOGGING) {
    console.log(`[HEALTH] ${provider} - Healthy: ${isHealthy} - Response Time: ${responseTime}ms`)
  }
}

// Feature usage tracking
export const trackFeatureUsage = (feature: string, method: string = 'request') => {
  if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) return
  
  incrementCounter(`farmguard_${feature}_requests_total`, { method })
  
  if (LOCAL_AI_CONFIG.MONITORING.REQUEST_LOGGING) {
    console.log(`[FEATURE] ${feature} used via ${method}`)
  }
}

// Cache metrics
export const trackCacheOperation = (operation: 'hit' | 'miss', key?: string) => {
  if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) return
  
  incrementCounter(`farmguard_cache_${operation}s_total`, key ? { key } : undefined)
  
  if (LOCAL_AI_CONFIG.MONITORING.REQUEST_LOGGING) {
    console.log(`[CACHE] ${operation.toUpperCase()}${key ? ` for key: ${key}` : ''}`)
  }
}

// Prometheus metrics export
export const generatePrometheusMetrics = (): string => {
  if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) return '# Metrics disabled\n'
  
  let output = '# FarmGuard Metrics\n'
  output += '# Generated at: ' + new Date().toISOString() + '\n\n'
  
  // Export counters
  for (const [key, value] of counters.entries()) {
    let name = key
    let labels = ''
    
    // Parse labels from key
    if (key.includes('{')) {
      const match = key.match(/^(.+?)_\{(.+)\}$/)
      if (match) {
        name = match[1]
        try {
          const labelObj = JSON.parse(match[2].replace(/"/g, '"'))
          labels = '{' + Object.entries(labelObj).map(([k, v]) => `${k}="${v}"`).join(',') + '}'
        } catch (e) {
          // Invalid JSON, skip labels
        }
      }
    }
    
    output += `# TYPE ${name} counter\n`
    output += `${name}${labels} ${value}\n\n`
  }
  
  // Export gauges
  for (const [key, value] of gauges.entries()) {
    let name = key
    let labels = ''
    
    // Parse labels from key
    if (key.includes('{')) {
      const match = key.match(/^(.+?)_\{(.+)\}$/)
      if (match) {
        name = match[1]
        try {
          const labelObj = JSON.parse(match[2].replace(/"/g, '"'))
          labels = '{' + Object.entries(labelObj).map(([k, v]) => `${k}="${v}"`).join(',') + '}'
        } catch (e) {
          // Invalid JSON, skip labels
        }
      }
    }
    
    output += `# TYPE ${name} gauge\n`
    output += `${name}${labels} ${value}\n\n`
  }
  
  // Export histograms (simplified)
  for (const [key, values] of histograms.entries()) {
    let name = key
    let labels = ''
    
    // Parse labels from key
    if (key.includes('{')) {
      const match = key.match(/^(.+?)_\{(.+)\}$/)
      if (match) {
        name = match[1]
        try {
          const labelObj = JSON.parse(match[2].replace(/"/g, '"'))
          labels = '{' + Object.entries(labelObj).map(([k, v]) => `${k}="${v}"`).join(',') + '}'
        } catch (e) {
          // Invalid JSON, skip labels
        }
      }
    }
    
    output += `# TYPE ${name} histogram\n`
    
    // Calculate basic histogram stats
    if (values.length > 0) {
      const count = values.length
      const sum = values.reduce((a, b) => a + b, 0)
      const avg = sum / count
      
      output += `${name}_count${labels} ${count}\n`
      output += `${name}_sum${labels} ${sum}\n`
      output += `${name}_avg${labels} ${avg}\n\n`
    }
  }
  
  return output
}

// Performance monitoring middleware
export const createPerformanceMiddleware = (endpoint: string) => {
  return async (handler: () => Promise<any>) => {
    if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) {
      return handler()
    }
    
    const startTime = Date.now()
    let isError = false
    
    try {
      setGauge('farmguard_active_requests', 1, { endpoint })
      const result = await handler()
      return result
    } catch (error) {
      isError = true
      throw error
    } finally {
      const responseTime = Date.now() - startTime
      setGauge('farmguard_active_requests', 0, { endpoint })
      trackPerformance(endpoint, responseTime, isError)
    }
  }
}

// Health check for monitoring
export const getMonitoringHealth = () => {
  return {
    enabled: LOCAL_AI_CONFIG.MONITORING.ENABLED,
    metrics_count: counters.size + gauges.size + histograms.size,
    performance_metrics: performanceMetrics.size,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }
}

// Initialize metrics on module load
initializeMetrics()

// Export metrics endpoint handler
export const handleMetricsRequest = (request: Request) => {
  if (!LOCAL_AI_CONFIG.MONITORING.ENABLED) {
    return new Response('# Metrics disabled', { status: 404 })
  }
  
  const metrics = generatePrometheusMetrics()
  
  return new Response(metrics, {
    headers: {
      'Content-Type': 'text/plain; version=0.0.4',
    },
  })
}

// Cleanup old metrics (prevent memory leaks)
export const cleanupOldMetrics = (maxAge: number = 3600000) => { // 1 hour default
  const now = Date.now()
  
  // Clean old performance metrics
  for (const [endpoint, metrics] of performanceMetrics.entries()) {
    if (now - metrics.lastRequestTime > maxAge) {
      performanceMetrics.delete(endpoint)
    }
  }
  
  // Clean old histogram data
  for (const [key, values] of histograms.entries()) {
    if (values.length > 1000) { // Keep only last 1000 values
      histograms.set(key, values.slice(-1000))
    }
  }
}

// Schedule cleanup every hour
if (typeof window === 'undefined') {
  setInterval(cleanupOldMetrics, 3600000)
}
