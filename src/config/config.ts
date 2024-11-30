import dotenv from "dotenv";

dotenv.config();

export default {
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT || '3000',
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV || 'development',
    API_URL: process.env.API_URL || 'http://localhost',
  };
  