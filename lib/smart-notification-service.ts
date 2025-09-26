// Smart Notification and Alert System for Punjab Farmers
// Integrates weather, market, schemes, and seasonal farming activities

import PunjabSchemesService from './punjab-schemes-service'
import PunjabLocationService, { type PunjabDistrict } from './punjab-location-service'

export interface SmartNotification {
  id: string
  title: string
  message: string
  type: 'weather' | 'market' | 'scheme' | 'seasonal' | 'emergency' | 'advisory'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  location?: {
    districts: string[]
    zones: string[]
    isStatewide: boolean
  }
  timing: {
    created: Date
    validUntil: Date
    isUrgent: boolean
  }
  actions?: {
    label: string
    action: string
    url?: string
  }[]
  metadata: {
    source: string
    relevantCrops?: string[]
    weatherConditions?: string[]
    targetFarmers?: string[]
  }
}

export interface AlertSubscription {
  userId: string
  location: {
    district: string
    coordinates: { lat: number; lon: number }
  }
  preferences: {
    weatherAlerts: boolean
    marketAlerts: boolean
    schemeAlerts: boolean
    seasonalReminders: boolean
    emergencyAlerts: boolean
  }
  crops: string[]
  farmSize: 'small' | 'medium' | 'large'
  language: 'en' | 'hi' | 'pa'
}

// Core notification service
export class SmartNotificationService {
  private static notifications: SmartNotification[] = []
  
  // Generate weather-based agricultural alerts
  static generateWeatherAlerts(weatherData: any, district: PunjabDistrict): SmartNotification[] {
    const alerts: SmartNotification[] = []
    const now = new Date()
    
    // Rain alert for farming activities
    if (weatherData?.forecast?.[0]?.rainfall > 50) {
      alerts.push({
        id: `weather-rain-${district.id}-${now.getTime()}`,
        title: 'Heavy Rain Alert',
        message: `Heavy rainfall (${weatherData.forecast[0].rainfall}mm) expected. Postpone spraying activities and prepare drainage.`,
        type: 'weather',
        priority: 'high',
        category: 'farming-activity',
        location: {
          districts: [district.name],
          zones: [district.agriZone],
          isStatewide: false
        },
        timing: {
          created: now,
          validUntil: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          isUrgent: true
        },
        actions: [
          { label: 'View Precautions', action: 'open_guidelines', url: '/weather-guidelines' }
        ],
        metadata: {
          source: 'weather-service',
          relevantCrops: district.majorCrops,
          weatherConditions: ['heavy_rain'],
          targetFarmers: ['all']
        }
      })
    }
    
    // Temperature alert
    if (weatherData?.forecast?.[0]?.high > 42) {
      alerts.push({
        id: `weather-heat-${district.id}-${now.getTime()}`,
        title: 'Heat Wave Warning',
        message: `Extreme heat (${weatherData.forecast[0].high}°C) expected. Increase irrigation frequency and provide shade for livestock.`,
        type: 'weather',
        priority: 'high',
        category: 'heat-stress',
        location: {
          districts: [district.name],
          zones: [district.agriZone],
          isStatewide: false
        },
        timing: {
          created: now,
          validUntil: new Date(now.getTime() + 48 * 60 * 60 * 1000),
          isUrgent: true
        },
        actions: [
          { label: 'Heat Management Tips', action: 'open_guidelines', url: '/heat-management' }
        ],
        metadata: {
          source: 'weather-service',
          weatherConditions: ['extreme_heat'],
          targetFarmers: ['all']
        }
      })
    }
    
    return alerts
  }
  
  // Generate market price alerts
  static generateMarketAlerts(marketData: any, userCrops: string[]): SmartNotification[] {
    const alerts: SmartNotification[] = []
    const now = new Date()
    
    if (marketData?.crops) {
      marketData.crops.forEach((crop: any) => {
        if (userCrops.includes(crop.name)) {
          // Price increase alert
          if (crop.priceChange > 10) {
            alerts.push({
              id: `market-price-up-${crop.name}-${now.getTime()}`,
              title: `${crop.name} Price Surge`,
              message: `${crop.name} prices increased by ${crop.priceChange}% to ₹${crop.currentPrice}/quintal. Consider selling if you have stock.`,
              type: 'market',
              priority: 'medium',
              category: 'price-increase',
              timing: {
                created: now,
                validUntil: new Date(now.getTime() + 72 * 60 * 60 * 1000),
                isUrgent: false
              },
              actions: [
                { label: 'View Market', action: 'open_market', url: '/market-info' },
                { label: 'Find Buyers', action: 'find_buyers', url: '/connect-buyers' }
              ],
              metadata: {
                source: 'market-service',
                relevantCrops: [crop.name],
                targetFarmers: ['producers']
              }
            })
          }
          
          // Price drop alert
          if (crop.priceChange < -15) {
            alerts.push({
              id: `market-price-down-${crop.name}-${now.getTime()}`,
              title: `${crop.name} Price Drop`,
              message: `${crop.name} prices dropped by ${Math.abs(crop.priceChange)}%. Hold stock if possible or explore value addition.`,
              type: 'market',
              priority: 'medium',
              category: 'price-decrease',
              timing: {
                created: now,
                validUntil: new Date(now.getTime() + 72 * 60 * 60 * 1000),
                isUrgent: false
              },
              actions: [
                { label: 'Storage Tips', action: 'storage_guide', url: '/storage-guide' },
                { label: 'Value Addition', action: 'value_addition', url: '/value-addition' }
              ],
              metadata: {
                source: 'market-service',
                relevantCrops: [crop.name],
                targetFarmers: ['producers']
              }
            })
          }
        }
      })
    }
    
    return alerts
  }
  
  // Generate seasonal farming reminders
  static generateSeasonalReminders(): SmartNotification[] {
    const alerts: SmartNotification[] = []
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    
    // Kharif season reminders
    if (month === 5 && day >= 15) { // Mid May
      alerts.push({
        id: `seasonal-kharif-prep-${now.getTime()}`,
        title: 'Kharif Season Preparation',
        message: 'Start preparing for Kharif sowing. Check seed availability, soil health, and irrigation systems.',
        type: 'seasonal',
        priority: 'medium',
        category: 'season-preparation',
        location: { districts: [], zones: [], isStatewide: true },
        timing: {
          created: now,
          validUntil: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
          isUrgent: false
        },
        actions: [
          { label: 'Kharif Guide', action: 'open_guide', url: '/kharif-guide' },
          { label: 'Soil Testing', action: 'soil_test', url: '/soil-testing' }
        ],
        metadata: {
          source: 'seasonal-service',
          relevantCrops: ['Rice', 'Cotton', 'Maize', 'Sugarcane'],
          targetFarmers: ['all']
        }
      })
    }
    
    // Rabi season reminders  
    if (month === 10 && day >= 15) { // Mid October
      alerts.push({
        id: `seasonal-rabi-prep-${now.getTime()}`,
        title: 'Rabi Season Starting',
        message: 'Time for Rabi sowing. Prepare wheat fields and check for quality seeds.',
        type: 'seasonal',
        priority: 'medium',
        category: 'season-preparation',
        location: { districts: [], zones: [], isStatewide: true },
        timing: {
          created: now,
          validUntil: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
          isUrgent: false
        },
        actions: [
          { label: 'Rabi Guide', action: 'open_guide', url: '/rabi-guide' },
          { label: 'Seed Varieties', action: 'seed_guide', url: '/seed-varieties' }
        ],
        metadata: {
          source: 'seasonal-service',
          relevantCrops: ['Wheat', 'Barley', 'Mustard', 'Gram'],
          targetFarmers: ['all']
        }
      })
    }
    
    // MSP procurement reminders
    if ((month === 4 && day >= 1) || month === 5) { // April-May for wheat
      alerts.push({
        id: `seasonal-wheat-msp-${now.getTime()}`,
        title: 'Wheat MSP Procurement Active',
        message: 'Wheat procurement at MSP rates is now active. Visit nearest procurement center with quality produce.',
        type: 'scheme',
        priority: 'high',
        category: 'msp-procurement',
        location: { districts: [], zones: [], isStatewide: true },
        timing: {
          created: now,
          validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          isUrgent: true
        },
        actions: [
          { label: 'Find MSP Centers', action: 'msp_centers', url: '/msp-centers' },
          { label: 'Quality Parameters', action: 'quality_guide', url: '/quality-parameters' }
        ],
        metadata: {
          source: 'scheme-service',
          relevantCrops: ['Wheat'],
          targetFarmers: ['wheat-producers']
        }
      })
    }
    
    return alerts
  }
  
  // Generate government scheme alerts
  static generateSchemeAlerts(district?: PunjabDistrict): SmartNotification[] {
    const alerts: SmartNotification[] = []
    const now = new Date()
    const schemes = PunjabSchemesService.getActiveSchemes()
    
    // Check for schemes with upcoming deadlines
    schemes.forEach(scheme => {
      if (scheme.applicationDeadline) {
        const deadline = new Date(scheme.applicationDeadline)
        const daysUntilDeadline = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysUntilDeadline <= 15 && daysUntilDeadline > 0) {
          alerts.push({
            id: `scheme-deadline-${scheme.id}-${now.getTime()}`,
            title: `${scheme.name} - Application Deadline Soon`,
            message: `Only ${daysUntilDeadline} days left to apply for ${scheme.name}. Don't miss out on benefits up to ₹${scheme.maxBenefitAmount || scheme.subsidyAmount}.`,
            type: 'scheme',
            priority: daysUntilDeadline <= 7 ? 'high' : 'medium',
            category: 'scheme-deadline',
            location: district ? { 
              districts: [district.name], 
              zones: [district.agriZone], 
              isStatewide: false 
            } : { districts: [], zones: [], isStatewide: true },
            timing: {
              created: now,
              validUntil: deadline,
              isUrgent: daysUntilDeadline <= 7
            },
            actions: [
              { label: 'Apply Now', action: 'apply_scheme', url: scheme.contactDetails.website },
              { label: 'Check Eligibility', action: 'check_eligibility', url: '/eligibility-check' }
            ],
            metadata: {
              source: 'scheme-service',
              targetFarmers: scheme.targetBeneficiaries
            }
          })
        }
      }
    })
    
    return alerts
  }
  
  // Generate emergency alerts
  static generateEmergencyAlerts(alertType: 'pest' | 'disease' | 'natural_disaster', details: any): SmartNotification {
    const now = new Date()
    
    return {
      id: `emergency-${alertType}-${now.getTime()}`,
      title: `Emergency: ${alertType.charAt(0).toUpperCase() + alertType.slice(1)} Alert`,
      message: details.message,
      type: 'emergency',
      priority: 'critical',
      category: alertType,
      location: details.location || { districts: [], zones: [], isStatewide: true },
      timing: {
        created: now,
        validUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        isUrgent: true
      },
      actions: [
        { label: 'Emergency Guidelines', action: 'emergency_guide', url: '/emergency-response' },
        { label: 'Contact Helpline', action: 'call_helpline', url: 'tel:1800-180-1551' }
      ],
      metadata: {
        source: 'emergency-service',
        relevantCrops: details.affectedCrops || [],
        targetFarmers: ['all']
      }
    }
  }
  
  // Get personalized notifications for user
  static getPersonalizedNotifications(subscription: AlertSubscription): SmartNotification[] {
    const allNotifications: SmartNotification[] = []
    const district = PunjabLocationService.findNearestDistrict(subscription.location.coordinates)
    
    // Weather alerts if enabled
    if (subscription.preferences.weatherAlerts && district) {
      // Would integrate with actual weather service
      const mockWeatherData = { forecast: [{ rainfall: 75, high: 45, low: 28 }] }
      allNotifications.push(...this.generateWeatherAlerts(mockWeatherData, district))
    }
    
    // Market alerts if enabled
    if (subscription.preferences.marketAlerts) {
      const mockMarketData = {
        crops: subscription.crops.map(crop => ({
          name: crop,
          currentPrice: 2500,
          priceChange: Math.random() * 30 - 15 // Random price change for demo
        }))
      }
      allNotifications.push(...this.generateMarketAlerts(mockMarketData, subscription.crops))
    }
    
    // Seasonal reminders if enabled
    if (subscription.preferences.seasonalReminders) {
      allNotifications.push(...this.generateSeasonalReminders())
    }
    
    // Scheme alerts if enabled
    if (subscription.preferences.schemeAlerts) {
      allNotifications.push(...this.generateSchemeAlerts(district))
    }
    
    // Always include emergency alerts
    // allNotifications.push(...this.getActiveEmergencyAlerts())
    
    // Filter by location relevance and sort by priority
    return allNotifications
      .filter(notification => 
        notification.location?.isStatewide || 
        notification.location?.districts.includes(subscription.location.district) ||
        notification.type === 'emergency'
      )
      .sort((a, b) => {
        const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
  }
  
  // Get critical alerts only
  static getCriticalAlerts(location?: { lat: number; lon: number }): SmartNotification[] {
    return this.notifications.filter(alert => 
      alert.priority === 'critical' || 
      (alert.priority === 'high' && alert.timing.isUrgent)
    )
  }
  
  // Mark notification as read
  static markAsRead(notificationId: string, userId: string): boolean {
    // Implementation would update database
    console.log(`Notification ${notificationId} marked as read for user ${userId}`)
    return true
  }
  
  // Schedule recurring seasonal notifications
  static scheduleSeasonalNotifications(): void {
    // Implementation would set up cron jobs or scheduled tasks
    console.log('Seasonal notification scheduler initialized')
  }
}

export default SmartNotificationService