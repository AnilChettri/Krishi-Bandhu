// Enhanced Mock Weather Data with Severe Conditions for Testing Alert System
export function getEnhancedMockWeatherData() {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const dayAfter = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
  
  // Simulate different severe weather scenarios
  const scenarios = [
    // Scenario 1: Extreme Heat Wave
    {
      name: 'Heat Wave',
      forecast: [
        {
          date: today.toISOString().split('T')[0],
          day: 'Today',
          high: 47, // Extreme heat - will trigger critical alert
          low: 32,
          condition: 'Clear',
          icon: 'sunny',
          humidity: 25,
          windSpeed: 15,
          rainfall: 0,
          visibility: 12,
          farmingRecommendations: [
            'AVOID all field operations during peak heat (10 AM - 4 PM)',
            'EMERGENCY cooling for livestock - provide shade and extra water',
            'INCREASE irrigation to maximum safe levels immediately'
          ]
        },
        {
          date: tomorrow.toISOString().split('T')[0],
          day: 'Tomorrow',
          high: 49, // Even more extreme
          low: 34,
          condition: 'Clear',
          icon: 'sunny',
          humidity: 20,
          windSpeed: 12,
          rainfall: 0,
          visibility: 10,
          farmingRecommendations: [
            'CRITICAL heat conditions - risk to crop survival',
            'EMERGENCY harvest of heat-sensitive crops if possible',
            'MONITOR workers for heat exhaustion symptoms'
          ]
        }
      ],
      alerts: [
        {
          id: 'extreme-heat-alert-1',
          type: 'emergency' as const,
          title: '🔥 EXTREME HEAT EMERGENCY - HEAT WAVE CONDITIONS',
          description: 'DANGEROUS heat wave with temperatures reaching 47-49°C over next 2 days. Life-threatening conditions for crops, livestock, and workers.',
          severity: 'critical' as const,
          validUntil: dayAfter.toISOString(),
          category: 'temperature' as const,
          impact: 'CATASTROPHIC heat stress. Widespread crop failure possible. Livestock mortality risk. Worker safety emergency.',
          recommendedActions: [
            'EVACUATE livestock to coolest available areas IMMEDIATELY',
            'EMERGENCY irrigation - run all systems at maximum capacity',
            'STOP all field operations between 8 AM - 6 PM',
            'MONITOR workers - provide cooling stations and frequent breaks',
            'HARVEST any ready crops during pre-dawn hours only',
            'ACTIVATE emergency cooling systems for greenhouses',
            'PREPARE for potential crop losses and livestock casualties',
            'STAY HYDRATED - drink water every 15 minutes'
          ]
        }
      ]
    },
    
    // Scenario 2: Severe Storm with Heavy Rain
    {
      name: 'Severe Storm',
      forecast: [
        {
          date: today.toISOString().split('T')[0],
          day: 'Today',
          high: 28,
          low: 22,
          condition: 'Thunderstorm',
          icon: 'rain',
          humidity: 95,
          windSpeed: 75, // Cyclonic winds - will trigger critical alert
          rainfall: 120, // Extreme rainfall - will trigger flood alert
          visibility: 2,
          farmingRecommendations: [
            'SEEK IMMEDIATE SHELTER - Do not venture outdoors',
            'SEVERE flooding and wind damage expected',
            'EMERGENCY: Secure all equipment and livestock NOW'
          ]
        },
        {
          date: tomorrow.toISOString().split('T')[0],
          day: 'Tomorrow',
          high: 25,
          low: 20,
          condition: 'Rain',
          icon: 'rain',
          humidity: 90,
          windSpeed: 45,
          rainfall: 80,
          visibility: 3,
          farmingRecommendations: [
            'Continue to avoid field operations',
            'Assess storm damage when safe to do so',
            'Check drainage systems for blockages'
          ]
        }
      ],
      alerts: [
        {
          id: 'severe-storm-alert-1',
          type: 'emergency' as const,
          title: '🌪️ EXTREME WEATHER EMERGENCY - SEVERE STORM',
          description: 'DANGEROUS storm system with 75+ km/h winds and 120mm+ rainfall. Flooding and severe damage expected.',
          severity: 'critical' as const,
          validUntil: dayAfter.toISOString(),
          category: 'storm' as const,
          impact: 'LIFE-THREATENING conditions. Severe flooding. Structural damage. Power outages expected.',
          recommendedActions: [
            'STAY INDOORS IMMEDIATELY - Do not travel',
            'EVACUATE low-lying areas if advised by authorities',
            'SECURE all loose objects, equipment, and vehicles NOW',
            'MOVE livestock to highest, most sheltered areas available',
            'PREPARE for extended power outages and communication loss',
            'MONITOR emergency broadcasts continuously',
            'AVOID flooded roads and areas - water may be deeper than it appears',
            'CHECK on neighbors and elderly community members if safe to do so'
          ]
        },
        {
          id: 'flood-alert-1',
          type: 'emergency' as const,
          title: '🌊 FLOOD EMERGENCY - IMMEDIATE EVACUATION RISK',
          description: 'EXTREME flooding risk with 120mm+ rainfall in 24 hours. Flash floods and river overflow expected.',
          severity: 'critical' as const,
          validUntil: dayAfter.toISOString(),
          category: 'flood' as const,
          impact: 'CATASTROPHIC flooding. Complete field submersion likely. Livestock and equipment at risk.',
          recommendedActions: [
            'EVACUATE animals from all low-lying areas IMMEDIATELY',
            'MOVE equipment to highest available ground NOW',
            'CLEAR drainage channels and remove blockages URGENTLY',
            'PREPARE sand bags if available for critical infrastructure',
            'IDENTIFY evacuation routes and emergency shelters',
            'DOCUMENT property with photos before flooding for insurance',
            'STOCK emergency supplies - food, water, medicine, fuel',
            'TURN OFF electricity in areas likely to flood'
          ]
        }
      ]
    },
    
    // Scenario 3: Severe Frost
    {
      name: 'Severe Frost',
      forecast: [
        {
          date: today.toISOString().split('T')[0],
          day: 'Today',
          high: 8,
          low: -7, // Severe frost - will trigger critical alert
          condition: 'Clear',
          icon: 'sunny',
          humidity: 80,
          windSpeed: 20,
          rainfall: 0,
          visibility: 12,
          farmingRecommendations: [
            'EMERGENCY frost protection measures required',
            'HARVEST all frost-sensitive crops IMMEDIATELY',
            'ACTIVATE heating systems for livestock and greenhouses'
          ]
        }
      ],
      alerts: [
        {
          id: 'severe-frost-alert-1',
          type: 'warning' as const,
          title: '❄️ SEVERE FROST EMERGENCY',
          description: 'SEVERE frost with temperatures dropping to -7°C. Major crop damage expected.',
          severity: 'critical' as const,
          validUntil: tomorrow.toISOString(),
          category: 'temperature' as const,
          impact: 'SEVERE crop damage expected. Young plants and tender growth will be killed.',
          recommendedActions: [
            'EMERGENCY harvest of all frost-sensitive crops if possible',
            'COVER vulnerable plants with blankets, tarps, or frost cloth',
            'RUN sprinkler systems overnight (ice formation protects plants)',
            'LIGHT smudge pots or activate heating systems',
            'MOVE potted plants indoors immediately',
            'PROTECT water pipes and irrigation systems from freezing',
            'PROVIDE extra shelter and heating for livestock',
            'MONITOR greenhouse temperatures - supplement heating as needed'
          ]
        }
      ]
    }
  ]
  
  // Randomly select a scenario, or cycle through them based on time
  const scenarioIndex = Math.floor(Date.now() / (1000 * 60 * 60)) % scenarios.length
  const selectedScenario = scenarios[scenarioIndex]
  
  return {
    location: {
      name: 'Ludhiana',
      country: 'IN',
      lat: 30.9010,
      lon: 75.8573
    },
    forecast: selectedScenario.forecast,
    alerts: selectedScenario.alerts,
    lastUpdated: new Date().toISOString(),
    source: 'enhanced-mock',
    scenario: selectedScenario.name
  }
}

// Function to get normal weather (for comparison)
export function getNormalMockWeatherData() {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  
  return {
    location: {
      name: 'Ludhiana',
      country: 'IN',
      lat: 30.9010,
      lon: 75.8573
    },
    forecast: [
      {
        date: today.toISOString().split('T')[0],
        day: 'Today',
        high: 28,
        low: 18,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy',
        humidity: 65,
        windSpeed: 12,
        rainfall: 0,
        visibility: 10,
        farmingRecommendations: [
          'Good weather for field operations',
          'Consider irrigation if soil moisture is low',
          'Ideal time for spraying if needed'
        ]
      },
      {
        date: tomorrow.toISOString().split('T')[0],
        day: 'Tomorrow',
        high: 30,
        low: 20,
        condition: 'Sunny',
        icon: 'sunny',
        humidity: 55,
        windSpeed: 8,
        rainfall: 0,
        visibility: 12,
        farmingRecommendations: [
          'Excellent conditions for harvesting',
          'Good visibility for precision operations',
          'Monitor irrigation needs in warm weather'
        ]
      }
    ],
    alerts: [],
    lastUpdated: new Date().toISOString(),
    source: 'normal-mock'
  }
}