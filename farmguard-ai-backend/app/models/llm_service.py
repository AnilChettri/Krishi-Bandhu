"""
LLM Service for FARMGUARD AI Backend

Manages local AI models using Ollama for zero-cost inference.
Provides agricultural expertise through local LLMs.
"""

import asyncio
import aiohttp
import json
import logging
from typing import Dict, List, Optional, AsyncGenerator
from dataclasses import dataclass

from app.core.config import settings, MODEL_CONFIG, LANGUAGE_PROMPTS
from app.utils.farming_knowledge import FarmingKnowledgeBase

logger = logging.getLogger(__name__)

@dataclass
class LLMResponse:
    """LLM response data structure"""
    content: str
    model: str
    language: str
    tokens_used: int
    response_time: float
    confidence: float = 0.8

class LLMService:
    """Local LLM service using Ollama"""
    
    def __init__(self):
        self.ollama_host = settings.OLLAMA_HOST
        self.primary_model = settings.OLLAMA_MODEL
        self.fallback_model = settings.FALLBACK_MODEL
        self.session: Optional[aiohttp.ClientSession] = None
        self.loaded_models: List[str] = []
        self.knowledge_base = FarmingKnowledgeBase()
        
    async def initialize(self):
        """Initialize the LLM service"""
        logger.info("🤖 Initializing LLM service...")
        
        # Create HTTP session
        self.session = aiohttp.ClientSession()
        
        # Initialize knowledge base
        await self.knowledge_base.initialize()
        
        # Check Ollama availability
        if await self._check_ollama_health():
            logger.info("✅ Ollama server is available")
            await self._discover_models()
        else:
            logger.warning("⚠️ Ollama server not available, will use fallback responses")
            
        logger.info(f"✅ LLM service initialized with models: {self.loaded_models}")
    
    async def close(self):
        """Clean up resources"""
        if self.session:
            await self.session.close()
    
    async def _check_ollama_health(self) -> bool:
        """Check if Ollama server is running"""
        try:
            if not self.session:
                return False
                
            async with self.session.get(f"{self.ollama_host}/api/tags", timeout=5) as response:
                return response.status == 200
        except Exception as e:
            logger.error(f"❌ Ollama health check failed: {e}")
            return False
    
    async def _discover_models(self):
        """Discover available models"""
        try:
            async with self.session.get(f"{self.ollama_host}/api/tags") as response:
                if response.status == 200:
                    data = await response.json()
                    self.loaded_models = [model['name'] for model in data.get('models', [])]
                    logger.info(f"📋 Available models: {self.loaded_models}")
        except Exception as e:
            logger.error(f"❌ Failed to discover models: {e}")
    
    async def preload_models(self):
        """Pre-load models for faster inference"""
        models_to_load = [self.primary_model, self.fallback_model]
        
        for model in models_to_load:
            try:
                await self._ensure_model_loaded(model)
                logger.info(f"✅ Pre-loaded model: {model}")
            except Exception as e:
                logger.error(f"❌ Failed to pre-load model {model}: {e}")
    
    async def _ensure_model_loaded(self, model_name: str) -> bool:
        """Ensure a model is loaded and ready"""
        try:
            # Try a small test request to warm up the model
            test_payload = {
                "model": model_name,
                "prompt": "Hello",
                "stream": False,
                "options": {"num_predict": 1}
            }
            
            async with self.session.post(
                f"{self.ollama_host}/api/generate",
                json=test_payload,
                timeout=30
            ) as response:
                return response.status == 200
                
        except Exception as e:
            logger.error(f"❌ Model loading check failed for {model_name}: {e}")
            return False
    
    async def generate_response(
        self, 
        prompt: str, 
        language: str = "en",
        model: Optional[str] = None,
        context: Optional[Dict] = None
    ) -> LLMResponse:
        """Generate AI response for farming queries"""
        
        start_time = asyncio.get_event_loop().time()
        model_to_use = model or self.primary_model
        
        try:
            # Check if we can use Ollama
            if not await self._check_ollama_health():
                return await self._generate_fallback_response(prompt, language, start_time)
            
            # Enhance prompt with agricultural context
            enhanced_prompt = await self._enhance_prompt_with_context(prompt, language, context)
            
            # Generate response using Ollama
            response = await self._call_ollama(enhanced_prompt, model_to_use, language)
            
            response_time = asyncio.get_event_loop().time() - start_time
            
            return LLMResponse(
                content=response["response"],
                model=model_to_use,
                language=language,
                tokens_used=response.get("eval_count", 0),
                response_time=response_time,
                confidence=0.9
            )
            
        except Exception as e:
            logger.error(f"❌ LLM generation failed: {e}")
            return await self._generate_fallback_response(prompt, language, start_time)
    
    async def _call_ollama(self, prompt: str, model: str, language: str) -> Dict:
        """Call Ollama API"""
        
        # Get model configuration
        model_config = MODEL_CONFIG.get(model.split(':')[0], MODEL_CONFIG["llama2"])
        
        # Build system prompt
        system_prompt = model_config["system_prompt"]
        language_prompt = LANGUAGE_PROMPTS.get(language, LANGUAGE_PROMPTS["en"])
        
        full_prompt = f"{system_prompt}\n{language_prompt}\n\nUser: {prompt}\nAssistant:"
        
        payload = {
            "model": model,
            "prompt": full_prompt,
            "stream": False,
            "options": {
                "temperature": model_config["temperature"],
                "num_predict": model_config["max_tokens"],
                "num_ctx": model_config["context_length"],
                "top_p": 0.9,
                "repeat_penalty": 1.1
            }
        }
        
        async with self.session.post(
            f"{self.ollama_host}/api/generate",
            json=payload,
            timeout=settings.REQUEST_TIMEOUT
        ) as response:
            
            if response.status != 200:
                raise Exception(f"Ollama API error: {response.status}")
                
            return await response.json()
    
    async def _enhance_prompt_with_context(
        self, 
        prompt: str, 
        language: str, 
        context: Optional[Dict]
    ) -> str:
        """Enhance prompt with agricultural knowledge"""
        
        # Get relevant knowledge from knowledge base
        relevant_knowledge = await self.knowledge_base.search_knowledge(prompt, language)
        
        enhanced_prompt = prompt
        
        if relevant_knowledge:
            context_info = "\n".join([
                f"- {item}" for item in relevant_knowledge[:3]  # Top 3 relevant items
            ])
            
            enhanced_prompt = f"""Context (agricultural knowledge):
{context_info}

User question: {prompt}

Please provide practical, actionable advice based on the context and your agricultural knowledge."""
        
        # Add location/seasonal context if provided
        if context:
            if context.get("location"):
                enhanced_prompt += f"\n\nLocation: {context['location']}"
            if context.get("season"):
                enhanced_prompt += f"\nSeason: {context['season']}"
            if context.get("crop"):
                enhanced_prompt += f"\nCrop: {context['crop']}"
                
        return enhanced_prompt
    
    async def _generate_fallback_response(
        self, 
        prompt: str, 
        language: str, 
        start_time: float
    ) -> LLMResponse:
        """Generate fallback response when Ollama is unavailable"""
        
        # Use knowledge base for fallback responses
        fallback_response = await self.knowledge_base.get_fallback_response(prompt, language)
        
        response_time = asyncio.get_event_loop().time() - start_time
        
        return LLMResponse(
            content=fallback_response,
            model="fallback",
            language=language,
            tokens_used=0,
            response_time=response_time,
            confidence=0.6
        )
    
    async def stream_response(
        self, 
        prompt: str, 
        language: str = "en",
        model: Optional[str] = None,
        context: Optional[Dict] = None
    ) -> AsyncGenerator[str, None]:
        """Stream AI response for real-time chat"""
        
        model_to_use = model or self.primary_model
        
        try:
            if not await self._check_ollama_health():
                yield await self._generate_fallback_response(prompt, language, 0)
                return
                
            enhanced_prompt = await self._enhance_prompt_with_context(prompt, language, context)
            
            # Get model configuration
            model_config = MODEL_CONFIG.get(model_to_use.split(':')[0], MODEL_CONFIG["llama2"])
            
            # Build system prompt
            system_prompt = model_config["system_prompt"]
            language_prompt = LANGUAGE_PROMPTS.get(language, LANGUAGE_PROMPTS["en"])
            
            full_prompt = f"{system_prompt}\n{language_prompt}\n\nUser: {prompt}\nAssistant:"
            
            payload = {
                "model": model_to_use,
                "prompt": full_prompt,
                "stream": True,
                "options": {
                    "temperature": model_config["temperature"],
                    "num_predict": model_config["max_tokens"],
                    "num_ctx": model_config["context_length"],
                    "top_p": 0.9,
                    "repeat_penalty": 1.1
                }
            }
            
            async with self.session.post(
                f"{self.ollama_host}/api/generate",
                json=payload
            ) as response:
                
                async for line in response.content:
                    if line:
                        try:
                            data = json.loads(line.decode('utf-8'))
                            if 'response' in data:
                                yield data['response']
                        except json.JSONDecodeError:
                            continue
                            
        except Exception as e:
            logger.error(f"❌ Streaming failed: {e}")
            fallback = await self._generate_fallback_response(prompt, language, 0)
            yield fallback.content
    
    async def get_loaded_models(self) -> List[str]:
        """Get list of loaded models"""
        return self.loaded_models
    
    async def get_model_info(self, model_name: str) -> Optional[Dict]:
        """Get information about a specific model"""
        try:
            async with self.session.post(
                f"{self.ollama_host}/api/show",
                json={"name": model_name}
            ) as response:
                if response.status == 200:
                    return await response.json()
        except Exception as e:
            logger.error(f"❌ Failed to get model info for {model_name}: {e}")
        
        return None
    
    async def pull_model(self, model_name: str) -> bool:
        """Pull/download a model"""
        try:
            logger.info(f"📥 Pulling model: {model_name}")
            
            async with self.session.post(
                f"{self.ollama_host}/api/pull",
                json={"name": model_name}
            ) as response:
                
                if response.status == 200:
                    # Update loaded models list
                    await self._discover_models()
                    logger.info(f"✅ Successfully pulled model: {model_name}")
                    return True
                    
        except Exception as e:
            logger.error(f"❌ Failed to pull model {model_name}: {e}")
        
        return False