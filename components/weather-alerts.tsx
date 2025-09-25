"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Zap,
  CloudRain,
  Wind,
  Thermometer,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WeatherAlert {
  id: string
  type: "warning" | "watch" | "advisory" | "emergency" | "extreme"
  title: string
  description: string
  severity: "low" | "medium" | "high" | "extreme" | "critical"
  validUntil: string
  category: "rain" | "wind" | "temperature" | "storm" | "flood" | "drought"
  impact: string
  recommendedActions: string[]
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[]
  onRefresh?: () => void
  className?: string
}

const getAlertIcon = (type: string, severity: string) => {
  if (severity === "critical" || severity === "extreme") {
    return <Zap className="h-6 w-6 animate-pulse" />
  }
  
  switch (type) {
    case "emergency":
    case "warning":
      return <AlertTriangle className="h-5 w-5" />
    case "watch":
      return <Eye className="h-5 w-5" />
    case "advisory":
      return <Clock className="h-5 w-5" />
    default:
      return <AlertTriangle className="h-5 w-5" />
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "rain":
    case "flood":
      return <CloudRain className="h-4 w-4" />
    case "wind":
    case "storm":
      return <Wind className="h-4 w-4" />
    case "temperature":
      return <Thermometer className="h-4 w-4" />
    case "drought":
      return <Thermometer className="h-4 w-4" />
    default:
      return <AlertTriangle className="h-4 w-4" />
  }
}

const getAlertStyles = (severity: string) => {
  switch (severity) {
    case "critical":
      return {
        container: "border-red-900 bg-red-950/90 backdrop-blur-sm shadow-lg shadow-red-900/50 animate-pulse",
        title: "text-red-100 font-bold",
        description: "text-red-200",
        badge: "bg-red-900 text-red-100 border-red-700",
        button: "bg-red-800 hover:bg-red-700 text-red-100"
      }
    case "extreme":
      return {
        container: "border-red-800 bg-red-900/90 backdrop-blur-sm shadow-lg shadow-red-800/50",
        title: "text-red-100 font-bold",
        description: "text-red-200",
        badge: "bg-red-800 text-red-100 border-red-600",
        button: "bg-red-700 hover:bg-red-600 text-red-100"
      }
    case "high":
      return {
        container: "border-orange-800 bg-orange-900/90 backdrop-blur-sm shadow-lg shadow-orange-800/50",
        title: "text-orange-100 font-bold",
        description: "text-orange-200",
        badge: "bg-orange-800 text-orange-100 border-orange-600",
        button: "bg-orange-700 hover:bg-orange-600 text-orange-100"
      }
    case "medium":
      return {
        container: "border-yellow-800 bg-yellow-900/90 backdrop-blur-sm shadow-lg shadow-yellow-800/50",
        title: "text-yellow-100 font-bold",
        description: "text-yellow-200",
        badge: "bg-yellow-800 text-yellow-100 border-yellow-600",
        button: "bg-yellow-700 hover:bg-yellow-600 text-yellow-100"
      }
    case "low":
      return {
        container: "border-blue-800 bg-blue-900/90 backdrop-blur-sm shadow-lg shadow-blue-800/50",
        title: "text-blue-100 font-bold",
        description: "text-blue-200",
        badge: "bg-blue-800 text-blue-100 border-blue-600",
        button: "bg-blue-700 hover:bg-blue-600 text-blue-100"
      }
    default:
      return {
        container: "border-gray-800 bg-gray-900/90 backdrop-blur-sm shadow-lg shadow-gray-800/50",
        title: "text-gray-100 font-bold",
        description: "text-gray-200",
        badge: "bg-gray-800 text-gray-100 border-gray-600",
        button: "bg-gray-700 hover:bg-gray-600 text-gray-100"
      }
  }
}

const getSeverityText = (severity: string) => {
  switch (severity) {
    case "critical":
      return "CRITICAL"
    case "extreme":
      return "EXTREME"
    case "high":
      return "HIGH"
    case "medium":
      return "MEDIUM"
    case "low":
      return "LOW"
    default:
      return "UNKNOWN"
  }
}

const getTimeUntil = (validUntil: string) => {
  const now = new Date()
  const until = new Date(validUntil)
  const diff = until.getTime() - now.getTime()
  
  if (diff <= 0) return "Expired"
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? 's' : ''}`
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  
  return `${minutes}m`
}

export default function WeatherAlerts({ alerts, onRefresh, className }: WeatherAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Auto-refresh every 5 minutes for critical alerts
  useEffect(() => {
    if (!autoRefresh) return
    
    const hasCriticalAlerts = alerts.some(
      alert => !dismissedAlerts.has(alert.id) && 
      (alert.severity === "critical" || alert.severity === "extreme")
    )
    
    if (!hasCriticalAlerts) return
    
    const interval = setInterval(() => {
      setLastRefresh(new Date())
      onRefresh?.()
    }, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [autoRefresh, alerts, dismissedAlerts, onRefresh])

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
  }

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id))
  
  if (visibleAlerts.length === 0) {
    return (
      <Card className={cn("bg-green-950/20 border-green-800/50", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-700">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">No active weather alerts</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort alerts by severity (critical first)
  const sortedAlerts = [...visibleAlerts].sort((a, b) => {
    const severityOrder = { critical: 5, extreme: 4, high: 3, medium: 2, low: 1 }
    return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder]
  })

  return (
    <div className={cn("space-y-4", className)}>
      {/* Alert Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-bold text-red-500">
            Weather Alerts ({visibleAlerts.length})
          </h3>
          {visibleAlerts.some(a => a.severity === "critical" || a.severity === "extreme") && (
            <Badge className="bg-red-900 text-red-100 animate-pulse">
              LIVE
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              "text-xs",
              autoRefresh ? "text-green-500" : "text-gray-500"
            )}
          >
            <RefreshCw className={cn("h-3 w-3 mr-1", autoRefresh && "animate-spin")} />
            Auto {autoRefresh ? "On" : "Off"}
          </Button>
          
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {sortedAlerts.map((alert) => {
          const styles = getAlertStyles(alert.severity)
          const timeUntil = getTimeUntil(alert.validUntil)
          
          return (
            <Alert
              key={alert.id}
              className={cn(
                "relative overflow-hidden border-2",
                styles.container,
                alert.severity === "critical" && "animate-pulse"
              )}
            >
              {/* Alert Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn("mt-0.5", styles.title)}>
                    {getAlertIcon(alert.type, alert.severity)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <AlertTitle className={cn("text-base", styles.title)}>
                        {alert.title}
                      </AlertTitle>
                      
                      <div className="flex items-center gap-1">
                        <Badge className={styles.badge}>
                          {getSeverityText(alert.severity)}
                        </Badge>
                        
                        <Badge variant="outline" className={styles.badge}>
                          {getCategoryIcon(alert.category)}
                          <span className="ml-1 capitalize">{alert.category}</span>
                        </Badge>
                        
                        <Badge variant="outline" className={styles.badge}>
                          <Clock className="h-3 w-3 mr-1" />
                          {timeUntil}
                        </Badge>
                      </div>
                    </div>
                    
                    <AlertDescription className={cn("text-sm", styles.description)}>
                      {alert.description}
                    </AlertDescription>
                    
                    {alert.impact && (
                      <div className={cn("text-xs p-2 rounded bg-black/20", styles.description)}>
                        <strong>Impact:</strong> {alert.impact}
                      </div>
                    )}
                    
                    {alert.recommendedActions.length > 0 && (
                      <div className="space-y-1">
                        <strong className={cn("text-xs", styles.description)}>Recommended Actions:</strong>
                        <ul className="text-xs space-y-1">
                          {alert.recommendedActions.map((action, index) => (
                            <li key={index} className={cn("flex items-start gap-1", styles.description)}>
                              <span className="mt-1">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(alert.id)}
                  className={cn(
                    "h-6 w-6 p-0 hover:bg-black/20",
                    styles.description
                  )}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Alert Footer */}
              <div className={cn("text-xs mt-2 pt-2 border-t border-black/20", styles.description)}>
                Valid until: {new Date(alert.validUntil).toLocaleString()}
              </div>
              
              {/* Critical Alert Animation */}
              {(alert.severity === "critical" || alert.severity === "extreme") && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse pointer-events-none" />
              )}
            </Alert>
          )
        })}
      </div>
    </div>
  )
}
