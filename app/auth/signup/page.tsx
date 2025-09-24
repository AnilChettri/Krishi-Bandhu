"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sprout, User, Phone, ArrowRight, Globe, Eye, EyeOff, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: ""
  })
  const [isAnimated, setIsAnimated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Store user authentication and details
      localStorage.setItem('user-authenticated', 'true')
      localStorage.setItem('user-phone', formData.phone)
      localStorage.setItem('user-name', formData.name)
      localStorage.setItem('user-location', formData.location)
      
      // Redirect to onboarding page
      router.push('/onboarding')
      setIsLoading(false)
    }, 1500)
  }

  const getTranslatedText = (key: string): string => {
    const translations: { [key: string]: { [lang: string]: string } } = {
      signUp: {
        en: "Sign Up",
        hi: "साइन अप करें",
        bn: "সাইন আপ করুন",
        te: "సైన్ అప్ చేయండి",
        ta: "பதிவு செய்யவும்",
        mr: "साइन अप करा",
        gu: "સાઇન અપ કરો",
        kn: "ಸೈನ್ ಅಪ್ ಮಾಡಿ",
        ml: "സൈൻ അപ്പ് ചെയ്യുക",
        pa: "ਸਾਈਨ ਅਪ ਕਰੋ"
      },
      createAccount: {
        en: "Create Your Account",
        hi: "अपना खाता बनाएं",
        bn: "আপনার অ্যাকাউন্ট তৈরি করুন",
        te: "మీ ఖాతాను సృష్టించండి",
        ta: "உங்கள் கணக்கை உருவாக்கவும்",
        mr: "तुमचे खाते तयार करा",
        gu: "તમારું ખાતું બનાવો",
        kn: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
        ml: "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
        pa: "ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ"
      },
      joinFarmGuard: {
        en: "Join FarmGuard and get personalized farming assistance",
        hi: "FarmGuard में शामिल हों और व्यक्तिगत कृषि सहायता प्राप्त करें",
        bn: "FarmGuard এ যোগ দিন এবং ব্যক্তিগতকৃত কৃষি সহায়তা পান",
        te: "FarmGuard లో చేరండి మరియు వ్యక్తిగతీకరించిన వ్యవసాయ సహాయతను పొందండి",
        ta: "FarmGuard இல் சேர்ந்து தனிப்பயனாக்கப்பட்ட விவசாய உதவியைப் பெறுங்கள்",
        mr: "FarmGuard मध्ये सामील व्हा आणि वैयक्तिकीकृत शेती सहाय्य मिळवा",
        gu: "FarmGuard માં જોડાઓ અને વ્યક્તિગત કૃષિ સહાય મેળવો",
        kn: "FarmGuard ನಲ್ಲಿ ಸೇರಿ ಮತ್ತು ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಕೃಷಿ ಸಹಾಯವನ್ನು ಪಡೆಯಿರಿ",
        ml: "FarmGuard ൽ ചേരുകയും വ്യക്തിഗതമാക്കിയ കാർഷിക സഹായം നേടുകയും ചെയ്യുക",
        pa: "FarmGuard ਵਿੱਚ ਸ਼ਾਮਿਲ ਹੋਵੋ ਅਤੇ ਵਿਅਕਤੀਗਤ ਖੇਤੀ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ"
      },
      fullName: {
        en: "Full Name",
        hi: "पूरा नाम",
        bn: "পূর্ণ নাম",
        te: "పూర్తి పేరు",
        ta: "முழு பெயர்",
        mr: "पूर्ण नाव",
        gu: "પૂરું નામ",
        kn: "ಪೂರ್ಣ ಹೆಸರು",
        ml: "പൂർണ്ണ നാമം",
        pa: "ਪੂਰਾ ਨਾਮ"
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
      location: {
        en: "Location (Village/City)",
        hi: "स्थान (गांव/शहर)",
        bn: "অবস্থান (গ্রাম/শহর)",
        te: "స్థానం (గ్రామం/నగరం)",
        ta: "இடம் (கிராமம்/நகரம்)",
        mr: "स्थान (गाव/शहर)",
        gu: "સ્થાન (ગામ/શહેર)",
        kn: "ಸ್ಥಳ (ಗ್ರಾಮ/ನಗರ)",
        ml: "സ്ഥലം (ഗ്രാമം/നഗരം)",
        pa: "ਸਥਾਨ (ਪਿੰਡ/ਸ਼ਹਿਰ)"
      },
      password: {
        en: "Password",
        hi: "पासवर्ड",
        bn: "পাসওয়ার্ড",
        te: "పాస్వర্డ్",
        ta: "கடவுச்சொல்",
        mr: "पासवर्ड",
        gu: "પાસવર્ડ",
        kn: "ಪಾಸ್ವರ್ಡ್",
        ml: "പാസ്വേഡ്",
        pa: "ਪਾਸਵਰਡ"
      },
      confirmPassword: {
        en: "Confirm Password",
        hi: "पासवर्ड की पुष्टि करें",
        bn: "পাসওয়ার্ড নিশ্চিত করুন",
        te: "పాస్వర్డ్ నిర్ధారించండి",
        ta: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
        mr: "पासवर्डची पुष्टी करा",
        gu: "પાસવર્ડની પુષ્ટિ કરો",
        kn: "ಪಾಸ್ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
        ml: "പാസ്വേഡ് സ്ഥിരീകരിക്കുക",
        pa: "ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ"
      },
      signIn: {
        en: "Already have an account? Sign In",
        hi: "पहले से खाता है? साइन इन करें",
        bn: "ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন",
        te: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
        ta: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்",
        mr: "आधीच खाते आहे? साइन इन करा",
        gu: "પહેલેથી ખાતું છે? સાઇન ઇન કરો",
        kn: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಸೈನ್ ಇನ್ ಮಾಡಿ",
        ml: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ? സൈൻ ഇൻ ചെയ്യുക",
        pa: "ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ? ਸਾਈਨ ਇਨ ਕਰੋ"
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

          {/* Sign Up Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                {getTranslatedText('createAccount')}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {getTranslatedText('joinFarmGuard')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    {getTranslatedText('fullName')}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

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
                  <Label htmlFor="location" className="text-gray-700 font-medium">
                    {getTranslatedText('location')}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Bangalore, Karnataka"
                      value={formData.location}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    {getTranslatedText('confirmPassword')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                      {getTranslatedText('signUp')}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <Link 
                    href="/auth/signin" 
                    className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
                  >
                    {getTranslatedText('signIn')}
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
