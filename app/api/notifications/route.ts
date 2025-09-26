import { NextRequest, NextResponse } from 'next/server'
import SmartNotificationService, { type AlertSubscription } from '@/lib/smart-notification-service'
import PunjabLocationService from '@/lib/punjab-location-service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))
  const district = searchParams.get('district')
  const crops = searchParams.get('crops')?.split(',') || []
  const type = searchParams.get('type') // 'all', 'critical', 'weather', 'market', 'scheme'

  console.log('🔔 Smart Notifications API request:', { lat, lon, district, crops, type })

  try {
    // Default subscription for demo (in real app, this would come from user profile)
    const defaultSubscription: AlertSubscription = {
      userId: 'demo-user',
      location: {
        district: district || 'Ludhiana',
        coordinates: { 
          lat: lat || 30.9010, 
          lon: lon || 75.8573 
        }
      },
      preferences: {
        weatherAlerts: true,
        marketAlerts: true,
        schemeAlerts: true,
        seasonalReminders: true,
        emergencyAlerts: true
      },
      crops: crops.length > 0 ? crops : ['Rice', 'Wheat', 'Cotton'],
      farmSize: 'small',
      language: 'en'
    }

    let notifications: any[] = []

    switch (type) {
      case 'critical':
        notifications = SmartNotificationService.getCriticalAlerts({ lat: defaultSubscription.location.coordinates.lat, lon: defaultSubscription.location.coordinates.lon })
        break
      case 'weather':
        const district_info = PunjabLocationService.findNearestDistrict(defaultSubscription.location.coordinates)
        if (district_info) {
          const weatherData = { forecast: [{ rainfall: 75, high: 42, low: 28 }] } // Mock data
          notifications = SmartNotificationService.generateWeatherAlerts(weatherData, district_info)
        }
        break
      case 'market':
        const marketData = {
          crops: defaultSubscription.crops.map(crop => ({
            name: crop,
            currentPrice: Math.floor(Math.random() * 3000) + 2000,
            priceChange: (Math.random() * 30) - 15 // Random change between -15% to +15%
          }))
        }
        notifications = SmartNotificationService.generateMarketAlerts(marketData, defaultSubscription.crops)
        break
      case 'scheme':
        const districtInfo = PunjabLocationService.findNearestDistrict(defaultSubscription.location.coordinates)
        notifications = SmartNotificationService.generateSchemeAlerts(districtInfo)
        break
      case 'seasonal':
        notifications = SmartNotificationService.generateSeasonalReminders()
        break
      default:
        notifications = SmartNotificationService.getPersonalizedNotifications(defaultSubscription)
    }

    // Add location context
    const locationContext = PunjabLocationService.findNearestDistrict(defaultSubscription.location.coordinates)

    console.log(`✅ Generated ${notifications.length} notifications for type: ${type || 'all'}`)

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        locationContext: {
          district: locationContext?.name,
          agriZone: locationContext?.agriZone,
          isInPunjab: PunjabLocationService.isInPunjab(defaultSubscription.location.coordinates)
        },
        subscription: {
          crops: defaultSubscription.crops,
          preferences: defaultSubscription.preferences
        },
        summary: {
          total: notifications.length,
          critical: notifications.filter(n => n.priority === 'critical').length,
          high: notifications.filter(n => n.priority === 'high').length,
          urgent: notifications.filter(n => n.timing?.isUrgent).length
        },
        lastUpdated: new Date().toISOString()
      },
      source: 'smart-notification-service'
    })

  } catch (error) {
    console.error('❌ Notifications API error:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications',
      data: {
        notifications: [],
        locationContext: null,
        summary: { total: 0, critical: 0, high: 0, urgent: 0 }
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, userId, action } = body

    console.log('🔔 Notification action:', { notificationId, userId, action })

    switch (action) {
      case 'mark_read':
        const success = SmartNotificationService.markAsRead(notificationId, userId)
        return NextResponse.json({ success })
        
      case 'dismiss':
        // Implementation would handle dismissing notification
        return NextResponse.json({ success: true, message: 'Notification dismissed' })
        
      case 'emergency_action':
        // Handle emergency notification actions
        return NextResponse.json({ 
          success: true, 
          message: 'Emergency action processed',
          redirectUrl: '/emergency-response'
        })
        
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Unknown action' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('❌ Notification action error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process notification action'
    }, { status: 500 })
  }
}