import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import fs from "fs";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";

process.on("uncaughtException", (err) => {
  console.log("unhandled Exception");
  console.log(err.name, err.message);
  console.log("shutting down  ------- ");
  process.exit(0);
});

const app = express();

const logStream = fs.createWriteStream("./access.logs");
const corsOptions = {
  origin: "http://localhost:5173",
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
