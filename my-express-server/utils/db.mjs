
import * as pg from "pg";
import dotenv from "dotenv";


dotenv.config(); // โหลดค่าจาก .env

const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default connectionPool;