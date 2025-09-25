"""
AI Chat API for FARMGUARD

Handles AI chat requests using local LLMs with agricultural expertise.
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import asyncio
import json
import logging

from app.models.llm_service import LLMService, LLMResponse
from app.core.cache import CacheManager
from app.utils.farming_knowledge import FarmingKnowledgeBase

logger = logging.getLogger(__name__)

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str
    language: str = "en"
    model: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    stream: bool = False

class ChatResponse(BaseModel):
    success: bool
    content: str
    language: str
    model: str
    response_time: float
    tokens_used: int
    confidence: float
    source: str = "local_ai"
    cached: bool = False

# Global service instances (injected via dependencies)
llm_service: Optional[LLMService] = None
cache_manager: Optional[CacheManager] = None
knowledge_base: Optional[FarmingKnowledgeBase] = None

async def get_llm_service():
    """Dependency to get LLM service"""
    global llm_service
    if not llm_service:
        from app.main import llm_service as main_llm_service
        llm_service = main_llm_service
    return llm_service

async def get_cache_manager():
    """Dependency to get cache manager"""
    global cache_manager
    if not cache_manager:
        from app.main import cache_manager as main_cache_manager
        cache_manager = main_cache_manager
    return cache_manager

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    background_tasks: BackgroundTasks,
    llm: LLMService = Depends(get_llm_service),
    cache: CacheManager = Depends(get_cache_manager)
):
    """
    Chat with AI assistant for farming advice
    
    - **prompt**: The user's question or message
    - **language**: Language code (en, hi, kn, pa, ta)  
    - **model**: Optional specific model to use
    - **context**: Optional context (location, crop, season, etc.)
    - **stream**: Whether to stream the response
    """
    
    try:
        # Validate language
        supported_languages = ["en", "hi", "kn", "pa", "ta"]
        if request.language not in supported_languages:
            request.language = "en"
        
        # Check cache for similar questions
        cache_key = f"chat:{hash(request.prompt)}:{request.language}"
        cached_response = await cache.get(cache_key)
        
        if cached_response:
            logger.info(f"Cache hit for prompt: {request.prompt[:50]}...")
            return ChatResponse(
                success=True,
                content=cached_response["content"],
                language=cached_response["language"],
                model=cached_response["model"],
                response_time=cached_response["response_time"],
                tokens_used=cached_response["tokens_used"],
                confidence=cached_response["confidence"],
                source="cache",
                cached=True
            )
        
        # Generate AI response
        logger.info(f"Generating AI response for: {request.prompt[:50]}... (lang: {request.language})")
        
        llm_response: LLMResponse = await llm.generate_response(
            prompt=request.prompt,
            language=request.language,
            model=request.model,
            context=request.context
        )
        
        # Prepare response
        response = ChatResponse(
            success=True,
            content=llm_response.content,
            language=llm_response.language,
            model=llm_response.model,
            response_time=llm_response.response_time,
            tokens_used=llm_response.tokens_used,
            confidence=llm_response.confidence,
            source="local_ai",
            cached=False
        )
        
        # Cache the response for future use
        background_tasks.add_task(
            cache.set,
            cache_key,
            {
                "content": llm_response.content,
                "language": llm_response.language,
                "model": llm_response.model,
                "response_time": llm_response.response_time,
                "tokens_used": llm_response.tokens_used,
                "confidence": llm_response.confidence
            },
            ttl=3600  # 1 hour
        )
        
        logger.info(f"AI response generated in {llm_response.response_time:.2f}s using {llm_response.model}")
        return response
        
    except Exception as e:
        logger.error(f"Chat API error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Failed to generate AI response",
                "message": str(e),
                "fallback_available": True
            }
        )

@router.post("/stream")
async def stream_chat(
    request: ChatRequest,
    llm: LLMService = Depends(get_llm_service)
):
    """
    Stream AI response for real-time chat experience
    """
    
    try:
        # Validate inputs
        if not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt is required")
            
        if request.language not in ["en", "hi", "kn", "pa", "ta"]:
            request.language = "en"
        
        async def generate_stream():
            """Generate streaming response"""
            try:
                async for chunk in llm.stream_response(
                    prompt=request.prompt,
                    language=request.language,
                    model=request.model,
                    context=request.context
                ):
                    # Format as Server-Sent Events
                    yield f"data: {json.dumps({'content': chunk, 'done': False})}\\n\\n"
                
                # Send completion marker
                yield f"data: {json.dumps({'content': '', 'done': True})}\\n\\n"
                
            except Exception as e:
                logger.error(f"Streaming error: {e}")
                yield f"data: {json.dumps({'error': str(e), 'done': True})}\\n\\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*"
            }
        )
        
    except Exception as e:
        logger.error(f"Stream setup error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models")
async def get_available_models(llm: LLMService = Depends(get_llm_service)):
    """Get list of available AI models"""
    
    try:
        models = await llm.get_loaded_models()
        return {
            "success": True,
            "models": models,
            "primary_model": llm.primary_model,
            "fallback_model": llm.fallback_model,
            "total_count": len(models)
        }
    except Exception as e:
        logger.error(f"Models API error: {e}")
        return {
            "success": False,
            "models": [],
            "error": str(e)
        }

@router.get("/model/{model_name}")
async def get_model_info(
    model_name: str,
    llm: LLMService = Depends(get_llm_service)
):
    """Get detailed information about a specific model"""
    
    try:
        model_info = await llm.get_model_info(model_name)
        if model_info:
            return {
                "success": True,
                "model": model_name,
                "info": model_info
            }
        else:
            raise HTTPException(
                status_code=404,
                detail=f"Model '{model_name}' not found"
            )
    except Exception as e:
        logger.error(f"Model info error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/model/pull")
async def pull_model(
    model_name: str,
    background_tasks: BackgroundTasks,
    llm: LLMService = Depends(get_llm_service)
):
    """Download/pull a new AI model"""
    
    try:
        # Start model download in background
        background_tasks.add_task(llm.pull_model, model_name)
        
        return {
            "success": True,
            "message": f"Started downloading model: {model_name}",
            "model": model_name,
            "status": "downloading"
        }
    except Exception as e:
        logger.error(f"Model pull error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check(llm: LLMService = Depends(get_llm_service)):
    """Health check for AI chat service"""
    
    try:
        models = await llm.get_loaded_models()
        ollama_healthy = await llm._check_ollama_health()
        
        return {
            "status": "healthy" if ollama_healthy else "degraded",
            "ollama_available": ollama_healthy,
            "models_loaded": len(models),
            "models": models,
            "features": {
                "chat": True,
                "streaming": True,
                "multi_language": True,
                "caching": True
            }
        }
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }

@router.get("/stats")
async def get_chat_stats(cache: CacheManager = Depends(get_cache_manager)):
    """Get chat usage statistics"""
    
    try:
        cache_stats = await cache.get_stats()
        
        return {
            "success": True,
            "cache_stats": cache_stats,
            "supported_languages": ["en", "hi", "kn", "pa", "ta"],
            "features": {
                "local_models": True,
                "offline_capable": True,
                "zero_cost": True,
                "multi_language": True
            }
        }
    except Exception as e:
        logger.error(f"Stats error: {e}")
        return {
            "success": False,
            "error": str(e)
        }