"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sprout, User, Phone, ArrowRight, Globe, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  })
  const [isAnimated, setIsAnimated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if language selection was completed, if not redirect to language selection
    const languageSelected = localStorage.getItem('language-selected')
    if (!languageSelected) {
      router.push('/language-selection')
      return
    }
    
    // Animate in after component mounts
    setTimeout(() => setIsAnimated(true), 100)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Store user authentication
      localStorage.setItem('user-authenticated', 'true')
      localStorage.setItem('user-phone', formData.phone)
      
      // Redirect to landing page with tutorial
      router.push('/onboarding')
      setIsLoading(false)
    }, 1500)
  }

  const getTranslatedText = (key: string): string => {
    const translations: { [key: string]: { [lang: string]: string } } = {
      signIn: {
        en: "Sign In",
        hi: "साइन इन करें",
        bn: "সাইন ইন করুন",
        te: "సైన్ ఇన్ చేయండి",
        ta: "உள்நுழையவும்",
        mr: "साइन इन करा",
        gu: "સાઇન ઇન કરો",
        kn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
        ml: "സൈൻ ഇൻ ചെയ്യുക",
        pa: "ਸਾਈਨ ਇਨ ਕਰੋ"
      },
      welcomeBack: {
        en: "Welcome Back!",
        hi: "फिर से स्वागत है!",
        bn: "স্বাগতম!",
        te: "తిరిగి స్వాగతం!",
        ta: "மீண்டும் வரவேற்கிறோம்!",
        mr: "पुन्हा स्वागत आहे!",
        gu: "ફરીથી સ્વાગત છે!",
        kn: "ಮತ್ತೆ ಸ್ವಾಗತ!",
        ml: "വീണ്ടും സ്വാഗതം!",
        pa: "ਫਿਰ ਸੁਆਗਤ ਹੈ!"
      },
      enterCredentials: {
        en: "Enter your credentials to access your FarmGuard account",
        hi: "अपना FarmGuard खाता एक्सेस करने के लिए अपनी जानकारी दर्ज करें",
        bn: "আপনার FarmGuard অ্যাকাউন্ট অ্যাক্সেস করতে আপনার তথ্য প্রবেশ করুন",
        te: "మీ FarmGuard ఖాతాను యాక్సెస్ చేయడానికి మీ వివరాలను నమోదు చేయండి",
        ta: "உங்கள் FarmGuard கணக்கை அணுக உங்கள் விவரங்களை உள்ளிடவும்",
        mr: "तुमच्या FarmGuard खात्यात प्रवेश करण्यासाठी तुमची माहिती प्रविष्ट करा",
        gu: "તમારા FarmGuard ખાતામાં પ્રવેશ કરવા માટે તમારી વિગતો દાખલ કરો",
        kn: "ನಿಮ್ಮ FarmGuard ಖಾತೆಯನ್ನು ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
        ml: "നിങ്ങളുടെ FarmGuard അക്കൗണ്ട് ആക്സസ് ചെയ്യാൻ നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക",
        pa: "ਆਪਣੇ FarmGuard ਖਾਤੇ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਆਪਣੀ ਜਾਣਕਾਰੀ ਦਾਖਲ ਕਰੋ"
      },
      phoneNumber: {
        en: "Phone Number",
        hi: "फोन नंबर",
        bn: "ফোন নম্বর",
        te: "ఫోన్ నంబర్",
        ta: "தொலைபேசி எண்",
        mr: "फोन नंबर",
        gu: "ફોન નંબર",
        kn: "ಫೋನ್ ಸಂಖ್ಯೆ",
        ml: "ഫോൺ നമ്പർ",
        pa: "ਫੋਨ ਨੰਬਰ"
      },
      password: {
        en: "Password",
        hi: "पासवर्ड",
        bn: "পাসওয়ার্ড",
        te: "పాస్వర్డ్",
        ta: "கடவுச்சொல்",
        mr: "पासवर्ड",
        gu: "પાસવર્ડ",
        kn: "ಪಾಸ್ವರ್ಡ್",
        ml: "പാസ്വേഡ്",
        pa: "ਪਾਸਵਰਡ"
      },
      signUp: {
        en: "Don't have an account? Sign Up",
        hi: "खाता नहीं है? साइन अप करें",
        bn: "অ্যাকাউন্ট নেই? সাইন আপ করুন",
        te: "ఖాతా లేదా? సైన్ అప్ చేయండి",
        ta: "கணக்கு இல்லையா? பதிவு செய்யவும்",
        mr: "खाते नाही? साइन अप करा",
        gu: "ખાતું નથી? સાઇન અપ કરો",
        kn: "ಖಾತೆ ಇಲ್ಲವೇ? ಸೈನ್ ಅಪ್ ಮಾಡಿ",
        ml: "അക്കൗണ്ട് ഇല്ലേ? സൈൻ അപ്പ് ചെയ്യുക",
        pa: "ਖਾਤਾ ਨਹੀਂ ਹੈ? ਸਾਈਨ ਅਪ ਕਰੋ"
      }
    }
    
    return translations[key]?.[language] || translations[key]?.["en"] || key
  }

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
        <div className={`w-full max-w-md transition-all duration-1000 ${
          isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">FarmGuard</h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
              <Globe className="h-4 w-4" />
              <span>Language: {language.toUpperCase()}</span>
            </div>
          </div>

          {/* Sign In Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                {getTranslatedText('welcomeBack')}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {getTranslatedText('enterCredentials')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    {getTranslatedText('phoneNumber')}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    {getTranslatedText('password')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {getTranslatedText('signIn')}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <Link 
                    href="/auth/signup" 
                    className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
                  >
                    {getTranslatedText('signUp')}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Language Change Option */}
          <div className="text-center mt-6">
            <Link 
              href="/language-selection" 
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Change Language / भाषा बदलें
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
