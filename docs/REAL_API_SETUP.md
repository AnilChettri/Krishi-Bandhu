# Real-Time API Setup for FarmGuard

## Required API Keys for Real-Time Data

### 1. Weather API (Essential for Real Weather Data)

**OpenWeatherMap (Recommended - Free Tier Available)**
- Visit: https://openweathermap.org/api
- Sign up for free account
- Go to API Keys section
- Copy your API key
- Free tier: 1000 calls/day, 60 calls/minute

**Alternative: WeatherAPI**
- Visit: https://www.weatherapi.com/
- Free tier: 1 million calls/month
- More generous limits

### 2. AI APIs (Optional - Local AI Available)

**OpenAI (For Enhanced AI Responses)**
- Visit: https://platform.openai.com/api-keys
- Create API key
- Pay-per-use model (~$0.002/1K tokens for GPT-3.5-turbo)

**Cohere (Alternative AI Provider)**
- Visit: https://dashboard.cohere.ai/api-keys
- Free tier: 100 API calls/month
- Good for basic text generation

### 3. Market Data (Currently Mock - Can Integrate Real APIs)

**Options for Real Market Data:**
- Agricultural Marketing Division APIs (Government of India)
- NCDEX API for commodity prices
- eNAM (National Agriculture Market) API

## Current Configuration

Your `.env.local` currently has:
```env
OPENAI_API_KEY=sk-proj-CzRoYp... (needs verification)
COHERE_API_KEY=MGt6yxFQ... (needs verification) 
WEATHER_API_KEY=your_weather_api_key_here (needs real key)
```

## Setup Instructions

1. **Get Weather API Key (Most Important)**
2. **Test Existing AI Keys**
3. **Update Environment Variables**
4. **Verify Real-Time Data**

Let's start with the most critical one - Weather API.