import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'

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
    waterRequirement: 'low' | 'medium' | 'high'
    difficulty: 'easy' | 'medium' | 'hard'
    suitabilityScore: number // 0-100
  }
  marketDemand: {
    currentPrice: number
    priceUnit: string
    demandLevel: 'low' | 'medium' | 'high'
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
}

interface FarmSuggestionsResponse {
  success: boolean
  data: {
    suggestions: CropSuggestion[]
    location: {
      name: string
      coordinates: { lat: number; lon: number }
    }
    currentSeason: string
    criteria: any
    totalSuggestions: number
    lastUpdated: string
  }
  source: string
  error?: string
}

// Mock crop data for different regions and seasons
function getMockFarmSuggestions(filters?: any): FarmSuggestionsResponse {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  
  // Determine current season based on month (India)
  let currentSeason = 'Rabi'
  if (currentMonth >= 6 && currentMonth <= 9) {
    currentSeason = 'Kharif'
  } else if (currentMonth >= 10 && currentMonth <= 11) {
    currentSeason = 'Post-Kharif'
  }

  const mockSuggestions: CropSuggestion[] = [
    {
      id: 'crop-001',
      cropName: 'Rice',
      variety: 'Basmati 370',
      season: 'Kharif',
      sowingTime: 'June-July',
      harvestTime: 'October-November',
      duration: 120,
      expectedYield: 40,
      yieldUnit: 'quintal/hectare',
      profitability: {
        investmentCost: 35000,
        expectedRevenue: 100000,
        profit: 65000,
        profitMargin: 65,
        roi: 185
      },
      suitability: {
        soilType: ['Clay', 'Loamy'],
        climateConditions: ['High humidity', 'Monsoon'],
        waterRequirement: 'high',
        difficulty: 'medium',
        suitabilityScore: 85
      },
      marketDemand: {
        currentPrice: 2500,
        priceUnit: '₹/quintal',
        demandLevel: 'high',
        marketTrend: 'stable'
      },
      requirements: {
        seedQuantity: '25-30 kg/hectare',
        fertilizer: ['NPK 10:26:26', 'Urea', 'DAP'],
        irrigation: 'Flood irrigation required',
        laborHours: 200
      },
      tips: [
        'Transplant 21-day old seedlings',
        'Maintain 2-3 cm water level',
        'Apply fertilizer in split doses',
        'Monitor for brown plant hopper'
      ],
      risks: [
        'Blast disease in humid conditions',
        'Water logging damage',
        'Price volatility',
        'Storage pest issues'
      ],
      benefits: [
        'Stable market demand',
        'Government MSP support',
        'Good export potential',
        'Multiple varieties available'
      ]
    },
    {
      id: 'crop-002',
      cropName: 'Wheat',
      variety: 'HD 2967',
      season: 'Rabi',
      sowingTime: 'November-December',
      harvestTime: 'March-April',
      duration: 120,
      expectedYield: 45,
      yieldUnit: 'quintal/hectare',
      profitability: {
        investmentCost: 28000,
        expectedRevenue: 90000,
        profit: 62000,
        profitMargin: 68.9,
        roi: 221
      },
      suitability: {
        soilType: ['Loamy', 'Sandy loam'],
        climateConditions: ['Cool dry winters'],
        waterRequirement: 'medium',
        difficulty: 'easy',
        suitabilityScore: 90
      },
      marketDemand: {
        currentPrice: 2000,
        priceUnit: '₹/quintal',
        demandLevel: 'high',
        marketTrend: 'stable'
      },
      requirements: {
        seedQuantity: '100-125 kg/hectare',
        fertilizer: ['NPK 12:32:16', 'Urea'],
        irrigation: '4-5 irrigations required',
        laborHours: 150
      },
      tips: [
        'Sow at proper depth (3-4 cm)',
        'Maintain line spacing 22.5 cm',
        'First irrigation after 20-25 days',
        'Harvest at proper maturity'
      ],
      risks: [
        'Late sowing reduces yield',
        'Rust diseases',
        'Hail damage',
        'Market price fluctuations'
      ],
      benefits: [
        'Government procurement',
        'Easy cultivation',
        'Good storage life',
        'Multiple end uses'
      ]
    },
    {
      id: 'crop-003',
      cropName: 'Maize',
      variety: 'NK 6240',
      season: 'Kharif',
      sowingTime: 'June-July',
      harvestTime: 'October',
      duration: 90,
      expectedYield: 60,
      yieldUnit: 'quintal/hectare',
      profitability: {
        investmentCost: 25000,
        expectedRevenue: 102000,
        profit: 77000,
        profitMargin: 75.5,
        roi: 308
      },
      suitability: {
        soilType: ['Well-drained', 'Sandy loam', 'Loamy'],
        climateConditions: ['Warm humid', 'Moderate rainfall'],
        waterRequirement: 'medium',
        difficulty: 'easy',
        suitabilityScore: 88
      },
      marketDemand: {
        currentPrice: 1700,
        priceUnit: '₹/quintal',
        demandLevel: 'high',
        marketTrend: 'rising'
      },
      requirements: {
        seedQuantity: '18-25 kg/hectare',
        fertilizer: ['Complex fertilizer', 'Urea'],
        irrigation: '2-3 irrigations if rain fails',
        laborHours: 120
      },
      tips: [
        'Plant spacing: 75x25 cm',
        'Side dress nitrogen at knee height',
        'Control weeds early',
        'Harvest at 15-18% moisture'
      ],
      risks: [
        'Stem borer attack',
        'Fall army worm',
        'Storage moisture issues',
        'Wild animal damage'
      ],
      benefits: [
        'Short duration crop',
        'Multiple uses (food, feed, industrial)',
        'Good market demand',
        'Mechanization friendly'
      ]
    },
    {
      id: 'crop-004',
      cropName: 'Tomato',
      variety: 'Arka Rakshak',
      season: 'Rabi',
      sowingTime: 'October-November',
      harvestTime: 'February-April',
      duration: 110,
      expectedYield: 500,
      yieldUnit: 'quintal/hectare',
      profitability: {
        investmentCost: 45000,
        expectedRevenue: 750000,
        profit: 705000,
        profitMargin: 94,
        roi: 1567
      },
      suitability: {
        soilType: ['Well-drained loamy', 'Sandy loam'],
        climateConditions: ['Cool dry weather'],
        waterRequirement: 'medium',
        difficulty: 'medium',
        suitabilityScore: 75
      },
      marketDemand: {
        currentPrice: 1500,
        priceUnit: '₹/quintal',
        demandLevel: 'high',
        marketTrend: 'rising'
      },
      requirements: {
        seedQuantity: '200-250 grams/hectare',
        fertilizer: ['FYM', 'NPK', 'Micronutrients'],
        irrigation: 'Drip irrigation recommended',
        laborHours: 300
      },
      tips: [
        'Transplant 4-5 week old seedlings',
        'Provide support with stakes',
        'Regular pruning of suckers',
        'Harvest at breaker stage for market'
      ],
      risks: [
        'Bacterial wilt',
        'Fruit cracking',
        'Price volatility',
        'Post-harvest losses'
      ],
      benefits: [
        'Very high profitability',
        'Year-round demand',
        'Short duration',
        'Export potential'
      ]
    },
    {
      id: 'crop-005',
      cropName: 'Onion',
      variety: 'Nasik Red',
      season: 'Rabi',
      sowingTime: 'December-January',
      harvestTime: 'April-May',
      duration: 120,
      expectedYield: 250,
      yieldUnit: 'quintal/hectare',
      profitability: {
        investmentCost: 40000,
        expectedRevenue: 375000,
        profit: 335000,
        profitMargin: 89.3,
        roi: 837
      },
      suitability: {
        soilType: ['Well-drained', 'Sandy loam', 'Alluvial'],
        climateConditions: ['Cool growing season', 'Dry harvesting period'],
        waterRequirement: 'medium',
        difficulty: 'medium',
        suitabilityScore: 80
      },
      marketDemand: {
        currentPrice: 1500,
        priceUnit: '₹/quintal',
        demandLevel: 'high',
        marketTrend: 'stable'
      },
      requirements: {
        seedQuantity: '8-10 kg/hectare',
        fertilizer: ['FYM', 'NPK 19:19:19', 'Sulphur'],
        irrigation: 'Light frequent irrigations',
        laborHours: 250
      },
      tips: [
        'Transplant at 6-7 weeks',
        'Maintain proper spacing',
        'Stop irrigation before harvest',
        'Cure properly for storage'
      ],
      risks: [
        'Purple blotch disease',
        'Thrips infestation',
        'Storage losses',
        'Price crashes during peak season'
      ],
      benefits: [
        'High market value',
        'Good storage life',
        'Export opportunities',
        'Essential commodity'
      ]
    }
  ]

  // Filter suggestions based on current season and other criteria
  let filteredSuggestions = mockSuggestions

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
        name: API_CONFIG.WEATHER.DEFAULT_CITY,
        coordinates: {
          lat: API_CONFIG.WEATHER.DEFAULT_LAT,
          lon: API_CONFIG.WEATHER.DEFAULT_LON
        }
      },
      currentSeason,
      criteria: filters || {},
      totalSuggestions: filteredSuggestions.length,
      lastUpdated: new Date().toISOString()
    },
    source: 'mock'
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

    const suggestions = getMockFarmSuggestions(filters)

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

    const suggestions = getMockFarmSuggestions(filters)

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