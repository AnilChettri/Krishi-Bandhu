"""
Soil Health Analysis API for FARMGUARD

Provides soil analysis, recommendations, and fertilizer calculations
for Indian farming conditions.
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import logging
import json
from enum import Enum

logger = logging.getLogger(__name__)

router = APIRouter()

class SoilType(str, Enum):
    CLAY = "clay"
    LOAMY = "loamy"
    SANDY = "sandy"
    SILT = "silt"
    RED = "red"
    BLACK = "black"
    ALLUVIAL = "alluvial"

class CropType(str, Enum):
    RICE = "rice"
    WHEAT = "wheat"
    MAIZE = "maize"
    SUGARCANE = "sugarcane"
    COTTON = "cotton"
    SOYBEAN = "soybean"
    ONION = "onion"
    POTATO = "potato"
    TOMATO = "tomato"
    CABBAGE = "cabbage"

class SoilData(BaseModel):
    ph: float = Field(..., ge=3.0, le=11.0, description="Soil pH level")
    nitrogen: float = Field(..., ge=0, le=500, description="Nitrogen content (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus content (kg/ha)")
    potassium: float = Field(..., ge=0, le=500, description="Potassium content (kg/ha)")
    organic_matter: float = Field(..., ge=0, le=10, description="Organic matter percentage")
    soil_type: SoilType
    location: Optional[str] = None
    previous_crop: Optional[CropType] = None

class FertilizerRecommendation(BaseModel):
    nutrient: str
    current_level: str  # Low, Medium, High
    recommended_amount: float  # kg/hectare
    fertilizer_type: str
    application_method: str
    timing: str
    cost_per_hectare: float

class SoilAnalysis(BaseModel):
    soil_health_score: float = Field(..., ge=0, le=100)
    fertility_status: str
    recommendations: List[str]
    fertilizer_needs: List[FertilizerRecommendation]
    suitable_crops: List[str]
    warnings: List[str]
    improvement_plan: Dict[str, List[str]]

class SoilAnalysisRequest(BaseModel):
    soil_data: SoilData
    target_crop: CropType
    farm_size: float = Field(..., gt=0, description="Farm size in hectares")
    budget: Optional[float] = None
    season: Optional[str] = "current"

class SoilAnalysisResponse(BaseModel):
    success: bool
    analysis: Optional[SoilAnalysis]
    total_cost: float
    expected_yield_improvement: float
    environmental_impact: Dict[str, str]
    error: Optional[str] = None

# Soil analysis knowledge base
SOIL_ANALYSIS_DATA = {
    "ph_ranges": {
        "very_acidic": {"min": 3.0, "max": 4.5, "crops": ["blueberry", "tea"], "issues": ["aluminum toxicity", "poor nutrient availability"]},
        "acidic": {"min": 4.5, "max": 5.5, "crops": ["potato", "rice"], "issues": ["low phosphorus availability"]},
        "slightly_acidic": {"min": 5.5, "max": 6.5, "crops": ["wheat", "maize", "soybean"], "issues": ["optimal for most crops"]},
        "neutral": {"min": 6.5, "max": 7.5, "crops": ["most vegetables", "cotton"], "issues": ["ideal conditions"]},
        "alkaline": {"min": 7.5, "max": 8.5, "crops": ["sugarcane", "cabbage"], "issues": ["iron deficiency possible"]},
        "highly_alkaline": {"min": 8.5, "max": 11.0, "crops": ["barley"], "issues": ["micronutrient deficiency"]}
    },
    
    "nutrient_levels": {
        "nitrogen": {
            "low": {"max": 150, "fertilizers": ["urea", "ammonium_sulphate"], "symptoms": ["yellowing leaves", "stunted growth"]},
            "medium": {"min": 150, "max": 300, "fertilizers": ["balanced_npk"], "symptoms": ["normal growth"]},
            "high": {"min": 300, "fertilizers": ["organic_compost"], "symptoms": ["excessive vegetative growth"]}
        },
        "phosphorus": {
            "low": {"max": 15, "fertilizers": ["DAP", "single_super_phosphate"], "symptoms": ["purple leaves", "poor root development"]},
            "medium": {"min": 15, "max": 30, "fertilizers": ["balanced_npk"], "symptoms": ["normal growth"]},
            "high": {"min": 30, "fertilizers": ["organic_matter"], "symptoms": ["good flowering and fruiting"]}
        },
        "potassium": {
            "low": {"max": 120, "fertilizers": ["muriate_of_potash", "potassium_sulphate"], "symptoms": ["leaf burn", "weak stems"]},
            "medium": {"min": 120, "max": 280, "fertilizers": ["balanced_npk"], "symptoms": ["normal growth"]},
            "high": {"min": 280, "fertilizers": ["organic_compost"], "symptoms": ["good disease resistance"]}
        }
    },

    "fertilizer_costs": {  # Average costs in INR per kg
        "urea": 6.50,
        "DAP": 27.00,
        "muriate_of_potash": 17.00,
        "single_super_phosphate": 9.50,
        "ammonium_sulphate": 8.00,
        "potassium_sulphate": 45.00,
        "balanced_npk": 22.00,
        "organic_compost": 5.00,
        "vermicompost": 8.00
    },

    "crop_requirements": {
        "rice": {"ph": [5.5, 7.0], "n": 120, "p": 60, "k": 40, "yield_potential": 6.0},
        "wheat": {"ph": [6.0, 7.5], "n": 120, "p": 60, "k": 40, "yield_potential": 4.5},
        "maize": {"ph": [5.5, 7.0], "n": 120, "p": 60, "k": 50, "yield_potential": 8.0},
        "cotton": {"ph": [5.8, 8.0], "n": 160, "p": 80, "k": 80, "yield_potential": 2.5},
        "sugarcane": {"ph": [6.0, 7.5], "n": 280, "p": 90, "k": 160, "yield_potential": 80.0},
        "tomato": {"ph": [6.0, 7.0], "n": 150, "p": 100, "k": 150, "yield_potential": 50.0},
        "onion": {"ph": [6.0, 7.5], "n": 100, "p": 50, "k": 50, "yield_potential": 25.0},
        "potato": {"ph": [5.2, 6.4], "n": 180, "p": 80, "k": 220, "yield_potential": 30.0}
    }
}

def get_ph_category(ph: float) -> str:
    """Determine pH category"""
    for category, data in SOIL_ANALYSIS_DATA["ph_ranges"].items():
        if data["min"] <= ph <= data["max"]:
            return category
    return "unknown"

def get_nutrient_level(nutrient: str, value: float) -> str:
    """Determine nutrient level category"""
    levels = SOIL_ANALYSIS_DATA["nutrient_levels"].get(nutrient, {})
    
    if "low" in levels and value <= levels["low"]["max"]:
        return "low"
    elif "high" in levels and value >= levels["high"]["min"]:
        return "high"
    else:
        return "medium"

def calculate_fertilizer_needs(soil_data: SoilData, target_crop: CropType) -> List[FertilizerRecommendation]:
    """Calculate fertilizer recommendations based on soil data and crop requirements"""
    
    crop_req = SOIL_ANALYSIS_DATA["crop_requirements"].get(target_crop.value, {})
    recommendations = []
    
    # Nitrogen analysis
    n_level = get_nutrient_level("nitrogen", soil_data.nitrogen)
    n_need = max(0, crop_req.get("n", 120) - soil_data.nitrogen)
    
    if n_need > 0:
        fertilizer = "urea" if n_level == "low" else "balanced_npk"
        recommendations.append(FertilizerRecommendation(
            nutrient="Nitrogen",
            current_level=n_level,
            recommended_amount=n_need * 2.17,  # Urea is 46% N
            fertilizer_type=fertilizer.replace("_", " ").title(),
            application_method="Split application - 50% at planting, 25% at vegetative stage, 25% at flowering",
            timing="Pre-planting and top dressing",
            cost_per_hectare=n_need * 2.17 * SOIL_ANALYSIS_DATA["fertilizer_costs"][fertilizer]
        ))
    
    # Phosphorus analysis
    p_level = get_nutrient_level("phosphorus", soil_data.phosphorus)
    p_need = max(0, crop_req.get("p", 60) - soil_data.phosphorus)
    
    if p_need > 0:
        fertilizer = "DAP" if p_level == "low" else "single_super_phosphate"
        recommendations.append(FertilizerRecommendation(
            nutrient="Phosphorus",
            current_level=p_level,
            recommended_amount=p_need * 2.18,  # DAP is 46% P2O5
            fertilizer_type=fertilizer.replace("_", " ").title(),
            application_method="Basal application at planting",
            timing="At sowing/transplanting",
            cost_per_hectare=p_need * 2.18 * SOIL_ANALYSIS_DATA["fertilizer_costs"][fertilizer]
        ))
    
    # Potassium analysis
    k_level = get_nutrient_level("potassium", soil_data.potassium)
    k_need = max(0, crop_req.get("k", 40) - soil_data.potassium)
    
    if k_need > 0:
        fertilizer = "muriate_of_potash" if k_level == "low" else "balanced_npk"
        recommendations.append(FertilizerRecommendation(
            nutrient="Potassium",
            current_level=k_level,
            recommended_amount=k_need * 1.67,  # MOP is 60% K2O
            fertilizer_type=fertilizer.replace("_", " ").title(),
            application_method="Split application - 50% basal, 50% at flowering",
            timing="Basal and top dressing",
            cost_per_hectare=k_need * 1.67 * SOIL_ANALYSIS_DATA["fertilizer_costs"][fertilizer]
        ))
    
    return recommendations

def analyze_soil_health(soil_data: SoilData, target_crop: CropType) -> SoilAnalysis:
    """Perform comprehensive soil analysis"""
    
    # Calculate soil health score
    ph_category = get_ph_category(soil_data.ph)
    crop_req = SOIL_ANALYSIS_DATA["crop_requirements"].get(target_crop.value, {})
    
    # pH score (0-30 points)
    ph_optimal_range = crop_req.get("ph", [6.0, 7.0])
    if ph_optimal_range[0] <= soil_data.ph <= ph_optimal_range[1]:
        ph_score = 30
    else:
        ph_distance = min(abs(soil_data.ph - ph_optimal_range[0]), abs(soil_data.ph - ph_optimal_range[1]))
        ph_score = max(0, 30 - (ph_distance * 10))
    
    # Nutrient score (0-50 points)
    n_level = get_nutrient_level("nitrogen", soil_data.nitrogen)
    p_level = get_nutrient_level("phosphorus", soil_data.phosphorus)
    k_level = get_nutrient_level("potassium", soil_data.potassium)
    
    nutrient_scores = {"low": 10, "medium": 16, "high": 15}  # Medium is optimal
    nutrient_score = sum([nutrient_scores.get(level, 10) for level in [n_level, p_level, k_level]])
    nutrient_score = min(50, nutrient_score)
    
    # Organic matter score (0-20 points)
    if soil_data.organic_matter >= 3.0:
        om_score = 20
    elif soil_data.organic_matter >= 1.5:
        om_score = 15
    elif soil_data.organic_matter >= 0.5:
        om_score = 10
    else:
        om_score = 5
    
    total_score = ph_score + nutrient_score + om_score
    
    # Generate recommendations
    recommendations = []
    warnings = []
    
    if soil_data.ph < ph_optimal_range[0]:
        recommendations.append(f"Apply lime (2-3 tons/hectare) to increase soil pH from {soil_data.ph} to optimal range {ph_optimal_range}")
        if soil_data.ph < 5.0:
            warnings.append("Very acidic soil may cause aluminum toxicity")
    elif soil_data.ph > ph_optimal_range[1]:
        recommendations.append(f"Apply gypsum or organic matter to reduce soil pH from {soil_data.ph}")
        if soil_data.ph > 8.5:
            warnings.append("Alkaline soil may cause micronutrient deficiency")
    
    if soil_data.organic_matter < 1.0:
        recommendations.append("Increase organic matter by adding 5-10 tons of compost per hectare")
        warnings.append("Low organic matter reduces soil fertility and water retention")
    
    if n_level == "low":
        recommendations.append("Apply nitrogen fertilizer as recommended before planting")
    if p_level == "low":
        recommendations.append("Apply phosphorus fertilizer to improve root development")
    if k_level == "low":
        recommendations.append("Apply potassium fertilizer to improve plant disease resistance")
    
    # Fertility status
    if total_score >= 80:
        fertility_status = "Excellent"
    elif total_score >= 65:
        fertility_status = "Good"
    elif total_score >= 50:
        fertility_status = "Fair"
    elif total_score >= 35:
        fertility_status = "Poor"
    else:
        fertility_status = "Very Poor"
    
    # Suitable crops based on current conditions
    suitable_crops = []
    for crop, requirements in SOIL_ANALYSIS_DATA["crop_requirements"].items():
        crop_ph_range = requirements["ph"]
        if crop_ph_range[0] <= soil_data.ph <= crop_ph_range[1]:
            suitable_crops.append(crop.title())
    
    # Fertilizer needs
    fertilizer_needs = calculate_fertilizer_needs(soil_data, target_crop)
    
    # Improvement plan
    improvement_plan = {
        "immediate": [],
        "short_term": [],
        "long_term": []
    }
    
    if soil_data.ph < ph_optimal_range[0] or soil_data.ph > ph_optimal_range[1]:
        improvement_plan["immediate"].append("Adjust soil pH using lime or gypsum")
    
    if any(level == "low" for level in [n_level, p_level, k_level]):
        improvement_plan["immediate"].append("Apply recommended fertilizers")
    
    if soil_data.organic_matter < 2.0:
        improvement_plan["short_term"].append("Increase organic matter through composting")
        improvement_plan["long_term"].append("Implement crop rotation with legumes")
    
    improvement_plan["long_term"].extend([
        "Monitor soil health annually",
        "Practice sustainable farming methods",
        "Consider precision agriculture techniques"
    ])
    
    return SoilAnalysis(
        soil_health_score=round(total_score, 1),
        fertility_status=fertility_status,
        recommendations=recommendations,
        fertilizer_needs=fertilizer_needs,
        suitable_crops=suitable_crops,
        warnings=warnings,
        improvement_plan=improvement_plan
    )

@router.post("/analyze", response_model=SoilAnalysisResponse)
async def analyze_soil(
    request: SoilAnalysisRequest,
    background_tasks: BackgroundTasks
):
    """
    Analyze soil health and provide recommendations
    
    - **soil_data**: Soil test results (pH, NPK, organic matter)
    - **target_crop**: Crop planning to grow
    - **farm_size**: Size of farm in hectares
    - **budget**: Available budget for improvements (optional)
    - **season**: Current or planned growing season
    """
    
    try:
        # Perform soil analysis
        analysis = analyze_soil_health(request.soil_data, request.target_crop)
        
        # Calculate total cost
        total_cost = sum([rec.cost_per_hectare for rec in analysis.fertilizer_needs]) * request.farm_size
        
        # Apply budget constraints if provided
        if request.budget and total_cost > request.budget:
            # Prioritize fertilizer recommendations by importance
            priority_order = ["phosphorus", "nitrogen", "potassium"]
            filtered_recommendations = []
            running_cost = 0
            
            for nutrient in priority_order:
                for rec in analysis.fertilizer_needs:
                    if rec.nutrient.lower() == nutrient:
                        cost = rec.cost_per_hectare * request.farm_size
                        if running_cost + cost <= request.budget:
                            filtered_recommendations.append(rec)
                            running_cost += cost
            
            analysis.fertilizer_needs = filtered_recommendations
            total_cost = running_cost
            
            if len(filtered_recommendations) < len(analysis.fertilizer_needs):
                analysis.warnings.append(f"Budget constraint: Only {len(filtered_recommendations)} of {len(analysis.fertilizer_needs)} fertilizer recommendations fit within budget")
        
        # Calculate expected yield improvement
        base_yield_improvement = min(25.0, (100 - analysis.soil_health_score) * 0.5)
        fertilizer_improvement = len(analysis.fertilizer_needs) * 5.0  # 5% per missing nutrient
        expected_yield_improvement = min(40.0, base_yield_improvement + fertilizer_improvement)
        
        # Environmental impact assessment
        environmental_impact = {
            "water_retention": "Improved" if analysis.soil_health_score > 60 else "Needs improvement",
            "nutrient_runoff_risk": "Low" if analysis.soil_health_score > 70 else "Medium" if analysis.soil_health_score > 50 else "High",
            "carbon_sequestration": "Good" if request.soil_data.organic_matter > 2.0 else "Poor",
            "biodiversity_impact": "Positive" if len(analysis.warnings) == 0 else "Neutral"
        }
        
        # Log analysis for analytics (background task)
        background_tasks.add_task(
            log_soil_analysis,
            request.soil_data.dict(),
            request.target_crop.value,
            analysis.soil_health_score
        )
        
        return SoilAnalysisResponse(
            success=True,
            analysis=analysis,
            total_cost=round(total_cost, 2),
            expected_yield_improvement=round(expected_yield_improvement, 1),
            environmental_impact=environmental_impact
        )
        
    except Exception as e:
        logger.error(f"Soil analysis error: {e}")
        return SoilAnalysisResponse(
            success=False,
            analysis=None,
            total_cost=0.0,
            expected_yield_improvement=0.0,
            environmental_impact={},
            error=str(e)
        )

@router.get("/fertilizer-prices")
async def get_fertilizer_prices():
    """Get current fertilizer prices in INR per kg"""
    return {
        "success": True,
        "prices": SOIL_ANALYSIS_DATA["fertilizer_costs"],
        "currency": "INR",
        "unit": "per kg",
        "last_updated": "2025-09-24"
    }

@router.get("/crop-requirements/{crop_type}")
async def get_crop_requirements(crop_type: CropType):
    """Get soil and nutrient requirements for a specific crop"""
    
    requirements = SOIL_ANALYSIS_DATA["crop_requirements"].get(crop_type.value)
    
    if not requirements:
        raise HTTPException(status_code=404, detail="Crop requirements not found")
    
    return {
        "success": True,
        "crop": crop_type.value,
        "requirements": requirements,
        "optimal_conditions": f"pH {requirements['ph'][0]}-{requirements['ph'][1]}, NPK {requirements['n']}-{requirements['p']}-{requirements['k']}"
    }

@router.post("/quick-test")
async def quick_soil_test(
    ph: float = Field(..., ge=3.0, le=11.0),
    crop: CropType = CropType.RICE
):
    """Quick soil test with minimal inputs - useful for demo purposes"""
    
    # Generate realistic soil data based on pH
    if ph < 5.5:  # Acidic soil
        soil_data = SoilData(
            ph=ph,
            nitrogen=80,
            phosphorus=12,
            potassium=90,
            organic_matter=1.2,
            soil_type=SoilType.RED
        )
    elif ph > 7.5:  # Alkaline soil
        soil_data = SoilData(
            ph=ph,
            nitrogen=120,
            phosphorus=25,
            potassium=200,
            organic_matter=2.1,
            soil_type=SoilType.BLACK
        )
    else:  # Neutral soil
        soil_data = SoilData(
            ph=ph,
            nitrogen=150,
            phosphorus=20,
            potassium=160,
            organic_matter=2.5,
            soil_type=SoilType.LOAMY
        )
    
    request = SoilAnalysisRequest(
        soil_data=soil_data,
        target_crop=crop,
        farm_size=1.0,
        season="current"
    )
    
    return await analyze_soil(request, BackgroundTasks())

async def log_soil_analysis(soil_data: dict, crop: str, health_score: float):
    """Log soil analysis for analytics (background task)"""
    try:
        # This would typically save to database or analytics service
        logger.info(f"Soil analysis logged: Crop={crop}, Score={health_score}, pH={soil_data.get('ph')}")
    except Exception as e:
        logger.error(f"Failed to log soil analysis: {e}")

@router.get("/health")
async def health_check():
    """Health check for soil analysis service"""
    return {
        "status": "healthy",
        "service": "Soil Analysis",
        "features": {
            "soil_analysis": True,
            "fertilizer_calculator": True,
            "crop_recommendations": True,
            "budget_optimization": True
        },
        "supported_crops": len(SOIL_ANALYSIS_DATA["crop_requirements"]),
        "supported_fertilizers": len(SOIL_ANALYSIS_DATA["fertilizer_costs"])
    }