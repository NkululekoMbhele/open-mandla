import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import {userDataTable} from "./users";

export const paymentSessions = pgTable('payment_sessions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => userDataTable.user_id),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at').notNull(),
  paymentUrl: text('payment_url'),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => {
  return {
    userIdIdx: uniqueIndex('user_id_idx').on(table.userId),
  }
});

export type PaymentSession = InferModel<typeof paymentSessions>;
export type NewPaymentSession = InferModel<typeof paymentSessions, 'insert'>;