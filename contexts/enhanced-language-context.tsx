"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'pa' | 'hi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isLoading: boolean
}

interface LanguageProviderProps {
  children: ReactNode
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Comprehensive translations for FarmGuard
const translations: Record<string, Record<Language, string>> = {
  // App Name and Branding
  appName: {
    en: 'FarmGuard',
    pa: 'ਫਾਰਮਗਾਰਡ',
    hi: 'फार्मगार्ड'
  },
  tagline: {
    en: 'Your Smart Farming Assistant',
    pa: 'ਤੁਹਾਡਾ ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ',
    hi: 'आपका स्मार्ट कृषि सहायक'
  },

  // Authentication
  welcome: {
    en: 'Welcome',
    pa: 'ਜੀ ਆਇਆਂ ਨੂੰ',
    hi: 'स्वागत'
  },
  signIn: {
    en: 'Sign In',
    pa: 'ਸਾਈਨ ਇਨ',
    hi: 'साइन इन'
  },
  signUp: {
    en: 'Sign Up',
    pa: 'ਸਾਈਨ ਅੱਪ',
    hi: 'साइन अप'
  },
  email: {
    en: 'Email',
    pa: 'ਈਮੇਲ',
    hi: 'ईमेल'
  },
  password: {
    en: 'Password',
    pa: 'ਪਾਸਵਰਡ',
    hi: 'पासवर्ड'
  },
  name: {
    en: 'Name',
    pa: 'ਨਾਮ',
    hi: 'नाम'
  },
  phone: {
    en: 'Phone Number',
    pa: 'ਫ਼ੋਨ ਨੰਬਰ',
    hi: 'फ़ोन नंबर'
  },
  signInToContinue: {
    en: 'Sign in to continue to FarmGuard',
    pa: 'ਫਾਰਮਗਾਰਡ ਵਿੱਚ ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ',
    hi: 'फार्मगार्ड में जारी रखने के लिए साइन इन करें'
  },
  needAccount: {
    en: "Don't have an account?",
    pa: 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਖਾਤਾ ਨਹੀਂ ਹੈ?',
    hi: 'क्या आपके पास खाता नहीं है?'
  },
  haveAccount: {
    en: 'Already have an account?',
    pa: 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?',
    hi: 'पहले से खाता है?'
  },
  createAccount: {
    en: 'Create your FarmGuard account',
    pa: 'ਆਪਣਾ ਫਾਰਮਗਾਰਡ ਖਾਤਾ ਬਣਾਓ',
    hi: 'अपना फार्मगार्ड खाता बनाएं'
  },

  // Dashboard
  dashboard: {
    en: 'Dashboard',
    pa: 'ਡੈਸ਼ਬੋਰਡ',
    hi: 'डैशबोर्ड'
  },
  welcomeBack: {
    en: 'Welcome back',
    pa: 'ਫਿਰ ਜੀ ਆਇਆਂ ਨੂੰ',
    hi: 'फिर से स्वागत'
  },
  todayWeather: {
    en: "Today's Weather",
    pa: 'ਅੱਜ ਦਾ ਮੌਸਮ',
    hi: 'आज का मौसम'
  },
  fullForecast: {
    en: 'Full Forecast',
    pa: 'ਪੂਰਾ ਮੌਸਮ ਪੂਰਵ ਅਨੁਮਾਨ',
    hi: 'पूरा मौसम पूर्वानुमान'
  },

  // Features
  cropSuggestions: {
    en: 'Crop Suggestions',
    pa: 'ਫਸਲ ਸੁਝਾਅ',
    hi: 'फसल सुझाव'
  },
  findBestCrops: {
    en: 'Find best crops for your land',
    pa: 'ਆਪਣੀ ਜ਼ਮੀਨ ਲਈ ਵਧੀਆ ਫਸਲਾਂ ਲੱਭੋ',
    hi: 'अपनी जमीन के लिए बेहतरीन फसलें खोजें'
  },
  askExpert: {
    en: 'Ask Expert',
    pa: 'ਮਾਹਿਰ ਤੋਂ ਪੁੱਛੋ',
    hi: 'विशेषज्ञ से पूछें'
  },
  instantFarmingAdvice: {
    en: 'Get instant farming advice',
    pa: 'ਤੁਰੰਤ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਲਓ',
    hi: 'तुरंत कृषि सलाह लें'
  },
  marketPrices: {
    en: 'Market Prices',
    pa: 'ਮਾਰਕੀਟ ਰੇਟ',
    hi: 'बाजार दर'
  },
  checkTodayRates: {
    en: "Check today's rates",
    pa: 'ਅੱਜ ਦੇ ਰੇਟ ਦੇਖੋ',
    hi: 'आज की दरें देखें'
  },
  weatherAlerts: {
    en: 'Weather Alerts',
    pa: 'ਮੌਸਮੀ ਚੇਤਾਵਨੀਆਂ',
    hi: 'मौसम चेतावनी'
  },
  pestDetection: {
    en: 'Pest Detection',
    pa: 'ਕੀੜੇ ਦੀ ਪਛਾਣ',
    hi: 'कीट पहचान'
  },
  soilAnalysis: {
    en: 'Soil Analysis',
    pa: 'ਮਿੱਟੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ',
    hi: 'मिट्टी का विश्लेषण'
  },
  aiAssistant: {
    en: 'AI Assistant',
    pa: 'AI ਸਹਾਇਕ',
    hi: 'AI सहायक'
  },

  // Weather terms
  sunny: {
    en: 'Sunny',
    pa: 'ਧੁੱਪ',
    hi: 'धूप'
  },
  cloudy: {
    en: 'Cloudy',
    pa: 'ਬੱਦਲਵਾਈ',
    hi: 'बादल'
  },
  rainy: {
    en: 'Rainy',
    pa: 'ਮੀਂਹ',
    hi: 'बारिश'
  },
  partlyCloudy: {
    en: 'Partly Cloudy',
    pa: 'ਥੋੜ੍ਹੇ ਬੱਦਲ',
    hi: 'आंशिक बादल'
  },
  humidity: {
    en: 'Humidity',
    pa: 'ਨਮੀ',
    hi: 'नमी'
  },
  wind: {
    en: 'Wind',
    pa: 'ਹਵਾ',
    hi: 'हवा'
  },
  rainfall: {
    en: 'Rainfall',
    pa: 'ਮੀਂਹ',
    hi: 'वर्षा'
  },

  // Crop names
  wheat: {
    en: 'Wheat',
    pa: 'ਕਣਕ',
    hi: 'गेहूं'
  },
  rice: {
    en: 'Rice',
    pa: 'ਚਾਵਲ',
    hi: 'चावल'
  },
  paddy: {
    en: 'Paddy',
    pa: 'ਧਾਨ',
    hi: 'धान'
  },
  maize: {
    en: 'Maize',
    pa: 'ਮੱਕੀ',
    hi: 'मक्का'
  },
  cotton: {
    en: 'Cotton',
    pa: 'ਕਪਾਹ',
    hi: 'कपास'
  },
  sugarcane: {
    en: 'Sugarcane',
    pa: 'ਗੰਨਾ',
    hi: 'गन्ना'
  },
  mustard: {
    en: 'Mustard',
    pa: 'ਸਰ੍ਹੋਂ',
    hi: 'सरसों'
  },
  onion: {
    en: 'Onion',
    pa: 'ਪਿਆਜ਼',
    hi: 'प्याज'
  },
  potato: {
    en: 'Potato',
    pa: 'ਆਲੂ',
    hi: 'आलू'
  },
  tomato: {
    en: 'Tomato',
    pa: 'ਟਮਾਟਰ',
    hi: 'टमाटर'
  },

  // Navigation
  home: {
    en: 'Home',
    pa: 'ਘਰ',
    hi: 'घर'
  },
  profile: {
    en: 'Profile',
    pa: 'ਪ੍ਰੋਫ਼ਾਈਲ',
    hi: 'प्रोफाइल'
  },
  settings: {
    en: 'Settings',
    pa: 'ਸੈਟਿੰਗਾਂ',
    hi: 'सेटिंग्स'
  },
  logout: {
    en: 'Logout',
    pa: 'ਲਾਗ ਆਊਟ',
    hi: 'लॉग आउट'
  },

  // Actions
  save: {
    en: 'Save',
    pa: 'ਸੇਵ ਕਰੋ',
    hi: 'सेव करें'
  },
  cancel: {
    en: 'Cancel',
    pa: 'ਰੱਦ ਕਰੋ',
    hi: 'रद्द करें'
  },
  submit: {
    en: 'Submit',
    pa: 'ਜਮ੍ਹਾਂ ਕਰੋ',
    hi: 'जमा करें'
  },
  continue: {
    en: 'Continue',
    pa: 'ਜਾਰੀ ਰੱਖੋ',
    hi: 'जारी रखें'
  },
  back: {
    en: 'Back',
    pa: 'ਵਾਪਸ',
    hi: 'वापस'
  },
  next: {
    en: 'Next',
    pa: 'ਅੱਗੇ',
    hi: 'आगे'
  },

  // Farm details
  farmSize: {
    en: 'Farm Size (acres)',
    pa: 'ਫਾਰਮ ਦਾ ਸਾਈਜ਼ (ਏਕੜ)',
    hi: 'खेत का आकार (एकड़)'
  },
  soilType: {
    en: 'Soil Type',
    pa: 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ',
    hi: 'मिट्टी का प्रकार'
  },
  irrigationType: {
    en: 'Irrigation Type',
    pa: 'ਸਿੰਚਾਈ ਦੀ ਕਿਸਮ',
    hi: 'सिंचाई का प्रकार'
  },
  farmingExperience: {
    en: 'Farming Experience',
    pa: 'ਖੇਤੀਬਾੜੀ ਦਾ ਤਜਰਬਾ',
    hi: 'कृषि अनुभव'
  },
  beginner: {
    en: 'Beginner',
    pa: 'ਸ਼ੁਰੂਆਤੀ',
    hi: 'शुरुआती'
  },
  intermediate: {
    en: 'Intermediate',
    pa: 'ਮੱਧਮ',
    hi: 'मध्यम'
  },
  experienced: {
    en: 'Experienced',
    pa: 'ਤਜਰਬੇਕਾਰ',
    hi: 'अनुभवी'
  },

  // Location
  district: {
    en: 'District',
    pa: 'ਜ਼ਿਲ੍ਹਾ',
    hi: 'जिला'
  },
  tehsil: {
    en: 'Tehsil',
    pa: 'ਤਹਿਸੀਲ',
    hi: 'तहसील'
  },
  village: {
    en: 'Village',
    pa: 'ਪਿੰਡ',
    hi: 'गांव'
  },
  location: {
    en: 'Location',
    pa: 'ਟਿਕਾਣਾ',
    hi: 'स्थान'
  },
  currentLocation: {
    en: 'Use Current Location',
    pa: 'ਮੌਜੂਦਾ ਟਿਕਾਣਾ ਵਰਤੋ',
    hi: 'वर्तमान स्थान का उपयोग करें'
  },

  // Messages
  loading: {
    en: 'Loading...',
    pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    hi: 'लोड हो रहा है...'
  },
  error: {
    en: 'Error',
    pa: 'ਗਲਤੀ',
    hi: 'त्रुटि'
  },
  success: {
    en: 'Success',
    pa: 'ਸਫਲਤਾ',
    hi: 'सफलता'
  },
  tryAgain: {
    en: 'Try Again',
    pa: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
    hi: 'पुनः प्रयास करें'
  },
  noData: {
    en: 'No data available',
    pa: 'ਕੋਈ ਡੇਟਾ ਉਪਲਬਧ ਨਹੀਂ',
    hi: 'कोई डेटा उपलब्ध नहीं'
  },

  // Time
  today: {
    en: 'Today',
    pa: 'ਅੱਜ',
    hi: 'आज'
  },
  tomorrow: {
    en: 'Tomorrow',
    pa: 'ਕੱਲ',
    hi: 'कल'
  },
  yesterday: {
    en: 'Yesterday',
    pa: 'ਬੀਤੇ ਕੱਲ',
    hi: 'बीते कल'
  },
  thisWeek: {
    en: 'This Week',
    pa: 'ਇਸ ਹਫ਼ਤੇ',
    hi: 'इस सप्ताह'
  },
  thisMonth: {
    en: 'This Month',
    pa: 'ਇਸ ਮਹੀਨੇ',
    hi: 'इस महीने'
  },

  // Units
  celsius: {
    en: '°C',
    pa: '°C',
    hi: '°C'
  },
  percentage: {
    en: '%',
    pa: '%',
    hi: '%'
  },
  kmPerHour: {
    en: 'km/h',
    pa: 'ਕਿ.ਮੀ./ਘੰਟਾ',
    hi: 'किमी/घंटा'
  },
  millimeters: {
    en: 'mm',
    pa: 'ਮਿ.ਮੀ.',
    hi: 'मिमी'
  },
  acres: {
    en: 'acres',
    pa: 'ਏਕੜ',
    hi: 'एकड़'
  },
  quintals: {
    en: 'quintals',
    pa: 'ਕੁਇੰਟਲ',
    hi: 'क्विंटल'
  },
  rupees: {
    en: '₹',
    pa: '₹',
    hi: '₹'
  }
}

// Punjab districts for location services
export const PUNJAB_DISTRICTS = [
  { en: 'Amritsar', pa: 'ਅਮ੍ਰਿਤਸਰ', hi: 'अमृतसर' },
  { en: 'Ludhiana', pa: 'ਲੁਧਿਆਣਾ', hi: 'लुधियाना' },
  { en: 'Jalandhar', pa: 'ਜਲੰਧਰ', hi: 'जालंधर' },
  { en: 'Patiala', pa: 'ਪਟਿਆਲਾ', hi: 'पटियाला' },
  { en: 'Bathinda', pa: 'ਬਠਿੰਡਾ', hi: 'बठिंडा' },
  { en: 'Mohali', pa: 'ਮੋਹਾਲੀ', hi: 'मोहाली' },
  { en: 'Gurdaspur', pa: 'ਗੁਰਦਾਸਪੁਰ', hi: 'गुरदासपुर' },
  { en: 'Hoshiarpur', pa: 'ਹੁਸ਼ਿਆਰਪੁਰ', hi: 'होशियारपुर' },
  { en: 'Ferozepur', pa: 'ਫਿਰੋਜ਼ਪੁਰ', hi: 'फिरोजपुर' },
  { en: 'Faridkot', pa: 'ਫਰੀਦਕੋਟ', hi: 'फरीदकोट' },
  { en: 'Muktsar', pa: 'ਮੁਕਤਸਰ', hi: 'मुक्तसर' },
  { en: 'Kapurthala', pa: 'ਕਪੂਰਥਲਾ', hi: 'कपूरथला' },
  { en: 'Sangrur', pa: 'ਸੰਗਰੂਰ', hi: 'संगरूर' },
  { en: 'Tarn Taran', pa: 'ਤਰਨ ਤਾਰਨ', hi: 'तरन तारन' },
  { en: 'Nawanshahr', pa: 'ਨਵਾਂਸ਼ਹਿਰ', hi: 'नवांशहर' },
  { en: 'Mansa', pa: 'ਮਾਨਸਾ', hi: 'मानसा' },
  { en: 'Ropar', pa: 'ਰੋਪੜ', hi: 'रोपड़' },
  { en: 'Fatehgarh Sahib', pa: 'ਫਤਿਹਗੜ੍ਹ ਸਾਹਿਬ', hi: 'फतेहगढ़ साहिब' },
  { en: 'Pathankot', pa: 'ਪਠਾਨਕੋਟ', hi: 'पठानकोट' },
  { en: 'Barnala', pa: 'ਬਰਨਾਲਾ', hi: 'बरनाला' },
  { en: 'Moga', pa: 'ਮੋਗਾ', hi: 'मोगा' },
  { en: 'Fazilka', pa: 'ਫਜ਼ਿਲਕਾ', hi: 'फाजिल्का' }
]

export function EnhancedLanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('farmguard-language') as Language
    if (savedLanguage && ['en', 'pa', 'hi'].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      // Detect system language preference
      const systemLang = navigator.language.split('-')[0]
      const detectedLang: Language = 
        systemLang === 'pa' ? 'pa' : 
        systemLang === 'hi' ? 'hi' : 'en'
      setLanguageState(detectedLang)
    }
    setIsLoading(false)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('farmguard-language', lang)
    
    // Update HTML lang attribute
    document.documentElement.lang = lang
    
    // Update HTML dir attribute for Punjabi (RTL support if needed)
    // Note: Punjabi written in Gurmukhi script is LTR, so we keep dir="ltr"
    document.documentElement.dir = 'ltr'
    
    console.log(`Language changed to: ${lang}`)
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language] || translation['en'] || key
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isLoading
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useEnhancedLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useEnhancedLanguage must be used within an EnhancedLanguageProvider')
  }
  return context
}

// Helper function to get localized district name
export function getLocalizedDistrict(districtEN: string, language: Language): string {
  const district = PUNJAB_DISTRICTS.find(d => d.en.toLowerCase() === districtEN.toLowerCase())
  if (district) {
    return district[language] || district.en
  }
  return districtEN
}

// Helper function to format numbers based on locale
export function formatNumber(number: number, language: Language): string {
  const locale = language === 'pa' ? 'pa-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
  return new Intl.NumberFormat(locale).format(number)
}

// Helper function to format currency
export function formatCurrency(amount: number, language: Language): string {
  const locale = language === 'pa' ? 'pa-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Helper function to format dates
export function formatDate(date: Date, language: Language): string {
  const locale = language === 'pa' ? 'pa-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}