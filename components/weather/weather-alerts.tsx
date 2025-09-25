'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context'
import { 
  AlertTriangle, 
  Cloud, 
  CloudRain, 
  Zap, 
  Wind, 
  Snowflake, 
  Sun, 
  Eye,
  X,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react'

export interface WeatherAlert {
  id: string
  type: 'warning' | 'watch' | 'advisory' | 'emergency' | 'extreme'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'extreme' | 'critical'
  validUntil: string
  category: 'rain' | 'wind' | 'temperature' | 'storm' | 'flood' | 'drought'
  impact: string
  recommendedActions: string[]
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[]
  onDismiss?: (alertId: string) => void
  enableSound?: boolean
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ 
  alerts, 
  onDismiss,
  enableSound = true 
}) => {
  const { t } = useLanguage()
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [soundEnabled, setSoundEnabled] = useState(enableSound)
  const [hasPlayedAlert, setHasPlayedAlert] = useState(false)

  // Filter out dismissed alerts
  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id))
  
  // Get critical and extreme alerts for special treatment
  const criticalAlerts = visibleAlerts.filter(alert => 
    alert.severity === 'critical' || alert.severity === 'extreme'
  )

  const highAlerts = visibleAlerts.filter(alert => alert.severity === 'high')
  const mediumAlerts = visibleAlerts.filter(alert => alert.severity === 'medium')

  // Play alert sound for critical/extreme alerts
  useEffect(() => {
    if (criticalAlerts.length > 0 && soundEnabled && !hasPlayedAlert) {
      // Play alert sound (you can replace this with actual audio)
      const playAlertSound = () => {
        try {
          // Create audio context for alert sound
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.value = 800
          oscillator.type = 'sine'
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime)
          gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1)
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.5)
        } catch (error) {
          console.log('Audio not available')
        }
      }
      
      playAlertSound()
      setHasPlayedAlert(true)
      
      // Reset after 5 minutes
      setTimeout(() => setHasPlayedAlert(false), 5 * 60 * 1000)
    }
  }, [criticalAlerts.length, soundEnabled, hasPlayedAlert])

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId))
    onDismiss?.(alertId)
  }

  const getAlertIcon = (category: string) => {
    switch (category) {
      case 'rain': return <CloudRain className="h-5 w-5" />
      case 'storm': return <Zap className="h-5 w-5" />
      case 'wind': return <Wind className="h-5 w-5" />
      case 'flood': return <Cloud className="h-5 w-5" />
      case 'temperature': return <Sun className="h-5 w-5" />
      case 'drought': return <Sun className="h-5 w-5" />
      default: return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'extreme':
        return 'destructive'
      case 'high':
        return 'default'
      case 'medium':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (visibleAlerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Critical/Extreme Alerts - Full Screen Overlay for Critical */}
      {criticalAlerts.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-red-500 shadow-2xl animate-pulse">
            <CardHeader className="bg-red-500 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <AlertTriangle className="h-6 w-6 animate-bounce" />
                  🚨 CRITICAL WEATHER ALERT
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-white hover:bg-red-600"
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(criticalAlerts[0].id)}
                    className="text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse text-red-500">
                      {getAlertIcon(alert.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-red-600">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Valid until: {new Date(alert.validUntil).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">{alert.description}</p>
                    <p className="text-sm text-red-700 mb-3">
                      <strong>Impact:</strong> {alert.impact}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">🚨 Immediate Actions Required:</h4>
                      <ul className="text-sm space-y-1">
                        {alert.recommendedActions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* High Priority Alerts - Blinking Cards */}
      {highAlerts.length > 0 && (
        <div className="space-y-3">
          {highAlerts.map((alert) => (
            <Alert 
              key={alert.id} 
              className="border-orange-500 bg-orange-50 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="animate-bounce text-orange-500">
                    {getAlertIcon(alert.category)}
                  </div>
                  <div className="flex-1">
                    <AlertTitle className="text-orange-700 flex items-center gap-2">
                      {alert.title}
                      <Badge variant="destructive" className="animate-pulse">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="text-orange-600 mt-1">
                      {alert.description}
                    </AlertDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(alert.id)}
                  className="text-orange-500 hover:bg-orange-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Expandable Actions */}
              <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                <h4 className="font-semibold text-sm text-orange-700 mb-2">
                  ⚠️ Recommended Actions:
                </h4>
                <ul className="text-sm text-orange-600 space-y-1">
                  {alert.recommendedActions.slice(0, 3).map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Medium Priority Alerts - Standard Cards */}
      {mediumAlerts.length > 0 && (
        <div className="space-y-2">
          {mediumAlerts.map((alert) => (
            <Alert key={alert.id} className="border-yellow-400 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-yellow-600">
                    {getAlertIcon(alert.category)}
                  </div>
                  <div>
                    <AlertTitle className="text-yellow-700 flex items-center gap-2">
                      {alert.title}
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="text-yellow-600 text-sm">
                      {alert.description}
                    </AlertDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(alert.id)}
                  className="text-yellow-600 hover:bg-yellow-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Alert Summary */}
      {visibleAlerts.length > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>
              {visibleAlerts.length} active weather alerts • 
              {criticalAlerts.length > 0 && ` ${criticalAlerts.length} critical • `}
              {highAlerts.length > 0 && ` ${highAlerts.length} high priority`}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissedAlerts(new Set(alerts.map(a => a.id)))}
          >
            Dismiss All
          </Button>
        </div>
      )}
    </div>
  )
}

export default WeatherAlerts

// CSS animations (add to your global CSS or Tailwind config)
export const weatherAlertStyles = `
  @keyframes critical-pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
    }
    50% {
      transform: scale(1.02);
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
    }
  }

  @keyframes warning-blink {
    0%, 50% {
      background-color: rgba(251, 146, 60, 0.1);
      border-color: rgb(251, 146, 60);
    }
    25%, 75% {
      background-color: rgba(251, 146, 60, 0.2);
      border-color: rgb(234, 88, 12);
    }
  }

  .critical-alert {
    animation: critical-pulse 2s infinite ease-in-out;
  }

  .warning-alert {
    animation: warning-blink 3s infinite ease-in-out;
  }
`