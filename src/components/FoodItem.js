import React, { useState } from 'react';
import styles from '../styles/FoodItem.module.css';
import ShowMore from './ShowMore';

function FoodItem({ product, onAddToCart, showDetails, formattedPrice }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleShowMore = () => {
    showDetails(product.id);
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
          <span className={styles.price}>{formattedPrice}</span>
          <button 
            className={styles.addButton}
            disabled={product.is_available === false}
            title={product.is_available === false ? 'Out of stock' : 'Add to cart'}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            {product.is_available === false ? 'Out of stock' : 'Add to cart'}
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
          recipeId={product.id}
        />
      )}
    </div>
  );
}

export default FoodItem;