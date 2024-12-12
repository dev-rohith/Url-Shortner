import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const dbConnection = async (d) => {
  try {
    const db = await mongoose.connect(process.env.DB);
    console.log("data base connected successfully ......",db.connection.host);
  } catch (error) {
    console.log("data base is not connected !!", error);
  }
};

export default dbConnection;
