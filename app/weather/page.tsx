"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CloudRain, Sun, Cloud, Wind, Droplets, Eye, ArrowLeft, Calendar, MapPin, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"
import WeatherAlerts from "@/components/weather-alerts"
import { apiResilienceService } from '@/lib/api-resilience'
import { localStorageService, isOffline } from '@/lib/local-storage'

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

interface WeatherAlert {
  id: string
  type: "warning" | "watch" | "advisory" | "emergency" | "extreme"
  title: string
  description: string
  severity: "low" | "medium" | "high" | "extreme" | "critical"
  validUntil: string
  category: "rain" | "wind" | "temperature" | "storm" | "flood" | "drought"
  impact: string
  recommendedActions: string[]
}

export default function WeatherPage() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [location, setLocation] = useState<{ lat: number; lon: number; city: string } | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [dataSource, setDataSource] = useState<string>('')

  // Get current location with fallbacks
  const getCurrentLocation = async (): Promise<{ lat: number; lon: number; city: string }> => {
    try {
      const locationResult = await apiResilienceService.getCurrentLocation()
      return locationResult.data
    } catch (error) {
      console.warn('Failed to get location:', error)
      // Default to Ludhiana, Punjab (major farming region)
      return { lat: 30.9010, lon: 75.8573, city: 'Ludhiana' }
    }
  }

  // Fetch weather data with resilient location handling
  const fetchWeatherData = async (forceRefresh = false) => {
    try {
      setRefreshing(true)
      
      // Get location if we don't have it
      let currentLocation = location
      if (!currentLocation) {
        currentLocation = await getCurrentLocation()
        setLocation(currentLocation)
      }

      // Check if we're offline and have cached data
      if (isOffline() && !forceRefresh) {
        const cached = localStorageService.getBestWeatherData()
        if (cached.data) {
          setWeatherData({
            success: true,
            data: cached.data,
            source: 'cache'
          } as WeatherResponse)
          setDataSource(`${cached.source} (${Math.round(cached.age / 60000)}min ago)`)
          setLastRefresh(new Date())
          setError(null)
          return
        }
      }

      // Fetch from API with location parameters
      const url = `/api/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}${forceRefresh ? '&refresh=true' : ''}`
      const response = await fetch(url)
      const data: WeatherResponse = await response.json()
      
      setWeatherData(data)
      setDataSource(data.source || 'api')
      setLastRefresh(new Date())
      setError(null)
      
      // Cache the data for offline use
      if (data.success && data.data) {
        localStorageService.setWeatherData({
          forecast: data.data.forecast,
          alerts: data.data.alerts,
          location: data.data.location,
          lastUpdated: data.data.lastUpdated
        })
      }
      
    } catch (err) {
      console.error('Failed to fetch weather data:', err)
      
      // Try to use cached data as fallback
      const cached = localStorageService.getBestWeatherData()
      if (cached.data) {
        setWeatherData({
          success: false,
          data: cached.data,
          source: 'cache',
          error: 'Using cached data - connection failed'
        } as WeatherResponse)
        setDataSource(`fallback (${Math.round(cached.age / 60000)}min old)`)
        setError('Connection failed - showing cached data')
      } else {
        setError('Failed to load weather data and no cached data available')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [])

  // Use the fetched data or fallback to empty arrays
  const weatherAlerts = weatherData?.data.alerts || []
  const weatherForecast = weatherData?.data.forecast || []

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "rain":
      case "Heavy Rain":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "light-rain":
      case "Light Rain":
        return <CloudRain className="h-8 w-8 text-blue-400" />
      case "sunny":
      case "Sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
      case "Cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "partly-cloudy":
      case "Partly Cloudy":
        return <Cloud className="h-8 w-8 text-gray-400" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const selectedWeather = weatherForecast[selectedDay]

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/farmer">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <CloudRain className="h-6 w-6" />
                <h1 className="text-xl font-bold">Weather Forecast</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <CloudRain className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Loading Weather Data...</p>
              <p className="text-muted-foreground">Fetching latest forecast information</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !selectedWeather) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/farmer">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <CloudRain className="h-6 w-6" />
                <h1 className="text-xl font-bold">Weather Forecast</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-lg font-medium mb-2">Weather Data Unavailable</p>
              <p className="text-muted-foreground mb-4">
                {error || 'Unable to load weather forecast. Please try again later.'}
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/farmer">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <CloudRain className="h-6 w-6" />
              <h1 className="text-xl font-bold">Weather Forecast</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Location and Data Source */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {weatherData?.data.location ? 
                `${weatherData.data.location.name}, ${weatherData.data.location.country}` : 
                location ? `${location.city}` :
                'Location Unknown'
              }
            </span>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => {
              setLocation(null)
              fetchWeatherData(true)
            }}>
              📍 Update Location
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {weatherData?.source && (
              <Badge variant="outline" className={`text-xs ${
                weatherData.source === 'api' || weatherData.source === 'openweathermap' ? 'bg-green-50 text-green-700 border-green-200' :
                weatherData.source === 'cache' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                weatherData.source === 'fallback' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {weatherData.source === 'api' || weatherData.source === 'openweathermap' ? '🟢 Live Data' :
                 weatherData.source === 'cache' ? '💾 Cached Data' :
                 weatherData.source === 'fallback' || weatherData.source === 'mock' ? '📋 Offline Data' :
                 dataSource || 'Unknown Source'}
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchWeatherData(true)}
              disabled={refreshing}
              className="text-xs"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            
            {isOffline() && (
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                📡 Offline
              </Badge>
            )}
          </div>
        </div>

        {/* Weather Alerts */}
        <WeatherAlerts 
          alerts={weatherAlerts} 
          onRefresh={fetchWeatherData}
          className="mb-6"
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Weather */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {selectedWeather.day} - {new Date(selectedWeather.date).toLocaleDateString()}
                </CardTitle>
                <CardDescription>Detailed weather information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(selectedWeather.icon)}
                    <div>
                      <div className="text-3xl font-bold">{selectedWeather.high}°C</div>
                      <div className="text-sm text-muted-foreground">
                        High: {selectedWeather.high}°C / Low: {selectedWeather.low}°C
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium">{selectedWeather.condition}</div>
                    {selectedWeather.rainfall > 0 && (
                      <div className="text-sm text-blue-600">Rainfall: {selectedWeather.rainfall}mm</div>
                    )}
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Droplets className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="font-semibold">{selectedWeather.humidity}%</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Wind className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                    <div className="text-sm text-muted-foreground">Wind Speed</div>
                    <div className="font-semibold">{selectedWeather.windSpeed} km/h</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <CloudRain className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                    <div className="text-sm text-muted-foreground">Rainfall</div>
                    <div className="font-semibold">{selectedWeather.rainfall}mm</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Eye className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                    <div className="text-sm text-muted-foreground">Visibility</div>
                    <div className="font-semibold">{selectedWeather.visibility}km</div>
                  </div>
                </div>

                {/* Farming Recommendations */}
                {selectedWeather && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-medium text-green-800 mb-2">Farming Recommendations</h3>
                    <div className="text-sm text-green-700 space-y-1">
                      {selectedWeather.farmingRecommendations && selectedWeather.farmingRecommendations.length > 0 ? (
                        selectedWeather.farmingRecommendations.map((recommendation, index) => (
                          <p key={index}>• {recommendation}</p>
                        ))
                      ) : (
                        // Fallback recommendations based on weather conditions
                        selectedWeather.rainfall > 15 ? (
                          <>
                            <p>• Avoid field operations due to heavy rainfall</p>
                            <p>• Ensure proper drainage in fields</p>
                            <p>• Harvest ready crops before rain intensifies</p>
                          </>
                        ) : selectedWeather.rainfall > 5 ? (
                          <>
                            <p>• Light rain is good for crop growth</p>
                            <p>• Monitor for pest activity after rain</p>
                            <p>• Check irrigation needs may be reduced</p>
                          </>
                        ) : (
                          <>
                            <p>• Good weather for field operations</p>
                            <p>• Consider irrigation if soil is dry</p>
                            <p>• Ideal time for spraying if needed</p>
                          </>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 5-Day Forecast */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
                <CardDescription>Extended weather outlook</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherForecast.map((day, index) => (
                    <div
                      key={day.date}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedDay === index ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedDay(index)}
                    >
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(day.icon)}
                        <div>
                          <div className="font-medium">{day.day}</div>
                          <div className="text-sm opacity-75">{day.condition}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{day.high}°</div>
                        <div className="text-sm opacity-75">{day.low}°</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weather Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Weather Tips</CardTitle>
                <CardDescription>Seasonal farming advice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <strong className="text-blue-800">Monsoon Season:</strong>
                    <p className="text-blue-700 mt-1">
                      Ensure proper drainage and watch for fungal diseases in high humidity.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <strong className="text-yellow-800">Summer Season:</strong>
                    <p className="text-yellow-700 mt-1">
                      Increase irrigation frequency and provide shade for sensitive crops.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <strong className="text-green-800">Winter Season:</strong>
                    <p className="text-green-700 mt-1">Protect crops from frost and adjust watering schedule.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
