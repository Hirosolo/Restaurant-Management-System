from google.adk.agents import Agent
from google.adk.agents.llm_agent import LlmAgent
from google.genai import types
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from dataclasses import dataclass
from typing import List
import ast
from helper_function import fetch_data as fd
import mysql.connector

APP_NAME = "restaurant_management_app"
USER_ID = "user_01"
SESSION_ID = "pipeline_session_01"
GEMINI_MODEL = "gemini-2.0-flash"



# === Mock Meal Database ===
MEAL_DB = fd.fetch_meals_from_mysql()

place_order_request_agent = Agent(
    name="CustomerInfoAgent",
    model=GEMINI_MODEL,
    instruction="""
You are a helpful agent that collects customer information for a meal order.
Follow these steps strictly:
1. Ask for service Type (Delivery or Pickup), Customer name, Phone Number
2. Then based on service_type:
    - If Pickup: set ship_distance = 0, delivery_charge = 0, and skip asking for address.
    - If Delivery: ask for the address. Simulate the delivery distance as a number between 1 to 10.
        - If ship_distance > 5, set delivery_charge = 10
        - Otherwise, set delivery_charge = 0

Return a Python dictionary **as a string** in the exact format below:

{
    "customer_name": "string",
    "phone_number": "string",
    "address": "string or empty if dine-in/pickup",
    "service_type": "string",
    "ship_distance": float,
    "delivery_charge": float,
}
""",
    output_key="customer_info",
    description="Collect customer details"
)

place_order_agent = Agent(
    name="OrderMealAgent",
    model=GEMINI_MODEL,
    instruction="""
You are helping the customer place a meal order.

1. Ask which meals they want and the quantity for each.
2. If they only mention meals, always ask "How many?"
3. Use customer information from 'customer_info'.
Return a Python dictionary **as a string** in this format:

{
    "customer_name": "...",
    "phone_number": "...",
    "address": "...",
    "service_type": "...",
    "ship_distance": ...,
    "delivery_charge": ...,
    "items": [{"meal_name": "...", "quantity": ...}, ...]
}
""",
    output_key="order_request",
    description="Collect meal order from customer"
)

payment_method_agent = Agent(
    name="PaymentMethodAgent",
    model=GEMINI_MODEL,
    instruction="""
You are a helpful agent assisting with finalizing the meal order.
After get order details from 'order_request' by place_order_agent, follow these steps:
1. Ask the customer to choose their payment method (Cash, Card, or Online Payment).
2. If they select "Online Payment", show the following transfer message:
    "Please transfer to 123-456-789 (Demo Bank)."
Append the selected `payment_method` to the existing order data.
Also add:
- `"sale_status": "Pending"`

Return the updated order as a Python dictionary (as a string), like this:

{
    "customer_name": "...",
    "phone_number": "...",
    "address": "...",
    "service_type": "...",
    "ship_distance": ...,
    "delivery_charge": ...,
    "payment_method": "string",
    "sale_status": "Pending",
    "items": [{"meal_name": "...", "quantity": ...}, ...]
}
""",
    output_key="complete_order",
    description="Finalize order with payment method"
)

# === Pipeline Agent ===
place_order_root_agent = Agent(
    name="place_order_agent",
    model=GEMINI_MODEL,
    sub_agents=[place_order_request_agent, place_order_agent, payment_method_agent],
    instruction="""
You are a helpful agent who first gathers customer information. 
Ask until they provide full information. If and only if the customer information is fulfilled, 
execute place_order_agent. After place_order_agent completes, start the payment agent.
Ensure all agents are used in sequence.
"""
)


# === MySQL Insertion Logic ===
def insert_order_to_db(order: dict):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Thuannguyen@1806",
        database="restaurant_db"
    )
    cursor = conn.cursor()

    phone_number = order["phone_number"]

    # Check if customer exists
    cursor.execute("SELECT cus_id FROM customer WHERE phone = %s", (phone_number,))
    result = cursor.fetchone()

    if result:
        customer_id = result[0]
    else:
        cursor.execute(
            "INSERT INTO customer (name, phone, address) VALUES (%s, %s, %s)",
            (order["customer_name"], phone_number, order["address"])
        )
        customer_id = cursor.lastrowid

    total_amount = 0.0
    order_items = []

    for item in order["items"]:
        for meal in MEAL_DB:
            if item["meal_name"].lower() == meal["name"].lower():
                meal_id = meal["id"]
                price = meal["price"]
                quantity = item["quantity"]
                item_total = price * quantity
                total_amount += item_total
                order_items.append((meal_id, quantity))
                break

    cursor.execute("""
        INSERT INTO sale(
            total_amount, service_type, address, ship_distance, delivery_charge, 
            payment_method, sale_status, customer_id
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        total_amount,
        order["service_type"],
        order["address"],
        order["ship_distance"],
        order["delivery_charge"],
        order["payment_method"],
        order["sale_status"],
        customer_id
    ))
    sale_id = cursor.lastrowid

    for meal_id, quantity in order_items:
        cursor.execute("""
            INSERT INTO order_details (sale_id, recipe_id, amount)
            VALUES (%s, %s, %s)
        """, (sale_id, meal_id, quantity))

    conn.commit()
    cursor.close()
    conn.close()

    return sale_id

# === Session & Runner ===
order_session_service = InMemorySessionService()
order_session_service.create_session(
    app_name=APP_NAME,
    user_id=USER_ID,
    session_id="place_order_session"
)

order_runner = Runner(agent=place_order_root_agent, app_name=APP_NAME, session_service=order_session_service)
def take_order_from_customer(query: str):
    content = types.Content(role="user", parts=[types.Part(text=query)])
    events = order_runner.run(user_id=USER_ID, session_id="place_order_session", new_message=content)
    final_text = None

    for event in events:
        if event.is_final_response():
            final_text = event.content.parts[0].text
            print("Order Response:\n", final_text)

    if final_text:
        try:
            order_data = ast.literal_eval(final_text)
            if order_data.get("confirmed", False):
                order_id = insert_order_to_db(order_data)
                print(f"\n✅ Order saved to database with ID {order_id}")
            else:
                print("\n⚠️ Customer did not confirm the order. Not saving.")
        except Exception as e:
            print("\n❌ Failed to parse/save order:", e)

if __name__ == "__main__":
    print("🧾 Welcome to the Restaurant Ordering System")
    print("Type 'exit' anytime to quit.\n")

    while True:
        user_input = input("👤 You: ")
        if user_input.strip().lower() == "exit":
            print("👋 Goodbye!")
            break
        take_order_from_customer(user_input)
