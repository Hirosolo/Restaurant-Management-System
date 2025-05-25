import React from 'react';
import styles from '../styles/Footer.module.css';

function Footer() {
    return (
        <div className={styles.footer}>
            <div className={styles.footerLeft}>
                <div className={styles.contactText}>Contact channels</div>
                <div className={styles.socialLinks}>
                    <a href="#" className={styles.socialLink}>
                        <img src="./assets/logofb.png" alt="Facebook icon" className={styles.socialIcon} />
                    </a>
                    <a href="#" className={styles.socialLink}>
                        <img src="./assets/logoig.png" alt="Instagram icon" className={styles.socialIcon} />
                    </a>
                </div>
            </div>
            <div className={styles.footerRight}>
                <div className={styles.updateInfo}>Always updated</div>
                <div className={styles.aboutText}>About information and new products</div>
                <div className={styles.newsletter}>
                    <input type="email" placeholder="email" className={styles.emailInput} />
                    <button className={styles.signupBtn}>Sign up</button>
                </div>
            </div>
        </div>
    );
}

export default Footer;