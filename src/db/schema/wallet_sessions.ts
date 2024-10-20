import { pgTable, serial, text, varchar, decimal, timestamp, primaryKey } from 'drizzle-orm/pg-core';

// User Balances Table
export const userSessionTable = pgTable('user_session', {
    phone_number: varchar('phone_number', { length: 16 }).notNull().primaryKey(),
    datetime: timestamp('datetime').defaultNow(),
});
