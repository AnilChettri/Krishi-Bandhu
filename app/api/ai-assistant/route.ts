import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const { message, language = 'en' } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is available
    if (!API_CONFIG.OPENAI.API_KEY) {
      // Fallback to mock response for development
      return NextResponse.json({
        response: getMockFarmingResponse(message, language),
        source: 'mock'
      })
    }

    // Create farming-focused system prompt
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
          { role: 'user', content: message }
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

    return NextResponse.json({
      response: aiResponse,
      source: 'openai'
    })

  } catch (error) {
    console.error('AI Assistant error:', error)
    
    // Fallback to mock response on error
    const { message, language = 'en' } = await request.json().catch(() => ({ message: '', language: 'en' }))
    
    return NextResponse.json({
      response: getMockFarmingResponse(message, language),
      source: 'fallback',
      error: 'Using fallback response due to API error'
    })
  }
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
    ]
  }

  const availableResponses = responses[language as keyof typeof responses] || responses.en
  return availableResponses[Math.floor(Math.random() * availableResponses.length)]
}
