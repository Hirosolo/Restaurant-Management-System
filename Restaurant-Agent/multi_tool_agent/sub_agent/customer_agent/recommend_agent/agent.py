from google.adk.agents import Agent
from helper_function import fetch_data as fd
from helper_function import nutrition_determination as nd
import re
import operator
# Constants
GEMINI_MODEL = "gemini-2.0-flash"

def check_meal_availability(meal_name: str):
    MEAL_DB = fd.fetch_meals_from_mysql()
    matches = []
    
    for m in MEAL_DB:
        if meal_name.lower() in m["name"].lower():
            matches.append(m)
    
    if not matches:
        return False  # No such meal found
    
    meal_id = matches[0]["id"]
    ingredients = fd.fetch_meals_information_by_recipe_id(meal_id)

    for item in ingredients:
        ing_id = item["id"]
        required_weight = item["weight"]
        
        current_stock_list = fd.fetch_current_stock(ing_id)
        
        if not current_stock_list:
            return False  # Ingredient not found in stock
        
        current_quantity = current_stock_list[0]["quantity"]  # Get quantity from first (and only) dict
        
        if current_quantity < required_weight:
            return False  # Not enough stock for this ingredient

    return True  # All ingredients are available



def recommend_meal_by_nutritions(nutrition_attributes: list[str]) -> dict:
    """
    Recommend meals matching nutrition attributes, robust against imperfect English.
    
    Args:
        nutrition_attributes: List of strings like ["high protein", "more 500 calories"]
    
    Returns:
        Dictionary with status, report and matching meals
    """
    MEAL_DB = fd.fetch_meals_from_mysql()

    parsed_attributes = []
    for attr in nutrition_attributes:
        attr = attr.lower().strip()

        # Try to detect numeric comparisons
        match = re.match(r"(more|less|over|under|exactly)?\s*(\d+)\s*([a-z]+)", attr)
        if match:
            comparison_word_raw, value, nutrient = match.groups()
            value = int(value)

            # Normalize comparison words
            if comparison_word_raw in ["more", "over"]:
                comparison_word = "more"
            elif comparison_word_raw in ["less", "under"]:
                comparison_word = "less"
            elif comparison_word_raw == "exactly":
                comparison_word = "exactly"
            else:
                comparison_word = None  # if no word, treat separately later

            if comparison_word:
                parsed_attributes.append(("numeric_check", nutrient, comparison_word, value))
                continue

        # Fallback to "high protein" style
        tokens = attr.split()
        if len(tokens) == 2:
            level, nutrient = tokens
            parsed_attributes.append(("level_check", nutrient, level))
    
    determination_functions = {
        "protein": nd.protein_determination,
        "calories": nd.calories_determination,
        "fat": nd.fat_determination,
        "fiber": nd.fiber_determination,
        "carbohydrate": nd.carbohydrate_determination
    }
    
    comparison_operators = {
        "more": operator.gt,
        "less": operator.lt,
        "exactly": operator.eq
    }
    
    sets_of_meals = []
    for parsed in parsed_attributes:
        if parsed[0] == "level_check":
            _, nutrient, expected_level = parsed
            if nutrient not in determination_functions:
                continue
            func = determination_functions[nutrient]
            matching_meals = {
                meal["name"]: meal
                for meal in MEAL_DB
                if func(meal["nutrition"][nutrient]) == expected_level and check_meal_availability(meal["name"])
            }
            sets_of_meals.append(matching_meals)
        
        elif parsed[0] == "numeric_check":
            _, nutrient, comparison_word, value = parsed
            if nutrient not in ["protein", "calories", "fat", "fiber", "carbohydrate"]:
                continue
            comp_func = comparison_operators[comparison_word]
            matching_meals = {
                meal["name"]: meal
                for meal in MEAL_DB
                if comp_func(meal["nutrition"][nutrient], value) and check_meal_availability(meal["name"])
            }
            sets_of_meals.append(matching_meals)
    
    if not sets_of_meals:
        return {
            "status": "error", 
            "error_message": "No valid nutrition attributes provided."
        }
    
    common_keys = set(sets_of_meals[0].keys())
    for meal_set in sets_of_meals[1:]:
        common_keys &= set(meal_set.keys())
    
    final_matches = [sets_of_meals[0][name] for name in common_keys]
    
    if final_matches:
        return {
            "status": "success",
            "report": "Here are some meal recommendations:\n" + "\n".join(
                f"{m['name']} — {m['nutrition']['calories']} cal, {m['nutrition']['protein']}g protein, "
                f"{m['nutrition']['fiber']}g fiber, {m['nutrition']['fat']}g fat, {m['nutrition']['carbohydrate']}g carbs"
                for m in final_matches),
            "matches": final_matches
        }
    
    return {
        "status": "error", 
        "error_message": "No matching meals found for your nutrition criteria."
    }


def recommend_meal_by_ingredients(ingredient_name: str) -> dict:
    """
    Recommend meals containing the specified ingredient.
    
    Args:
        ingredient_name: Name of ingredient to search for
        
    Returns:
        Dictionary with status, report and matching meals
    """
    # Fetch ingredient data
    INGREDIENT_DB = fd.fetch_ingredients_from_mysql()
    
    # Find ingredient ID by case-insensitive partial match
    ingredient_id = 0
    for ingredient in INGREDIENT_DB:
        if ingredient_name.lower() in ingredient["name"].lower():
            ingredient_id = ingredient["id"]
            break
            
    # Handle ingredient not found
    if ingredient_id == 0:
        return {
            "status": "fail",
            "report": f"No recipes found using '{ingredient_name}'. Please try another ingredient."
        }
        
    # Fetch meals containing the ingredient
    recipe_list = fd.fetch_meals_by_ingredient_id(ingredient_id)
    
    # Filter meals by availability
    available_meals = [meal for meal in recipe_list if check_meal_availability(meal["name"])]
    
    if not available_meals:
        return {
            "status": "success",
            "report": f"No available meals found containing '{ingredient_name}'.",
            "matches": []
        }
    
    return {
        "status": "success",
        "report": f"Here are meals with '{ingredient_name}':\n" + "\n".join(
            f"{m['name']}" for m in available_meals),
        "matches": available_meals
    }



# === Agent Definitions ===
nutrition_recommend_agent = Agent(
    name="meal_recommendation_based_on_nutrition_agent",
    model=GEMINI_MODEL,
instruction = """
You are a nutrition-based meal recommendation assistant that helps users find meals
matching specific nutritional needs.

You can recommend meals based on nutritional attributes like:
- protein levels (high/moderate/low or specific values)
- calorie content (high/moderate/low or specific values)
- fat content (high/moderate/low or specific values)
- fiber content (high/moderate/low or specific values)
- carbohydrate content (high/moderate/low or specific values)

Users can express their preferences in two ways:
1. By nutrition level:
   - Example: "high protein", "low fat", "moderate calories"
2. By numeric condition:
   - Example: "more 300 calories", "less 20 fat", "exactly 350 calories"

You can also combine multiple criteria to find the best meal match.
If users do not specify clearly, kindly ask them to clarify their desired nutrition goals.
""",
    tools=[recommend_meal_by_nutritions],
    description="Meal recommendation by nutrition"
)

ingredient_recommend_agent = Agent(
    name="meal_recommendation_based_on_ingredient_agent",
    model=GEMINI_MODEL,
    instruction="""
    You are an ingredient-based meal recommendation assistant that helps users find
    meals containing specific ingredients.
    
    When recommending food based on ingredients:
    - Be flexible with ingredient names (recognize synonyms, alternate names, and plural forms)
    - Handle partial matches of ingredient names
    - Suggest alternatives if no exact match is found
    - Highlight key nutritional information for recommended meals when available
    
    For example, if a user asks for "tomatoes", also recognize "tomato", "cherry tomatoes",
    or "roma tomatoes" as valid inputs.
    """,
    tools=[recommend_meal_by_ingredients],
    description="Meal recommendation by ingredient"
)

recommend_root_agent = Agent(
    name="meal_recommendation_agent",
    model=GEMINI_MODEL,
    instruction = """
You are a comprehensive meal recommendation assistant that suggests meals based on:

1. Nutritional content — when users specify preferences like "high protein", "low fat", "moderate carbs", etc.

2. Ingredients — when users request meals containing specific ingredients.

Guidelines:
- If users mention nutrition levels (high/moderate/low) combined with nutrients, use the nutrition-based recommendation.
- If users mention specific ingredients, use the ingredient-based recommendation.
- If the user's request is unclear, politely ask clarifying questions to understand their preference.
- Always check ingredient stock: if an ingredient is unavailable or insufficient, inform the customer clearly.
- When recommending, briefly highlight the nutritional advantages of each meal you suggest.
"""
,
    sub_agents=[nutrition_recommend_agent, ingredient_recommend_agent],
    description="Meal recommendation coordinator"
)