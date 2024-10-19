import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, varchar, decimal, timestamp, primaryKey } from 'drizzle-orm/pg-core';

const DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@mm_pdb:5432/${process.env.POSTGRES_DB}`;

export const postgresDB = drizzle(DATABASE_URL);
// export default const postgresDB = drizzle(DATABASE_URL);


// User Balances Table
export const userBalancesTable = pgTable('user_balances', {
  user_id: varchar('user_id', { length: 255 }).notNull().primaryKey(),
  phone_number: varchar('phone_number', { length: 15 }).notNull(),
  asset: varchar('asset', { length: 100 }).notNull(),
  amount: decimal('amount', { precision: 20, scale: 6 }).notNull(),
  datetime: timestamp('datetime').defaultNow(),
});

// Transactions Table
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

// User Details Table
export const userDetailsTable = pgTable('user_details', {
  user_id: varchar('user_id', { length: 255 }).notNull().primaryKey(),
  phone_number: varchar('phone_number', { length: 16 }).notNull(),
  user_name: varchar('user_name', { length: 255 }).notNull(),
  country: varchar('country', { length: 3 }).notNull(),
  datetime: timestamp('datetime').defaultNow(),
});
