import React, { useRef } from 'react';
import '../styles/ShowMore.css';
import { recipeDetails } from '../data/menuData';

const ShowMore = ({ isOpen, onClose, recipeId }) => {
  const modalRef = useRef();
  
  // Lấy thông tin chi tiết dựa trên recipeId
  const foodDetails = recipeId && recipeDetails[recipeId];

  if (!isOpen || !foodDetails) return null;

  // Xử lý click bên ngoài để đóng popup
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleClickOutside}>
      <div className="popup-container" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="popup-content">
          <div className="food-details">
            <h2>{foodDetails.name}</h2>
            
            <div className="food-description-container">
              <div className="food-description">
                <p>{foodDetails.description}</p>
                
                <ul className="nutrition-list">
                  <li>Calories: {foodDetails.calories}</li>
                  <li>Protein: {foodDetails.protein}</li>
                  <li>Fat: {foodDetails.fat}</li>
                  <li>Fiber: {foodDetails.fiber}</li>
                  <li>Carb: {foodDetails.carb}</li>
                </ul>
              </div>
              
              <div className="food-image">
                <img 
                  src={`/assets/${recipeId}.${recipeId === "RCP-003" || recipeId === "RCP-004" || recipeId === "RCP-006" || recipeId === "RCP-011" || recipeId === "RCP-013" || recipeId === "RCP-014" || recipeId === "RCP-015" || recipeId === "RCP-016" || recipeId === "RCP-022" || recipeId === "RCP-023" || recipeId === "RCP-024" || recipeId === "RCP-028" || recipeId === "RCP-029" || recipeId === "RCP-030" ? "webp" : "jpg"}`}
                  alt={foodDetails.name}
                  onError={(e) => {
                    e.target.src = '/assets/default-food.jpg';
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowMore;