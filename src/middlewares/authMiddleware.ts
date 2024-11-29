import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import logger from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { userId: string }; // Extend the JwtPayload with the userId field
    }
  }
}

export const requireAuth = (
  req: Request, 
  res: Response, 
  next: NextFunction
): any => {
    // Log the entire authorization header for debugging

    // More robust token extraction
    const authHeader = req.headers.authorization;
    const token = authHeader 
        ? authHeader.includes('Bearer ') 
            ? authHeader.split(' ')[1] 
            : authHeader
        : undefined;


   // If no token, send unauthorized response and end the request
   if (!token) {
     return res.status(401).json({ message: "Unauthorized" });
   }

   try {
     // Verify token
     const decoded = verifyToken(token); // `decoded` will be of type JwtPayload here

     logger.warn(JSON.stringify(decoded ));

     // Type assertion to ensure decoded has userId
     if ('userId' in decoded) {
       req.user = decoded as JwtPayload & { userId: string }; // Cast to the correct type
       next(); // Continue process
     } else {
       return res.status(401).json({ message: "Unauthorized" });
     }
   } catch (error) {
     logger.error("Failed to authenticate token:", error);
     return res.status(401).json({ message: "Unauthorized" });
   }
};