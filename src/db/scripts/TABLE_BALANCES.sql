CREATE TABLE user_balances (
    user_id VARCHAR(255) NOT NULL PRIMARY KEY,   -- User ID as a string
    phone_number VARCHAR(15) NOT NULL,           -- Phone number in international format
    asset VARCHAR(100) NOT NULL,                 -- Asset type (e.g., currency) as a string
    amount DECIMAL(20, 6) NOT NULL,              -- Amount as a number with precision
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Auto-generated date and time
);
