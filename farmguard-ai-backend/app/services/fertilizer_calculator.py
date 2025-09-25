"""
Fertilizer Calculator Service for FARMGUARD

Advanced fertilizer calculations considering soil tests, crop requirements,
climate conditions, and economic factors for Indian farming.
"""

import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import json
import math

logger = logging.getLogger(__name__)

class ApplicationMethod(str, Enum):
    BROADCAST = "broadcast"
    BAND = "band"
    FOLIAR = "foliar"
    DRIP = "drip"
    SPLIT = "split"

class FertilizerGrade(str, Enum):
    UREA = "urea"  # 46-0-0
    DAP = "DAP"   # 18-46-0
    SSP = "SSP"   # 0-16-0
    MOP = "MOP"   # 0-0-60
    NPK_COMPLEX = "npk_complex"  # Various ratios
    ORGANIC = "organic"

@dataclass
class SoilTestResult:
    ph: float
    nitrogen: float  # kg/ha
    phosphorus: float  # kg/ha
    potassium: float  # kg/ha
    organic_matter: float  # percentage
    cation_exchange_capacity: Optional[float] = None
    electrical_conductivity: Optional[float] = None

@dataclass
class CropRequirement:
    nitrogen: float  # kg/ha
    phosphorus: float  # kg/ha
    potassium: float  # kg/ha
    growth_stages: Dict[str, float]  # N-P-K distribution by growth stage
    critical_periods: List[str]  # Critical nutrient uptake periods

@dataclass
class FertilizerProduct:
    name: str
    grade: FertilizerGrade
    n_content: float  # percentage
    p2o5_content: float  # percentage
    k2o_content: float  # percentage
    price_per_kg: float  # INR
    availability: bool = True
    organic: bool = False

@dataclass
class ApplicationSchedule:
    stage: str
    days_after_planting: int
    nutrient: str
    amount: float  # kg/ha
    fertilizer: str
    method: ApplicationMethod
    weather_conditions: List[str]

class FertilizerCalculator:
    """Advanced fertilizer calculator for Indian farming conditions"""
    
    def __init__(self):
        self.fertilizer_database = self._load_fertilizer_database()
        self.crop_database = self._load_crop_database()
        self.regional_factors = self._load_regional_factors()
    
    def _load_fertilizer_database(self) -> Dict[str, FertilizerProduct]:
        """Load fertilizer product database"""
        return {
            "urea": FertilizerProduct("Urea", FertilizerGrade.UREA, 46.0, 0.0, 0.0, 6.50),
            "dap": FertilizerProduct("DAP", FertilizerGrade.DAP, 18.0, 46.0, 0.0, 27.00),
            "ssp": FertilizerProduct("Single Super Phosphate", FertilizerGrade.SSP, 0.0, 16.0, 0.0, 9.50),
            "mop": FertilizerProduct("Muriate of Potash", FertilizerGrade.MOP, 0.0, 0.0, 60.0, 17.00),
            "npk_10_26_26": FertilizerProduct("NPK 10-26-26", FertilizerGrade.NPK_COMPLEX, 10.0, 26.0, 26.0, 22.00),
            "npk_12_32_16": FertilizerProduct("NPK 12-32-16", FertilizerGrade.NPK_COMPLEX, 12.0, 32.0, 16.0, 24.00),
            "npk_20_20_0_13": FertilizerProduct("NPK 20-20-0-13S", FertilizerGrade.NPK_COMPLEX, 20.0, 20.0, 0.0, 26.00),
            "compost": FertilizerProduct("Farm Compost", FertilizerGrade.ORGANIC, 0.5, 0.3, 0.5, 5.00, True, True),
            "vermicompost": FertilizerProduct("Vermicompost", FertilizerGrade.ORGANIC, 1.5, 1.0, 1.2, 8.00, True, True),
        }
    
    def _load_crop_database(self) -> Dict[str, CropRequirement]:
        """Load crop nutrient requirement database"""
        return {
            "rice": CropRequirement(
                nitrogen=120, phosphorus=60, potassium=40,
                growth_stages={
                    "basal": 0.25,        # 25% N, 100% P, 50% K
                    "tillering": 0.50,    # 50% N
                    "panicle": 0.25,      # 25% N, 50% K
                    "grain_filling": 0.0
                },
                critical_periods=["tillering", "panicle_initiation"]
            ),
            "wheat": CropRequirement(
                nitrogen=120, phosphorus=60, potassium=40,
                growth_stages={
                    "basal": 0.33,        # 33% N, 100% P, 100% K
                    "crown_root": 0.33,   # 33% N
                    "jointing": 0.34,     # 34% N
                },
                critical_periods=["crown_root_stage", "jointing"]
            ),
            "maize": CropRequirement(
                nitrogen=120, phosphorus=60, potassium=50,
                growth_stages={
                    "basal": 0.25,        # 25% N, 100% P, 50% K
                    "knee_high": 0.50,    # 50% N, 50% K
                    "tasseling": 0.25,    # 25% N
                },
                critical_periods=["6_leaf_stage", "tasseling"]
            ),
            "cotton": CropRequirement(
                nitrogen=160, phosphorus=80, potassium=80,
                growth_stages={
                    "basal": 0.25,        # 25% N, 100% P, 25% K
                    "squaring": 0.50,     # 50% N, 50% K
                    "flowering": 0.25,    # 25% N, 25% K
                },
                critical_periods=["squaring", "peak_flowering"]
            ),
            "sugarcane": CropRequirement(
                nitrogen=280, phosphorus=90, potassium=160,
                growth_stages={
                    "planting": 0.25,     # 25% N, 100% P, 33% K
                    "tillering": 0.50,    # 50% N, 33% K
                    "grand_growth": 0.25, # 25% N, 34% K
                },
                critical_periods=["tillering", "grand_growth_phase"]
            )
        }
    
    def _load_regional_factors(self) -> Dict[str, Dict]:
        """Load regional adjustment factors for different states/regions"""
        return {
            "punjab": {"rainfall": 1.1, "temperature": 1.0, "soil_factor": 1.1},
            "haryana": {"rainfall": 1.0, "temperature": 1.1, "soil_factor": 1.0},
            "uttar_pradesh": {"rainfall": 0.9, "temperature": 1.0, "soil_factor": 0.9},
            "bihar": {"rainfall": 0.8, "temperature": 0.9, "soil_factor": 0.8},
            "west_bengal": {"rainfall": 1.2, "temperature": 0.9, "soil_factor": 1.0},
            "maharashtra": {"rainfall": 0.7, "temperature": 1.1, "soil_factor": 0.9},
            "karnataka": {"rainfall": 0.8, "temperature": 1.0, "soil_factor": 1.0},
            "tamil_nadu": {"rainfall": 0.6, "temperature": 1.1, "soil_factor": 0.9},
            "gujarat": {"rainfall": 0.5, "temperature": 1.2, "soil_factor": 0.8},
            "rajasthan": {"rainfall": 0.3, "temperature": 1.3, "soil_factor": 0.7},
        }
    
    def calculate_nutrient_requirements(
        self, 
        crop: str, 
        soil_test: SoilTestResult,
        target_yield: Optional[float] = None,
        region: Optional[str] = None
    ) -> Dict[str, float]:
        """Calculate adjusted nutrient requirements based on soil test and target yield"""
        
        if crop not in self.crop_database:
            raise ValueError(f"Crop '{crop}' not found in database")
        
        base_requirement = self.crop_database[crop]
        
        # Base requirements
        n_required = base_requirement.nitrogen
        p_required = base_requirement.phosphorus  
        k_required = base_requirement.potassium
        
        # Adjust based on soil test results
        # Nitrogen adjustment (soil N is available N)
        available_n = soil_test.nitrogen
        n_deficit = max(0, n_required - available_n * 0.6)  # 60% efficiency
        
        # Phosphorus adjustment (Olsen P method)
        available_p = soil_test.phosphorus
        if available_p < 10:  # Low P
            p_deficit = p_required
        elif available_p < 25:  # Medium P
            p_deficit = p_required * 0.7
        else:  # High P
            p_deficit = p_required * 0.3
            
        # Potassium adjustment (exchangeable K)
        available_k = soil_test.potassium
        if available_k < 110:  # Low K
            k_deficit = k_required
        elif available_k < 280:  # Medium K
            k_deficit = k_required * 0.7
        else:  # High K
            k_deficit = k_required * 0.3
        
        # pH adjustment factor
        ph_factor = self._get_ph_adjustment_factor(soil_test.ph)
        n_deficit *= ph_factor
        p_deficit *= ph_factor
        k_deficit *= ph_factor
        
        # Organic matter adjustment
        om_factor = self._get_organic_matter_factor(soil_test.organic_matter)
        n_deficit *= om_factor
        
        # Target yield adjustment (if provided)
        if target_yield:
            # Increase nutrient requirements for higher yields
            yield_factor = min(target_yield / self._get_average_yield(crop), 2.0)
            n_deficit *= yield_factor
            p_deficit *= yield_factor
            k_deficit *= yield_factor
        
        # Regional adjustment
        if region and region.lower() in self.regional_factors:
            factors = self.regional_factors[region.lower()]
            n_deficit *= factors["rainfall"] * factors["soil_factor"]
            p_deficit *= factors["soil_factor"]
            k_deficit *= factors["rainfall"] * factors["soil_factor"]
        
        return {
            "nitrogen": max(0, n_deficit),
            "phosphorus": max(0, p_deficit), 
            "potassium": max(0, k_deficit)
        }
    
    def _get_ph_adjustment_factor(self, ph: float) -> float:
        """Get nutrient availability adjustment factor based on pH"""
        if 6.0 <= ph <= 7.5:
            return 1.0
        elif ph < 5.5:
            return 0.7  # Reduced availability in acidic soils
        elif ph > 8.0:
            return 0.8  # Reduced P and micronutrient availability
        else:
            return 0.9
    
    def _get_organic_matter_factor(self, om: float) -> float:
        """Get nitrogen adjustment factor based on organic matter content"""
        if om > 2.5:
            return 0.8  # Less N fertilizer needed
        elif om < 1.0:
            return 1.2  # More N fertilizer needed
        else:
            return 1.0
    
    def _get_average_yield(self, crop: str) -> float:
        """Get average yield for crops (tons/hectare)"""
        yields = {
            "rice": 3.5,
            "wheat": 3.2,
            "maize": 5.5,
            "cotton": 1.8,
            "sugarcane": 75.0
        }
        return yields.get(crop, 1.0)
    
    def recommend_fertilizers(
        self,
        nutrient_requirements: Dict[str, float],
        budget: Optional[float] = None,
        organic_preference: bool = False
    ) -> List[Dict]:
        """Recommend optimal fertilizer combinations"""
        
        n_needed = nutrient_requirements["nitrogen"]
        p_needed = nutrient_requirements["phosphorus"] * 2.29  # Convert P to P2O5
        k_needed = nutrient_requirements["potassium"] * 1.20   # Convert K to K2O
        
        recommendations = []
        
        # Strategy 1: Complex fertilizers + singles
        if not organic_preference:
            # Use DAP for P and some N
            if p_needed > 0:
                dap_needed = min(p_needed / 0.46, n_needed / 0.18)
                if dap_needed > 0:
                    recommendations.append({
                        "fertilizer": "DAP",
                        "amount": dap_needed,
                        "cost": dap_needed * self.fertilizer_database["dap"].price_per_kg,
                        "nutrients_supplied": {
                            "n": dap_needed * 0.18,
                            "p2o5": dap_needed * 0.46,
                            "k2o": 0
                        },
                        "application": "Basal application at planting"
                    })
                    n_needed -= dap_needed * 0.18
                    p_needed -= dap_needed * 0.46
            
            # Use Urea for remaining N
            if n_needed > 0:
                urea_needed = n_needed / 0.46
                recommendations.append({
                    "fertilizer": "Urea", 
                    "amount": urea_needed,
                    "cost": urea_needed * self.fertilizer_database["urea"].price_per_kg,
                    "nutrients_supplied": {
                        "n": urea_needed * 0.46,
                        "p2o5": 0,
                        "k2o": 0
                    },
                    "application": "Split application - 50% basal, 25% at vegetative stage, 25% at reproductive stage"
                })
            
            # Use MOP for K
            if k_needed > 0:
                mop_needed = k_needed / 0.60
                recommendations.append({
                    "fertilizer": "Muriate of Potash",
                    "amount": mop_needed,
                    "cost": mop_needed * self.fertilizer_database["mop"].price_per_kg,
                    "nutrients_supplied": {
                        "n": 0,
                        "p2o5": 0,
                        "k2o": mop_needed * 0.60
                    },
                    "application": "Split application - 50% basal, 50% at critical growth stage"
                })
        
        # Strategy 2: Organic fertilizers
        else:
            # Use compost as base
            compost_amount = max(5000, (n_needed + p_needed + k_needed) * 200)  # Minimum 5 tons/ha
            recommendations.append({
                "fertilizer": "Farm Compost",
                "amount": compost_amount,
                "cost": compost_amount * self.fertilizer_database["compost"].price_per_kg,
                "nutrients_supplied": {
                    "n": compost_amount * 0.005,
                    "p2o5": compost_amount * 0.003 * 2.29,
                    "k2o": compost_amount * 0.005 * 1.20
                },
                "application": "Apply and incorporate 2-3 weeks before planting"
            })
            
            # Supplement with vermicompost for remaining nutrients
            remaining_n = max(0, n_needed - compost_amount * 0.005)
            if remaining_n > 0:
                vermi_amount = remaining_n / 0.015
                recommendations.append({
                    "fertilizer": "Vermicompost",
                    "amount": vermi_amount,
                    "cost": vermi_amount * self.fertilizer_database["vermicompost"].price_per_kg,
                    "nutrients_supplied": {
                        "n": vermi_amount * 0.015,
                        "p2o5": vermi_amount * 0.010 * 2.29,
                        "k2o": vermi_amount * 0.012 * 1.20
                    },
                    "application": "Apply as top dressing during vegetative growth"
                })
        
        # Apply budget constraints
        if budget:
            total_cost = sum(rec["cost"] for rec in recommendations)
            if total_cost > budget:
                # Prioritize by nutrient importance: P > N > K
                recommendations.sort(key=lambda x: (
                    -x["nutrients_supplied"]["p2o5"],
                    -x["nutrients_supplied"]["n"],
                    -x["nutrients_supplied"]["k2o"]
                ))
                
                filtered_recs = []
                running_cost = 0
                for rec in recommendations:
                    if running_cost + rec["cost"] <= budget:
                        filtered_recs.append(rec)
                        running_cost += rec["cost"]
                
                recommendations = filtered_recs
        
        return recommendations
    
    def create_application_schedule(
        self,
        crop: str,
        fertilizer_recommendations: List[Dict],
        planting_date: str
    ) -> List[ApplicationSchedule]:
        """Create detailed fertilizer application schedule"""
        
        if crop not in self.crop_database:
            raise ValueError(f"Crop '{crop}' not found in database")
        
        crop_req = self.crop_database[crop]
        schedule = []
        
        # Define application timings based on crop growth stages
        application_timings = self._get_application_timings(crop)
        
        for rec in fertilizer_recommendations:
            fertilizer_name = rec["fertilizer"]
            total_amount = rec["amount"]
            
            # Determine split application based on fertilizer type
            if "urea" in fertilizer_name.lower() or "n" in fertilizer_name.lower():
                # Split nitrogen application
                for stage, percentage in crop_req.growth_stages.items():
                    if percentage > 0:
                        stage_amount = total_amount * percentage
                        schedule.append(ApplicationSchedule(
                            stage=stage,
                            days_after_planting=application_timings.get(stage, 0),
                            nutrient="Nitrogen",
                            amount=stage_amount,
                            fertilizer=fertilizer_name,
                            method=ApplicationMethod.BROADCAST,
                            weather_conditions=["Avoid application before heavy rain", "Apply in cool hours"]
                        ))
            
            elif "dap" in fertilizer_name.lower() or "ssp" in fertilizer_name.lower():
                # Phosphorus - usually basal application
                schedule.append(ApplicationSchedule(
                    stage="basal",
                    days_after_planting=0,
                    nutrient="Phosphorus", 
                    amount=total_amount,
                    fertilizer=fertilizer_name,
                    method=ApplicationMethod.BAND,
                    weather_conditions=["Apply at planting", "Mix with soil"]
                ))
            
            elif "mop" in fertilizer_name.lower() or "potash" in fertilizer_name.lower():
                # Potassium - split application
                schedule.append(ApplicationSchedule(
                    stage="basal",
                    days_after_planting=0,
                    nutrient="Potassium",
                    amount=total_amount * 0.5,
                    fertilizer=fertilizer_name,
                    method=ApplicationMethod.BROADCAST,
                    weather_conditions=["Apply at planting", "Mix with soil"]
                ))
                
                schedule.append(ApplicationSchedule(
                    stage="reproductive",
                    days_after_planting=application_timings.get("reproductive", 60),
                    nutrient="Potassium",
                    amount=total_amount * 0.5,
                    fertilizer=fertilizer_name,
                    method=ApplicationMethod.BROADCAST,
                    weather_conditions=["Apply during flower initiation", "Irrigate after application"]
                ))
            
            elif "compost" in fertilizer_name.lower() or "organic" in fertilizer_name.lower():
                # Organic fertilizers - pre-planting application
                schedule.append(ApplicationSchedule(
                    stage="pre_planting",
                    days_after_planting=-21,
                    nutrient="Organic Matter",
                    amount=total_amount,
                    fertilizer=fertilizer_name,
                    method=ApplicationMethod.BROADCAST,
                    weather_conditions=["Apply 2-3 weeks before planting", "Incorporate well into soil"]
                ))
        
        # Sort by application timing
        schedule.sort(key=lambda x: x.days_after_planting)
        
        return schedule
    
    def _get_application_timings(self, crop: str) -> Dict[str, int]:
        """Get application timings in days after planting for different crops"""
        
        timings = {
            "rice": {
                "basal": 0,
                "tillering": 21,
                "panicle": 45,
                "reproductive": 45
            },
            "wheat": {
                "basal": 0,
                "crown_root": 21,
                "jointing": 45,
                "reproductive": 45
            },
            "maize": {
                "basal": 0,
                "knee_high": 30,
                "tasseling": 60,
                "reproductive": 60
            },
            "cotton": {
                "basal": 0,
                "squaring": 45,
                "flowering": 75,
                "reproductive": 75
            },
            "sugarcane": {
                "planting": 0,
                "tillering": 60,
                "grand_growth": 120,
                "reproductive": 120
            }
        }
        
        return timings.get(crop, {"basal": 0, "reproductive": 60})
    
    def calculate_cost_benefit_analysis(
        self,
        fertilizer_recommendations: List[Dict],
        crop: str,
        farm_size: float,
        expected_price_per_unit: float
    ) -> Dict:
        """Calculate cost-benefit analysis of fertilizer application"""
        
        total_fertilizer_cost = sum(rec["cost"] for rec in fertilizer_recommendations) * farm_size
        
        # Estimate yield improvement from proper fertilization
        base_yield = self._get_average_yield(crop)
        improved_yield = base_yield * 1.25  # Assume 25% improvement with proper fertilization
        
        additional_yield = (improved_yield - base_yield) * farm_size
        additional_revenue = additional_yield * expected_price_per_unit
        
        net_benefit = additional_revenue - total_fertilizer_cost
        roi = (net_benefit / total_fertilizer_cost) * 100 if total_fertilizer_cost > 0 else 0
        
        return {
            "total_fertilizer_cost": round(total_fertilizer_cost, 2),
            "expected_additional_yield": round(additional_yield, 2),
            "additional_revenue": round(additional_revenue, 2),
            "net_benefit": round(net_benefit, 2),
            "return_on_investment": round(roi, 1),
            "payback_period": "Within current season" if net_benefit > 0 else "Not profitable",
            "break_even_price": round(total_fertilizer_cost / additional_yield, 2) if additional_yield > 0 else 0
        }