import {
  mysqlTable,
  mysqlSchema,
  primaryKey,
  int,
  varchar,
  text,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const categories = mysqlTable(
  "categories",
  {
    id: int().autoincrement().notNull(),
    productName: varchar("product_name", { length: 100 }),
    imageUrl: text("image_url"),
    day: varchar({ length: 15 }),
    category: mysqlEnum(["food", "drinks"]),
  },
  (table) => [primaryKey({ columns: [table.id], name: "categories_id" })],
);
