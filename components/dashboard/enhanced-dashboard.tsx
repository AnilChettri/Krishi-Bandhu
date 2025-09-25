'use client'

import { useEffect, useState } from 'react'
import { 
  useFarmGuardStore, 
  useWeatherData, 
  useMarketData, 
  useCropSuggestions,
  useUser 
} from '@/lib/farmguard-store'
import { useLanguage } from '@/contexts/language-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Cloud, 
  TrendingUp, 
  TrendingDown, 
  Leaf, 
  MapPin, 
  Bell, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  ThermometerSun,
  Droplets,
  Wind,
  Eye,
  Banknote,
  Calendar,
  AlertTriangle
} from 'lucide-react'
import WeatherAlerts from '@/components/weather/weather-alerts'

// Weather Card Component
const WeatherCard = () => {
  const { weather, loading, error, fetchWeatherData } = useWeatherData()
  const { user } = useUser()
  const { t } = useLanguage()

  useEffect(() => {
    if (!weather && !loading) {
      fetchWeatherData()
    }
  }, [weather, loading, fetchWeatherData])

  const refreshWeather = () => {
    if (user?.location?.coordinates) {
      fetchWeatherData(user.location.coordinates.lat, user.location.coordinates.lon)
    } else {
      fetchWeatherData()
    }
  }

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            {t('weather.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={refreshWeather} className="mt-3" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.retry')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const todayForecast = weather?.forecast?.[0]
  const upcomingForecast = weather?.forecast?.slice(1, 4) || []

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            {t('weather.title')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {weather?.location?.name || 'Current Location'}
            </span>
            <Button onClick={refreshWeather} variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Today's Weather */}
        {todayForecast && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-2xl font-bold">{todayForecast.high}°C</h3>
                <p className="text-sm text-muted-foreground">
                  {t('weather.low')}: {todayForecast.low}°C
                </p>
                <p className="text-sm font-medium">{todayForecast.condition}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-xs text-muted-foreground">Humidity</span>
                  <span className="text-sm font-medium">{todayForecast.humidity}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <Wind className="h-5 w-5 text-gray-500 mb-1" />
                  <span className="text-xs text-muted-foreground">Wind</span>
                  <span className="text-sm font-medium">{todayForecast.windSpeed} km/h</span>
                </div>
                <div className="flex flex-col items-center">
                  <Cloud className="h-5 w-5 text-gray-600 mb-1" />
                  <span className="text-xs text-muted-foreground">Rain</span>
                  <span className="text-sm font-medium">{todayForecast.rainfall} mm</span>
                </div>
              </div>
            </div>
            
            {/* Farming Recommendations */}
            {todayForecast.farmingRecommendations && todayForecast.farmingRecommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">{t('weather.farming_tips')}</h4>
                <div className="space-y-1">
                  {todayForecast.farmingRecommendations.slice(0, 2).map((tip, index) => (
                    <p key={index} className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      {tip}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Forecast */}
        <div className="grid grid-cols-3 gap-2">
          {upcomingForecast.map((day, index) => (
            <div key={index} className="text-center p-2 rounded bg-muted/30">
              <p className="text-xs font-medium mb-1">{day.day}</p>
              <p className="text-sm font-bold">{day.high}°/{day.low}°</p>
              <p className="text-xs text-muted-foreground">{day.condition}</p>
            </div>
          ))}
        </div>

        {/* Enhanced Weather Alerts with Blinking Animation */}
        {weather?.alerts && weather.alerts.length > 0 && (
          <div className="mt-4">
            <WeatherAlerts 
              alerts={weather.alerts}
              enableSound={true}
              onDismiss={(alertId) => console.log('Alert dismissed:', alertId)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Market Prices Card Component
const MarketCard = () => {
  const { market, loading, error, fetchMarketData } = useMarketData()
  const { t } = useLanguage()

  useEffect(() => {
    if (!market && !loading) {
      fetchMarketData()
    }
  }, [market, loading, fetchMarketData])

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-6 w-[180px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('market.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => fetchMarketData()} className="mt-3" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.retry')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const topPrices = market?.prices?.slice(0, 5) || []

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            {t('market.title')}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>₹{market?.summary?.totalCrops || 0} crops</span>
            <Button onClick={() => fetchMarketData()} variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {market?.summary && (
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              {market.summary.pricesUp} up
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <TrendingDown className="h-3 w-3" />
              {market.summary.pricesDown} down
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topPrices.map((price, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <h4 className="font-medium">{price.crop}</h4>
                <p className="text-sm text-muted-foreground">{price.market}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{price.currentPrice}/{price.unit}</span>
                  <div className={`flex items-center gap-1 ${
                    price.trend === 'up' ? 'text-green-600' : 
                    price.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {price.trend === 'up' ? <TrendingUp className="h-3 w-3" /> :
                     price.trend === 'down' ? <TrendingDown className="h-3 w-3" /> :
                     <span className="h-3 w-3" />}
                    <span className="text-xs">
                      {price.changePercentage > 0 ? '+' : ''}{price.changePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Previous: ₹{price.previousPrice}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Market Alerts */}
        {market?.alerts && market.alerts.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Bell className="h-4 w-4" />
              Market Alerts
            </h4>
            <div className="space-y-2">
              {market.alerts.slice(0, 2).map((alert, index) => (
                <Alert key={alert.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-sm font-medium">{alert.crop}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                    </div>
                    <Badge variant={
                      alert.severity === 'critical' ? 'destructive' : 
                      alert.severity === 'warning' ? 'default' : 'secondary'
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Crop Suggestions Card
const CropSuggestionsCard = () => {
  const { suggestions, loading, error, fetchCropSuggestions } = useCropSuggestions()
  const { user } = useUser()
  const { t } = useLanguage()
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (!hasInitialized && user?.farmDetails && !loading) {
      fetchCropSuggestions({
        district: user.location?.district,
        soilType: user.farmDetails.soilType,
        totalLand: user.farmDetails.totalLand,
        farmingExperience: user.farmDetails.farmingExperience,
        season: new Date().getMonth() >= 5 && new Date().getMonth() <= 9 ? 'kharif' : 'rabi'
      })
      setHasInitialized(true)
    }
  }, [user, hasInitialized, loading, fetchCropSuggestions])

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-6 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30">
                <Skeleton className="h-4 w-[120px] mb-2" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            {t('crops.suggestions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const topSuggestions = suggestions.slice(0, 3)

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5" />
          {t('crops.suggestions')}
        </CardTitle>
        <CardDescription>
          Based on your farm profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topSuggestions.map((suggestion, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{suggestion.cropName}</h4>
                <Badge variant="secondary" className="text-xs">
                  {suggestion.suitabilityScore}% match
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{suggestion.variety}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-600">
                  ROI: {suggestion.profitability?.roi || 'N/A'}%
                </span>
                <span className="text-muted-foreground">
                  {suggestion.season}
                </span>
              </div>
              {suggestion.tips && suggestion.tips.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {suggestion.tips[0]}
                </p>
              )}
            </div>
          ))}
        </div>
        {suggestions.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Complete your farm profile to get personalized crop suggestions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Connectivity Status Component
const ConnectivityStatus = () => {
  const settings = useFarmGuardStore((state) => state.settings)
  const { t } = useLanguage()

  if (settings.connectivity.isOnline) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Wifi className="h-4 w-4" />
        <span className="text-xs">{t('common.online')}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-orange-600">
      <WifiOff className="h-4 w-4" />
      <span className="text-xs">{t('common.offline')}</span>
    </div>
  )
}

// Quick Actions Component
const QuickActions = () => {
  const { user } = useUser()
  const refreshData = useFarmGuardStore((state) => state.refreshData)
  const { t } = useLanguage()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    try {
      await refreshData()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Quick Actions</span>
          <ConnectivityStatus />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <Button 
            onClick={handleRefreshData}
            disabled={isRefreshing}
            variant="outline" 
            className="w-full justify-start"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh_data')}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/dashboard/pest-detection'}
          >
            <Eye className="h-4 w-4 mr-2" />
            {t('pest.detect')}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/dashboard/soil-analysis'}
          >
            <ThermometerSun className="h-4 w-4 mr-2" />
            {t('soil.analyze')}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/dashboard/ai-assistant'}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {t('ai.assistant')}
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <div className="mt-4 p-3 rounded-lg bg-muted/30">
            <h4 className="text-sm font-medium mb-1">Welcome back!</h4>
            <p className="text-xs text-muted-foreground">{user.name}</p>
            {user.location && (
              <p className="text-xs text-muted-foreground">
                📍 {user.location.district}
                {user.location.tehsil && `, ${user.location.tehsil}`}
              </p>
            )}
            {user.farmDetails && (
              <p className="text-xs text-muted-foreground">
                🌾 {user.farmDetails.totalLand} acres
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main Enhanced Dashboard Component
const EnhancedDashboard = () => {
  const { user, isAuthenticated } = useUser()
  const { weather } = useWeatherData()
  const { t } = useLanguage()
  const settings = useFarmGuardStore((state) => state.settings)

  // Get critical alerts for global banner
  const criticalAlerts = weather?.alerts?.filter(alert => 
    alert.severity === 'critical' || alert.severity === 'extreme'
  ) || []

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Please sign in to access your farming dashboard.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Global Critical Weather Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-red-600 text-white">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 animate-bounce" />
                <div>
                  <span className="font-bold text-sm">
                    🚨 CRITICAL WEATHER ALERT - {criticalAlerts[0].title.toUpperCase()}
                  </span>
                  <p className="text-xs mt-1 opacity-90">
                    {criticalAlerts[0].description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-white border-white">
                  {criticalAlerts.length} Alert{criticalAlerts.length > 1 ? 's' : ''}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-red-700"
                  onClick={() => {
                    document.getElementById('weather-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={`container mx-auto px-4 py-6 ${criticalAlerts.length > 0 ? 'pt-20' : ''}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">
          {t('dashboard.subtitle')} {user?.name}
        </p>
        {settings.connectivity.lastSync && (
          <p className="text-xs text-muted-foreground mt-1">
            Last synced: {new Date(settings.connectivity.lastSync).toLocaleString()}
          </p>
        )}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card - spans 2 columns on larger screens */}
        <div id="weather-section">
          <WeatherCard />
        </div>
        
        {/* Quick Actions - spans 1 column */}
        <QuickActions />
        
        {/* Market Card - spans 2 columns on larger screens */}
        <MarketCard />
        
        {/* Crop Suggestions - spans 1 column */}
        <CropSuggestionsCard />
      </div>
      </div>
    </div>
  )
}

export default EnhancedDashboard