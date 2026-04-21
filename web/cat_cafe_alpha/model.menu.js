/**
 * @typedef {Object} MenuItem
 * @property {string[]} food
 * @property {string[]} drinks
 */
/** @typedef {"Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"} Day */

/** @type {Record<Day,MenuItem>} */
const MOCK = {
  Sunday: {
    food: ["sunday_1", "sunday_2"],
    drinks: ["sunday_drink_1", "sunday_drink_2"],
  },
  Monday: {
    food: ["monday_1", "monday_2"],
    drinks: ["monday_drink_1", "monday_drink_2"],
  },
  Tuesday: {
    food: ["tuesday_1", "tuesday_2"],
    drinks: ["tuesday_drink_1", "tuesday_drink_2"],
  },
  Wednesday: {
    food: ["wednesday_1", "wednesday_2"],
    drinks: ["wednesday_drink_1", "wednesday_drink_2"],
  },
  Thursday: {
    food: ["thursday_1", "thursday_2"],
    drinks: ["thursday_drink_1", "thursday_drink_2"],
  },
  Friday: {
    food: ["friday_1", "friday_2"],
    drinks: ["friday_drink_1", "friday_drink_2"],
  },
  Saturday: {
    food: ["saturday_1", "saturday_2"],
    drinks: ["saturday_drink_1", "saturday_drink_2"],
  },
};
import { eq, sql } from "drizzle-orm";
import { db } from "./db/connection.js";
import { categories } from "./db/drizzle/schema.js";
/** @param {Day} day*/
export async function getMenuData(day) {
  const data = await db
    .select({
      imgSrc: categories.imageUrl,
      category: categories.category,
      name: categories.productName,
    })
    .from(categories)
    .where(eq(categories.day, day));
  const values = Object.groupBy(data, ({ category }) => category);
  return values;
}
