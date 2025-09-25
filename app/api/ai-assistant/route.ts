import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, LOCAL_AI_CONFIG } from '@/lib/api-config'
import { callLocalLLM, checkLocalAIHealth, checkOllamaHealth, checkAIBackendHealth } from '@/lib/local-llm-client'
import { createPerformanceMiddleware, trackLLMRequest, trackProviderHealth, trackFeatureUsage } from '@/lib/monitoring'

export async function POST(request: NextRequest) {
  const endpoint = 'ai-assistant'
  const performanceHandler = createPerformanceMiddleware(endpoint)
  
  return performanceHandler(async () => {
    let language = 'en' // Default language
    try {
      const requestBody = await request.json()
      const { message } = requestBody
      language = requestBody.language || 'en'

      if (!message || typeof message !== 'string') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Message is required and must be a string' 
          },
          { status: 400 }
        )
      }

      // Input sanitization and validation
      const sanitizedMessage = message.slice(0, LOCAL_AI_CONFIG.SECURITY.MAX_INPUT_LENGTH)
      
      // Check for blocked patterns
      const hasBlockedPattern = LOCAL_AI_CONFIG.SECURITY.BLOCKED_PATTERNS.some(
        (pattern: RegExp) => pattern.test(sanitizedMessage)
      )
      
      if (hasBlockedPattern) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Message contains blocked content' 
          },
          { status: 400 }
        )
      }
      
      // Track feature usage
      trackFeatureUsage('ai_assistant', 'chat')
    
    // Try Local AI providers first if enabled
    if (LOCAL_AI_CONFIG.ENABLED) {
      try {
        console.log('🤖 Using Local AI providers for farming assistance...')
        
        const startTime = Date.now()
        const localAIResponse = await callLocalLLM({
          prompt: sanitizedMessage,
          language: language,
          temperature: 0.7,
          max_tokens: 1000
        })
        
        const responseTime = Date.now() - startTime
        
        // Track LLM request metrics
        trackLLMRequest(localAIResponse.source, localAIResponse.model, responseTime, false)
        
        // Track provider health
        trackProviderHealth(localAIResponse.source, true, responseTime)

        // Log performance metrics
        console.log(`✅ Local AI responded via ${localAIResponse.source} in ${responseTime}ms`)

        return NextResponse.json({
          success: true,
          response: localAIResponse.content,
          language: localAIResponse.language,
          source: localAIResponse.source,
          model: localAIResponse.model,
          response_time: localAIResponse.response_time,
          tokens_used: localAIResponse.tokens_used,
          confidence: localAIResponse.confidence,
          metadata: localAIResponse.metadata,
          timestamp: new Date().toISOString()
        })

      } catch (error) {
        console.error('❌ All local AI providers failed:', error)
        
        // Track provider failure
        trackProviderHealth('localai', false)
        
        // Continue to external providers as fallback
        console.log('⚠️ Falling back to external AI providers...')
      }
    }

    // Try OpenAI if local AI failed and API key is available
    if (API_CONFIG.OPENAI.API_KEY) {
      try {
        console.log('🌐 Using OpenAI API...')
        
        const startTime = Date.now()
        
        const systemPrompt = `You are an AI farming assistant for Indian farmers. Provide practical, actionable advice about:
        - Crop cultivation and care
        - Pest and disease management  
        - Weather-based farming decisions
        - Market timing and pricing
        - Sustainable farming practices
        
        Keep responses simple, practical, and relevant to Indian agriculture. If the user asks in Hindi or other Indian languages, respond in that language.
        
        User's language preference: ${language}`

        const response = await fetch(`${API_CONFIG.OPENAI.BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_CONFIG.OPENAI.API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: API_CONFIG.OPENAI.MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: sanitizedMessage }
            ],
            max_tokens: API_CONFIG.OPENAI.MAX_TOKENS,
            temperature: API_CONFIG.OPENAI.TEMPERATURE
          })
        })

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`)
        }

        const data = await response.json()
        const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
        
        const responseTime = Date.now() - startTime
        
        // Track LLM request metrics
        trackLLMRequest('openai', API_CONFIG.OPENAI.MODEL, responseTime, false)
        trackProviderHealth('openai', true, responseTime)

        return NextResponse.json({
          success: true,
          response: aiResponse,
          language: language,
          source: 'openai',
          model: API_CONFIG.OPENAI.MODEL,
          response_time: responseTime,
          timestamp: new Date().toISOString()
        })

      } catch (error) {
        console.error('❌ OpenAI API failed:', error)
        
        // Track provider failure
        trackProviderHealth('openai', false)
      }
    }

    // Final fallback to mock response
    console.log('🔄 Using mock response as final fallback...')
    
    const mockResponse = getMockFarmingResponse(sanitizedMessage, language)
    
    // Track fallback usage
    trackLLMRequest('mock', 'fallback', 0, false)
    
    return NextResponse.json({
      success: true,
      response: mockResponse,
      language: language,
      source: 'mock',
      model: 'fallback',
      timestamp: new Date().toISOString(),
      warning: 'Using fallback response - consider setting up local AI or external API keys'
    })

  } catch (error) {
    console.error('❌ AI Assistant critical error:', error)
    
    // Track critical error
    trackLLMRequest('system', 'error', 0, true)
    
    // Emergency fallback - use the language from the request or default to 'en'
    const responseLanguage = language || 'en'
    const emergencyResponse = {
      en: "I'm temporarily unable to provide assistance. Please try again in a moment, or contact your local agricultural extension office for immediate help.",
      hi: "मैं अस्थायी रूप से सहायता प्रदान करने में असमर्थ हूँ। कृपया एक क्षण में फिर से कोशिश करें, या तत्काल सहायता के लिए अपने स्थानीय कृषि विस्तार कार्यालय से संपर्क करें।"
    }
    
    return NextResponse.json({
      success: false,
      error: 'Service temporarily unavailable',
      response: emergencyResponse[responseLanguage as keyof typeof emergencyResponse] || emergencyResponse.en,
      source: 'emergency_fallback',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
  })
}

// Mock farming responses for development/fallback
function getMockFarmingResponse(message: string, language: string): string {
  const responses = {
    en: [
      "Based on current weather conditions, I recommend checking your crop's water needs. Ensure proper drainage if rain is expected.",
      "For healthy crop growth, consider applying organic fertilizer during the early morning hours when temperature is cooler.",
      "Monitor your plants for any signs of pest damage. Early detection helps in better crop management.",
      "The best time for harvesting depends on your crop type. Check the color and firmness of fruits/grains regularly.",
      "Consider crop rotation to maintain soil fertility. Legumes like beans can help fix nitrogen in the soil."
    ],
    hi: [
      "मौजूदा मौसम की स्थिति के आधार पर, मैं आपकी फसल की पानी की जरूरतों की जांच करने की सलाह देता हूं।",
      "स्वस्थ फसल विकास के लिए, सुबह जल्दी जब तापमान ठंडा हो तब जैविक उर्वरक का प्रयोग करें।",
      "कीट क्षति के किसी भी संकेत के लिए अपने पौधों की निगरानी करें।",
      "कटाई का सबसे अच्छा समय आपकी फसल के प्रकार पर निर्भर करता है।",
      "मिट्टी की उर्वरता बनाए रखने के लिए फसल चक्र पर विचार करें।"
    ],
    kn: [
      "ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳ ಆಧಾರದ ಮೇಲೆ, ನಿಮ್ಮ ಬೆಳೆಯ ನೀರಿನ ಅಗತ್ಯಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ।",
      "ಆರೋಗ್ಯಕರ ಬೆಳೆ ಬೆಳವಣಿಗೆಗಾಗಿ, ತಾಪಮಾನ ತಂಪಾಗಿರುವಾಗ ಮುಂಜಾನೆ ಜೈವಿಕ ಗೊಬ್ಬರವನ್ನು ಅನ್ವಯಿಸುವುದನ್ನು ಪರಿಗಣಿಸಿ।",
      "ಕೀಟ ಹಾನಿಯ ಯಾವುದೇ ಚಿಹ್ನೆಗಳಿಗಾಗಿ ನಿಮ್ಮ ಸಸ್ಯಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ।",
      "ಕೊಯ್ಲಿನ ಅತ್ಯುತ್ತಮ ಸಮಯವು ನಿಮ್ಮ ಬೆಳೆಯ ಪ್ರಕಾರವನ್ನು ಅವಲಂಬಿಸಿರುತ್ತದೆ।",
      "ಮಣ್ಣಿನ ಫಲವತ್ತತೆಯನ್ನು ಕಾಪಾಡಲು ಬೆಳೆ ಪಲ್ಲಟವನ್ನು ಪರಿಗಣಿಸಿ।"
    ],
    pa: [
      "ਮੌਜੂਦਾ ਮੌਸਮੀ ਹਾਲਤਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, ਮੈਂ ਤੁਹਾਡੀ ਫਸਲ ਦੀ ਪਾਣੀ ਦੀ ਲੋੜ ਦੀ ਜਾਂਚ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦਾ ਹਾਂ।",
      "ਸਿਹਤਮੰਦ ਫਸਲ ਦੇ ਵਿਕਾਸ ਲਈ, ਤਾਪਮਾਨ ਠੰਡਾ ਹੋਣ 'ਤੇ ਸਵੇਰੇ ਜੈਵਿਕ ਖਾਦ ਦੀ ਵਰਤੋਂ ਕਰਨ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ।",
      "ਕੀੜੇ-ਮਕੌੜਿਆਂ ਦੇ ਨੁਕਸਾਨ ਦੇ ਕਿਸੇ ਵੀ ਨਿਸ਼ਾਨ ਲਈ ਆਪਣੇ ਪੌਧਿਆਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।",
      "ਵਾਢੀ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਤੁਹਾਡੀ ਫਸਲ ਦੀ ਕਿਸਮ 'ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
      "ਮਿੱਟੀ ਦੀ ਉਰਵਰਤਾ ਬਣਾਈ ਰੱਖਣ ਲਈ ਫਸਲ ਚੱਕਰ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ।"
    ],
    ta: [
      "தற்போதைய வானிலை நிலைமைகளின் அடிப்படையில், உங்கள் பயிரின் நீர் தேவைகளை சரிபார்க்க பரிந்துரைக்கிறேன்.",
      "ஆரோக்கியமான பயிர் வளர்ச்சிக்காக, வெப்பநிலை குளிர்ச்சியாக இருக்கும் அதிகாலை நேரங்களில் இயற்கை உரம் பயன்படுத்துவதை பரிசீலிக்கவும்.",
      "பூச்சி சேதம் ஏதேனும் அறிகுறிகளுக்காக உங்கள் செடிகளை கண்காணிக்கவும்.",
      "அறுவடையின் சிறந்த நேரம் உங்கள் பயிர் வகையைப் பொறுத்தது.",
      "மண் வளத்தை பராமரிக்க பயிர் சுழற்சியை கருத்தில் கொள்ளவும்."
    ]
  }

  const availableResponses = responses[language as keyof typeof responses] || responses.en
  return availableResponses[Math.floor(Math.random() * availableResponses.length)]
}
