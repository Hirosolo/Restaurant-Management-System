import React from 'react';
import FoodItem from './FoodItem';
import styles from '../styles/CategoryBlock.module.css';

function CategoryBlock({ category, isOpen, toggleCategory, showRecipeDetails, onAddToCart }) {
  // Đổi từ addToCart thành onAddToCart
  
  return (
    <div className={styles.categoryBlock}>
      <div className={styles.categoryHeader} onClick={() => toggleCategory(category.id)}>
        <h2 className={styles.categoryTitle}>{category.name}</h2>
        <span className={styles.toggleIcon}>{isOpen ? '▼' : '▶'}</span>
      </div>
      
      {isOpen && (
        <div className={styles.menuItemsGrid}>
          {category.items.map(item => (
            <FoodItem 
              key={item.id}
              product={item}
              onAddToCart={() => onAddToCart(item)} // Đổi tên prop sang onAddToCart
              showDetails={() => showRecipeDetails(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryBlock;