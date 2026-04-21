import { Router } from "express";
import { getMenuData } from "./model.menu.js";
const app = Router();
app.get("/monday", async (req, res) => {
  const data = await getMenuData("Monday");
  return res.json(data);
});
app.get("/tuesday", async (req, res) => {
  const data = await getMenuData("Tuesday");
  return res.json(data);
});
app.get("/wednesday", async (req, res) => {
  const data = await getMenuData("Wednesday");
  return res.json(data);
});
app.get("/thursday", async (req, res) => {
  const data = await getMenuData("Thursday");
  return res.json(data);
});
app.get("/friday", async (req, res) => {
  const data = await getMenuData("Friday");
  return res.json(data);
});
app.get("/saturday", async (req, res) => {
  const data = await getMenuData("Saturday");
  return res.json(data);
});
app.get("/sunday", async (req, res) => {
  const data = await getMenuData("Sunday");
  return res.json(data);
});
export default app;
