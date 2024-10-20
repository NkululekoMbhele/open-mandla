CREATE TABLE user_session (
    phone_number VARCHAR(16) NOT NULL PRIMARY KEY,  -- Phone number in international format
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- Auto-generated date and time
);
