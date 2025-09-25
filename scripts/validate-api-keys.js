#!/usr/bin/env node

// API Key Validation Script for FarmGuard
const https = require('https')
const { URL } = require('url')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

class APIKeyValidator {
  async validateOpenAI(key) {
    if (!key) return { valid: false, error: 'No API key provided' }
    
    try {
      const response = await this.makeRequest('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'User-Agent': 'FarmGuard/1.0'
        }
      })
      
      return { valid: response.statusCode === 200, statusCode: response.statusCode }
    } catch (error) {
      return { valid: false, error: error.message }
    }
  }

  async validateCohere(key) {
    if (!key) return { valid: false, error: 'No API key provided' }
    
    try {
      const response = await this.makeRequest('https://api.cohere.ai/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'User-Agent': 'FarmGuard/1.0'
        }
      })
      
      return { valid: response.statusCode === 200, statusCode: response.statusCode }
    } catch (error) {
      return { valid: false, error: error.message }
    }
  }

  async validateWeatherAPI(key) {
    if (!key || key === 'your_weather_api_key_here') {
      return { valid: false, error: 'Weather API key not configured' }
    }
    
    try {
      const response = await this.makeRequest(
        `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${key}&units=metric`
      )
      
      return { valid: response.statusCode === 200, statusCode: response.statusCode }
    } catch (error) {
      return { valid: false, error: error.message }
    }
  }

  makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url)
      const requestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: options.method || 'GET',
        headers: options.headers || {},
        timeout: 10000
      }

      const req = https.request(requestOptions, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          })
        })
      })

      req.on('error', reject)
      req.on('timeout', () => reject(new Error('Request timeout')))
      
      if (options.body) {
        req.write(options.body)
      }
      
      req.end()
    })
  }

  async validateAll() {
    console.log('🔍 Validating FarmGuard API Keys...\n')

    const results = {}

    // OpenAI
    console.log('Checking OpenAI API Key...')
    results.openai = await this.validateOpenAI(process.env.OPENAI_API_KEY)
    console.log(`OpenAI: ${results.openai.valid ? '✅ Valid' : '❌ Invalid'} ${results.openai.error || ''}`)

    // Cohere
    console.log('Checking Cohere API Key...')
    results.cohere = await this.validateCohere(process.env.COHERE_API_KEY)
    console.log(`Cohere: ${results.cohere.valid ? '✅ Valid' : '❌ Invalid'} ${results.cohere.error || ''}`)

    // Weather API
    console.log('Checking Weather API Key...')
    results.weather = await this.validateWeatherAPI(process.env.WEATHER_API_KEY)
    console.log(`Weather: ${results.weather.valid ? '✅ Valid' : '❌ Invalid'} ${results.weather.error || ''}`)

    console.log('\n📊 Summary:')
    const validKeys = Object.values(results).filter(r => r.valid).length
    const totalKeys = Object.keys(results).length
    console.log(`${validKeys}/${totalKeys} API keys are working`)

    // Check for critical issues
    if (!results.weather.valid) {
      console.log('\n⚠️  CRITICAL: Weather API key is required for core functionality')
      console.log('   Get one free at: https://openweathermap.org/api')
    }

    if (!results.openai.valid && !results.cohere.valid) {
      console.log('\n⚠️  WARNING: No AI API keys working - will fallback to local AI only')
    }

    return results
  }
}

// Run validation
if (require.main === module) {
  const validator = new APIKeyValidator()
  validator.validateAll().catch(console.error)
}

module.exports = APIKeyValidator