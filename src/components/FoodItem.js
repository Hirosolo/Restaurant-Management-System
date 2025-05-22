import React, { useState } from 'react';
import styles from '../styles/FoodItem.module.css';
import ShowMore from './ShowMore';

function FoodItem({ product, onAddToCart, showDetails }) {
  const [showPopup, setShowPopup] = useState(false);

  // Chuyển đổi id sản phẩm thành định dạng recipeId
  const getRecipeIdFromProduct = (product) => {
    // Tìm trong recipeDetails món có name tương ứng
    const recipeId = Object.keys(require('../data/menuData').recipeDetails).find(
      key => require('../data/menuData').recipeDetails[key].name === product.name
    );
    return recipeId;
  };

  const handleShowMore = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className={styles.foodItem}>
      <div className={styles.leftSection}>
        <img src={product.image} alt={product.name} className={styles.foodImage} />
      </div>
      
      <div className={styles.rightSection}>
        <h3 className={styles.foodName}>{product.name}</h3>
        
        <div className={styles.rating}>
          {'★★★★★'.split('').map((star, index) => (
            <span 
              key={index} 
              className={styles.starFilled}
            >
              ★
            </span>
          ))}
        </div>
        
        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button 
            className={styles.addButton}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            Add to cart
          </button>
        </div>
        
        <button 
          className={styles.showMoreButton}
          onClick={(e) => {
            e.stopPropagation();
            handleShowMore();
          }}
        >
          Show more
        </button>
      </div>

      {/* Thêm ShowMore component */}
      {showPopup && (
        <ShowMore 
          isOpen={showPopup} 
          onClose={handleClosePopup} 
          recipeId={getRecipeIdFromProduct(product)}
        />
      )}
    </div>
  );
}

export default FoodItem;