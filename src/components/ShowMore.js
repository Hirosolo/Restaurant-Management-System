import React, { useRef } from 'react';
import '../styles/ShowMore.css';

const ShowMore = ({ isOpen, onClose, foodDetails }) => {
  const modalRef = useRef();
  
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
                  src={`/assets/${foodDetails.id}.${foodDetails.id === "RCP-003" || foodDetails.id === "RCP-004" || foodDetails.id === "RCP-006" || foodDetails.id === "RCP-011" || foodDetails.id === "RCP-013" || foodDetails.id === "RCP-014" || foodDetails.id === "RCP-015" || foodDetails.id === "RCP-016" || foodDetails.id === "RCP-022" || foodDetails.id === "RCP-023" || foodDetails.id === "RCP-024" || foodDetails.id === "RCP-028" || foodDetails.id === "RCP-029" || foodDetails.id === "RCP-030" ? "webp" : "jpg"}`}
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