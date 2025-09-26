import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'
import { getEnhancedMockWeatherData } from '@/lib/enhanced-mock-weather'
import { apiKeyManager } from '@/lib/api-key-manager'
import PunjabLocationService, { type PunjabDistrict } from '@/lib/punjab-location-service'
import SmartNotificationService from '@/lib/smart-notification-service'

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
  type: 'warning' | 'watch' | 'advisory' | 'emergency' | 'extreme'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'extreme' | 'critical'
  validUntil: string
  category: 'rain' | 'wind' | 'temperature' | 'storm' | 'flood' | 'drought'
  impact: string
  recommendedActions: string[]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get('lat')) || API_CONFIG.WEATHER.DEFAULT_LAT
  const lon = Number(searchParams.get('lon')) || API_CONFIG.WEATHER.DEFAULT_LON
  const forceRefresh = searchParams.get('refresh') === 'true'
  
  console.log(`🌦️ Enhanced Weather API request: lat=${lat}, lon=${lon}, forceRefresh=${forceRefresh}`)
  
  // Get Punjab-specific location information
  const userDistrict = PunjabLocationService.findNearestDistrict({ lat, lon })
  const isInPunjab = PunjabLocationService.isInPunjab({ lat, lon })
  const weatherStation = userDistrict ? PunjabLocationService.getWeatherStationMapping(userDistrict) : null
  
  console.log(`📍 Location analysis: ${userDistrict?.name || 'Outside Punjab'}, Station: ${weatherStation?.station || 'Default'}`)

  // Generate enhanced mock data with Punjab agricultural context
  try {
    // Import enhanced mock data for reliable weather with alerts
    const { getEnhancedMockWeatherData } = await import('@/lib/enhanced-mock-weather')
    let mockData = getEnhancedMockWeatherData()
    
    // Enhance with Punjab-specific agricultural context
    if (userDistrict) {
      mockData = enhanceWithPunjabContext(mockData, userDistrict)
      
      // Generate agricultural alerts based on weather and location
      const weatherAlerts = SmartNotificationService.generateWeatherAlerts(mockData, userDistrict)
      
      // Add agricultural alerts to weather alerts
      mockData.alerts = [
        ...mockData.alerts,
        ...weatherAlerts.map(alert => ({
          id: alert.id,
          type: alert.priority === 'critical' ? 'emergency' as const : 'warning' as const,
          title: alert.title,
          description: alert.message,
          severity: mapPriorityToSeverity(alert.priority),
          validUntil: alert.timing.validUntil.toISOString(),
          category: alert.category.includes('rain') ? 'rain' as const : 
                   alert.category.includes('heat') ? 'temperature' as const : 
                   'storm' as const,
          impact: `Agricultural impact for ${userDistrict.name} district`,
          recommendedActions: alert.actions?.map(a => a.label) || []
        }))
      ] as any
      
      // Update location information
      mockData.location = {
        ...mockData.location,
        name: userDistrict.name,
        district: userDistrict.name,
        agriZone: userDistrict.agriZone,
        majorCrops: userDistrict.majorCrops,
        weatherStation: weatherStation?.station
      } as any
    }
    
    console.log(`✅ Using enhanced mock weather scenario: ${mockData.scenario}`)
    console.log(`📆 Weather data loaded: ${mockData.forecast.length} days, ${mockData.alerts.length} alerts`)
    console.log(`🌾 Agricultural context: ${userDistrict ? 'Punjab-specific' : 'General'}`)
    
    return NextResponse.json({
      success: true,
      data: mockData,
      source: userDistrict ? 'punjab-enhanced-mock' : 'enhanced-mock-reliable',
      timestamp: new Date().toISOString(),
      cached: false,
      locationContext: {
        district: userDistrict?.name,
        agriZone: userDistrict?.agriZone,
        isInPunjab,
        weatherStation: weatherStation?.station
      },
      error: null
    })
    
  } catch (error) {
    console.error('❌ Weather API fallback error:', error)
    
    // Emergency basic fallback
    const basicWeatherData = {
      location: {
        name: 'Ludhiana',
        country: 'IN',
        lat,
        lon
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
        }
      ],
      alerts: [],
      lastUpdated: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: basicWeatherData,
      source: 'emergency-basic-fallback',
      timestamp: new Date().toISOString(),
      cached: false,
      error: null
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

// Enhance weather data with Punjab-specific agricultural context
function enhanceWithPunjabContext(weatherData: any, district: PunjabDistrict): any {
  const currentSeason = getCurrentSeason()
  const agriZone = PunjabLocationService.getAgricultureZone(district.agriZone)
  
  // Enhance each forecast day with Punjab-specific recommendations
  const enhancedForecast = weatherData.forecast.map((day: any) => ({
    ...day,
    farmingRecommendations: [
      ...day.farmingRecommendations,
      ...getPunjabSpecificRecommendations(day, district, currentSeason)
    ],
    locationContext: {
      district: district.name,
      agriZone: district.agriZone,
      majorCrops: district.majorCrops,
      soilTypes: district.soilType,
      averageRainfall: district.averageRainfall
    }
  }))
  
  return {
    ...weatherData,
    forecast: enhancedForecast,
    punjabContext: {
      district: district.name,
      agriZone: agriZone?.name,
      currentSeason,
      suitableCrops: agriZone?.suitableCrops[currentSeason as keyof typeof agriZone.suitableCrops] || [],
      challenges: agriZone?.challenges || [],
      recommendations: agriZone?.recommendations || []
    }
  }
}

// Get current agricultural season
function getCurrentSeason(): 'kharif' | 'rabi' | 'zaid' {
  const month = new Date().getMonth() + 1
  if (month >= 6 && month <= 9) return 'kharif'
  if (month >= 10 || month <= 3) return 'rabi'
  return 'zaid'
}

// Get Punjab-specific agricultural recommendations
function getPunjabSpecificRecommendations(dayForecast: any, district: PunjabDistrict, season: string): string[] {
  const recommendations: string[] = []
  const { high, low, rainfall, condition } = dayForecast
  
  // Temperature-based recommendations
  if (high > 40) {
    recommendations.push(`Heat stress risk for crops in ${district.agriZone.toLowerCase().replace('_', ' ')} zone`)
    recommendations.push('Increase irrigation frequency, especially for rice and vegetables')
    if (district.majorCrops.includes('Cotton')) {
      recommendations.push('Cotton crops may benefit from light irrigation')
    }
  } else if (high < 15 && season === 'rabi') {
    recommendations.push('Cold wave conditions - protect wheat and mustard crops')
    recommendations.push('Delay irrigation during severe cold spells')
  }
  
  // Rainfall-based recommendations for Punjab crops
  if (rainfall > 75) {
    recommendations.push(`Heavy rain alert for ${district.name} district`)
    if (district.majorCrops.includes('Rice')) {
      recommendations.push('Monitor rice fields for proper water levels (2-3 cm)')
    }
    if (district.majorCrops.includes('Cotton')) {
      recommendations.push('Ensure cotton field drainage to prevent waterlogging')
    }
    recommendations.push('Postpone harvesting operations if crops are ready')
  } else if (rainfall > 25) {
    recommendations.push('Beneficial rainfall for crop growth')
    recommendations.push('Good time for fertilizer application after rain stops')
    if (season === 'kharif') {
      recommendations.push('Monitor for pest activity 2-3 days after rain')
    }
  } else if (rainfall < 5 && season === 'kharif') {
    recommendations.push(`Low rainfall - irrigation needed for ${district.agriZone} zone crops`)
    if (district.majorCrops.includes('Rice')) {
      recommendations.push('Maintain water levels in rice fields through irrigation')
    }
  }
  
  // Zone-specific recommendations
  if (district.agriZone === 'WESTERN' && high > 38) {
    recommendations.push('Western zone heat - focus on water conservation techniques')
    recommendations.push('Consider drought-resistant crop varieties for future seasons')
  }
  
  if (district.agriZone === 'SUB_MOUNTAIN' && rainfall > 50) {
    recommendations.push('Sub-mountain zone - check for soil erosion in sloped fields')
    recommendations.push('Implement contour farming if not already in place')
  }
  
  // Seasonal activity reminders
  if (season === 'kharif' && new Date().getMonth() + 1 === 6) {
    recommendations.push('Kharif sowing season - prepare fields for rice/cotton cultivation')
  } else if (season === 'rabi' && new Date().getMonth() + 1 === 11) {
    recommendations.push('Rabi season - optimal time for wheat sowing in Punjab')
  }
  
  return recommendations
}

// Map notification priority to weather alert severity
function mapPriorityToSeverity(priority: string): 'low' | 'medium' | 'high' | 'extreme' | 'critical' {
  const severityMap: { [key: string]: 'low' | 'medium' | 'high' | 'extreme' | 'critical' } = {
    'low': 'low',
    'medium': 'medium', 
    'high': 'high',
    'critical': 'critical'
  }
  return severityMap[priority] || 'medium'
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

// Generate weather alerts based on forecast data with enhanced analysis
function generateWeatherAlerts(forecast: ProcessedWeatherData[]): WeatherAlert[] {
  const alerts: WeatherAlert[] = []
  
  forecast.forEach((day, index) => {
    // Heavy rainfall and flood alerts
    if (day.rainfall > 50) {
      alerts.push({
        id: `flood-${day.date}`,
        type: 'emergency',
        title: 'Flood Emergency',
        description: `Extreme rainfall of ${day.rainfall}mm expected on ${day.day}. High risk of flooding in low-lying areas.`,
        severity: 'critical',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'flood',
        impact: 'Severe flooding expected, crop damage likely, field operations impossible',
        recommendedActions: [
          'Evacuate livestock from low-lying areas immediately',
          'Secure farm equipment and move to higher ground',
          'Check and reinforce drainage systems',
          'Harvest ready crops before flooding occurs',
          'Monitor water levels continuously',
          'Prepare emergency supplies for livestock'
        ]
      })
    } else if (day.rainfall > 30) {
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
          'Harvest ready crops before rain intensifies',
          'Check for waterlogging in low-lying areas',
          'Postpone spraying and fertilizer application'
        ]
      })
    } else if (day.rainfall > 15) {
      alerts.push({
        id: `moderate-rain-${day.date}`,
        type: 'advisory',
        title: 'Moderate Rainfall Advisory',
        description: `Moderate rainfall of ${day.rainfall}mm expected on ${day.day}. Beneficial for most crops but monitor conditions.`,
        severity: 'medium',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'rain',
        impact: 'Generally beneficial, may delay some field operations',
        recommendedActions: [
          'Monitor soil moisture levels',
          'Adjust irrigation schedules accordingly',
          'Watch for signs of waterlogging',
          'Good conditions for planting if not excessive'
        ]
      })
    }
    
    // Extreme wind and storm alerts
    if (day.windSpeed > 60) {
      alerts.push({
        id: `extreme-wind-${day.date}`,
        type: 'emergency',
        title: 'Extreme Wind Warning',
        description: `Dangerous winds up to ${day.windSpeed} km/h expected on ${day.day}. Risk of crop damage and structural damage.`,
        severity: 'critical',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'wind',
        impact: 'Severe crop damage, structural damage, dangerous working conditions',
        recommendedActions: [
          'Secure all loose farm equipment immediately',
          'Reinforce greenhouses and farm structures',
          'Bring livestock to protected shelters',
          'Avoid all outdoor activities',
          'Prepare for power outages',
          'Check crop supports and ties'
        ]
      })
    } else if (day.windSpeed > 45) {
      alerts.push({
        id: `high-wind-${day.date}`,
        type: 'warning',
        title: 'High Wind Warning',
        description: `Strong winds up to ${day.windSpeed} km/h expected on ${day.day}. Risk of crop damage and hazardous conditions.`,
        severity: 'high',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'wind',
        impact: 'Crop damage likely, hazardous working conditions',
        recommendedActions: [
          'Secure loose farming equipment',
          'Check and reinforce crop supports',
          'Avoid spraying operations',
          'Protect young plants from wind damage',
          'Monitor greenhouse structures'
        ]
      })
    } else if (day.windSpeed > 30) {
      alerts.push({
        id: `wind-advisory-${day.date}`,
        type: 'advisory',
        title: 'Wind Advisory',
        description: `Moderate winds up to ${day.windSpeed} km/h expected on ${day.day}. Take precautions with sensitive operations.`,
        severity: 'medium',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'wind',
        impact: 'May affect spraying operations, light crop damage possible',
        recommendedActions: [
          'Avoid spraying operations in windy conditions',
          'Check crop supports and ties',
          'Secure light equipment',
          'Monitor for wind damage'
        ]
      })
    }
    
    // Extreme temperature alerts
    if (day.high > 45) {
      alerts.push({
        id: `extreme-heat-${day.date}`,
        type: 'emergency',
        title: 'Extreme Heat Emergency',
        description: `Dangerous temperatures of ${day.high}°C expected on ${day.day}. Severe risk to crops and livestock.`,
        severity: 'critical',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'temperature',
        impact: 'Severe crop stress, livestock heat stress, high evaporation',
        recommendedActions: [
          'Provide shade and extra water for livestock immediately',
          'Increase irrigation significantly',
          'Avoid all field operations during peak heat',
          'Use shade nets for sensitive crops',
          'Monitor livestock for heat stress symptoms',
          'Prepare for potential crop losses'
        ]
      })
    } else if (day.high > 40) {
      alerts.push({
        id: `extreme-heat-${day.date}`,
        type: 'warning',
        title: 'Extreme Heat Warning',
        description: `Very high temperatures of ${day.high}°C expected on ${day.day}. Significant risk to crops and livestock.`,
        severity: 'high',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'temperature',
        impact: 'Crop stress, livestock discomfort, increased water needs',
        recommendedActions: [
          'Increase irrigation frequency',
          'Provide shade for sensitive crops',
          'Ensure adequate water supply for livestock',
          'Avoid field operations during hottest hours',
          'Monitor crops for heat stress symptoms'
        ]
      })
    } else if (day.high > 35) {
      alerts.push({
        id: `heat-advisory-${day.date}`,
        type: 'advisory',
        title: 'Heat Advisory',
        description: `High temperatures of ${day.high}°C expected on ${day.day}. Take precautions with crops and livestock.`,
        severity: 'medium',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'temperature',
        impact: 'Moderate crop stress, increased water requirements',
        recommendedActions: [
          'Adjust irrigation schedules',
          'Monitor soil moisture levels',
          'Provide shade for sensitive livestock',
          'Consider heat-tolerant crop varieties'
        ]
      })
    }
    
    // Cold temperature alerts
    if (day.low < 0) {
      alerts.push({
        id: `freeze-warning-${day.date}`,
        type: 'warning',
        title: 'Freeze Warning',
        description: `Freezing temperatures of ${day.low}°C expected on ${day.day}. Risk of frost damage to crops.`,
        severity: 'high',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'temperature',
        impact: 'Frost damage to sensitive crops, potential crop loss',
        recommendedActions: [
          'Protect sensitive crops with covers or mulch',
          'Harvest frost-sensitive crops if possible',
          'Ensure adequate irrigation (water helps prevent frost damage)',
          'Monitor temperature closely overnight',
          'Prepare for potential crop losses'
        ]
      })
    }
    
    // Drought alerts (based on consecutive dry days and high temperatures)
    const consecutiveDryDays = forecast.slice(0, index + 1).filter(d => d.rainfall < 2).length
    if (consecutiveDryDays >= 7 && day.high > 30) {
      alerts.push({
        id: `drought-${day.date}`,
        type: 'warning',
        title: 'Drought Warning',
        description: `${consecutiveDryDays} consecutive dry days with high temperatures. Risk of drought stress.`,
        severity: 'high',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'drought',
        impact: 'Severe water stress, crop yield reduction, increased irrigation costs',
        recommendedActions: [
          'Implement water conservation measures',
          'Prioritize irrigation for most valuable crops',
          'Consider drought-resistant crop varieties',
          'Monitor soil moisture levels closely',
          'Prepare for potential yield reductions'
        ]
      })
    }
    
    // Storm alerts (based on weather conditions)
    if (day.condition.toLowerCase().includes('thunder') || day.condition.toLowerCase().includes('storm')) {
      alerts.push({
        id: `storm-${day.date}`,
        type: 'warning',
        title: 'Storm Warning',
        description: `Thunderstorms expected on ${day.day}. Risk of lightning, heavy rain, and strong winds.`,
        severity: 'high',
        validUntil: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
        category: 'storm',
        impact: 'Lightning risk, heavy rain, strong winds, potential hail damage',
        recommendedActions: [
          'Seek shelter during storms',
          'Unplug electrical equipment',
          'Secure loose objects',
          'Avoid open fields and tall trees',
          'Monitor for hail damage'
        ]
      })
    }
  })
  
  return alerts
}

// Background refresh function for non-blocking updates
async function refreshWeatherInBackground(lat: number, lon: number) {
  try {
    console.log(`Background refresh for lat=${lat}, lon=${lon}`)
    // Background refresh logic would go here
    console.log(`Background refresh completed`)
  } catch (error) {
    console.warn('Background refresh failed:', error)
  }
}

// Mock weather data for fallback
function getMockWeatherData(lat?: number, lon?: number) {
  return {
    location: {
      name: API_CONFIG.WEATHER.DEFAULT_CITY,
      country: 'IN',
      lat: lat || API_CONFIG.WEATHER.DEFAULT_LAT,
      lon: lon || API_CONFIG.WEATHER.DEFAULT_LON
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
