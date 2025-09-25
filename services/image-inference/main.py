"""
Image Inference Microservice for FarmGuard
YOLOv8-based pest detection and image classification
"""

import asyncio
import logging
import os
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Dict, List, Optional, Any
from io import BytesIO
import uuid

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from PIL import Image
import torch
import numpy as np
import cv2
from ultralytics import YOLO

# Custom imports
from core.config import settings
from core.cache import CacheManager
from core.storage import StorageManager
from models.pest_detector import PestDetector
from models.crop_classifier import CropClassifier
from utils.image_processing import preprocess_image, post_process_results
from utils.metrics import MetricsCollector

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global instances
cache_manager = CacheManager()
storage_manager = StorageManager()
pest_detector = PestDetector()
crop_classifier = CropClassifier()
metrics_collector = MetricsCollector()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting Image Inference Service...")
    
    try:
        # Initialize cache
        await cache_manager.initialize()
        logger.info("✅ Cache manager initialized")
        
        # Initialize storage
        await storage_manager.initialize()
        logger.info("✅ Storage manager initialized")
        
        # Load models
        await pest_detector.load_models()
        await crop_classifier.load_models()
        logger.info("✅ AI models loaded")
        
        # Initialize metrics collection
        metrics_collector.start()
        logger.info("✅ Metrics collector started")
        
        # Warm up models with dummy inference
        logger.info("🔥 Warming up models...")
        await warm_up_models()
        logger.info("✅ Models warmed up")
            
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {e}")
        
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Image Inference Service...")
    await cache_manager.close()
    await storage_manager.close()
    metrics_collector.stop()
    logger.info("✅ Cleanup completed")

# Create FastAPI app
app = FastAPI(
    title="FarmGuard Image Inference Service",
    description="""
    **AI-powered crop and pest analysis service**
    
    Provides image-based analysis for agricultural applications:
    - 🐛 Pest detection and identification
    - 🌱 Crop disease classification  
    - 📊 Severity assessment and recommendations
    - 🔍 Multi-object detection in farm images
    
    **Features:**
    - YOLOv8-based object detection
    - EfficientNet classification models
    - Real-time inference with caching
    - Asynchronous processing for large batches
    - Confidence scoring and uncertainty estimation
    """,
    version="1.0.0",
    contact={
        "name": "FarmGuard Team",
        "email": "chettrianil899@gmail.com"
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

# Pydantic models for request/response
from pydantic import BaseModel, Field

class ImageAnalysisRequest(BaseModel):
    analysis_type: str = Field(..., description="Type of analysis: pest_detection, crop_classification, or full_analysis")
    confidence_threshold: float = Field(0.5, ge=0.1, le=1.0, description="Minimum confidence threshold")
    language: str = Field("en", description="Response language")

class DetectionResult(BaseModel):
    class_name: str
    confidence: float
    bbox: List[float]  # [x1, y1, x2, y2]
    area: float
    severity: Optional[str] = None

class AnalysisResponse(BaseModel):
    job_id: str
    image_id: str
    analysis_type: str
    detections: List[DetectionResult]
    overall_confidence: float
    processing_time_ms: float
    recommendations: List[str]
    metadata: Dict[str, Any]

class JobStatus(BaseModel):
    job_id: str
    status: str  # pending, processing, completed, failed
    progress: float
    result: Optional[AnalysisResponse] = None
    error: Optional[str] = None

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Service health check with model status"""
    model_status = {
        "pest_detector": pest_detector.is_loaded(),
        "crop_classifier": crop_classifier.is_loaded()
    }
    
    return {
        "status": "healthy",
        "service": "FarmGuard Image Inference",
        "version": "1.0.0",
        "models": model_status,
        "gpu_available": torch.cuda.is_available(),
        "cache_status": await cache_manager.get_status(),
        "storage_status": await storage_manager.get_status()
    }

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with service information"""
    return {
        "message": "🌾 FarmGuard Image Inference Service",
        "description": "AI-powered crop and pest analysis",
        "endpoints": {
            "analyze_image": "/analyze",
            "batch_analyze": "/batch",
            "job_status": "/jobs/{job_id}",
            "health": "/health",
            "metrics": "/metrics",
            "docs": "/docs"
        },
        "supported_formats": ["JPEG", "PNG", "TIFF", "BMP"],
        "max_file_size": f"{settings.MAX_FILE_SIZE_MB}MB",
        "models": {
            "pest_detection": "YOLOv8n-pest",
            "crop_classification": "EfficientNet-B0"
        }
    }

# Single image analysis endpoint
@app.post("/analyze", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_image(
    file: UploadFile = File(...),
    analysis_type: str = "full_analysis",
    confidence_threshold: float = 0.5,
    language: str = "en",
    background_tasks: BackgroundTasks = None
):
    """
    Analyze a single image for pests and diseases
    
    **Parameters:**
    - **file**: Image file (JPEG, PNG, TIFF, BMP)
    - **analysis_type**: Type of analysis (pest_detection, crop_classification, full_analysis)
    - **confidence_threshold**: Minimum confidence for detections (0.1-1.0)
    - **language**: Response language code (en, hi, kn, pa, ta)
    
    **Returns:**
    - Analysis results with detections, confidence scores, and recommendations
    """
    start_time = time.time()
    job_id = str(uuid.uuid4())
    
    try:
        # Validate file
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(
                status_code=413, 
                detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE_MB}MB"
            )
        
        # Convert to PIL Image
        image = Image.open(BytesIO(content))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Store image for processing
        image_id = await storage_manager.store_image(content, file.filename, job_id)
        
        # Preprocess image
        processed_image = preprocess_image(image)
        
        # Perform analysis based on type
        detections = []
        overall_confidence = 0.0
        
        if analysis_type in ["pest_detection", "full_analysis"]:
            pest_results = await pest_detector.detect(processed_image, confidence_threshold)
            detections.extend(pest_results)
        
        if analysis_type in ["crop_classification", "full_analysis"]:
            crop_results = await crop_classifier.classify(processed_image, confidence_threshold)
            detections.extend(crop_results)
        
        # Calculate overall confidence
        if detections:
            overall_confidence = sum(d.confidence for d in detections) / len(detections)
        
        # Generate recommendations
        recommendations = generate_recommendations(detections, language)
        
        # Post-process results
        processed_results = post_process_results(detections, image.size)
        
        processing_time = (time.time() - start_time) * 1000
        
        # Create response
        response = AnalysisResponse(
            job_id=job_id,
            image_id=image_id,
            analysis_type=analysis_type,
            detections=processed_results,
            overall_confidence=overall_confidence,
            processing_time_ms=processing_time,
            recommendations=recommendations,
            metadata={
                "image_size": image.size,
                "file_size_bytes": file_size,
                "model_versions": {
                    "pest_detector": pest_detector.version,
                    "crop_classifier": crop_classifier.version
                },
                "processed_at": time.time()
            }
        )
        
        # Cache result for future retrieval
        await cache_manager.store_result(job_id, response.dict())
        
        # Record metrics
        metrics_collector.record_inference(
            analysis_type=analysis_type,
            processing_time_ms=processing_time,
            num_detections=len(detections),
            confidence=overall_confidence
        )
        
        # Queue low-confidence results for human review if enabled
        if overall_confidence < settings.HUMAN_REVIEW_THRESHOLD:
            background_tasks.add_task(
                queue_for_human_review,
                job_id,
                image_id,
                response.dict(),
                overall_confidence
            )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Image analysis failed for job {job_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Batch processing endpoint
@app.post("/batch", tags=["Analysis"])
async def batch_analyze(
    files: List[UploadFile] = File(...),
    analysis_type: str = "full_analysis",
    confidence_threshold: float = 0.5,
    language: str = "en"
):
    """
    Analyze multiple images in batch
    
    Returns job IDs for tracking progress
    """
    if len(files) > settings.MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Batch size too large. Maximum: {settings.MAX_BATCH_SIZE}"
        )
    
    job_ids = []
    for file in files:
        # Create job for each file
        job_id = str(uuid.uuid4())
        job_ids.append(job_id)
        
        # Queue for background processing
        asyncio.create_task(
            process_image_background(
                file, job_id, analysis_type, confidence_threshold, language
            )
        )
    
    return {
        "message": f"Queued {len(files)} images for analysis",
        "job_ids": job_ids,
        "estimated_completion": f"{len(files) * 2} seconds"
    }

# Job status endpoint
@app.get("/jobs/{job_id}", response_model=JobStatus, tags=["Jobs"])
async def get_job_status(job_id: str):
    """Get the status of a processing job"""
    status = await cache_manager.get_job_status(job_id)
    if not status:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return JobStatus(**status)

# Metrics endpoint
@app.get("/metrics", tags=["Monitoring"])
async def get_metrics():
    """Get service metrics for monitoring"""
    return metrics_collector.get_metrics()

# Helper functions
async def warm_up_models():
    """Warm up models with dummy data"""
    dummy_image = np.zeros((224, 224, 3), dtype=np.uint8)
    dummy_pil = Image.fromarray(dummy_image)
    
    try:
        await pest_detector.detect(dummy_pil, 0.5)
        await crop_classifier.classify(dummy_pil, 0.5)
    except Exception as e:
        logger.warning(f"Model warm-up warning: {e}")

def generate_recommendations(detections: List[DetectionResult], language: str) -> List[str]:
    """Generate farming recommendations based on detections"""
    recommendations = []
    
    # This is a simplified version - in production, you'd have more sophisticated logic
    pest_count = sum(1 for d in detections if "pest" in d.class_name.lower())
    disease_count = sum(1 for d in detections if "disease" in d.class_name.lower())
    
    if pest_count > 0:
        recommendations.append(
            "Consider integrated pest management strategies" if language == "en"
            else "एकीकृत कीट प्रबंधन रणनीतियों पर विचार करें"
        )
    
    if disease_count > 0:
        recommendations.append(
            "Monitor crop health and consider disease-resistant varieties" if language == "en"
            else "फसल की सेहत की निगरानी करें और रोग प्रतिरोधी किस्मों पर विचार करें"
        )
    
    if not detections:
        recommendations.append(
            "Crops appear healthy. Continue regular monitoring" if language == "en"
            else "फसलें स्वस्थ दिख रही हैं। नियमित निगरानी जारी रखें"
        )
    
    return recommendations

async def queue_for_human_review(job_id: str, image_id: str, result: dict, confidence: float):
    """Queue low-confidence results for human review"""
    review_item = {
        "job_id": job_id,
        "image_id": image_id,
        "result": result,
        "confidence": confidence,
        "queued_at": time.time(),
        "priority": "high" if confidence < 0.3 else "medium"
    }
    
    await cache_manager.add_to_review_queue(review_item)

async def process_image_background(
    file: UploadFile, 
    job_id: str, 
    analysis_type: str, 
    confidence_threshold: float, 
    language: str
):
    """Background task for processing images"""
    try:
        # Update job status
        await cache_manager.update_job_status(job_id, "processing", 0.1)
        
        # Process image (similar to analyze_image logic)
        content = await file.read()
        image = Image.open(BytesIO(content))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Store and process
        image_id = await storage_manager.store_image(content, file.filename, job_id)
        processed_image = preprocess_image(image)
        
        await cache_manager.update_job_status(job_id, "processing", 0.5)
        
        # Perform analysis
        detections = []
        if analysis_type in ["pest_detection", "full_analysis"]:
            pest_results = await pest_detector.detect(processed_image, confidence_threshold)
            detections.extend(pest_results)
        
        await cache_manager.update_job_status(job_id, "processing", 0.8)
        
        if analysis_type in ["crop_classification", "full_analysis"]:
            crop_results = await crop_classifier.classify(processed_image, confidence_threshold)
            detections.extend(crop_results)
        
        # Complete processing
        overall_confidence = sum(d.confidence for d in detections) / len(detections) if detections else 0
        recommendations = generate_recommendations(detections, language)
        
        result = {
            "job_id": job_id,
            "image_id": image_id,
            "detections": [d.dict() for d in detections],
            "overall_confidence": overall_confidence,
            "recommendations": recommendations,
            "completed_at": time.time()
        }
        
        await cache_manager.update_job_status(job_id, "completed", 1.0, result)
        
    except Exception as e:
        logger.error(f"Background processing failed for job {job_id}: {e}")
        await cache_manager.update_job_status(job_id, "failed", 0, None, str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    )