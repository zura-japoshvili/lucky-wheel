import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Global Error Handler
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

  logger.error(err)
  const statusCode = err.statusCode || 500;  
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
