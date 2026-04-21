import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
const client = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ?? 3306,
});
export const db = drizzle({ client });
