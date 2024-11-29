import winston from 'winston';
import MongoDB from 'winston-mongodb';

// Ensure environment variables are loaded
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGO_URI as string;


// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    

    // Console Transport for Docker logs
    new winston.transports.Console(),
    // MongoDB transport
    new MongoDB.MongoDB({
        db: mongoURI,
        collection: 'logs',
        options: { useUnifiedTopology: true },
        metaKey: 'metadata',
      }),      
  ]
});

// Enhanced logging methods
export const log = {
  info: (message: string, metadata?: any) => {
    logger.info(message, { metadata });
  },
  error: (message: string, metadata?: any) => {
    logger.error(message, { metadata });
  },
  warn: (message: string, metadata?: any) => {
    logger.warn(message, { metadata });
  }
};

export default logger;