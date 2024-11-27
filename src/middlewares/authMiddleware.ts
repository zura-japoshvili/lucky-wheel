import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

export const requireAuth = (
  req: Request, 
  res: Response, 
  next: NextFunction
): any => {
   // Get token from Header
   const token = req.headers.authorization?.split(' ')[1]; 

   // If no token, send unauthorized response and end the request
   if (!token) {
     return res.status(401).json({ error: "Unauthorized" });
   }

   try {
     // Verify token
     const decoded = verifyToken(token);
     req.user = decoded; // Add user data to req
     next(); // Continue process
   } catch (error) {
     return res.status(401).json({ error: "Unauthorized" });
   }
};