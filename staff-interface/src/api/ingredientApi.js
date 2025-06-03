export const fetchIngredients = async () => {
  const response = await fetch('http://localhost:3001/api/ingredients');
  if (!response.ok) {
    throw new Error('Failed to fetch ingredients');
  }
  return response.json();
};

export const deleteIngredient = async (ingredientId) => {
  const response = await fetch(`http://localhost:3001/api/ingredients/${ingredientId}`, {
    method: 'DELETE',
    headers: {
      // TODO: Add authentication headers if needed
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
  const response = await fetch(`http://localhost:3001/api/ingredients/${ingredientId}`, {
    method: 'PUT',
    headers: {
      // TODO: Add authentication headers if needed
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
  const response = await fetch('http://localhost:3001/api/suppliers');
  if (!response.ok) {
    throw new Error('Failed to fetch suppliers');
  }
  return response.json();
}; 