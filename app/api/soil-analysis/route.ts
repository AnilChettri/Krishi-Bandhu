import { NextRequest, NextResponse } from 'next/server'

interface SoilTestRequest {
  location: {
    district: string
    tehsil?: string
    coordinates?: {
      lat: number
      lon: number
    }
  }
  farmDetails: {
    landSize: number
    currentCrop?: string
    previousCrops?: string[]
    irrigationType: string
  }
  testType: 'basic' | 'comprehensive' | 'organic_matter' | 'micronutrient'
  soilSample?: {
    depth: number // in cm
    sampleId?: string
    collectionDate?: string
  }
}

interface SoilTestResults {
  id: string
  sampleId: string
  testDate: string
  location: string
  basicParameters: {
    pH: {
      value: number
      status: 'acidic' | 'neutral' | 'alkaline'
      ideal_range: string
      recommendation: string
    }
    ec: { // Electrical Conductivity
      value: number
      unit: 'dS/m'
      status: 'normal' | 'saline' | 'highly_saline'
      recommendation: string
    }
    organic_carbon: {
      value: number
      unit: '%'
      status: 'low' | 'medium' | 'high'
      recommendation: string
    }
    texture: {
      sand: number
      silt: number
      clay: number
      classification: string
      water_holding_capacity: string
    }
  }
  nutrients: {
    nitrogen: {
      value: number
      unit: 'kg/ha'
      status: 'deficient' | 'adequate' | 'high'
      recommendation: string
    }
    phosphorus: {
      value: number
      unit: 'kg/ha'
      status: 'deficient' | 'adequate' | 'high'
      recommendation: string
    }
    potassium: {
      value: number
      unit: 'kg/ha'
      status: 'deficient' | 'adequate' | 'high'
      recommendation: string
    }
    sulphur: {
      value: number
      unit: 'kg/ha'
      status: 'deficient' | 'adequate' | 'high'
      recommendation: string
    }
  }
  micronutrients?: {
    zinc: {
      value: number
      unit: 'ppm'
      status: 'deficient' | 'adequate' | 'high'
      recommendation: string
    }
    iron: {
      value: number
      unit: 'ppm'
      status: 'deficient' | 'adequate' | 'high'
      recommendation: string
    }
    manganese: {
      value: number
      unit: 'ppm'
      status: 'deficient' | 'adequate' | 'high'
      recommendation: string
    }
    copper: {
      value: number
      unit: 'ppm'
      status: 'deficient' | 'adequate' | 'high'
      recommendation: string
    }
    boron: {
      value: number
      unit: 'ppm'
      status: 'deficient' | 'adequate' | 'high'
      recommendation: string
    }
  }
}

interface FertilizerRecommendation {
  crop: string
  season: string
  recommendations: {
    basal: Array<{
      fertilizer: string
      quantity: number
      unit: string
      timing: string
      method: string
      cost: number
    }>
    top_dressing: Array<{
      fertilizer: string
      quantity: number
      unit: string
      timing: string
      method: string
      cost: number
    }>
    micronutrients: Array<{
      nutrient: string
      source: string
      quantity: number
      unit: string
      application_method: string
      cost: number
    }>
  }
  total_cost: number
  expected_yield_increase: string
  roi: string
}

interface SoilHealthScore {
  overall_score: number // 0-100
  categories: {
    chemical: number
    physical: number
    biological: number
  }
  improvement_areas: string[]
  strengths: string[]
  management_practices: string[]
}

interface SoilAnalysisResponse {
  success: boolean
  data: {
    testResults: SoilTestResults
    fertilizerRecommendations: FertilizerRecommendation[]
    soilHealthScore: SoilHealthScore
    cropSuitability: Array<{
      crop: string
      suitability_score: number
      reasons: string[]
      modifications_needed: string[]
    }>
    improvementPlan: {
      immediate_actions: string[]
      short_term: string[] // 1-6 months
      long_term: string[] // 6 months - 2 years
      organic_amendments: Array<{
        amendment: string
        quantity: string
        benefit: string
        cost: number
      }>
    }
    monitoring: {
      next_test_date: string
      parameters_to_monitor: string[]
      frequency: string
    }
  }
  error?: string
}

// Punjab soil type database
const PUNJAB_SOIL_TYPES = {
  'Ludhiana': {
    predominant_type: 'alluvial',
    typical_ph: 7.2,
    common_issues: ['zinc_deficiency', 'organic_matter_low'],
    suitable_crops: ['wheat', 'rice', 'maize', 'sugarcane']
  },
  'Amritsar': {
    predominant_type: 'alluvial',
    typical_ph: 7.8,
    common_issues: ['alkalinity', 'iron_deficiency'],
    suitable_crops: ['wheat', 'rice', 'cotton']
  },
  'Bathinda': {
    predominant_type: 'sandy_loam',
    typical_ph: 8.1,
    common_issues: ['alkalinity', 'low_organic_matter', 'water_retention'],
    suitable_crops: ['wheat', 'cotton', 'mustard']
  },
  'Jalandhar': {
    predominant_type: 'clay_loam',
    typical_ph: 7.4,
    common_issues: ['waterlogging', 'compaction'],
    suitable_crops: ['wheat', 'rice', 'sugarcane', 'fodder']
  },
  'Patiala': {
    predominant_type: 'sandy_clay_loam',
    typical_ph: 7.6,
    common_issues: ['moderate_alkalinity', 'zinc_deficiency'],
    suitable_crops: ['wheat', 'rice', 'cotton', 'vegetables']
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SoilTestRequest = await request.json()
    
    console.log(`Soil analysis request for ${body.location.district}`)
    
    // Generate mock test results based on location and inputs
    const analysisResult = await generateSoilAnalysis(body)
    
    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error('Soil analysis API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process soil analysis request'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const district = searchParams.get('district')
    const crop = searchParams.get('crop')
    const testId = searchParams.get('testId')
    
    if (testId) {
      // Return specific test results
      const testResults = await getTestResults(testId)
      return NextResponse.json(testResults)
    }
    
    if (district) {
      // Return general soil information for district
      const soilInfo = getDistrictSoilInfo(district)
      return NextResponse.json({
        success: true,
        data: soilInfo
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Please provide district or testId parameter'
    }, { status: 400 })
  } catch (error) {
    console.error('Soil info API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch soil information'
    }, { status: 500 })
  }
}

async function generateSoilAnalysis(request: SoilTestRequest): Promise<SoilAnalysisResponse> {
  const district = request.location.district
  const soilTypeInfo = PUNJAB_SOIL_TYPES[district as keyof typeof PUNJAB_SOIL_TYPES] || PUNJAB_SOIL_TYPES['Ludhiana']
  
  // Generate mock test results
  const testResults: SoilTestResults = {
    id: `soil_test_${Date.now()}`,
    sampleId: request.soilSample?.sampleId || `SAMPLE_${Date.now()}`,
    testDate: new Date().toISOString().split('T')[0],
    location: `${district}, Punjab`,
    basicParameters: {
      pH: {
        value: soilTypeInfo.typical_ph + (Math.random() - 0.5) * 0.8,
        status: soilTypeInfo.typical_ph > 8 ? 'alkaline' : 
                soilTypeInfo.typical_ph < 6.5 ? 'acidic' : 'neutral',
        ideal_range: '6.5 - 7.5',
        recommendation: soilTypeInfo.typical_ph > 8 ? 
          'Apply gypsum @ 2-3 tons/ha to reduce alkalinity' :
          soilTypeInfo.typical_ph < 6.5 ?
          'Apply lime @ 1-2 tons/ha to increase pH' :
          'pH is in optimal range'
      },
      ec: {
        value: Math.random() * 2 + 0.2,
        unit: 'dS/m',
        status: Math.random() > 0.8 ? 'saline' : 'normal',
        recommendation: 'Normal salinity levels. Continue good drainage practices.'
      },
      organic_carbon: {
        value: Math.random() * 0.8 + 0.2,
        unit: '%',
        status: Math.random() * 0.8 + 0.2 > 0.5 ? 'medium' : 'low',
        recommendation: 'Add organic matter through FYM, compost, or green manuring'
      },
      texture: {
        sand: Math.random() * 40 + 30,
        silt: Math.random() * 30 + 20,
        clay: Math.random() * 30 + 20,
        classification: soilTypeInfo.predominant_type,
        water_holding_capacity: 'Good'
      }
    },
    nutrients: {
      nitrogen: {
        value: Math.random() * 150 + 100,
        unit: 'kg/ha',
        status: Math.random() > 0.6 ? 'adequate' : 'deficient',
        recommendation: 'Apply 120 kg N/ha through urea in split doses'
      },
      phosphorus: {
        value: Math.random() * 30 + 10,
        unit: 'kg/ha',
        status: Math.random() > 0.5 ? 'adequate' : 'deficient',
        recommendation: 'Apply 60 kg P2O5/ha through DAP at sowing'
      },
      potassium: {
        value: Math.random() * 200 + 150,
        unit: 'kg/ha',
        status: Math.random() > 0.7 ? 'adequate' : 'deficient',
        recommendation: 'Apply 40 kg K2O/ha through MOP'
      },
      sulphur: {
        value: Math.random() * 20 + 10,
        unit: 'kg/ha',
        status: Math.random() > 0.6 ? 'adequate' : 'deficient',
        recommendation: 'Apply 20 kg S/ha through gypsum or ammonium sulphate'
      }
    },
    micronutrients: request.testType === 'comprehensive' || request.testType === 'micronutrient' ? {
      zinc: {
        value: Math.random() * 2 + 0.5,
        unit: 'ppm',
        status: soilTypeInfo.common_issues.includes('zinc_deficiency') ? 'deficient' : 'adequate',
        recommendation: soilTypeInfo.common_issues.includes('zinc_deficiency') ?
          'Apply 25 kg ZnSO4/ha or 5 kg Zn/ha' : 'Zinc levels are adequate'
      },
      iron: {
        value: Math.random() * 10 + 4,
        unit: 'ppm',
        status: soilTypeInfo.common_issues.includes('iron_deficiency') ? 'deficient' : 'adequate',
        recommendation: soilTypeInfo.common_issues.includes('iron_deficiency') ?
          'Apply 50 kg FeSO4/ha or foliar spray of 0.5% FeSO4' : 'Iron levels are adequate'
      },
      manganese: {
        value: Math.random() * 5 + 2,
        unit: 'ppm',
        status: 'adequate',
        recommendation: 'Manganese levels are adequate'
      },
      copper: {
        value: Math.random() * 3 + 1,
        unit: 'ppm',
        status: 'adequate',
        recommendation: 'Copper levels are adequate'
      },
      boron: {
        value: Math.random() * 1 + 0.3,
        unit: 'ppm',
        status: Math.random() > 0.7 ? 'adequate' : 'deficient',
        recommendation: 'Apply 10 kg borax/ha if deficient'
      }
    } : undefined
  }
  
  // Generate fertilizer recommendations
  const fertilizerRecommendations = generateFertilizerRecommendations(testResults, request)
  
  // Calculate soil health score
  const soilHealthScore = calculateSoilHealthScore(testResults, soilTypeInfo)
  
  // Generate crop suitability
  const cropSuitability = generateCropSuitability(testResults, soilTypeInfo)
  
  // Generate improvement plan
  const improvementPlan = generateImprovementPlan(testResults, soilTypeInfo)
  
  return {
    success: true,
    data: {
      testResults,
      fertilizerRecommendations,
      soilHealthScore,
      cropSuitability,
      improvementPlan,
      monitoring: {
        next_test_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        parameters_to_monitor: ['pH', 'organic_carbon', 'major_nutrients'],
        frequency: 'Annual testing recommended'
      }
    }
  }
}

function generateFertilizerRecommendations(
  testResults: SoilTestResults, 
  request: SoilTestRequest
): FertilizerRecommendation[] {
  const recommendations: FertilizerRecommendation[] = []
  
  // Common crops in Punjab
  const crops = request.farmDetails.currentCrop ? 
    [request.farmDetails.currentCrop] : 
    ['wheat', 'rice', 'maize']
  
  for (const crop of crops) {
    const cropRecommendation: FertilizerRecommendation = {
      crop,
      season: crop === 'wheat' ? 'rabi' : crop === 'rice' ? 'kharif' : 'kharif',
      recommendations: {
        basal: [
          {
            fertilizer: 'DAP',
            quantity: crop === 'wheat' ? 125 : crop === 'rice' ? 62 : 100,
            unit: 'kg/ha',
            timing: 'At sowing/transplanting',
            method: 'Broadcasting and incorporation',
            cost: crop === 'wheat' ? 6250 : crop === 'rice' ? 3100 : 5000
          }
        ],
        top_dressing: [
          {
            fertilizer: 'Urea',
            quantity: crop === 'wheat' ? 130 : crop === 'rice' ? 130 : 110,
            unit: 'kg/ha',
            timing: '21 days after sowing/transplanting',
            method: 'Side placement',
            cost: crop === 'wheat' ? 780 : crop === 'rice' ? 780 : 660
          }
        ],
        micronutrients: testResults.micronutrients?.zinc.status === 'deficient' ? [
          {
            nutrient: 'Zinc',
            source: 'Zinc Sulphate',
            quantity: 25,
            unit: 'kg/ha',
            application_method: 'Soil application',
            cost: 500
          }
        ] : []
      },
      total_cost: crop === 'wheat' ? 7500 : crop === 'rice' ? 4380 : 6160,
      expected_yield_increase: '10-15%',
      roi: '3:1'
    }
    
    recommendations.push(cropRecommendation)
  }
  
  return recommendations
}

function calculateSoilHealthScore(testResults: SoilTestResults, soilTypeInfo: any): SoilHealthScore {
  let chemicalScore = 70
  let physicalScore = 75
  let biologicalScore = 60
  
  // Chemical score based on pH, nutrients, salinity
  if (testResults.basicParameters.pH.status === 'neutral') chemicalScore += 15
  else if (testResults.basicParameters.pH.status === 'alkaline') chemicalScore -= 10
  else chemicalScore -= 5
  
  if (testResults.nutrients.nitrogen.status === 'adequate') chemicalScore += 5
  if (testResults.nutrients.phosphorus.status === 'adequate') chemicalScore += 5
  if (testResults.nutrients.potassium.status === 'adequate') chemicalScore += 5
  
  // Physical score based on texture and organic matter
  if (testResults.basicParameters.organic_carbon.status === 'high') {
    physicalScore += 15
    biologicalScore += 20
  } else if (testResults.basicParameters.organic_carbon.status === 'low') {
    physicalScore -= 10
    biologicalScore -= 15
  }
  
  const overallScore = Math.round((chemicalScore + physicalScore + biologicalScore) / 3)
  
  const improvementAreas: string[] = []
  const strengths: string[] = []
  
  if (chemicalScore < 70) improvementAreas.push('Nutrient management')
  else strengths.push('Good chemical properties')
  
  if (physicalScore < 70) improvementAreas.push('Soil structure improvement')
  else strengths.push('Good physical properties')
  
  if (biologicalScore < 70) improvementAreas.push('Organic matter enhancement')
  else strengths.push('Good biological activity')
  
  return {
    overall_score: overallScore,
    categories: {
      chemical: chemicalScore,
      physical: physicalScore,
      biological: biologicalScore
    },
    improvement_areas: improvementAreas,
    strengths: strengths,
    management_practices: [
      'Regular organic matter addition',
      'Balanced fertilization',
      'Proper drainage management',
      'Crop rotation practices'
    ]
  }
}

function generateCropSuitability(testResults: SoilTestResults, soilTypeInfo: any) {
  const crops = [
    {
      crop: 'Wheat',
      base_suitability: 85,
      ph_preference: { min: 6.0, max: 8.0 },
      considerations: ['Good for rabi season', 'Requires well-drained soil']
    },
    {
      crop: 'Rice',
      base_suitability: 80,
      ph_preference: { min: 5.5, max: 7.0 },
      considerations: ['Suitable for kharif season', 'Tolerates waterlogging']
    },
    {
      crop: 'Cotton',
      base_suitability: 75,
      ph_preference: { min: 6.0, max: 8.5 },
      considerations: ['Cash crop potential', 'Requires good drainage']
    },
    {
      crop: 'Maize',
      base_suitability: 85,
      ph_preference: { min: 6.0, max: 7.5 },
      considerations: ['Short duration crop', 'Good market demand']
    }
  ]
  
  return crops.map(crop => {
    let suitability_score = crop.base_suitability
    const reasons: string[] = []
    const modifications_needed: string[] = []
    
    // Adjust based on pH
    const pH = testResults.basicParameters.pH.value
    if (pH < crop.ph_preference.min || pH > crop.ph_preference.max) {
      suitability_score -= 15
      if (pH > crop.ph_preference.max) {
        modifications_needed.push('Reduce soil alkalinity with gypsum')
      } else {
        modifications_needed.push('Increase soil pH with lime')
      }
    } else {
      reasons.push('pH is suitable for crop growth')
    }
    
    // Check nutrients
    if (testResults.nutrients.nitrogen.status === 'adequate') {
      reasons.push('Adequate nitrogen levels')
    } else {
      modifications_needed.push('Apply nitrogen fertilizers')
    }
    
    if (testResults.nutrients.phosphorus.status === 'adequate') {
      reasons.push('Good phosphorus availability')
    } else {
      modifications_needed.push('Apply phosphorus fertilizers')
    }
    
    // Organic matter consideration
    if (testResults.basicParameters.organic_carbon.status === 'low') {
      modifications_needed.push('Increase organic matter through FYM')
      suitability_score -= 5
    }
    
    return {
      crop: crop.crop,
      suitability_score: Math.max(0, Math.min(100, suitability_score)),
      reasons: reasons.length > 0 ? reasons : crop.considerations,
      modifications_needed
    }
  }).sort((a, b) => b.suitability_score - a.suitability_score)
}

function generateImprovementPlan(testResults: SoilTestResults, soilTypeInfo: any) {
  const immediate_actions: string[] = []
  const short_term: string[] = []
  const long_term: string[] = []
  const organic_amendments: Array<{amendment: string, quantity: string, benefit: string, cost: number}> = []
  
  // Based on test results, generate recommendations
  if (testResults.basicParameters.pH.status === 'alkaline') {
    immediate_actions.push('Apply gypsum to reduce alkalinity')
    short_term.push('Monitor pH after gypsum application')
  }
  
  if (testResults.basicParameters.organic_carbon.status === 'low') {
    immediate_actions.push('Plan organic matter incorporation')
    organic_amendments.push({
      amendment: 'Farm Yard Manure',
      quantity: '10-12 tons/ha',
      benefit: 'Improves soil structure and water retention',
      cost: 8000
    })
    organic_amendments.push({
      amendment: 'Vermicompost',
      quantity: '2-3 tons/ha',
      benefit: 'Rich in nutrients and beneficial microbes',
      cost: 4500
    })
  }
  
  if (testResults.nutrients.nitrogen.status === 'deficient') {
    immediate_actions.push('Apply nitrogen fertilizers as per recommendation')
  }
  
  // General recommendations
  short_term.push('Implement proper irrigation scheduling')
  short_term.push('Practice crop rotation')
  short_term.push('Use cover crops during off-season')
  
  long_term.push('Develop integrated nutrient management system')
  long_term.push('Establish soil health monitoring program')
  long_term.push('Implement conservation agriculture practices')
  
  return {
    immediate_actions,
    short_term,
    long_term,
    organic_amendments
  }
}

function getDistrictSoilInfo(district: string) {
  const soilInfo = PUNJAB_SOIL_TYPES[district as keyof typeof PUNJAB_SOIL_TYPES]
  
  if (!soilInfo) {
    return {
      error: 'Soil information not available for this district',
      available_districts: Object.keys(PUNJAB_SOIL_TYPES)
    }
  }
  
  return {
    district,
    soil_type: soilInfo.predominant_type,
    typical_ph: soilInfo.typical_ph,
    common_issues: soilInfo.common_issues,
    suitable_crops: soilInfo.suitable_crops,
    recommendations: [
      'Conduct regular soil testing',
      'Follow balanced fertilization',
      'Maintain proper drainage',
      'Add organic matter regularly'
    ]
  }
}

async function getTestResults(testId: string) {
  // Mock function to retrieve specific test results
  // In real implementation, this would query a database
  return {
    success: true,
    data: {
      testId,
      status: 'Results available',
      message: 'Test results can be downloaded or viewed online'
    }
  }
}