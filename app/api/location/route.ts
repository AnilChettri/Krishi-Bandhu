import { NextRequest, NextResponse } from 'next/server'

interface LocationData {
  coordinates: {
    latitude: number
    longitude: number
  }
  address: {
    district: string
    state: string
    country: string
    tehsil?: string
    village?: string
    pincode?: string
  }
  accuracy: number
  timestamp: string
}

interface PunjabDistrict {
  name: string
  code: string
  coordinates: {
    lat: number
    lon: number
  }
  tehsils: string[]
  crops: string[]
  soilTypes: string[]
  climate: string
}

// Punjab districts with agricultural data
const PUNJAB_DISTRICTS: PunjabDistrict[] = [
  {
    name: 'Ludhiana',
    code: 'PB-LDH',
    coordinates: { lat: 30.9001, lon: 75.8573 },
    tehsils: ['Ludhiana-I', 'Ludhiana-II', 'Samrala', 'Khanna', 'Payal', 'Raikot'],
    crops: ['wheat', 'rice', 'maize', 'cotton', 'sugarcane'],
    soilTypes: ['alluvial', 'sandy_loam', 'clay_loam'],
    climate: 'semi-arid'
  },
  {
    name: 'Amritsar',
    code: 'PB-ASR',
    coordinates: { lat: 31.6340, lon: 74.8723 },
    tehsils: ['Amritsar-I', 'Amritsar-II', 'Ajnala', 'Rayya', 'Tarn Taran'],
    crops: ['wheat', 'rice', 'cotton', 'maize'],
    soilTypes: ['alluvial', 'sandy', 'clay_loam'],
    climate: 'semi-arid'
  },
  {
    name: 'Jalandhar',
    code: 'PB-JLD',
    coordinates: { lat: 31.3260, lon: 75.5762 },
    tehsils: ['Jalandhar-I', 'Jalandhar-II', 'Phillaur', 'Nakodar', 'Shahkot'],
    crops: ['wheat', 'rice', 'sugarcane', 'maize'],
    soilTypes: ['alluvial', 'clay_loam', 'sandy_loam'],
    climate: 'subtropical'
  },
  {
    name: 'Patiala',
    code: 'PB-PTL',
    coordinates: { lat: 30.3398, lon: 76.3869 },
    tehsils: ['Patiala', 'Rajpura', 'Samana', 'Patran'],
    crops: ['wheat', 'rice', 'cotton', 'sugarcane'],
    soilTypes: ['alluvial', 'sandy_loam', 'clay'],
    climate: 'semi-arid'
  },
  {
    name: 'Bathinda',
    code: 'PB-BTD',
    coordinates: { lat: 30.2118, lon: 74.9455 },
    tehsils: ['Bathinda', 'Rampura Phul', 'Talwandi Sabo', 'Sangat'],
    crops: ['wheat', 'rice', 'cotton', 'mustard'],
    soilTypes: ['sandy', 'sandy_loam', 'alluvial'],
    climate: 'arid'
  },
  {
    name: 'Mohali',
    code: 'PB-MHL',
    coordinates: { lat: 30.7046, lon: 76.7179 },
    tehsils: ['Mohali', 'Kharar', 'Dera Bassi'],
    crops: ['wheat', 'rice', 'maize', 'vegetables'],
    soilTypes: ['alluvial', 'clay_loam', 'sandy_loam'],
    climate: 'subtropical'
  },
  {
    name: 'Gurdaspur',
    code: 'PB-GDS',
    coordinates: { lat: 32.0409, lon: 75.4053 },
    tehsils: ['Gurdaspur', 'Pathankot', 'Dinanagar', 'Batala', 'Dera Baba Nanak'],
    crops: ['wheat', 'rice', 'maize', 'sugarcane'],
    soilTypes: ['alluvial', 'clay_loam', 'sandy'],
    climate: 'subtropical'
  },
  {
    name: 'Hoshiarpur',
    code: 'PB-HSP',
    coordinates: { lat: 31.5204, lon: 75.9110 },
    tehsils: ['Hoshiarpur', 'Dasuya', 'Mukerian', 'Garhshankar'],
    crops: ['wheat', 'rice', 'maize', 'sugarcane'],
    soilTypes: ['alluvial', 'clay_loam', 'hilly'],
    climate: 'subtropical'
  },
  {
    name: 'Ferozepur',
    code: 'PB-FZP',
    coordinates: { lat: 30.9167, lon: 74.6167 },
    tehsils: ['Ferozepur', 'Zira', 'Guru Har Sahai', 'Mamdot'],
    crops: ['wheat', 'rice', 'cotton', 'mustard'],
    soilTypes: ['alluvial', 'sandy', 'sandy_loam'],
    climate: 'semi-arid'
  },
  {
    name: 'Sangrur',
    code: 'PB-SGR',
    coordinates: { lat: 30.2458, lon: 75.8421 },
    tehsils: ['Sangrur', 'Sunam', 'Dhuri', 'Malerkotla', 'Moonak'],
    crops: ['wheat', 'rice', 'cotton', 'sugarcane'],
    soilTypes: ['alluvial', 'sandy_loam', 'clay_loam'],
    climate: 'semi-arid'
  }
  // Add more districts as needed...
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const district = searchParams.get('district')

    switch (action) {
      case 'reverse-geocode':
        return handleReverseGeocode(Number(lat), Number(lon))
      
      case 'get-districts':
        return handleGetDistricts()
      
      case 'get-district-info':
        return handleGetDistrictInfo(district!)
      
      case 'get-tehsils':
        return handleGetTehsils(district!)
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: reverse-geocode, get-districts, get-district-info, get-tehsils'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Location API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { latitude, longitude, accuracy } = body

    if (!latitude || !longitude) {
      return NextResponse.json({
        success: false,
        error: 'Latitude and longitude are required'
      }, { status: 400 })
    }

    // Process location data
    const locationData = await processLocationData(latitude, longitude, accuracy)

    return NextResponse.json({
      success: true,
      data: locationData,
      message: 'Location processed successfully'
    })
  } catch (error) {
    console.error('Location POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 })
  }
}

async function handleReverseGeocode(lat: number, lon: number): Promise<NextResponse> {
  if (!lat || !lon) {
    return NextResponse.json({
      success: false,
      error: 'Latitude and longitude are required'
    }, { status: 400 })
  }

  try {
    // Find nearest Punjab district
    const nearestDistrict = findNearestDistrict(lat, lon)
    
    if (!nearestDistrict) {
      return NextResponse.json({
        success: false,
        error: 'Location not found within Punjab'
      }, { status: 404 })
    }

    const locationData: LocationData = {
      coordinates: {
        latitude: lat,
        longitude: lon
      },
      address: {
        district: nearestDistrict.name,
        state: 'Punjab',
        country: 'India',
        tehsil: nearestDistrict.tehsils[0], // Default to first tehsil
      },
      accuracy: calculateDistanceAccuracy(lat, lon, nearestDistrict.coordinates.lat, nearestDistrict.coordinates.lon),
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: locationData,
      districtInfo: nearestDistrict
    })
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return NextResponse.json({
      success: false,
      error: 'Reverse geocoding failed'
    }, { status: 500 })
  }
}

async function handleGetDistricts(): Promise<NextResponse> {
  const districts = PUNJAB_DISTRICTS.map(district => ({
    name: district.name,
    code: district.code,
    coordinates: district.coordinates,
    tehsilCount: district.tehsils.length,
    cropCount: district.crops.length
  }))

  return NextResponse.json({
    success: true,
    data: districts,
    total: districts.length
  })
}

async function handleGetDistrictInfo(districtName: string): Promise<NextResponse> {
  if (!districtName) {
    return NextResponse.json({
      success: false,
      error: 'District name is required'
    }, { status: 400 })
  }

  const district = PUNJAB_DISTRICTS.find(
    d => d.name.toLowerCase() === districtName.toLowerCase() ||
         d.code.toLowerCase() === districtName.toLowerCase()
  )

  if (!district) {
    return NextResponse.json({
      success: false,
      error: 'District not found'
    }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: district
  })
}

async function handleGetTehsils(districtName: string): Promise<NextResponse> {
  if (!districtName) {
    return NextResponse.json({
      success: false,
      error: 'District name is required'
    }, { status: 400 })
  }

  const district = PUNJAB_DISTRICTS.find(
    d => d.name.toLowerCase() === districtName.toLowerCase()
  )

  if (!district) {
    return NextResponse.json({
      success: false,
      error: 'District not found'
    }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: {
      district: district.name,
      tehsils: district.tehsils
    }
  })
}

async function processLocationData(latitude: number, longitude: number, accuracy?: number): Promise<LocationData> {
  // Find the nearest district
  const nearestDistrict = findNearestDistrict(latitude, longitude)
  
  if (!nearestDistrict) {
    throw new Error('Location outside Punjab boundaries')
  }

  const locationData: LocationData = {
    coordinates: {
      latitude,
      longitude
    },
    address: {
      district: nearestDistrict.name,
      state: 'Punjab',
      country: 'India',
      tehsil: nearestDistrict.tehsils[0] // Default to first tehsil
    },
    accuracy: accuracy || calculateDistanceAccuracy(latitude, longitude, nearestDistrict.coordinates.lat, nearestDistrict.coordinates.lon),
    timestamp: new Date().toISOString()
  }

  return locationData
}

function findNearestDistrict(lat: number, lon: number): PunjabDistrict | null {
  let nearestDistrict: PunjabDistrict | null = null
  let minDistance = Number.MAX_VALUE

  for (const district of PUNJAB_DISTRICTS) {
    const distance = calculateDistance(lat, lon, district.coordinates.lat, district.coordinates.lon)
    
    if (distance < minDistance) {
      minDistance = distance
      nearestDistrict = district
    }
  }

  // Only return if within reasonable distance (100km)
  return minDistance <= 100 ? nearestDistrict : null
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance
}

function calculateDistanceAccuracy(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const distance = calculateDistance(lat1, lon1, lat2, lon2)
  // Convert distance to accuracy percentage (closer = higher accuracy)
  const accuracy = Math.max(0, Math.min(100, 100 - (distance * 2)))
  return Math.round(accuracy * 100) / 100
}

// Get agricultural recommendations based on location
export async function getLocationBasedRecommendations(districtName: string) {
  const district = PUNJAB_DISTRICTS.find(
    d => d.name.toLowerCase() === districtName.toLowerCase()
  )

  if (!district) {
    return {
      success: false,
      error: 'District not found'
    }
  }

  const currentMonth = new Date().getMonth() + 1 // 1-12
  const season = getCurrentSeason(currentMonth)

  const recommendations = {
    district: district.name,
    season,
    recommendedCrops: getSeasonalCrops(district.crops, season),
    soilAdvice: getSoilAdvice(district.soilTypes),
    climateInfo: district.climate,
    irrigation: getIrrigationAdvice(district.climate, season),
    marketInfo: `Check ${district.name} mandi for current prices`
  }

  return {
    success: true,
    data: recommendations
  }
}

function getCurrentSeason(month: number): 'kharif' | 'rabi' | 'summer' {
  if (month >= 6 && month <= 10) return 'kharif'
  if (month >= 11 || month <= 3) return 'rabi'
  return 'summer'
}

function getSeasonalCrops(crops: string[], season: string): string[] {
  const seasonalCrops: { [key: string]: string[] } = {
    kharif: ['rice', 'maize', 'cotton', 'sugarcane'],
    rabi: ['wheat', 'mustard', 'barley', 'gram'],
    summer: ['fodder', 'vegetables', 'pulses']
  }

  return crops.filter(crop => 
    seasonalCrops[season]?.includes(crop) || crop === 'vegetables'
  )
}

function getSoilAdvice(soilTypes: string[]): string[] {
  const advice: string[] = []
  
  if (soilTypes.includes('sandy')) {
    advice.push('Sandy soil: Increase organic matter, frequent light irrigation needed')
  }
  if (soilTypes.includes('clay')) {
    advice.push('Clay soil: Improve drainage, avoid overwatering')
  }
  if (soilTypes.includes('alluvial')) {
    advice.push('Alluvial soil: Excellent for most crops, maintain fertility')
  }
  if (soilTypes.includes('sandy_loam')) {
    advice.push('Sandy loam: Ideal for most crops, maintain moisture')
  }
  
  return advice
}

function getIrrigationAdvice(climate: string, season: string): string {
  if (climate === 'arid' && season === 'summer') {
    return 'Increase irrigation frequency, use drip irrigation if possible'
  }
  if (climate === 'subtropical' && season === 'kharif') {
    return 'Monitor monsoon, supplement irrigation as needed'
  }
  return 'Follow standard irrigation practices for the region'
}