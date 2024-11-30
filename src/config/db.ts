import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger";
import config from "./config";

dotenv.config();

const connectDB = async () => {
   try {
     await mongoose.connect(config.mongoURI || "");
     logger.info("Connected to Mongo")
   } catch (error) {
     logger.error("Failed to connect to MongoDB");

     logger.error("full error: " + error)
   }
};

export default connectDB;