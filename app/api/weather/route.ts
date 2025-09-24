import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'

interface OpenWeatherHourlyData {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  visibility?: number
  pop: number // Probability of precipitation
  rain?: {
    '1h': number
  }
  snow?: {
    '1h': number
  }
}

interface OpenWeatherResponse {
  cod: string
  message: number
  cnt: number
  list: OpenWeatherHourlyData[]
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

interface ProcessedWeatherData {
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
  farmingRecommendations: string[]
}

interface WeatherAlert {
  id: string
  type: 'warning' | 'watch' | 'advisory'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  validUntil: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat') || API_CONFIG.WEATHER.DEFAULT_LAT.toString()
  const lon = searchParams.get('lon') || API_CONFIG.WEATHER.DEFAULT_LON.toString()
  const hours = parseInt(searchParams.get('hours') || '120') // Default 5 days (120 hours)

  try {
    // Construct the API URL
    const apiUrl = `${API_CONFIG.WEATHER.HOURLY_FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_CONFIG.WEATHER.API_KEY}&units=${API_CONFIG.WEATHER.UNITS}&cnt=${hours}`
    
    console.log('Fetching weather data from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 1800 } // Cache for 30 minutes
    })

    if (!response.ok) {
      console.error('Weather API error:', response.status, response.statusText)
      
      // Return mock data if API fails
      return NextResponse.json({
        success: false,
        error: 'Weather API unavailable',
        data: getMockWeatherData(),
        source: 'mock'
      })
    }

    const weatherData: OpenWeatherResponse = await response.json()
    
    // Process the hourly data into daily summaries
    const processedData = processHourlyToDaily(weatherData)
    
    // Generate weather alerts based on conditions
    const alerts = generateWeatherAlerts(processedData)
    
    return NextResponse.json({
      success: true,
      data: {
        location: {
          name: weatherData.city.name,
          country: weatherData.city.country,
          lat: weatherData.city.coord.lat,
          lon: weatherData.city.coord.lon
        },
        forecast: processedData,
        alerts: alerts,
        lastUpdated: new Date().toISOString()
      },
      source: 'openweathermap'
    })

  } catch (error) {
    console.error('Weather API fetch error:', error)
    
    // Return mock data as fallback
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch weather data',
      data: getMockWeatherData(),
      source: 'mock'
    })
  }
}

// Process hourly data into daily summaries
function processHourlyToDaily(data: OpenWeatherResponse): ProcessedWeatherData[] {
  const dailyData: { [key: string]: OpenWeatherHourlyData[] } = {}
  
  // Group hourly data by date
  data.list.forEach(hour => {
    const date = new Date(hour.dt * 1000).toISOString().split('T')[0]
    if (!dailyData[date]) {
      dailyData[date] = []
    }
    dailyData[date].push(hour)
  })
  
  // Process each day
  return Object.entries(dailyData).slice(0, 5).map(([date, hours], index) => {
    const temps = hours.map(h => h.main.temp)
    const high = Math.round(Math.max(...temps))
    const low = Math.round(Math.min(...temps))
    
    // Get most common weather condition
    const conditions = hours.map(h => h.weather[0].main)
    const condition = getMostCommonCondition(conditions)
    
    // Calculate average values
    const avgHumidity = Math.round(hours.reduce((sum, h) => sum + h.main.humidity, 0) / hours.length)
    const avgWindSpeed = Math.round(hours.reduce((sum, h) => sum + h.wind.speed * 3.6, 0) / hours.length) // Convert m/s to km/h
    const totalRainfall = Math.round(hours.reduce((sum, h) => sum + (h.rain?.['1h'] || 0), 0))
    const avgVisibility = hours[0].visibility ? Math.round(hours[0].visibility / 1000) : 10 // Convert to km
    
    const dayNames = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday']
    
    return {
      date,
      day: index < 2 ? dayNames[index] : new Date(date).toLocaleDateString('en', { weekday: 'long' }),
      high,
      low,
      condition,
      icon: mapWeatherIcon(condition),
      humidity: avgHumidity,
      windSpeed: avgWindSpeed,
      rainfall: totalRainfall,
      visibility: avgVisibility,
      farmingRecommendations: generateFarmingRecommendations(condition, totalRainfall, avgWindSpeed)
    }
  })
}

// Map OpenWeatherMap conditions to our icon system
function mapWeatherIcon(condition: string): string {
  const iconMap: { [key: string]: string } = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rain',
    'Drizzle': 'light-rain',
    'Thunderstorm': 'rain',
    'Snow': 'snow',
    'Mist': 'cloudy',
    'Fog': 'cloudy'
  }
  
  return iconMap[condition] || 'partly-cloudy'
}

// Get the most common weather condition from hourly data
function getMostCommonCondition(conditions: string[]): string {
  const counts = conditions.reduce((acc, condition) => {
    acc[condition] = (acc[condition] || 0) + 1
    return acc
  }, {} as { [key: string]: number })
  
  return Object.entries(counts).sort(([,a], [,b]) => b - a)[0][0]
}

// Generate farming recommendations based on weather conditions
function generateFarmingRecommendations(condition: string, rainfall: number, windSpeed: number): string[] {
  const recommendations: string[] = []
  
  if (rainfall > 15) {
    recommendations.push('Avoid field operations due to heavy rainfall')
    recommendations.push('Ensure proper drainage in fields')
    recommendations.push('Harvest ready crops before rain intensifies')
    recommendations.push('Check for waterlogging in low-lying areas')
  } else if (rainfall > 5) {
    recommendations.push('Light rain is beneficial for crop growth')
    recommendations.push('Monitor for pest activity after rain')
    recommendations.push('Irrigation needs may be reduced')
  } else {
    recommendations.push('Good weather for field operations')
    recommendations.push('Consider irrigation if soil moisture is low')
    recommendations.push('Ideal time for spraying if needed')
  }
  
  if (windSpeed > 30) {
    recommendations.push('Strong winds expected - secure loose equipment')
    recommendations.push('Check crop supports and ties')
  }
  
  if (condition === 'Clear') {
    recommendations.push('Excellent conditions for harvesting')
    recommendations.push('Good visibility for precision operations')
  }
  
  return recommendations
}

// Generate weather alerts based on forecast data
function generateWeatherAlerts(forecast: ProcessedWeatherData[]): WeatherAlert[] {
  const alerts: WeatherAlert[] = []
  
  forecast.forEach((day, index) => {
    // Heavy rainfall alert
    if (day.rainfall > 20) {
      alerts.push({
        id: `rain-${day.date}`,
        type: 'warning',
        title: 'Heavy Rainfall Warning',
        description: `Heavy rainfall of ${day.rainfall}mm expected on ${day.day}. Consider harvesting ready crops and protecting young plants.`,
        severity: 'high',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString()
      })
    }
    
    // High wind alert
    if (day.windSpeed > 35) {
      alerts.push({
        id: `wind-${day.date}`,
        type: 'advisory',
        title: 'High Wind Advisory',
        description: `Strong winds up to ${day.windSpeed} km/h expected on ${day.day}. Secure loose farming equipment and check crop supports.`,
        severity: 'medium',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString()
      })
    }
    
    // Extreme temperature alert
    if (day.high > 40) {
      alerts.push({
        id: `heat-${day.date}`,
        type: 'watch',
        title: 'Extreme Heat Warning',
        description: `Very high temperatures of ${day.high}°C expected on ${day.day}. Increase irrigation and provide shade protection for sensitive crops.`,
        severity: 'high',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString()
      })
    }
  })
  
  return alerts
}

// Mock weather data for fallback
function getMockWeatherData() {
  return {
    location: {
      name: 'Ludhiana',
      country: 'IN',
      lat: 30.9010,
      lon: 75.8573
    },
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
      },
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        day: 'Tomorrow',
        high: 30,
        low: 20,
        condition: 'Sunny',
        icon: 'sunny',
        humidity: 55,
        windSpeed: 8,
        rainfall: 0,
        visibility: 12,
        farmingRecommendations: [
          'Excellent conditions for harvesting',
          'Good visibility for precision operations',
          'Monitor irrigation needs in hot weather'
        ]
      },
      // Add more mock days as needed
    ],
    alerts: [],
    lastUpdated: new Date().toISOString()
  }
}
