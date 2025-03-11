import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import fs from "fs";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import { configDotenv } from "dotenv";

configDotenv();

process.on("uncaughtException", (err) => {
  console.log("unhandled Exception");
  console.log(err.name, err.message);
  console.log("shutting down  ------- ");
  process.exit(0);
});

const app = express();

const logStream = fs.createWriteStream("./access.logs");

console.log(process.env.FRONT_END_URL);

const corsOptions = {
  origin: process.env.FRONT_END_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(morgan("combined", { stream: logStream }));

app.use(express.json());

//routing
app.use("/api/", userRoutes);

app.use("/api/", urlRoutes);

app.use(errorHandler);

export default app;
