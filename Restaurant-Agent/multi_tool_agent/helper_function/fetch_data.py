import mysql.connector


# === Database Fetch Functions ===
def fetch_meals_from_mysql():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Thuannguyen@1806",
        database="restaurant_db"
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT r.rcp_id, r.rcp_name, r.calories, r.protein, r.fat, r.carbohydrate, r.fiber, r.cost, r.price
        FROM recipe r
    """)
    recipes = cursor.fetchall()
    cursor.close()
    conn.close()

    return [{
        "id": r["rcp_id"],
        "name": r["rcp_name"],
        "nutrition": {
            "calories": r["calories"],
            "protein": r["protein"],
            "fat": r["fat"],
            "carbohydrate": r["carbohydrate"],
            "fiber": r["fiber"] 
        },
        "cost" : r["cost"],
        "price" : r["price"]
    } for r in recipes]
def fetch_ingredients_from_mysql():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Thuannguyen@1806",
        database="restaurant_db"
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT i.ing_id, i.ing_name, i.quantity, i.unit, i.cost_per_unit, i.expiration_duration, i.minimum_threshold
        FROM ingredient i
    """)
    ingredients = cursor.fetchall()
    cursor.close()
    conn.close()

    return [{
        "id": i["ing_id"],
        "name": i["ing_name"],
        "quantity": i["quantity"],
        "unit": i["unit"],
        "cost" : i["cost_per_unit"],
        "expiration_duration": i["expiration_duration"],
        "minimum_threshold" : i["minimum_threshold"]
    } for i in ingredients]
def fetch_meals_information_by_recipe_id(rcp_id: int):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Thuannguyen@1806",
        database="restaurant_db"
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT i.ing_id,i.ing_name, i.unit, rd.weight
        FROM recipe_detail rd
        JOIN ingredient i ON rd.ing_id = i.ing_id
        WHERE rd.rcp_id = %s
    """, (rcp_id,))
    result = cursor.fetchall()
    cursor.close()
    conn.close()

    return [{
        "id": i["ing_id"],
        "name": i["ing_name"],
        "weight": i["weight"],
        "unit": i["unit"]
    } for i in result]

def fetch_meals_by_ingredient_id(ing_id: int):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Thuannguyen@1806",
        database="restaurant_db"
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT r.rcp_id, r.rcp_name
        FROM recipe r
        JOIN recipe_detail rd ON rd.rcp_id = r.rcp_id
        WHERE rd.ing_id = %s
    """, (ing_id,))
    result = cursor.fetchall()
    cursor.close()
    conn.close()

    return [{
        "id": i["rcp_id"],
        "name": i["rcp_name"]
    } for i in result]

def fetch_current_stock(ing_id:int):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Thuannguyen@1806",
        database="restaurant_db"
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT i.ing_id, i.ing_name, i.quantity, i.unit, i.cost_per_unit, i.expiration_duration, i.minimum_threshold
        FROM ingredient i WHERE i.ing_id =%s
    """,(ing_id,))
    ingredients = cursor.fetchall()
    cursor.close()
    conn.close()

    return [{
        "id": i["ing_id"],
        "name": i["ing_name"],
        "quantity": i["quantity"],
        "unit": i["unit"],
    } for i in ingredients]