import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "mysql",
  out: "drizzle",
  schema: "./db/shema.drizzle.js",
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ?? 3306,
});
