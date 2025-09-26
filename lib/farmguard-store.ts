// FarmGuard Global State Management
// Centralizes all app state and data flow

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Types for the global state
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  location?: {
    district: string
    tehsil?: string
    village?: string
    coordinates?: {
      lat: number
      lon: number
    }
  }
  farmDetails?: {
    totalLand: number
    crops: string[]
    soilType?: string
    irrigationType?: string
    farmingExperience: 'beginner' | 'intermediate' | 'experienced'
  }
  preferences: {
    language: 'en' | 'pa' | 'hi'
    units: 'metric' | 'imperial'
    notifications: boolean
  }
  isVerified: boolean
  createdAt: string
  lastLoginAt: string
}

export interface WeatherData {
  location: {
    name: string
    coordinates: { lat: number; lon: number }
  }
  forecast: Array<{
    date: string
    day: string
    high: number
    low: number
    condition: string
    humidity: number
    windSpeed: number
    rainfall: number
    farmingRecommendations: string[]
  }>
  alerts: Array<{
    id: string
    title: string
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    validUntil: string
  }>
  lastUpdated: string
}

export interface MarketData {
  prices: Array<{
    crop: string
    currentPrice: number
    previousPrice: number
    change: number
    changePercentage: number
    unit: string
    market: string
    lastUpdated: string
    trend: 'up' | 'down' | 'stable'
  }>
  alerts: Array<{
    id: string
    crop: string
    message: string
    severity: 'info' | 'warning' | 'critical'
  }>
  summary: {
    totalCrops: number
    pricesUp: number
    pricesDown: number
    lastUpdated: string
  }
}

export interface CropSuggestion {
  cropName: string
  variety: string
  season: string
  suitabilityScore: number
  profitability: {
    investmentCost: number
    expectedRevenue: number
    profit: number
    profitMargin: number
    roi: number
  }
  requirements: {
    seedQuantity: string
    fertilizer: string[]
    irrigation: string
    laborHours: number
  }
  tips: string[]
  risks: string[]
  benefits: string[]
}

export interface PestDetection {
  detectedPests: Array<{
    id: string
    name: {
      english: string
      punjabi: string
      hindi: string
    }
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    confidence: number
    symptoms: string[]
    treatment: string[]
  }>
  recommendations: Array<{
    method: string
    products: Array<{
      name: string
      dosage: string
      cost: number
    }>
    timing: string
    effectiveness: number
  }>
  lastAnalysis: string
}

export interface SoilAnalysis {
  testResults: {
    id: string
    testDate: string
    location: string
    basicParameters: {
      pH: {
        value: number
        status: 'acidic' | 'neutral' | 'alkaline'
        recommendation: string
      }
      organic_carbon: {
        value: number
        status: 'low' | 'medium' | 'high'
        recommendation: string
      }
    }
    nutrients: {
      nitrogen: { value: number; status: string; recommendation: string }
      phosphorus: { value: number; status: string; recommendation: string }
      potassium: { value: number; status: string; recommendation: string }
    }
  }
  soilHealthScore: {
    overall_score: number
    improvement_areas: string[]
    strengths: string[]
  }
  lastTest: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    weather: boolean
    market: boolean
    pests: boolean
    reminders: boolean
  }
  connectivity: {
    isOnline: boolean
    lastSync: string
  }
  cache: {
    weatherExpiry: number
    marketExpiry: number
    dataExpiry: number
  }
}

// Main store interface
interface FarmGuardStore {
  // User state
  user: User | null
  isAuthenticated: boolean
  authToken: string | null

  // Data state
  weather: WeatherData | null
  market: MarketData | null
  cropSuggestions: CropSuggestion[]
  pestDetection: PestDetection | null
  soilAnalysis: SoilAnalysis | null

  // App state
  settings: AppSettings
  loading: {
    weather: boolean
    market: boolean
    crops: boolean
    pests: boolean
    soil: boolean
  }
  errors: {
    weather: string | null
    market: string | null
    crops: string | null
    pests: string | null
    soil: string | null
  }

  // Actions
  // User actions
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  signOut: () => void
  setAuthToken: (token: string) => void

  // Data actions
  setWeatherData: (data: WeatherData) => void
  setMarketData: (data: MarketData) => void
  setCropSuggestions: (suggestions: CropSuggestion[]) => void
  setPestDetection: (detection: PestDetection) => void
  setSoilAnalysis: (analysis: SoilAnalysis) => void

  // Loading actions
  setLoading: (key: keyof FarmGuardStore['loading'], value: boolean) => void
  setError: (key: keyof FarmGuardStore['errors'], error: string | null) => void

  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void
  setConnectivity: (isOnline: boolean) => void
  updateLastSync: () => void

  // API actions
  fetchWeatherData: (lat?: number, lon?: number) => Promise<void>
  fetchMarketData: (filters?: any) => Promise<void>
  fetchCropSuggestions: (farmDetails: any) => Promise<void>
  analyzePests: (data: any) => Promise<void>
  analyzeSoil: (data: any) => Promise<void>

  // Utility actions
  clearAllData: () => void
  refreshData: () => Promise<void>
  syncOfflineData: () => Promise<void>
}

// Create the Zustand store with persistence
export const useFarmGuardStore = create<FarmGuardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      authToken: null,
      
      weather: null,
      market: null,
      cropSuggestions: [],
      pestDetection: null,
      soilAnalysis: null,

      settings: {
        theme: 'system',
        notifications: {
          weather: true,
          market: true,
          pests: true,
          reminders: true
        },
        connectivity: {
          isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
          lastSync: new Date().toISOString()
        },
        cache: {
          weatherExpiry: 2 * 60 * 60 * 1000, // 2 hours
          marketExpiry: 6 * 60 * 60 * 1000, // 6 hours
          dataExpiry: 24 * 60 * 60 * 1000 // 24 hours
        }
      },

      loading: {
        weather: false,
        market: false,
        crops: false,
        pests: false,
        soil: false
      },

      errors: {
        weather: null,
        market: null,
        crops: null,
        pests: null,
        soil: null
      },

      // User actions
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: true,
          errors: { ...get().errors, weather: null, market: null }
        })
      },

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },

      signOut: () => {
        set({
          user: null,
          isAuthenticated: false,
          authToken: null,
          weather: null,
          market: null,
          cropSuggestions: [],
          pestDetection: null,
          soilAnalysis: null
        })
      },

      setAuthToken: (token) => {
        set({ authToken: token })
      },

      // Data actions
      setWeatherData: (data) => {
        set({ 
          weather: data,
          errors: { ...get().errors, weather: null }
        })
      },

      setMarketData: (data) => {
        set({ 
          market: data,
          errors: { ...get().errors, market: null }
        })
      },

      setCropSuggestions: (suggestions) => {
        set({ 
          cropSuggestions: suggestions,
          errors: { ...get().errors, crops: null }
        })
      },

      setPestDetection: (detection) => {
        set({ 
          pestDetection: detection,
          errors: { ...get().errors, pests: null }
        })
      },

      setSoilAnalysis: (analysis) => {
        set({ 
          soilAnalysis: analysis,
          errors: { ...get().errors, soil: null }
        })
      },

      // Loading and error actions
      setLoading: (key, value) => {
        set({
          loading: { ...get().loading, [key]: value }
        })
      },

      setError: (key, error) => {
        set({
          errors: { ...get().errors, [key]: error }
        })
      },

      // Settings actions
      updateSettings: (updates) => {
        set({
          settings: { ...get().settings, ...updates }
        })
      },

      setConnectivity: (isOnline) => {
        set({
          settings: {
            ...get().settings,
            connectivity: {
              ...get().settings.connectivity,
              isOnline
            }
          }
        })
      },

      updateLastSync: () => {
        set({
          settings: {
            ...get().settings,
            connectivity: {
              ...get().settings.connectivity,
              lastSync: new Date().toISOString()
            }
          }
        })
      },

      // API actions
      fetchWeatherData: async (lat, lon) => {
        const { setLoading, setError, setWeatherData, user } = get()
        
        setLoading('weather', true)
        setError('weather', null)
        
        try {
          const coords = lat && lon ? 
            { lat, lon } : 
            user?.location?.coordinates || { lat: 30.9001, lon: 75.8573 } // Default to Ludhiana
          
          const response = await fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`)
          const data = await response.json()
          
          if (data.success) {
            setWeatherData(data.data)
          } else {
            setError('weather', data.error || 'Failed to fetch weather data')
          }
        } catch (error) {
          console.error('Weather fetch error:', error)
          setError('weather', 'Network error while fetching weather')
        } finally {
          setLoading('weather', false)
        }
      },

      fetchMarketData: async (filters = {}) => {
        const { setLoading, setError, setMarketData } = get()
        
        setLoading('market', true)
        setError('market', null)
        
        try {
          const queryParams = new URLSearchParams(filters).toString()
          const response = await fetch(`/api/market-info?${queryParams}`)
          const data = await response.json()
          
          if (data.success) {
            setMarketData(data.data)
          } else {
            setError('market', data.error || 'Failed to fetch market data')
          }
        } catch (error) {
          console.error('Market fetch error:', error)
          setError('market', 'Network error while fetching market data')
        } finally {
          setLoading('market', false)
        }
      },

      fetchCropSuggestions: async (farmDetails) => {
        const { setLoading, setError, setCropSuggestions } = get()
        
        setLoading('crops', true)
        setError('crops', null)
        
        try {
          const response = await fetch('/api/farm-suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(farmDetails)
          })
          const data = await response.json()
          
          if (data.success) {
            setCropSuggestions(data.data.suggestions || [])
          } else {
            setError('crops', data.error || 'Failed to fetch crop suggestions')
          }
        } catch (error) {
          console.error('Crop suggestions error:', error)
          setError('crops', 'Network error while fetching crop suggestions')
        } finally {
          setLoading('crops', false)
        }
      },

      analyzePests: async (data) => {
        const { setLoading, setError, setPestDetection } = get()
        
        setLoading('pests', true)
        setError('pests', null)
        
        try {
          const response = await fetch('/api/pest-detection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          const result = await response.json()
          
          if (result.success) {
            setPestDetection({
              detectedPests: result.data.detectedPests || [],
              recommendations: result.data.recommendations || [],
              lastAnalysis: new Date().toISOString()
            })
          } else {
            setError('pests', result.error || 'Failed to analyze pests')
          }
        } catch (error) {
          console.error('Pest analysis error:', error)
          setError('pests', 'Network error during pest analysis')
        } finally {
          setLoading('pests', false)
        }
      },

      analyzeSoil: async (data) => {
        const { setLoading, setError, setSoilAnalysis } = get()
        
        setLoading('soil', true)
        setError('soil', null)
        
        try {
          const response = await fetch('/api/soil-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          const result = await response.json()
          
          if (result.success) {
            setSoilAnalysis({
              testResults: result.data.testResults,
              soilHealthScore: result.data.soilHealthScore,
              lastTest: new Date().toISOString()
            })
          } else {
            setError('soil', result.error || 'Failed to analyze soil')
          }
        } catch (error) {
          console.error('Soil analysis error:', error)
          setError('soil', 'Network error during soil analysis')
        } finally {
          setLoading('soil', false)
        }
      },

      // Utility actions
      clearAllData: () => {
        set({
          weather: null,
          market: null,
          cropSuggestions: [],
          pestDetection: null,
          soilAnalysis: null,
          errors: {
            weather: null,
            market: null,
            crops: null,
            pests: null,
            soil: null
          }
        })
      },

      refreshData: async () => {
        const { fetchWeatherData, fetchMarketData, user, updateLastSync } = get()
        
        try {
          // Refresh core data
          await Promise.allSettled([
            fetchWeatherData(),
            fetchMarketData()
          ])
          
          updateLastSync()
        } catch (error) {
          console.error('Data refresh error:', error)
        }
      },

      syncOfflineData: async () => {
        const { updateLastSync } = get()
        
        try {
          // Trigger service worker sync
          if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            const registration = await navigator.serviceWorker.ready
            if ('sync' in registration) {
              await (registration as any).sync.register('farmguard-data-sync')
            }
          }
          
          updateLastSync()
        } catch (error) {
          console.error('Offline sync error:', error)
        }
      }
    }),
    {
      name: 'farmguard-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        authToken: state.authToken,
        settings: state.settings,
        // Cache weather and market data for offline use
        weather: state.weather,
        market: state.market
      })
    }
  )
)

// Helper hooks for specific data
export const useUser = () => {
  return useFarmGuardStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    setUser: state.setUser,
    updateUser: state.updateUser,
    signOut: state.signOut
  }))
}

export const useWeatherData = () => {
  return useFarmGuardStore((state) => ({
    weather: state.weather,
    loading: state.loading.weather,
    error: state.errors.weather,
    fetchWeatherData: state.fetchWeatherData
  }))
}

export const useMarketData = () => {
  return useFarmGuardStore((state) => ({
    market: state.market,
    loading: state.loading.market,
    error: state.errors.market,
    fetchMarketData: state.fetchMarketData
  }))
}

export const useCropSuggestions = () => {
  return useFarmGuardStore((state) => ({
    suggestions: state.cropSuggestions,
    loading: state.loading.crops,
    error: state.errors.crops,
    fetchCropSuggestions: state.fetchCropSuggestions
  }))
}

export const usePestDetection = () => {
  return useFarmGuardStore((state) => ({
    detection: state.pestDetection,
    loading: state.loading.pests,
    error: state.errors.pests,
    analyzePests: state.analyzePests
  }))
}

export const useSoilAnalysis = () => {
  return useFarmGuardStore((state) => ({
    analysis: state.soilAnalysis,
    loading: state.loading.soil,
    error: state.errors.soil,
    analyzeSoil: state.analyzeSoil
  }))
}

export const useAppSettings = () => {
  return useFarmGuardStore((state) => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
    setConnectivity: state.setConnectivity,
    updateLastSync: state.updateLastSync
  }))
}

// Initialize connectivity monitoring
if (typeof window !== 'undefined') {
  const store = useFarmGuardStore.getState()
  
  // Listen for online/offline events
  window.addEventListener('online', () => {
    store.setConnectivity(true)
    store.refreshData() // Refresh data when coming back online
  })
  
  window.addEventListener('offline', () => {
    store.setConnectivity(false)
  })
  
  // Initialize connectivity state
  store.setConnectivity(navigator.onLine)
}

export default useFarmGuardStore