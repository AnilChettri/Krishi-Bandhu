import { CropInfo, GovernmentScheme, WeatherAdvice, PestInfo, SoilAdvice, MarketInfo } from './punjab-ai-assistant'

/**
 * Comprehensive Punjab Agriculture Knowledge Base
 * Sources: PAU Ludhiana, KVK Network, Punjab Agriculture Department, IMD
 */

// Punjab Agricultural Crops Database
export const PUNJAB_CROPS_DB: CropInfo[] = [
  {
    id: 'wheat_punjab',
    name: {
      english: 'Wheat',
      punjabi: 'ਕਣਕ',
      gurmukhi: 'ਕਣਕ',
      scientific: 'Triticum aestivum'
    },
    category: 'cereal',
    season: 'rabi',
    varieties: ['PBW 725', 'HD 3086', 'PBW 677', 'PBW 621', 'DBW 187', 'WH 1105'],
    sowing_period: {
      start: 'October 25',
      end: 'December 10',
      optimal: 'November 5-20'
    },
    water_requirement: 'high',
    soil_type: ['alluvial', 'clay_loam', 'sandy_loam'],
    spacing: '20-22.5 cm between rows',
    seed_rate: '40-50 kg/acre for irrigated, 50-55 kg/acre for rainfed',
    fertilizer: [
      {
        stage: 'basal',
        fertilizer: 'DAP',
        rate: '62 kg/acre',
        method: 'broadcasting',
        timing: 'at_sowing'
      },
      {
        stage: 'top_dress_1',
        fertilizer: 'Urea',
        rate: '54 kg/acre',
        method: 'side_placement',
        timing: '21_days_after_sowing'
      },
      {
        stage: 'top_dress_2',
        fertilizer: 'Urea',
        rate: '22 kg/acre',
        method: 'side_placement',
        timing: 'before_second_irrigation'
      }
    ],
    common_pests: ['aphid', 'termite', 'shoot_fly', 'pink_borer'],
    diseases: ['yellow_rust', 'loose_smut', 'karnal_bunt', 'powdery_mildew'],
    market_season: 'April-May',
    pau_recommendations: [
      'Use certified seed from PAU/NSC',
      'Apply recommended fertilizer dose: 62 kg DAP + 76 kg Urea per acre',
      'Maintain 6-7 irrigations during growing season',
      'Monitor for yellow rust and spray fungicide if needed',
      'Harvest at physiological maturity for better quality'
    ],
    source: 'PAU_Ludhiana_Guidelines_2024'
  },
  
  {
    id: 'paddy_punjab',
    name: {
      english: 'Paddy',
      punjabi: 'ਧਾਨ',
      gurmukhi: 'ਧਾਨ',
      scientific: 'Oryza sativa'
    },
    category: 'cereal',
    season: 'kharif',
    varieties: ['PR 126', 'Pusa 44', 'PR 121', 'PB 1509', 'PR 124', 'Pusa Basmati 1718'],
    sowing_period: {
      start: 'May 20',
      end: 'June 30',
      optimal: 'June 10-20'
    },
    water_requirement: 'high',
    soil_type: ['clay', 'clay_loam', 'silty_loam'],
    spacing: '20 cm between rows, 10 cm plant to plant',
    seed_rate: '6-8 kg/acre (direct seeding), 4 kg/acre (transplanting)',
    fertilizer: [
      {
        stage: 'nursery',
        fertilizer: 'DAP',
        rate: '10 kg per nursery (400 sq m)',
        method: 'broadcasting',
        timing: 'before_sowing_nursery'
      },
      {
        stage: 'basal',
        fertilizer: 'DAP + Urea',
        rate: '31 kg DAP + 22 kg Urea per acre',
        method: 'broadcasting',
        timing: 'before_transplanting'
      },
      {
        stage: 'top_dress',
        fertilizer: 'Urea',
        rate: '54 kg/acre',
        method: 'broadcasting',
        timing: '21_days_after_transplanting'
      }
    ],
    common_pests: ['stem_borer', 'leaf_folder', 'brown_plant_hopper', 'green_leaf_hopper'],
    diseases: ['blast', 'sheath_blight', 'bacterial_blight', 'false_smut'],
    market_season: 'October-November',
    pau_recommendations: [
      'Transplant 25-30 days old seedlings',
      'Maintain 2-3 cm water level throughout season',
      'Apply zinc sulfate if deficiency symptoms appear',
      'Use recommended varieties only for better yields',
      'Apply silicon fertilizer for disease resistance'
    ],
    source: 'PAU_Ludhiana_Guidelines_2024'
  },

  {
    id: 'maize_punjab',
    name: {
      english: 'Maize',
      punjabi: 'ਮੱਕੀ',
      gurmukhi: 'ਮੱਕੀ',
      scientific: 'Zea mays'
    },
    category: 'cereal',
    season: 'kharif',
    varieties: ['PMH 1', 'Parkash', 'Kanchan', 'P 3396', 'NK 6240'],
    sowing_period: {
      start: 'June 15',
      end: 'July 15',
      optimal: 'June 20 - July 5'
    },
    water_requirement: 'medium',
    soil_type: ['well_drained', 'sandy_loam', 'clay_loam'],
    spacing: '60 cm between rows, 20 cm plant to plant',
    seed_rate: '8-10 kg/acre',
    fertilizer: [
      {
        stage: 'basal',
        fertilizer: 'DAP + Potash',
        rate: '50 kg DAP + 17 kg MOP per acre',
        method: 'placement',
        timing: 'at_sowing'
      },
      {
        stage: 'top_dress',
        fertilizer: 'Urea',
        rate: '65 kg/acre in two splits',
        method: 'side_placement',
        timing: '25_and_45_days_after_sowing'
      }
    ],
    common_pests: ['stem_borer', 'shoot_fly', 'fall_armyworm', 'pink_borer'],
    diseases: ['downy_mildew', 'rust', 'leaf_blight'],
    market_season: 'September-October',
    pau_recommendations: [
      'Use hybrid seeds for better yields',
      'Plant at 60x20 cm spacing for optimal population',
      'Apply recommended dose: 50 kg DAP + 65 kg Urea + 17 kg MOP per acre',
      'Irrigate at critical stages: knee high, tasseling, grain filling',
      'Control weeds at 20-25 days after sowing'
    ],
    source: 'PAU_Ludhiana_Guidelines_2024'
  },

  {
    id: 'cotton_punjab',
    name: {
      english: 'Cotton',
      punjabi: 'ਕਪਾਹ',
      gurmukhi: 'ਕਪਾਹ',
      scientific: 'Gossypium hirsutum'
    },
    category: 'cash',
    season: 'kharif',
    varieties: ['RCH 134', 'MRC 7017', 'MRC 7031', 'RCH 650', 'PCH 2270'],
    sowing_period: {
      start: 'April 15',
      end: 'May 31',
      optimal: 'May 1-15'
    },
    water_requirement: 'high',
    soil_type: ['well_drained', 'black_cotton', 'alluvial'],
    spacing: '67.5 cm between rows, 30 cm plant to plant',
    seed_rate: '1.25 kg/acre (Bt cotton)',
    fertilizer: [
      {
        stage: 'basal',
        fertilizer: 'DAP + Potash',
        rate: '62 kg DAP + 33 kg MOP per acre',
        method: 'placement',
        timing: 'at_sowing'
      },
      {
        stage: 'square_formation',
        fertilizer: 'Urea',
        rate: '33 kg/acre',
        method: 'side_placement',
        timing: '35_days_after_sowing'
      },
      {
        stage: 'flowering',
        fertilizer: 'Urea',
        rate: '33 kg/acre',
        method: 'side_placement',
        timing: '65_days_after_sowing'
      }
    ],
    common_pests: ['bollworm', 'aphid', 'jassid', 'thrips', 'whitefly'],
    diseases: ['bacterial_blight', 'verticillium_wilt', 'fusarium_wilt'],
    market_season: 'October-December',
    pau_recommendations: [
      'Use only approved Bt cotton varieties',
      'Maintain refugia (20% non-Bt area) for resistance management',
      'Apply recommended fertilizer: 62 kg DAP + 66 kg Urea + 33 kg MOP per acre',
      'Monitor for pink bollworm and follow IPM practices',
      'Pick cotton at proper maturity for better fiber quality'
    ],
    source: 'PAU_Ludhiana_Guidelines_2024'
  }
]

// Government Schemes Database
export const PUNJAB_SCHEMES_DB: GovernmentScheme[] = [
  {
    id: 'crop_diversification_scheme_2024',
    name: {
      english: 'Crop Diversification Scheme',
      punjabi: 'ਫਸਲ ਵਿਭਿੰਨਤਾ ਸਕੀਮ'
    },
    department: 'Punjab Agriculture Department',
    category: 'subsidy',
    eligibility: [
      'Farmers switching from paddy to alternative crops',
      'Minimum 1 acre land holding',
      'Valid land ownership documents',
      'Registered with Agriculture Department'
    ],
    benefits: [
      'Rs 7000 per acre for maize cultivation',
      'Rs 9000 per acre for pulses (moong, mash)',
      'Rs 12000 per acre for cotton',
      'Free certified seeds',
      'Technical guidance from KVK'
    ],
    application_process: 'Online application at punjabagri.gov.in or visit nearest Agriculture Office',
    documents_required: [
      'Khasra number and land documents',
      'Aadhaar card',
      'Bank account passbook',
      'Mobile number for SMS updates',
      'Previous year crop details'
    ],
    contact: {
      phone: '0172-2221242',
      email: 'agri-punjab@gov.in',
      website: 'punjabagri.gov.in',
      office_address: 'Director Agriculture, Punjab, Sector 35, Chandigarh'
    },
    source: 'Punjab_Agriculture_Department_2024'
  },

  {
    id: 'pm_kisan_scheme',
    name: {
      english: 'PM-KISAN Scheme',
      punjabi: 'ਪੀਐਮ-ਕਿਸਾਨ ਸਕੀਮ'
    },
    department: 'Central Government - Ministry of Agriculture',
    category: 'subsidy',
    eligibility: [
      'Small and marginal farmers',
      'Land holding up to 2 hectares',
      'Valid Aadhaar card',
      'Bank account'
    ],
    benefits: [
      'Rs 6000 per year in 3 installments',
      'Rs 2000 every 4 months',
      'Direct benefit transfer to bank account'
    ],
    application_process: 'Online at pmkisan.gov.in or through CSC/Agriculture Office',
    documents_required: [
      'Aadhaar card',
      'Bank account details',
      'Land ownership documents',
      'Mobile number'
    ],
    contact: {
      phone: '011-24300606',
      email: 'pmkisan-ict@gov.in',
      website: 'pmkisan.gov.in',
      office_address: 'Ministry of Agriculture, Krishi Bhawan, New Delhi'
    },
    source: 'Ministry_of_Agriculture_GoI_2024'
  },

  {
    id: 'soil_health_card_scheme',
    name: {
      english: 'Soil Health Card Scheme',
      punjabi: 'ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਸਕੀਮ'
    },
    department: 'Punjab Agriculture Department',
    category: 'training',
    eligibility: [
      'All farmers in Punjab',
      'Minimum 1 acre land holding',
      'Regular farmer'
    ],
    benefits: [
      'Free soil testing every 2 years',
      'Customized fertilizer recommendations',
      'Nutrient management advice',
      'Improved soil fertility guidance'
    ],
    application_process: 'Contact nearest Soil Testing Laboratory or KVK',
    documents_required: [
      'Land ownership documents',
      'Aadhaar card',
      'Contact details'
    ],
    contact: {
      phone: '0172-2970605',
      email: 'soilhealth-punjab@gov.in',
      website: 'soilhealth.dac.gov.in',
      office_address: 'Soil Testing Labs across Punjab districts'
    },
    source: 'Punjab_Soil_Health_Program_2024'
  }
]

// Pest and Disease Database
export const PUNJAB_PESTS_DB: PestInfo[] = [
  {
    id: 'yellow_rust_wheat',
    name: {
      english: 'Yellow Rust in Wheat',
      punjabi: 'ਕਣਕ ਵਿੱਚ ਪੀਲਾ ਜੰਗ'
    },
    crops_affected: ['wheat'],
    symptoms: [
      'Yellow/orange colored pustules on leaves',
      'Pustules arranged in linear rows',
      'Leaves turn yellow and dry up',
      'Reduced grain filling'
    ],
    treatment: [
      'Spray Propiconazole 25% EC @ 200ml/acre',
      'Use Tebuconazole 25.9% EC @ 200ml/acre',
      'Apply Mancozeb 75% WP @ 600g/acre as preventive',
      'Ensure good air circulation in field'
    ],
    prevention: [
      'Use resistant varieties like PBW 725',
      'Avoid excess nitrogen application',
      'Remove volunteer wheat plants',
      'Follow crop rotation'
    ],
    source: 'PAU_Plant_Pathology_Department'
  },

  {
    id: 'stem_borer_paddy',
    name: {
      english: 'Stem Borer in Paddy',
      punjabi: 'ਧਾਨ ਵਿੱਚ ਤਣਾ ਬੋਰਰ'
    },
    crops_affected: ['paddy'],
    symptoms: [
      'Dead hearts in vegetative stage',
      'White heads during reproductive stage',
      'Holes in stem with frass',
      'Stunted plant growth'
    ],
    treatment: [
      'Release Trichogramma cards @ 5 cards/acre',
      'Spray Cartap hydrochloride 4G @ 5kg/acre',
      'Use Chlorantraniliprole 18.5% SC @ 80ml/acre',
      'Apply Fipronil 5% SC @ 400ml/acre'
    ],
    prevention: [
      'Use pheromone traps @ 5 traps/acre',
      'Avoid staggered planting',
      'Maintain proper water level',
      'Remove stubbles after harvest'
    ],
    source: 'PAU_Entomology_Department'
  },

  {
    id: 'pink_bollworm_cotton',
    name: {
      english: 'Pink Bollworm in Cotton',
      punjabi: 'ਕਪਾਹ ਵਿੱਚ ਗੁਲਾਬੀ ਸੁੰਡੀ'
    },
    crops_affected: ['cotton'],
    symptoms: [
      'Entry holes in bolls',
      'Pink colored larvae inside bolls',
      'Damaged or hollow seeds',
      'Webbing inside opened bolls',
      'Premature boll opening'
    ],
    treatment: [
      'Release Trichogramma cards @ 10 cards/acre',
      'Spray Emamectin benzoate 5% SG @ 80g/acre',
      'Use Flubendiamide 20% WG @ 150g/acre',
      'Apply Thiodicarb 75% WP @ 500g/acre'
    ],
    prevention: [
      'Plant refugia (non-Bt cotton) 20% area',
      'Use pheromone traps @ 4-5/acre',
      'Destroy crop residues after harvest',
      'Follow bt cotton cultivation guidelines',
      'Avoid late planting'
    ],
    source: 'PAU_Cotton_Research_Station'
  }
]

// Soil and Fertility Database
export const PUNJAB_SOIL_DB: SoilAdvice[] = [
  {
    id: 'alluvial_soil_punjab',
    soil_type: 'Alluvial Soil',
    ph_range: '7.0-8.5 (alkaline)',
    suitable_crops: ['wheat', 'paddy', 'sugarcane', 'maize', 'cotton'],
    improvement_methods: [
      'Add organic matter (farmyard manure)',
      'Use gypsum for sodic soils',
      'Apply green manuring crops',
      'Practice crop rotation',
      'Use biofertilizers'
    ],
    fertilizer_recommendations: [
      'Apply FYM @ 5-8 tonnes/acre annually',
      'Use balanced NPK fertilizers',
      'Apply micronutrients (Zn, Fe) as needed',
      'Use phosphorus-solubilizing bacteria',
      'Apply lime if pH is below 6.5'
    ],
    source: 'PAU_Soil_Science_Department'
  },

  {
    id: 'sandy_loam_punjab',
    soil_type: 'Sandy Loam',
    ph_range: '6.5-7.8 (neutral to slightly alkaline)',
    suitable_crops: ['wheat', 'maize', 'cotton', 'potato', 'vegetables'],
    improvement_methods: [
      'Increase organic matter content',
      'Use cover crops',
      'Apply vermicompost regularly',
      'Mulching to reduce water loss',
      'Avoid over-tillage'
    ],
    fertilizer_recommendations: [
      'Apply organic fertilizers regularly',
      'Use slow-release fertilizers',
      'Split application of nitrogen',
      'Apply potash for better water retention',
      'Use biofertilizers for nutrient efficiency'
    ],
    source: 'PAU_Soil_Science_Department'
  }
]

// Market Information Database
export const PUNJAB_MARKETS_DB: MarketInfo[] = [
  {
    id: 'ludhiana_wheat_current',
    mandi_name: 'Ludhiana Grain Market',
    crop: 'Wheat',
    price_per_quintal: 2250,
    date: '2024-04-15',
    grade: 'FAQ (Fair Average Quality)',
    source: 'eNAM_Punjab'
  },
  {
    id: 'bathinda_paddy_current', 
    mandi_name: 'Bathinda Grain Market',
    crop: 'Paddy',
    price_per_quintal: 2150,
    date: '2024-10-20',
    grade: 'Common',
    source: 'Punjab_Mandi_Board'
  },
  {
    id: 'sirsa_cotton_current',
    mandi_name: 'Sirsa Cotton Market',
    crop: 'Cotton',
    price_per_quintal: 6800,
    date: '2024-11-05',
    grade: 'Medium Staple',
    source: 'Cotton_Corporation_India'
  }
]

// Weather Advisory Database
export const PUNJAB_WEATHER_DB: WeatherAdvice[] = [
  {
    id: 'winter_wheat_advisory',
    district: 'All Punjab',
    date: '2024-01-15',
    advisory: {
      english: 'Cold wave conditions expected. Irrigate wheat crop if temperature falls below 4°C. Apply light irrigation to protect from frost damage.',
      punjabi: 'ਠੰਡ ਦੀ ਲਹਿਰ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਜੇ ਤਾਪਮਾਨ 4°C ਤੋਂ ਹੇਠਾਂ ਜਾਵੇ ਤਾਂ ਕਣਕ ਦੀ ਫਸਲ ਨੂੰ ਪਾਣੀ ਦਿਓ। ਠਰ ਤੋਂ ਬਚਾਉਣ ਲਈ ਹਲਕਾ ਪਾਣੀ ਦਿਓ।'
    },
    source: 'IMD_Chandigarh'
  },
  {
    id: 'monsoon_paddy_advisory',
    district: 'All Punjab',
    date: '2024-07-10',
    advisory: {
      english: 'Heavy rainfall expected in next 48 hours. Ensure proper drainage in paddy fields. Delay any spray operations.',
      punjabi: 'ਅਗਲੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਧਾਨ ਦੇ ਖੇਤਾਂ ਵਿੱਚ ਪਾਣੀ ਦੀ ਨਿਕਾਸੀ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ। ਛਿੜਕਾਅ ਦਾ ਕੰਮ ਮੁਲਤਵੀ ਕਰੋ।'
    },
    source: 'PAU_Agromet_Advisory'
  }
]

/**
 * Knowledge Base Search Functions
 */

export function searchCrops(query: string, category?: string): CropInfo[] {
  const queryLower = query.toLowerCase()
  
  return PUNJAB_CROPS_DB.filter(crop => {
    const matchesQuery = 
      crop.name.english.toLowerCase().includes(queryLower) ||
      crop.name.punjabi.includes(query) ||
      crop.varieties.some(variety => variety.toLowerCase().includes(queryLower)) ||
      crop.common_pests.some(pest => pest.toLowerCase().includes(queryLower)) ||
      crop.diseases.some(disease => disease.toLowerCase().includes(queryLower))
    
    const matchesCategory = !category || crop.category === category
    
    return matchesQuery && matchesCategory
  })
}

export function searchSchemes(query: string): GovernmentScheme[] {
  const queryLower = query.toLowerCase()
  
  return PUNJAB_SCHEMES_DB.filter(scheme =>
    scheme.name.english.toLowerCase().includes(queryLower) ||
    scheme.name.punjabi.includes(query) ||
    scheme.category.toLowerCase().includes(queryLower) ||
    scheme.benefits.some(benefit => benefit.toLowerCase().includes(queryLower))
  )
}

export function searchPests(query: string): PestInfo[] {
  const queryLower = query.toLowerCase()
  
  return PUNJAB_PESTS_DB.filter(pest =>
    pest.name.english.toLowerCase().includes(queryLower) ||
    pest.name.punjabi.includes(query) ||
    pest.crops_affected.some(crop => crop.toLowerCase().includes(queryLower)) ||
    pest.symptoms.some(symptom => symptom.toLowerCase().includes(queryLower))
  )
}

export function getMarketPrices(crop?: string, district?: string): MarketInfo[] {
  let results = PUNJAB_MARKETS_DB
  
  if (crop) {
    const cropLower = crop.toLowerCase()
    results = results.filter(market => 
      market.crop.toLowerCase().includes(cropLower)
    )
  }
  
  if (district) {
    const districtLower = district.toLowerCase()
    results = results.filter(market =>
      market.mandi_name.toLowerCase().includes(districtLower)
    )
  }
  
  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getSoilAdvice(soilType: string): SoilAdvice | null {
  return PUNJAB_SOIL_DB.find(soil =>
    soil.soil_type.toLowerCase().includes(soilType.toLowerCase())
  ) || null
}

export function getWeatherAdvisory(district: string = 'All Punjab'): WeatherAdvice[] {
  return PUNJAB_WEATHER_DB.filter(weather =>
    weather.district.toLowerCase().includes(district.toLowerCase()) ||
    weather.district === 'All Punjab'
  )
}

/**
 * Knowledge Base Statistics
 */
export const KNOWLEDGE_BASE_STATS = {
  total_crops: PUNJAB_CROPS_DB.length,
  total_schemes: PUNJAB_SCHEMES_DB.length, 
  total_pests: PUNJAB_PESTS_DB.length,
  total_soil_types: PUNJAB_SOIL_DB.length,
  total_markets: PUNJAB_MARKETS_DB.length,
  total_weather_advisories: PUNJAB_WEATHER_DB.length,
  last_updated: '2024-01-15',
  sources: [
    'PAU_Ludhiana_Guidelines_2024',
    'Punjab_Agriculture_Department_2024',
    'Ministry_of_Agriculture_GoI_2024',
    'IMD_Chandigarh',
    'eNAM_Punjab'
  ]
}

// Combined knowledge base export
export const punjabKnowledgeBase = {
  crops: PUNJAB_CROPS_DB,
  schemes: PUNJAB_SCHEMES_DB,
  pests: PUNJAB_PESTS_DB,
  soils: PUNJAB_SOIL_DB,
  markets: PUNJAB_MARKETS_DB,
  weather: PUNJAB_WEATHER_DB,
  stats: KNOWLEDGE_BASE_STATS,
  // Search methods
  searchCrops,
  searchSchemes,
  searchPests,
  searchMarketData: getMarketPrices,
  getSoilAdvice,
  getWeatherAdvisory
}
