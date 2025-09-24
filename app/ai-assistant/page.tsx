"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Camera, Send, ArrowLeft, Loader2, User } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { ChatLoadingMessage, LoadingButton } from "@/components/loading"
import FarmGuardLayout from "@/components/farmguard-layout"
import VoiceInput, { VoiceOutput } from "@/components/voice-input"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  hasImage?: boolean
  imageUrl?: string
  isVoice?: boolean
}

export default function AIAssistantPage() {
  const { t, language } = useLanguage()
  
  const getInitialMessage = () => {
    const messages = {
      en: "Hello! I'm your AI farming assistant. You can ask me questions about crops, pests, weather, or farming techniques. I can help in text, voice, or by analyzing photos of your crops.",
      hi: "नमस्ते! मैं आपका AI कृषि सहायक हूँ। आप मुझसे फसलों, कीटों, मौसम या कृषि तकनीकों के बारे में सवाल पूछ सकते हैं। मैं टेक्स्ट, आवाज़ या आपकी फसलों की फोटो का विश्लेषण करके मदद कर सकता हूँ।",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಹಾಯಕನೆಂದು ಹೇಳಲಾಗಿದ್ದೇನೆ. ನೀವು ನನ್ನ ಬೆಳೆಗಳು, ಕೀಟಗಳು, ಹವಾಮಾನ ಅಥವಾ ಕೃಷಿ ತಂತ್ರಗಳ ಬಗ್ಗೆ ತಿಳುವಳಿಕೆ ಇಡಬಹುದು. ನಾನು ಪಠ್ಯ, ಕಂಠ, ಅಥವಾ ನಿಮ್ಮ ಬೆಳೆಗಳ ಫೋಟೋಗಳ ವिಸ್ಲೇಷಣೆय ಮाಡि ಆಧाರದ ಮिಸು मದाಗाறಬಹುದು.",
      pa: "ਨਮਸਕਾਰ! ਮੈਂ ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਕੋਲ ਫਸਲਾਂ, ਕੀੜੇ-ਮਕੌੜਿਆਂ, ਮੌਸਮ, ਜਾਂ ਖੇਤੀਬਾੜੀ ਦੀਆਂ ਤਕਨੀਕਾਂ ਬਾਰੇ ਸਵਾਲ ਕਹਿ ਸਕਦੇ ਹੋ। ਮੈਂ ਟੈਕਸਟ, ਆਵਾਜ़, ਜਾਂ ਤੁਹਾਡੀਆਂ ਫਸਲਾਂ ਦੀਆਂ ਤਸਵੀਰਾਂ ਦਾ ਵिਸ਼ਲੇਸਣ ਕਰਕੇ मਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।",
      ta: "வரவேற்கிறேன்! நಾன் உங்கள் AI வिவசಾய உதவियಾளர್. நீங்கள್ பयिர್கள್, பூசिகள್, வಾனिலை ಅல್லதು வिவசಾय தಆகाரिக தिகाளाத पழड़்ड़ि பசவामड़ರ್களೈ ಏனाதೂம़ கேளುள್கाர್. நाன್ பe்य पஜियர್ வளர್சाियिல್, உयिர್சियिல್ அல್லाதು உयिரಅகளऺ யುவುடಅகऺ யाல್லा பeಂல್லा मऺகಂபಅಂि ஒனा தिழि கिஞाதि मऺகಅபामऺ मऺಆम் मऺவिमा मऺகाதऺவ़೏मऺரाஂகाதऺஅஂகऺரஂम मऺதऺகऺஞऺஂகऺ."
    }
    return messages[language as keyof typeof messages] || messages.en
  }
  
  const [messages, setMessages] = useState<Message[]>([])
  
  // Update initial message when language changes
  useEffect(() => {
    setMessages([
      {
        id: "1",
        type: "assistant",
        content: getInitialMessage(),
        timestamp: new Date(),
      },
    ])
  }, [language])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string, imageFile?: File) => {
    if (!content.trim() && !imageFile) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content || "Image uploaded for analysis",
      timestamp: new Date(),
      hasImage: !!imageFile,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsLoading(true)

    try {
      // Call our AI assistant API
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          language: language
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Fallback message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. For immediate help, you can check the weather section or contact your local agriculture extension office.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle voice input transcript
  const handleVoiceTranscript = (transcript: string) => {
    if (transcript.trim()) {
      handleSendMessage(transcript)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleSendMessage("Please analyze this image of my crop", file)
    }
  }


  return (
    <FarmGuardLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header Section */}
      <div className="bg-white p-6 border-b">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-8 w-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">{t('aiAssistantTitle')}</h2>
          </div>
          <p className="text-gray-600">{t('aiAssistantSubtitle')}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[400px]">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  {message.type === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] ${
                      message.type === "user" 
                        ? "bg-green-600 text-white" 
                        : "bg-gray-50 border border-gray-200"
                    } rounded-lg p-4`}
                  >
                    {message.hasImage && message.imageUrl && (
                      <div className="mb-3">
                        <img
                          src={message.imageUrl || "/placeholder.svg"}
                          alt="Uploaded crop image"
                          className="max-w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    <p className={`text-sm leading-relaxed ${
                      message.type === "user" ? "text-white" : "text-gray-800"
                    }`}>{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        message.type === "user" ? "text-green-100" : "text-gray-500"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {message.type === "assistant" && (
                        <VoiceOutput 
                          text={message.content}
                          size="sm"
                          variant="ghost"
                          className="hover:bg-gray-100"
                        />
                      )}
                    </div>
                  </div>
                  {message.type === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && <ChatLoadingMessage />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('askAnything')}
                className="min-h-[50px] pr-20 resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(inputText)
                  }
                }}
              />
              <div className="absolute right-2 bottom-2 flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Camera className="h-4 w-4 text-gray-500" />
                </Button>
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  onError={(error) => console.error('Voice error:', error)}
                  size="sm"
                  variant="ghost"
                  className="hover:bg-gray-100"
                  showLanguageIndicator={false}
                />
              </div>
            </div>
            <LoadingButton
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              loading={isLoading}
              className="h-[50px] bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </LoadingButton>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      </div>
      </div>
    </FarmGuardLayout>
  )
}
