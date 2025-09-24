"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sprout, Smartphone, Bot, ArrowRight, ArrowLeft, Globe, Play, User, MessageCircle, CloudRain, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimated, setIsAnimated] = useState(false)
  const [userName, setUserName] = useState("")
  const router = useRouter()
  const { language } = useLanguage()

  useEffect(() => {
    // Check authentication and language selection
    const userAuthenticated = localStorage.getItem('user-authenticated')
    const languageSelected = localStorage.getItem('language-selected')
    
    if (!languageSelected) {
      router.push('/language-selection')
      return
    }
    
    if (!userAuthenticated) {
      router.push('/auth/signin')
      return
    }

    // Get user name
    const storedName = localStorage.getItem('user-name')
    setUserName(storedName || "Farmer")
    
    // Animate in after component mounts
    setTimeout(() => setIsAnimated(true), 100)
  }, [router])

  const getTranslatedText = (key: string): string => {
    const translations: { [key: string]: { [lang: string]: string } } = {
      welcomeToFarmGuard: {
        en: "Welcome to FarmGuard!",
        hi: "FarmGuard में आपका स्वागत है!",
        bn: "FarmGuard এ স্वাগতম!",
        te: "FarmGuard కు స్వాగతం!",
        ta: "FarmGuard க்கு வரवेळकिरোম्!",
        mr: "FarmGuard मध्ये आपले स्वागत आहे!",
        gu: "FarmGuard માં આપનું સ્વાગত છે!",
        kn: "FarmGuard ಗೆ ಸುಸ್ವಾಗತ!",
        ml: "FarmGuard ലേക്ക് സ്വാഗതം!",
        pa: "FarmGuard ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ!"
      },
      letsGetStarted: {
        en: "Let's get you started with your smart farming journey",
        hi: "आइए आपको अपनी स्मार्ट फार्मिंग यात्रा शुरू करते हैं",
        bn: "আসুন আপনার স্মার্ট কৃষিকাজের যাত্রা শুরু করি",
        te: "మీ స్మార్ట్ వ్యవసాయ ప्रయाणाన्ని प्रারंभिद्दाम",
        ta: "உங்கள் ஸ்மार்ট் விவசाయ பயணত्ते தொடங்குவோম्",
        mr: "तुमच्या स्मार्ट शेतीच्या प्रवासाची सुरुवात करूया",
        gu: "ચાલો તમારી સ્માર્ટ ખેતીની મુસાફરી શરૂ કરીએ",
        kn: "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸೋಣ",
        ml: "നിങ്ങളുടെ സ്മാർട്ട് കൃഷി യാത्रാ ആരംभിക्काम",
        pa: "ਚਲੋ ਤੁਹਾਡੀ ਸਮਾਰਟ ਖੇਤੀ ਦੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹਾਂ"
      },
      aiAssistant: {
        en: "AI Assistant",
        hi: "एआई सहायक",
        bn: "AI সহায়ক",
        te: "AI సహాయకుడు",
        ta: "AI உதवियाळर्",
        mr: "AI सहाय्यक",
        gu: "AI સહાયક",
        kn: "AI ಸಹಾಯಕ",
        ml: "AI അസിস്റ്റന്റ്",
        pa: "AI ਸਹਾਇਕ"
      },
      weatherAlerts: {
        en: "Weather Alerts",
        hi: "मौसम अलर्ट",
        bn: "আবহাওয়া সতর্কতা",
        te: "వాతావরণ హెచ్చరికలు",
        ta: "वानिলै அறিवিप्पुकळ",
        mr: "हवामान इशारे",
        gu: "હવામાન ચेतવણીઓ",
        kn: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು",
        ml: "കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾ",
        pa: "ਮੌਸਮ ਅਲਰਟ"
      },
      marketInsights: {
        en: "Market Insights",
        hi: "बाजार की जानकारी",
        bn: "বাজার অন্তর्दृष्टि",
        te: "మార్కెట్ అంತర్దృష्टులు",
        ta: "சந்தை অন्तर्दृष्टিகळ",
        mr: "बाजार अंतर्दृष्टी",
        gu: "બજાર આંતરદৃষ্ટિ",
        kn: "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು",
        ml: "വിപണി ഉൾക्കാഴ്চകळ",
        pa: "ਮਾਰਕੀਟ ਸੂਝ"
      },
      continueToDashboard: {
        en: "Continue to Dashboard",
        hi: "डैशবोर्ड पर जारी रखें",
        bn: "ড্যাশবোর्ডে যান",
        te: "డాష్బোర्डకు వెळ्ळండి",
        ta: "டাশ্বোர्डুक्कு सेळ्ळवुम्",
        mr: "डॅशबोर्डवर सुरू ठেवा",
        gu: "ડેশબોર્ડ પર આગળ વधો",
        kn: "ಡ್ಯಾಶ್ಬೋರ್ಡ್ಗೆ ಮುಂದುವರಿಯಿರಿ",
        ml: "ഡാഷ്ബോർഡിലേക്ക് തുടരുക",
        pa: "ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਜਾਰੀ ਰੱਖੋ"
      }
    }
    
    return translations[key]?.[language] || translations[key]?.["en"] || key
  }

  const onboardingSteps = [
    {
      icon: MessageCircle,
      title: getTranslatedText('aiAssistant'),
      description: "Get instant farming advice and crop recommendations",
      content: "Ask questions in your language, upload photos of crops or pests, and receive expert AI-powered guidance."
    },
    {
      icon: CloudRain,
      title: getTranslatedText('weatherAlerts'),
      description: "Stay informed about weather conditions",
      content: "Receive real-time weather updates and alerts to plan your farming activities effectively."
    },
    {
      icon: TrendingUp,
      title: getTranslatedText('marketInsights'),
      description: "Track crop prices and market trends",
      content: "Monitor market prices and trends to make informed decisions about what to plant and when to sell."
    }
  ]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleContinue()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleContinue = () => {
    // Mark onboarding as complete
    localStorage.setItem('onboarding-complete', 'true')
    // Redirect to dashboard
    router.push('/dashboard/farmer')
  }

  const currentStepData = onboardingSteps[currentStep]
  const IconComponent = currentStepData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border border-green-300 rounded-full"></div>
        <div className="absolute top-32 right-16 w-16 h-16 border border-blue-300 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 border border-green-400 rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 border border-blue-400 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center relative z-10">
        <div className={`w-full max-w-4xl transition-all duration-1000 ${
          isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Sprout className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">FarmGuard</h1>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-1">
                  <Globe className="h-4 w-4" />
                  <span>{language.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-700 mb-2">
              {getTranslatedText('welcomeToFarmGuard')} {userName}! 👋
            </h2>
            <p className="text-xl text-gray-600">
              {getTranslatedText('letsGetStarted')}
            </p>
          </div>

          {/* Video Tutorial Section (if first step) */}
          {currentStep === 0 && (
            <div className="mb-12">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                    {/* Placeholder for video - Replace with actual video component */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Play className="h-10 w-10 text-white ml-1" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-2">
                        Watch Tutorial Video
                      </h3>
                      <p className="text-white/80 text-sm">
                        Learn how to use FarmGuard in {language === 'en' ? 'English' : 'your language'}
                      </p>
                    </div>
                    
                    {/* Overlay for video placeholder */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                      <Button className="bg-white/20 hover:bg-white/30 text-white border-white/50 backdrop-blur-sm">
                        <Play className="h-5 w-5 mr-2" />
                        Play Tutorial
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Current Step */}
          <div className="mb-12">
            <Card className={`shadow-xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-500 ${
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <CardHeader className="text-center pb-8">
                <div className={`mx-auto mb-6 p-4 rounded-full w-fit ${
                  currentStep === 0 ? 'bg-green-600' : currentStep === 1 ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  <IconComponent className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">{currentStepData.title}</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  {currentStepData.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 leading-relaxed text-center">
                  {currentStepData.content}
                </p>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                        index <= currentStep ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <Button 
                    onClick={handleNext} 
                    className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                      currentStep === 0 ? 'bg-green-600 hover:bg-green-700' : 
                      currentStep === 1 ? 'bg-blue-600 hover:bg-blue-700' : 
                      'bg-purple-600 hover:bg-purple-700'
                    } text-white`}
                  >
                    {currentStep === onboardingSteps.length - 1 ? getTranslatedText('continueToDashboard') : "Next"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Skip Option */}
                <div className="text-center pt-4">
                  <Button
                    variant="ghost"
                    onClick={handleContinue}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300"
                  >
                    Skip Tutorial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
