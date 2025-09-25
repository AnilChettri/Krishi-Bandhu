"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X, Globe, Mouse } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface GuideArrow {
  id: string
  position: { top?: string; bottom?: string; left?: string; right?: string }
  direction: 'up' | 'down' | 'left' | 'right'
  text: string
  target: string
}

export default function VisualGuide() {
  const { language, t } = useLanguage()
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    // Show guide for first-time users after a short delay
    if (typeof window !== 'undefined') {
      const hasSeenGuide = localStorage.getItem('visual-guide-seen')
      if (!hasSeenGuide) {
        setTimeout(() => {
          setShowGuide(true)
          // Speak welcome message in selected language
          speakMessage(getWelcomeMessage())
        }, 2000) // Show after 2 seconds
      }
    }
  }, [])

  const speakMessage = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-US'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  const getWelcomeMessage = () => {
    const messages = {
      en: "Welcome to FarmGuard! Let me show you how to use this farming app. First, choose your language, then click Sign In to continue.",
      hi: "फार्मगार्ड में आपका स्वागत है! मैं आपको इस कृषि ऐप का उपयोग करना सिखाता हूँ। पहले अपनी भाषा चुनें, फिर साइन इन पर क्लिक करें।",
      pa: "ਫਾਰਮਗਾਰਡ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ! ਮੈਂ ਤੁਹਾਨੂੰ ਇਸ ਖੇਤੀ ਐਪ ਦਾ ਇਸਤੇਮਾਲ ਕਰਨਾ ਸਿਖਾਤਾ ਹਾਂ। ਪਹਿਲਾਂ ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ, ਫਿਰ ਸਾਇਨ ਇਨ ਤੇ ਕਲਿਕ ਕਰੋ।"
    }
    return messages[language as keyof typeof messages] || messages.en
  }

  const getUITexts = () => {
    const texts = {
      en: {
        welcome: "Welcome to FarmGuard! 🌱",
        description: "Let me show you how to use this farming app.",
        firstStep: "First, choose your language",
        secondStep: 'Then click "Sign In" to continue',
        gotIt: "Got it!",
        changeLanguage: "Change Language",
        clickToStart: "Click to Start"
      },
      hi: {
        welcome: "फार्मगार्ड में आपका स्वागत है! 🌱",
        description: "मैं आपको इस कृषि ऐप का उपयोग करना सिखाता हूँ।",
        firstStep: "पहले, अपनी भाषा चुनें",
        secondStep: 'फिर जारी रखने के लिए "साइन इन" पर क्लिक करें',
        gotIt: "समझ गया!",
        changeLanguage: "भाषा बदलें",
        clickToStart: "शुरू करने के लिए क्लिक करें"
      },
      pa: {
        welcome: "ਫਾਰਮਗਾਰਡ ਵਿੱਚ ਸਵਾਗਤ ਹੈ! 🌱",
        description: "ਮੈਂ ਤੁਹਾਨੂੰ ਇਸ ਖੇਤੀ ਐਪ ਦਾ ਇਸਤੇਮਾਲ ਕਰਨਾ ਸਿਖਾਉਂਦਾ ਹਾਂ।",
        firstStep: "ਪਹਿਲਾਂ, ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
        secondStep: 'ਫਿਰ ਜਾਰੀ ਰੱਖਣ ਲਈ "ਸਾਇਨ ਇਨ" ਤੇ ਕਲਿਕ ਕਰੋ',
        gotIt: "ਸਮਝ ਗਿਆ!",
        changeLanguage: "ਭਾਸ਼ਾ ਬਦਲੋ",
        clickToStart: "ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਲਿਕ ਕਰੋ"
      }
    }
    return texts[language as keyof typeof texts] || texts.en
  }

  const hideGuide = () => {
    // Stop any ongoing speech
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    setShowGuide(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('visual-guide-seen', 'true')
    }
  }

  if (!showGuide) {
    return null
  }

  const uiTexts = getUITexts()

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />
      
      {/* Welcome Message */}
      <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-80 shadow-2xl">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mouse className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {uiTexts.welcome}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {uiTexts.description}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <Globe className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">{uiTexts.firstStep}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <Mouse className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">{uiTexts.secondStep}</span>
            </div>
          </div>
          
          <Button 
            onClick={hideGuide}
            className="w-full mt-4 bg-green-600 hover:bg-green-700"
          >
            {uiTexts.gotIt}
          </Button>
        </CardContent>
      </Card>

      {/* Language Button Arrow */}
      <div className="fixed top-16 right-8 z-50 animate-bounce">
        <div className="flex items-center gap-2">
          <Card className="bg-green-600 text-white shadow-lg">
            <CardContent className="p-3 text-center">
              <Globe className="h-6 w-6 mx-auto mb-1" />
              <p className="text-xs font-medium">{uiTexts.changeLanguage}</p>
            </CardContent>
          </Card>
          <ArrowLeft className="h-8 w-8 text-green-600" />
        </div>
      </div>

      {/* Sign In Button Arrow */}
      <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
        <div className="text-center">
          <ArrowDown className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <Card className="bg-green-600 text-white shadow-lg">
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">{uiTexts.clickToStart}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

// Simple visual pointer component for specific elements
export function VisualPointer({ 
  text, 
  position = "top",
  className = "",
  show = true 
}: { 
  text: string
  position?: "top" | "bottom" | "left" | "right"
  className?: string
  show?: boolean
}) {
  if (!show) return null

  const arrowClass = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2", 
    left: "right-full mr-2",
    right: "left-full ml-2"
  }[position]

  const arrowIcon = {
    top: <ArrowDown className="h-4 w-4" />,
    bottom: <ArrowUp className="h-4 w-4" />,
    left: <ArrowRight className="h-4 w-4" />,
    right: <ArrowLeft className="h-4 w-4" />
  }[position]

  return (
    <div className={`absolute ${arrowClass} z-30 animate-pulse ${className}`}>
      <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1">
        {position === "right" && arrowIcon}
        {text}
        {position !== "right" && arrowIcon}
      </div>
    </div>
  )
}
