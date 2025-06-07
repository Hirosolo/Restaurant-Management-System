export const fetchIngredients = async () => {
  const token = localStorage.getItem('staffToken'); // Assuming staff token is stored as 'staffToken'
  if (!token) {
    throw new Error('No staff authentication token found');
  }
  
  const response = await fetch('http://localhost:3001/api/ingredients', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ingredients: ${response.status}`);
  }
  const data = await response.json();
  // Assuming the backend returns { success: true, ingredients: [...] }
  if (data.success && Array.isArray(data.ingredients)) {
    return data.ingredients;
  } else {
    throw new Error('Unexpected data format from ingredients API');
  }
};

export const deleteIngredient = async (ingredientId) => {
  const token = localStorage.getItem('staffToken'); // Assuming staff token is stored as 'staffToken'
   if (!token) {
     throw new Error('No staff authentication token found');
   }

  const response = await fetch(`http://localhost:3001/api/ingredients/${ingredientId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete ingredient');
  }

  // No content is expected for a successful DELETE
};

export const updateIngredient = async (ingredientId, ingredientData) => {
  const token = localStorage.getItem('staffToken'); // Assuming staff token is stored as 'staffToken'
   if (!token) {
     throw new Error('No staff authentication token found');
   }

  const response = await fetch(`http://localhost:3001/api/ingredients/${ingredientId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ingredientData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update ingredient');
  }

  // Assuming the backend returns a success message or updated ingredient
  return response.json();
};

export const fetchSuppliers = async () => {
   const token = localStorage.getItem('staffToken'); // Assuming staff token is stored as 'staffToken'
    if (!token) {
      throw new Error('No staff authentication token found');
    }

  const response = await fetch('http://localhost:3001/api/suppliers', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch suppliers');
  }
  return response.json();
}; 