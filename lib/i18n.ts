export const languages = {
  en: "English",
  hi: "हिंदी",
  kn: "ಕನ್ನಡ",
  pa: "ਪੰਜਾਬੀ",
  ta: "தமிழ்",
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
  kn: {
    // Auth & Navigation
    welcome: "ಫಾರ್ಮ್‌ಗಾರ್ಡ್‌ಗೆ ಸ್ವಾಗತ",
    signInToContinue: "ಮುಂದುವರಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ",
    continueWithGoogle: "Google ನೊಂದಿಗೆ ಮುಂದುವರಿಸಿ",
    email: "ಇಮೇಲ್",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    signIn: "ಸೈನ್ ಇನ್",
    signUp: "ಸೈನ್ ಅಪ್",
    forgotPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
    needAccount: "ಖಾತೆ ಬೇಕೇ?",
    logout: "ಲಾಗೌಟ್",
    selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",

    // Navigation
    weatherAlerts: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು",
    aiAssistant: "AI ಸಹಾಯಕ",
    farmSuggestions: "ಕೃಷಿ ಸಲಹೆಗಳು",

    // Dashboard
    profitabilityCalculator: "ಲಾಭದಾಯಕತೆ ಲೆಕ್ಕಾಚಾರ",
    recommendedCrops: "ನಿಮ್ಮ ಫಾರ್ಮ್‌ಗೆ ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು",
    landSize: "ಭೂಮಿಯ ಗಾತ್ರ (ಎಕರೆ)",
    expectedYield: "ನಿರೀಕ್ಷಿತ ಇಳುವರಿ (ಕೆಜಿ/ಎಕರೆ)",
    totalCosts: "ಒಟ್ಟು ವೆಚ್ಚಗಳು (₹)",
    marketPrice: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ (₹/ಕೆಜಿ)",
    estimatedProfit: "ಅಂದಾಜು ಲಾಭ",
    profitMargin: "ಲಾಭ ಅಂತರ",
    totalYield: "ಒಟ್ಟು ಇಳುವರಿ",
    bestSowingWindow: "ಅತ್ಯುತ್ತಮ ಬಿತ್ತನೆ ಸಮಯ",
    harvestAlert: "ಸುಗ್ಗಿಯ ಎಚ್ಚರಿಕೆ",
    marketTrend: "ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿ",

    // Crop Details
    sowingTime: "ಬಿತ್ತನೆ ಸಮಯ",
    getAdvice: "ಸಲಹೆ ಪಡೆಯಿರಿ",
    planCrop: "ಬೆಳೆ ಯೋಜನೆ",
    easy: "ಸುಲಭ",
    medium: "ಮಧ್ಯಮ",
    hard: "ಕಠಿಣ",

    // AI Assistant
    aiAssistantTitle: "AI ಕೃಷಿ ಸಹಾಯಕ",
    aiAssistantSubtitle: "ಕೃತ್ರಿಮ ಬುದ್ಧಿಮತ್ತೆಯಿಂದ ನಡೆಸಲ್ಪಡುವ ತಜ್ಞ ಕೃಷಿ ಸಲಹೆ ಪಡೆಯಿರಿ",
    askAnything: "ಕೃಷಿ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ...",

    // Weather
    weatherDashboard: "ಹವಾಮಾನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    weatherSubtitle: "ಉತ್ತಮ ಕೃಷಿ ನಿರ್ಧಾರಗಳಿಗಾಗಿ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳೊಂದಿಗೆ ನವೀಕರಿಸಿ",
    weatherAlert: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ",
    dayForecast: "5-ದಿನಗಳ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    today: "ಇಂದು",
    tomorrow: "ನಾಳೆ",
    wednesday: "ಬುಧವಾರ",
    thursday: "ಗುರುವಾರ",
    friday: "ಶುಕ್ರವಾರ",
    humidity: "ಆರ್ದ್ರತೆ",
    wind: "ಗಾಳಿ",

    // Market
    marketInfo: "ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ",
    currentPrices: "ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    selectMarket: "ಮಾರುಕಟ್ಟೆ ಆಯ್ಕೆ ಮಾಡಿ",
    searchCrops: "ಬೆಳೆಗಳನ್ನು ಹುಡುಕಿ...",
    demand: "ಬೇಡಿಕೆ",
    high: "ಹೆಚ್ಚು",
    low: "ಕಡಿಮೆ",

    // Common
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    error: "ದೋಷ",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    save: "ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    continue: "ಮುಂದುವರಿಸಿ",
  },
  pa: {
    // Auth & Navigation
    welcome: "ਫਾਰਮਗਾਰਡ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
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
  ta: {
    // Auth & Navigation
    welcome: "FarmGuard இல் வரவேற்கிறோம்",
    signInToContinue: "தொடர சைன் இன் செய்யவும்",
    continueWithGoogle: "Google உடன் தொடரவும்",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    signIn: "உள்நுழைய",
    signUp: "பதிவு செய்க",
    forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
    needAccount: "கணக்கு தேவையா?",
    logout: "வெளியேறு",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",

    // Navigation
    weatherAlerts: "வானிலை எச்சரிக்கைகள்",
    aiAssistant: "AI உதவியாளர்",
    farmSuggestions: "விவசாய ஆலோசனைகள்",

    // Dashboard
    profitabilityCalculator: "லாபகரமான கணக்கீட்டாளர்",
    recommendedCrops: "உங்கள் பண்ணைக்கு பரிந்துரைக்கப்பட்ட பயிர்கள்",
    landSize: "நிலத்தின் அளவு (ஏக்கர்)",
    expectedYield: "எதிர்பார்க்கப்படும் விளைச்சல் (கிலோ/ஏக்கர்)",
    totalCosts: "மொத்த செலவுகள் (₹)",
    marketPrice: "சந்தை விலை (₹/கிலோ)",
    estimatedProfit: "மதிப்பிடப்பட்ட லாபம்",
    profitMargin: "லாப வரம்பு",
    totalYield: "மொத்த விளைச்சல்",
    bestSowingWindow: "சிறந்த விதைப்பு நேரம்",
    harvestAlert: "அறுவடை எச்சரிக்கை",
    marketTrend: "சந்தை போக்கு",

    // Crop Details
    sowingTime: "விதைப்பு நேரம்",
    getAdvice: "ஆலோசனை பெறவும்",
    planCrop: "பயிர் திட்டம்",
    easy: "எளிது",
    medium: "நடுத்தர",
    hard: "கடினம்",

    // AI Assistant
    aiAssistantTitle: "AI விவசாய உதவியாளர்",
    aiAssistantSubtitle: "செயற்கை நுண்ணறிவால் இயக்கப்படும் நிபுணர் விவசாய ஆலோசனையைப் பெறுங்கள்",
    askAnything: "விவசாயம் பற்றி எதையும் கேளுங்கள்...",

    // Weather
    weatherDashboard: "வானிலை டாஷ்போர்டு",
    weatherSubtitle: "சிறந்த விவசாய முடிவுகளுக்கு வானிலை நிலைமைகளுடன் புதுப்பிக்கவும்",
    weatherAlert: "வானிலை எச்சரிக்கை",
    dayForecast: "5-நாள் வானிலை முன்னறிவிப்பு",
    today: "இன்று",
    tomorrow: "நாளை",
    wednesday: "புதன்கிழமை",
    thursday: "வியாழன்",
    friday: "வெள்ளி",
    humidity: "ஈரப்பதம்",
    wind: "காற்று",

    // Market
    marketInfo: "சந்தை தகவல்",
    currentPrices: "தற்போதைய சந்தை விலைகள்",
    selectMarket: "சந்தையைத் தேர்ந்தெடுக்கவும்",
    searchCrops: "பயிர்களைத் தேடுங்கள்...",
    demand: "தேவை",
    high: "அதிகம்",
    low: "குறைவு",

    // Common
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    retry: "மீண்டும் முயற்சிக்கவும்",
    save: "சேமிக்கவும்",
    cancel: "ரத்துசெய்",
    continue: "தொடரவும்",
  },
  // Additional languages can be added here following the same pattern
} as const

export function getTranslation(language: Language, key: keyof typeof translations.en): string {
  // Only access translation if language exists in translations object
  const supportedLanguages = ['en', 'hi', 'kn', 'pa', 'ta'] as const
  type SupportedLanguage = typeof supportedLanguages[number]
  
  const translationLang = supportedLanguages.includes(language as SupportedLanguage) 
    ? (language as SupportedLanguage) 
    : 'en'
    
  return translations[translationLang][key] || key
}
