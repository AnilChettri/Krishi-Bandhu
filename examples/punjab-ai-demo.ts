import { PunjabAIAssistant } from '../lib/punjab-ai-assistant';

/**
 * Demonstration examples for Punjab AI Assistant
 * Shows real-world farmer scenarios and expected responses
 */

export async function runDemonstration() {
  const assistant = new PunjabAIAssistant();
  
  console.log('🌾 Punjab AI Assistant - Demonstration Examples\n');
  console.log('=' .repeat(50));

  // Example 1: Wheat Cultivation Query (English SMS)
  console.log('\n📱 SMS Example - Wheat Cultivation Query');
  console.log('Query: "When should I sow wheat in Punjab?"');
  console.log('Language: English | Channel: SMS');
  
  const wheatQuery = await assistant.processQuery(
    "When should I sow wheat in Punjab?",
    'en',
    'sms'
  );
  
  console.log(`Response: "${wheatQuery.content}"`);
  console.log(`Module: ${wheatQuery.module} | Confidence: ${wheatQuery.confidence}`);
  console.log(`Sources: ${wheatQuery.sources.join(', ')}`);

  // Example 2: Pest Management Query (WhatsApp with emojis)
  console.log('\n🐛 WhatsApp Example - Pest Management');
  console.log('Query: "Pink bollworm attack in my cotton field"');
  console.log('Language: English | Channel: WhatsApp');
  
  const pestQuery = await assistant.processQuery(
    "Pink bollworm attack in my cotton field",
    'en',
    'whatsapp'
  );
  
  console.log(`Response: "${pestQuery.content}"`);
  console.log(`Module: ${pestQuery.module} | Confidence: ${pestQuery.confidence}`);

  // Example 3: Government Scheme Query (Punjabi WhatsApp)
  console.log('\n🏛️ Punjabi Example - Government Scheme');
  console.log('Query: "PM Kisan ਯੋਜਨਾ ਬਾਰੇ ਦੱਸੋ"');
  console.log('Language: Punjabi | Channel: WhatsApp');
  
  const schemeQuery = await assistant.processQuery(
    "PM Kisan ਯੋਜਨਾ ਬਾਰੇ ਦੱਸੋ",
    'pa',
    'whatsapp'
  );
  
  console.log(`Response: "${schemeQuery.content}"`);
  console.log(`Module: ${schemeQuery.module} | Confidence: ${schemeQuery.confidence}`);

  // Example 4: Market Rates Query (SMS)
  console.log('\n💰 Market Rates Example - Mandi Prices');
  console.log('Query: "Current wheat rates in Ludhiana mandi"');
  console.log('Language: English | Channel: SMS');
  
  const marketQuery = await assistant.processQuery(
    "Current wheat rates in Ludhiana mandi",
    'en',
    'sms'
  );
  
  console.log(`Response: "${marketQuery.content}"`);
  console.log(`Module: ${marketQuery.module} | Confidence: ${marketQuery.confidence}`);

  // Example 5: Weather Alert (Push Notification)
  console.log('\n🌦️ Push Notification Example - Weather Alert');
  console.log('Query: "Weather forecast for next 3 days"');
  console.log('Language: English | Channel: Push');
  
  const weatherQuery = await assistant.processQuery(
    "Weather forecast for next 3 days",
    'en',
    'push'
  );
  
  console.log(`Response: "${weatherQuery.content}"`);
  console.log(`Module: ${weatherQuery.module} | Confidence: ${weatherQuery.confidence}`);

  // Example 6: Soil Health Query (Voice Note)
  console.log('\n🎤 Voice Note Example - Soil Health');
  console.log('Query: "How to improve soil fertility in my field?"');
  console.log('Language: English | Channel: Voice');
  
  const soilQuery = await assistant.processQuery(
    "How to improve soil fertility in my field?",
    'en',
    'voice'
  );
  
  console.log(`Response: "${soilQuery.content}"`);
  console.log(`Module: ${soilQuery.module} | Confidence: ${soilQuery.confidence}`);

  // Example 7: Domain Rejection (Non-agriculture query)
  console.log('\n🚫 Domain Rejection Example');
  console.log('Query: "What is the capital of India?"');
  console.log('Language: English | Channel: SMS');
  
  const rejectedQuery = await assistant.processQuery(
    "What is the capital of India?",
    'en',
    'sms'
  );
  
  console.log(`Response: "${rejectedQuery.content}"`);
  console.log(`Valid: ${rejectedQuery.isValid} | Confidence: ${rejectedQuery.confidence}`);

  // Example 8: Dairy Management (Punjabi Voice)
  console.log('\n🐄 Dairy Management Example (Punjabi Voice)');
  console.log('Query: "ਗਾਵਾਂ ਦਾ ਚਾਰਾ ਕਿਹੜਾ ਚੰਗਾ ਹੈ?"');
  console.log('Language: Punjabi | Channel: Voice');
  
  const dairyQuery = await assistant.processQuery(
    "ਗਾਵਾਂ ਦਾ ਚਾਰਾ ਕਿਹੜਾ ਚੰਗਾ ਹੈ?",
    'pa',
    'voice'
  );
  
  console.log(`Response: "${dairyQuery.content}"`);
  console.log(`Module: ${dairyQuery.module} | Confidence: ${dairyQuery.confidence}`);

  console.log('\n' + '='.repeat(50));
  console.log('🎯 Demonstration completed successfully!');
}

// Sample farmer scenarios with expected responses
export const farmerScenarios = [
  {
    scenario: "New farmer needs wheat cultivation guidance",
    query: "I am new to farming. How to grow wheat in Punjab?",
    expectedModule: "crop_advice",
    expectedKeywords: ["wheat", "sowing", "November", "variety", "fertilizer"],
    language: "en",
    channel: "whatsapp"
  },
  {
    scenario: "Experienced farmer facing pest issue",
    query: "White flies in cotton crop, need immediate solution",
    expectedModule: "pest_disease",
    expectedKeywords: ["white flies", "cotton", "spray", "treatment"],
    language: "en",
    channel: "push"
  },
  {
    scenario: "Farmer checking market timing",
    query: "Should I sell my paddy now or wait for better rates?",
    expectedModule: "mandi_rates",
    expectedKeywords: ["paddy", "rates", "market", "₹"],
    language: "en",
    channel: "sms"
  },
  {
    scenario: "Punjabi farmer asking about government benefit",
    query: "ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਕਿਵੇਂ ਲੈਣੀ ਹੈ?",
    expectedModule: "govt_schemes",
    expectedKeywords: ["ਸਬਸਿਡੀ", "ਸਰਕਾਰੀ"],
    language: "pa",
    channel: "whatsapp"
  },
  {
    scenario: "Farmer needs weather information",
    query: "Will it rain this week? Should I water my crops?",
    expectedModule: "weather",
    expectedKeywords: ["weather", "rain", "week"],
    language: "en",
    channel: "push"
  },
  {
    scenario: "Soil health deterioration concern",
    query: "My crop yield is reducing every year, soil issue?",
    expectedModule: "soil_health",
    expectedKeywords: ["soil", "yield", "test", "fertility"],
    language: "en",
    channel: "whatsapp"
  },
  {
    scenario: "Dairy farmer needs feeding advice",
    query: "Best feed for high milk production in buffaloes",
    expectedModule: "dairy",
    expectedKeywords: ["feed", "milk", "buffalo", "production"],
    language: "en",
    channel: "sms"
  },
  {
    scenario: "Crop rotation planning",
    query: "After wheat harvest, which summer crop is profitable?",
    expectedModule: "crop_planning",
    expectedKeywords: ["wheat", "summer", "crop", "profitable"],
    language: "en",
    channel: "whatsapp"
  }
];

// Channel formatting examples
export const channelExamples = {
  sms: {
    maxLength: 160,
    features: ["Plain text", "No emojis", "Concise", "Essential info only"],
    example: "Wheat sowing: Nov 15-30. Use PBW 343. Apply 120kg urea/acre in 3 splits. Source: PAU"
  },
  
  whatsapp: {
    maxLength: 4096,
    features: ["Emojis", "Bold text", "Multiple lines", "Rich formatting"],
    example: `🌾 *Wheat Cultivation Guide*

📅 *Sowing Time:* November 15-30
🌱 *Variety:* PBW 343, HD 3086
💧 *Irrigation:* 4-5 times
🧪 *Fertilizer:* 120kg urea/acre

💡 *Pro Tip:* Apply zinc sulfate for better yield

📞 *Help:* KVK Ludhiana
📚 *Source:* PAU Guidelines`
  },

  push: {
    maxLength: 100,
    features: ["Very short", "Action-oriented", "Urgent info", "Emojis"],
    example: "🚨 Pink bollworm alert! Spray immediately. Check WhatsApp for details."
  },

  voice: {
    maxLength: 500,
    features: ["Clear instructions", "Pause markers", "Step-by-step", "No special characters"],
    example: `For wheat cultivation in Punjab, [PAUSE] sow between November 15 to 30. [PAUSE] Use varieties like PBW 343 or HD 3086. [PAUSE] Apply 120 kilograms urea per acre in three equal splits. [PAUSE] First at sowing, second after 30 days, third at flowering. [PAUSE] Contact your nearest KVK for more details.`
  }
};

// Performance benchmarks
export const performanceBenchmarks = {
  responseTime: {
    target: "< 2 seconds",
    description: "Average response time for processing farmer queries"
  },
  
  accuracy: {
    target: "> 90%",
    description: "Accuracy of domain classification and response relevance"
  },
  
  confidence: {
    highConfidence: "> 0.8 for specific queries (variety names, exact dates)",
    mediumConfidence: "0.5-0.8 for general advice",
    lowConfidence: "< 0.5 for unclear or out-of-scope queries"
  },
  
  coverage: {
    crops: "Wheat, Paddy, Cotton, Maize, Sugarcane, Vegetables",
    districts: "All 22 districts of Punjab",
    languages: "English and Punjabi (Gurmukhi)",
    channels: "SMS, WhatsApp, Push, Voice"
  }
};

// Integration examples with external systems
export const integrationExamples = {
  mobileApp: {
    description: "Integration with FarmGuard mobile app",
    endpoint: "/api/punjab-ai-assistant",
    sampleRequest: {
      query: "When to sow wheat?",
      language: "en",
      channel: "whatsapp",
      userId: "farmer_123",
      location: "Ludhiana"
    },
    sampleResponse: {
      isValid: true,
      module: "crop_advice",
      content: "🌾 *Wheat Sowing Guide*...",
      confidence: 0.92,
      sources: ["PAU Guidelines"],
      language: "en",
      channel: "whatsapp"
    }
  },
  
  smsGateway: {
    description: "SMS delivery through telecom providers",
    format: "Plain text, 160 characters max",
    example: "Wheat sowing: Nov 15-30. Use PBW 343. Contact KVK for seeds. -FarmGuard"
  },
  
  whatsappBusiness: {
    description: "WhatsApp Business API integration",
    features: ["Rich formatting", "Media support", "Interactive buttons"],
    template: "Structured responses with emojis and formatting"
  },
  
  pushNotifications: {
    description: "Mobile app push notifications",
    useCase: "Urgent alerts, weather warnings, pest outbreaks",
    example: "🚨 Heavy rain expected. Cover your crops! Details in app."
  }
};

if (require.main === module) {
  runDemonstration().catch(console.error);
}