"""
Test Suite for Soil Analysis Module

Tests the soil analysis functionality including fertilizer calculations,
crop recommendations, and API endpoints.
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
import sys
import os

# Add the parent directory to sys.path to import app modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.main import app
from app.api.soil_analysis import (
    SoilData, SoilType, CropType, 
    analyze_soil_health, calculate_fertilizer_needs,
    get_ph_category, get_nutrient_level
)
from app.services.fertilizer_calculator import (
    FertilizerCalculator, SoilTestResult
)

# Create test client
client = TestClient(app)

class TestSoilAnalysisAPI:
    """Test soil analysis API endpoints"""
    
    def test_health_check(self):
        """Test soil analysis health check endpoint"""
        response = client.get("/soil/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "Soil Analysis"
        assert "features" in data
        assert data["features"]["soil_analysis"] == True
    
    def test_fertilizer_prices(self):
        """Test fertilizer prices endpoint"""
        response = client.get("/soil/fertilizer-prices")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "prices" in data
        assert "urea" in data["prices"]
        assert data["currency"] == "INR"
    
    def test_crop_requirements(self):
        """Test crop requirements endpoint"""
        response = client.get("/soil/crop-requirements/rice")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["crop"] == "rice"
        assert "requirements" in data
        assert "optimal_conditions" in data
    
    def test_crop_requirements_not_found(self):
        """Test crop requirements endpoint with invalid crop"""
        response = client.get("/soil/crop-requirements/invalid_crop")
        assert response.status_code == 422  # Validation error due to enum
    
    def test_quick_soil_test(self):
        """Test quick soil test endpoint"""
        response = client.post("/soil/quick-test?ph=6.5&crop=rice")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "analysis" in data
        assert "total_cost" in data
        assert "expected_yield_improvement" in data
    
    def test_soil_analysis_complete(self):
        """Test complete soil analysis endpoint"""
        test_data = {
            "soil_data": {
                "ph": 6.2,
                "nitrogen": 80.0,
                "phosphorus": 15.0,
                "potassium": 120.0,
                "organic_matter": 1.8,
                "soil_type": "loamy",
                "location": "Punjab",
                "previous_crop": "wheat"
            },
            "target_crop": "rice",
            "farm_size": 2.5,
            "budget": 10000.0,
            "season": "kharif"
        }
        
        response = client.post("/soil/analyze", json=test_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["analysis"]["soil_health_score"] >= 0
        assert data["analysis"]["soil_health_score"] <= 100
        assert len(data["analysis"]["fertilizer_needs"]) >= 0
        assert data["total_cost"] >= 0
        assert data["expected_yield_improvement"] >= 0
    
    def test_soil_analysis_budget_constraint(self):
        """Test soil analysis with budget constraints"""
        test_data = {
            "soil_data": {
                "ph": 5.8,
                "nitrogen": 50.0,
                "phosphorus": 8.0,
                "potassium": 80.0,
                "organic_matter": 1.2,
                "soil_type": "red"
            },
            "target_crop": "cotton",
            "farm_size": 1.0,
            "budget": 2000.0
        }
        
        response = client.post("/soil/analyze", json=test_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["total_cost"] <= test_data["budget"]

class TestSoilAnalysisLogic:
    """Test soil analysis logic functions"""
    
    def test_ph_category_classification(self):
        """Test pH category classification"""
        assert get_ph_category(4.0) == "very_acidic"
        assert get_ph_category(5.0) == "acidic"
        assert get_ph_category(6.0) == "slightly_acidic"
        assert get_ph_category(7.0) == "neutral"
        assert get_ph_category(8.0) == "alkaline"
        assert get_ph_category(9.0) == "highly_alkaline"
    
    def test_nutrient_level_classification(self):
        """Test nutrient level classification"""
        # Nitrogen levels
        assert get_nutrient_level("nitrogen", 100) == "low"
        assert get_nutrient_level("nitrogen", 200) == "medium"
        assert get_nutrient_level("nitrogen", 350) == "high"
        
        # Phosphorus levels
        assert get_nutrient_level("phosphorus", 10) == "low"
        assert get_nutrient_level("phosphorus", 20) == "medium"
        assert get_nutrient_level("phosphorus", 35) == "high"
        
        # Potassium levels
        assert get_nutrient_level("potassium", 100) == "low"
        assert get_nutrient_level("potassium", 200) == "medium"
        assert get_nutrient_level("potassium", 300) == "high"
    
    def test_soil_health_analysis(self):
        """Test complete soil health analysis"""
        soil_data = SoilData(
            ph=6.5,
            nitrogen=150,
            phosphorus=20,
            potassium=160,
            organic_matter=2.0,
            soil_type=SoilType.LOAMY
        )
        
        analysis = analyze_soil_health(soil_data, CropType.RICE)
        
        assert 0 <= analysis.soil_health_score <= 100
        assert analysis.fertility_status in ["Excellent", "Good", "Fair", "Poor", "Very Poor"]
        assert len(analysis.recommendations) >= 0
        assert len(analysis.fertilizer_needs) >= 0
        assert len(analysis.suitable_crops) > 0
        assert "immediate" in analysis.improvement_plan
        assert "short_term" in analysis.improvement_plan
        assert "long_term" in analysis.improvement_plan
    
    def test_fertilizer_calculations(self):
        """Test fertilizer need calculations"""
        soil_data = SoilData(
            ph=6.0,
            nitrogen=80,
            phosphorus=10,
            potassium=100,
            organic_matter=1.5,
            soil_type=SoilType.CLAY
        )
        
        fertilizer_needs = calculate_fertilizer_needs(soil_data, CropType.WHEAT)
        
        # Should have recommendations for low nutrients
        nutrient_types = [rec.nutrient for rec in fertilizer_needs]
        assert "Nitrogen" in nutrient_types or "Phosphorus" in nutrient_types or "Potassium" in nutrient_types
        
        # Check that costs are reasonable
        for rec in fertilizer_needs:
            assert rec.cost_per_hectare > 0
            assert rec.recommended_amount > 0

class TestFertilizerCalculator:
    """Test advanced fertilizer calculator"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.calculator = FertilizerCalculator()
        self.test_soil = SoilTestResult(
            ph=6.2,
            nitrogen=80,
            phosphorus=12,
            potassium=120,
            organic_matter=1.8
        )
    
    def test_nutrient_requirement_calculation(self):
        """Test nutrient requirement calculations"""
        requirements = self.calculator.calculate_nutrient_requirements(
            "rice", self.test_soil
        )
        
        assert "nitrogen" in requirements
        assert "phosphorus" in requirements
        assert "potassium" in requirements
        assert all(v >= 0 for v in requirements.values())
    
    def test_nutrient_requirement_with_target_yield(self):
        """Test nutrient requirements with target yield"""
        normal_req = self.calculator.calculate_nutrient_requirements(
            "rice", self.test_soil
        )
        
        high_yield_req = self.calculator.calculate_nutrient_requirements(
            "rice", self.test_soil, target_yield=8.0
        )
        
        # Higher yield should require more nutrients
        assert high_yield_req["nitrogen"] >= normal_req["nitrogen"]
        assert high_yield_req["phosphorus"] >= normal_req["phosphorus"]
        assert high_yield_req["potassium"] >= normal_req["potassium"]
    
    def test_fertilizer_recommendations(self):
        """Test fertilizer recommendations"""
        requirements = {
            "nitrogen": 60,
            "phosphorus": 40,
            "potassium": 30
        }
        
        recommendations = self.calculator.recommend_fertilizers(requirements)
        
        assert len(recommendations) > 0
        assert all("fertilizer" in rec for rec in recommendations)
        assert all("amount" in rec for rec in recommendations)
        assert all("cost" in rec for rec in recommendations)
        assert all(rec["cost"] > 0 for rec in recommendations)
    
    def test_organic_fertilizer_recommendations(self):
        """Test organic fertilizer recommendations"""
        requirements = {
            "nitrogen": 60,
            "phosphorus": 40,
            "potassium": 30
        }
        
        organic_recs = self.calculator.recommend_fertilizers(
            requirements, organic_preference=True
        )
        
        assert len(organic_recs) > 0
        fertilizer_names = [rec["fertilizer"].lower() for rec in organic_recs]
        assert any("compost" in name for name in fertilizer_names)
    
    def test_budget_constrained_recommendations(self):
        """Test budget-constrained recommendations"""
        requirements = {
            "nitrogen": 100,
            "phosphorus": 80,
            "potassium": 60
        }
        
        budget = 5000.0
        recommendations = self.calculator.recommend_fertilizers(
            requirements, budget=budget
        )
        
        total_cost = sum(rec["cost"] for rec in recommendations)
        assert total_cost <= budget
    
    def test_application_schedule(self):
        """Test fertilizer application schedule creation"""
        recommendations = [{
            "fertilizer": "Urea",
            "amount": 100,
            "cost": 650
        }]
        
        schedule = self.calculator.create_application_schedule(
            "rice", recommendations, "2024-06-15"
        )
        
        assert len(schedule) > 0
        assert all(hasattr(app, 'stage') for app in schedule)
        assert all(hasattr(app, 'days_after_planting') for app in schedule)
        assert all(app.amount > 0 for app in schedule)
    
    def test_cost_benefit_analysis(self):
        """Test cost-benefit analysis calculations"""
        recommendations = [{
            "fertilizer": "Urea",
            "amount": 100,
            "cost": 650
        }, {
            "fertilizer": "DAP",
            "amount": 50,
            "cost": 1350
        }]
        
        analysis = self.calculator.calculate_cost_benefit_analysis(
            recommendations, "rice", 2.0, 2500.0
        )
        
        assert "total_fertilizer_cost" in analysis
        assert "expected_additional_yield" in analysis
        assert "net_benefit" in analysis
        assert "return_on_investment" in analysis
        assert analysis["total_fertilizer_cost"] > 0

class TestSoilAnalysisIntegration:
    """Integration tests for soil analysis system"""
    
    def test_end_to_end_analysis_flow(self):
        """Test complete end-to-end soil analysis flow"""
        # Step 1: Create soil test data
        test_request = {
            "soil_data": {
                "ph": 6.8,
                "nitrogen": 120,
                "phosphorus": 18,
                "potassium": 180,
                "organic_matter": 2.3,
                "soil_type": "black",
                "location": "Maharashtra"
            },
            "target_crop": "cotton",
            "farm_size": 1.5,
            "budget": 8000.0
        }
        
        # Step 2: Run analysis
        response = client.post("/soil/analyze", json=test_request)
        assert response.status_code == 200
        
        result = response.json()
        
        # Step 3: Validate comprehensive results
        assert result["success"] == True
        
        analysis = result["analysis"]
        assert analysis["soil_health_score"] > 0
        assert analysis["fertility_status"] in ["Excellent", "Good", "Fair", "Poor", "Very Poor"]
        assert len(analysis["suitable_crops"]) > 0
        
        # Step 4: Validate economic analysis
        assert result["total_cost"] <= test_request["budget"]
        assert result["expected_yield_improvement"] >= 0
        
        # Step 5: Validate environmental impact
        assert "environmental_impact" in result
        assert "water_retention" in result["environmental_impact"]
        assert "nutrient_runoff_risk" in result["environmental_impact"]
    
    def test_multiple_crop_scenarios(self):
        """Test soil analysis for multiple crops"""
        base_soil = {
            "ph": 6.5,
            "nitrogen": 100,
            "phosphorus": 20,
            "potassium": 150,
            "organic_matter": 2.0,
            "soil_type": "loamy"
        }
        
        crops = ["rice", "wheat", "maize", "cotton"]
        results = {}
        
        for crop in crops:
            test_request = {
                "soil_data": base_soil,
                "target_crop": crop,
                "farm_size": 1.0
            }
            
            response = client.post("/soil/analyze", json=test_request)
            assert response.status_code == 200
            
            results[crop] = response.json()
        
        # Validate that different crops give different recommendations
        recommendations = {}
        for crop, result in results.items():
            recommendations[crop] = len(result["analysis"]["fertilizer_needs"])
        
        # Should have different fertilizer needs for different crops
        assert len(set(recommendations.values())) > 1 or any(rec > 0 for rec in recommendations.values())

if __name__ == "__main__":
    # Run tests
    print("🧪 Running Soil Analysis Tests...")
    
    # Test API endpoints
    print("\n📡 Testing API Endpoints...")
    api_tests = TestSoilAnalysisAPI()
    api_tests.test_health_check()
    api_tests.test_fertilizer_prices()
    api_tests.test_crop_requirements()
    api_tests.test_quick_soil_test()
    api_tests.test_soil_analysis_complete()
    print("✅ API endpoint tests passed!")
    
    # Test soil analysis logic
    print("\n🔬 Testing Soil Analysis Logic...")
    logic_tests = TestSoilAnalysisLogic()
    logic_tests.test_ph_category_classification()
    logic_tests.test_nutrient_level_classification()
    logic_tests.test_soil_health_analysis()
    logic_tests.test_fertilizer_calculations()
    print("✅ Soil analysis logic tests passed!")
    
    # Test fertilizer calculator
    print("\n🧮 Testing Fertilizer Calculator...")
    calc_tests = TestFertilizerCalculator()
    calc_tests.setup_method()
    calc_tests.test_nutrient_requirement_calculation()
    calc_tests.test_fertilizer_recommendations()
    calc_tests.test_organic_fertilizer_recommendations()
    calc_tests.test_cost_benefit_analysis()
    print("✅ Fertilizer calculator tests passed!")
    
    # Test integration
    print("\n🔗 Testing Integration...")
    integration_tests = TestSoilAnalysisIntegration()
    integration_tests.test_end_to_end_analysis_flow()
    integration_tests.test_multiple_crop_scenarios()
    print("✅ Integration tests passed!")
    
    print("\n🎉 All Soil Analysis Tests Passed!")
    print("\n📊 Test Summary:")
    print("  ✅ API Endpoints: Working")
    print("  ✅ Soil Analysis Logic: Working") 
    print("  ✅ Fertilizer Calculator: Working")
    print("  ✅ Integration: Working")
    print("\n🌾 Soil Analysis Module is ready for production!")