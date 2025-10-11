import requests
import sys
import json
from datetime import datetime

class PortfolioAPITester:
    def __init__(self, base_url="https://smartportal-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_ids = {}  # Store created IDs for cleanup

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and 'id' in response_data:
                        print(f"   Created ID: {response_data['id']}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_profile_apis(self):
        """Test Profile APIs"""
        print("\n" + "="*50)
        print("TESTING PROFILE APIs")
        print("="*50)
        
        # Test GET profile
        success, profile_data = self.run_test("Get Profile", "GET", "api/profile", 200)
        
        if success:
            # Test PUT profile (update)
            updated_profile = {
                "name": "Ibrahim El Khalil - Test Updated",
                "title": "Senior Software Engineer & AI Specialist - Updated",
                "location": "Dubai, UAE - Updated",
                "summary": "Test updated summary for profile",
                "image": "https://example.com/test-image.jpg",
                "linkedin": "https://linkedin.com/in/test",
                "github": "https://github.com/test",
                "email": "test@example.com"
            }
            self.run_test("Update Profile", "PUT", "api/profile", 200, updated_profile)

    def test_experience_apis(self):
        """Test Experience APIs"""
        print("\n" + "="*50)
        print("TESTING EXPERIENCE APIs")
        print("="*50)
        
        # Test GET experiences
        success, experiences = self.run_test("Get Experiences", "GET", "api/experience", 200)
        
        # Test POST experience (create)
        new_experience = {
            "role": "Test Position",
            "company": "Test Company",
            "period": "2024 - Present",
            "location": "Dubai, UAE",
            "description": ["Test experience description", "Another responsibility"],
            "projects": [{"name": "Test Project", "description": "Test project description"}]
        }
        success, created_exp = self.run_test("Create Experience", "POST", "api/experience", 200, new_experience)
        
        if success and 'id' in created_exp:
            exp_id = created_exp['id']
            self.created_ids['experience'] = exp_id
            
            # Test PUT experience (update)
            updated_experience = {
                "role": "Test Position Updated",
                "company": "Test Company Updated",
                "period": "2024 - Present",
                "location": "Dubai, UAE",
                "description": ["Updated test experience description", "Updated responsibility"],
                "projects": [{"name": "Updated Test Project", "description": "Updated project description"}]
            }
            self.run_test(f"Update Experience {exp_id}", "PUT", f"api/experience/{exp_id}", 200, updated_experience)
            
            # Test DELETE experience
            self.run_test(f"Delete Experience {exp_id}", "DELETE", f"api/experience/{exp_id}", 200)

    def test_education_apis(self):
        """Test Education APIs"""
        print("\n" + "="*50)
        print("TESTING EDUCATION APIs")
        print("="*50)
        
        # Test GET education
        success, education = self.run_test("Get Education", "GET", "api/education", 200)
        
        # Test POST education (create)
        new_education = {
            "degree": "Test Degree",
            "institution": "Test University",
            "period": "2020-2024",
            "location": "Dubai, UAE",
            "field": "Computer Science",
            "details": ["Test education detail 1", "Test education detail 2"]
        }
        success, created_edu = self.run_test("Create Education", "POST", "api/education", 200, new_education)
        
        if success and 'id' in created_edu:
            edu_id = created_edu['id']
            self.created_ids['education'] = edu_id
            
            # Test PUT education (update)
            updated_education = {
                "degree": "Test Degree Updated",
                "institution": "Test University Updated",
                "period": "2020-2024",
                "location": "Dubai, UAE",
                "field": "Computer Science & AI",
                "details": ["Updated test education detail 1", "Updated test education detail 2"]
            }
            self.run_test(f"Update Education {edu_id}", "PUT", f"api/education/{edu_id}", 200, updated_education)
            
            # Test DELETE education
            self.run_test(f"Delete Education {edu_id}", "DELETE", f"api/education/{edu_id}", 200)

    def test_skills_apis(self):
        """Test Skills APIs"""
        print("\n" + "="*50)
        print("TESTING SKILLS APIs")
        print("="*50)
        
        # Test GET skills
        success, skills = self.run_test("Get Skills", "GET", "api/skills", 200)
        
        # Test POST skills (create)
        new_skill_category = {
            "category": "Test Category",
            "skills": ["Test Skill 1", "Test Skill 2", "Test Skill 3"]
        }
        success, created_skill = self.run_test("Create Skill Category", "POST", "api/skills", 200, new_skill_category)
        
        if success and 'id' in created_skill:
            skill_id = created_skill['id']
            self.created_ids['skills'] = skill_id
            
            # Test PUT skills (update)
            updated_skill_category = {
                "category": "Test Category Updated",
                "skills": ["Test Skill 1 Updated", "Test Skill 2 Updated", "Test Skill 4"]
            }
            self.run_test(f"Update Skill Category {skill_id}", "PUT", f"api/skills/{skill_id}", 200, updated_skill_category)
            
            # Test DELETE skills
            self.run_test(f"Delete Skill Category {skill_id}", "DELETE", f"api/skills/{skill_id}", 200)

    def test_analytics_apis(self):
        """Test Analytics APIs"""
        print("\n" + "="*50)
        print("TESTING ANALYTICS APIs")
        print("="*50)
        
        # Test GET analytics
        success, analytics = self.run_test("Get Analytics", "GET", "api/analytics", 200)
        
        # Test POST analytics tracking
        events = ['visit', 'ai_chat', 'skills_view']
        for event in events:
            self.run_test(f"Track Event: {event}", "POST", "api/analytics/track", 200, {"event_type": event})

    def test_appointments_apis(self):
        """Test Appointments APIs"""
        print("\n" + "="*50)
        print("TESTING APPOINTMENTS APIs")
        print("="*50)
        
        # Test GET appointments
        success, appointments = self.run_test("Get Appointments", "GET", "api/appointments", 200)
        
        # Test POST appointment (create)
        new_appointment = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+1234567890",
            "date": "2024-12-25",
            "time": "14:00",
            "message": "Test appointment message"
        }
        success, created_apt = self.run_test("Create Appointment", "POST", "api/appointments", 200, new_appointment)
        
        if success and 'id' in created_apt:
            apt_id = created_apt['id']
            self.created_ids['appointment'] = apt_id
            print(f"   Created appointment with ID: {apt_id}")

    def test_additional_endpoints(self):
        """Test additional endpoints"""
        print("\n" + "="*50)
        print("TESTING ADDITIONAL ENDPOINTS")
        print("="*50)
        
        # Test ventures
        self.run_test("Get Ventures", "GET", "api/ventures", 200)
        
        # Test achievements
        self.run_test("Get Achievements", "GET", "api/achievements", 200)
        
        # Test whitepapers
        self.run_test("Get White Papers", "GET", "api/whitepapers", 200)

def main():
    print("🚀 Starting Portfolio API Testing...")
    print(f"Testing against: https://smartportal-2.preview.emergentagent.com")
    
    tester = PortfolioAPITester()
    
    # Run all tests
    tester.test_health_check()
    tester.test_profile_apis()
    tester.test_experience_apis()
    tester.test_education_apis()
    tester.test_skills_apis()
    tester.test_analytics_apis()
    tester.test_appointments_apis()
    tester.test_additional_endpoints()
    
    # Print final results
    print("\n" + "="*60)
    print("📊 FINAL TEST RESULTS")
    print("="*60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.created_ids:
        print(f"\nCreated Test Data IDs: {tester.created_ids}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())