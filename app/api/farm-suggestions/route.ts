import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'
import { getPunjabCropsByFilter, getCurrentSeasonCrops, punjabCropDatabase, PunjabCropData } from '@/lib/punjab-crop-database'
import PunjabLocationService, { type PunjabDistrict } from '@/lib/punjab-location-service'
import PunjabSchemesService from '@/lib/punjab-schemes-service'

interface CropSuggestion {
  id: string
  cropName: string
  variety: string
  season: string
  sowingTime: string
  harvestTime: string
  duration: number // in days
  expectedYield: number
  yieldUnit: string
  profitability: {
    investmentCost: number
    expectedRevenue: number
    profit: number
    profitMargin: number
    roi: number // Return on Investment %
  }
  suitability: {
    soilType: string[]
    climateConditions: string[]
    waterRequirement: 'low' | 'medium' | 'high' | 'very-high'
    difficulty: 'easy' | 'medium' | 'hard'
    suitabilityScore: number // 0-100
  }
  marketDemand: {
    currentPrice: number
    priceUnit: string
    demandLevel: 'low' | 'medium' | 'high' | 'very-high'
    marketTrend: 'rising' | 'stable' | 'falling'
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
  location?: {
    suitableDistricts: string[]
    agriZone: string
    weatherStation: string
  }
  schemes?: {
    mspRate?: number
    subsidySchemes: string[]
    insuranceAvailable: boolean
    nearestMSPCenter?: string
  }
}

interface FarmSuggestionsResponse {
  success: boolean
  data: {
    suggestions: CropSuggestion[]
    location: {
      name: string
      coordinates: { lat: number; lon: number }
      district?: PunjabDistrict
      agriZone?: string
    }
    currentSeason: string
    criteria: any
    totalSuggestions: number
    availableSchemes: number
    seasonalAlerts: any[]
    lastUpdated: string
  }
  source: string
  error?: string
}

// Enhanced Punjab-specific farm suggestions with location and schemes integration
function getPunjabFarmSuggestions(filters?: any): FarmSuggestionsResponse {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  
  // Determine current season based on month (India)
  let currentSeason = 'Rabi'
  if (currentMonth >= 6 && currentMonth <= 9) {
    currentSeason = 'Kharif'
  } else if (currentMonth >= 10 && currentMonth <= 11) {
    currentSeason = 'Post-Kharif'
  }
  
  console.log(`🌾 Enhanced Punjab Farm Suggestions for ${currentSeason} season with filters:`, filters)

  // Get location information
  let userDistrict: PunjabDistrict | undefined
  let locationCoords = {
    lat: API_CONFIG.WEATHER.DEFAULT_LAT,
    lon: API_CONFIG.WEATHER.DEFAULT_LON
  }
  
  if (filters?.coordinates) {
    locationCoords = filters.coordinates
    userDistrict = PunjabLocationService.findNearestDistrict(locationCoords)
  }
  
  // Get seasonal notifications and schemes
  const seasonalAlerts = PunjabSchemesService.getSeasonalNotifications(currentDate)
  const availableSchemes = PunjabSchemesService.getActiveSchemes()
  
  console.log(`📍 User location: ${userDistrict?.name || 'Default'}, Available schemes: ${availableSchemes.length}`)

  // Get Punjab crop suggestions using the comprehensive database
  const punjabCrops = getPunjabCropsByFilter({
    season: filters?.season || currentSeason,
    soilType: filters?.soilType,
    waterRequirement: filters?.waterRequirement,
    difficulty: filters?.difficulty,
    maxInvestment: filters?.maxInvestment,
    category: filters?.category,
    zone: filters?.zone
  })
  
  // Convert Punjab crop data to CropSuggestion format with location and schemes integration
  const convertedSuggestions: CropSuggestion[] = punjabCrops.map((crop: PunjabCropData) => {
    // Get MSP rates for this crop
    const mspRates = PunjabSchemesService.getCurrentMSP(crop.cropName, crop.season as any)
    const currentMSP = mspRates.length > 0 ? mspRates[0].mspRate : undefined
    
    // Get relevant schemes for this crop
    const relevantSchemes = availableSchemes
      .filter(scheme => 
        scheme.category === 'subsidy' || 
        (scheme.id === 'fasal-bima-yojana' && crop.cropName) ||
        (scheme.id === 'crop-diversification-scheme')
      )
      .map(scheme => scheme.name)
    
    // Get suitable districts for this crop based on agri zones
    const suitableDistricts = userDistrict ? [userDistrict.name] : ['Central Punjab']
    const agriZone = userDistrict?.agriZone || 'CENTRAL'
    const weatherStation = userDistrict ? 
      PunjabLocationService.getWeatherStationMapping(userDistrict).station : 
      'Ludhiana'
    
    return {
      id: crop.id,
      cropName: crop.cropName,
      variety: crop.variety,
      season: crop.season,
      sowingTime: crop.sowingPeriod.optimal,
      harvestTime: `${crop.harvestPeriod.start} - ${crop.harvestPeriod.end}`,
      duration: crop.duration,
      expectedYield: crop.expectedYield.average,
      yieldUnit: crop.expectedYield.unit,
      profitability: {
        investmentCost: crop.profitability.investmentCost,
        expectedRevenue: crop.profitability.expectedRevenue,
        profit: crop.profitability.profit,
        profitMargin: crop.profitability.profitMargin,
        roi: crop.profitability.roi
      },
      suitability: {
        soilType: crop.suitability.soilTypes,
        climateConditions: crop.suitability.climateConditions,
        waterRequirement: crop.suitability.waterRequirement,
        difficulty: crop.suitability.difficulty,
        suitabilityScore: userDistrict ? 
          (crop.suitability.suitabilityScore + 5) : // Bonus for location-specific data
          crop.suitability.suitabilityScore
      },
      marketDemand: {
        currentPrice: currentMSP || crop.marketInfo.currentPrice.average,
        priceUnit: crop.marketInfo.currentPrice.unit,
        demandLevel: crop.marketInfo.demandLevel,
        marketTrend: crop.marketInfo.marketTrend
      },
      requirements: {
        seedQuantity: crop.requirements.seedRate.quantity,
        fertilizer: crop.requirements.fertilizers.map(f => f.name),
        irrigation: crop.requirements.irrigation.method,
        laborHours: crop.requirements.labor.totalHours
      },
      tips: [
        ...crop.practicalAdvice.tips,
        ...(userDistrict ? [`Best suited for ${userDistrict.agriZone.toLowerCase().replace('_', ' ')} zone of Punjab`] : []),
        ...(currentMSP ? [`MSP support available at ₹${currentMSP}/quintal`] : [])
      ],
      risks: [
        ...crop.risks.diseases.map(d => d.name + ': ' + d.symptoms),
        ...crop.risks.pests.map(p => p.name + ': ' + p.damage),
        ...crop.risks.weatherRisks,
        ...crop.risks.marketRisks
      ],
      benefits: [
        ...crop.benefits.economic,
        ...crop.benefits.environmental,
        ...crop.benefits.social,
        ...(relevantSchemes.length > 0 ? [`Government schemes available: ${relevantSchemes.join(', ')}`] : [])
      ],
      location: {
        suitableDistricts,
        agriZone: agriZone.toLowerCase().replace('_', ' '),
        weatherStation
      },
      schemes: {
        mspRate: currentMSP,
        subsidySchemes: relevantSchemes,
        insuranceAvailable: true, // PMFBY covers major crops
        nearestMSPCenter: userDistrict ? 
          PunjabSchemesService.getMSPCenters(userDistrict.name)[0]?.name :
          'Ludhiana Mandi'
      }
    }
  })

  // Additional filtering logic
  let filteredSuggestions = convertedSuggestions

  if (filters?.season) {
    filteredSuggestions = filteredSuggestions.filter(crop => 
      crop.season.toLowerCase() === filters.season.toLowerCase()
    )
  }

  if (filters?.soilType) {
    filteredSuggestions = filteredSuggestions.filter(crop =>
      crop.suitability.soilType.some(soil => 
        soil.toLowerCase().includes(filters.soilType.toLowerCase())
      )
    )
  }

  if (filters?.waterRequirement) {
    filteredSuggestions = filteredSuggestions.filter(crop =>
      crop.suitability.waterRequirement === filters.waterRequirement
    )
  }

  if (filters?.maxInvestment) {
    filteredSuggestions = filteredSuggestions.filter(crop =>
      crop.profitability.investmentCost <= filters.maxInvestment
    )
  }

  if (filters?.difficulty) {
    filteredSuggestions = filteredSuggestions.filter(crop =>
      crop.suitability.difficulty === filters.difficulty
    )
  }

  // Sort by profitability by default
  filteredSuggestions = filteredSuggestions.sort((a, b) => 
    b.profitability.roi - a.profitability.roi
  )

  return {
    success: true,
    data: {
      suggestions: filteredSuggestions,
      location: {
        name: userDistrict?.name || API_CONFIG.WEATHER.DEFAULT_CITY,
        coordinates: locationCoords,
        district: userDistrict,
        agriZone: userDistrict?.agriZone.toLowerCase().replace('_', ' ')
      },
      currentSeason,
      criteria: filters || {},
      totalSuggestions: filteredSuggestions.length,
      availableSchemes: availableSchemes.length,
      seasonalAlerts: seasonalAlerts,
      lastUpdated: new Date().toISOString()
    },
    source: userDistrict ? 'punjab-location-specific' : 'punjab-general'
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      season: searchParams.get('season'),
      soilType: searchParams.get('soilType'),
      waterRequirement: searchParams.get('waterRequirement'),
      maxInvestment: searchParams.get('maxInvestment') ? 
        parseInt(searchParams.get('maxInvestment')!) : undefined,
      difficulty: searchParams.get('difficulty'),
      limit: searchParams.get('limit') ? 
        parseInt(searchParams.get('limit')!) : undefined
    }

    const suggestions = getPunjabFarmSuggestions(filters)

    // Apply limit if specified
    if (filters.limit && filters.limit > 0) {
      suggestions.data.suggestions = suggestions.data.suggestions.slice(0, filters.limit)
    }

    return NextResponse.json(suggestions)

  } catch (error) {
    console.error('Farm suggestions API error:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch farm suggestions',
      data: null,
      source: 'error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      location, 
      soilType, 
      farmSize, 
      waterAvailability, 
      budget, 
      experience,
      preferences 
    } = body

    const filters = {
      soilType,
      waterRequirement: waterAvailability,
      maxInvestment: budget,
      difficulty: experience === 'beginner' ? 'easy' : 
                   experience === 'intermediate' ? 'medium' : undefined,
      ...preferences
    }

    const suggestions = getPunjabFarmSuggestions(filters)

    // Adjust suggestions based on farm size
    if (farmSize && suggestions.data.suggestions.length > 0) {
      suggestions.data.suggestions = suggestions.data.suggestions.map(crop => ({
        ...crop,
        profitability: {
          ...crop.profitability,
          investmentCost: Math.round(crop.profitability.investmentCost * farmSize),
          expectedRevenue: Math.round(crop.profitability.expectedRevenue * farmSize),
          profit: Math.round(crop.profitability.profit * farmSize)
        },
        expectedYield: Math.round(crop.expectedYield * farmSize)
      }))
    }

    return NextResponse.json(suggestions)

  } catch (error) {
    console.error('Farm suggestions POST API error:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to process farm suggestions request',
      data: null,
      source: 'error'
    }, { status: 500 })
  }
}