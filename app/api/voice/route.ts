import { NextRequest, NextResponse } from 'next/server'
import { getLanguageVoiceConfig } from '@/lib/voice-utils'
import type { Language } from '@/lib/i18n'

// Voice processing capabilities for different languages
const LANGUAGE_CAPABILITIES = {
  en: { recognition: 'excellent', synthesis: 'excellent' },
  hi: { recognition: 'good', synthesis: 'excellent' },
  kn: { recognition: 'fair', synthesis: 'good' },
  pa: { recognition: 'fair', synthesis: 'good' },
  ta: { recognition: 'good', synthesis: 'good' }
} as const

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const language = searchParams.get('language') as Language || 'en'
  
  try {
    const config = getLanguageVoiceConfig(language)
    const capabilities = LANGUAGE_CAPABILITIES[language] || LANGUAGE_CAPABILITIES.en
    
    return NextResponse.json({
      success: true,
      language,
      config: {
        speechRecognitionLang: config.speechRecognitionLang,
        speechSynthesisLang: config.speechSynthesisLang,
        fallbackLang: config.fallbackLang
      },
      capabilities,
      samplePhrases: getSamplePhrases(language)
    })
  } catch (error) {
    console.error('Voice config error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get voice configuration' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, language = 'en', text, audioData } = await request.json()
    
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'test-capability':
        return testVoiceCapability(language as Language)
        
      case 'process-audio':
        return processAudioData(audioData, language as Language)
        
      case 'get-farming-phrases':
        return getFarmingPhrases(language as Language)
        
      case 'synthesize-speech':
        return synthesizeSpeech(text, language as Language)
        
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Voice API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Test voice capability for a specific language
async function testVoiceCapability(language: Language) {
  const config = getLanguageVoiceConfig(language)
  const capabilities = LANGUAGE_CAPABILITIES[language] || LANGUAGE_CAPABILITIES.en
  
  return NextResponse.json({
    success: true,
    language,
    supported: true,
    config,
    capabilities,
    recommendation: getLanguageRecommendation(language)
  })
}

// Process audio data (placeholder for future enhancement)
async function processAudioData(audioData: any, language: Language) {
  // This would integrate with speech-to-text services like Google Speech-to-Text
  // For now, return a mock response
  return NextResponse.json({
    success: true,
    transcript: 'Mock transcript: How can I improve my crop yield?',
    confidence: 0.95,
    language,
    detectedLanguage: language,
    duration: 3.2
  })
}

// Get farming-specific phrases for voice training
async function getFarmingPhrases(language: Language) {
  const phrases = getSamplePhrases(language)
  
  return NextResponse.json({
    success: true,
    language,
    phrases,
    categories: {
      crops: phrases.slice(0, 2),
      weather: phrases.slice(2, 4),
      general: phrases.slice(4)
    }
  })
}

// Synthesize speech (placeholder for server-side TTS)
async function synthesizeSpeech(text: string, language: Language) {
  if (!text) {
    return NextResponse.json(
      { success: false, error: 'Text is required for synthesis' },
      { status: 400 }
    )
  }

  const config = getLanguageVoiceConfig(language)
  
  return NextResponse.json({
    success: true,
    text,
    language,
    config: {
      lang: config.speechSynthesisLang,
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0
    },
    // In a real implementation, this would return audio data or a URL
    audioUrl: null,
    message: 'Use client-side speech synthesis for now'
  })
}

// Get sample phrases for different languages
function getSamplePhrases(language: Language): string[] {
  const phrases = {
    en: [
      "What crops should I plant this season?",
      "How can I improve my soil quality?",
      "When is the best time to harvest wheat?",
      "What pesticide should I use for aphids?",
      "How much water does my rice crop need?",
      "What are the signs of nitrogen deficiency?"
    ],
    hi: [
      "इस सीजन में मुझे कौन सी फसल लगानी चाहिए?",
      "मैं अपनी मिट्टी की गुणवत्ता कैसे सुधार सकता हूँ?",
      "गेहूं काटने का सबसे अच्छा समय कब है?",
      "एफिड्स के लिए मुझे कौन सा कीटनाशक उपयोग करना चाहिए?",
      "मेरी धान की फसल को कितने पानी की जरूरत है?",
      "नाइट्रोजन की कमी के क्या लक्षण हैं?"
    ],
    kn: [
      "ಈ ಋತುವಿನಲ್ಲಿ ನಾನು ಯಾವ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯಬೇಕು?",
      "ನನ್ನ ಮಣ್ಣಿನ ಗುಣಮಟ್ಟವನ್ನು ಹೇಗೆ ಸುಧಾರಿಸಬಹುದು?",
      "ಗೋಧಿ ಕೊಯ್ಲಿಗೆ ಯಾವಾಗ ಸರಿಯಾದ ಸಮಯ?",
      "ಚಿಗಟೆಗಳಿಗೆ ಯಾವ ಕೀಟನಾಶಕವನ್ನು ಬಳಸಬೇಕು?",
      "ನನ್ನ ಭತ್ತದ ಬೆಳೆಗೆ ಎಷ್ಟು ನೀರು ಬೇಕು?",
      "ಸಾರಜನಕ ಕೊರತೆಯ ಲಕ್ಷಣಗಳು ಯಾವುವು?"
    ],
    pa: [
      "ਇਸ ਸੀਜ਼ਨ ਵਿੱਚ ਮੈਨੂੰ ਕਿਹੜੀਆਂ ਫਸਲਾਂ ਲਾਉਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?",
      "ਮੈਂ ਆਪਣੀ ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ ਕਿਵੇਂ ਸੁਧਾਰ ਸਕਦਾ ਹਾਂ?",
      "ਕਣਕ ਕੱਟਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਕਦੋਂ ਹੈ?",
      "ਮੱਛੀਆਂ ਲਈ ਮੈਨੂੰ ਕਿਹੜਾ ਕੀਟਨਾਸ਼ਕ ਵਰਤਣਾ ਚਾਹੀਦਾ ਹੈ?",
      "ਮੇਰੀ ਚਾਵਲ ਦੀ ਫਸਲ ਨੂੰ ਕਿੰਨੇ ਪਾਣੀ ਦੀ ਲੋੜ ਹੈ?",
      "ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਘਾਟ ਦੇ ਕੀ ਲੱਛਣ ਹਨ?"
    ],
    ta: [
      "இந்த பருவத்தில் நான் என்ன பயிர்களை பயிரிட வேண்டும்?",
      "எனது மண்ணின் தரத்தை எப்படி மேம்படுத்துவது?",
      "கோதுமை அறுவடைக்கு சிறந்த நேரம் எப்போது?",
      "பேன்களுக்கு என்ன பூச்சிக்கொல்லி பயன்படுத்த வேண்டும்?",
      "எனது நெல் பயிருக்கு எவ்வளவு தண்ணீர் தேவை?",
      "நைட்ரஜன் குறைபாட்டின் அறிகுறிகள் என்ன?"
    ]
  }
  
  return phrases[language] || phrases.en
}

// Get language-specific recommendations
function getLanguageRecommendation(language: Language): string {
  const recommendations = {
    en: "Excellent support for both recognition and synthesis. Best overall experience.",
    hi: "Good recognition support with excellent synthesis. Widely supported across browsers.",
    kn: "Fair recognition support improving over time. Good synthesis capabilities.",
    pa: "Fair recognition support with good synthesis. May work better with slower speech.",
    ta: "Good recognition support with reliable synthesis. Works well for most farming terms."
  }
  
  return recommendations[language] || recommendations.en
}
