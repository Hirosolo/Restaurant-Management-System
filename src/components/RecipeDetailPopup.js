import React from 'react';
import { recipeDetails } from '../data/menuData';
import styles from '../styles/RecipeDetailPopup.module.css';

/* Component hiển thị popup chi tiết công thức */
function RecipeDetailPopup({ selectedRecipe, setShowDetailPopup, setSelectedRecipe }) {
  const recipe = recipeDetails[selectedRecipe];

  /* Đóng popup */
  const handleClose = () => {
    setShowDetailPopup(false);
    setSelectedRecipe(null);
  };

  if (!recipe) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={handleClose}>✕</button>
        <h3>{recipe.name}</h3>
        <div className={styles.recipeDetails}>
          <p><strong>Calories:</strong> {recipe.calories} kcal</p>
          <p><strong>Protein:</strong> {recipe.protein} g</p>
          <p><strong>Fat:</strong> {recipe.fat} g</p>
          <p><strong>Fiber:</strong> {recipe.fiber} g</p>
          <p><strong>Carb:</strong> {recipe.carb} g</p>
          <p>{recipe.description}</p>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailPopup;