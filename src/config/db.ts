import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

const connectDB = async () => {
   try {
     await mongoose.connect(process.env.MONGO_URI || "");
     logger.info("Connected to Mongo")
   } catch (error) {
     console.error("MongoDB connection failed:", error);
     console.error("Full error:", error);
   }
};

export default connectDB;