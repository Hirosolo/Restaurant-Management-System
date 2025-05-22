import React from 'react';
import styles from '../styles/Sidebar.module.css';

function Sidebar({ filtersOpen = {}, toggleFilter = () => {} }) {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.menuTitle}>Menu</h2>
      
      <div className={styles.filterGroup}>
        <div 
          className={styles.filterHeader}
          onClick={() => toggleFilter('calories')}
        >
          <span className={styles.filterTitle}>Calories</span>
          <span className={styles.toggleIcon}>
            {filtersOpen && filtersOpen.calories ? '▼' : '▶'}
          </span>
        </div>
        
        {filtersOpen && filtersOpen.calories && (
          <div className={styles.filterOptions}>
            <div className={styles.filterOption}>
              <input type="radio" id="calories-less-300" name="calories" />
              <label htmlFor="calories-less-300">&lt; 300</label>
            </div>
            <div className={styles.filterOption}>
              <input type="radio" id="calories-300-500" name="calories" />
              <label htmlFor="calories-300-500">300 - 500</label>
            </div>
            <div className={styles.filterOption}>
              <input type="radio" id="calories-more-500" name="calories" />
              <label htmlFor="calories-more-500">&gt; 500</label>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.filterGroup}>
        <div 
          className={styles.filterHeader}
          onClick={() => toggleFilter('protein')}
        >
          <span className={styles.filterTitle}>Main Protein</span>
          <span className={styles.toggleIcon}>
            {filtersOpen && filtersOpen.protein ? '▼' : '▶'}
          </span>
        </div>
        
        {filtersOpen && filtersOpen.protein && (
          <div className={styles.filterOptions}>
            <div className={styles.filterOption}>
              <input type="radio" id="protein-salmon" name="protein" />
              <label htmlFor="protein-salmon">Salmon</label>
            </div>
            <div className={styles.filterOption}>
              <input type="radio" id="protein-tuna" name="protein" />
              <label htmlFor="protein-tuna">Tuna</label>
            </div>
            <div className={styles.filterOption}>
              <input type="radio" id="protein-chicken" name="protein" />
              <label htmlFor="protein-chicken">Chicken</label>
            </div>
            <div className={styles.filterOption}>
              <input type="radio" id="protein-shrimp" name="protein" />
              <label htmlFor="protein-shrimp">Shrimp</label>
            </div>
            <div className={styles.filterOption}>
              <input type="radio" id="protein-scallop" name="protein" />
              <label htmlFor="protein-scallop">Scallop</label>
            </div>
            <div className={styles.filterOption}>
              <input type="radio" id="protein-tofu" name="protein" />
              <label htmlFor="protein-tofu">Tofu</label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;