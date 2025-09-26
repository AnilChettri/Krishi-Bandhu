// Punjab Location Service - District, Tehsil and Agricultural Zone Mapping
// Based on Punjab Agriculture Department and PAU guidelines

export interface PunjabDistrict {
  id: string
  name: string
  nameHindi: string
  namePunjabi: string
  headquarters: string
  coordinates: {
    lat: number
    lon: number
  }
  tehsils: string[]
  agriZone: 'CENTRAL' | 'SUB_MOUNTAIN' | 'WESTERN' | 'TRANS_SUTLEJ' | 'FLOOD_PRONE'
  soilType: string[]
  majorCrops: string[]
  irrigation: string[]
  averageRainfall: number
  climateZone: string
  mspCenters: string[]
}

export interface PunjabTehsil {
  id: string
  name: string
  district: string
  coordinates: {
    lat: number
    lon: number
  }
  ruralBlocks: string[]
  villages: number
  soilProfile: {
    sandy: number
    loamy: number
    clay: number
    alluvial: number
  }
}

export interface AgricultureZone {
  id: string
  name: string
  districts: string[]
  climate: string
  soilCharacteristics: string[]
  suitableCrops: {
    kharif: string[]
    rabi: string[]
    zaid: string[]
  }
  irrigationSources: string[]
  challenges: string[]
  recommendations: string[]
}

// Punjab Districts Data (Based on official Punjab Agriculture Department)
export const PUNJAB_DISTRICTS: PunjabDistrict[] = [
  {
    id: 'amritsar',
    name: 'Amritsar',
    nameHindi: 'अमृतसर',
    namePunjabi: 'ਅਮ੍ਰਿਤਸਰ',
    headquarters: 'Amritsar',
    coordinates: { lat: 31.6340, lon: 74.8723 },
    tehsils: ['Amritsar-I', 'Amritsar-II', 'Ajnala', 'Rayya', 'Tarn Taran', 'Patti', 'Khadoor Sahib'],
    agriZone: 'CENTRAL',
    soilType: ['Alluvial', 'Sandy loam', 'Loamy'],
    majorCrops: ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'],
    irrigation: ['Canal', 'Tubewell', 'River'],
    averageRainfall: 650,
    climateZone: 'Semi-arid',
    mspCenters: ['Amritsar', 'Tarn Taran', 'Ajnala']
  },
  {
    id: 'ludhiana',
    name: 'Ludhiana',
    nameHindi: 'लुधियाना',
    namePunjabi: 'ਲੁਧਿਆਣਾ',
    headquarters: 'Ludhiana',
    coordinates: { lat: 30.9010, lon: 75.8573 },
    tehsils: ['Ludhiana-I', 'Ludhiana-II', 'Samrala', 'Khanna', 'Raikot', 'Jagraon', 'Dehlon', 'Doraha'],
    agriZone: 'CENTRAL',
    soilType: ['Alluvial', 'Loamy', 'Sandy loam'],
    majorCrops: ['Rice', 'Wheat', 'Maize', 'Fodder crops', 'Vegetables'],
    irrigation: ['Canal', 'Tubewell'],
    averageRainfall: 700,
    climateZone: 'Semi-arid',
    mspCenters: ['Ludhiana', 'Khanna', 'Samrala', 'Jagraon']
  },
  {
    id: 'jalandhar',
    name: 'Jalandhar',
    nameHindi: 'जालंधर',
    namePunjabi: 'ਜਲੰਧਰ',
    headquarters: 'Jalandhar',
    coordinates: { lat: 31.3260, lon: 75.5762 },
    tehsils: ['Jalandhar-I', 'Jalandhar-II', 'Jalandhar-III', 'Jalandhar-IV', 'Phillaur', 'Nakodar', 'Shahkot'],
    agriZone: 'CENTRAL',
    soilType: ['Alluvial', 'Loamy', 'Clay loam'],
    majorCrops: ['Rice', 'Wheat', 'Maize', 'Fodder', 'Vegetables'],
    irrigation: ['Canal', 'Tubewell'],
    averageRainfall: 750,
    climateZone: 'Semi-arid',
    mspCenters: ['Jalandhar', 'Phillaur', 'Nakodar']
  },
  {
    id: 'patiala',
    name: 'Patiala',
    nameHindi: 'पटियाला',
    namePunjabi: 'ਪਟਿਆਲਾ',
    headquarters: 'Patiala',
    coordinates: { lat: 30.3398, lon: 76.3869 },
    tehsils: ['Patiala', 'Rajpura', 'Samana', 'Ghanour', 'Patran', 'Shutrana'],
    agriZone: 'TRANS_SUTLEJ',
    soilType: ['Sandy', 'Sandy loam', 'Alluvial'],
    majorCrops: ['Rice', 'Wheat', 'Cotton', 'Bajra', 'Mustard'],
    irrigation: ['Canal', 'Tubewell'],
    averageRainfall: 600,
    climateZone: 'Semi-arid',
    mspCenters: ['Patiala', 'Rajpura', 'Samana']
  },
  {
    id: 'bathinda',
    name: 'Bathinda',
    nameHindi: 'बठिंडा',
    namePunjabi: 'ਬਠਿੰਡਾ',
    headquarters: 'Bathinda',
    coordinates: { lat: 30.2118, lon: 74.9455 },
    tehsils: ['Bathinda', 'Rampura Phul', 'Talwandi Sabo', 'Maur', 'Nathana'],
    agriZone: 'WESTERN',
    soilType: ['Sandy', 'Sandy loam'],
    majorCrops: ['Cotton', 'Rice', 'Wheat', 'Bajra', 'Mustard'],
    irrigation: ['Canal', 'Tubewell'],
    averageRainfall: 400,
    climateZone: 'Arid to semi-arid',
    mspCenters: ['Bathinda', 'Rampura Phul', 'Talwandi Sabo']
  },
  {
    id: 'hoshiarpur',
    name: 'Hoshiarpur',
    nameHindi: 'होशियारपुर',
    namePunjabi: 'ਹੁਸ਼ਿਆਰਪੁਰ',
    headquarters: 'Hoshiarpur',
    coordinates: { lat: 31.5344, lon: 75.9113 },
    tehsils: ['Hoshiarpur', 'Dasuya', 'Mukerian', 'Tanda', 'Garhshankar', 'Una', 'Haroli'],
    agriZone: 'SUB_MOUNTAIN',
    soilType: ['Mountainous', 'Loamy', 'Clay'],
    majorCrops: ['Wheat', 'Maize', 'Rice', 'Basmati', 'Fodder'],
    irrigation: ['Rain-fed', 'Tubewell', 'River'],
    averageRainfall: 1200,
    climateZone: 'Sub-humid',
    mspCenters: ['Hoshiarpur', 'Dasuya', 'Mukerian']
  }
  // Additional districts can be added...
]

// Agricultural Zones based on PAU classification
export const AGRICULTURAL_ZONES: AgricultureZone[] = [
  {
    id: 'central',
    name: 'Central Plain Zone',
    districts: ['Amritsar', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Nawanshahr', 'Ropar'],
    climate: 'Semi-arid, hot summers, cool winters',
    soilCharacteristics: ['Alluvial soils', 'Good fertility', 'Well-drained'],
    suitableCrops: {
      kharif: ['Rice', 'Maize', 'Cotton', 'Sugarcane', 'Fodder'],
      rabi: ['Wheat', 'Barley', 'Rapeseed & Mustard', 'Potato', 'Peas'],
      zaid: ['Fodder Maize', 'Fodder Sorghum', 'Vegetables']
    },
    irrigationSources: ['Canals', 'Tubewells'],
    challenges: ['Water table decline', 'Soil salinity', 'Pest resistance'],
    recommendations: [
      'Adopt direct seeded rice (DSR)',
      'Use drip irrigation for vegetables',
      'Practice crop diversification',
      'Integrated pest management'
    ]
  },
  {
    id: 'sub_mountain',
    name: 'Sub-Mountainous Zone',
    districts: ['Gurdaspur', 'Hoshiarpur', 'Pathankot'],
    climate: 'Sub-humid, higher rainfall',
    soilCharacteristics: ['Undulating topography', 'Erosion prone', 'Variable fertility'],
    suitableCrops: {
      kharif: ['Basmati Rice', 'Maize', 'Pulses', 'Oilseeds'],
      rabi: ['Wheat', 'Barley', 'Gram', 'Mustard'],
      zaid: ['Fodder crops', 'Vegetables']
    },
    irrigationSources: ['Rain-fed', 'Tubewells', 'Small dams'],
    challenges: ['Soil erosion', 'Irregular rainfall', 'Small holdings'],
    recommendations: [
      'Contour farming',
      'Watershed management',
      'High value crops cultivation',
      'Organic farming'
    ]
  },
  {
    id: 'western',
    name: 'Western Zone',
    districts: ['Bathinda', 'Faridkot', 'Ferozepur', 'Mansa', 'Muktsar'],
    climate: 'Arid to semi-arid, low rainfall',
    soilCharacteristics: ['Sandy soils', 'Low organic matter', 'Water stress'],
    suitableCrops: {
      kharif: ['Cotton', 'Rice', 'Bajra', 'Guar'],
      rabi: ['Wheat', 'Mustard', 'Gram', 'Barley'],
      zaid: ['Fodder crops']
    },
    irrigationSources: ['Canals', 'Tubewells'],
    challenges: ['Water scarcity', 'Soil salinity', 'Heat stress'],
    recommendations: [
      'Water-efficient crops',
      'Mulching techniques',
      'Heat-resistant varieties',
      'Precision irrigation'
    ]
  }
]

// Location Service Functions
export class PunjabLocationService {
  
  // Get current location with Punjab-specific mapping
  static async getCurrentLocation(): Promise<{
    coordinates: { lat: number; lon: number }
    district?: PunjabDistrict
    tehsil?: string
    agriZone?: AgricultureZone
    address?: string
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }

          try {
            const district = this.findNearestDistrict(coords)
            const agriZone = this.getAgricultureZone(district?.agriZone)
            const address = await this.reverseGeocode(coords)

            resolve({
              coordinates: coords,
              district,
              agriZone,
              address
            })
          } catch (error) {
            resolve({ coordinates: coords })
          }
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  // Find nearest Punjab district based on coordinates
  static findNearestDistrict(coords: { lat: number; lon: number }): PunjabDistrict | undefined {
    let nearestDistrict: PunjabDistrict | undefined
    let minDistance = Infinity

    for (const district of PUNJAB_DISTRICTS) {
      const distance = this.calculateDistance(
        coords.lat, coords.lon,
        district.coordinates.lat, district.coordinates.lon
      )
      
      if (distance < minDistance) {
        minDistance = distance
        nearestDistrict = district
      }
    }

    return nearestDistrict
  }

  // Calculate distance between two coordinates (Haversine formula)
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Get agriculture zone by ID
  static getAgricultureZone(zoneId?: string): AgricultureZone | undefined {
    if (!zoneId) return undefined
    return AGRICULTURAL_ZONES.find(zone => 
      zone.id === zoneId.toLowerCase().replace('_', '_')
    )
  }

  // Reverse geocoding to get address
  static async reverseGeocode(coords: { lat: number; lon: number }): Promise<string> {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${coords.lat}+${coords.lon}&key=YOUR_OPENCAGE_KEY&countrycode=IN&limit=1`
      )
      const data = await response.json()
      return data.results[0]?.formatted || 'Unknown location'
    } catch {
      return 'Location unavailable'
    }
  }

  // Get crop recommendations based on location
  static getCropRecommendations(district: PunjabDistrict, season: 'kharif' | 'rabi' | 'zaid') {
    const zone = this.getAgricultureZone(district.agriZone)
    return {
      majorCrops: district.majorCrops,
      seasonalCrops: zone?.suitableCrops[season] || [],
      soilSuitability: district.soilType,
      irrigationOptions: district.irrigation,
      challenges: zone?.challenges || [],
      recommendations: zone?.recommendations || []
    }
  }

  // Get MSP centers for a district
  static getMSPCenters(district: PunjabDistrict) {
    return district.mspCenters.map(center => ({
      name: center,
      district: district.name,
      coordinates: district.coordinates // Simplified - in reality each center has different coords
    }))
  }

  // Check if location is within Punjab
  static isInPunjab(coords: { lat: number; lon: number }): boolean {
    // Punjab approximate boundaries
    const punjabBounds = {
      north: 32.5,
      south: 29.5,
      east: 77.0,
      west: 73.9
    }
    
    return coords.lat >= punjabBounds.south && 
           coords.lat <= punjabBounds.north &&
           coords.lon >= punjabBounds.west && 
           coords.lon <= punjabBounds.east
  }

  // Get weather station mapping for accurate local weather
  static getWeatherStationMapping(district: PunjabDistrict) {
    // Mapping districts to nearest weather stations
    const weatherStations = {
      'amritsar': { station: 'Amritsar', code: 'ATU' },
      'ludhiana': { station: 'Ludhiana', code: 'LDH' },
      'jalandhar': { station: 'Jalandhar', code: 'JLR' },
      'patiala': { station: 'Patiala', code: 'PTA' },
      'bathinda': { station: 'Bathinda', code: 'BTI' },
      'hoshiarpur': { station: 'Hoshiarpur', code: 'HSP' }
    }
    
    return weatherStations[district.id as keyof typeof weatherStations] || 
           { station: district.name, code: district.id.toUpperCase() }
  }
}

export default PunjabLocationService