// FarmGuard Enhanced Service Worker
const CACHE_NAME = "farmguard-v1.2.0"
const STATIC_CACHE = "farmguard-static-v1.2.0"
const DYNAMIC_CACHE = "farmguard-dynamic-v1.2.0"
const API_CACHE = "farmguard-api-v1.2.0"
const OFFLINE_URL = "/offline"

// Essential files to cache for offline functionality
const STATIC_CACHE_URLS = [
  "/",
  "/dashboard/farmer",
  "/ai-assistant",
  "/weather",
  "/market-info",
  "/pest-detection",
  "/soil-analysis",
  "/farm-suggestions",
  "/language-selection",
  "/login",
  "/offline",
  "/manifest.json",
  "/icon-192.jpg",
  "/icon-512.jpg",
]

// API endpoints to cache
const CACHEABLE_APIS = [
  "/api/weather",
  "/api/market-info",
  "/api/farm-suggestions",
  "/api/location",
  "/api/soil-analysis",
  "/api/pest-detection"
]

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching essential resources")
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        console.log("Service worker installed successfully")
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service worker activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - handle network requests with advanced caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip cross-origin requests except APIs
  if (url.origin !== location.origin && !request.url.includes('/api/')) {
    return
  }

  // Handle different types of requests with appropriate strategies
  if (request.url.includes('/api/')) {
    // API requests - Network First with fallback to cache
    event.respondWith(handleApiRequest(request))
  } else if (request.destination === 'document') {
    // HTML pages - Network First with offline fallback
    event.respondWith(handlePageRequest(request))
  } else if (request.destination === 'image') {
    // Images - Cache First
    event.respondWith(handleImageRequest(request))
  } else {
    // Other static assets - Stale While Revalidate
    event.respondWith(handleStaticRequest(request))
  }
})

// Handle API requests with Network First strategy
async function handleApiRequest(request) {
  const url = new URL(request.url)
  
  try {
    // Try network first
    const response = await fetch(request.clone())
    
    if (response.ok) {
      // Cache successful API responses
      const cache = await caches.open(API_CACHE)
      
      // Only cache GET requests
      if (request.method === 'GET') {
        cache.put(request, response.clone())
      }
      
      // Store critical data for offline access
      if (url.pathname.includes('/weather')) {
        await storeWeatherData(response.clone())
      } else if (url.pathname.includes('/market-info')) {
        await storeMarketData(response.clone())
      }
    }
    
    return response
  } catch (error) {
    console.log('[SW] Network failed for API request, checking cache:', url.pathname)
    
    // Try cache fallback
    const cache = await caches.open(API_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('[SW] Serving API request from cache')
      return cachedResponse
    }
    
    // Return offline data if available
    if (url.pathname.includes('/weather')) {
      return await getOfflineWeatherData(request)
    } else if (url.pathname.includes('/market-info')) {
      return await getOfflineMarketData(request)
    }
    
    // Return generic offline response for API requests
    return new Response(JSON.stringify({
      success: false,
      error: 'Service unavailable offline',
      offline: true,
      message: 'This feature requires internet connection'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    })
  }
}

// Handle page requests with Network First strategy
async function handlePageRequest(request) {
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      // Cache successful page responses
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.log('[SW] Network failed for page request, checking cache')
    
    // Try cache fallback
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('[SW] Serving page from cache')
      return cachedResponse
    }
    
    // Fallback to offline page
    return caches.match(OFFLINE_URL)
  }
}

// Handle image requests with Cache First strategy
async function handleImageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    // Return placeholder for offline images
    return new Response('', { status: 200, statusText: 'OK' })
  }
}

// Handle static asset requests with Stale While Revalidate
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  // Return cached version immediately if available
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
    }).catch(() => {}) // Ignore network errors for background updates
    
    return cachedResponse
  }
  
  // If not in cache, try network
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    return new Response('Offline', { status: 200, statusText: 'OK' })
  }
}

// Store weather data for offline access
async function storeWeatherData(response) {
  try {
    const data = await response.json()
    
    if (data.success && data.data) {
      await storeInIndexedDB('weather', {
        id: 'current_weather',
        data: data.data,
        timestamp: Date.now(),
        expires: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
      })
    }
  } catch (error) {
    console.log('[SW] Error storing weather data:', error)
  }
}

// Store market data for offline access
async function storeMarketData(response) {
  try {
    const data = await response.json()
    
    if (data.success && data.data) {
      await storeInIndexedDB('market', {
        id: 'current_market',
        data: data.data,
        timestamp: Date.now(),
        expires: Date.now() + (6 * 60 * 60 * 1000) // 6 hours
      })
    }
  } catch (error) {
    console.log('[SW] Error storing market data:', error)
  }
}

// Get offline weather data
async function getOfflineWeatherData(request) {
  try {
    const offlineData = await getFromIndexedDB('weather', 'current_weather')
    
    if (offlineData && offlineData.expires > Date.now()) {
      return new Response(JSON.stringify({
        success: true,
        data: offlineData.data,
        offline: true,
        cached_at: new Date(offlineData.timestamp).toISOString(),
        message: 'Offline weather data'
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.log('[SW] Error retrieving offline weather data:', error)
  }
  
  return new Response(JSON.stringify({
    success: false,
    offline: true,
    error: 'No offline weather data available'
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 503
  })
}

// Get offline market data
async function getOfflineMarketData(request) {
  try {
    const offlineData = await getFromIndexedDB('market', 'current_market')
    
    if (offlineData && offlineData.expires > Date.now()) {
      return new Response(JSON.stringify({
        success: true,
        data: offlineData.data,
        offline: true,
        cached_at: new Date(offlineData.timestamp).toISOString(),
        message: 'Offline market data'
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.log('[SW] Error retrieving offline market data:', error)
  }
  
  return new Response(JSON.stringify({
    success: false,
    offline: true,
    error: 'No offline market data available'
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 503
  })
}

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(syncOfflineData())
  }
})

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Get offline data from IndexedDB
    const offlineData = await getOfflineData()

    if (offlineData.length > 0) {
      // Send offline data to server
      for (const data of offlineData) {
        await fetch("/api/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
      }

      // Clear offline data after successful sync
      await clearOfflineData()
      console.log("Offline data synced successfully")
    }
  } catch (error) {
    console.error("Failed to sync offline data:", error)
  }
}

// Enhanced IndexedDB helpers for offline data storage
function storeInIndexedDB(storeName, data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FarmGuardOfflineDB', 2)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('weather')) {
        db.createObjectStore('weather', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('market')) {
        db.createObjectStore('market', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('user_data')) {
        db.createObjectStore('user_data', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('farm_data')) {
        db.createObjectStore('farm_data', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('offlineData')) {
        db.createObjectStore('offlineData', { keyPath: 'id', autoIncrement: true })
      }
    }
    
    request.onsuccess = (event) => {
      const db = event.target.result
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      const putRequest = store.put(data)
      
      putRequest.onsuccess = () => resolve()
      putRequest.onerror = () => reject(putRequest.error)
    }
    
    request.onerror = () => reject(request.error)
  })
}

function getFromIndexedDB(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FarmGuardOfflineDB', 2)
    
    request.onsuccess = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains(storeName)) {
        resolve(null)
        return
      }
      
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const getRequest = store.get(id)
      
      getRequest.onsuccess = () => resolve(getRequest.result)
      getRequest.onerror = () => reject(getRequest.error)
    }
    
    request.onerror = () => reject(request.error)
  })
}

async function getOfflineData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FarmGuardOfflineDB", 2)

    request.onerror = () => reject(request.error)

    request.onsuccess = () => {
      const db = request.result
      
      if (!db.objectStoreNames.contains("offlineData")) {
        resolve([])
        return
      }
      
      const transaction = db.transaction(["offlineData"], "readonly")
      const store = transaction.objectStore("offlineData")
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = () => resolve(getAllRequest.result)
      getAllRequest.onerror = () => reject(getAllRequest.error)
    }
  })
}

async function clearOfflineData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FarmGuardOfflineDB", 2)

    request.onsuccess = () => {
      const db = request.result
      
      if (!db.objectStoreNames.contains("offlineData")) {
        resolve()
        return
      }
      
      const transaction = db.transaction(["offlineData"], "readwrite")
      const store = transaction.objectStore("offlineData")
      const clearRequest = store.clear()

      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    }
  })
}

// Push notification and message handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')
  
  const options = {
    body: 'You have new farming updates',
    icon: '/icon-192.jpg',
    badge: '/icon-192.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Updates',
        icon: '/icon-192.jpg'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  }
  
  if (event.data) {
    const pushData = event.data.json()
    options.body = pushData.body || options.body
    options.data = { ...options.data, ...pushData }
  }
  
  event.waitUntil(
    self.registration.showNotification('FarmGuard Alert', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard/farmer')
    )
  } else if (event.action !== 'close') {
    event.waitUntil(
      clients.openWindow('/dashboard/farmer')
    )
  }
})

// Message handling for communication with the main app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting()
        break
        
      case 'CACHE_CRITICAL_DATA':
        event.waitUntil(cacheCriticalData(event.data.data))
        break
        
      case 'SYNC_REQUEST':
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
          self.registration.sync.register('farmguard-data-sync')
        }
        break
        
      case 'GET_CACHE_STATUS':
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({
            type: 'CACHE_STATUS',
            cached: true
          })
        }
        break
    }
  }
})

// Cache critical data when requested by the app
async function cacheCriticalData(data) {
  try {
    if (data.weather) {
      await storeInIndexedDB('weather', {
        id: 'critical_weather',
        data: data.weather,
        timestamp: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      })
    }
    
    if (data.farmData) {
      await storeInIndexedDB('farm_data', {
        id: 'user_farm',
        data: data.farmData,
        timestamp: Date.now()
      })
    }
    
    console.log('[SW] Critical data cached successfully')
  } catch (error) {
    console.log('[SW] Error caching critical data:', error)
  }
}

console.log('[SW] FarmGuard Enhanced Service Worker loaded successfully')
