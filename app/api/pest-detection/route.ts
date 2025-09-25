import { NextRequest, NextResponse } from 'next/server'

interface PestDetectionRequest {
  image?: string // Base64 encoded image
  cropType?: string
  symptoms?: string[]
  location?: {
    district: string
    coordinates?: {
      lat: number
      lon: number
    }
  }
  farmingStage?: 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest'
}

interface PestInfo {
  id: string
  name: {
    english: string
    scientific: string
    punjabi: string
    hindi: string
  }
  type: 'insect' | 'disease' | 'weed' | 'nematode' | 'viral' | 'fungal' | 'bacterial'
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number // 0-100
  crops_affected: string[]
  lifecycle: string
  damage_description: string
  symptoms: string[]
  images: string[]
  economic_threshold: string
  favorable_conditions: string[]
}

interface TreatmentRecommendation {
  id: string
  type: 'cultural' | 'biological' | 'chemical' | 'integrated'
  method: string
  products: Array<{
    name: string
    activeIngredient: string
    dosage: string
    applicationMethod: string
    cost: number
    availability: string
  }>
  timing: string
  effectiveness: number // 0-100
  cost: number
  safetyRating: 'low' | 'medium' | 'high'
  organicCompatible: boolean
  resistance_management: string[]
  precautions: string[]
  application_instructions: string[]
}

interface PestDetectionResponse {
  success: boolean
  data: {
    detectedPests: PestInfo[]
    recommendations: TreatmentRecommendation[]
    severity_assessment: {
      overall_risk: 'low' | 'medium' | 'high' | 'critical'
      damage_potential: number // 0-100
      urgency: 'monitor' | 'action_needed' | 'immediate_action'
      estimated_yield_loss: number // percentage
    }
    prevention_tips: string[]
    monitoring_schedule: Array<{
      activity: string
      frequency: string
      timing: string
    }>
    integrated_management: {
      cultural_practices: string[]
      biological_control: string[]
      chemical_control: string[]
      timing_calendar: string[]
    }
  }
  processing_info: {
    method: 'image_analysis' | 'symptom_matching' | 'hybrid'
    processing_time: number
    model_version: string
    accuracy: number
  }
  error?: string
}

// Punjab-specific pest database
const PUNJAB_PESTS_DB = [
  {
    id: 'aphid_001',
    name: {
      english: 'Aphid',
      scientific: 'Aphis craccivora',
      punjabi: 'ਚਿੱਪੜ',
      hindi: 'चिप्पड़'
    },
    type: 'insect' as const,
    crops_affected: ['wheat', 'mustard', 'pea', 'gram'],
    lifecycle: 'Egg → Nymph → Adult (7-10 days)',
    damage_description: 'Sucks plant sap, causes yellowing and stunting',
    symptoms: [
      'Curling of leaves',
      'Yellowing of plants', 
      'Sticky honeydew on leaves',
      'Presence of ants',
      'Stunted growth'
    ],
    images: ['aphid_1.jpg', 'aphid_2.jpg'],
    economic_threshold: '5-10 aphids per plant',
    favorable_conditions: [
      'Cool weather (15-25°C)',
      'High humidity',
      'Nitrogen-rich plants',
      'Dry spell followed by rain'
    ]
  },
  {
    id: 'stem_borer_001',
    name: {
      english: 'Rice Stem Borer',
      scientific: 'Scirpophaga incertulas',
      punjabi: 'ਤਣੇ ਦਾ ਬੋਰਰ',
      hindi: 'तना छेदक'
    },
    type: 'insect' as const,
    crops_affected: ['rice', 'wheat'],
    lifecycle: 'Egg → Larva → Pupa → Adult (25-35 days)',
    damage_description: 'Larvae bore into stems causing deadheart and whitehead',
    symptoms: [
      'Dead heart in young plants',
      'White head in older plants',
      'Small holes in stem',
      'Yellowing of central shoot',
      'Easy pulling of dead shoots'
    ],
    images: ['stem_borer_1.jpg', 'stem_borer_2.jpg'],
    economic_threshold: '5% dead hearts or white heads',
    favorable_conditions: [
      'High humidity (>80%)',
      'Temperature 25-30°C',
      'Dense planting',
      'Continuous flooding'
    ]
  },
  {
    id: 'blast_001',
    name: {
      english: 'Rice Blast',
      scientific: 'Pyricularia oryzae',
      punjabi: 'ਧਾਨ ਦੀ ਬਲਾਸਟ',
      hindi: 'धान का ब्लास्ट'
    },
    type: 'fungal' as const,
    crops_affected: ['rice'],
    lifecycle: 'Spore germination → Infection → Sporulation (7-14 days)',
    damage_description: 'Fungal disease causing lesions on leaves, neck, and panicles',
    symptoms: [
      'Diamond-shaped lesions on leaves',
      'Gray center with brown margins',
      'Neck rot in panicles',
      'Complete panicle breakage',
      'Poor grain filling'
    ],
    images: ['blast_1.jpg', 'blast_2.jpg'],
    economic_threshold: '1-2 lesions per leaf',
    favorable_conditions: [
      'High humidity (>90%)',
      'Temperature 25-28°C',
      'Nitrogen excess',
      'Dense canopy',
      'Water stress'
    ]
  },
  {
    id: 'bollworm_001',
    name: {
      english: 'Cotton Bollworm',
      scientific: 'Helicoverpa armigera',
      punjabi: 'ਕਪਾਹ ਦਾ ਕੀੜਾ',
      hindi: 'कपास का कीड़ा'
    },
    type: 'insect' as const,
    crops_affected: ['cotton', 'tomato', 'pigeon pea'],
    lifecycle: 'Egg → Larva → Pupa → Adult (25-30 days)',
    damage_description: 'Larvae feed on bolls, flowers, and developing fruits',
    symptoms: [
      'Holes in bolls and squares',
      'Presence of larvae inside bolls',
      'Dropping of squares and bolls',
      'Excreta pellets near entry holes',
      'Reduced boll weight'
    ],
    images: ['bollworm_1.jpg', 'bollworm_2.jpg'],
    economic_threshold: '1 larva per plant or 10% damaged bolls',
    favorable_conditions: [
      'Temperature 25-30°C',
      'Moderate humidity',
      'Flowering stage of crop',
      'Previous crop infestation'
    ]
  }
]

// Treatment recommendations database
const TREATMENT_RECOMMENDATIONS = [
  {
    id: 'aphid_treatment_001',
    pestId: 'aphid_001',
    type: 'biological' as const,
    method: 'Predator Release',
    products: [
      {
        name: 'Ladybird Beetles',
        activeIngredient: 'Coccinella septempunctata',
        dosage: '2000 beetles per acre',
        applicationMethod: 'Field release',
        cost: 500,
        availability: 'Bio-control labs'
      }
    ],
    timing: 'Early infestation stage',
    effectiveness: 80,
    cost: 500,
    safetyRating: 'low' as const,
    organicCompatible: true,
    resistance_management: ['Rotate with other methods'],
    precautions: ['Avoid pesticide spray for 15 days'],
    application_instructions: [
      'Release in evening hours',
      'Ensure adequate humidity',
      'Monitor establishment'
    ]
  },
  {
    id: 'aphid_treatment_002',
    pestId: 'aphid_001',
    type: 'chemical' as const,
    method: 'Insecticide Spray',
    products: [
      {
        name: 'Imidacloprid 17.8% SL',
        activeIngredient: 'Imidacloprid',
        dosage: '100 ml per acre',
        applicationMethod: 'Foliar spray',
        cost: 200,
        availability: 'Widely available'
      }
    ],
    timing: 'ETL reached (5-10 aphids per plant)',
    effectiveness: 90,
    cost: 200,
    safetyRating: 'medium' as const,
    organicCompatible: false,
    resistance_management: [
      'Alternate with different modes of action',
      'Use only when ETL is reached'
    ],
    precautions: [
      'Use protective equipment',
      'Avoid spray during flowering',
      'Follow PHI period'
    ],
    application_instructions: [
      'Spray in morning or evening',
      'Add sticker-spreader',
      'Cover undersides of leaves'
    ]
  },
  {
    id: 'blast_treatment_001',
    pestId: 'blast_001',
    type: 'chemical' as const,
    method: 'Fungicide Spray',
    products: [
      {
        name: 'Tricyclazole 75% WP',
        activeIngredient: 'Tricyclazole',
        dosage: '200 grams per acre',
        applicationMethod: 'Foliar spray',
        cost: 300,
        availability: 'Agricultural stores'
      }
    ],
    timing: 'Preventive: Tillering stage, Curative: At first symptom',
    effectiveness: 85,
    cost: 300,
    safetyRating: 'medium' as const,
    organicCompatible: false,
    resistance_management: [
      'Alternate with mancozeb',
      'Maximum 2 sprays per season'
    ],
    precautions: [
      'Do not spray during rain',
      'Use protective clothing',
      'Maintain spray interval of 15 days'
    ],
    application_instructions: [
      'Thorough coverage required',
      'Add surfactant for better adhesion',
      'Spray before 10 AM or after 4 PM'
    ]
  }
]

export async function POST(request: NextRequest) {
  try {
    const body: PestDetectionRequest = await request.json()
    
    console.log('Pest detection request received')
    
    // Simulate AI processing time
    const processingStart = Date.now()
    
    let detectionResult: PestDetectionResponse
    
    if (body.image) {
      // Image-based detection
      detectionResult = await processImageDetection(body)
    } else if (body.symptoms && body.symptoms.length > 0) {
      // Symptom-based detection
      detectionResult = await processSymptomDetection(body)
    } else {
      // General pest info based on location and crop
      detectionResult = await processGeneralPestInfo(body)
    }
    
    const processingTime = Date.now() - processingStart
    detectionResult.processing_info.processing_time = processingTime
    
    return NextResponse.json(detectionResult)
  } catch (error) {
    console.error('Pest detection API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process pest detection request'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cropType = searchParams.get('crop')
    const pestType = searchParams.get('type')
    const district = searchParams.get('district')
    
    // Return common pests for the specified parameters
    let filteredPests = PUNJAB_PESTS_DB
    
    if (cropType) {
      filteredPests = filteredPests.filter(pest => 
        pest.crops_affected.some(crop => 
          crop.toLowerCase().includes(cropType.toLowerCase())
        )
      )
    }
    
    if (pestType) {
      filteredPests = filteredPests.filter(pest => 
        pest.type === pestType
      )
    }
    
    const pestInfo = filteredPests.map(pest => ({
      ...pest,
      severity: 'medium' as const,
      confidence: 85
    }))
    
    return NextResponse.json({
      success: true,
      data: {
        detectedPests: pestInfo,
        recommendations: [],
        totalPests: pestInfo.length,
        location: district || 'Punjab'
      }
    })
  } catch (error) {
    console.error('Pest info API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pest information'
    }, { status: 500 })
  }
}

async function processImageDetection(request: PestDetectionRequest): Promise<PestDetectionResponse> {
  // Simulate AI model processing
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock detection results
  const detectedPests = [PUNJAB_PESTS_DB[0]].map(pest => ({
    ...pest,
    severity: 'medium' as const,
    confidence: 78
  }))
  
  const recommendations = getRecommendationsForPests(detectedPests.map(p => p.id))
  
  return {
    success: true,
    data: {
      detectedPests,
      recommendations,
      severity_assessment: {
        overall_risk: 'medium',
        damage_potential: 35,
        urgency: 'action_needed',
        estimated_yield_loss: 10
      },
      prevention_tips: [
        'Remove alternate hosts',
        'Use yellow sticky traps',
        'Maintain field sanitation',
        'Monitor weekly during susceptible stages'
      ],
      monitoring_schedule: [
        {
          activity: 'Visual inspection',
          frequency: 'Weekly',
          timing: 'Early morning'
        },
        {
          activity: 'Trap monitoring',
          frequency: 'Twice weekly',
          timing: 'Any time'
        }
      ],
      integrated_management: {
        cultural_practices: [
          'Use resistant varieties',
          'Proper plant spacing',
          'Timely removal of weeds'
        ],
        biological_control: [
          'Release natural enemies',
          'Use bio-pesticides',
          'Conserve beneficial insects'
        ],
        chemical_control: [
          'Use only when ETL is reached',
          'Rotate insecticides',
          'Follow label recommendations'
        ],
        timing_calendar: [
          'Monitor: Throughout season',
          'Cultural control: Land preparation',
          'Biological control: Early season',
          'Chemical control: When ETL reached'
        ]
      }
    },
    processing_info: {
      method: 'image_analysis',
      processing_time: 2000,
      model_version: 'PestNet v2.1',
      accuracy: 78
    }
  }
}

async function processSymptomDetection(request: PestDetectionRequest): Promise<PestDetectionResponse> {
  // Match symptoms to known pests
  const matchingPests: PestInfo[] = []
  
  for (const pest of PUNJAB_PESTS_DB) {
    let matchScore = 0
    let totalSymptoms = request.symptoms!.length
    
    for (const symptom of request.symptoms!) {
      if (pest.symptoms.some(pestSymptom => 
        pestSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
        symptom.toLowerCase().includes(pestSymptom.toLowerCase())
      )) {
        matchScore++
      }
    }
    
    const confidence = (matchScore / totalSymptoms) * 100
    
    if (confidence > 30) {
      matchingPests.push({
        ...pest,
        severity: confidence > 70 ? 'high' : confidence > 50 ? 'medium' : 'low',
        confidence: Math.round(confidence)
      })
    }
  }
  
  // Sort by confidence
  matchingPests.sort((a, b) => b.confidence - a.confidence)
  
  const recommendations = getRecommendationsForPests(matchingPests.map(p => p.id))
  
  return {
    success: true,
    data: {
      detectedPests: matchingPests.slice(0, 3), // Top 3 matches
      recommendations,
      severity_assessment: {
        overall_risk: matchingPests.length > 0 ? 
          (matchingPests[0].confidence > 70 ? 'high' : 'medium') : 'low',
        damage_potential: matchingPests.length > 0 ? matchingPests[0].confidence : 0,
        urgency: matchingPests.length > 0 ? 
          (matchingPests[0].confidence > 70 ? 'immediate_action' : 'action_needed') : 'monitor',
        estimated_yield_loss: matchingPests.length > 0 ? 
          Math.round(matchingPests[0].confidence * 0.3) : 0
      },
      prevention_tips: [
        'Regular field monitoring',
        'Use certified seeds',
        'Maintain proper plant nutrition',
        'Follow crop rotation'
      ],
      monitoring_schedule: [
        {
          activity: 'Symptom check',
          frequency: 'Daily during critical stages',
          timing: 'Morning inspection'
        }
      ],
      integrated_management: {
        cultural_practices: ['Field sanitation', 'Proper drainage'],
        biological_control: ['Beneficial microorganisms', 'Natural enemies'],
        chemical_control: ['Need-based application', 'Resistance management'],
        timing_calendar: ['Season-long monitoring']
      }
    },
    processing_info: {
      method: 'symptom_matching',
      processing_time: 500,
      model_version: 'SymptomMatch v1.3',
      accuracy: matchingPests.length > 0 ? matchingPests[0].confidence : 0
    }
  }
}

async function processGeneralPestInfo(request: PestDetectionRequest): Promise<PestDetectionResponse> {
  // Filter pests based on location and crop
  let relevantPests = PUNJAB_PESTS_DB
  
  if (request.cropType) {
    relevantPests = relevantPests.filter(pest =>
      pest.crops_affected.includes(request.cropType!)
    )
  }
  
  const pestInfo = relevantPests.slice(0, 5).map(pest => ({
    ...pest,
    severity: 'medium' as const,
    confidence: 65
  }))
  
  const recommendations = getRecommendationsForPests(pestInfo.map(p => p.id))
  
  return {
    success: true,
    data: {
      detectedPests: pestInfo,
      recommendations,
      severity_assessment: {
        overall_risk: 'medium',
        damage_potential: 40,
        urgency: 'monitor',
        estimated_yield_loss: 5
      },
      prevention_tips: [
        'Implement IPM practices',
        'Regular monitoring',
        'Use resistant varieties',
        'Maintain field hygiene'
      ],
      monitoring_schedule: [
        {
          activity: 'Field scouting',
          frequency: 'Weekly',
          timing: 'Morning hours'
        }
      ],
      integrated_management: {
        cultural_practices: ['Crop rotation', 'Intercropping', 'Timely operations'],
        biological_control: ['Conservation of natural enemies', 'Bio-agents'],
        chemical_control: ['Judicious use', 'ETL-based application'],
        timing_calendar: ['Season-specific management']
      }
    },
    processing_info: {
      method: 'hybrid',
      processing_time: 300,
      model_version: 'GeneralPest v1.0',
      accuracy: 65
    }
  }
}

function getRecommendationsForPests(pestIds: string[]): TreatmentRecommendation[] {
  const recommendations: TreatmentRecommendation[] = []
  
  for (const pestId of pestIds) {
    const pestRecommendations = TREATMENT_RECOMMENDATIONS.filter(tr => tr.pestId === pestId)
    recommendations.push(...pestRecommendations)
  }
  
  return recommendations
}