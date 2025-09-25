"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ArrowLeft, ArrowRight, MapPin, Volume2, VolumeX } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface GuideStep {
  id: string
  target: string
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
  voiceText?: string
}

interface FarmerGuideProps {
  steps: GuideStep[]
  onComplete?: () => void
}

export default function FarmerGuide({ steps, onComplete }: FarmerGuideProps) {
  const { t, language } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [showGuide, setShowGuide] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Show guide for first-time users
    const hasSeenGuide = localStorage.getItem('krishi-bandhu-guide-completed')
    if (!hasSeenGuide) {
      setTimeout(() => setShowGuide(true), 1000)
    }
  }, [])

  useEffect(() => {
    if (showGuide && voiceEnabled && steps[currentStep]) {
      speakText(steps[currentStep].voiceText || steps[currentStep].content)
    }
  }, [currentStep, showGuide, voiceEnabled, steps])

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      setIsPlaying(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US'
      utterance.rate = 0.9
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  const nextStep = () => {
    stopSpeech()
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeGuide()
    }
  }

  const prevStep = () => {
    stopSpeech()
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeGuide = () => {
    stopSpeech()
    setShowGuide(false)
    localStorage.setItem('krishi-bandhu-guide-completed', 'true')
    onComplete?.()
  }

  const skipGuide = () => {
    stopSpeech()
    setShowGuide(false)
    localStorage.setItem('krishi-bandhu-guide-completed', 'true')
  }

  const toggleVoice = () => {
    if (isPlaying) {
      stopSpeech()
    }
    setVoiceEnabled(!voiceEnabled)
  }

  if (!showGuide || !steps[currentStep]) {
    return null
  }

  const currentStepData = steps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Guide Card */}
      <Card className="fixed z-50 w-80 shadow-xl border-green-200 bg-white" 
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-600">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className="h-6 w-6 p-0"
              >
                {isPlaying ? (
                  <VolumeX className="h-4 w-4 text-red-500" />
                ) : voiceEnabled ? (
                  <Volume2 className="h-4 w-4 text-green-600" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={skipGuide} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">{currentStepData.title}</h3>
            <p className="text-gray-600 leading-relaxed">{currentStepData.content}</p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" onClick={skipGuide} className="text-gray-600">
                Skip Tour
              </Button>
              <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Predefined guide steps for farmers
export const farmerGuideSteps: GuideStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: 'Welcome to Krishi Bandhu! 🌱',
    content: 'I will help you understand how to use this farming assistant. This tool will help you make better farming decisions.',
    position: 'bottom',
    voiceText: 'Welcome to Krishi Bandhu! I will guide you through this farming application step by step.'
  },
  {
    id: 'weather',
    target: '.weather-card',
    title: 'Check Weather First',
    content: 'Always start by checking the weather. This helps you plan your daily farming activities like irrigation, harvesting, or applying fertilizers.',
    position: 'bottom',
    voiceText: 'First, always check the weather forecast. This helps you plan when to water plants or harvest crops.'
  },
  {
    id: 'crops',
    target: '.crop-suggestions',
    title: 'Get Crop Advice',
    content: 'Here you can find which crops are best for your region and season. The system suggests crops based on your location and current market prices.',
    position: 'top',
    voiceText: 'This section shows you which crops are best to grow in your area and what prices you can expect.'
  },
  {
    id: 'calculator',
    target: '.profit-calculator',
    title: 'Calculate Profits',
    content: 'Before planting, calculate how much profit you can make. Enter your land size, expected yield, and costs to see estimated profits.',
    position: 'top',
    voiceText: 'Use the profit calculator to see how much money you can make from different crops before you plant them.'
  },
  {
    id: 'ai-assistant',
    target: '.ai-assistant-link',
    title: 'Ask Questions Anytime',
    content: 'If you have any farming questions, click here to ask our AI assistant. You can ask in your local language about pests, diseases, or farming techniques.',
    position: 'left',
    voiceText: 'If you have questions about farming, pests, or plant diseases, you can ask our smart assistant anytime.'
  },
  {
    id: 'market',
    target: '.market-info',
    title: 'Check Market Prices',
    content: 'Before selling your crops, check current market prices in different mandis. This helps you decide where and when to sell for best profits.',
    position: 'left',
    voiceText: 'Always check market prices before selling your crops to get the best rates.'
  }
]
