// FarmGuard App Initialization
// Handles service worker registration, state initialization, and app setup

import { useFarmGuardStore } from './farmguard-store'

class FarmGuardAppInitializer {
  private static instance: FarmGuardAppInitializer
  private isInitialized = false

  static getInstance(): FarmGuardAppInitializer {
    if (!FarmGuardAppInitializer.instance) {
      FarmGuardAppInitializer.instance = new FarmGuardAppInitializer()
    }
    return FarmGuardAppInitializer.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    console.log('🚀 Initializing FarmGuard App...')

    try {
      // Initialize all subsystems in parallel
      await Promise.allSettled([
        this.registerServiceWorker(),
        this.initializeStore(),
        this.setupNetworkListeners(),
        this.requestNotificationPermission(),
        this.setupPeriodicSync()
      ])

      this.isInitialized = true
      console.log('✅ FarmGuard App initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize FarmGuard App:', error)
    }
  }

  private async registerServiceWorker(): Promise<ServiceWorkerRegistration | void> {
    if ('serviceWorker' in navigator) {
      try {
        console.log('📋 Registering Service Worker...')
        
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            console.log('🔄 New service worker version found')
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New service worker installed, reloading page...')
                
                // Show update notification to user
                this.showUpdateNotification()
              }
            })
          }
        })

        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event.data)
        })

        console.log('✅ Service Worker registered successfully')
        return registration
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error)
        throw error
      }
    } else {
      console.warn('⚠️ Service Workers not supported in this browser')
    }
  }

  private async initializeStore(): Promise<void> {
    console.log('💾 Initializing Store...')
    
    const store = useFarmGuardStore.getState()
    
    // Set initial connectivity state
    store.setConnectivity(navigator.onLine)
    
    // Initialize with cached data if available
    if (store.user && store.isAuthenticated) {
      console.log('👤 User found in store, initializing data...')
      
      // Refresh data if online and cache is stale
      if (navigator.onLine) {
        const lastSync = new Date(store.settings.connectivity.lastSync)
        const now = new Date()
        const timeSinceLastSync = now.getTime() - lastSync.getTime()
        
        // Refresh if last sync was more than 1 hour ago
        if (timeSinceLastSync > 60 * 60 * 1000) {
          console.log('🔄 Cache is stale, refreshing data...')
          await store.refreshData()
        }
      }
    }
    
    console.log('✅ Store initialized')
  }

  private setupNetworkListeners(): void {
    console.log('🌐 Setting up network listeners...')
    
    const store = useFarmGuardStore.getState()
    
    window.addEventListener('online', async () => {
      console.log('🌐 Network online')
      store.setConnectivity(true)
      
      // Sync offline data when coming back online
      try {
        await store.syncOfflineData()
        await store.refreshData()
        console.log('📡 Offline data synced successfully')
      } catch (error) {
        console.error('❌ Failed to sync offline data:', error)
      }
    })

    window.addEventListener('offline', () => {
      console.log('📴 Network offline')
      store.setConnectivity(false)
    })

    // Detect slow network conditions
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      const updateConnectionInfo = () => {
        const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
        
        if (isSlowConnection) {
          console.log('🐌 Slow network detected, adjusting behavior')
          // Could implement reduced functionality for slow networks
        }
      }
      
      connection.addEventListener('change', updateConnectionInfo)
      updateConnectionInfo()
    }

    console.log('✅ Network listeners setup complete')
  }

  private async requestNotificationPermission(): Promise<void> {
    console.log('🔔 Requesting notification permission...')
    
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted')
        
        // Test notification
        this.showWelcomeNotification()
      } else {
        console.log('⚠️ Notification permission denied')
      }
    } else {
      console.log('⚠️ Notifications not supported')
    }
  }

  private async setupPeriodicSync(): Promise<void> {
    console.log('⏰ Setting up periodic sync...')
    
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        
        // Check if sync is available on the registration
        if ('sync' in registration) {
          // Register background sync
          await (registration as any).sync.register('farmguard-periodic-sync')
          console.log('✅ Periodic sync registered')
        } else {
          console.log('⚠️ Background sync not available on this registration')
        }
      } catch (error) {
        console.error('❌ Failed to setup periodic sync:', error)
      }
    } else {
      console.log('⚠️ Background sync not supported')
    }
  }

  private handleServiceWorkerMessage(data: any): void {
    console.log('📨 Service Worker message received:', data)
    
    const store = useFarmGuardStore.getState()
    
    switch (data.type) {
      case 'DATA_SYNCED':
        store.updateLastSync()
        break
        
      case 'CACHE_UPDATED':
        console.log('📦 Cache updated for:', data.resource)
        break
        
      case 'BACKGROUND_SYNC_COMPLETE':
        console.log('🔄 Background sync completed')
        store.updateLastSync()
        break
        
      case 'PUSH_RECEIVED':
        this.handlePushNotification(data.payload)
        break
        
      default:
        console.log('🔍 Unknown service worker message type:', data.type)
    }
  }

  private handlePushNotification(payload: any): void {
    console.log('📬 Push notification received:', payload)
    
    // Handle different types of push notifications
    switch (payload.type) {
      case 'weather_alert':
        this.showNotification('Weather Alert', payload.message, {
          icon: '/icons/weather-icon.png',
          tag: 'weather',
          data: { url: '/dashboard' }
        })
        break
        
      case 'market_update':
        this.showNotification('Market Update', payload.message, {
          icon: '/icons/market-icon.png',
          tag: 'market',
          data: { url: '/dashboard' }
        })
        break
        
      case 'pest_warning':
        this.showNotification('Pest Warning', payload.message, {
          icon: '/icons/pest-icon.png',
          tag: 'pest',
          data: { url: '/dashboard/pest-detection' }
        })
        break
        
      default:
        this.showNotification('FarmGuard', payload.message)
    }
  }

  private showNotification(title: string, body: string, options: NotificationOptions = {}): void {
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body,
          icon: '/icons/farmguard-icon-192.png',
          badge: '/icons/farmguard-badge.png',
          requireInteraction: true,
          actions: [
            {
              action: 'view',
              title: 'View',
              icon: '/icons/view-icon.png'
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
              icon: '/icons/dismiss-icon.png'
            }
          ],
          ...options
        } as any)
      })
    }
  }

  private showWelcomeNotification(): void {
    setTimeout(() => {
      this.showNotification(
        'Welcome to FarmGuard!',
        'Your farming assistant is ready to help you manage your farm efficiently.',
        {
          tag: 'welcome',
          requireInteraction: false
        }
      )
    }, 2000) // Show after 2 seconds
  }

  private showUpdateNotification(): void {
    this.showNotification(
      'App Update Available',
      'A new version of FarmGuard is available. Reload to get the latest features.',
      {
        tag: 'update',
        requireInteraction: true,
        actions: [
          {
            action: 'reload',
            title: 'Reload Now',
            icon: '/icons/reload-icon.png'
          },
          {
            action: 'later',
            title: 'Later',
            icon: '/icons/later-icon.png'
          }
        ]
      } as any
    )
  }

  // Public methods for manual operations
  async refreshAllData(): Promise<void> {
    const store = useFarmGuardStore.getState()
    await store.refreshData()
  }

  async syncOfflineData(): Promise<void> {
    const store = useFarmGuardStore.getState()
    await store.syncOfflineData()
  }

  async clearAllCaches(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('✅ All caches cleared')
    }
  }

  getInitializationStatus(): boolean {
    return this.isInitialized
  }
}

// Export singleton instance
export const appInitializer = FarmGuardAppInitializer.getInstance()

// Auto-initialize when module loads in browser environment
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      appInitializer.initialize()
    })
  } else {
    // DOM is already ready
    appInitializer.initialize()
  }
}

export default appInitializer