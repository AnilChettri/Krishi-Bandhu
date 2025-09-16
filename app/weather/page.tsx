"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CloudRain, Sun, Cloud, Wind, Droplets, Eye, ArrowLeft, AlertTriangle, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

interface WeatherData {
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
}

interface WeatherAlert {
  id: string
  type: "warning" | "watch" | "advisory"
  title: string
  description: string
  severity: "low" | "medium" | "high"
  validUntil: string
}

export default function WeatherPage() {
  const [selectedDay, setSelectedDay] = useState(0)

  const weatherAlerts: WeatherAlert[] = [
    {
      id: "1",
      type: "warning",
      title: "Heavy Rainfall Warning",
      description:
        "Heavy rainfall expected in the next 48 hours. Consider harvesting ready crops and protecting young plants.",
      severity: "high",
      validUntil: "2024-01-20 18:00",
    },
    {
      id: "2",
      type: "advisory",
      title: "High Wind Advisory",
      description: "Strong winds up to 45 km/h expected. Secure loose farming equipment and check crop supports.",
      severity: "medium",
      validUntil: "2024-01-19 12:00",
    },
  ]

  const weatherForecast: WeatherData[] = [
    {
      date: "2024-01-18",
      day: "Today",
      high: 28,
      low: 18,
      condition: "Heavy Rain",
      icon: "rain",
      humidity: 85,
      windSpeed: 15,
      rainfall: 25,
      visibility: 5,
    },
    {
      date: "2024-01-19",
      day: "Tomorrow",
      high: 26,
      low: 16,
      condition: "Cloudy",
      icon: "cloudy",
      humidity: 75,
      windSpeed: 12,
      rainfall: 5,
      visibility: 8,
    },
    {
      date: "2024-01-20",
      day: "Saturday",
      high: 30,
      low: 20,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      humidity: 65,
      windSpeed: 8,
      rainfall: 0,
      visibility: 10,
    },
    {
      date: "2024-01-21",
      day: "Sunday",
      high: 32,
      low: 22,
      condition: "Sunny",
      icon: "sunny",
      humidity: 55,
      windSpeed: 6,
      rainfall: 0,
      visibility: 12,
    },
    {
      date: "2024-01-22",
      day: "Monday",
      high: 29,
      low: 19,
      condition: "Light Rain",
      icon: "light-rain",
      humidity: 80,
      windSpeed: 10,
      rainfall: 8,
      visibility: 7,
    },
  ]

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "rain":
      case "Heavy Rain":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "light-rain":
      case "Light Rain":
        return <CloudRain className="h-8 w-8 text-blue-400" />
      case "sunny":
      case "Sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
      case "Cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "partly-cloudy":
      case "Partly Cloudy":
        return <Cloud className="h-8 w-8 text-gray-400" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-orange-200 bg-orange-50"
      case "low":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getAlertTextColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-800"
      case "medium":
        return "text-orange-800"
      case "low":
        return "text-yellow-800"
      default:
        return "text-gray-800"
    }
  }

  const selectedWeather = weatherForecast[selectedDay]

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
              <CloudRain className="h-6 w-6" />
              <h1 className="text-xl font-bold">Weather Forecast</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Location */}
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Ludhiana, Punjab</span>
          <Button variant="ghost" size="sm" className="text-xs">
            Change Location
          </Button>
        </div>

        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Weather Alerts
            </h2>
            {weatherAlerts.map((alert) => (
              <Alert key={alert.id} className={getAlertColor(alert.severity)}>
                <AlertTriangle className={`h-4 w-4 ${getAlertTextColor(alert.severity)}`} />
                <AlertDescription className={getAlertTextColor(alert.severity)}>
                  <div className="flex justify-between items-start mb-2">
                    <strong>{alert.title}</strong>
                    <Badge variant="outline" className="text-xs">
                      {alert.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="mb-2">{alert.description}</p>
                  <p className="text-xs">Valid until: {new Date(alert.validUntil).toLocaleString()}</p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Weather */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {selectedWeather.day} - {new Date(selectedWeather.date).toLocaleDateString()}
                </CardTitle>
                <CardDescription>Detailed weather information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(selectedWeather.icon)}
                    <div>
                      <div className="text-3xl font-bold">{selectedWeather.high}°C</div>
                      <div className="text-sm text-muted-foreground">
                        High: {selectedWeather.high}°C / Low: {selectedWeather.low}°C
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium">{selectedWeather.condition}</div>
                    {selectedWeather.rainfall > 0 && (
                      <div className="text-sm text-blue-600">Rainfall: {selectedWeather.rainfall}mm</div>
                    )}
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Droplets className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="font-semibold">{selectedWeather.humidity}%</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Wind className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                    <div className="text-sm text-muted-foreground">Wind Speed</div>
                    <div className="font-semibold">{selectedWeather.windSpeed} km/h</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <CloudRain className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                    <div className="text-sm text-muted-foreground">Rainfall</div>
                    <div className="font-semibold">{selectedWeather.rainfall}mm</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Eye className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                    <div className="text-sm text-muted-foreground">Visibility</div>
                    <div className="font-semibold">{selectedWeather.visibility}km</div>
                  </div>
                </div>

                {/* Farming Recommendations */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2">Farming Recommendations</h3>
                  <div className="text-sm text-green-700 space-y-1">
                    {selectedWeather.rainfall > 15 ? (
                      <>
                        <p>• Avoid field operations due to heavy rainfall</p>
                        <p>• Ensure proper drainage in fields</p>
                        <p>• Harvest ready crops before rain intensifies</p>
                      </>
                    ) : selectedWeather.rainfall > 5 ? (
                      <>
                        <p>• Light rain is good for crop growth</p>
                        <p>• Monitor for pest activity after rain</p>
                        <p>• Check irrigation needs may be reduced</p>
                      </>
                    ) : (
                      <>
                        <p>• Good weather for field operations</p>
                        <p>• Consider irrigation if soil is dry</p>
                        <p>• Ideal time for spraying if needed</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 5-Day Forecast */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
                <CardDescription>Extended weather outlook</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherForecast.map((day, index) => (
                    <div
                      key={day.date}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedDay === index ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedDay(index)}
                    >
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(day.icon)}
                        <div>
                          <div className="font-medium">{day.day}</div>
                          <div className="text-sm opacity-75">{day.condition}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{day.high}°</div>
                        <div className="text-sm opacity-75">{day.low}°</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weather Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Weather Tips</CardTitle>
                <CardDescription>Seasonal farming advice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <strong className="text-blue-800">Monsoon Season:</strong>
                    <p className="text-blue-700 mt-1">
                      Ensure proper drainage and watch for fungal diseases in high humidity.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <strong className="text-yellow-800">Summer Season:</strong>
                    <p className="text-yellow-700 mt-1">
                      Increase irrigation frequency and provide shade for sensitive crops.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <strong className="text-green-800">Winter Season:</strong>
                    <p className="text-green-700 mt-1">Protect crops from frost and adjust watering schedule.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
