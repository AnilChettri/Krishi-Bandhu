"""
Configuration settings for FARMGUARD AI Backend
"""

import os
from typing import List, Optional
from pydantic import BaseSettings

class Settings(BaseSettings):
    """Application settings"""
    
    # Application settings
    APP_NAME: str = "FARMGUARD AI Backend"
    VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "https://farmguard.vercel.app",
        "*" if DEBUG else ""
    ]
    
    # AI Model settings
    OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama2:7b")
    FALLBACK_MODEL: str = os.getenv("FALLBACK_MODEL", "phi3:mini")
    
    # Hugging Face settings
    HF_MODEL_CACHE_DIR: str = os.getenv("HF_CACHE_DIR", "./models/huggingface")
    HF_TRANSLATION_MODEL: str = "Helsinki-NLP/opus-mt-en-mul"
    HF_SENTIMENT_MODEL: str = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    
    # Whisper settings
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "base")
    WHISPER_CACHE_DIR: str = "./models/whisper"
    
    # TTS settings
    TTS_MODEL: str = os.getenv("TTS_MODEL", "tts_models/en/ljspeech/tacotron2-DDC")
    TTS_CACHE_DIR: str = "./models/tts"
    
    # Performance settings
    PRELOAD_MODELS: bool = os.getenv("PRELOAD_MODELS", "false").lower() == "true"
    MAX_CONCURRENT_REQUESTS: int = int(os.getenv("MAX_CONCURRENT_REQUESTS", "10"))
    REQUEST_TIMEOUT: int = int(os.getenv("REQUEST_TIMEOUT", "30"))
    
    # Cache settings
    CACHE_TYPE: str = os.getenv("CACHE_TYPE", "memory")  # memory, redis, file
    CACHE_TTL: int = int(os.getenv("CACHE_TTL", "3600"))  # 1 hour
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL")
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data/farmguard.db")
    
    # Weather API settings  
    WEATHER_API_KEY: Optional[str] = os.getenv("WEATHER_API_KEY")
    WEATHER_API_URL: str = "https://api.openweathermap.org/data/2.5"
    WEATHER_CACHE_TTL: int = int(os.getenv("WEATHER_CACHE_TTL", "1800"))  # 30 minutes
    
    # Logging settings
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Feature flags
    ENABLE_SPEECH_TO_TEXT: bool = os.getenv("ENABLE_SPEECH_TO_TEXT", "true").lower() == "true"
    ENABLE_TEXT_TO_SPEECH: bool = os.getenv("ENABLE_TEXT_TO_SPEECH", "true").lower() == "true"
    ENABLE_TRANSLATION: bool = os.getenv("ENABLE_TRANSLATION", "true").lower() == "true"
    ENABLE_CROP_DETECTION: bool = os.getenv("ENABLE_CROP_DETECTION", "true").lower() == "true"
    
    # Model paths
    MODELS_DIR: str = os.getenv("MODELS_DIR", "./models")
    DATA_DIR: str = os.getenv("DATA_DIR", "./data")
    KNOWLEDGE_BASE_PATH: str = os.path.join(DATA_DIR, "agricultural_knowledge.json")
    CROP_PRICES_PATH: str = os.path.join(DATA_DIR, "crop_prices.json")
    
    # Agricultural knowledge settings
    SUPPORTED_LANGUAGES: List[str] = ["en", "hi", "kn", "pa", "ta"]
    DEFAULT_LANGUAGE: str = "en"
    SUPPORTED_CROPS: List[str] = [
        "rice", "wheat", "maize", "sugarcane", "cotton", "soybean",
        "onion", "potato", "tomato", "cabbage", "cauliflower"
    ]
    
    # API rate limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    RATE_LIMIT_BURST: int = int(os.getenv("RATE_LIMIT_BURST", "10"))
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings instance
settings = Settings()

# Model configuration
MODEL_CONFIG = {
    "llama2": {
        "model_id": "llama2:7b",
        "context_length": 4096,
        "temperature": 0.7,
        "max_tokens": 1000,
        "system_prompt": """You are an expert agricultural assistant for Indian farmers. 
        Provide practical, actionable advice about farming, crops, weather, and market conditions. 
        Keep responses concise and farmer-friendly. Focus on Indian agricultural practices and crops."""
    },
    "mistral": {
        "model_id": "mistral:7b",
        "context_length": 8192,
        "temperature": 0.6,
        "max_tokens": 1000,
        "system_prompt": """You are FARMGUARD, an AI assistant specializing in Indian agriculture. 
        Help farmers with crop management, pest control, market advice, and farming techniques. 
        Be practical and consider Indian farming conditions."""
    },
    "phi3": {
        "model_id": "phi3:mini",
        "context_length": 2048,
        "temperature": 0.5,
        "max_tokens": 500,
        "system_prompt": """Farming assistant for Indian agriculture. 
        Give brief, practical farming advice."""
    }
}

# Language-specific prompts
LANGUAGE_PROMPTS = {
    "en": "Respond in English with practical farming advice for Indian conditions.",
    "hi": "भारतीय किसानों के लिए हिंदी में व्यावहारिक कृषि सलाह दें।",
    "kn": "ಭಾರತೀಯ ರೈತರಿಗೆ ಕನ್ನಡದಲ್ಲಿ ವ್ಯಾವಹಾರಿಕ ಕೃಷಿ ಸಲಹೆ ನೀಡಿ।",
    "pa": "ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਲਈ ਪੰਜਾਬੀ ਵਿੱਚ ਵਿਹਾਰਕ ਖੇਤੀ ਸਲਾਹ ਦਿਓ।",
    "ta": "இந்திய விவசாயிகளுக்கு தமிழில் நடைமுறை விவசாய ஆலோசனை வழங்கவும்।"
}

# Farming knowledge categories
KNOWLEDGE_CATEGORIES = {
    "crops": [
        "varieties", "planting", "harvesting", "diseases", "pests", 
        "fertilizers", "irrigation", "storage", "market_timing"
    ],
    "weather": [
        "planting_conditions", "harvest_timing", "pest_weather_correlation",
        "irrigation_scheduling", "crop_protection"
    ],
    "market": [
        "price_trends", "demand_patterns", "seasonal_variations",
        "storage_economics", "market_access"
    ],
    "practices": [
        "soil_management", "organic_farming", "pest_management",
        "water_conservation", "crop_rotation"
    ]
}