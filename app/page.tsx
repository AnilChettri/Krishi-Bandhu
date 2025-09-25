"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sprout, Users, Globe, ArrowRight, CheckCircle, Bot, CloudRain, TrendingUp, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { type Language } from "@/lib/i18n"
import VisualGuide, { VisualPointer } from "@/components/visual-guide"

export default function HomePage() {
  const { language, setLanguage, t } = useLanguage()
  const [showLanguageSelect, setShowLanguageSelect] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    // Check if this is the user's first visit
    const languageSelected = localStorage.getItem('language-selected')
    const userAuthenticated = localStorage.getItem('user-authenticated')
    
    if (!languageSelected) {
      // First visit - redirect to language selection
      router.push('/language-selection')
      return
    }
    
    if (!userAuthenticated) {
      // Language selected but not authenticated - redirect to sign in
      router.push('/auth/signin')
      return
    }
    
    // User is authenticated and has selected language - show landing page
  }, [router])
  
  const showGuideAgain = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('visual-guide-seen')
      window.location.reload()
    }
  }

  const languageOptions: { code: Language; name: string; nativeName: string }[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Visual Guide */}
      <VisualGuide />
      
      {/* Header */}
      <header className="bg-green-600 text-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Krishi Bandhu</h1>
            </div>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowLanguageSelect(true)}
                className="text-white hover:bg-green-500 flex items-center gap-2 ring-2 ring-white ring-opacity-50 animate-pulse"
                id="language-selector"
              >
                <Globe className="h-4 w-4" />
                {languageOptions.find(l => l.code === language)?.nativeName || "English"}
              </Button>
              <VisualPointer 
                text="Change Language / भाषा बदलें" 
                position="bottom"
                className="left-0"
                show={typeof window !== 'undefined' && !localStorage.getItem('visual-guide-seen')}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Language Selection Modal */}
      {showLanguageSelect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center">Choose Your Language</h3>
            <div className="space-y-2 mb-6">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setShowLanguageSelect(false)
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:bg-gray-50 ${
                    language === lang.code
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold">{lang.nativeName}</div>
                    <div className="text-sm text-gray-500">{lang.name}</div>
                  </div>
                  {language === lang.code && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </button>
              ))}
            </div>
            <Button 
              onClick={() => setShowLanguageSelect(false)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('welcome')}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Empowering small & marginal farmers with localized crop advisory, weather alerts, market insights, and
            AI-powered farming assistance in 10 Indian languages.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('aiAssistant')}</h3>
              <p className="text-gray-600 text-sm">
                Get instant answers to farming questions with voice and image support
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudRain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('weatherAlerts')}</h3>
              <p className="text-gray-600 text-sm">
                Stay updated with weather conditions and alerts for better farming decisions
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('marketTrend')}</h3>
              <p className="text-gray-600 text-sm">
                Real-time crop prices and market trends to maximize profits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Login Options */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="relative">
            <Link href="/login">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-lg flex items-center justify-center gap-2 ring-4 ring-green-300 ring-opacity-50 animate-pulse"
                id="signin-button"
              >
                {t('signIn')}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <VisualPointer 
              text="Click here to start / शुरू करने के लिए यहाँ क्लिक करें" 
              position="top"
              className="left-1/2 transform -translate-x-1/2"
              show={typeof window !== 'undefined' && !localStorage.getItem('visual-guide-seen')}
            />
          </div>
          
          <Link href="/auth/farmer/signup">
            <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 py-4 text-lg font-semibold rounded-lg">
              {t('signUp')}
            </Button>
          </Link>
        </div>

        {/* How to Use - Tutorial for Farmers */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">How to Use Krishi Bandhu</h2>
            <p className="text-gray-600">Simple steps to get started / शुरू करने के लिए आसान कदम</p>
          </div>
          {/* Tutorial content has been integrated into the farmer guide component */}
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Offline-First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access essential farming tools even without internet connectivity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get instant answers to farming questions with voice and image support
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time crop prices and market trends to maximize profits
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Floating Help Button - Always visible for farmers */}
      <Button
        onClick={showGuideAgain}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-30 flex items-center justify-center"
        title="Need help? Click to see guide again"
      >
        <HelpCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}
