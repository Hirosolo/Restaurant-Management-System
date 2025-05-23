import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/UserNav.module.css';

function UserNav() {

  return (
    <div className={styles.userNavContainer}>
      <div className={styles.userNavLinks}>
        <Link to="/account" className={styles.userNavLink}>
          <i className={styles.userIcon}>👤</i> User
        </Link>
        <Link to="/guest-order" className={styles.userNavLink}>Guest Order</Link>
        <Link to="/track-order" className={styles.userNavLink}>Track Your Order</Link>
      </div>
    </div>
  );
}

export default UserNav;