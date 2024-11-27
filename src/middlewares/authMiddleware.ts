import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

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
   // Get token from Header
   const token = req.headers.authorization?.split(' ')[1]; 

   // If no token, send unauthorized response and end the request
   if (!token) {
     return res.status(401).json({ error: "Unauthorized" });
   }

   try {
     // Verify token
     const decoded = verifyToken(token); // `decoded` will be of type JwtPayload here

     // Type assertion to ensure decoded has userId
     if ('userId' in decoded) {
       req.user = decoded as JwtPayload & { userId: string }; // Cast to the correct type
       next(); // Continue process
     } else {
       return res.status(401).json({ error: "Unauthorized" });
     }
   } catch (error) {
     return res.status(401).json({ error: "Unauthorized" });
   }
};