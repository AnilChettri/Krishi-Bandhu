import { Language } from './i18n'
import { punjabKnowledgeBase } from './punjab-knowledge-base'

// Response types for the assistant
export interface AssistantResponse {
  isValid: boolean
  module: string
  content: string
  confidence: number
  sources: string[]
  language: string
  channel: string
}

export type DeliveryChannel = 'sms' | 'whatsapp' | 'push' | 'voice'

// Punjab Agriculture Knowledge Base Types
export interface PunjabKnowledgeBase {
  crops: CropInfo[]
  schemes: GovernmentScheme[]
  weather: WeatherAdvice[]
  pests: PestInfo[]
  soil: SoilAdvice[]
  markets: MarketInfo[]
}

export interface WeatherAdvice {
  id: string
  district: string
  date: string
  advisory: {
    english: string
    punjabi: string
  }
  source: string
}

export interface PestInfo {
  id: string
  name: {
    english: string
    punjabi: string
  }
  crops_affected: string[]
  symptoms: string[]
  treatment: string[]
  prevention: string[]
  source: string
}

export interface SoilAdvice {
  id: string
  soil_type: string
  ph_range: string
  suitable_crops: string[]
  improvement_methods: string[]
  fertilizer_recommendations: string[]
  source: string
}

export interface MarketInfo {
  id: string
  mandi_name: string
  crop: string
  price_per_quintal: number
  date: string
  grade: string
  source: string
}

export interface CropInfo {
  id: string
  name: {
    english: string
    punjabi: string
    gurmukhi: string
    scientific: string
  }
  category: 'cereal' | 'pulse' | 'oilseed' | 'vegetable' | 'fruit' | 'fodder' | 'cash'
  season: 'kharif' | 'rabi' | 'summer' | 'perennial'
  varieties: string[]
  sowing_period: {
    start: string
    end: string
    optimal: string
  }
  water_requirement: 'low' | 'medium' | 'high'
  soil_type: string[]
  spacing: string
  seed_rate: string
  fertilizer: FertilizerSchedule[]
  common_pests: string[]
  diseases: string[]
  market_season: string
  pau_recommendations: string[]
  source: string
}

export interface GovernmentScheme {
  id: string
  name: {
    english: string
    punjabi: string
  }
  department: string
  category: 'subsidy' | 'loan' | 'insurance' | 'training' | 'equipment'
  eligibility: string[]
  benefits: string[]
  application_process: string
  documents_required: string[]
  contact: ContactInfo
  source: string
}

export interface AIAssistantRequest {
  module: 'get_advice' | 'plan_crop' | 'weather_alerts' | 'mandi_rates' | 'government_schemes' | 'soil_fertility' | 'dairy_livestock'
  query: string
  location?: {
    district: string
    tehsil?: string
    village?: string
  }
  farm_details?: {
    size_acres: number
    soil_type?: string
    water_source?: string
    previous_crop?: string
    current_crop?: string
  }
  farmer_details?: {
    experience: 'beginner' | 'intermediate' | 'experienced'
    language_preference: 'english' | 'punjabi' | 'both'
  }
  context?: string
}

export interface AIAssistantResponse {
  success: boolean
  module: string
  title: {
    english: string
    punjabi: string
  }
  content: {
    english: string
    punjabi: string
  }
  recommendations: Recommendation[]
  confidence: number
  confidence_reason: string
  sources: string[]
  delivery_channels: DeliveryChannels
  metadata: {
    query_type: string
    location: string
    timestamp: string
    processing_time_ms: number
  }
  warnings?: string[]
  disclaimers: string[]
}

export interface Recommendation {
  type: 'immediate_action' | 'seasonal_planning' | 'input_application' | 'market_timing' | 'preventive_measure'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: {
    english: string
    punjabi: string
  }
  description: {
    english: string
    punjabi: string
  }
  timeline: string
  inputs_required?: InputRequirement[]
  cost_estimate?: string
  expected_outcome: string
}

export interface DeliveryChannels {
  sms: {
    content: string
    characters: number
  }
  whatsapp: {
    content: string
    characters: number
  }
  push_notification: {
    title: string
    content: string
    characters: number
  }
  voice_note: {
    script_punjabi: string
    estimated_duration_seconds: number
    pronunciation_guide?: string
  }
}

export interface FertilizerSchedule {
  stage: string
  fertilizer: string
  rate: string
  method: string
  timing: string
}

export interface ContactInfo {
  phone: string
  email?: string
  office_address?: string
  website?: string
}

export interface InputRequirement {
  item: string
  quantity: string
  unit: string
  estimated_cost?: string
  source?: string
}

// Domain validation patterns for Punjab agriculture
const AGRICULTURE_KEYWORDS = [
  // Crops (English)
  'wheat', 'paddy', 'rice', 'maize', 'cotton', 'sugarcane', 'mustard', 'barley',
  'moong', 'mash', 'chana', 'gram', 'potato', 'onion', 'cauliflower', 'peas',
  'kinnow', 'guava', 'mango', 'berseem', 'jowar', 'sorghum',
  
  // Crops (Punjabi/Hindi)
  'ਗੈਂਹੂਂ', 'ਧਾਨ', 'ਮੱਕੀ', 'ਕਪਾਹ', 'ਗੰਨਾ', 'ਸਰੋਂ', 'ਜੌ', 'ਮੂੰਗ',
  'ਮਾਸ਼', 'ਚਨਾ', 'ਆਲੂ', 'ਪਿਆਜ਼', 'ਫੁੱਲਗੋਭੀ', 'ਮਟਰ', 'ਕਿੰਨੂ', 'ਅਮਰੂਦ',
  'गेंहूं', 'धान', 'मक्की', 'कपास', 'गन्ना', 'सरसों',
  
  // Agriculture terms
  'farming', 'agriculture', 'crop', 'soil', 'fertilizer', 'pesticide', 'irrigation',
  'sowing', 'harvesting', 'mandi', 'market', 'price', 'scheme', 'subsidy',
  'weather', 'rainfall', 'pest', 'disease', 'seed', 'variety',
  
  // Punjabi agriculture terms
  'ਖੇਤੀ', 'ਫਸਲ', 'ਮਿੱਟੀ', 'ਪਾਣੀ', 'ਬੀਜ', 'ਮੰਡੀ', 'ਕੀਮਤ', 'ਸਕੀਮ',
  'ਮੌਸਮ', 'ਬਾਰਿਸ਼', 'ਕੀੜੇ', 'ਬਿਮਾਰੀ',
  
  // Farm management
  'dairy', 'livestock', 'buffalo', 'cow', 'milk', 'fodder', 'animal', 'poultry',
  'ਡੇਅਰੀ', 'ਪਸ਼ੂ', 'ਮੱਝ', 'ਗਾਂ', 'ਦੁੱਧ', 'ਚਾਰਾ'
]

const PROHIBITED_TOPICS = [
  'politics', 'election', 'government corruption', 'religion', 'movies', 'entertainment',
  'sports', 'celebrity', 'personal relationship', 'health medicine', 'legal advice',
  'financial investment', 'cryptocurrency', 'technology support', 'programming',
  'travel', 'food recipes', 'education', 'job search'
]

export class PunjabAIAssistant {
  private allowedModules: Set<string>
  
  constructor() {
    this.allowedModules = new Set([
      'crop_advice', 'crop_planning', 'weather', 'mandi_rates', 
      'govt_schemes', 'soil_health', 'dairy', 'pest_disease'
    ])
  }

  /**
   * Main entry point for AI assistant queries
   */
  async processQuery(
    query: string, 
    language: 'en' | 'pa', 
    channel: DeliveryChannel
  ): Promise<AssistantResponse> {
    try {
      // Step 1: Validate domain and scope
      const domainValidation = this.validateDomain(query)
      if (!domainValidation.isValid) {
        return {
          isValid: false,
          module: 'domain_validation',
          content: 'This assistant is dedicated to Punjab agriculture. Please ask me about farming, crops, weather, mandi, schemes, or soil.',
          confidence: 1.0,
          sources: ['FARMGUARD_Domain_Policy'],
          language: language,
          channel: channel
        }
      }

      // Step 2: Determine module based on query
      const module = this.determineModule(query)
      
      // Step 3: Retrieve relevant knowledge using RAG
      const retrievedContext = await this.retrieveContext(query)
      
      // Step 4: Generate response based on module
      const response = await this.generateResponse(query, module, retrievedContext, language, channel)
      
      return response

    } catch (error) {
      console.error('Punjab AI Assistant Error:', error)
      return this.createErrorResponse(query, language, channel, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Validate if query is within Punjab agriculture domain
   */
  private validateDomain(query: string): { isValid: boolean, reason?: string } {
    const queryLower = query.toLowerCase()
    
    // Check for prohibited topics
    const hasProhibitedContent = PROHIBITED_TOPICS.some(topic => 
      queryLower.includes(topic)
    )
    
    if (hasProhibitedContent) {
      return {
        isValid: false,
        reason: 'out_of_scope_prohibited'
      }
    }
    
    // Check for agriculture keywords
    const hasAgricultureContent = AGRICULTURE_KEYWORDS.some(keyword => 
      queryLower.includes(keyword.toLowerCase())
    )
    
    if (!hasAgricultureContent && queryLower.length > 10) {
      // For longer queries, be more strict about agriculture content
      return {
        isValid: false,
        reason: 'out_of_scope_no_agriculture_content'
      }
    }
    
    return { isValid: true }
  }

  /**
   * Retrieve relevant context using RAG approach
   */
  private async retrieveContext(query: string): Promise<any[]> {
    const context: any[] = []
    const queryLower = query.toLowerCase()
    
    // Search crops
    const crops = punjabKnowledgeBase.searchCrops(queryLower)
    context.push(...crops)
    
    // Search schemes if relevant
    if (queryLower.includes('scheme') || queryLower.includes('subsidy') || queryLower.includes('ਸਕੀਮ')) {
      const schemes = punjabKnowledgeBase.searchSchemes(queryLower)
      context.push(...schemes)
    }
    
    // Search pests if relevant
    if (queryLower.includes('pest') || queryLower.includes('disease') || queryLower.includes('ਕੀੜੇ')) {
      const pests = punjabKnowledgeBase.searchPests(queryLower)
      context.push(...pests)
    }
    
    // Search market data if relevant
    if (queryLower.includes('price') || queryLower.includes('mandi') || queryLower.includes('rate')) {
      const marketData = punjabKnowledgeBase.searchMarketData(queryLower)
      context.push(...marketData)
    }
    
    return context
  }

  /**
   * Determine module based on query content
   */
  private determineModule(query: string): string {
    const queryLower = query.toLowerCase()
    
    if (queryLower.includes('pest') || queryLower.includes('disease') || queryLower.includes('ਕੀੜੇ')) {
      return 'pest_disease'
    }
    if (queryLower.includes('price') || queryLower.includes('mandi') || queryLower.includes('rate')) {
      return 'mandi_rates'
    }
    if (queryLower.includes('scheme') || queryLower.includes('subsidy') || queryLower.includes('ਸਕੀਮ')) {
      return 'govt_schemes'
    }
    if (queryLower.includes('weather') || queryLower.includes('rain') || queryLower.includes('ਮੌਸਮ')) {
      return 'weather'
    }
    if (queryLower.includes('soil') || queryLower.includes('fertility') || queryLower.includes('ਮਿੱਟੀ')) {
      return 'soil_health'
    }
    if (queryLower.includes('dairy') || queryLower.includes('milk') || queryLower.includes('ਦੁੱਧ')) {
      return 'dairy'
    }
    if (queryLower.includes('rotation') || queryLower.includes('planning') || queryLower.includes('summer')) {
      return 'crop_planning'
    }
    
    return 'crop_advice' // default
  }

  /**
   * Generate response based on module and context
   */
  private async generateResponse(
    query: string,
    module: string, 
    context: any[], 
    language: 'en' | 'pa', 
    channel: DeliveryChannel
  ): Promise<AssistantResponse> {
    
    let content = ''
    let confidence = 0.5
    let sources: string[] = []
    
    switch (module) {
      case 'crop_advice':
        ({ content, confidence, sources } = this.generateCropAdvice(query, context, language))
        break
      case 'pest_disease':
        ({ content, confidence, sources } = this.generatePestAdvice(query, context, language))
        break
      case 'mandi_rates':
        ({ content, confidence, sources } = this.generateMandiRates(query, context, language))
        break
      case 'govt_schemes':
        ({ content, confidence, sources } = this.generateSchemeInfo(query, context, language))
        break
      case 'weather':
        ({ content, confidence, sources } = this.generateWeatherAdvice(query, context, language))
        break
      case 'soil_health':
        ({ content, confidence, sources } = this.generateSoilAdvice(query, context, language))
        break
      case 'dairy':
        ({ content, confidence, sources } = this.generateDairyAdvice(query, context, language))
        break
      case 'crop_planning':
        ({ content, confidence, sources } = this.generateCropPlanning(query, context, language))
        break
      default:
        content = language === 'pa' 
          ? 'ਮਾਫ ਕਰਨਾ, ਮੈਂ ਇਸ ਬਾਰੇ ਜਾਣਕਾਰੀ ਨਹੀਂ ਦੇ ਸਕਦਾ।' 
          : 'Sorry, I cannot provide information about this topic.'
        confidence = 0.1
    }
    
    // Format for delivery channel
    content = this.formatForChannel(content, channel)
    
    return {
      isValid: true,
      module,
      content,
      confidence,
      sources,
      language,
      channel
    }
  }

  /**
   * Generate advice response for farmer queries
   */
  private generateAdviceResponse(request: AIAssistantRequest, context: any[]): AIAssistantResponse {
    const relevantCrop = context.find(item => item.name) as CropInfo
    
    if (!relevantCrop) {
      return {
        success: false,
        module: 'get_advice',
        title: {
          english: 'Information Not Available',
          punjabi: 'ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਨਹੀਂ'
        },
        content: {
          english: 'Not available in current records. Please contact your local KVK/PAU.',
          punjabi: 'ਮੌਜੂਦਾ ਰਿਕਾਰਡਾਂ ਵਿੱਚ ਉਪਲਬਧ ਨਹੀਂ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਸਥਾਨਕ KVK/PAU ਨਾਲ ਸੰਪਰਕ ਕਰੋ।'
        },
        recommendations: [],
        confidence: 0.1,
        confidence_reason: 'No relevant information found in knowledge base',
        sources: ['KVK_Contact_Required'],
        delivery_channels: this.createDeliveryChannels(
          'Contact local KVK for specific advice',
          'ਖਾਸ ਸਲਾਹ ਲਈ ਸਥਾਨਕ KVK ਨਾਲ ਸੰਪਰਕ ਕਰੋ'
        ),
        metadata: {
          query_type: 'advice_not_found',
          location: request.location?.district || 'unknown',
          timestamp: '',
          processing_time_ms: 0
        },
        disclaimers: ['Verify with PAU/KVK before chemical application.']
      }
    }

    // Generate specific advice based on crop and context
    return this.generateCropSpecificAdvice(request, relevantCrop)
  }

  private generateCropSpecificAdvice(request: AIAssistantRequest, crop: CropInfo): AIAssistantResponse {
    const currentMonth = new Date().getMonth() + 1
    const season = this.getCurrentSeason(currentMonth)
    
    const recommendations: Recommendation[] = []
    
    // Add seasonal recommendations
    if (crop.season === season || crop.season === 'perennial') {
      recommendations.push({
        type: 'seasonal_planning',
        priority: 'high',
        title: {
          english: `${crop.name.english} Management for ${season}`,
          punjabi: `${season} ਲਈ ${crop.name.punjabi} ਦੀ ਦੇਖਭਾਲ`
        },
        description: {
          english: `Optimal time for ${crop.name.english} cultivation. Follow PAU guidelines.`,
          punjabi: `${crop.name.punjabi} ਦੀ ਖੇਤੀ ਲਈ ਸਹੀ ਸਮਾਂ। PAU ਦੇ ਨਿਰਦੇਸ਼ਾਂ ਦਾ ਪਾਲਣ ਕਰੋ।`
        },
        timeline: crop.sowing_period.optimal,
        expected_outcome: `Better yield and quality for ${crop.name.english}`
      })
    }
    
    return {
      success: true,
      module: 'get_advice',
      title: {
        english: `${crop.name.english} Farming Advice`,
        punjabi: `${crop.name.punjabi} ਖੇਤੀ ਸਲਾਹ`
      },
      content: {
        english: `Based on PAU recommendations for ${crop.name.english} cultivation in Punjab.`,
        punjabi: `ਪੰਜਾਬ ਵਿੱਚ ${crop.name.punjabi} ਦੀ ਖੇਤੀ ਲਈ PAU ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ ਦੇ ਆਧਾਰ ਤੇ।`
      },
      recommendations,
      confidence: 0.85,
      confidence_reason: 'Based on PAU verified crop database',
      sources: [`PAU_${crop.name.english}_Guidelines`, crop.source],
      delivery_channels: this.createDeliveryChannels(
        `${crop.name.english} advice: Follow PAU guidelines for ${season} season`,
        `${crop.name.punjabi} ਸਲਾਹ: ${season} ਮੌਸਮ ਲਈ PAU ਨਿਰਦੇਸ਼ ਫਾਲੋ ਕਰੋ`
      ),
      metadata: {
        query_type: 'crop_advice',
        location: request.location?.district || 'punjab',
        timestamp: '',
        processing_time_ms: 0
      },
      disclaimers: [
        'Verify with PAU/KVK before chemical application.',
        'Adapt recommendations to local soil and weather conditions.'
      ]
    }
  }

  // Helper methods
  private createRejectionResponse(request: AIAssistantRequest, reason: string): AIAssistantResponse {
    return {
      success: false,
      module: request.module,
      title: {
        english: 'Outside Agriculture Domain',
        punjabi: 'ਖੇਤੀਬਾੜੀ ਦੇ ਖੇਤਰ ਤੋਂ ਬਾਹਰ'
      },
      content: {
        english: 'This assistant is dedicated to Punjab agriculture. Please ask me about farming, crops, weather, mandi, schemes, or soil.',
        punjabi: 'ਇਹ ਸਹਾਇਕ ਪੰਜਾਬ ਦੀ ਖੇਤੀਬਾੜੀ ਲਈ ਸਮਰਪਿਤ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਖੇਤੀ, ਫਸਲਾਂ, ਮੌਸਮ, ਮੰਡੀ, ਸਕੀਮਾਂ, ਜਾਂ ਮਿੱਟੀ ਬਾਰੇ ਪੁੱਛੋ।'
      },
      recommendations: [],
      confidence: 1.0,
      confidence_reason: 'Domain restriction enforced',
      sources: ['FARMGUARD_Domain_Policy'],
      delivery_channels: this.createDeliveryChannels(
        'Ask about Punjab farming, crops, weather, or schemes',
        'ਪੰਜਾਬ ਦੀ ਖੇਤੀ, ਫਸਲਾਂ, ਮੌਸਮ ਜਾਂ ਸਕੀਮਾਂ ਬਾਰੇ ਪੁੱਛੋ'
      ),
      metadata: {
        query_type: 'domain_rejection',
        location: 'punjab',
        timestamp: new Date().toISOString(),
        processing_time_ms: 0
      },
      disclaimers: ['This AI assistant only provides Punjab agriculture-related information.']
    }
  }


  private createDeliveryChannels(englishText: string, punjabiText: string): DeliveryChannels {
    const smsContent = englishText.substring(0, 150)
    const whatsappContent = `${englishText}\n\n${punjabiText}`.substring(0, 390)
    
    return {
      sms: {
        content: smsContent,
        characters: smsContent.length
      },
      whatsapp: {
        content: whatsappContent,
        characters: whatsappContent.length
      },
      push_notification: {
        title: 'FarmGuard Punjab',
        content: englishText.substring(0, 70),
        characters: englishText.substring(0, 70).length
      },
      voice_note: {
        script_punjabi: punjabiText,
        estimated_duration_seconds: Math.min(40, Math.max(25, punjabiText.length / 8)),
        pronunciation_guide: 'Standard Punjabi pronunciation'
      }
    }
  }

  private getCurrentSeason(month: number): 'kharif' | 'rabi' | 'summer' {
    if (month >= 6 && month <= 10) return 'kharif'
    if (month >= 11 || month <= 3) return 'rabi'
    return 'summer'
  }

  private inferCropCategory(query: string): string {
    if (query.includes('wheat') || query.includes('rice') || query.includes('maize')) return 'cereal'
    if (query.includes('cotton') || query.includes('sugarcane')) return 'cash'
    if (query.includes('moong') || query.includes('chana')) return 'pulse'
    return 'general'
  }

  // Placeholder methods for other modules
  private generateCropPlanResponse(request: AIAssistantRequest, context: any[]): AIAssistantResponse {
    // Implementation for crop planning
    return this.createPlaceholderResponse(request, 'Crop planning module under development')
  }

  private generateWeatherResponse(request: AIAssistantRequest, context: any[]): AIAssistantResponse {
    // Implementation for weather alerts
    return this.createPlaceholderResponse(request, 'Weather alerts module under development')
  }

  private generateMandiRatesResponse(request: AIAssistantRequest, context: any[]): AIAssistantResponse {
    // Implementation for mandi rates
    return this.createPlaceholderResponse(request, 'Mandi rates module under development')
  }

  private generateSchemesResponse(request: AIAssistantRequest, context: any[]): AIAssistantResponse {
    // Implementation for government schemes
    return this.createPlaceholderResponse(request, 'Government schemes module under development')
  }

  private generateSoilAdviceResponse(request: AIAssistantRequest, context: any[]): AIAssistantResponse {
    // Implementation for soil advice
    return this.createPlaceholderResponse(request, 'Soil advice module under development')
  }

  private generateDairyAdviceResponse(request: AIAssistantRequest, context: any[]): AIAssistantResponse {
    // Implementation for dairy/livestock advice
    return this.createPlaceholderResponse(request, 'Dairy/livestock module under development')
  }

  private createPlaceholderResponse(request: AIAssistantRequest, error: string): AIAssistantResponse {
    return {
      success: false,
      module: request.module,
      title: {
        english: 'Feature Under Development',
        punjabi: 'ਫੀਚਰ ਵਿਕਾਸ ਅਧੀਨ'
      },
      content: {
        english: error,
        punjabi: 'ਇਹ ਫੀਚਰ ਅਜੇ ਵਿਕਾਸ ਅਧੀਨ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
      },
      recommendations: [],
      confidence: 0.0,
      confidence_reason: error,
      sources: ['DEVELOPMENT_NOTICE'],
      delivery_channels: this.createDeliveryChannels(
        'Feature under development. Please try later.',
        'ਫੀਚਰ ਵਿਕਾਸ ਅਧੀਨ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
      ),
      metadata: {
        query_type: 'under_development',
        location: 'unknown',
        timestamp: new Date().toISOString(),
        processing_time_ms: 0
      },
      disclaimers: ['This feature is currently under development.']
    }
  }

  /**
   * Initialize the Punjab agriculture knowledge base
   */
  private initializeKnowledgeBase(): PunjabKnowledgeBase {
    return {
      crops: this.initializeCropsData(),
      schemes: this.initializeSchemesData(),
      weather: [],
      pests: [],
      soil: [],
      markets: []
    }
  }

  private initializeCropsData(): CropInfo[] {
    return [
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
        varieties: ['PBW 725', 'HD 3086', 'PBW 677', 'PBW 621'],
        sowing_period: {
          start: 'October 25',
          end: 'December 10',
          optimal: 'November 5-20'
        },
        water_requirement: 'high',
        soil_type: ['alluvial', 'clay_loam', 'sandy_loam'],
        spacing: '20-22.5 cm between rows',
        seed_rate: '40-50 kg/acre',
        fertilizer: [
          {
            stage: 'basal',
            fertilizer: 'DAP',
            rate: '62 kg/acre',
            method: 'broadcasting',
            timing: 'at_sowing'
          }
        ],
        common_pests: ['aphid', 'termite', 'shoot_fly'],
        diseases: ['yellow_rust', 'loose_smut', 'karnal_bunt'],
        market_season: 'April-May',
        pau_recommendations: [
          'Use certified seed from PAU',
          'Apply recommended fertilizer dose',
          'Maintain proper irrigation schedule'
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
        varieties: ['PR 126', 'Pusa 44', 'PR 121', 'PB 1509'],
        sowing_period: {
          start: 'May 20',
          end: 'June 30',
          optimal: 'June 10-20'
        },
        water_requirement: 'high',
        soil_type: ['clay', 'clay_loam'],
        spacing: '20 cm between rows, 10 cm plant to plant',
        seed_rate: '6-8 kg/acre (direct seeding), 4 kg/acre (transplanting)',
        fertilizer: [
          {
            stage: 'basal',
            fertilizer: 'DAP',
            rate: '31 kg/acre',
            method: 'broadcasting',
            timing: 'before_transplanting'
          }
        ],
        common_pests: ['stem_borer', 'leaf_folder', 'brown_plant_hopper'],
        diseases: ['blast', 'sheath_blight', 'bacterial_blight'],
        market_season: 'October-November',
        pau_recommendations: [
          'Transplant 25-30 days old seedlings',
          'Maintain 2-3 cm water level',
          'Use recommended varieties only'
        ],
        source: 'PAU_Ludhiana_Guidelines_2024'
      }
    ]
  }

  private initializeSchemesData(): GovernmentScheme[] {
    return [
      {
        id: 'crop_diversification_scheme',
        name: {
          english: 'Crop Diversification Scheme',
          punjabi: 'ਫਸਲ ਵਿਭਿੰਨਤਾ ਸਕੀਮ'
        },
        department: 'Punjab Agriculture Department',
        category: 'subsidy',
        eligibility: [
          'Farmers switching from paddy to alternative crops',
          'Minimum 1 acre land',
          'Valid land records'
        ],
        benefits: [
          'Rs 7000 per acre for maize',
          'Rs 9000 per acre for pulses',
          'Free seeds and technical support'
        ],
        application_process: 'Apply online at punjabagri.gov.in',
        documents_required: [
          'Land records (Khasra)',
          'Aadhaar card',
          'Bank account details',
          'Mobile number'
        ],
        contact: {
          phone: '0172-2221242',
          email: 'agri-punjab@gov.in',
          website: 'punjabagri.gov.in'
        },
        source: 'Punjab_Agriculture_Department_2024'
      }
    ]
  }

  /**
   * Create error response for processQuery method
   */
  private createErrorResponse(
    query: string, 
    language: 'en' | 'pa', 
    channel: DeliveryChannel, 
    error: string
  ): AssistantResponse {
    return {
      isValid: false,
      module: 'error',
      content: language === 'pa' 
        ? 'ਮਾਫ ਕਰਨਾ, ਕੋਈ ਤਕਨੀਕੀ ਸਮੱਸਿਆ ਆਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
        : 'Sorry, there was a technical issue. Please try again.',
      confidence: 0.0,
      sources: ['SYSTEM_ERROR'],
      language,
      channel
    }
  }

  /**
   * Generate crop advice based on query and context
   */
  private generateCropAdvice(
    query: string, 
    context: any[], 
    language: 'en' | 'pa'
  ): { content: string, confidence: number, sources: string[] } {
    const relevantCrop = context.find(item => item.name) as CropInfo
    
    if (relevantCrop) {
      const content = language === 'pa'
        ? `${relevantCrop.name.punjabi} ਦੀ ਖੇਤੀ ਬਾਰੇ: ${relevantCrop.pau_recommendations.join(', ')}`
        : `${relevantCrop.name.english} farming advice: ${relevantCrop.pau_recommendations.join(', ')}`
      
      return {
        content,
        confidence: 0.85,
        sources: [relevantCrop.source]
      }
    }
    
    const content = language === 'pa'
      ? 'ਇਸ ਫਸਲ ਬਾਰੇ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਨਹੀਂ। PAU ਜਾਂ KVK ਨਾਲ ਸੰਪਰਕ ਕਰੋ।'
      : 'Information about this crop is not available. Please contact PAU or KVK.'
    
    return {
      content,
      confidence: 0.2,
      sources: ['KVK_Contact_Required']
    }
  }

  /**
   * Generate pest advice based on query and context
   */
  private generatePestAdvice(
    query: string, 
    context: any[], 
    language: 'en' | 'pa'
  ): { content: string, confidence: number, sources: string[] } {
    const content = language === 'pa'
      ? 'ਕੀੜਿਆਂ ਦੀ ਸਮੱਸਿਆ ਲਈ ਆਪਣੇ ਨੇੜਲੇ PAU/KVK ਤੋਂ ਸਲਾਹ ਲਓ।'
      : 'For pest problems, please consult your nearest PAU/KVK office.'
    
    return {
      content,
      confidence: 0.5,
      sources: ['PAU_KVK_Guidelines']
    }
  }

  /**
   * Generate mandi rates information
   */
  private generateMandiRates(
    query: string, 
    context: any[], 
    language: 'en' | 'pa'
  ): { content: string, confidence: number, sources: string[] } {
    const content = language === 'pa'
      ? 'ਮੰਡੀ ਦੀਆਂ ਦਰਾਂ ਲਈ ਆਪਣੀ ਨੇੜਲੀ ਮੰਡੀ ਜਾਂ e-Nam ਪੋਰਟਲ ਦੇਖੋ।'
      : 'For mandi rates, please check your nearest mandi or e-Nam portal.'
    
    return {
      content,
      confidence: 0.7,
      sources: ['e-Nam_Portal']
    }
  }

  /**
   * Generate government scheme information
   */
  private generateSchemeInfo(
    query: string, 
    context: any[], 
    language: 'en' | 'pa'
  ): { content: string, confidence: number, sources: string[] } {
    const relevantScheme = context.find(item => item.name) as GovernmentScheme
    
    if (relevantScheme) {
      const content = language === 'pa'
        ? `${relevantScheme.name.punjabi}: ${relevantScheme.benefits.join(', ')}`
        : `${relevantScheme.name.english}: ${relevantScheme.benefits.join(', ')}`
      
      return {
        content,
        confidence: 0.9,
        sources: [relevantScheme.source]
      }
    }
    
    const content = language === 'pa'
      ? 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਲਈ punjabagri.gov.in ਦੇਖੋ।'
      : 'For government schemes information, please visit punjabagri.gov.in'
    
    return {
      content,
      confidence: 0.6,
      sources: ['Punjab_Agriculture_Portal']
    }
  }

  /**
   * Generate weather advice
   */
  private generateWeatherAdvice(
    query: string, 
    context: any[], 
    language: 'en' | 'pa'
  ): { content: string, confidence: number, sources: string[] } {
    const content = language === 'pa'
      ? 'ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ ਲਈ PAU ਦਾ ਮੌਸਮ ਪੋਰਟਲ ਦੇਖੋ।'
      : 'For weather information, please check PAU weather portal.'
    
    return {
      content,
      confidence: 0.7,
      sources: ['PAU_Weather_Portal']
    }
  }

  /**
   * Generate soil advice
   */
  private generateSoilAdvice(
    query: string, 
    context: any[], 
    language: 'en' | 'pa'
  ): { content: string, confidence: number, sources: string[] } {
    const content = language === 'pa'
      ? 'ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਕਰਵਾਉਣ ਲਈ ਆਪਣੇ ਨੇੜਲੇ ਮਿੱਟੀ ਟੈਸਟਿੰਗ ਸੈਂਟਰ ਜਾਓ।'
      : 'For soil testing, visit your nearest soil testing center.'
    
    return {
      content,
      confidence: 0.8,
      sources: ['Soil_Testing_Centers']
    }
  }

  /**
   * Generate dairy advice
   */
  private generateDairyAdvice(
    query: string, 
    context: any[], 
    language: 'en' | 'pa'
  ): { content: string, confidence: number, sources: string[] } {
    const content = language === 'pa'
      ? 'ਡੇਅਰੀ/ਪਸ਼ੂ ਪਾਲਣ ਬਾਰੇ ਜਾਣਕਾਰੀ ਲਈ GADVASU ਜਾਂ ਵੈਟਰਨਰੀ ਹਸਪਤਾਲ ਜਾਓ।'
      : 'For dairy/livestock information, visit GADVASU or veterinary hospital.'
    
    return {
      content,
      confidence: 0.7,
      sources: ['GADVASU_Guidelines']
    }
  }

  /**
   * Generate crop planning advice
   */
  private generateCropPlanning(
    query: string, 
    context: any[], 
    language: 'en' | 'pa'
  ): { content: string, confidence: number, sources: string[] } {
    const content = language === 'pa'
      ? 'ਫਸਲ ਯੋਜਨਾ ਲਈ PAU ਦੀ ਕ੍ਰਾਪ ਕੈਲੰਡਰ ਦੇਖੋ ਅਤੇ ਮਿੱਟੀ ਅਨੁਸਾਰ ਫਸਲ ਚੁਣੋ।'
      : 'For crop planning, check PAU crop calendar and choose crops based on soil type.'
    
    return {
      content,
      confidence: 0.8,
      sources: ['PAU_Crop_Calendar']
    }
  }

  /**
   * Format content for specific delivery channel
   */
  private formatForChannel(content: string, channel: DeliveryChannel): string {
    switch (channel) {
      case 'sms':
        return content.substring(0, 150) // SMS character limit
      case 'whatsapp':
        return content
      case 'push':
        return content.substring(0, 100) // Push notification limit
      case 'voice':
        return content
      default:
        return content
    }
  }
}

export default PunjabAIAssistant