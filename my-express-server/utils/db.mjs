import * as pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // โหลดค่าจาก .env

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const { Pool } = pg;

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default connectionPool;