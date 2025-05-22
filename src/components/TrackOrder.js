import React, { useState } from 'react';
import styles from '../styles/TrackOrder.module.css';

function TrackOrder() {
  // Sample data - có thể chuyển thành props hoặc fetch từ API
  const [trackOrder] = useState({
    orderId: '2024-Oct-08, 2024',
    estimatedDelivery: '20:30 Oct 09, 2024',
    status: 'Order Confirmed',
    timeline: [
      { date: 'Oct 03, 2024', completed: true },
      { date: 'Oct 05, 2024', completed: true },
      { date: 'Oct 08, 2024', completed: true },
      { date: 'Oct 09, 2024', completed: false }
    ]
  });

  return (
    <div className={styles.accountSection}>
      <h2>Track Order</h2>
      <div className={styles.trackOrderContainer}>
        <div className={styles.orderInfo}>
          <div className={styles.orderDate}>
            <span>Order ID:</span> {trackOrder.orderId}
          </div>
          <div className={styles.estimatedDelivery}>
            <span>Estimated delivery:</span> {trackOrder.estimatedDelivery}
          </div>
        </div>
        
        <div className={styles.orderStatus}>
          <div className={styles.statusLabel}>{trackOrder.status}</div>
          <div className={styles.statusTimeline}>
            {trackOrder.timeline.map((step, index) => (
              <div key={index} className={`${styles.timelineStep} ${step.completed ? styles.completed : ''}`}>
                <div className={styles.timelineDate}>{step.date}</div>
                <div className={styles.timelineDot}></div>
              </div>
            ))}
            <div className={styles.timelineLine}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;