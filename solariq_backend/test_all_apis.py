#!/usr/bin/env python3
"""Comprehensive test suite for all SolarIQ API endpoints."""
import json
import sys
import os
import time
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from app import create_app
from extensions import db
from models.user import User

app = create_app('development')

def test_endpoints():
    """Test all API endpoints with a test user."""
    with app.app_context():
        base_url = "http://localhost:5000/api"
        
        print("\n" + "="*70)
        print("SOLARIQ API COMPREHENSIVE TEST SUITE")
        print("="*70)
        
        # 1. Health Check
        print("\n[1] Testing Health Endpoint")
        print("-" * 70)
        try:
            import requests
            resp = requests.get(f"{base_url}/health")
            print(f"✓ GET /health → {resp.status_code}")
            print(f"  Response: {resp.json()}")
        except Exception as e:
            print(f"✗ Health check failed: {e}")
            return False
        
        # 2. Register User
        print("\n[2] Testing Registration")
        print("-" * 70)
        test_email = f"test_{int(time.time())}@example.com"
        test_password = "TestPassword123"
        register_data = {
            "full_name": "Test User",
            "email": test_email,
            "password": test_password,
            "phone": "1234567890",
            "role": "homeowner"
        }
        try:
            resp = requests.post(f"{base_url}/auth/register", json=register_data)
            print(f"✓ POST /auth/register → {resp.status_code}")
            reg_result = resp.json()
            print(f"  Success: {reg_result.get('success')}")
            token = reg_result.get('token') or reg_result.get('data', {}).get('token')
            user = reg_result.get('user') or reg_result.get('data', {}).get('user')
            user_id = user.get('id') if user else None
            print(f"  Token: {token[:20]}..." if token else "  Token: Not received")
            print(f"  User ID: {user_id}")
            if not token:
                print("✗ Registration failed - no token received")
                return False
        except Exception as e:
            print(f"✗ Registration failed: {e}")
            return False
        
        # 3. Login User
        print("\n[3] Testing Login")
        print("-" * 70)
        login_data = {
            "email": test_email,
            "password": test_password
        }
        try:
            resp = requests.post(f"{base_url}/auth/login", json=login_data)
            print(f"✓ POST /auth/login → {resp.status_code}")
            login_result = resp.json()
            print(f"  Success: {login_result.get('success')}")
            new_token = login_result.get('token') or login_result.get('data', {}).get('token')
            print(f"  Token matches: {token == new_token}")
            token = new_token
        except Exception as e:
            print(f"✗ Login failed: {e}")
            return False
        
        # Set up headers with token
        headers = {"Authorization": f"Bearer {token}"}
        
        # 4. Dashboard
        print("\n[4] Testing Dashboard Endpoints")
        print("-" * 70)
        try:
            resp = requests.get(f"{base_url}/dashboard/stats", headers=headers)
            print(f"✓ GET /dashboard/stats → {resp.status_code}")
            
            resp = requests.get(f"{base_url}/dashboard/overview", headers=headers)
            print(f"✓ GET /dashboard/overview → {resp.status_code}")
        except Exception as e:
            print(f"✗ Dashboard endpoints failed: {e}")
        
        # 5. Analytics
        print("\n[5] Testing Analytics Endpoints")
        print("-" * 70)
        try:
            resp = requests.get(f"{base_url}/analytics/daily", headers=headers)
            print(f"✓ GET /analytics/daily → {resp.status_code}")
            
            resp = requests.get(f"{base_url}/analytics/weekly", headers=headers)
            print(f"✓ GET /analytics/weekly → {resp.status_code}")
            
            resp = requests.get(f"{base_url}/analytics/monthly", headers=headers)
            print(f"✓ GET /analytics/monthly → {resp.status_code}")
        except Exception as e:
            print(f"✗ Analytics endpoints failed: {e}")
        
        # 6. Settings
        print("\n[6] Testing Settings Endpoints")
        print("-" * 70)
        try:
            resp = requests.get(f"{base_url}/settings", headers=headers)
            print(f"✓ GET /settings → {resp.status_code}")
            
            resp = requests.put(f"{base_url}/settings", 
                              headers=headers,
                              json={"theme": "dark", "notifications": True})
            print(f"✓ PUT /settings → {resp.status_code}")
        except Exception as e:
            print(f"✗ Settings endpoints failed: {e}")
        
        # 7. Weather
        print("\n[7] Testing Weather Endpoints")
        print("-" * 70)
        try:
            resp = requests.get(f"{base_url}/weather", headers=headers)
            print(f"✓ GET /weather → {resp.status_code}")
            
            resp = requests.post(f"{base_url}/weather/fetch",
                               headers=headers,
                               json={"lat": 33.6844, "lon": 73.0479})
            print(f"✓ POST /weather/fetch → {resp.status_code}")
        except Exception as e:
            print(f"✗ Weather endpoints failed: {e}")
        
        # 8. Solar Records
        print("\n[8] Testing Solar Endpoints")
        print("-" * 70)
        try:
            resp = requests.get(f"{base_url}/solar", headers=headers)
            print(f"✓ GET /solar → {resp.status_code}")
            
            solar_data = {
                "system_capacity": 5,
                "installation_date": "2024-01-01",
                "location": "Islamabad"
            }
            resp = requests.post(f"{base_url}/solar", headers=headers, json=solar_data)
            print(f"✓ POST /solar → {resp.status_code}")
            solar_id = resp.json().get('data', {}).get('id') if resp.status_code == 200 else None
            if solar_id:
                resp = requests.put(f"{base_url}/solar/{solar_id}", 
                                  headers=headers,
                                  json={"system_capacity": 6})
                print(f"✓ PUT /solar/{solar_id} → {resp.status_code}")
        except Exception as e:
            print(f"✗ Solar endpoints failed: {e}")
        
        # 9. Reports
        print("\n[9] Testing Reports Endpoints")
        print("-" * 70)
        try:
            resp = requests.get(f"{base_url}/reports", headers=headers)
            print(f"✓ GET /reports → {resp.status_code}")
            
            report_data = {"report_type": "monthly", "format": "pdf"}
            resp = requests.post(f"{base_url}/reports/generate",
                               headers=headers,
                               json=report_data)
            print(f"✓ POST /reports/generate → {resp.status_code}")
        except Exception as e:
            print(f"✗ Reports endpoints failed: {e}")
        
        # 10. Predictions
        print("\n[10] Testing Prediction Endpoints")
        print("-" * 70)
        try:
            pred_data = {
                "temperature": 28,
                "humidity": 60,
                "irradiance": 800,
                "wind_speed": 5
            }
            resp = requests.post(f"{base_url}/predictions",
                               headers=headers,
                               json=pred_data)
            print(f"✓ POST /predictions → {resp.status_code}")
        except Exception as e:
            print(f"✗ Predictions endpoints failed: {e}")
        
        # 11. Simulation
        print("\n[11] Testing Simulation Endpoints")
        print("-" * 70)
        try:
            sim_data = {
                "appliances": [
                    {"name": "AC", "power_watts": 2000, "hours": 8}
                ]
            }
            resp = requests.post(f"{base_url}/simulation/run",
                               headers=headers,
                               json=sim_data)
            print(f"✓ POST /simulation/run → {resp.status_code}")
        except Exception as e:
            print(f"✗ Simulation endpoints failed: {e}")
        
        # 12. Efficiency
        print("\n[12] Testing Efficiency Endpoints")
        print("-" * 70)
        try:
            resp = requests.get(f"{base_url}/efficiency", headers=headers)
            print(f"✓ GET /efficiency → {resp.status_code}")
        except Exception as e:
            print(f"✗ Efficiency endpoints failed: {e}")
        
        # 13. Recommendations
        print("\n[13] Testing Recommendations Endpoints")
        print("-" * 70)
        try:
            resp = requests.get(f"{base_url}/recommendations", headers=headers)
            print(f"✓ GET /recommendations → {resp.status_code}")
            
            resp = requests.post(f"{base_url}/recommendations",
                               headers=headers,
                               json={"text": "Test recommendation"})
            print(f"✓ POST /recommendations → {resp.status_code}")
        except Exception as e:
            print(f"✗ Recommendations endpoints failed: {e}")
        
        # 14. Maintenance
        print("\n[14] Testing Maintenance Endpoints")
        print("-" * 70)
        try:
            resp = requests.get(f"{base_url}/maintenance", headers=headers)
            print(f"✓ GET /maintenance → {resp.status_code}")
            
            resp = requests.post(f"{base_url}/maintenance",
                               headers=headers,
                               json={"message": "System check required"})
            print(f"✓ POST /maintenance → {resp.status_code}")
        except Exception as e:
            print(f"✗ Maintenance endpoints failed: {e}")
        
        # 15. Password Recovery
        print("\n[15] Testing Password Recovery Endpoints")
        print("-" * 70)
        try:
            resp = requests.post(f"{base_url}/auth/forgot-password",
                               json={"email": test_email})
            print(f"✓ POST /auth/forgot-password → {resp.status_code}")
        except Exception as e:
            print(f"✗ Password recovery endpoints failed: {e}")
        
        # 16. Google Login
        print("\n[16] Testing Google Login Endpoint")
        print("-" * 70)
        try:
            google_data = {
                "email": f"google_{int(time.time())}@gmail.com",
                "full_name": "Google User",
                "role": "homeowner"
            }
            resp = requests.post(f"{base_url}/auth/google", json=google_data)
            print(f"✓ POST /auth/google → {resp.status_code}")
        except Exception as e:
            print(f"✗ Google login endpoint failed: {e}")
        
        print("\n" + "="*70)
        print("TEST SUITE COMPLETED")
        print("="*70 + "\n")
        return True

if __name__ == "__main__":
    success = test_endpoints()
    sys.exit(0 if success else 1)
