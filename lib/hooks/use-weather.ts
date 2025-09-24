"use client"

import { useState, useEffect } from 'react'

interface WeatherData {
  date: string
  day: string
  high: number
  low: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  rainfall: number
  visibility: number
  farmingRecommendations?: string[]
}

interface WeatherAlert {
  id: string
  type: 'warning' | 'watch' | 'advisory'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  validUntil: string
}

interface WeatherResponse {
  success: boolean
  data: {
    location: {
      name: string
      country: string
      lat: number
      lon: number
    }
    forecast: WeatherData[]
    alerts: WeatherAlert[]
    lastUpdated: string
  }
  source: string
  error?: string
}

interface UseWeatherResult {
  data: WeatherResponse | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useWeather(lat?: number, lon?: number): UseWeatherResult {
  const [data, setData] = useState<WeatherResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (lat) params.append('lat', lat.toString())
      if (lon) params.append('lon', lon.toString())
      
      const url = `/api/weather${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url)
      const weatherData: WeatherResponse = await response.json()
      
      setData(weatherData)
    } catch (err) {
      console.error('Failed to fetch weather data:', err)
      setError('Failed to load weather data')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [lat, lon])

  return {
    data,
    loading,
    error,
    refetch: fetchWeatherData
  }
}

// Helper hook to get just today's weather for dashboard
export function useTodaysWeather(lat?: number, lon?: number) {
  const { data, loading, error, refetch } = useWeather(lat, lon)
  
  const todaysWeather = data?.data?.forecast?.[0] || null
  const alerts = data?.data?.alerts || []
  const location = data?.data?.location || null
  
  return {
    weather: todaysWeather,
    alerts,
    location,
    loading,
    error,
    refetch
  }
}
