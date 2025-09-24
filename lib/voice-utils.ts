import { Language } from './i18n'

// Language-specific voice configurations
export const VOICE_CONFIG = {
  en: {
    speechRecognitionLang: 'en-IN', // Indian English for better farmer understanding
    speechSynthesisLang: 'en-IN',
    voiceNames: ['Google हिन्दी', 'Microsoft Heera - English (India)', 'Google English (India)'],
    fallbackLang: 'en-US'
  },
  hi: {
    speechRecognitionLang: 'hi-IN',
    speechSynthesisLang: 'hi-IN', 
    voiceNames: ['Google हिन्दी', 'Microsoft Kalpana - Hindi (India)', 'Google Hindi'],
    fallbackLang: 'hi-IN'
  },
  kn: {
    speechRecognitionLang: 'kn-IN',
    speechSynthesisLang: 'kn-IN',
    voiceNames: ['Google ಕನ್ನಡ', 'Microsoft Kannada', 'Google Kannada'],
    fallbackLang: 'en-IN'
  },
  pa: {
    speechRecognitionLang: 'pa-IN', 
    speechSynthesisLang: 'pa-IN',
    voiceNames: ['Google ਪੰਜਾਬੀ', 'Microsoft Punjabi', 'Google Punjabi'],
    fallbackLang: 'en-IN'
  },
  ta: {
    speechRecognitionLang: 'ta-IN',
    speechSynthesisLang: 'ta-IN',
    voiceNames: ['Google தமிழ்', 'Microsoft Tamil', 'Google Tamil'],
    fallbackLang: 'en-IN'
  }
} as const

interface VoiceRecognitionOptions {
  language: Language
  continuous?: boolean
  onResult?: (transcript: string, confidence: number) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
}

interface VoiceSynthesisOptions {
  language: Language
  rate?: number
  pitch?: number
  volume?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
}

class VoiceManager {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private currentLanguage: Language = 'en'

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
      }
      
      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis
      }
    }
  }

  // Check if voice features are supported
  isRecognitionSupported(): boolean {
    return !!this.recognition
  }

  isSynthesisSupported(): boolean {
    return !!this.synthesis
  }

  // Get available voices for a specific language
  getVoicesForLanguage(language: Language): SpeechSynthesisVoice[] {
    if (!this.synthesis) return []
    
    const voices = this.synthesis.getVoices()
    const config = VOICE_CONFIG[language]
    
    // First try to find voices matching the exact language
    const exactMatches = voices.filter(voice => 
      voice.lang === config.speechSynthesisLang ||
      config.voiceNames.some(name => voice.name.includes(name))
    )
    
    if (exactMatches.length > 0) return exactMatches
    
    // Fallback to any voice that starts with the language code
    const langCode = config.speechSynthesisLang.split('-')[0]
    const fallbackMatches = voices.filter(voice => voice.lang.startsWith(langCode))
    
    return fallbackMatches.length > 0 ? fallbackMatches : voices.filter(voice => 
      voice.lang.startsWith('en') || voice.lang.startsWith(config.fallbackLang.split('-')[0])
    )
  }

  // Start listening for speech input
  startListening(options: VoiceRecognitionOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject('Speech recognition not supported')
        return
      }

      if (this.isListening) {
        this.stopListening()
      }

      const config = VOICE_CONFIG[options.language]
      
      this.recognition.lang = config.speechRecognitionLang
      this.recognition.continuous = options.continuous || false
      this.recognition.interimResults = true
      this.recognition.maxAlternatives = 1

      let finalTranscript = ''
      let timeoutId: NodeJS.Timeout

      this.recognition.onstart = () => {
        this.isListening = true
        this.currentLanguage = options.language
        options.onStart?.()
        
        // Set timeout for automatic stop (30 seconds)
        timeoutId = setTimeout(() => {
          this.stopListening()
        }, 30000)
      }

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
            options.onResult?.(result[0].transcript, result[0].confidence)
          } else {
            interimTranscript += result[0].transcript
          }
        }
      }

      this.recognition.onend = () => {
        this.isListening = false
        clearTimeout(timeoutId)
        options.onEnd?.()
        
        if (finalTranscript.trim()) {
          resolve(finalTranscript.trim())
        } else {
          reject('No speech detected')
        }
      }

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.isListening = false
        clearTimeout(timeoutId)
        const errorMessage = `Speech recognition error: ${event.error}`
        options.onError?.(errorMessage)
        reject(errorMessage)
      }

      try {
        this.recognition.start()
      } catch (error) {
        this.isListening = false
        reject(`Failed to start recognition: ${error}`)
      }
    })
  }

  // Stop listening for speech input
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  // Check if currently listening
  isCurrentlyListening(): boolean {
    return this.isListening
  }

  // Speak text in the specified language
  speak(text: string, options: VoiceSynthesisOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject('Speech synthesis not supported')
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const config = VOICE_CONFIG[options.language]
      
      // Set language
      utterance.lang = config.speechSynthesisLang

      // Try to find and set the best voice
      const availableVoices = this.getVoicesForLanguage(options.language)
      if (availableVoices.length > 0) {
        utterance.voice = availableVoices[0]
      }

      // Set speech parameters
      utterance.rate = options.rate || 0.9 // Slightly slower for better comprehension
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume || 1.0

      utterance.onstart = () => {
        options.onStart?.()
      }

      utterance.onend = () => {
        options.onEnd?.()
        resolve()
      }

      utterance.onerror = (event) => {
        const errorMessage = `Speech synthesis error: ${event.error}`
        options.onError?.(errorMessage)
        reject(errorMessage)
      }

      try {
        this.synthesis.speak(utterance)
      } catch (error) {
        reject(`Failed to speak: ${error}`)
      }
    })
  }

  // Stop any ongoing speech
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  // Get language-specific sample phrases for voice training/testing
  getSamplePhrases(language: Language): string[] {
    const phrases = {
      en: [
        "What crops should I plant this season?",
        "How can I improve my soil quality?", 
        "When is the best time to harvest wheat?",
        "What pesticide should I use for aphids?"
      ],
      hi: [
        "इस सीजन में मुझे कौन सी फसल लगानी चाहिए?",
        "मैं अपनी मिट्टी की गुणवत्ता कैसे सुधार सकता हूँ?",
        "गेहूं काटने का सबसे अच्छा समय कब है?",
        "एफिड्स के लिए मुझे कौन सा कीटनाशक उपयोग करना चाहिए?"
      ],
      kn: [
        "ಈ ಋತುವಿನಲ್ಲಿ ನಾನು ಯಾವ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯಬೇಕು?",
        "ನನ್ನ ಮಣ್ಣಿನ ಗುಣಮಟ್ಟವನ್ನು ಹೇಗೆ ಸುಧಾರಿಸಬಹುದು?",
        "ಗೋಧಿ ಕೊಯ್ಲಿಗೆ ಯಾವಾಗ ಸರಿಯಾದ ಸಮಯ?",
        "ಚಿಗಟೆಗಳಿಗೆ ಯಾವ ಕೀಟನಾಶಕವನ್ನು ಬಳಸಬೇಕು?"
      ],
      pa: [
        "ਇਸ ਸੀਜ਼ਨ ਵਿੱਚ ਮੈਨੂੰ ਕਿਹੜੀਆਂ ਫਸਲਾਂ ਲਾਉਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?",
        "ਮੈਂ ਆਪਣੀ ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ ਕਿਵੇਂ ਸੁਧਾਰ ਸਕਦਾ ਹਾਂ?",
        "ਕਣਕ ਕੱਟਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਕਦੋਂ ਹੈ?",
        "ਮੱਛੀਆਂ ਲਈ ਮੈਨੂੰ ਕਿਹੜਾ ਕੀਟਨਾਸ਼ਕ ਵਰਤਣਾ ਚਾਹੀਦਾ ਹੈ?"
      ],
      ta: [
        "இந்த பருவத்தில் நான் என்ன பயிர்களை பயிரிட வேண்டும்?",
        "எனது மண்ணின் தரத்தை எப்படி மேம்படுத்துவது?",
        "கோதுமை அறுவடைக்கு சிறந்த நேரம் எப்போது?",
        "பேன்களுக்கு என்ன பூச்சிக்கொல்லி பயன்படுத்த வேண்டும்?"
      ]
    }
    
    return phrases[language] || phrases.en
  }

  // Test voice capabilities for a language
  async testVoiceCapabilities(language: Language): Promise<{
    recognition: boolean
    synthesis: boolean
    availableVoices: number
    recommendedVoice?: string
  }> {
    const result = {
      recognition: this.isRecognitionSupported(),
      synthesis: this.isSynthesisSupported(),
      availableVoices: 0,
      recommendedVoice: undefined as string | undefined
    }

    if (result.synthesis) {
      const voices = this.getVoicesForLanguage(language)
      result.availableVoices = voices.length
      if (voices.length > 0) {
        result.recommendedVoice = voices[0].name
      }
    }

    return result
  }
}

// Export singleton instance
export const voiceManager = new VoiceManager()

// Utility functions
export const getLanguageVoiceConfig = (language: Language) => {
  return VOICE_CONFIG[language]
}

export const isBrowserVoiceSupported = () => {
  if (typeof window === 'undefined') return false
  
  const hasRecognition = !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition)
  const hasSynthesis = !!window.speechSynthesis
  
  return { hasRecognition, hasSynthesis }
}
