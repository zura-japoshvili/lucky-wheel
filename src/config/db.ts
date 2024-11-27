import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
   try {
     console.log("MONGO_URI:", process.env.MONGO_URI);
     await mongoose.connect(process.env.MONGO_URI || "");
     console.log('Connected to database');
   } catch (error) {
     console.error("MongoDB connection failed:", error);
     console.error("Full error:", error);
   }
};

export default connectDB;