import { DATABASE_URL } from '../config/database';
import { drizzle } from 'drizzle-orm/node-postgres';

import { pgTable, serial, text, varchar, decimal, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const postgresDB = drizzle(DATABASE_URL);

