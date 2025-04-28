from google.adk.agents import Agent
from helper_function import fetch_data as fd

# ✅ Define the function for meal lookup
def lookup_meal_information(meal_name: str):
    MEAL_DB = fd.fetch_meals_from_mysql()
    matches = [m for m in MEAL_DB if meal_name.lower() in m["name"].lower()]

    if matches:
        meal_id = matches[0]["id"]
        ingredients = fd.fetch_meals_information_by_recipe_id(meal_id)
        return {
            "status": "success",
            "report": "Here are the meal's ingredients:\n" + "\n".join(
                f"{i['name']} - {i['weight']} {i['unit']}" for i in ingredients
            ),
            "matches": matches
        }
    
    return {
        "status": "error",
        "error_message": "No matching meals found."
    }


lookup_root_agent = Agent(
    name="meal_lookup_agent",
    model="gemini-2.0-flash",
    instruction="""
You are an AI agent assisting customers with meal information from the restaurant.

Your capabilities include:
- Providing a list of available meals when customers ask.
- Looking up detailed information about a specific meal, including its description, ingredients, and portion size.
- Explaining the nutritional information of a meal if requested (calories, protein, fat, carbs, etc.).
Use the tool 'lookup_meal_information' to fetch meal details from the restaurant's database.
Always respond clearly, politely, and offer further help if the customer needs more information.
""",
    tools=[lookup_meal_information],
    description="Agent for looking up meal information."
)
