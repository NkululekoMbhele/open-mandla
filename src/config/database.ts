import dotenv from 'dotenv';
dotenv.config();

const POSTGRES_DB = process.env.POSTGRES_DB
const POSTGRES_USER = process.env.POSTGRES_USER
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD

// console.log(POSTGRES_DB)
// console.log(POSTGRES_USER)
// console.log(POSTGRES_PASSWORD)
export const DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@172.18.0.2:5432/${POSTGRES_DB}`;

console.log("DATABASE_URL", DATABASE_URL)
