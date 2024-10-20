CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,                     -- Auto-generated ID
    source_account VARCHAR(255) NOT NULL,      -- Source account as a string
    dest_account VARCHAR(255) NOT NULL,        -- Destination account as a string
    user_id VARCHAR(255) NOT NULL,             -- User ID as a string
    asset VARCHAR(100) NOT NULL,               -- Asset type (e.g., currency) as a string
    amount DECIMAL(20, 6) NOT NULL,            -- Amount as a number with precision
    txn_type VARCHAR(100) NOT NULL,            -- Type of transaction (e.g., deposit, transfer)
    txn_id VARCHAR(255) UNIQUE NOT NULL,       -- Transaction ID, must be unique
    quote_id VARCHAR(255)
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Auto-generated date and time
);