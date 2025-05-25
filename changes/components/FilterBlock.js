import React from 'react';
import styles from '../styles/FilterBlock.module.css';

/* Component hiển thị một bộ lọc với dropdown */
function FilterBlock({ filter, isOpen, toggleFilter }) {
  return (
    <div className={styles.filterBlock}>
      <div 
        className={styles.filterHeader} 
        onClick={() => toggleFilter(filter.id)}
      >
        {filter.name}
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className={styles.filterOptions}>
          {filter.options.map((option, index) => (
            <div key={index} className={styles.filterOption}>
              <input type="checkbox" id={`${filter.id}-${index}`} />
              <label htmlFor={`${filter.id}-${index}`}>{option}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterBlock;