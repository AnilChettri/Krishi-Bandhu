export const languages = {
  en: "English",
  hi: "हिन्दी",
  pa: "ਪੰਜਾਬੀ",
} as const

export const languageDetails = {
  en: { name: "English", nativeName: "English", region: "Global" },
  hi: { name: "Hindi", nativeName: "हिन्दी", region: "भारत" },
  pa: { name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", region: "ਪੰਜਾਬ" },
} as const

export type Language = keyof typeof languages

export const translations = {
  en: {
    // Auth & Navigation
    welcome: "Welcome to Krishi Bandhu",
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
    welcome: "कृषि बंधु में आपका स्वागत है",
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
  pa: {
    // Auth & Navigation
    welcome: "ਕ੍ਰਿਸ਼ੀ ਬੰਧੂ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
    signInToContinue: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਇਨ ਇਨ ਕਰੋ",
    continueWithGoogle: "Google ਨਾਲ ਜਾਰੀ ਰੱਖੋ",
    email: "ਈਮੇਲ",
    password: "ਪਾਸਵਰਡ",
    signIn: "ਸਾਇਨ ਇਨ",
    signUp: "ਸਾਇਨ ਅਪ",
    forgotPassword: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    needAccount: "ਖਾਤੇ ਦੀ ਲੋੜ ਹੈ?",
    logout: "ਲਾਗਆਉਟ",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",

    // Navigation
    weatherAlerts: "ਮੌਸਮੀ ਚੇਤਾਵਨੀਆਂ",
    aiAssistant: "AI ਸਹਾਇਕ",
    farmSuggestions: "ਖੇਤੀ ਸੁਝਾਅ",

    // Dashboard
    profitabilityCalculator: "ਮੁਨਾਫਾ ਕੈਲਕੁਲੇਟਰ",
    recommendedCrops: "ਤੁਹਾਡੇ ਫਾਰਮ ਲਈ ਸਿਫਾਰਸ਼ੀ ਫਸਲਾਂ",
    landSize: "ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ (ਏਕੜ)",
    expectedYield: "ਸੰਭਾਵਿਤ ਪੈਦਾਵਾਰ (ਕਿਲੋ/ਏਕੜ)",
    totalCosts: "ਕੁੱਲ ਲਾਗਤ (₹)",
    marketPrice: "ਮਾਰਕੀਟ ਰੇਟ (₹/ਕਿਲੋ)",
    estimatedProfit: "ਅਨੁਮਾਨਿਤ ਮੁਨਾਫਾ",
    profitMargin: "ਮੁਨਾਫਾ ਮਾਰਜਿਨ",
    totalYield: "ਕੁੱਲ ਪੈਦਾਵਾਰ",
    bestSowingWindow: "ਸਭ ਤੋਂ ਵਧੀਆ ਬਿਜਾਈ ਸਮਾਂ",
    harvestAlert: "ਫਸਲ ਕਟਾਈ ਚੇਤਾਵਨੀ",
    marketTrend: "ਮਾਰਕੀਟ ਰੁਝਾਨ",

    // Crop Details
    sowingTime: "ਬਿਜਾਈ ਦਾ ਸਮਾਂ",
    getAdvice: "ਸਲਾਹ ਲਓ",
    planCrop: "ਫਸਲ ਦੀ ਯੋਜਨਾ",
    easy: "ਆਸਾਨ",
    medium: "ਮੱਧਮ",
    hard: "ਮੁਸ਼ਕਲ",

    // AI Assistant
    aiAssistantTitle: "AI ਖੇਤੀ ਸਹਾਇਕ",
    aiAssistantSubtitle: "ਆਰਟੀਫਿਸ਼ੀਅਲ ਇੰਟੈਲੀਜੈਂਸ ਦੁਆਰਾ ਸੰਚਾਲਿਤ ਮਾਹਰ ਖੇਤੀ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰੋ",
    askAnything: "ਖੇਤੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...",

    // Weather
    weatherDashboard: "ਮੌਸਮ ਡੈਸ਼ਬੋਰਡ",
    weatherSubtitle: "ਬਿਹਤਰ ਖੇਤੀ ਫੈਸਲਿਆਂ ਲਈ ਮੌਸਮ ਦੀ ਸਥਿਤੀ ਨਾਲ ਅਪਡੇਟ ਰਹੋ",
    weatherAlert: "ਮੌਸਮੀ ਚੇਤਾਵਨੀ",
    dayForecast: "5-ਦਿਨਾਂ ਦਾ ਮੌਸਮੀ ਪੂਰਵ-ਅਨੁਮਾਨ",
    today: "ਅੱਜ",
    tomorrow: "ਕੱਲ੍ਹ",
    wednesday: "ਬੁੱਧਵਾਰ",
    thursday: "ਵੀਰਵਾਰ",
    friday: "ਸ਼ੁੱਕਰਵਾਰ",
    humidity: "ਨਮੀ",
    wind: "ਹਵਾ",

    // Market
    marketInfo: "ਮਾਰਕੀਟ ਦੀ ਜਾਣਕਾਰੀ",
    currentPrices: "ਮੌਜੂਦਾ ਮਾਰਕੀਟ ਰੇਟ",
    selectMarket: "ਮਾਰਕੀਟ ਚੁਣੋ",
    searchCrops: "ਫਸਲਾਂ ਖੋਜੋ...",
    demand: "ਮੰਗ",
    high: "ਉੱਚੀ",
    low: "ਘੱਟ",

    // Common
    loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    error: "ਗਲਤੀ",
    retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    save: "ਸੇਵ ਕਰੋ",
    cancel: "ਰੱਦ ਕਰੋ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
  },
} as const

export function getTranslation(language: Language, key: keyof typeof translations.en): string {
  // All three languages are fully supported
  const supportedLanguages: Language[] = ['en', 'hi', 'pa']
  
  const translationLang = supportedLanguages.includes(language) ? language : 'en'
  return translations[translationLang][key] || translations.en[key] || key
}
