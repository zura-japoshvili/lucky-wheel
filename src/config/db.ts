import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

const connectDB = async () => {
   try {
     await mongoose.connect(process.env.MONGO_URI || "");
     logger.info("Connected to Mongo")
   } catch (error) {
     logger.error("Failed to connect to MongoDB");

     logger.error("full error: " + error)
   }
};

export default connectDB;