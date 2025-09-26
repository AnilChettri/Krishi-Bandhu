/**
 * Local Storage Service for FarmGuard
 * Provides persistent offline storage for weather alerts, geolocation, and market data
 */

export interface StorageItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
  version: string;
  source: 'api' | 'fallback' | 'offline';
}

export interface WeatherCache {
  forecast: any[];
  alerts: any[];
  location: { name: string; lat: number; lon: number };
  lastUpdated: string;
}

export interface MarketCache {
  prices: any[];
  alerts: any[];
  summary: any;
  lastUpdated: string;
}

export interface LocationCache {
  lat: number;
  lon: number;
  city: string;
  accuracy?: number;
  lastUpdated: string;
}

class LocalStorageService {
  private readonly STORAGE_PREFIX = 'farmguard_';
  private readonly CURRENT_VERSION = '1.0.0';
  private readonly DEFAULT_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  
  // Storage keys
  private readonly KEYS = {
    WEATHER: 'weather_data',
    MARKET: 'market_data',
    LOCATION: 'location_data',
    USER_PREFERENCES: 'user_preferences',
    OFFLINE_QUEUE: 'offline_queue',
    CACHE_METADATA: 'cache_metadata'
  };

  constructor() {
    this.initializeStorage();
    this.startCleanupScheduler();
  }

  private initializeStorage() {
    try {
      // Check if localStorage is available
      if (!this.isLocalStorageAvailable()) {
        console.warn('LocalStorage is not available. Offline functionality will be limited.');
        return;
      }

      // Initialize metadata if not exists
      const metadata = this.getCacheMetadata();
      if (!metadata) {
        this.setCacheMetadata({
          version: this.CURRENT_VERSION,
          created: Date.now(),
          lastCleanup: Date.now(),
          totalSize: 0,
          itemCount: 0
        });
      }

      // Migrate old data if version changed
      if (metadata && metadata.version !== this.CURRENT_VERSION) {
        this.migrateData(metadata.version, this.CURRENT_VERSION);
      }

    } catch (error) {
      console.error('Failed to initialize local storage:', error);
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  private startCleanupScheduler() {
    if (typeof window !== 'undefined') {
      // Clean expired items every hour
      setInterval(() => {
        this.cleanupExpiredItems();
      }, 60 * 60 * 1000);

      // Clean up immediately if it's been more than 24 hours
      const metadata = this.getCacheMetadata();
      if (metadata && Date.now() - metadata.lastCleanup > 24 * 60 * 60 * 1000) {
        this.cleanupExpiredItems();
      }
    }
  }

  private getStorageKey(key: string): string {
    return this.STORAGE_PREFIX + key;
  }

  private setItemPrivate<T>(key: string, data: T, expiry: number = this.DEFAULT_EXPIRY, source: 'api' | 'fallback' | 'offline' = 'api'): boolean {
    try {
      if (!this.isLocalStorageAvailable()) {
        return false;
      }

      const storageItem: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + expiry,
        version: this.CURRENT_VERSION,
        source
      };

      const serialized = JSON.stringify(storageItem);
      localStorage.setItem(this.getStorageKey(key), serialized);

      // Update metadata
      this.updateCacheMetadata();
      
      return true;
    } catch (error) {
      console.error(`Failed to store item ${key}:`, error);
      return false;
    }
  }

  private getItem<T>(key: string): StorageItem<T> | null {
    try {
      if (!this.isLocalStorageAvailable()) {
        return null;
      }

      const serialized = localStorage.getItem(this.getStorageKey(key));
      if (!serialized) {
        return null;
      }

      const item: StorageItem<T> = JSON.parse(serialized);

      // Check if item has expired
      if (Date.now() > item.expiry) {
        this.removeItem(key);
        return null;
      }

      return item;
    } catch (error) {
      console.error(`Failed to retrieve item ${key}:`, error);
      return null;
    }
  }

  private removeItem(key: string): boolean {
    try {
      if (!this.isLocalStorageAvailable()) {
        return false;
      }

      localStorage.removeItem(this.getStorageKey(key));
      this.updateCacheMetadata();
      return true;
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      return false;
    }
  }

  // Public generic setItem method
  public setItem<T>(key: string, data: T, expiry: number = this.DEFAULT_EXPIRY, source: 'api' | 'fallback' | 'offline' = 'api'): boolean {
    return this.setItemPrivate(key, data, expiry, source);
  }
  
  // Weather Data Methods
  setWeatherData(weatherData: WeatherCache, expiry: number = 30 * 60 * 1000): boolean {
    return this.setItemPrivate(this.KEYS.WEATHER, weatherData, expiry, 'api');
  }

  getWeatherData(): WeatherCache | null {
    const item = this.getItem<WeatherCache>(this.KEYS.WEATHER);
    return item ? item.data : null;
  }

  setWeatherFallback(weatherData: WeatherCache): boolean {
    return this.setItemPrivate(this.KEYS.WEATHER, weatherData, this.DEFAULT_EXPIRY, 'fallback');
  }

  // Market Data Methods
  setMarketData(marketData: MarketCache, expiry: number = 15 * 60 * 1000): boolean {
    return this.setItemPrivate(this.KEYS.MARKET, marketData, expiry, 'api');
  }

  getMarketData(): MarketCache | null {
    const item = this.getItem<MarketCache>(this.KEYS.MARKET);
    return item ? item.data : null;
  }

  setMarketFallback(marketData: MarketCache): boolean {
    return this.setItemPrivate(this.KEYS.MARKET, marketData, this.DEFAULT_EXPIRY, 'fallback');
  }

  // Location Data Methods
  setLocationData(locationData: LocationCache, expiry: number = 60 * 60 * 1000): boolean {
    return this.setItemPrivate(this.KEYS.LOCATION, locationData, expiry, 'api');
  }

  getLocationData(): LocationCache | null {
    const item = this.getItem<LocationCache>(this.KEYS.LOCATION);
    return item ? item.data : null;
  }

  setLocationFallback(locationData: LocationCache): boolean {
    return this.setItemPrivate(this.KEYS.LOCATION, locationData, this.DEFAULT_EXPIRY, 'fallback');
  }

  // User Preferences Methods
  setUserPreferences(preferences: any): boolean {
    return this.setItemPrivate(this.KEYS.USER_PREFERENCES, preferences, this.DEFAULT_EXPIRY * 30, 'offline'); // 30 days
  }

  getUserPreferences(): any {
    const item = this.getItem(this.KEYS.USER_PREFERENCES);
    return item ? item.data : null;
  }

  // Offline Queue Methods (for actions to sync when online)
  addToOfflineQueue(action: any): boolean {
    try {
      const queue = this.getOfflineQueue();
      queue.push({
        ...action,
        timestamp: Date.now(),
        id: this.generateId()
      });
      return this.setItemPrivate(this.KEYS.OFFLINE_QUEUE, queue, this.DEFAULT_EXPIRY * 7, 'offline'); // 7 days
    } catch (error) {
      console.error('Failed to add to offline queue:', error);
      return false;
    }
  }

  getOfflineQueue(): any[] {
    const item = this.getItem<any[]>(this.KEYS.OFFLINE_QUEUE);
    return item ? item.data : [];
  }

  clearOfflineQueue(): boolean {
    return this.removeItem(this.KEYS.OFFLINE_QUEUE);
  }

  removeFromOfflineQueue(id: string): boolean {
    try {
      const queue = this.getOfflineQueue();
      const filteredQueue = queue.filter(item => item.id !== id);
      return this.setItemPrivate(this.KEYS.OFFLINE_QUEUE, filteredQueue, this.DEFAULT_EXPIRY * 7, 'offline');
    } catch (error) {
      console.error('Failed to remove from offline queue:', error);
      return false;
    }
  }

  // Cache Management Methods
  private getCacheMetadata(): any {
    const item = this.getItem('cache_metadata');
    return item ? item.data : null;
  }

  private setCacheMetadata(metadata: any): boolean {
    return this.setItemPrivate('cache_metadata', metadata, this.DEFAULT_EXPIRY * 365, 'offline'); // 1 year
  }

  private updateCacheMetadata(): void {
    try {
      const metadata = this.getCacheMetadata() || {};
      
      // Calculate total size and count
      let totalSize = 0;
      let itemCount = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += value.length;
            itemCount++;
          }
        }
      }

      this.setCacheMetadata({
        ...metadata,
        totalSize,
        itemCount,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('Failed to update cache metadata:', error);
    }
  }

  cleanupExpiredItems(): number {
    let cleanedCount = 0;
    
    try {
      if (!this.isLocalStorageAvailable()) {
        return 0;
      }

      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const item: StorageItem<any> = JSON.parse(value);
              if (Date.now() > item.expiry) {
                keysToRemove.push(key);
              }
            }
          } catch (error) {
            // If we can't parse the item, it's corrupted, remove it
            keysToRemove.push(key);
          }
        }
      }

      // Remove expired items
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        cleanedCount++;
      });

      // Update metadata
      if (cleanedCount > 0) {
        this.updateCacheMetadata();
        const metadata = this.getCacheMetadata();
        if (metadata) {
          metadata.lastCleanup = Date.now();
          this.setCacheMetadata(metadata);
        }
      }

    } catch (error) {
      console.error('Failed to cleanup expired items:', error);
    }

    return cleanedCount;
  }

  clearAllCache(): boolean {
    try {
      if (!this.isLocalStorageAvailable()) {
        return false;
      }

      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // Reinitialize
      this.initializeStorage();
      
      return true;
    } catch (error) {
      console.error('Failed to clear all cache:', error);
      return false;
    }
  }

  getCacheStats(): any {
    const metadata = this.getCacheMetadata();
    const weather = this.getItem(this.KEYS.WEATHER);
    const market = this.getItem(this.KEYS.MARKET);
    const location = this.getItem(this.KEYS.LOCATION);
    const offlineQueue = this.getOfflineQueue();

    return {
      ...metadata,
      available: this.isLocalStorageAvailable(),
      items: {
        weather: weather ? {
          age: Date.now() - weather.timestamp,
          source: weather.source,
          expires: new Date(weather.expiry).toISOString()
        } : null,
        market: market ? {
          age: Date.now() - market.timestamp,
          source: market.source,
          expires: new Date(market.expiry).toISOString()
        } : null,
        location: location ? {
          age: Date.now() - location.timestamp,
          source: location.source,
          expires: new Date(location.expiry).toISOString()
        } : null,
        offlineQueue: {
          count: offlineQueue.length,
          oldestItem: offlineQueue.length > 0 ? new Date(Math.min(...offlineQueue.map(item => item.timestamp))).toISOString() : null
        }
      }
    };
  }

  private migrateData(fromVersion: string, toVersion: string): void {
    console.log(`Migrating data from version ${fromVersion} to ${toVersion}`);
    // Add migration logic here if needed in the future
    
    // Update version
    const metadata = this.getCacheMetadata();
    if (metadata) {
      metadata.version = toVersion;
      this.setCacheMetadata(metadata);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Emergency fallback data methods
  setEmergencyWeatherData(): boolean {
    const emergencyWeather: WeatherCache = {
      forecast: [
        {
          date: new Date().toISOString().split('T')[0],
          day: 'Today',
          high: 28,
          low: 18,
          condition: 'Partly Cloudy',
          icon: 'partly-cloudy',
          humidity: 65,
          windSpeed: 12,
          rainfall: 0,
          visibility: 10,
          farmingRecommendations: [
            'Good weather for field operations',
            'Consider irrigation if soil moisture is low',
            'Ideal time for spraying if needed'
          ]
        }
      ],
      alerts: [],
      location: { name: 'Ludhiana', lat: 30.9010, lon: 75.8573 },
      lastUpdated: new Date().toISOString()
    };

    return this.setWeatherFallback(emergencyWeather);
  }

  setEmergencyMarketData(): boolean {
    const emergencyMarket: MarketCache = {
      prices: [
        {
          crop: 'Rice',
          currentPrice: 2500,
          previousPrice: 2400,
          change: 100,
          changePercentage: 4.17,
          unit: '₹/quintal',
          market: 'Ludhiana Mandi',
          lastUpdated: new Date().toISOString(),
          trend: 'up',
          quality: 'premium'
        },
        {
          crop: 'Wheat',
          currentPrice: 2200,
          previousPrice: 2150,
          change: 50,
          changePercentage: 2.33,
          unit: '₹/quintal',
          market: 'Ludhiana Mandi',
          lastUpdated: new Date().toISOString(),
          trend: 'up',
          quality: 'premium'
        }
      ],
      alerts: [],
      summary: {
        totalCrops: 2,
        pricesUp: 2,
        pricesDown: 0,
        lastUpdated: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString()
    };

    return this.setMarketFallback(emergencyMarket);
  }

  // Check if we're in offline mode
  isOffline(): boolean {
    return typeof navigator !== 'undefined' && !navigator.onLine;
  }

  // Get best available data (prioritizes fresh API data over cached data)
  getBestWeatherData(): { data: WeatherCache | null; source: string; age: number } {
    const item = this.getItem<WeatherCache>(this.KEYS.WEATHER);
    
    if (!item) {
      return { data: null, source: 'none', age: 0 };
    }

    const age = Date.now() - item.timestamp;
    return {
      data: item.data,
      source: item.source,
      age
    };
  }

  getBestMarketData(): { data: MarketCache | null; source: string; age: number } {
    const item = this.getItem<MarketCache>(this.KEYS.MARKET);
    
    if (!item) {
      return { data: null, source: 'none', age: 0 };
    }

    const age = Date.now() - item.timestamp;
    return {
      data: item.data,
      source: item.source,
      age
    };
  }

  getBestLocationData(): { data: LocationCache | null; source: string; age: number } {
    const item = this.getItem<LocationCache>(this.KEYS.LOCATION);
    
    if (!item) {
      return { data: null, source: 'none', age: 0 };
    }

    const age = Date.now() - item.timestamp;
    return {
      data: item.data,
      source: item.source,
      age
    };
  }
}

// Singleton instance
export const localStorageService = new LocalStorageService();

// Helper functions for offline detection
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

export const isOffline = (): boolean => {
  return !isOnline();
};

// Setup online/offline event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online - syncing offline queue...');
    // Trigger sync of offline queue when back online
    const queue = localStorageService.getOfflineQueue();
    if (queue.length > 0) {
      console.log(`Found ${queue.length} items in offline queue`);
      // Here you would typically trigger a sync process
      // For now, we'll just log it
    }
  });

  window.addEventListener('offline', () => {
    console.log('Gone offline - enabling offline mode...');
    // Set up emergency data if needed
    const weather = localStorageService.getWeatherData();
    const market = localStorageService.getMarketData();
    
    if (!weather) {
      localStorageService.setEmergencyWeatherData();
    }
    
    if (!market) {
      localStorageService.setEmergencyMarketData();
    }
  });
}
