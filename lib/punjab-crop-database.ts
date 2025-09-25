// Punjab-Specific Crop Database with Comprehensive Agricultural Data
// Based on Punjab Agricultural University (PAU) recommendations

export interface PunjabCropData {
  id: string
  cropName: string
  localName: {
    english: string
    punjabi: string
    hindi: string
  }
  variety: string
  category: 'cereals' | 'vegetables' | 'fruits' | 'cash_crops' | 'fodder' | 'oilseeds' | 'pulses'
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Year-round'
  sowingPeriod: {
    start: string
    end: string
    optimal: string
  }
  harvestPeriod: {
    start: string
    end: string
  }
  duration: number // days
  expectedYield: {
    min: number
    max: number
    average: number
    unit: string
  }
  profitability: {
    investmentCost: number
    expectedRevenue: number
    profit: number
    profitMargin: number
    roi: number
    paybackPeriod: number // months
  }
  suitability: {
    soilTypes: string[]
    climateConditions: string[]
    waterRequirement: 'low' | 'medium' | 'high' | 'very-high'
    difficulty: 'easy' | 'medium' | 'hard'
    suitabilityScore: number
    zones: string[] // Punjab agro-climatic zones
  }
  marketInfo: {
    currentPrice: {
      min: number
      max: number
      average: number
      unit: string
    }
    demandLevel: 'low' | 'medium' | 'high' | 'very-high'
    marketTrend: 'rising' | 'stable' | 'falling'
    exportPotential: boolean
    mspSupport: boolean // Minimum Support Price
  }
  requirements: {
    seedRate: {
      quantity: string
      cost: number
    }
    fertilizers: Array<{
      name: string
      quantity: string
      applicationTime: string
      cost: number
    }>
    irrigation: {
      method: string
      frequency: string
      totalWater: string
    }
    labor: {
      preparationHours: number
      sowingHours: number
      maintenanceHours: number
      harvestHours: number
      totalHours: number
      cost: number
    }
  }
  practicalAdvice: {
    tips: string[]
    criticalPeriods: Array<{
      period: string
      activities: string[]
    }>
    commonMistakes: string[]
    successFactors: string[]
  }
  risks: {
    diseases: Array<{
      name: string
      symptoms: string
      prevention: string
    }>
    pests: Array<{
      name: string
      damage: string
      control: string
    }>
    weatherRisks: string[]
    marketRisks: string[]
  }
  benefits: {
    economic: string[]
    environmental: string[]
    nutritional: string[]
    social: string[]
  }
  compatibility: {
    cropRotation: string[]
    intercropping: string[]
    avoid: string[]
  }
}

export const punjabCropDatabase: PunjabCropData[] = [
  // CEREALS
  {
    id: 'pun-001',
    cropName: 'Rice',
    localName: {
      english: 'Rice',
      punjabi: 'ਝੋਨਾ',
      hindi: 'चावल'
    },
    variety: 'Basmati 1509',
    category: 'cereals',
    season: 'Kharif',
    sowingPeriod: {
      start: 'June 10',
      end: 'July 15',
      optimal: 'June 15-30'
    },
    harvestPeriod: {
      start: 'October 15',
      end: 'November 15'
    },
    duration: 125,
    expectedYield: {
      min: 35,
      max: 55,
      average: 45,
      unit: 'quintal/hectare'
    },
    profitability: {
      investmentCost: 40000,
      expectedRevenue: 135000,
      profit: 95000,
      profitMargin: 70.4,
      roi: 237.5,
      paybackPeriod: 5
    },
    suitability: {
      soilTypes: ['Alluvial clay', 'Clay loam', 'Heavy clay'],
      climateConditions: ['High humidity (80-85%)', 'Temperature 20-35°C', 'Monsoon dependent'],
      waterRequirement: 'very-high',
      difficulty: 'medium',
      suitabilityScore: 92,
      zones: ['Central Punjab', 'Eastern Punjab', 'South-Western Punjab']
    },
    marketInfo: {
      currentPrice: {
        min: 2800,
        max: 3500,
        average: 3000,
        unit: '₹/quintal'
      },
      demandLevel: 'very-high',
      marketTrend: 'stable',
      exportPotential: true,
      mspSupport: true
    },
    requirements: {
      seedRate: {
        quantity: '25-30 kg/hectare',
        cost: 3000
      },
      fertilizers: [
        {
          name: 'Urea',
          quantity: '200-250 kg/hectare',
          applicationTime: 'Split application: 50% basal, 25% tillering, 25% panicle initiation',
          cost: 8000
        },
        {
          name: 'DAP',
          quantity: '125 kg/hectare',
          applicationTime: 'Basal application',
          cost: 4500
        },
        {
          name: 'Potash (MOP)',
          quantity: '60 kg/hectare',
          applicationTime: 'Basal application',
          cost: 2000
        }
      ],
      irrigation: {
        method: 'Flood irrigation / DSR (Direct Seeded Rice)',
        frequency: '2-3 cm standing water throughout growing period',
        totalWater: '1200-1500 mm'
      },
      labor: {
        preparationHours: 40,
        sowingHours: 60,
        maintenanceHours: 120,
        harvestHours: 80,
        totalHours: 300,
        cost: 18000
      }
    },
    practicalAdvice: {
      tips: [
        'Use certified seeds for better quality and yield',
        'Transplant 21-25 day old seedlings for optimal growth',
        'Maintain 2-3 cm water level, drain 10 days before harvest',
        'Apply zinc sulphate if deficiency symptoms appear',
        'Use laser land leveling for uniform water distribution'
      ],
      criticalPeriods: [
        {
          period: 'Transplanting (June 15-July 15)',
          activities: ['Prepare main field', 'Transplant healthy seedlings', 'Apply basal fertilizers']
        },
        {
          period: 'Tillering stage (July 20-August 20)',
          activities: ['Apply first top dressing of urea', 'Maintain water level', 'Weed control']
        },
        {
          period: 'Panicle initiation (August 25-September 10)',
          activities: ['Apply second urea dose', 'Monitor for pests', 'Ensure adequate water']
        }
      ],
      commonMistakes: [
        'Delayed transplanting reduces yield significantly',
        'Over-flooding leads to lodging and root rot',
        'Ignoring zinc deficiency in alkaline soils',
        'Harvesting too early or too late affects quality'
      ],
      successFactors: [
        'Timely transplanting with healthy seedlings',
        'Balanced fertilization based on soil test',
        'Proper water management throughout crop cycle',
        'Integrated pest and disease management'
      ]
    },
    risks: {
      diseases: [
        {
          name: 'Bacterial Leaf Blight',
          symptoms: 'Water-soaked lesions on leaf tips and margins',
          prevention: 'Use resistant varieties, avoid excess nitrogen, spray Streptocycline'
        },
        {
          name: 'Brown Spot',
          symptoms: 'Small brown spots on leaves and grains',
          prevention: 'Seed treatment with fungicides, balanced fertilization'
        }
      ],
      pests: [
        {
          name: 'Brown Plant Hopper',
          damage: 'Yellowing and drying of plants, transmit viral diseases',
          control: 'Use resistant varieties, spray Imidacloprid or Thiamethoxam'
        },
        {
          name: 'Stem Borer',
          damage: 'Dead heart in vegetative stage, white ear in reproductive stage',
          control: 'Use pheromone traps, spray Chlorantraniliprole'
        }
      ],
      weatherRisks: ['Late monsoon affecting transplanting', 'Heavy rains during harvest', 'Hailstorms'],
      marketRisks: ['Price fluctuation during peak harvest', 'Quality premium variations', 'Export restrictions']
    },
    benefits: {
      economic: ['High market value for Basmati', 'MSP guarantee', 'Export earnings'],
      environmental: ['Carbon sequestration in flooded fields', 'Biodiversity in rice ecosystems'],
      nutritional: ['Staple food security', 'Source of carbohydrates', 'Gluten-free option'],
      social: ['Employment generation', 'Traditional farming system', 'Cultural significance']
    },
    compatibility: {
      cropRotation: ['Wheat', 'Potato', 'Berseem', 'Mustard'],
      intercropping: ['Generally not recommended due to water requirements'],
      avoid: ['Sugarcane (water competition)', 'Cotton (different water needs)']
    }
  },

  {
    id: 'pun-002',
    cropName: 'Wheat',
    localName: {
      english: 'Wheat',
      punjabi: 'ਕਣਕ',
      hindi: 'गेहूं'
    },
    variety: 'HD 3086',
    category: 'cereals',
    season: 'Rabi',
    sowingPeriod: {
      start: 'November 1',
      end: 'December 15',
      optimal: 'November 10-25'
    },
    harvestPeriod: {
      start: 'April 10',
      end: 'May 5'
    },
    duration: 145,
    expectedYield: {
      min: 45,
      max: 65,
      average: 55,
      unit: 'quintal/hectare'
    },
    profitability: {
      investmentCost: 32000,
      expectedRevenue: 110000,
      profit: 78000,
      profitMargin: 70.9,
      roi: 243.8,
      paybackPeriod: 5
    },
    suitability: {
      soilTypes: ['Loam', 'Clay loam', 'Sandy loam', 'Alluvial'],
      climateConditions: ['Cool winters (10-15°C)', 'Moderate rainfall', 'Clear sunny days during grain filling'],
      waterRequirement: 'medium',
      difficulty: 'easy',
      suitabilityScore: 95,
      zones: ['All zones of Punjab']
    },
    marketInfo: {
      currentPrice: {
        min: 1950,
        max: 2200,
        average: 2000,
        unit: '₹/quintal'
      },
      demandLevel: 'very-high',
      marketTrend: 'stable',
      exportPotential: true,
      mspSupport: true
    },
    requirements: {
      seedRate: {
        quantity: '100-125 kg/hectare',
        cost: 4000
      },
      fertilizers: [
        {
          name: 'Urea',
          quantity: '150-200 kg/hectare',
          applicationTime: '1/3 basal, 1/3 first irrigation, 1/3 second irrigation',
          cost: 6000
        },
        {
          name: 'DAP',
          quantity: '125 kg/hectare',
          applicationTime: 'Basal application',
          cost: 4500
        },
        {
          name: 'Potash',
          quantity: '60 kg/hectare',
          applicationTime: 'Basal application',
          cost: 2000
        }
      ],
      irrigation: {
        method: 'Furrow irrigation / Sprinkler',
        frequency: '5-6 irrigations at critical stages',
        totalWater: '350-400 mm'
      },
      labor: {
        preparationHours: 30,
        sowingHours: 25,
        maintenanceHours: 80,
        harvestHours: 60,
        totalHours: 195,
        cost: 12000
      }
    },
    practicalAdvice: {
      tips: [
        'Use zero-till drill for timely sowing and fuel economy',
        'Maintain 22.5 cm row spacing for optimal plant population',
        'First irrigation 20-25 days after sowing (crown root stage)',
        'Apply weedicide Sulfosulfuron for broad-leaf weed control',
        'Harvest at physiological maturity (moisture 20-22%)'
      ],
      criticalPeriods: [
        {
          period: 'Sowing time (November 10-25)',
          activities: ['Prepare seedbed', 'Apply basal fertilizers', 'Ensure proper seed depth (3-4 cm)']
        },
        {
          period: 'Crown root stage (December 15-25)',
          activities: ['First irrigation', 'Apply first nitrogen dose', 'Monitor for termites']
        },
        {
          period: 'Flowering stage (February 20-March 10)',
          activities: ['Ensure adequate moisture', 'Apply final nitrogen dose', 'Monitor for diseases']
        }
      ],
      commonMistakes: [
        'Delayed sowing reduces yield by 1-1.5% per day',
        'Over-irrigation leads to lodging and diseases',
        'Excessive nitrogen causes lodging',
        'Early harvest affects grain quality and weight'
      ],
      successFactors: [
        'Timely sowing with proper seed rate',
        'Balanced fertilization and timely application',
        'Irrigation at critical growth stages',
        'Disease and pest monitoring'
      ]
    },
    risks: {
      diseases: [
        {
          name: 'Yellow Rust',
          symptoms: 'Yellow stripes on leaves parallel to leaf veins',
          prevention: 'Use resistant varieties, spray Propiconazole if detected early'
        },
        {
          name: 'Karnal Bunt',
          symptoms: 'Black powdery mass in grains with fishy smell',
          prevention: 'Seed treatment with Tebuconazole, avoid late irrigation'
        }
      ],
      pests: [
        {
          name: 'Termite',
          damage: 'Damage to roots and stem base, plant wilting',
          control: 'Apply Chlorpyriphos in soil, use resistant varieties'
        },
        {
          name: 'Aphid',
          damage: 'Yellowing of leaves, reduced grain filling',
          control: 'Spray Imidacloprid or use beneficial insects'
        }
      ],
      weatherRisks: ['Hailstorms during grain filling', 'Unseasonal rains during harvest', 'Frost damage'],
      marketRisks: ['MSP delays', 'Storage pest damage', 'Quality degradation']
    },
    benefits: {
      economic: ['Guaranteed MSP', 'Ready market availability', 'Lower input costs'],
      environmental: ['Crop residue for cattle feed', 'Soil structure improvement'],
      nutritional: ['Primary protein source', 'Essential amino acids', 'Energy provider'],
      social: ['Food security', 'Employment in rural areas', 'Traditional crop system']
    },
    compatibility: {
      cropRotation: ['Rice', 'Cotton', 'Sugarcane', 'Maize'],
      intercropping: ['Generally grown as sole crop'],
      avoid: ['Continuous wheat (disease buildup)', 'Late sown after rice harvest']
    }
  },

  // VEGETABLES
  {
    id: 'pun-003',
    cropName: 'Potato',
    localName: {
      english: 'Potato',
      punjabi: 'ਆਲੂ',
      hindi: 'आलू'
    },
    variety: 'Kufri Pukhraj',
    category: 'vegetables',
    season: 'Rabi',
    sowingPeriod: {
      start: 'October 15',
      end: 'November 30',
      optimal: 'October 25-November 15'
    },
    harvestPeriod: {
      start: 'February 15',
      end: 'March 31'
    },
    duration: 90,
    expectedYield: {
      min: 200,
      max: 350,
      average: 275,
      unit: 'quintal/hectare'
    },
    profitability: {
      investmentCost: 60000,
      expectedRevenue: 275000,
      profit: 215000,
      profitMargin: 78.2,
      roi: 358.3,
      paybackPeriod: 3
    },
    suitability: {
      soilTypes: ['Sandy loam', 'Well-drained loam', 'Alluvial'],
      climateConditions: ['Cool weather (15-20°C)', 'Dry harvesting period', 'No frost during tuber development'],
      waterRequirement: 'medium',
      difficulty: 'medium',
      suitabilityScore: 88,
      zones: ['Central Punjab', 'Western Punjab', 'Eastern Punjab']
    },
    marketInfo: {
      currentPrice: {
        min: 800,
        max: 1200,
        average: 1000,
        unit: '₹/quintal'
      },
      demandLevel: 'very-high',
      marketTrend: 'stable',
      exportPotential: true,
      mspSupport: false
    },
    requirements: {
      seedRate: {
        quantity: '25-30 quintal/hectare',
        cost: 20000
      },
      fertilizers: [
        {
          name: 'FYM',
          quantity: '20-25 tonne/hectare',
          applicationTime: 'Before planting',
          cost: 8000
        },
        {
          name: 'NPK 12:32:16',
          quantity: '300 kg/hectare',
          applicationTime: 'Basal application',
          cost: 12000
        },
        {
          name: 'Urea',
          quantity: '100 kg/hectare',
          applicationTime: 'At earthing up',
          cost: 3000
        }
      ],
      irrigation: {
        method: 'Furrow irrigation / Drip',
        frequency: '8-10 irrigations at 7-10 day intervals',
        totalWater: '400-500 mm'
      },
      labor: {
        preparationHours: 50,
        sowingHours: 80,
        maintenanceHours: 100,
        harvestHours: 120,
        totalHours: 350,
        cost: 25000
      }
    },
    practicalAdvice: {
      tips: [
        'Use certified seed potatoes free from diseases',
        'Plant at 15-20 cm depth with 60x20 cm spacing',
        'Earthing up twice: 25-30 and 45-50 days after planting',
        'Stop irrigation 10-15 days before harvest for better storage quality',
        'Grade potatoes immediately after harvest for better prices'
      ],
      criticalPeriods: [
        {
          period: 'Planting (October 25-November 15)',
          activities: ['Land preparation', 'Apply FYM and basal fertilizers', 'Plant certified seed tubers']
        },
        {
          period: 'Earthing up (December 15-January 15)',
          activities: ['First earthing up with urea application', 'Second earthing up', 'Pest monitoring']
        },
        {
          period: 'Tuber bulking (January 20-February 20)',
          activities: ['Regular irrigation', 'Disease monitoring', 'Avoid mechanical damage']
        }
      ],
      commonMistakes: [
        'Using cut tubers without proper curing leads to rot',
        'Over-irrigation causes tuber cracking and reduces storage life',
        'Harvesting during high soil moisture affects quality',
        'Exposure of tubers to sunlight causes greening'
      ],
      successFactors: [
        'Quality seed tubers and proper planting depth',
        'Timely earthing up operations',
        'Balanced fertilization with organic matter',
        'Proper curing and grading after harvest'
      ]
    },
    risks: {
      diseases: [
        {
          name: 'Late Blight',
          symptoms: 'Dark water-soaked lesions on leaves and tubers',
          prevention: 'Spray Metalaxyl + Mancozeb, avoid overhead irrigation'
        },
        {
          name: 'Black Scurf',
          symptoms: 'Black irregular sclerotia on tuber surface',
          prevention: 'Seed treatment with fungicides, crop rotation'
        }
      ],
      pests: [
        {
          name: 'Potato Tuber Moth',
          damage: 'Tunneling in tubers and stems',
          control: 'Use pheromone traps, spray Spinosad'
        },
        {
          name: 'Aphid',
          damage: 'Viral disease transmission, leaf curling',
          control: 'Spray Imidacloprid, use reflective mulch'
        }
      ],
      weatherRisks: ['Frost damage to foliage', 'High humidity favoring diseases', 'Hail damage'],
      marketRisks: ['Price volatility during harvest season', 'Storage losses', 'Quality premium requirements']
    },
    benefits: {
      economic: ['High profit margins', 'Ready market demand', 'Processing industry demand'],
      environmental: ['Improves soil structure', 'Efficient water use with drip irrigation'],
      nutritional: ['High carbohydrate content', 'Good source of vitamin C', 'Essential minerals'],
      social: ['Employment generation', 'Value addition opportunities', 'Export potential']
    },
    compatibility: {
      cropRotation: ['Rice', 'Wheat', 'Maize', 'Fodder crops'],
      intercropping: ['Not commonly practiced'],
      avoid: ['Tomato (same family diseases)', 'Continuous potato cropping']
    }
  },

  // CASH CROPS
  {
    id: 'pun-004',
    cropName: 'Cotton',
    localName: {
      english: 'Cotton',
      punjabi: 'ਕਪਾਹ',
      hindi: 'कपास'
    },
    variety: 'RCH 659 (Bt Cotton)',
    category: 'cash_crops',
    season: 'Kharif',
    sowingPeriod: {
      start: 'April 15',
      end: 'May 31',
      optimal: 'May 1-15'
    },
    harvestPeriod: {
      start: 'October 1',
      end: 'December 15'
    },
    duration: 180,
    expectedYield: {
      min: 20,
      max: 35,
      average: 27,
      unit: 'quintal/hectare'
    },
    profitability: {
      investmentCost: 45000,
      expectedRevenue: 162000,
      profit: 117000,
      profitMargin: 72.2,
      roi: 260,
      paybackPeriod: 5
    },
    suitability: {
      soilTypes: ['Well-drained loam', 'Sandy loam', 'Black cotton soil'],
      climateConditions: ['Warm humid summer', 'Temperature 21-32°C', 'Moderate rainfall'],
      waterRequirement: 'high',
      difficulty: 'hard',
      suitabilityScore: 75,
      zones: ['South-Western Punjab', 'Central Punjab (irrigated areas)']
    },
    marketInfo: {
      currentPrice: {
        min: 5800,
        max: 6500,
        average: 6000,
        unit: '₹/quintal'
      },
      demandLevel: 'high',
      marketTrend: 'stable',
      exportPotential: true,
      mspSupport: true
    },
    requirements: {
      seedRate: {
        quantity: '1.5-2.0 kg/hectare (Bt Cotton)',
        cost: 8000
      },
      fertilizers: [
        {
          name: 'Urea',
          quantity: '250-300 kg/hectare',
          applicationTime: 'Split application: 25% basal, 50% at squaring, 25% at flowering',
          cost: 10000
        },
        {
          name: 'DAP',
          quantity: '125 kg/hectare',
          applicationTime: 'Basal application',
          cost: 4500
        },
        {
          name: 'Potash',
          quantity: '60 kg/hectare',
          applicationTime: 'Basal application',
          cost: 2000
        }
      ],
      irrigation: {
        method: 'Drip irrigation recommended',
        frequency: '15-20 irrigations depending on rainfall',
        totalWater: '700-900 mm'
      },
      labor: {
        preparationHours: 40,
        sowingHours: 30,
        maintenanceHours: 200,
        harvestHours: 300,
        totalHours: 570,
        cost: 35000
      }
    },
    practicalAdvice: {
      tips: [
        'Use certified Bt cotton seeds for bollworm resistance',
        'Maintain plant population of 55,000-75,000 plants/hectare',
        'Monitor for pink bollworm and whitefly regularly',
        'Implement Integrated Pest Management (IPM) practices',
        'Hand picking for better fiber quality and premium prices'
      ],
      criticalPeriods: [
        {
          period: 'Sowing (May 1-15)',
          activities: ['Deep plowing', 'Apply basal fertilizers', 'Ensure proper plant spacing (67.5x30 cm)']
        },
        {
          period: 'Squaring stage (July 1-20)',
          activities: ['Apply first nitrogen dose', 'Monitor for sucking pests', 'Maintain soil moisture']
        },
        {
          period: 'Flowering-Boll development (August-September)',
          activities: ['Critical irrigation period', 'Pest monitoring intensively', 'Apply final nitrogen']
        }
      ],
      commonMistakes: [
        'Dense planting reduces boll size and quality',
        'Over-fertilization with nitrogen delays maturity',
        'Ignoring pest monitoring leads to severe infestations',
        'Improper storage of cotton leads to quality deterioration'
      ],
      successFactors: [
        'Optimal plant population with proper spacing',
        'Timely pest and disease management',
        'Balanced nutrition throughout crop cycle',
        'Proper harvesting and post-harvest handling'
      ]
    },
    risks: {
      diseases: [
        {
          name: 'Cotton Leaf Curl Virus',
          symptoms: 'Leaf curling, vein thickening, stunted growth',
          prevention: 'Use resistant varieties, control whitefly vector'
        },
        {
          name: 'Bacterial Blight',
          symptoms: 'Angular leaf spots, boll rot',
          prevention: 'Seed treatment, copper-based sprays'
        }
      ],
      pests: [
        {
          name: 'Pink Bollworm',
          damage: 'Boll damage, reduced fiber quality',
          control: 'Use pheromone traps, spray Emamectin benzoate'
        },
        {
          name: 'Whitefly',
          damage: 'Yellowing, honeydew secretion, virus transmission',
          control: 'Spray Thiamethoxam, use yellow sticky traps'
        }
      ],
      weatherRisks: ['Excessive rainfall during picking', 'Drought stress during boll development', 'Hailstorms'],
      marketRisks: ['Price fluctuations', 'Quality discounts', 'Competition from synthetic fibers']
    },
    benefits: {
      economic: ['High value cash crop', 'Multiple income from seed and fiber', 'Industrial demand'],
      environmental: ['Deep root system improves soil', 'Supports textile industry'],
      nutritional: ['Cotton seed oil production', 'Oil cake as cattle feed'],
      social: ['Employment in rural areas', 'Traditional cash crop', 'Export earnings']
    },
    compatibility: {
      cropRotation: ['Wheat', 'Potato', 'Fodder crops', 'Pulses'],
      intercropping: ['Cluster bean (Guar)', 'Green gram', 'Sesame'],
      avoid: ['Sugarcane (long duration conflict)', 'Continuous cotton (pest buildup)']
    }
  },

  // OILSEEDS
  {
    id: 'pun-005',
    cropName: 'Mustard',
    localName: {
      english: 'Mustard',
      punjabi: 'ਸਰ੍ਹੋਂ',
      hindi: 'सरसों'
    },
    variety: 'Hyola 401',
    category: 'oilseeds',
    season: 'Rabi',
    sowingPeriod: {
      start: 'October 15',
      end: 'November 15',
      optimal: 'October 25-November 5'
    },
    harvestPeriod: {
      start: 'March 20',
      end: 'April 15'
    },
    duration: 140,
    expectedYield: {
      min: 15,
      max: 25,
      average: 20,
      unit: 'quintal/hectare'
    },
    profitability: {
      investmentCost: 25000,
      expectedRevenue: 100000,
      profit: 75000,
      profitMargin: 75,
      roi: 300,
      paybackPeriod: 4
    },
    suitability: {
      soilTypes: ['Well-drained loam', 'Sandy loam', 'Clay loam'],
      climateConditions: ['Cool dry winters', 'Temperature 10-25°C', 'Low humidity during maturity'],
      waterRequirement: 'low',
      difficulty: 'easy',
      suitabilityScore: 85,
      zones: ['All zones of Punjab']
    },
    marketInfo: {
      currentPrice: {
        min: 4800,
        max: 5500,
        average: 5000,
        unit: '₹/quintal'
      },
      demandLevel: 'high',
      marketTrend: 'rising',
      exportPotential: true,
      mspSupport: true
    },
    requirements: {
      seedRate: {
        quantity: '2.5-3.0 kg/hectare',
        cost: 1200
      },
      fertilizers: [
        {
          name: 'Urea',
          quantity: '100 kg/hectare',
          applicationTime: '50% basal, 50% at flowering',
          cost: 3000
        },
        {
          name: 'DAP',
          quantity: '100 kg/hectare',
          applicationTime: 'Basal application',
          cost: 3600
        },
        {
          name: 'Potash',
          quantity: '40 kg/hectare',
          applicationTime: 'Basal application',
          cost: 1300
        }
      ],
      irrigation: {
        method: 'Furrow irrigation',
        frequency: '2-3 irrigations',
        totalWater: '200-250 mm'
      },
      labor: {
        preparationHours: 25,
        sowingHours: 15,
        maintenanceHours: 40,
        harvestHours: 60,
        totalHours: 140,
        cost: 8000
      }
    },
    practicalAdvice: {
      tips: [
        'Sow seeds at 2-3 cm depth with proper spacing',
        'First irrigation 25-30 days after sowing',
        'Harvest when pods turn brown but before shattering',
        'Dry harvested crop to 7-8% moisture for safe storage',
        'Apply sulfur if soil is deficient for better oil content'
      ],
      criticalPeriods: [
        {
          period: 'Sowing (October 25-November 5)',
          activities: ['Prepare fine tilth', 'Apply basal fertilizers', 'Ensure proper seed rate']
        },
        {
          period: 'Flowering (January 20-February 20)',
          activities: ['Apply top dressing of nitrogen', 'Monitor for pests', 'Provide irrigation if needed']
        },
        {
          period: 'Pod formation (February 25-March 15)',
          activities: ['Avoid water stress', 'Monitor for pod borer', 'Plan harvest timing']
        }
      ],
      commonMistakes: [
        'Late sowing reduces yield and oil content',
        'Over-irrigation leads to vegetative growth at expense of pods',
        'Delayed harvest causes pod shattering and yield loss',
        'Inadequate drying leads to storage problems'
      ],
      successFactors: [
        'Timely sowing for optimal growth period',
        'Balanced fertilization with sulfur',
        'Timely harvest before pod shattering',
        'Proper post-harvest handling and storage'
      ]
    },
    risks: {
      diseases: [
        {
          name: 'Alternaria Blight',
          symptoms: 'Dark brown spots on leaves and pods',
          prevention: 'Spray Mancozeb or Chlorothalonil'
        },
        {
          name: 'White Rust',
          symptoms: 'White pustules on lower leaf surface',
          prevention: 'Use resistant varieties, spray Metalaxyl'
        }
      ],
      pests: [
        {
          name: 'Mustard Aphid',
          damage: 'Yellowing of leaves, honeydew secretion',
          control: 'Spray Imidacloprid or Dimethoate'
        },
        {
          name: 'Painted Bug',
          damage: 'Feeding on developing seeds',
          control: 'Spray Malathion during pod formation'
        }
      ],
      weatherRisks: ['Hailstorms during flowering', 'Unseasonal rains during harvest', 'Frost damage'],
      marketRisks: ['Oil price fluctuations', 'Competition from imported oils', 'Quality premium variations']
    },
    benefits: {
      economic: ['High oil content (40-42%)', 'MSP support available', 'Value addition through processing'],
      environmental: ['Improves soil fertility', 'Bee pasture during flowering', 'Short duration crop'],
      nutritional: ['Healthy cooking oil', 'Rich in omega-3 fatty acids', 'Protein-rich oil cake'],
      social: ['Traditional oilseed crop', 'Support to oil industry', 'Employment generation']
    },
    compatibility: {
      cropRotation: ['Rice', 'Cotton', 'Maize', 'Potato'],
      intercropping: ['Gram', 'Wheat (late sown)'],
      avoid: ['Other Brassica crops (disease carryover)', 'Continuous mustard']
    }
  }
]

export function getPunjabCropsByFilter(filters: {
  season?: string
  category?: string
  soilType?: string
  waterRequirement?: string
  difficulty?: string
  zone?: string
  maxInvestment?: number
}) {
  let filteredCrops = punjabCropDatabase

  if (filters.season) {
    filteredCrops = filteredCrops.filter(crop => 
      crop.season.toLowerCase() === filters.season?.toLowerCase()
    )
  }

  if (filters.category) {
    filteredCrops = filteredCrops.filter(crop => 
      crop.category === filters.category
    )
  }

  if (filters.soilType) {
    filteredCrops = filteredCrops.filter(crop =>
      crop.suitability.soilTypes.some(soil => 
        soil.toLowerCase().includes(filters.soilType?.toLowerCase() || '')
      )
    )
  }

  if (filters.waterRequirement) {
    filteredCrops = filteredCrops.filter(crop =>
      crop.suitability.waterRequirement === filters.waterRequirement
    )
  }

  if (filters.difficulty) {
    filteredCrops = filteredCrops.filter(crop =>
      crop.suitability.difficulty === filters.difficulty
    )
  }

  if (filters.zone) {
    filteredCrops = filteredCrops.filter(crop =>
      crop.suitability.zones.some(zone => 
        zone.toLowerCase().includes(filters.zone?.toLowerCase() || '')
      )
    )
  }

  if (filters.maxInvestment) {
    filteredCrops = filteredCrops.filter(crop =>
      crop.profitability.investmentCost <= filters.maxInvestment
    )
  }

  // Sort by ROI (highest first)
  return filteredCrops.sort((a, b) => b.profitability.roi - a.profitability.roi)
}

export function getCurrentSeasonCrops() {
  const currentMonth = new Date().getMonth() + 1
  let currentSeason = 'Rabi'
  
  if (currentMonth >= 6 && currentMonth <= 9) {
    currentSeason = 'Kharif'
  } else if (currentMonth >= 10 && currentMonth <= 11) {
    currentSeason = 'Post-Kharif'
  }

  return getPunjabCropsByFilter({ season: currentSeason })
}