import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const DB_URI =  process.env.MONGO_URL?.replace('<dbname>',process.env.MONGO_PASSWORD) || "mongodb://127.0.0.1:27017/urlshoortner"

const dbConnection = async (d) => {
  try {
    const database = await mongoose.connect(DB_URI);
    console.log("data base connected successfully ......",database.connection.host);
  } catch (error) {
    console.log("data base is not connected !!", error);
  }
};

export default dbConnection;
