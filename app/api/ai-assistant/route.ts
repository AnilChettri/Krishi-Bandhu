import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, LOCAL_AI_CONFIG } from '@/lib/api-config'
import { callLocalLLM, checkLocalAIHealth, checkOllamaHealth, checkAIBackendHealth } from '@/lib/local-llm-client'
import { createPerformanceMiddleware, trackLLMRequest, trackProviderHealth, trackFeatureUsage } from '@/lib/monitoring'
import PunjabAIAssistant, { AIAssistantRequest, AIAssistantResponse } from '@/lib/punjab-ai-assistant'
import { punjabKnowledgeBase } from '@/lib/punjab-knowledge-base'

// Helper function for general conversation
function handleGeneralConversation(message: string, language: string): string | null {
  const greetings = {
    en: {
      patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste'],
      responses: [
        "Hello! I'm your FarmGuard AI assistant. I'm here to help you with farming questions, weather updates, crop advice, and market information. How can I help you today?",
        "Hi there! Welcome to FarmGuard! I can assist you with agricultural advice, weather forecasts, crop recommendations, and market prices. What would you like to know?",
        "Greetings! I'm your farming assistant ready to help with crops, weather, pest management, soil health, and market trends. What can I do for you?"
      ]
    },
    hi: {
      patterns: ['hi', 'hello', 'namaste', 'namaskar', 'kaise hain', 'kya haal'],
      responses: [
        "नमस्ते! मैं आपका FarmGuard AI सहायक हूँ। मैं आपकी खेती-बाड़ी, मौसम, फसल सलाह, और बाजार की जानकारी में मदद कर सकता हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?",
        "हैलो! FarmGuard में आपका स्वागत है! मैं कृषि सलाह, मौसम पूर्वानुमान, फसल सुझाव, और बाजार भाव में आपकी मदद कर सकता हूँ। आप क्या जानना चाहते हैं?"
      ]
    },
    pa: {
      patterns: ['hi', 'hello', 'sat sri akal', 'namaste', 'ki haal'],
      responses: [
        "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ FarmGuard AI ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਨੂੰ ਖੇਤੀਬਾੜੀ, ਮੌਸਮ, ਫਸਲ ਸਲਾਹ, ਅਤੇ ਮੰਡੀ ਦੀ ਜਾਣਕਾਰੀ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
        "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! FarmGuard ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ! ਮੈਂ ਖੇਤੀਬਾੜੀ ਸਲਾਹ, ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ, ਫਸਲ ਸੁਝਾਵ, ਅਤੇ ਮੰਡੀ ਰੇਟ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।"
      ]
    }
  }
  
  // Check for greetings
  const langGreetings = greetings[language as keyof typeof greetings] || greetings.en
  const isGreeting = langGreetings.patterns.some(pattern => 
    message.includes(pattern)
  )
  
  if (isGreeting) {
    const responses = langGreetings.responses
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Handle common questions
  const commonQuestions = {
    en: {
      'how are you': "I'm doing well, thank you! I'm here and ready to help you with all your farming needs. How can I assist you today?",
      'what can you do': "I can help you with: \n• Weather forecasts and alerts\n• Crop recommendations\n• Market prices and trends\n• Pest and disease management\n• Soil health advice\n• Irrigation guidance\n• General farming tips\n\nWhat would you like to know about?",
      'who are you': "I'm your FarmGuard AI assistant, specially designed to help farmers with agricultural advice, weather information, market trends, and farming best practices. I'm here to make your farming more efficient and profitable!",
      'thank you': "You're very welcome! I'm always here to help with your farming questions. Feel free to ask me anything about crops, weather, markets, or farming techniques anytime!",
      'thanks': "You're welcome! Happy to help with your farming needs. Don't hesitate to ask if you need more assistance!"
    }
  }
  
  const langQuestions = commonQuestions[language as keyof typeof commonQuestions] || commonQuestions.en
  for (const [question, answer] of Object.entries(langQuestions)) {
    if (message.includes(question)) {
      return answer
    }
  }
  
  return null
}

// Helper function to try external AI services
async function tryExternalAI(message: string, language: string): Promise<{content: string, source: string, model: string} | null> {
  // Try OpenAI first
  if (API_CONFIG.OPENAI.API_KEY) {
    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.OPENAI.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful farming assistant for FarmGuard. Provide practical, accurate agricultural advice. Focus on Indian farming practices, especially for Punjab region. Respond in ${language === 'hi' ? 'Hindi' : language === 'pa' ? 'Punjabi' : 'English'}.`
            },
            {
              role: 'user', 
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      })
      
      if (openaiResponse.ok) {
        const data = await openaiResponse.json()
        return {
          content: data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.',
          source: 'openai',
          model: 'gpt-3.5-turbo'
        }
      }
    } catch (error) {
      console.warn('OpenAI request failed:', error)
    }
  }
  
  // Try Cohere as fallback
  if (API_CONFIG.COHERE.API_KEY) {
    try {
      const cohereResponse = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.COHERE.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'command-light',
          prompt: `You are a helpful farming assistant for FarmGuard. The user asks: "${message}". Provide a helpful, practical response about farming, agriculture, weather, or related topics. Keep it concise and actionable.`,
          max_tokens: 300,
          temperature: 0.7
        })
      })
      
      if (cohereResponse.ok) {
        const data = await cohereResponse.json()
        return {
          content: data.generations[0]?.text?.trim() || 'Sorry, I couldn\'t generate a response.',
          source: 'cohere',
          model: 'command-light'
        }
      }
    } catch (error) {
      console.warn('Cohere request failed:', error)
    }
  }
  
  return null
}

export async function POST(request: NextRequest) {
  const endpoint = 'ai-assistant'
  const performanceHandler = createPerformanceMiddleware(endpoint)
  
  return performanceHandler(async () => {
    let language = 'en' // Default language
    try {
      const requestBody = await request.json()
      const { message, module = 'get_advice', location, farm_details, farmer_details } = requestBody
      language = requestBody.language || 'en'

      console.log(`🤖 AI Assistant request: "${message}" (${language})`)

      if (!message || typeof message !== 'string') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Message is required and must be a string' 
          },
          { status: 400 }
        )
      }

      // Handle basic greetings and general conversation first
      const response = handleGeneralConversation(message.toLowerCase(), language)
      if (response) {
        console.log(`✅ General conversation response provided`)
        return NextResponse.json({
          success: true,
          response: response,
          language: language,
          module: 'general_conversation',
          source: 'farmguard_general',
          model: 'conversation_handler',
          confidence: 0.95,
          timestamp: new Date().toISOString()
        })
      }

      // Try external AI services (OpenAI, Cohere) for more complex queries
      try {
        const aiResponse = await tryExternalAI(message, language)
        if (aiResponse) {
          console.log(`✅ External AI response provided`)
          return NextResponse.json({
            success: true,
            response: aiResponse.content,
            language: language,
            module: 'external_ai',
            source: aiResponse.source,
            model: aiResponse.model,
            confidence: 0.90,
            timestamp: new Date().toISOString()
          })
        }
      } catch (aiError) {
        console.warn('External AI failed, trying Punjab AI:', aiError instanceof Error ? aiError.message : 'Unknown error')
      }

      // Fallback to Punjab AI for agricultural queries
      const punjabRequest: AIAssistantRequest = {
        module: module as AIAssistantRequest['module'],
        query: message,
        location,
        farm_details,
        farmer_details: {
          ...farmer_details,
          language_preference: language === 'pa' ? 'punjabi' : language === 'hi' ? 'both' : 'english'
        }
      }

      // Initialize Punjab AI Assistant
      const punjabAI = new PunjabAIAssistant()
      
      // Process query with Punjab-specific AI
      const punjabResponse = await punjabAI.processQuery(punjabRequest.query, 'en', 'whatsapp')
      
      // Track feature usage
      trackFeatureUsage('ai_assistant', punjabRequest.module)
      
      // Track Punjab AI request metrics
      trackLLMRequest('punjab_ai', 'domain_restricted', 500, !punjabResponse.isValid)
      
      // Log performance metrics
      console.log(`🌾 Punjab AI responded for ${punjabRequest.module}`)
      
      // Return Punjab AI response in expected format
      return NextResponse.json({
        success: punjabResponse.isValid,
        response: punjabResponse.content,
        language: language,
        module: punjabResponse.module,
        source: 'punjab_ai',
        model: 'farmguard_punjab',
        confidence: punjabResponse.confidence,
        sources: punjabResponse.sources,
        channel: punjabResponse.channel,
        timestamp: new Date().toISOString()
      })

  } catch (error) {
    console.error('❌ AI Assistant error:', error)
    
    // Track critical error
    trackLLMRequest('ai_assistant', 'error', 0, true)
    
    // Provide helpful fallback response
    const responseLanguage = language || 'en'
    const fallbackResponses = {
      en: "I'm experiencing some technical difficulties right now, but I'm still here to help! I can assist you with:\n\n• Weather information and forecasts\n• Crop advice and recommendations\n• Market prices and trends\n• Pest and disease management\n• Soil health guidance\n\nTry asking me something specific about farming, and I'll do my best to help you!",
      hi: "मुझे अभी कुछ तकनीकी समस्या हो रही है, लेकिन मैं अभी भी आपकी मदद के लिए यहाँ हूँ! मैं आपकी इनमें सहायता कर सकता हूँ:\n\n• मौसम की जानकारी और पूर्वानुमान\n• फसल सलाह और सुझाव\n• बाजार भाव और रुझान\n• कीट और रोग प्रबंधन\n• मिट्टी स्वास्थ्य मार्गदर्शन\n\nखेती के बारे में कुछ विशिष्ट पूछें, और मैं आपकी सहायता करने की पूरी कोशिश करूंगा!",
      pa: "ਮੈਨੂੰ ਇਸ ਸਮੇਂ ਕੁਝ ਤਕਨੀਕੀ ਮੁਸ਼ਕਿਲਾਂ ਆ ਰਹੀਆਂ ਹਨ, ਪਰ ਮੈਂ ਅਜੇ ਵੀ ਤੁਹਾਡੀ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ! ਮੈਂ ਇਨ੍ਹਾਂ ਵਿੱਚ ਤੁਹਾਡੀ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ:\n\n• ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ ਅਤੇ ਪੂਰਵਾਨੁਮਾਨ\n• ਫਸਲ ਸਲਾਹ ਅਤੇ ਸੁਝਾਵ\n• ਮੰਡੀ ਰੇਟ ਅਤੇ ਰੁਝਾਨ\n• ਕੀਟ ਅਤੇ ਰੋਗ ਪ੍ਰਬੰਧਨ\n• ਮਿੱਟੀ ਸਿਹਤ ਮਾਰਗਦਰਸ਼ਨ\n\nਖੇਤੀਬਾੜੀ ਬਾਰੇ ਕੁਝ ਖਾਸ ਪੁੱਛੋ, ਅਤੇ ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਦੀ ਪੂਰੀ ਕੋਸ਼ਿਸ਼ ਕਰਾਂਗਾ!"
    }
    
    return NextResponse.json({
      success: true, // Mark as success so UI shows the response
      response: fallbackResponses[responseLanguage as keyof typeof fallbackResponses] || fallbackResponses.en,
      language: responseLanguage,
      module: 'fallback_response',
      source: 'farmguard_fallback',
      model: 'fallback_handler',
      confidence: 0.8,
      timestamp: new Date().toISOString()
    })
  }
  })
}
