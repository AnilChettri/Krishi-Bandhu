"""
FARMGUARD AI Backend - FastAPI Main Application

Zero-cost AI backend using local models for agricultural assistance.
Provides AI chat, weather analysis, crop recommendations, and market insights.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from contextlib import asynccontextmanager

# Import our API routes
from app.api import ai_chat, weather, market, crops, soil_analysis
from app.core.config import settings
from app.core.cache import CacheManager
from app.models.llm_service import LLMService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global instances
cache_manager = CacheManager()
llm_service = LLMService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting FARMGUARD AI Backend...")
    
    try:
        # Initialize cache
        await cache_manager.initialize()
        logger.info("✅ Cache manager initialized")
        
        # Initialize LLM service
        await llm_service.initialize()
        logger.info("✅ LLM service initialized")
        
        # Pre-warm models (optional)
        if settings.PRELOAD_MODELS:
            logger.info("🔥 Pre-warming AI models...")
            await llm_service.preload_models()
            logger.info("✅ Models pre-warmed")
            
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {e}")
        
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down FARMGUARD AI Backend...")
    await cache_manager.close()
    await llm_service.close()
    logger.info("✅ Cleanup completed")

# Create FastAPI app
app = FastAPI(
    title="FARMGUARD AI Backend",
    description="""
    **Zero-Cost AI Backend for Agricultural Intelligence**
    
    Provides AI-powered farming assistance using local models:
    - 🤖 AI Assistant with agricultural expertise
    - 🌤️ Weather analysis and farming recommendations  
    - 📈 Market analysis and price predictions
    - 🌱 Crop recommendations and planning
    - 🗣️ Multi-language support (5 Indian languages)
    
    **Features:**
    - Completely offline capable
    - Zero API costs
    - Fast local inference
    - Agricultural knowledge base
    - Multi-language support
    """,
    version="1.0.0",
    contact={
        "name": "FARMGUARD Team",
        "email": "chettrianil899@gmail.com",
        "url": "https://github.com/AnilChettri/Farmguard-d7"
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    },
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """System health check"""
    return {
        "status": "healthy",
        "service": "FARMGUARD AI Backend",
        "version": "1.0.0",
        "models_loaded": await llm_service.get_loaded_models(),
        "cache_status": await cache_manager.get_status()
    }

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with service information"""
    return {
        "message": "🌾 FARMGUARD AI Backend",
        "description": "Zero-cost AI backend for agricultural intelligence",
        "features": [
            "Local AI models",
            "Offline capability", 
            "Agricultural expertise",
            "Multi-language support",
            "Zero API costs"
        ],
        "endpoints": {
            "ai_chat": "/ai/chat",
            "weather": "/weather/analysis",
            "market": "/market/analysis", 
            "crops": "/crops/recommendations",
            "soil": "/soil/analyze",
            "health": "/health",
            "docs": "/docs"
        }
    }

# Include API routes
app.include_router(ai_chat.router, prefix="/ai", tags=["AI Assistant"])
app.include_router(weather.router, prefix="/weather", tags=["Weather"])
app.include_router(market.router, prefix="/market", tags=["Market"])
app.include_router(crops.router, prefix="/crops", tags=["Crops"])
app.include_router(soil_analysis.router, prefix="/soil", tags=["Soil Analysis"])

# Import and include weather service
try:
    from app.api.weather_service import router as weather_service_router
    app.include_router(weather_service_router, prefix="/api", tags=["Weather Service"])
except ImportError:
    logger.warning("Weather service not available")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again.",
            "fallback_available": True
        }
    )

# Custom middleware for request logging
@app.middleware("http")
async def log_requests(request, call_next):
    """Log all requests"""
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    
    return response

# Dependency to get services
async def get_llm_service():
    """Dependency to get LLM service"""
    return llm_service

async def get_cache_manager():
    """Dependency to get cache manager"""
    return cache_manager

if __name__ == "__main__":
    import time
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    )