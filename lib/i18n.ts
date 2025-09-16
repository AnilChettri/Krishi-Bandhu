export const languages = {
  en: "English",
  hi: "हिंदी",
  bn: "বাংলা",
  te: "తెలుగు",
  ta: "தமிழ்",
  mr: "मराठी",
  gu: "ગુજરાતી",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  pa: "ਪੰਜਾਬੀ",
} as const

export type Language = keyof typeof languages

export const translations = {
  en: {
    // Auth & Navigation
    welcome: "Welcome to FarmGuard",
    signInToContinue: "Sign in to continue",
    continueWithGoogle: "Continue with Google",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signUp: "Sign up",
    forgotPassword: "Forgot password?",
    needAccount: "Need an account?",
    logout: "Logout",
    selectLanguage: "Select Language",

    // Navigation
    weatherAlerts: "Weather Alerts",
    aiAssistant: "AI Assistant",
    farmSuggestions: "Farm Suggestions",

    // Dashboard
    profitabilityCalculator: "Profitability Calculator",
    recommendedCrops: "Recommended Crops for Your Farm",
    landSize: "Land Size (acres)",
    expectedYield: "Expected Yield (kg/acre)",
    totalCosts: "Total Costs (₹)",
    marketPrice: "Market Price (₹/kg)",
    estimatedProfit: "Estimated Profit",
    profitMargin: "Profit Margin",
    totalYield: "Total Yield",
    bestSowingWindow: "Best Sowing Window",
    harvestAlert: "Harvest Alert",
    marketTrend: "Market Trend",

    // Crop Details
    sowingTime: "Sowing Time",
    getAdvice: "Get Advice",
    planCrop: "Plan Crop",
    easy: "easy",
    medium: "medium",
    hard: "hard",

    // AI Assistant
    aiAssistantTitle: "AI Farming Assistant",
    aiAssistantSubtitle: "Get expert farming advice powered by artificial intelligence",
    askAnything: "Ask me anything about farming...",

    // Weather
    weatherDashboard: "Weather Dashboard",
    weatherSubtitle: "Stay updated with weather conditions for better farming decisions",
    weatherAlert: "Weather Alert",
    dayForecast: "5-Day Weather Forecast",
    today: "Today",
    tomorrow: "Tomorrow",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    humidity: "Humidity",
    wind: "Wind",

    // Market
    marketInfo: "Market Information",
    currentPrices: "Current Market Prices",
    selectMarket: "Select Market",
    searchCrops: "Search crops...",
    demand: "Demand",
    high: "High",
    low: "Low",

    // Common
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    save: "Save",
    cancel: "Cancel",
    continue: "Continue",
  },
  hi: {
    // Auth & Navigation
    welcome: "फार्मगार्ड में आपका स्वागत है",
    signInToContinue: "जारी रखने के लिए साइन इन करें",
    continueWithGoogle: "Google के साथ जारी रखें",
    email: "ईमेल",
    password: "पासवर्ड",
    signIn: "साइन इन",
    signUp: "साइन अप",
    forgotPassword: "पासवर्ड भूल गए?",
    needAccount: "खाता चाहिए?",
    logout: "लॉगआउट",
    selectLanguage: "भाषा चुनें",

    // Navigation
    weatherAlerts: "मौसम चेतावनी",
    aiAssistant: "AI सहायक",
    farmSuggestions: "खेती सुझाव",

    // Dashboard
    profitabilityCalculator: "लाभप्रदता कैलकुलेटर",
    recommendedCrops: "आपके खेत के लिए सुझाई गई फसलें",
    landSize: "भूमि का आकार (एकड़)",
    expectedYield: "अपेक्षित उत्पादन (किग्रा/एकड़)",
    totalCosts: "कुल लागत (₹)",
    marketPrice: "बाजार मूल्य (₹/किग्रा)",
    estimatedProfit: "अनुमानित लाभ",
    profitMargin: "लाभ मार्जिन",
    totalYield: "कुल उत्पादन",
    bestSowingWindow: "सर्वोत्तम बुआई समय",
    harvestAlert: "कटाई चेतावनी",
    marketTrend: "बाजार रुझान",

    // Crop Details
    sowingTime: "बुआई का समय",
    getAdvice: "सलाह लें",
    planCrop: "फसल योजना",
    easy: "आसान",
    medium: "मध्यम",
    hard: "कठिन",

    // AI Assistant
    aiAssistantTitle: "AI कृषि सहायक",
    aiAssistantSubtitle: "कृत्रिम बुद्धिमत्ता द्वारा संचालित विशेषज्ञ कृषि सलाह प्राप्त करें",
    askAnything: "खेती के बारे में कुछ भी पूछें...",

    // Weather
    weatherDashboard: "मौसम डैशबोर्ड",
    weatherSubtitle: "बेहतर कृषि निर्णयों के लिए मौसम की स्थिति से अपडेट रहें",
    weatherAlert: "मौसम चेतावनी",
    dayForecast: "5-दिन मौसम पूर्वानुमान",
    today: "आज",
    tomorrow: "कल",
    wednesday: "बुधवार",
    thursday: "गुरुवार",
    friday: "शुक्रवार",
    humidity: "नमी",
    wind: "हवा",

    // Market
    marketInfo: "बाजार जानकारी",
    currentPrices: "वर्तमान बाजार मूल्य",
    selectMarket: "बाजार चुनें",
    searchCrops: "फसलें खोजें...",
    demand: "मांग",
    high: "उच्च",
    low: "कम",

    // Common
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    retry: "पुनः प्रयास",
    save: "सहेजें",
    cancel: "रद्द करें",
    continue: "जारी रखें",
  },
  bn: {
    // Auth & Navigation
    welcome: "ফার্মগার্ডে স্বাগতম",
    signInToContinue: "চালিয়ে যেতে সাইন ইন করুন",
    continueWithGoogle: "Google দিয়ে চালিয়ে যান",
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    signIn: "সাইন ইন",
    signUp: "সাইন আপ",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    needAccount: "অ্যাকাউন্ট প্রয়োজন?",
    logout: "লগআউট",
    selectLanguage: "ভাষা নির্বাচন করুন",

    // Navigation
    weatherAlerts: "আবহাওয়া সতর্কতা",
    aiAssistant: "AI সহায়ক",
    farmSuggestions: "কৃষি পরামর্শ",

    // Dashboard
    profitabilityCalculator: "লাভজনকতা ক্যালকুলেটর",
    recommendedCrops: "আপনার খামারের জন্য প্রস্তাবিত ফসল",
    landSize: "জমির আকার (একর)",
    expectedYield: "প্রত্যাশিত ফলন (কেজি/একর)",
    totalCosts: "মোট খরচ (₹)",
    marketPrice: "বাজার মূল্য (₹/কেজি)",
    estimatedProfit: "আনুমানিক লাভ",
    profitMargin: "লাভের মার্জিন",
    totalYield: "মোট ফলন",
    bestSowingWindow: "সেরা বপনের সময়",
    harvestAlert: "ফসল কাটার সতর্কতা",
    marketTrend: "বাজার প্রবণতা",

    // Crop Details
    sowingTime: "বপনের সময়",
    getAdvice: "পরামর্শ নিন",
    planCrop: "ফসল পরিকল্পনা",
    easy: "সহজ",
    medium: "মাঝারি",
    hard: "কঠিন",

    // AI Assistant
    aiAssistantTitle: "AI কৃষি সহায়ক",
    aiAssistantSubtitle: "কৃত্রিম বুদ্ধিমত্তা দ্বারা চালিত বিশেষজ্ঞ কৃষি পরামর্শ পান",
    askAnything: "কৃষি সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন...",

    // Weather
    weatherDashboard: "আবহাওয়া ড্যাশবোর্ড",
    weatherSubtitle: "ভাল কৃষি সিদ্ধান্তের জন্য আবহাওয়ার অবস্থা সম্পর্কে আপডেট থাকুন",
    weatherAlert: "আবহাওয়া সতর্কতা",
    dayForecast: "৫-দিনের আবহাওয়া পূর্বাভাস",
    today: "আজ",
    tomorrow: "আগামীকাল",
    wednesday: "বুধবার",
    thursday: "বৃহস্পতিবার",
    friday: "শুক্রবার",
    humidity: "আর্দ্রতা",
    wind: "বাতাস",

    // Market
    marketInfo: "বাজার তথ্য",
    currentPrices: "বর্তমান বাজার মূল্য",
    selectMarket: "বাজার নির্বাচন করুন",
    searchCrops: "ফসল খুঁজুন...",
    demand: "চাহিদা",
    high: "উচ্চ",
    low: "কম",

    // Common
    loading: "লোড হচ্ছে...",
    error: "ত্রুটি",
    retry: "আবার চেষ্টা করুন",
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল",
    continue: "চালিয়ে যান",
  },
  // Additional languages can be added here following the same pattern
} as const

export function getTranslation(language: Language, key: keyof typeof translations.en): string {
  // Only access translation if language exists in translations object
  const supportedLanguages = ['en', 'hi', 'bn'] as const
  type SupportedLanguage = typeof supportedLanguages[number]
  
  const translationLang = supportedLanguages.includes(language as SupportedLanguage) 
    ? (language as SupportedLanguage) 
    : 'en'
    
  return translations[translationLang][key] || key
}
