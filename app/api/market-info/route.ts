import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'
import { apiResilienceService } from '@/lib/api-resilience'

interface MarketPrice {
  crop: string
  currentPrice: number
  previousPrice: number
  change: number
  changePercentage: number
  unit: string
  market: string
  lastUpdated: string
  trend: 'up' | 'down' | 'stable'
  quality: 'premium' | 'medium' | 'low'
}

interface MarketAlert {
  id: string
  crop: string
  type: 'price_drop' | 'price_surge' | 'demand_high' | 'supply_low'
  message: string
  severity: 'info' | 'warning' | 'critical'
  timestamp: string
}

interface MarketResponse {
  success: boolean
  data: {
    prices: MarketPrice[]
    alerts: MarketAlert[]
    summary: {
      totalCrops: number
      pricesUp: number
      pricesDown: number
      lastUpdated: string
    }
  }
  source: string
  error?: string
}

// Mock market data for development
function getMockMarketData(): MarketResponse {
  const crops = [
    { name: 'Rice', basePrice: 2500, unit: '₹/quintal' },
    { name: 'Wheat', basePrice: 2200, unit: '₹/quintal' },
    { name: 'Sugarcane', basePrice: 350, unit: '₹/quintal' },
    { name: 'Cotton', basePrice: 6500, unit: '₹/quintal' },
    { name: 'Maize', basePrice: 1900, unit: '₹/quintal' },
    { name: 'Soybean', basePrice: 4200, unit: '₹/quintal' },
    { name: 'Onion', basePrice: 1500, unit: '₹/quintal' },
    { name: 'Potato', basePrice: 1200, unit: '₹/quintal' },
    { name: 'Tomato', basePrice: 2800, unit: '₹/quintal' },
    { name: 'Cabbage', basePrice: 800, unit: '₹/quintal' },
  ]

  const markets = ['Ludhiana Mandi', 'Delhi Mandi', 'Mumbai Mandi', 'Chandigarh Mandi']
  const qualities: ('premium' | 'medium' | 'low')[] = ['premium', 'medium', 'low']

  const mockPrices: MarketPrice[] = crops.map((crop, index) => {
    const changePercentage = (Math.random() - 0.5) * 20 // -10% to +10%
    const change = Math.round((crop.basePrice * changePercentage) / 100)
    const currentPrice = crop.basePrice + change
    const previousPrice = crop.basePrice

    return {
      crop: crop.name,
      currentPrice: Math.round(currentPrice),
      previousPrice: previousPrice,
      change: Math.round(change),
      changePercentage: Math.round(changePercentage * 100) / 100,
      unit: crop.unit,
      market: markets[Math.floor(Math.random() * markets.length)],
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Within last hour
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      quality: qualities[Math.floor(Math.random() * qualities.length)]
    }
  })

  const mockAlerts: MarketAlert[] = []

  // Generate some random alerts
  if (Math.random() > 0.6) {
    const randomCrop = crops[Math.floor(Math.random() * crops.length)]
    mockAlerts.push({
      id: 'alert-1',
      crop: randomCrop.name,
      type: 'price_surge',
      message: `${randomCrop.name} prices increased by 15% due to high demand`,
      severity: 'info',
      timestamp: new Date().toISOString()
    })
  }

  if (Math.random() > 0.7) {
    const randomCrop = crops[Math.floor(Math.random() * crops.length)]
    mockAlerts.push({
      id: 'alert-2',
      crop: randomCrop.name,
      type: 'supply_low',
      message: `Limited supply of ${randomCrop.name} expected due to weather conditions`,
      severity: 'warning',
      timestamp: new Date().toISOString()
    })
  }

  const pricesUp = mockPrices.filter(p => p.trend === 'up').length
  const pricesDown = mockPrices.filter(p => p.trend === 'down').length

  return {
    success: true,
    data: {
      prices: mockPrices,
      alerts: mockAlerts,
      summary: {
        totalCrops: mockPrices.length,
        pricesUp: pricesUp,
        pricesDown: pricesDown,
        lastUpdated: new Date().toISOString()
      }
    },
    source: 'mock'
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const crop = searchParams.get('crop')
    const market = searchParams.get('market')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const forceRefresh = searchParams.get('refresh') === 'true'

    console.log(`Market API request: crop=${crop}, market=${market}, limit=${limit}, forceRefresh=${forceRefresh}`)

    // Use resilient service to get market data
    const result = await apiResilienceService.getMarketData()
    
    let marketData = result.data
    
    // Apply filters if specified
    if (crop && marketData.prices) {
      marketData.prices = marketData.prices.filter((p: any) => 
        p.crop.toLowerCase().includes(crop.toLowerCase())
      )
    }

    if (market && marketData.prices) {
      marketData.prices = marketData.prices.filter((p: any) => 
        p.market.toLowerCase().includes(market.toLowerCase())
      )
    }

    if (limit && limit > 0 && marketData.prices) {
      marketData.prices = marketData.prices.slice(0, limit)
    }

    // Update summary after filtering
    if (marketData.prices) {
      marketData.summary = {
        ...marketData.summary,
        totalCrops: marketData.prices.length,
        pricesUp: marketData.prices.filter((p: any) => p.trend === 'up').length,
        pricesDown: marketData.prices.filter((p: any) => p.trend === 'down').length
      }
    }

    return NextResponse.json({
      success: result.success,
      data: marketData,
      source: result.source,
      cached: result.cached,
      timestamp: result.timestamp,
      error: result.error
    })

  } catch (error) {
    console.error('Market API critical error:', error)

    // Emergency fallback to fresh mock data
    const mockData = getMockMarketData()

    return NextResponse.json({
      success: false,
      error: 'All market services unavailable',
      data: mockData.data,
      source: 'emergency-fallback',
      timestamp: new Date().toISOString()
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { crops, market, quality } = body

    const mockData = getMockMarketData()

    // Filter based on request parameters
    if (crops && Array.isArray(crops)) {
      mockData.data.prices = mockData.data.prices.filter(p =>
        crops.some(crop => p.crop.toLowerCase().includes(crop.toLowerCase()))
      )
    }

    if (market) {
      mockData.data.prices = mockData.data.prices.filter(p =>
        p.market.toLowerCase().includes(market.toLowerCase())
      )
    }

    if (quality) {
      mockData.data.prices = mockData.data.prices.filter(p => p.quality === quality)
    }

    return NextResponse.json(mockData)

  } catch (error) {
    console.error('Market API POST error:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market data',
      data: null,
      source: 'error'
    }, { status: 500 })
  }
}

// Helper function to get specific crop prices (internal use only)
async function getCropPrice(cropName: string): Promise<MarketPrice[]> {
  const mockData = getMockMarketData()
  return mockData.data.prices.filter(p =>
    p.crop.toLowerCase().includes(cropName.toLowerCase())
  )
}
