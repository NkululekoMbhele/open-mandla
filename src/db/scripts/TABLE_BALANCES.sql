CREATE TABLE user_balances (
    user_id VARCHAR(255) NOT NULL PRIMARY KEY,   -- User ID as a string
    asset VARCHAR(100) NOT NULL,                 -- Asset type (e.g., currency) as a string
    amount BIGDECIMAL(20, 10) NOT NULL,          -- Amount as a number with precision
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Auto-generated date and time
);
