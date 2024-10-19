CREATE TABLE user_details (
    user_id VARCHAR(255) NOT NULL PRIMARY KEY,   -- User ID as a string
    phone_number VARCHAR(16) NOT NULL,           -- Phone number in international format
    user_name VARCHAR(255) NOT NULL,             -- Asset type (e.g., currency) as a string
    country VARCHAR(3) NOT NULL,                     -- Amount as a number with precision
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Auto-generated date and time
);
