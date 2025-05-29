ALTER TABLE sale
ADD COLUMN payment_status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
ADD COLUMN payment_transaction_id VARCHAR(255),
ADD COLUMN payment_method VARCHAR(50); 