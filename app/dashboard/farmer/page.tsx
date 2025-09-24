"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import FarmGuardLayout from "@/components/farmguard-layout"
import { Calculator, Calendar, TrendingUp, CloudRain, Sprout, Bug, Thermometer, Droplets, Wind, Sun, Bot, BarChart3, HelpCircle, TestTube, Store, Cloud } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import FarmerGuide, { farmerGuideSteps } from "@/components/farmer-guide"
import PWAInstallPrompt from "@/components/pwa-install-prompt"
import { useLanguage } from "@/contexts/language-context"
import { WeatherSkeleton, CardSkeleton } from "@/components/loading"
import { useTodaysWeather } from "@/lib/hooks/use-weather"

export default function FarmerDashboard() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('Farmer')
  
  // Get today's weather data
  const { weather: todaysWeather, alerts: weatherAlerts, loading: weatherLoading } = useTodaysWeather()
  
  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboard = async () => {
      // Get user info from localStorage only on client-side
      const email = typeof window !== 'undefined' 
        ? localStorage.getItem('user-email') || 'farmer@example.com'
        : 'farmer@example.com'
      setUserEmail(email)
      
      // Extract name from email or use default
      const name = email.split('@')[0] || 'Farmer'
      setUserName(name.charAt(0).toUpperCase() + name.slice(1))
      
      // Simulate API calls for dashboard data
      await new Promise(resolve => setTimeout(resolve, 1500))
      setLoading(false)
    }
    
    loadDashboard()
  }, [])

  // Helper function to get weather icons
  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'rain':
      case 'heavy rain':
      case 'thunderstorm':
        return <CloudRain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
      case 'light rain':
      case 'drizzle':
        return <CloudRain className="h-8 w-8 text-blue-400 mx-auto mb-2" />
      case 'clear':
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
      case 'clouds':
      case 'cloudy':
      case 'overcast':
        return <Cloud className="h-8 w-8 text-gray-500 mx-auto mb-2" />
      case 'partly cloudy':
      case 'few clouds':
        return <Cloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
    }
  }

  return (
    <FarmGuardLayout>
      <div className="min-h-screen bg-gray-50">

        <main className="container mx-auto px-4 py-6">
          {/* Farmer Guide */}
          <FarmerGuide steps={farmerGuideSteps} />
          
          {/* PWA Install Prompt */}
          <PWAInstallPrompt />

          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {userName}! 🌾</h2>
                <p className="text-gray-600">
                  {loading ? 'Loading your farming data...' : 'Today is a good day for farming. Check your tasks below.'}
                </p>
                {userEmail && (
                  <p className="text-sm text-gray-500">Logged in as: {userEmail}</p>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('farmguard-guide-completed')
                  }
                }}
                className="flex items-center gap-2 text-sm"
                disabled={loading}
              >
                <HelpCircle className="h-4 w-4" />
                Show Guide
              </Button>
            </div>
          </div>

          {/* Today's Weather - Priority #1 for farmers */}
          {weatherLoading ? (
            <WeatherSkeleton />
          ) : todaysWeather ? (
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 weather-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                  <CloudRain className="h-6 w-6" />
                  Today's Weather
                </h3>
                <Link href="/weather">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Full Forecast
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  {getWeatherIcon(todaysWeather.condition)}
                  <div className="text-2xl font-bold text-blue-800">{todaysWeather.high}°C</div>
                  <div className="text-sm text-blue-600">{todaysWeather.condition}</div>
                </div>
                <div className="text-center">
                  <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-800">{todaysWeather.humidity}%</div>
                  <div className="text-sm text-blue-600">Humidity</div>
                </div>
                <div className="text-center">
                  <Wind className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-800">{todaysWeather.windSpeed} km/h</div>
                  <div className="text-sm text-blue-600">Wind</div>
                </div>
                <div className="text-center">
                  <CloudRain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-800">{todaysWeather.rainfall}mm</div>
                  <div className="text-sm text-blue-600">Rainfall</div>
                </div>
              </div>
              
              {/* Display weather alerts if any */}
              {weatherAlerts.length > 0 && (
                <Alert className="mt-4 border-orange-200 bg-orange-50">
                  <CloudRain className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>⚠️ {weatherAlerts[0].title}:</strong> {weatherAlerts[0].description}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Farming recommendations */}
              {todaysWeather.farmingRecommendations && todaysWeather.farmingRecommendations.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-1 text-sm">Today's Farming Tips:</h4>
                  <p className="text-xs text-green-700">
                    • {todaysWeather.farmingRecommendations[0]}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          ) : (
            <Card className="mb-6 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-600 flex items-center gap-2">
                    <CloudRain className="h-6 w-6" />
                    Weather Unavailable
                  </h3>
                  <Link href="/weather">
                    <Button size="sm" variant="outline">
                      Try Again
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-gray-600">Unable to load weather data. Please check your connection.</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions - What farmers need most */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <Link href="/farm-suggestions" className="crop-suggestions">
              <Card className="hover:shadow-lg transition-shadow bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <Sprout className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-green-800 mb-2">Crop Suggestions</h3>
                  <p className="text-sm text-green-600">Find best crops for your land</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/ai-assistant" className="ai-assistant-link">
              <Card className="hover:shadow-lg transition-shadow bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Bot className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-blue-800 mb-2">Ask Expert</h3>
                  <p className="text-sm text-blue-600">Get instant farming advice</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/market-info" className="market-info">
              <Card className="hover:shadow-lg transition-shadow bg-purple-50 border-purple-200">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-bold text-purple-800 mb-2">Market Prices</h3>
                  <p className="text-sm text-purple-600">Check today's rates</p>
                </CardContent>
              </Card>
            </Link>
          </div>
          )}

          {/* Farm Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">5.2</div>
                <div className="text-sm text-green-700 font-medium">Acres Farmed</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-blue-700 font-medium">Active Crops</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">₹45K</div>
                <div className="text-sm text-yellow-700 font-medium">Expected Profit</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">15</div>
                <div className="text-sm text-orange-700 font-medium">Days to Harvest</div>
              </CardContent>
            </Card>
          </div>

          {/* Profit Calculator - Simplified */}
          <Card className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg profit-calculator">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Quick Profit Calculator
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-blue-100 block mb-1">Land (acres)</label>
                  <input className="w-full p-2 rounded bg-blue-400/30 border border-blue-300/50 text-white placeholder:text-blue-200" placeholder="5" />
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-100 block mb-1">Yield (kg/acre)</label>
                  <input className="w-full p-2 rounded bg-blue-400/30 border border-blue-300/50 text-white placeholder:text-blue-200" placeholder="1000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-100 block mb-1">Cost (₹)</label>
                  <input className="w-full p-2 rounded bg-blue-400/30 border border-blue-300/50 text-white placeholder:text-blue-200" placeholder="25000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-100 block mb-1">Price (₹/kg)</label>
                  <input className="w-full p-2 rounded bg-blue-400/30 border border-blue-300/50 text-white placeholder:text-blue-200" placeholder="30" />
                </div>
              </div>
              <div className="bg-blue-400/20 rounded-lg p-4 flex justify-between items-center">
                <span className="text-blue-100">Estimated Profit:</span>
                <span className="text-2xl font-bold">₹1,25,000</span>
              </div>
              <Link href="/farm-suggestions">
                <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-gray-100">
                  Get Detailed Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Important Tasks */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Profitability Calculator */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Calculator className="h-5 w-5" />
                  Profitability Calculator
                </CardTitle>
                <CardDescription>Calculate your crop profits and margins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Land Size:</span>
                    <span className="font-medium">5.2 acres</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Expected Yield:</span>
                    <span className="font-medium">2.5 tons/acre</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Cost:</span>
                    <span className="font-medium">₹35,000</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-green-600">
                    <span>Estimated Profit:</span>
                    <span>₹45,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Profit Margin:</span>
                    <span className="font-medium text-green-600">56%</span>
                  </div>
                  <Button className="w-full mt-4" size="sm">
                    Recalculate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sowing Window */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Sowing Window
                </CardTitle>
                <CardDescription>Best time to sow your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Wheat</div>
                      <div className="text-sm text-muted-foreground">Optimal sowing period</div>
                    </div>
                    <Badge variant="secondary">Nov 15-30</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Mustard</div>
                      <div className="text-sm text-muted-foreground">Good time to sow</div>
                    </div>
                    <Badge variant="outline">Oct 20-Nov 10</Badge>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    View All Crops
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Harvest Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Harvest Alert
                </CardTitle>
                <CardDescription>Upcoming harvest schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Rice (Field A)</span>
                      <Badge className="bg-orange-100 text-orange-800">15 days</Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="text-xs text-muted-foreground">85% maturity</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Sugarcane (Field B)</span>
                      <Badge variant="outline">45 days</Badge>
                    </div>
                    <Progress value={60} className="h-2" />
                    <div className="text-xs text-muted-foreground">60% maturity</div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    Set Reminders
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Market Trend */}
            <Link href="/market-info">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Market Trends
                  </CardTitle>
                  <CardDescription>Current crop prices and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Rice</div>
                        <div className="text-sm text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +5.2%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">₹2,150</div>
                        <div className="text-xs text-muted-foreground">per quintal</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Wheat</div>
                        <div className="text-sm text-red-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 rotate-180" />
                          -2.1%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">₹2,050</div>
                        <div className="text-xs text-muted-foreground">per quintal</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      View All Prices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Recommended Crops */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Recommended Crops
                </CardTitle>
                <CardDescription>Best crops for your region and season</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Potato</div>
                      <div className="text-sm text-muted-foreground">High demand, good price</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Onion</div>
                      <div className="text-sm text-muted-foreground">Suitable for your soil</div>
                    </div>
                    <Badge variant="secondary">Consider</Badge>
                  </div>
                  <Button className="w-full" size="sm">
                    Get Advice
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weather Card */}
            <Link href="/weather">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5" />
                    Weather Forecast
                  </CardTitle>
                  <CardDescription>5-day weather outlook</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Today</span>
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">28°C</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tomorrow</span>
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">26°C</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Rainfall:</strong> 15mm expected
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      View Detailed Forecast
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/ai-assistant">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent w-full">
                <Bot className="h-6 w-6" />
                <span className="text-sm">AI Assistant</span>
              </Button>
            </Link>
            <Link href="/pest-detection">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent w-full">
                <Bug className="h-6 w-6" />
                <span className="text-sm">Pest Detection</span>
              </Button>
            </Link>
            <Link href="/soil-analysis">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent w-full">
                <TestTube className="h-6 w-6" />
                <span className="text-sm">Soil Analysis</span>
              </Button>
            </Link>
            <Link href="/market-info">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent w-full">
                <Store className="h-6 w-6" />
                <span className="text-sm">Market Info</span>
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </FarmGuardLayout>
  )
}
