import React from 'react';
import styles from '../styles/AccountOverview.module.css';

function AccountOverview() {
  return (
    <div className={styles.accountSection}>
      <h2>Account</h2>
      <div className={styles.accountContent}>
        <p>Welcome to your account dashboard.</p>
        <p>From here you can:</p>
        <ul>
          <li>View and track your orders</li>
          <li>View your favorite orders</li>
          <li>Update your profile settings</li>
        </ul>
        <button className={styles.changePasswordButton}>Change Password</button>
      </div>
    </div>
  );
}

export default AccountOverview;