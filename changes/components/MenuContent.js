import React from 'react';
import CategoryBlock from './CategoryBlock';
import { categories } from '../data/menuData';
import styles from '../styles/MenuContent.module.css';

/* Component hiển thị nội dung menu với các danh mục */
function MenuContent({ 
  categoriesOpen = {}, 
  toggleCategory = () => {}, 
  showRecipeDetails = () => {},
  onAddToCart = () => {} // Thêm prop onAddToCart
}) {
  return (
    <div className={styles.menuContent}>
      {categories && categories.map(category => (
        <CategoryBlock 
          key={category.id} 
          category={category} 
          isOpen={categoriesOpen && categoriesOpen[category.id] || false} 
          toggleCategory={toggleCategory} 
          showRecipeDetails={showRecipeDetails}
          onAddToCart={onAddToCart} // Truyền onAddToCart xuống cho CategoryBlock
        />
      ))}
    </div>
  );
}

export default MenuContent;