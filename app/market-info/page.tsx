"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Search,
  MapPin,
  ArrowLeft,
  Calendar,
  ShoppingCart,
  AlertCircle,
  BarChart3,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { localStorageService, isOffline } from '@/lib/local-storage'

interface CropPrice {
  id: string
  name: string
  currentPrice: number
  previousPrice: number
  change: number
  changePercent: number
  unit: string
  market: string
  lastUpdated: string
  demand: "high" | "medium" | "low"
  quality: string
}

interface MarketTrend {
  crop: string
  trend: "up" | "down" | "stable"
  prediction: string
  confidence: number
}

export default function MarketInfoPage() {
  const [selectedMarket, setSelectedMarket] = useState("ludhiana")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [marketData, setMarketData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dataSource, setDataSource] = useState<string>('')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Fetch market data with resilient handling
  const fetchMarketData = async (forceRefresh = false) => {
    try {
      setRefreshing(true)
      
      // Check if we're offline and have cached data
      if (isOffline() && !forceRefresh) {
        const cached = localStorageService.getBestMarketData()
        if (cached.data) {
          setMarketData(cached.data)
          setDataSource(`${cached.source} (${Math.round(cached.age / 60000)}min ago)`)
          setLastRefresh(new Date())
          return
        }
      }

      // Fetch from API
      const url = `/api/market-info${forceRefresh ? '?refresh=true' : ''}`
      const response = await fetch(url)
      const data = await response.json()
      
      setMarketData(data.data)
      setDataSource(data.source || 'api')
      setLastRefresh(new Date())
      
      // Cache the data for offline use
      if (data.success && data.data) {
        localStorageService.setMarketData({
          prices: data.data.prices,
          alerts: data.data.alerts,
          summary: data.data.summary,
          lastUpdated: data.data.lastUpdated
        })
      }
      
    } catch (error) {
      console.error('Failed to fetch market data:', error)
      
      // Try to use cached data as fallback
      const cached = localStorageService.getBestMarketData()
      if (cached.data) {
        setMarketData(cached.data)
        setDataSource(`fallback (${Math.round(cached.age / 60000)}min old)`)
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMarketData()
  }, [])

  const cropPrices: CropPrice[] = marketData?.prices || [
    {
      id: "1",
      name: "Rice (Basmati)",
      currentPrice: 2150,
      previousPrice: 2040,
      change: 110,
      changePercent: 5.4,
      unit: "per quintal",
      market: "Ludhiana Mandi",
      lastUpdated: "2024-01-18 10:30 AM",
      demand: "high",
      quality: "Grade A",
    },
    {
      id: "2",
      name: "Wheat",
      currentPrice: 2050,
      previousPrice: 2095,
      change: -45,
      changePercent: -2.1,
      unit: "per quintal",
      market: "Ludhiana Mandi",
      lastUpdated: "2024-01-18 10:30 AM",
      demand: "medium",
      quality: "Grade A",
    },
    {
      id: "3",
      name: "Sugarcane",
      currentPrice: 350,
      previousPrice: 340,
      change: 10,
      changePercent: 2.9,
      unit: "per quintal",
      market: "Ludhiana Mandi",
      lastUpdated: "2024-01-18 10:30 AM",
      demand: "high",
      quality: "Grade B",
    },
    {
      id: "4",
      name: "Cotton",
      currentPrice: 5800,
      previousPrice: 5650,
      change: 150,
      changePercent: 2.7,
      unit: "per quintal",
      market: "Ludhiana Mandi",
      lastUpdated: "2024-01-18 10:30 AM",
      demand: "medium",
      quality: "Grade A",
    },
    {
      id: "5",
      name: "Potato",
      currentPrice: 1200,
      previousPrice: 1350,
      change: -150,
      changePercent: -11.1,
      unit: "per quintal",
      market: "Ludhiana Mandi",
      lastUpdated: "2024-01-18 10:30 AM",
      demand: "low",
      quality: "Grade A",
    },
    {
      id: "6",
      name: "Onion",
      currentPrice: 2800,
      previousPrice: 2600,
      change: 200,
      changePercent: 7.7,
      unit: "per quintal",
      market: "Ludhiana Mandi",
      lastUpdated: "2024-01-18 10:30 AM",
      demand: "high",
      quality: "Grade A",
    },
  ]

  const marketTrends: MarketTrend[] = [
    {
      crop: "Rice",
      trend: "up",
      prediction: "Prices expected to rise by 8-12% in next month due to export demand",
      confidence: 85,
    },
    {
      crop: "Wheat",
      trend: "down",
      prediction: "Slight decline expected due to good harvest and increased supply",
      confidence: 72,
    },
    {
      crop: "Cotton",
      trend: "up",
      prediction: "Strong demand from textile industry, prices may increase 5-8%",
      confidence: 78,
    },
    {
      crop: "Potato",
      trend: "stable",
      prediction: "Prices stabilizing after recent decline, expect steady rates",
      confidence: 65,
    },
  ]

  const filteredPrices = cropPrices.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || crop.demand === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-orange-600 bg-orange-100"
      case "low":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
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
              <ShoppingCart className="h-6 w-6" />
              <h1 className="text-xl font-bold">Market Information</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Market Selection and Search */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ludhiana">Ludhiana Mandi</SelectItem>
                <SelectItem value="amritsar">Amritsar Mandi</SelectItem>
                <SelectItem value="jalandhar">Jalandhar Mandi</SelectItem>
                <SelectItem value="bathinda">Bathinda Mandi</SelectItem>
                <SelectItem value="patiala">Patiala Mandi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="high">High Demand</SelectItem>
              <SelectItem value="medium">Medium Demand</SelectItem>
              <SelectItem value="low">Low Demand</SelectItem>
            </SelectContent>
          </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchMarketData(true)}
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Prices */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Current Market Prices
                </CardTitle>
                <CardDescription>
                  Live prices from {selectedMarket.charAt(0).toUpperCase() + selectedMarket.slice(1)} Mandi
                  {dataSource && (
                    <span className="ml-2 text-xs opacity-75">• Source: {dataSource}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPrices.map((crop) => (
                    <div key={crop.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{crop.name}</h3>
                          <Badge className={getDemandColor(crop.demand)} variant="outline">
                            {crop.demand} demand
                          </Badge>
                          <Badge variant="outline">{crop.quality}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Market: {crop.market}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            Last updated: {crop.lastUpdated}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₹{crop.currentPrice.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{crop.unit}</div>
                        <div
                          className={`flex items-center gap-1 text-sm font-medium ${
                            crop.change > 0 ? "text-green-600" : crop.change < 0 ? "text-red-600" : "text-gray-600"
                          }`}
                        >
                          {crop.change > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : crop.change < 0 ? (
                            <TrendingDown className="h-3 w-3" />
                          ) : (
                            <BarChart3 className="h-3 w-3" />
                          )}
                          {crop.change > 0 ? "+" : ""}
                          {crop.change} ({crop.changePercent > 0 ? "+" : ""}
                          {crop.changePercent.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Trends and Insights */}
          <div className="space-y-6">
            {/* Market Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Trends
                </CardTitle>
                <CardDescription>Price predictions and market insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketTrends.map((trend, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{trend.crop}</h4>
                        {getTrendIcon(trend.trend)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{trend.prediction}</p>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground">Confidence:</div>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${trend.confidence}%` }} />
                        </div>
                        <div className="text-xs font-medium">{trend.confidence}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Market Alerts
                </CardTitle>
                <CardDescription>Important market updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Price Surge</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Rice prices up 15% this week due to increased export orders. Good time to sell.
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-800">Market Update</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      New government procurement policy announced. Check minimum support prices.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Seasonal Trend</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Winter crop prices typically stabilize in February. Plan your sales accordingly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Set Price Alerts
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Price History
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    Compare Markets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Market Summary</CardTitle>
            <CardDescription>Today's market overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-green-700">Crops Rising</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">2</div>
                <div className="text-sm text-red-700">Crops Falling</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">₹2,358</div>
                <div className="text-sm text-blue-700">Average Price</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">+3.2%</div>
                <div className="text-sm text-orange-700">Overall Change</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
