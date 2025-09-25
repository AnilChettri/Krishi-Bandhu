"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sprout, Check, ArrowRight, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"
import { type Language, languages, languageDetails } from "@/lib/i18n"

export default function LanguageSelectionPage() {
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    // Animate in after component mounts
    setTimeout(() => setIsAnimated(true), 100)
  }, [])

  const handleContinue = () => {
    setLanguage(selectedLanguage)
    // Store that language selection is complete
    localStorage.setItem('language-selected', 'true')
    // Redirect to sign in page
    router.push('/auth/signin')
  }

  const handleSkip = () => {
    setLanguage("en") // Default to English
    localStorage.setItem('language-selected', 'true')
    router.push('/auth/signin')
  }

  const languageOptions = Object.entries(languageDetails).map(([code, details]) => ({
    code: code as Language,
    ...details
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border border-green-300 rounded-full"></div>
        <div className="absolute top-32 right-16 w-16 h-16 border border-blue-300 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 border border-green-400 rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 border border-blue-400 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Sprout className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">FarmGuard</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Welcome to FarmGuard
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your preferred language to get started with personalized farming assistance
            <br />
            <span className="text-sm text-gray-500">
              अपनी पसंदीदा भाषा चुनें • আপনার পছন্দের ভাষা নির্বাচন করুন • మీ ఇష్టమైన భాష ఎంచుకోండి
            </span>
          </p>
        </div>

        {/* Language Selection Grid */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
          isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {languageOptions.map((lang, index) => (
              <Card 
                key={lang.code}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  selectedLanguage === lang.code
                    ? "ring-2 ring-green-500 bg-green-50 shadow-lg scale-105"
                    : "hover:shadow-md"
                } ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedLanguage === lang.code ? 'bg-green-600' : 'bg-gray-100'
                      }`}>
                        <Globe className={`h-5 w-5 ${
                          selectedLanguage === lang.code ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-semibold text-lg ${
                          selectedLanguage === lang.code ? 'text-green-700' : 'text-gray-800'
                        }`}>
                          {lang.nativeName}
                        </div>
                        <div className="text-sm text-gray-500">{lang.name}</div>
                        <div className="text-xs text-gray-400">{lang.region}</div>
                      </div>
                    </div>
                    {selectedLanguage === lang.code && (
                      <Check className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-700 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Button
              onClick={handleContinue}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              disabled={!selectedLanguage}
            >
              Continue with {languageOptions.find(l => l.code === selectedLanguage)?.nativeName}
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full sm:w-auto text-gray-600 hover:text-gray-800 px-6 py-3 text-lg transition-all duration-300"
            >
              Skip (Continue in English)
            </Button>
          </div>

          {/* Help Text */}
          <div className={`text-center mt-8 transition-all duration-1000 delay-900 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-sm text-gray-500">
              You can always change your language preference later in settings
              <br />
              आप बाद में सेटिंग्स में अपनी भाषा की प्राथमिकता बदल सकते हैं
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
