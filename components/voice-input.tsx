"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { voiceManager, getLanguageVoiceConfig, isBrowserVoiceSupported } from '@/lib/voice-utils'
import type { Language } from '@/lib/i18n'

interface VoiceInputProps {
  onTranscript?: (text: string, confidence: number) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
  showLanguageIndicator?: boolean
  continuous?: boolean
}

export default function VoiceInput({
  onTranscript,
  onError,
  onStart,
  onEnd,
  disabled = false,
  className = '',
  size = 'md',
  variant = 'ghost',
  showLanguageIndicator = false,
  continuous = false
}: VoiceInputProps) {
  const { language, t } = useLanguage()
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  // Check browser support on component mount
  useEffect(() => {
    const browserSupport = isBrowserVoiceSupported()
    const hasRecognition = typeof browserSupport === 'object' ? browserSupport.hasRecognition : false
    setIsSupported(hasRecognition)

    // Check microphone permission
    if (hasRecognition && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => setHasPermission(true))
        .catch(() => setHasPermission(false))
    }
  }, [])

  // Get button size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8 p-0'
      case 'lg': return 'h-12 w-12 p-0'
      default: return 'h-10 w-10 p-0'
    }
  }

  // Get icon size classes  
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3'
      case 'lg': return 'h-6 w-6'
      default: return 'h-4 w-4'
    }
  }

  // Start voice recording
  const startRecording = async () => {
    if (!isSupported || disabled || isRecording) return

    try {
      setIsLoading(true)
      setIsRecording(true)
      onStart?.()

      const transcript = await voiceManager.startListening({
        language,
        continuous,
        onResult: (text, confidence) => {
          onTranscript?.(text, confidence)
        },
        onError: (error) => {
          console.error('Voice recognition error:', error)
          onError?.(error)
          setIsRecording(false)
          setIsLoading(false)
        },
        onStart: () => {
          setIsLoading(false)
        },
        onEnd: () => {
          setIsRecording(false)
          setIsLoading(false)
          onEnd?.()
        }
      })

      // Handle final transcript
      if (transcript && transcript.trim()) {
        onTranscript?.(transcript, 1.0)
      }

    } catch (error) {
      console.error('Failed to start recording:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      onError?.(errorMessage)
      setIsRecording(false)
      setIsLoading(false)
    }
  }

  // Stop voice recording
  const stopRecording = () => {
    if (isRecording) {
      voiceManager.stopListening()
      setIsRecording(false)
      setIsLoading(false)
    }
  }

  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // Get current language configuration
  const langConfig = getLanguageVoiceConfig(language)

  // Render permission request if needed
  if (hasPermission === false) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline" 
          size="sm"
          onClick={() => {
            // Request permission again
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
              navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => setHasPermission(true))
                .catch(() => setHasPermission(false))
            }
          }}
          className="text-xs"
        >
          <MicOff className="h-3 w-3 mr-1" />
          Enable Mic
        </Button>
      </div>
    )
  }

  // Render not supported message
  if (!isSupported) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          disabled 
          size="sm"
          className="text-xs opacity-50"
        >
          <MicOff className="h-3 w-3 mr-1" />
          Voice Not Supported
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
        onClick={toggleRecording}
        disabled={disabled || isLoading}
        className={`${getSizeClasses()} ${className} ${
          isRecording ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'
        }`}
        title={isRecording ? 'Stop recording' : `Start voice input (${langConfig.speechRecognitionLang})`}
      >
        {isLoading ? (
          <Loader2 className={`${getIconSize()} animate-spin`} />
        ) : isRecording ? (
          <MicOff className={getIconSize()} />
        ) : (
          <Mic className={getIconSize()} />
        )}
      </Button>

      {/* Language indicator */}
      {showLanguageIndicator && (
        <Badge variant="outline" className="text-xs">
          {language.toUpperCase()}
        </Badge>
      )}

      {/* Recording status */}
      {isRecording && (
        <Badge variant="destructive" className="animate-pulse text-xs">
          Recording...
        </Badge>
      )}
    </div>
  )
}

// Voice output component for text-to-speech
interface VoiceOutputProps {
  text?: string
  language?: Language
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
  rate?: number
  pitch?: number
  volume?: number
}

export function VoiceOutput({
  text,
  language: propLanguage,
  onStart,
  onEnd,
  onError,
  disabled = false,
  className = '',
  size = 'md',
  variant = 'ghost',
  rate = 0.9,
  pitch = 1.0,
  volume = 1.0
}: VoiceOutputProps) {
  const { language: contextLanguage } = useLanguage()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  
  const language = propLanguage || contextLanguage

  // Check browser support
  useEffect(() => {
    const browserSupport = isBrowserVoiceSupported()
    const hasSynthesis = typeof browserSupport === 'object' ? browserSupport.hasSynthesis : false
    setIsSupported(hasSynthesis)
  }, [])

  // Get button size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-6 w-6 p-0'
      case 'lg': return 'h-10 w-10 p-0'
      default: return 'h-8 w-8 p-0'
    }
  }

  // Get icon size classes
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3'
      case 'lg': return 'h-5 w-5'
      default: return 'h-4 w-4'
    }
  }

  // Speak the provided text
  const speak = async () => {
    if (!text || !isSupported || disabled || isSpeaking) return

    try {
      setIsSpeaking(true)
      
      await voiceManager.speak(text, {
        language,
        rate,
        pitch,
        volume,
        onStart: () => {
          onStart?.()
        },
        onEnd: () => {
          setIsSpeaking(false)
          onEnd?.()
        },
        onError: (error) => {
          console.error('Voice synthesis error:', error)
          setIsSpeaking(false)
          onError?.(error)
        }
      })
    } catch (error) {
      console.error('Failed to speak:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      onError?.(errorMessage)
      setIsSpeaking(false)
    }
  }

  // Stop speaking
  const stop = () => {
    if (isSpeaking) {
      voiceManager.stopSpeaking()
      setIsSpeaking(false)
    }
  }

  // Toggle speech
  const toggleSpeech = () => {
    if (isSpeaking) {
      stop()
    } else {
      speak()
    }
  }

  if (!isSupported || !text) {
    return null
  }

  return (
    <Button
      variant={variant}
      size={size === 'sm' ? 'sm' : 'default'}
      onClick={toggleSpeech}
      disabled={disabled}
      className={`${getSizeClasses()} ${className}`}
      title={isSpeaking ? 'Stop speaking' : 'Speak text aloud'}
    >
      {isSpeaking ? (
        <VolumeX className={getIconSize()} />
      ) : (
        <Volume2 className={getIconSize()} />
      )}
    </Button>
  )
}
