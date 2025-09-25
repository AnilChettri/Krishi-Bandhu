/**
 * API Key Management Service for FarmGuard
 * Handles key rotation, validation, and fallback for multiple API providers
 */

interface APIKeyConfig {
  primary: string | null;
  alternatives: string[];
  lastUsed: number;
  failures: Map<string, number>;
  blacklist: Set<string>;
}

class APIKeyManager {
  private keyConfigs: Map<string, APIKeyConfig> = new Map();
  
  // Failure threshold before blacklisting a key
  private readonly FAILURE_THRESHOLD = 3;
  
  // Time to keep a key blacklisted (1 hour)
  private readonly BLACKLIST_DURATION = 60 * 60 * 1000;

  constructor() {
    this.initializeConfigs();
    this.startCleanupScheduler();
  }

  private initializeConfigs() {
    // Initialize weather API keys
    this.initializeWeatherKeys();
    
    // Initialize AI API keys
    this.initializeAIKeys();
    
    // Initialize other service keys
    this.initializeOtherKeys();
  }

  private initializeWeatherKeys() {
    const primaryKey = process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const alternativeKeys = (process.env.WEATHER_API_KEYS || process.env.NEXT_PUBLIC_WEATHER_API_KEYS || '')
      .split(',')
      .map(k => k.trim())
      .filter(k => k && k !== primaryKey);

    // Add WeatherAPI keys as alternatives
    const weatherApiKey = process.env.WEATHERAPI_KEY || process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
    if (weatherApiKey && weatherApiKey !== primaryKey) {
      alternativeKeys.push(weatherApiKey);
    }

    this.keyConfigs.set('weather', {
      primary: primaryKey || null,
      alternatives: alternativeKeys,
      lastUsed: 0,
      failures: new Map(),
      blacklist: new Set()
    });
  }

  private initializeAIKeys() {
    const openaiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const cohereKey = process.env.COHERE_API_KEY || process.env.NEXT_PUBLIC_COHERE_API_KEY;
    
    const alternatives = [cohereKey].filter((k): k is string => !!k && k !== openaiKey);
    
    this.keyConfigs.set('ai', {
      primary: openaiKey || null,
      alternatives: alternatives,
      lastUsed: 0,
      failures: new Map(),
      blacklist: new Set()
    });
  }

  private initializeOtherKeys() {
    // Add any other API services here
  }

  private startCleanupScheduler() {
    if (typeof setInterval !== 'undefined') {
      // Clean blacklisted keys every 10 minutes
      setInterval(() => {
        this.cleanupBlacklist();
      }, 10 * 60 * 1000);
    }
  }

  private cleanupBlacklist() {
    const now = Date.now();
    
    for (const config of this.keyConfigs.values()) {
      for (const key of config.blacklist) {
        const failures = config.failures.get(key);
        if (!failures || (now - failures) > this.BLACKLIST_DURATION) {
          config.blacklist.delete(key);
          config.failures.delete(key);
        }
      }
    }
  }

  /**
   * Get the best available API key for a service
   */
  getBestKey(service: 'weather' | 'ai' | string): string | null {
    const config = this.keyConfigs.get(service);
    if (!config) {
      console.warn(`No configuration found for service: ${service}`);
      return null;
    }

    // Try primary key first if not blacklisted
    if (config.primary && !config.blacklist.has(config.primary)) {
      return config.primary;
    }

    // Try alternative keys
    for (const key of config.alternatives) {
      if (!config.blacklist.has(key)) {
        return key;
      }
    }

    // If all keys are blacklisted, return the least recently failed one
    if (config.primary || config.alternatives.length > 0) {
      const allKeys = [config.primary, ...config.alternatives].filter((k): k is string => k != null);
      
      // Find key with oldest failure time
      let bestKey: string | null = null;
      let oldestFailure = Infinity;
      
      for (const key of allKeys) {
        const failureTime = config.failures.get(key) || 0;
        if (failureTime < oldestFailure) {
          oldestFailure = failureTime;
          bestKey = key;
        }
      }
      
      return bestKey;
    }

    return null;
  }

  /**
   * Report a successful API call
   */
  reportSuccess(service: string, key: string) {
    const config = this.keyConfigs.get(service);
    if (!config) return;

    // Remove from blacklist if present
    config.blacklist.delete(key);
    config.failures.delete(key);
    config.lastUsed = Date.now();

    console.log(`API key success reported for ${service}`);
  }

  /**
   * Report a failed API call
   */
  reportFailure(service: string, key: string, errorCode?: number) {
    const config = this.keyConfigs.get(service);
    if (!config) return;

    const now = Date.now();
    const currentFailures = config.failures.get(key) || 0;
    
    // Immediately blacklist on certain errors
    if (this.shouldBlacklistImmediately(errorCode)) {
      config.blacklist.add(key);
      config.failures.set(key, now);
      console.warn(`API key immediately blacklisted for ${service} due to error ${errorCode}`);
      return;
    }

    // Increment failure count
    const newFailureCount = currentFailures + 1;
    config.failures.set(key, now);

    // Blacklist if threshold reached
    if (newFailureCount >= this.FAILURE_THRESHOLD) {
      config.blacklist.add(key);
      console.warn(`API key blacklisted for ${service} after ${newFailureCount} failures`);
    } else {
      console.warn(`API key failure ${newFailureCount}/${this.FAILURE_THRESHOLD} for ${service}`);
    }
  }

  private shouldBlacklistImmediately(errorCode?: number): boolean {
    // Immediately blacklist on authentication/authorization errors
    return errorCode === 401 || errorCode === 403 || errorCode === 429;
  }

  /**
   * Get the next available key (for rotation)
   */
  getNextKey(service: string, currentKey: string): string | null {
    const config = this.keyConfigs.get(service);
    if (!config) return null;

    const allKeys = [config.primary, ...config.alternatives].filter((k): k is string => k != null && k !== currentKey);
    
    for (const key of allKeys) {
      if (!config.blacklist.has(key)) {
        return key;
      }
    }

    return null;
  }

  /**
   * Check if a service has any available keys
   */
  hasAvailableKeys(service: string): boolean {
    return this.getBestKey(service) !== null;
  }

  /**
   * Get status information for all services
   */
  getStatus(): Record<string, any> {
    const status: Record<string, any> = {};

    for (const [service, config] of this.keyConfigs.entries()) {
      const allKeys = [config.primary, ...config.alternatives].filter((k): k is string => k != null);
      const availableKeys = allKeys.filter(k => !config.blacklist.has(k));
      const blacklistedKeys = allKeys.filter(k => config.blacklist.has(k));

      status[service] = {
        totalKeys: allKeys.length,
        availableKeys: availableKeys.length,
        blacklistedKeys: blacklistedKeys.length,
        hasWorkingKey: availableKeys.length > 0,
        lastUsed: config.lastUsed ? new Date(config.lastUsed).toISOString() : null,
        failures: Object.fromEntries(
          Array.from(config.failures.entries()).map(([key, time]) => [
            this.maskKey(key), 
            new Date(time).toISOString()
          ])
        )
      };
    }

    return status;
  }

  /**
   * Manually reset a blacklisted key (for admin use)
   */
  resetKey(service: string, key: string) {
    const config = this.keyConfigs.get(service);
    if (!config) return false;

    config.blacklist.delete(key);
    config.failures.delete(key);
    
    console.log(`API key manually reset for ${service}`);
    return true;
  }

  /**
   * Mask API key for logging (show only first/last few characters)
   */
  private maskKey(key: string): string {
    if (!key || key.length < 8) return '*'.repeat(key?.length || 0);
    
    return key.slice(0, 4) + '*'.repeat(Math.max(0, key.length - 8)) + key.slice(-4);
  }

  /**
   * Get masked version of current key for UI display
   */
  getMaskedKey(service: string): string | null {
    const key = this.getBestKey(service);
    return key ? this.maskKey(key) : null;
  }

  /**
   * Test an API key by making a lightweight request
   */
  async testKey(service: 'weather' | 'ai', key: string): Promise<boolean> {
    try {
      if (service === 'weather') {
        return await this.testWeatherKey(key);
      } else if (service === 'ai') {
        return await this.testAIKey(key);
      }
      return false;
    } catch (error) {
      console.error(`API key test failed for ${service}:`, error);
      return false;
    }
  }

  private async testWeatherKey(key: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${key}&units=metric`,
        { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        }
      );
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private async testAIKey(key: string): Promise<boolean> {
    try {
      // Test with a minimal OpenAI request
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${key}`
        },
        signal: AbortSignal.timeout(5000)
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate all configured keys
   */
  async validateAllKeys(): Promise<Record<string, any>> {
    const results: Record<string, any> = {};

    for (const [service, config] of this.keyConfigs.entries()) {
      const allKeys = [config.primary, ...config.alternatives].filter((k): k is string => k != null);
      const validationResults: Record<string, boolean> = {};

      for (const key of allKeys) {
        if (service === 'weather' || service === 'ai') {
          validationResults[this.maskKey(key)] = await this.testKey(service as 'weather' | 'ai', key);
        }
      }

      results[service] = {
        totalKeys: allKeys.length,
        validationResults,
        validKeys: Object.values(validationResults).filter(Boolean).length
      };
    }

    return results;
  }

  /**
   * Force refresh of key configurations from environment
   */
  refreshConfig() {
    console.log('Refreshing API key configurations...');
    this.keyConfigs.clear();
    this.initializeConfigs();
  }
}

// Singleton instance
export const apiKeyManager = new APIKeyManager();

// Utility functions
export const withKeyRotation = async <T>(
  service: string,
  apiCall: (key: string) => Promise<T>
): Promise<T> => {
  const key = apiKeyManager.getBestKey(service);
  
  if (!key) {
    throw new Error(`No available API keys for service: ${service}`);
  }

  try {
    const result = await apiCall(key);
    apiKeyManager.reportSuccess(service, key);
    return result;
  } catch (error: any) {
    const errorCode = error?.response?.status || error?.status;
    apiKeyManager.reportFailure(service, key, errorCode);
    
    // Try next available key
    const nextKey = apiKeyManager.getNextKey(service, key);
    if (nextKey) {
      console.log(`Retrying with alternative key for ${service}`);
      try {
        const result = await apiCall(nextKey);
        apiKeyManager.reportSuccess(service, nextKey);
        return result;
      } catch (secondError: any) {
        const secondErrorCode = secondError?.response?.status || secondError?.status;
        apiKeyManager.reportFailure(service, nextKey, secondErrorCode);
      }
    }
    
    throw error;
  }
};