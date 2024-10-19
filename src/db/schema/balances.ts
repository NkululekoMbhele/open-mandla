import { pgTable, serial, text, varchar, decimal, timestamp, primaryKey } from 'drizzle-orm/pg-core';

// User Balances Table
export const userBalancesTable = pgTable('user_balances', {
    user_id: varchar('user_id', { length: 255 }).notNull().primaryKey(),
    phone_number: varchar('phone_number', { length: 15 }).notNull(),
    asset: varchar('asset', { length: 100 }).notNull(),
    amount: decimal('amount', { precision: 20, scale: 6 }).notNull(),
    datetime: timestamp('datetime').defaultNow(),
});