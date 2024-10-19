import { pgTable, serial, text, varchar, decimal, timestamp, primaryKey } from 'drizzle-orm/pg-core';

// User Balances Table
export const transactionsTable = pgTable('transactions', {
    id: serial('id').primaryKey(),
    source_account: varchar('source_account', { length: 255 }).notNull(),
    dest_account: varchar('dest_account', { length: 255 }).notNull(),
    user_id: varchar('user_id', { length: 255 }).notNull(),
    asset: varchar('asset', { length: 100 }).notNull(),
    amount: decimal('amount', { precision: 20, scale: 6 }).notNull(),
    txn_type: varchar('txn_type', { length: 100 }).notNull(),
    txn_id: varchar('txn_id', { length: 255 }).notNull().unique(),
    datetime: timestamp('datetime').defaultNow(),
});