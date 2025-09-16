const CACHE_NAME = "farmguard-v1"
const OFFLINE_URL = "/offline"

// Essential files to cache for offline functionality
const STATIC_CACHE_URLS = [
  "/",
  "/dashboard/farmer",
  "/ai-assistant",
  "/weather",
  "/market-info",
  "/pest-detection",
  "/offline",
  "/manifest.json",
  "/icon-192.jpg",
  "/icon-512.jpg",
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

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse
      }

      // Try to fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache the response for future use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If network fails, try to serve offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL)
          }

          // For other requests, return a generic offline response
          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          })
        })
    }),
  )
})

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

// IndexedDB helpers for offline data storage
async function getOfflineData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FarmGuardDB", 1)

    request.onerror = () => reject(request.error)

    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(["offlineData"], "readonly")
      const store = transaction.objectStore("offlineData")
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = () => resolve(getAllRequest.result)
      getAllRequest.onerror = () => reject(getAllRequest.error)
    }

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains("offlineData")) {
        db.createObjectStore("offlineData", { keyPath: "id", autoIncrement: true })
      }
    }
  })
}

async function clearOfflineData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FarmGuardDB", 1)

    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(["offlineData"], "readwrite")
      const store = transaction.objectStore("offlineData")
      const clearRequest = store.clear()

      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    }
  })
}
