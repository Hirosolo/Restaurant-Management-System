'''from google.adk.agents import Agent
from dataclasses import dataclass

APP_NAME = "restaurant_management_app"
USER_ID = "user_01"
SESSION_ID = "pipeline_session_01"
GEMINI_MODEL = "gemini-2.0-flash"

@dataclass
class UserProfile:
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    activity_level: str  # e.g., 'sedentary', 'active'
    goal: str  # 'lose_weight', 'maintain', 'gain_muscle'

def calculate_nutrition(age: int, gender: str, height_cm: float, weight_kg: float, 
                        activity_level: str, goal: str) -> dict:
    """
    Calculate personalized nutritional needs based on user parameters and specific fitness goals.
    
    Args:
        age: User's age in years
        gender: User's gender ('male' or 'female')
        height_cm: User's height in centimeters
        weight_kg: User's weight in kilograms
        activity_level: User's activity level ('sedentary', 'light', 'moderate', 'active', 'very_active')
        goal: User's fitness goal ('lose_weight', 'gain_muscle', 'improve_endurance', 
              'improve_energy', 'improve_digestion', 'improve_sleep')
              
    Returns:
        Dictionary containing personalized nutrition recommendations
    """
    # Calculate BMR using Mifflin-St Jeor Equation
    if gender.lower() == "male":
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161

    # Apply activity multiplier
    activity_factors = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    tdee = bmr * activity_factors.get(activity_level.lower(), 1.2)
    
    # Initialize nutrition plan with defaults
    nutrition_plan = {
        "kcal": 0,
        "protein_g": 0,
        "fat_g": 0,
        "carbs_g": 0,
        "fiber_g": 0,
        "tags" : []
    }
    
    # Adjust based on goal
    goal = goal.lower()
    
    if goal == "lose_weight":
        # Fat loss: Calorie deficit with higher protein
        kcal = tdee - 500
        protein = weight_kg * 2.0  # Higher protein to preserve muscle
        fat_ratio = 0.25  # Lower fat ratio
        carbs_ratio = 0.40  # Moderate carbs
        
        nutrition_plan.update({
            "kcal": round(kcal),
            "protein_g": round(protein),
            "fat_g": round((fat_ratio * kcal) / 9),
            "carbs_g": round((carbs_ratio * kcal) / 4),
            "fiber_g": 30,  # High fiber for satiety
            "tags" :["low calories","high protein", "moderate carb" , "low fat", "high fiber"]
        })
        
    elif goal == "gain_muscle":
        # Muscle gain: Calorie surplus with very high protein
        kcal = tdee + 300
        protein = weight_kg * 2.2  # Very high protein
        fat_ratio = 0.25  # Moderate fat
        carbs_ratio = 0.50  # Higher carbs for recovery
        
        nutrition_plan.update({
            "kcal": round(kcal),
            "protein_g": round(protein),
            "fat_g": round((fat_ratio * kcal) / 9),
            "carbs_g": round((carbs_ratio * kcal) / 4),
            "fiber_g": 25,
            "tags" :["low calories","high protein", "high carb" , "moderate fat", "high fiber"]
        })
        
    elif goal == "improve_endurance":
        # Endurance: Higher carbs, moderate protein
        kcal = tdee + 100  # Slight surplus
        protein = weight_kg * 1.6  # Moderate protein
        fat_ratio = 0.20  # Lower fat
        carbs_ratio = 0.60  # Higher carbs
        
        nutrition_plan.update({
            "kcal": round(kcal),
            "protein_g": round(protein),
            "fat_g": round((fat_ratio * kcal) / 9),
            "carbs_g": round((carbs_ratio * kcal) / 4),
            "fiber_g": 25,
            "tags" :["moderate calories","moderate protein", "high carb" , "low fat", "moderate fiber"]
        })
        
    elif goal == "improve_energy":
        # Energy and focus: Balanced macros with steady energy
        kcal = tdee  # Maintenance
        protein = weight_kg * 1.4
        fat_ratio = 0.30
        carbs_ratio = 0.45
        
        nutrition_plan.update({
            "kcal": round(kcal),
            "protein_g": round(protein),
            "fat_g": round((fat_ratio * kcal) / 9),
            "carbs_g": round((carbs_ratio * kcal) / 4),
            "fiber_g": 25,
            "tags" :["moderate calories","moderate protein", "moderate carb" , "moderate fat", "moderate fiber"]
        })
        
    elif goal == "improve_digestion":
        # Digestion: Focus on fiber and probiotics
        kcal = tdee  # Maintenance
        protein = weight_kg * 1.2  # Moderate protein
        fat_ratio = 0.30
        carbs_ratio = 0.50  # Higher carbs for fiber
        
        nutrition_plan.update({
            "kcal": round(kcal),
            "protein_g": round(protein),
            "fat_g": round((fat_ratio * kcal) / 9),
            "carbs_g": round((carbs_ratio * kcal) / 4),
            "fiber_g": 35, # High fiber
            "tags" :["moderate calories","moderate protein", "moderate carb" , "moderate fat", "high fiber"]
        })
        
    elif goal == "improve_sleep":
        # Sleep: Balanced with focus on sleep-promoting nutrients
        kcal = tdee  # Maintenance
        protein = weight_kg * 1.2
        fat_ratio = 0.30
        carbs_ratio = 0.50  # Moderate carbs, slightly higher in evening
        
        nutrition_plan.update({
            "kcal": round(kcal),
            "protein_g": round(protein),
            "fat_g": round((fat_ratio * kcal) / 9),
            "carbs_g": round((carbs_ratio * kcal) / 4),
            "fiber_g": 25,
            "tags" :["moderate calories","moderate protein", "moderate carb" , "low fat", "high fiber"]
        })
        
    else:  # Default to maintenance
        # Balanced maintenance diet
        kcal = tdee
        protein = weight_kg * 1.6
        fat_ratio = 0.30
        carbs_ratio = 0.45
        
        nutrition_plan.update({
            "kcal": round(kcal),
            "protein_g": round(protein),
            "fat_g": round((fat_ratio * kcal) / 9),
            "carbs_g": round((carbs_ratio * kcal) / 4),
            "fiber_g": 25,
            "tags" :["moderate calories","moderate protein", "moderate carb" , "moderate fat", "moderate fiber"]
        })
    
    return nutrition_plan

goal_recommend_agent = Agent(
    name="meal_recommendation_based_on_customer_goal",
    model=GEMINI_MODEL,
    instruction="""
You are an AI agent that assists in recommending meals based on the customer's nutritional goals.

Workflow:
1. Ask the user for their information:
   - Name 
   - Age 
   - Gender
   - Height in cm 
   - Weight in kg
   - Activity level 
   - Goal 

2. Use calculate_nutrition() with the provided information to determine their nutritional needs.

3. Recommend appropriate meals based on the calculated nutritional requirements.

Follow this process for each new user interaction.
""",
    tools=[calculate_nutrition],
    description="Agent tư vấn dinh dưỡng theo mục tiêu"
)'''

"""
nutrition_calculator.py - Module for personalized nutrition calculation and recommendations
"""
"""
goal_agent.py - Goal-based recommendation agent with meal recommendation integration
"""
from google.adk.agents import Agent
from dataclasses import dataclass
from typing import Dict, List, Any
from sub_agent.customer_agent.recommend_agent.agent import recommend_meal_by_nutritions

# Constants
GEMINI_MODEL = "gemini-2.0-flash"

@dataclass
class UserProfile:
    """Data class for storing user profile information"""
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    activity_level: str  # 'sedentary', 'light', 'moderate', 'active', 'very_active'
    goal: str  # 'lose_weight', 'maintain', 'gain_muscle', etc.
    
    def __post_init__(self):
        """Validate input data"""
        # Validate age
        if not isinstance(self.age, int) or self.age <= 0:
            raise ValueError("Age must be a positive integer")
            
        # Validate gender
        if self.gender.lower() not in ["male", "female"]:
            raise ValueError("Gender must be 'male' or 'female'")
            
        # Validate height and weight
        if self.height_cm <= 0 or self.weight_kg <= 0:
            raise ValueError("Height and weight must be positive values")
            
        # Validate activity level
        valid_activity_levels = ["sedentary", "light", "moderate", "active", "very_active"]
        if self.activity_level.lower() not in valid_activity_levels:
            raise ValueError(f"Activity level must be one of: {', '.join(valid_activity_levels)}")


def calculate_nutrition(age: int, gender: str, height_cm: float, weight_kg: float, 
                        activity_level: str, goal: str) -> Dict[str, Any]:
    """
    Calculate personalized nutritional needs based on user parameters and specific fitness goals.
    
    Args:
        age: User's age in years
        gender: User's gender ('male' or 'female')
        height_cm: User's height in centimeters
        weight_kg: User's weight in kilograms
        activity_level: User's activity level ('sedentary', 'light', 'moderate', 'active', 'very_active')
        goal: User's fitness goal ('lose_weight', 'gain_muscle', 'improve_endurance', 
              'improve_energy', 'improve_digestion', 'improve_sleep')
              
    Returns:
        Dictionary containing personalized nutrition recommendations
    """
    # Normalize inputs
    gender = gender.lower()
    activity_level = activity_level.lower()
    goal = goal.lower()
    
    # Calculate BMR using Mifflin-St Jeor Equation
    if gender == "male":
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161

    # Apply activity multiplier
    activity_factors = {
        "sedentary": 1.2,     # Little or no exercise
        "light": 1.375,       # Light exercise 1-3 days/week
        "moderate": 1.55,     # Moderate exercise 3-5 days/week
        "active": 1.725,      # Hard exercise 6-7 days/week
        "very_active": 1.9    # Very hard exercise & physical job or 2x training
    }
    
    # Get activity factor with fallback to sedentary if invalid input
    activity_factor = activity_factors.get(activity_level, 1.2)
    tdee = bmr * activity_factor  # Total Daily Energy Expenditure
    
    # Initialize nutrition plan with defaults
    nutrition_plan = {
        "kcal": 0,
        "protein_g": 0,
        "fat_g": 0,
        "carbs_g": 0,
        "fiber_g": 0,
        "tags": []
    }
    
    # Goal-specific adjustments
    goal_adjustments = {
        "lose_weight": {
            "kcal_adjustment": -500,  # Calorie deficit
            "protein_multiplier": 2.0, # Higher protein to preserve muscle
            "fat_ratio": 0.25,        # Lower fat ratio
            "carbs_ratio": 0.40,      # Moderate carbs
            "fiber_g": 30,            # High fiber for satiety
            "tags": ["low calories", "high protein", "moderate carb", "low fat", "high fiber"]
        },
        "gain_muscle": {
            "kcal_adjustment": 300,   # Calorie surplus
            "protein_multiplier": 2.2, # Very high protein
            "fat_ratio": 0.25,        # Moderate fat
            "carbs_ratio": 0.50,      # Higher carbs for recovery
            "fiber_g": 25,            # Moderate fiber
            "tags": ["high calories", "high protein", "high carb", "moderate fat", "moderate fiber"]
        },
        "improve_endurance": {
            "kcal_adjustment": 100,   # Slight surplus
            "protein_multiplier": 1.6, # Moderate protein
            "fat_ratio": 0.20,        # Lower fat
            "carbs_ratio": 0.60,      # Higher carbs
            "fiber_g": 25,            # Moderate fiber
            "tags": ["moderate calories", "moderate protein", "high carb", "low fat", "moderate fiber"]
        },
        "improve_energy": {
            "kcal_adjustment": 0,     # Maintenance
            "protein_multiplier": 1.4, # Moderate protein
            "fat_ratio": 0.30,        # Balanced fat
            "carbs_ratio": 0.45,      # Balanced carbs
            "fiber_g": 25,            # Moderate fiber
            "tags": ["moderate calories", "moderate protein", "moderate carb", "moderate fat", "moderate fiber"]
        },
        "improve_digestion": {
            "kcal_adjustment": 0,     # Maintenance
            "protein_multiplier": 1.2, # Moderate protein
            "fat_ratio": 0.30,        # Balanced fat
            "carbs_ratio": 0.50,      # Higher carbs for fiber
            "fiber_g": 35,            # High fiber
            "tags": ["moderate calories", "moderate protein", "moderate carb", "moderate fat", "high fiber"]
        },
        "improve_sleep": {
            "kcal_adjustment": 0,     # Maintenance
            "protein_multiplier": 1.2, # Moderate protein
            "fat_ratio": 0.30,        # Balanced fat
            "carbs_ratio": 0.50,      # Moderate carbs, slightly higher in evening
            "fiber_g": 25,            # Moderate fiber
            "tags": ["moderate calories", "moderate protein", "moderate carb", "moderate fat", "moderate fiber"]
        }
    }
    
    # Default to maintenance if goal not recognized
    adjustment = goal_adjustments.get(goal, {
        "kcal_adjustment": 0,         # Maintenance
        "protein_multiplier": 1.6,    # Balanced protein
        "fat_ratio": 0.30,            # Balanced fat
        "carbs_ratio": 0.45,          # Balanced carbs
        "fiber_g": 25,                # Moderate fiber
        "tags": ["moderate calories", "moderate protein", "moderate carb", "moderate fat", "moderate fiber"]
    })
    
    # Calculate nutrition plan based on adjustments
    kcal = tdee + adjustment["kcal_adjustment"]
    protein = weight_kg * adjustment["protein_multiplier"]
    fat_g = (adjustment["fat_ratio"] * kcal) / 9  # 9 calories per gram of fat
    carbs_g = (adjustment["carbs_ratio"] * kcal) / 4  # 4 calories per gram of carbs
    
    nutrition_plan.update({
        "kcal": round(kcal),
        "protein_g": round(protein),
        "fat_g": round(fat_g),
        "carbs_g": round(carbs_g),
        "fiber_g": adjustment["fiber_g"],
        "tags": adjustment["tags"]
    })
    
    # Add BMR and TDEE for reference
    nutrition_plan.update({
        "bmr": round(bmr),
        "tdee": round(tdee),
        "goal": goal
    })
    
    return nutrition_plan
def recommend_meal_by_nutritions_with_priority(nutrition_tags: List[str], important_tags: List[str]) -> Dict[str, Any]:
    """
    Recommend meals based on nutrition tags with priority consideration.
    A meal should match at least 60% of general tags and must match at least one important tag.
    
    Args:
        nutrition_tags (List[str]): All nutrition tags from the plan
        important_tags (List[str]): Priority tags that must be matched
        
    Returns:
        Dict[str, Any]: Recommended meals with details
    """
    recommended_meals = []

    for meal in MEAL_DATABASE:
        meal_tags = meal["tags"]
        matched_general_tags = set(meal_tags).intersection(set(nutrition_tags))
        matched_important_tags = set(meal_tags).intersection(set(important_tags))
        
        # Allow flexible matching: at least 60% of general tags matched
        general_match_ratio = len(matched_general_tags) / max(len(nutrition_tags), 1)
        
        # Important tag must match at least one
        if matched_important_tags and general_match_ratio >= 0.6:
            recommended_meals.append({
                "meal_name": meal["name"],
                "description": meal["description"],
                "matched_general_tags": list(matched_general_tags),
                "matched_important_tags": list(matched_important_tags)
            })
    
    if recommended_meals:
        return {
            "status": "success",
            "recommended_meals": recommended_meals
        }
    else:
        return {
            "status": "no_matches",
            "message": "No suitable meals found matching your nutrition plan and priorities."
        }


GOAL_IMPORTANT_TAGS = {
    "gain_muscle": ["high protein"],
    "lose_weight": ["low calories", "high fiber"],
    "improve_endurance": ["moderate carb", "moderate protein"],
    "general_health": ["balanced", "high fiber"],
    # Add more goals and important tags as needed
}

def recommend_based_on_plan(age: int, gender: str, height_cm: float, weight_kg: float, 
                             activity_level: str, goal: str) -> Dict[str, Any]:
    """
    Calculate nutrition plan and recommend meals based on the plan's tags.
    Allows partial matching and prioritizes important tags based on the user's goal.
    
    Args:
        age: User's age in years
        gender: User's gender ('male' or 'female')
        height_cm: User's height in centimeters
        weight_kg: User's weight in kilograms
        activity_level: User's activity level ('sedentary', 'light', 'moderate', 'active', 'very_active')
        goal: User's fitness goal ('lose_weight', 'gain_muscle', 'improve_endurance', etc.)
        
    Returns:
        Dictionary containing both nutrition plan and meal recommendations
    """
    # Step 1: Calculate the nutrition plan
    nutrition_plan = calculate_nutrition(
        age=age,
        gender=gender,
        height_cm=height_cm,
        weight_kg=weight_kg,
        activity_level=activity_level,
        goal=goal
    )    
    # Step 4: Recommend meals
    meal_recommendations = recommend_meal_by_nutritions(GOAL_IMPORTANT_TAGS.get(goal, []) )
    
    # Step 5: Return combined results
    return {
        "nutrition_plan": nutrition_plan,
        "meal_recommendations": meal_recommendations,
    }


goal_recommend_agent = Agent(
    name="meal_recommendation_based_on_customer_goal",
    model=GEMINI_MODEL,
    instruction="""
    You are a nutrition coach that provides personalized meal recommendations based on 
    individual fitness goals and body metrics.
    
    YOUR CAPABILITIES:
    1. Calculate personalized nutrition plans based on user profiles and goals
    2. Recommend restaurant meals that match nutritional requirements
    3. Provide clear explanations of nutrition concepts in user-friendly terms
    
    WORKFLOW:
    1. Collect the user's information:
       - Name (for personalized greeting)
       - Age (in years)
       - Gender (male/female) 
       - Height (in cm)
       - Weight (in kg)
       - Activity level (sedentary, light, moderate, active, very_active)
       - Fitness goal (lose_weight, gain_muscle, improve_endurance, improve_energy, 
         improve_digestion, improve_sleep)
    
    2. Use the recommend_based_on_plan() function to:
       - Calculate personalized nutrition needs
       - Find restaurant meals that match the nutritional requirements
    
    3. Present the results to the user:
       - Explain the nutrition plan: daily calorie target, macronutrient breakdown
       - Present recommended meals with their nutritional information
       - Connect how each recommendation supports their goal
       - Provide practical tips for implementing the plan
    
    IMPORTANT:
    - Be encouraging and positive in your communication
    - Explain technical nutrition terms in simple language
    - Address the person by name when providing recommendations
    - Acknowledge that nutrition is personal and may need adjustments
    - Recommend specific meals from our restaurant's menu based on nutritional needs
    """,
    tools=[calculate_nutrition, recommend_based_on_plan],
    description="Personalized nutrition coach for goal-based meal recommendations"
)