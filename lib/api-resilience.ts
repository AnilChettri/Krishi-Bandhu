/**
 * API Resilience Service for FarmGuard
 * Provides robust fallback mechanisms for Weather, Geolocation, and Market APIs
 */

export interface APIProvider {
  name: string;
  priority: number;
  enabled: boolean;
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  retryAttempts: number;
  healthCheckEndpoint?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  provider: string;
  timestamp: string;
  cached?: boolean;
  source: 'api' | 'cache' | 'fallback' | 'offline';
  error?: string;
}

export interface CircuitBreaker {
  isOpen: boolean;
  failures: number;
  lastFailureTime: number;
  nextAttemptTime: number;
  successCount: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

class APIResilienceService {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private healthStatus: Map<string, boolean> = new Map();
  private lastHealthCheck: Map<string, number> = new Map();
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  
  // Configuration
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute
  private readonly CACHE_TTL = 300000; // 5 minutes
  private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute
  private readonly DEFAULT_TIMEOUT = 10000; // 10 seconds

  constructor() {
    this.initializeCircuitBreakers();
    this.startHealthMonitoring();
  }

  private initializeCircuitBreakers() {
    const providers = ['openweather', 'weatherapi', 'geolocation', 'market-primary', 'market-fallback'];
    providers.forEach(provider => {
      this.circuitBreakers.set(provider, {
        isOpen: false,
        failures: 0,
        lastFailureTime: 0,
        nextAttemptTime: 0,
        successCount: 0,
        state: 'CLOSED'
      });
      this.healthStatus.set(provider, true);
    });
  }

  private startHealthMonitoring() {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.performHealthChecks();
      }, this.HEALTH_CHECK_INTERVAL);
    }
  }

  private async performHealthChecks() {
    const providers = [
      { name: 'openweather', url: 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=test' },
      { name: 'weatherapi', url: 'http://api.weatherapi.com/v1/current.json?key=test&q=London' }
    ];

    for (const provider of providers) {
      try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);

        const response = await fetch(provider.url, {
          method: 'HEAD',
          signal: controller.signal
        });

        const isHealthy = response.status !== 429 && response.status < 500;
        this.healthStatus.set(provider.name, isHealthy);
        this.lastHealthCheck.set(provider.name, Date.now());

        if (isHealthy) {
          this.recordSuccess(provider.name);
        }
      } catch (error) {
        this.healthStatus.set(provider.name, false);
        this.recordFailure(provider.name);
      }
    }
  }

  private recordFailure(provider: string) {
    const circuitBreaker = this.circuitBreakers.get(provider);
    if (!circuitBreaker) return;

    circuitBreaker.failures++;
    circuitBreaker.lastFailureTime = Date.now();
    circuitBreaker.successCount = 0;

    if (circuitBreaker.failures >= this.CIRCUIT_BREAKER_THRESHOLD) {
      circuitBreaker.isOpen = true;
      circuitBreaker.state = 'OPEN';
      circuitBreaker.nextAttemptTime = Date.now() + this.CIRCUIT_BREAKER_TIMEOUT;
    }
  }

  private recordSuccess(provider: string) {
    const circuitBreaker = this.circuitBreakers.get(provider);
    if (!circuitBreaker) return;

    circuitBreaker.successCount++;
    
    if (circuitBreaker.state === 'HALF_OPEN' && circuitBreaker.successCount >= 3) {
      circuitBreaker.isOpen = false;
      circuitBreaker.state = 'CLOSED';
      circuitBreaker.failures = 0;
    } else if (circuitBreaker.state === 'CLOSED') {
      circuitBreaker.failures = Math.max(0, circuitBreaker.failures - 1);
    }
  }

  private canAttemptRequest(provider: string): boolean {
    const circuitBreaker = this.circuitBreakers.get(provider);
    if (!circuitBreaker) return true;

    if (circuitBreaker.state === 'CLOSED') return true;
    
    if (circuitBreaker.state === 'OPEN') {
      if (Date.now() >= circuitBreaker.nextAttemptTime) {
        circuitBreaker.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }

    return circuitBreaker.state === 'HALF_OPEN';
  }

  private getCachedData<T>(key: string): APIResponse<T> | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return {
      success: true,
      data: cached.data,
      provider: 'cache',
      timestamp: new Date(cached.timestamp).toISOString(),
      cached: true,
      source: 'cache'
    };
  }

  private setCachedData(key: string, data: any, ttl: number = this.CACHE_TTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {}, 
    provider: string,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<APIResponse<T>> {
    if (!this.canAttemptRequest(provider)) {
      throw new Error(`Circuit breaker is open for provider: ${provider}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.recordSuccess(provider);

      return {
        success: true,
        data,
        provider,
        timestamp: new Date().toISOString(),
        source: 'api'
      };

    } catch (error) {
      clearTimeout(timeoutId);
      this.recordFailure(provider);
      throw error;
    }
  }

  async fetchWithFallback<T>(
    providers: APIProvider[],
    requestFn: (provider: APIProvider) => Promise<string>,
    cacheKey: string,
    fallbackData?: () => T
  ): Promise<APIResponse<T>> {
    // Try cache first
    const cached = this.getCachedData<T>(cacheKey);
    if (cached) {
      return cached;
    }

    // Sort providers by priority and health status
    const sortedProviders = providers
      .filter(p => p.enabled)
      .sort((a, b) => {
        const aHealthy = this.healthStatus.get(a.name) ?? true;
        const bHealthy = this.healthStatus.get(b.name) ?? true;
        
        if (aHealthy && !bHealthy) return -1;
        if (!aHealthy && bHealthy) return 1;
        return a.priority - b.priority;
      });

    // Try each provider
    for (const provider of sortedProviders) {
      try {
        const url = await requestFn(provider);
        const result = await this.makeRequest<T>(url, {}, provider.name, provider.timeout);
        
        // Cache successful result
        this.setCachedData(cacheKey, result.data);
        
        return result;
      } catch (error) {
        console.warn(`Provider ${provider.name} failed:`, error);
        continue;
      }
    }

    // If all providers failed, try fallback data
    if (fallbackData) {
      const data = fallbackData();
      return {
        success: false,
        data,
        provider: 'fallback',
        timestamp: new Date().toISOString(),
        source: 'fallback',
        error: 'All providers failed, using fallback data'
      };
    }

    throw new Error('All API providers failed and no fallback available');
  }

  // Weather API Methods
  async getWeatherData(lat: number, lon: number): Promise<APIResponse<any>> {
    const weatherProviders: APIProvider[] = [
      {
        name: 'openweather',
        priority: 1,
        enabled: true,
        baseUrl: 'https://api.openweathermap.org/data/2.5',
        apiKey: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '91360454e88e0ed9028745c4d7c6aacc',
        timeout: 10000,
        retryAttempts: 3
      },
      {
        name: 'weatherapi',
        priority: 2,
        enabled: true,
        baseUrl: 'http://api.weatherapi.com/v1',
        apiKey: process.env.NEXT_PUBLIC_WEATHERAPI_KEY,
        timeout: 10000,
        retryAttempts: 3
      }
    ];

    const cacheKey = `weather_${lat}_${lon}`;
    
    return this.fetchWithFallback(
      weatherProviders,
      (provider) => {
        if (provider.name === 'openweather') {
          return Promise.resolve(
            `${provider.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${provider.apiKey}&units=metric&cnt=40`
          );
        } else if (provider.name === 'weatherapi') {
          return Promise.resolve(
            `${provider.baseUrl}/forecast.json?key=${provider.apiKey}&q=${lat},${lon}&days=5&aqi=no&alerts=yes`
          );
        }
        return Promise.reject('Unknown provider');
      },
      cacheKey,
      () => this.generateMockWeatherData(lat, lon)
    );
  }

  // Geolocation Methods
  async getCurrentLocation(): Promise<APIResponse<{ lat: number; lon: number; city: string }>> {
    const cacheKey = 'current_location';
    const cached = this.getCachedData<{ lat: number; lon: number; city: string }>(cacheKey);
    if (cached) return cached;

    try {
      // Try HTML5 Geolocation API
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { timeout: 10000, enableHighAccuracy: false }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Get city name from coordinates
      const cityData = await this.getCityFromCoordinates(latitude, longitude);
      
      const result = {
        lat: latitude,
        lon: longitude,
        city: cityData.city || 'Unknown'
      };

      this.setCachedData(cacheKey, result, 3600000); // Cache for 1 hour
      
      return {
        success: true,
        data: result,
        provider: 'geolocation',
        timestamp: new Date().toISOString(),
        source: 'api'
      };

    } catch (error) {
      // Fallback to IP-based location or default location
      return {
        success: false,
        data: {
          lat: 30.9010, // Ludhiana, Punjab (default farming region)
          lon: 75.8573,
          city: 'Ludhiana'
        },
        provider: 'fallback',
        timestamp: new Date().toISOString(),
        source: 'fallback',
        error: 'Geolocation failed, using default location'
      };
    }
  }

  private async getCityFromCoordinates(lat: number, lon: number): Promise<{ city: string }> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY || '91360454e88e0ed9028745c4d7c6aacc'}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return { city: data[0]?.name || 'Unknown' };
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
    }
    
    return { city: 'Unknown' };
  }

  // Market Data Methods
  async getMarketData(): Promise<APIResponse<any>> {
    const marketProviders: APIProvider[] = [
      {
        name: 'market-primary',
        priority: 1,
        enabled: true,
        baseUrl: '/api/market-info',
        timeout: 10000,
        retryAttempts: 3
      }
    ];

    const cacheKey = 'market_data';
    
    return this.fetchWithFallback(
      marketProviders,
      (provider) => Promise.resolve(`${provider.baseUrl}`),
      cacheKey,
      () => this.generateMockMarketData()
    );
  }

  // Mock Data Generators
  private generateMockWeatherData(lat: number, lon: number) {
    const currentDate = new Date();
    const forecast = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      
      const baseTemp = 25 + Math.sin(i * 0.5) * 5; // Realistic temperature variation
      const rainfall = Math.random() > 0.7 ? Math.random() * 20 : 0; // 30% chance of rain
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en', { weekday: 'long' }),
        high: Math.round(baseTemp + 3),
        low: Math.round(baseTemp - 3),
        condition: rainfall > 5 ? 'Rainy' : rainfall > 0 ? 'Light Rain' : 'Partly Cloudy',
        icon: rainfall > 5 ? 'rain' : rainfall > 0 ? 'light-rain' : 'partly-cloudy',
        humidity: Math.round(50 + Math.random() * 30),
        windSpeed: Math.round(8 + Math.random() * 15),
        rainfall: Math.round(rainfall),
        visibility: Math.round(8 + Math.random() * 4),
        farmingRecommendations: this.generateFarmingRecommendations(rainfall, Math.round(baseTemp + 3))
      });
    }

    return {
      location: {
        name: 'Ludhiana',
        country: 'IN',
        lat,
        lon
      },
      forecast,
      alerts: this.generateWeatherAlerts(forecast),
      lastUpdated: new Date().toISOString()
    };
  }

  private generateFarmingRecommendations(rainfall: number, temperature: number): string[] {
    const recommendations = [];
    
    if (rainfall > 15) {
      recommendations.push('Avoid field operations due to heavy rainfall');
      recommendations.push('Ensure proper drainage in fields');
      recommendations.push('Harvest ready crops before rain intensifies');
    } else if (rainfall > 5) {
      recommendations.push('Light rain is beneficial for crop growth');
      recommendations.push('Monitor for pest activity after rain');
      recommendations.push('Irrigation needs may be reduced');
    } else {
      recommendations.push('Good weather for field operations');
      recommendations.push('Consider irrigation if soil moisture is low');
      recommendations.push('Ideal time for spraying if needed');
    }
    
    if (temperature > 35) {
      recommendations.push('Provide shade for sensitive crops');
      recommendations.push('Increase irrigation frequency');
      recommendations.push('Monitor for heat stress in livestock');
    } else if (temperature < 10) {
      recommendations.push('Protect crops from frost damage');
      recommendations.push('Cover sensitive plants overnight');
    }
    
    return recommendations;
  }

  private generateWeatherAlerts(forecast: any[]): any[] {
    const alerts: any[] = [];
    
    forecast.forEach((day, index) => {
      if (day.rainfall > 30) {
        alerts.push({
          id: `heavy-rain-${day.date}`,
          type: 'warning',
          title: 'Heavy Rainfall Warning',
          description: `Heavy rainfall of ${day.rainfall}mm expected on ${day.day}. Risk of waterlogging and flash flooding.`,
          severity: 'high',
          validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
          category: 'rain',
          impact: 'Waterlogging likely, delayed field operations, potential crop damage',
          recommendedActions: [
            'Avoid field operations during heavy rain',
            'Ensure proper drainage in fields',
            'Harvest ready crops before rain intensifies'
          ]
        });
      }
      
      if (day.high > 40) {
        alerts.push({
          id: `heat-warning-${day.date}`,
          type: 'warning',
          title: 'Extreme Heat Warning',
          description: `Very high temperatures of ${day.high}°C expected on ${day.day}.`,
          severity: 'high',
          validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
          category: 'temperature',
          impact: 'Crop stress, livestock discomfort, increased water needs',
          recommendedActions: [
            'Increase irrigation frequency',
            'Provide shade for sensitive crops',
            'Avoid field operations during hottest hours'
          ]
        });
      }
    });
    
    return alerts;
  }

  private generateMockMarketData() {
    const crops = [
      { name: 'Rice', basePrice: 2500 },
      { name: 'Wheat', basePrice: 2200 },
      { name: 'Maize', basePrice: 1900 },
      { name: 'Cotton', basePrice: 6500 },
      { name: 'Sugarcane', basePrice: 350 }
    ];

    const prices = crops.map(crop => {
      const change = (Math.random() - 0.5) * 200; // ±100 price change
      const changePercent = (change / crop.basePrice) * 100;
      
      return {
        crop: crop.name,
        currentPrice: Math.round(crop.basePrice + change),
        previousPrice: crop.basePrice,
        change: Math.round(change),
        changePercentage: Math.round(changePercent * 100) / 100,
        unit: '₹/quintal',
        market: 'Ludhiana Mandi',
        lastUpdated: new Date().toISOString(),
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
        quality: 'premium'
      };
    });

    return {
      prices,
      alerts: [],
      summary: {
        totalCrops: prices.length,
        pricesUp: prices.filter(p => p.trend === 'up').length,
        pricesDown: prices.filter(p => p.trend === 'down').length,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  // Health and Status Methods
  getProviderHealth(provider: string): boolean {
    return this.healthStatus.get(provider) ?? false;
  }

  getCircuitBreakerStatus(provider: string): CircuitBreaker | null {
    return this.circuitBreakers.get(provider) || null;
  }

  clearCache(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Singleton instance
export const apiResilienceService = new APIResilienceService();

// Utility functions
export const withFallback = async <T>(
  primary: () => Promise<T>,
  fallback: () => T,
  cacheKey?: string
): Promise<T> => {
  try {
    const result = await primary();
    return result;
  } catch (error) {
    console.warn('Primary request failed, using fallback:', error);
    return fallback();
  }
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};