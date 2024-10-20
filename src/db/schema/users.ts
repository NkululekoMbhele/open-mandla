import { pgTable, serial, text, varchar, decimal, timestamp, primaryKey } from 'drizzle-orm/pg-core';

// User Balances Table
export const userDataTable = pgTable('user_details', {
    user_id: varchar('user_id', { length: 255 }).notNull().primaryKey(),
    phone_number: varchar('phone_number', { length: 16 }).notNull(),
    user_name: varchar('user_name', { length: 255 }),
    country: varchar('country', { length: 3 }).notNull(),
    datetime: timestamp('datetime').defaultNow(),
});
