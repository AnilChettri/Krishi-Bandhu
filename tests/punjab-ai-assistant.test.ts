import { PunjabAIAssistant } from '../lib/punjab-ai-assistant';
import { punjabKnowledgeBase } from '../lib/punjab-knowledge-base';

describe('Punjab AI Assistant', () => {
  let assistant: PunjabAIAssistant;

  beforeEach(() => {
    assistant = new PunjabAIAssistant();
  });

  describe('Domain Validation', () => {
    test('should accept agriculture-related queries', async () => {
      const query = "What is the best variety of wheat for Punjab?";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(true);
      expect(response.content).toContain('wheat');
      expect(response.confidence).toBeGreaterThan(0.7);
    });

    test('should reject non-agriculture queries', async () => {
      const query = "What is the capital of India?";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(false);
      expect(response.content).toContain('agriculture-related');
      expect(response.confidence).toBeLessThan(0.3);
    });

    test('should reject technology queries', async () => {
      const query = "How to fix my smartphone?";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(false);
      expect(response.content).toContain('farming and agriculture');
    });

    test('should reject entertainment queries', async () => {
      const query = "Tell me about Bollywood movies";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(false);
      expect(response.content).toContain('Punjab agriculture');
    });
  });

  describe('Crop Advice Module', () => {
    test('should provide wheat cultivation advice', async () => {
      const query = "When should I sow wheat in Punjab?";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('crop_advice');
      expect(response.content).toContain('November');
      expect(response.content).toContain('wheat');
      expect(response.sources).toContain('PAU Guidelines');
    });

    test('should provide paddy cultivation advice', async () => {
      const query = "Best time to transplant paddy in Punjab";
      const response = await assistant.processQuery(query, 'en', 'whatsapp');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('crop_advice');
      expect(response.content).toContain('June');
      expect(response.content).toContain('paddy');
      expect(response.sources).toContain('PAU Guidelines');
    });

    test('should provide fertilizer recommendations', async () => {
      const query = "How much urea should I apply to wheat crop?";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(true);
      expect(response.content).toContain('urea');
      expect(response.content).toContain('kg/acre');
      expect(response.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('Pest Management Module', () => {
    test('should identify and provide solutions for pink bollworm', async () => {
      const query = "Pink bollworm attack in cotton, what to do?";
      const response = await assistant.processQuery(query, 'en', 'push');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('pest_disease');
      expect(response.content).toContain('pink bollworm');
      expect(response.content).toContain('cotton');
      expect(response.sources).toContain('PAU Entomology');
    });

    test('should provide brown plant hopper management', async () => {
      const query = "Brown plant hopper in paddy field";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(true);
      expect(response.content).toContain('brown plant hopper');
      expect(response.content).toContain('paddy');
      expect(response.confidence).toBeGreaterThan(0.7);
    });
  });

  describe('Government Schemes Module', () => {
    test('should provide PM-KISAN scheme information', async () => {
      const query = "Tell me about PM Kisan scheme eligibility";
      const response = await assistant.processQuery(query, 'en', 'whatsapp');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('govt_schemes');
      expect(response.content).toContain('PM-KISAN');
      expect(response.content).toContain('₹6000');
      expect(response.sources).toContain('Government of India');
    });

    test('should provide Punjab Fasal Bima information', async () => {
      const query = "How to apply for crop insurance in Punjab?";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(true);
      expect(response.content).toContain('insurance');
      expect(response.content).toContain('Punjab');
      expect(response.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('Mandi Rates Module', () => {
    test('should provide wheat mandi rates', async () => {
      const query = "Current wheat rates in Ludhiana mandi";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('mandi_rates');
      expect(response.content).toContain('wheat');
      expect(response.content).toContain('Ludhiana');
      expect(response.content).toContain('₹');
      expect(response.sources).toContain('eNAM Portal');
    });

    test('should provide paddy mandi rates', async () => {
      const query = "Paddy price in Bathinda market";
      const response = await assistant.processQuery(query, 'en', 'whatsapp');
      
      expect(response.isValid).toBe(true);
      expect(response.content).toContain('paddy');
      expect(response.content).toContain('Bathinda');
      expect(response.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('Weather Alerts Module', () => {
    test('should provide weather advisory for farming', async () => {
      const query = "Weather forecast for farming this week";
      const response = await assistant.processQuery(query, 'en', 'push');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('weather');
      expect(response.content).toContain('weather');
      expect(response.sources).toContain('IMD Punjab');
    });
  });

  describe('Soil Health Module', () => {
    test('should provide soil testing advice', async () => {
      const query = "Where can I get my soil tested in Amritsar?";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('soil_health');
      expect(response.content).toContain('soil');
      expect(response.content).toContain('Amritsar');
      expect(response.sources).toContain('KVK Amritsar');
    });
  });

  describe('Dairy Module', () => {
    test('should provide dairy cattle advice', async () => {
      const query = "Best feed for dairy cows in Punjab";
      const response = await assistant.processQuery(query, 'en', 'whatsapp');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('dairy');
      expect(response.content).toContain('dairy');
      expect(response.content).toContain('feed');
      expect(response.sources).toContain('GADVASU');
    });
  });

  describe('Multi-language Support', () => {
    test('should respond in Punjabi when requested', async () => {
      const query = "What is the best wheat variety?";
      const response = await assistant.processQuery(query, 'pa', 'sms');
      
      expect(response.isValid).toBe(true);
      expect(response.language).toBe('pa');
      expect(response.content).toMatch(/[\u0A00-\u0A7F]/); // Gurmukhi Unicode range
    });

    test('should provide Punjabi crop advice', async () => {
      const query = "ਕਣਕ ਦੀ ਬੀਜਾਈ ਕਦੋਂ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?";
      const response = await assistant.processQuery(query, 'pa', 'whatsapp');
      
      expect(response.isValid).toBe(true);
      expect(response.language).toBe('pa');
      expect(response.content).toContain('ਕਣਕ');
      expect(response.confidence).toBeGreaterThan(0.7);
    });
  });

  describe('Delivery Channel Formatting', () => {
    test('should format SMS responses correctly', async () => {
      const query = "Wheat sowing time in Punjab";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.channel).toBe('sms');
      expect(response.content.length).toBeLessThanOrEqual(160);
      expect(response.content).not.toContain('*');
      expect(response.content).not.toContain('_');
    });

    test('should format WhatsApp responses with emojis', async () => {
      const query = "Cotton pest management";
      const response = await assistant.processQuery(query, 'en', 'whatsapp');
      
      expect(response.channel).toBe('whatsapp');
      expect(response.content).toMatch(/[🌾🚨💡📞]/);
      expect(response.content).toContain('*');
    });

    test('should format push notifications correctly', async () => {
      const query = "Weather alert for farmers";
      const response = await assistant.processQuery(query, 'en', 'push');
      
      expect(response.channel).toBe('push');
      expect(response.content.length).toBeLessThanOrEqual(100);
      expect(response.content).toContain('🌦️');
    });

    test('should format voice notes with clear instructions', async () => {
      const query = "How to apply fertilizer to wheat?";
      const response = await assistant.processQuery(query, 'en', 'voice');
      
      expect(response.channel).toBe('voice');
      expect(response.content).toContain('[PAUSE]');
      expect(response.content).not.toContain('*');
      expect(response.content).not.toContain('_');
    });
  });

  describe('Confidence Scoring', () => {
    test('should have high confidence for specific crop queries', async () => {
      const query = "PBW 343 wheat variety sowing time";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.confidence).toBeGreaterThan(0.9);
      expect(response.isValid).toBe(true);
    });

    test('should have medium confidence for general queries', async () => {
      const query = "Best farming practices";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.confidence).toBeGreaterThan(0.5);
      expect(response.confidence).toBeLessThan(0.8);
    });

    test('should have low confidence for unclear queries', async () => {
      const query = "Something about farming maybe";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.confidence).toBeLessThan(0.5);
    });
  });

  describe('Source Citations', () => {
    test('should always include source citations', async () => {
      const query = "Wheat fertilizer schedule";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.sources).toBeDefined();
      expect(response.sources.length).toBeGreaterThan(0);
      expect(response.sources).toContain('PAU Guidelines');
    });

    test('should include multiple sources for comprehensive queries', async () => {
      const query = "Complete guide for wheat cultivation";
      const response = await assistant.processQuery(query, 'en', 'whatsapp');
      
      expect(response.sources.length).toBeGreaterThan(1);
      expect(response.sources).toContain('PAU Guidelines');
    });
  });

  describe('Knowledge Base Integration', () => {
    test('should retrieve relevant crop information', () => {
      const wheatInfo = punjabKnowledgeBase.searchCrops('wheat');
      expect(wheatInfo.length).toBeGreaterThan(0);
      expect(wheatInfo[0].name).toBe('wheat');
      expect(wheatInfo[0].varieties).toContain('PBW 343');
    });

    test('should retrieve government scheme information', () => {
      const schemes = punjabKnowledgeBase.searchSchemes('PM-KISAN');
      expect(schemes.length).toBeGreaterThan(0);
      expect(schemes[0].name).toBe('PM-KISAN');
      expect(schemes[0].benefits).toContain('₹6000');
    });

    test('should retrieve pest information', () => {
      const pests = punjabKnowledgeBase.searchPests('pink bollworm');
      expect(pests.length).toBeGreaterThan(0);
      expect(pests[0].name).toBe('pink bollworm');
      expect(pests[0].crops).toContain('cotton');
    });

    test('should retrieve market data', () => {
      const marketData = punjabKnowledgeBase.searchMarketData('wheat', 'Ludhiana');
      expect(marketData.length).toBeGreaterThan(0);
      expect(marketData[0].crop).toBe('wheat');
      expect(marketData[0].market).toBe('Ludhiana');
    });
  });

  describe('Error Handling', () => {
    test('should handle empty queries gracefully', async () => {
      const query = "";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(false);
      expect(response.content).toContain('please ask');
    });

    test('should handle very long queries', async () => {
      const query = "Tell me everything about wheat cultivation including varieties, sowing time, fertilizer application, pest management, disease control, harvesting, storage, marketing, and all other aspects".repeat(10);
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(true);
      expect(response.content.length).toBeLessThanOrEqual(160); // SMS limit
    });

    test('should handle unsupported language gracefully', async () => {
      const query = "Wheat cultivation advice";
      const response = await assistant.processQuery(query, 'hi' as any, 'sms');
      
      expect(response.language).toBe('en'); // Should fallback to English
      expect(response.isValid).toBe(true);
    });
  });
});

// Integration Tests
describe('Punjab AI Assistant Integration', () => {
  let assistant: PunjabAIAssistant;

  beforeEach(() => {
    assistant = new PunjabAIAssistant();
  });

  describe('Real-world Farmer Scenarios', () => {
    test('Farmer asking about crop rotation', async () => {
      const query = "After harvesting wheat, which crop should I grow in summer?";
      const response = await assistant.processQuery(query, 'en', 'whatsapp');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('crop_planning');
      expect(response.content).toMatch(/(maize|cotton|fodder)/i);
      expect(response.confidence).toBeGreaterThan(0.7);
    });

    test('Farmer reporting pest attack', async () => {
      const query = "White flies are attacking my cotton crop, urgent help needed";
      const response = await assistant.processQuery(query, 'en', 'push');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('pest_disease');
      expect(response.content).toContain('white');
      expect(response.content).toMatch(/spray|treatment|control/i);
    });

    test('Farmer asking about government subsidy', async () => {
      const query = "How to get subsidy for buying tractor in Punjab?";
      const response = await assistant.processQuery(query, 'en', 'whatsapp');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('govt_schemes');
      expect(response.content).toContain('subsidy');
      expect(response.content).toContain('tractor');
    });

    test('Farmer checking market prices before selling', async () => {
      const query = "Should I sell my wheat now or wait? Current rates in nearby mandis";
      const response = await assistant.processQuery(query, 'en', 'sms');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('mandi_rates');
      expect(response.content).toContain('wheat');
      expect(response.content).toMatch(/₹|rate|price/i);
    });

    test('Farmer seeking soil improvement advice', async () => {
      const query = "My crop yield is decreasing, how to improve soil health?";
      const response = await assistant.processQuery(query, 'en', 'whatsapp');
      
      expect(response.isValid).toBe(true);
      expect(response.module).toBe('soil_health');
      expect(response.content).toMatch(/soil|organic|fertilizer|test/i);
    });
  });
});