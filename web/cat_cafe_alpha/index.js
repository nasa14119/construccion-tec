import express from "express";
import morgan from "morgan";
import menuRouter from "./routes.menu.js";
const app = express();
process.loadEnvFile();
app.use(express.json());

app.use("/api/menu", menuRouter);
app.use("/", express.static("static"));

app.use(morgan(":method :url"));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
