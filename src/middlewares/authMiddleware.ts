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

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  // 1. გადაჭერი ტოკენი Header-დან
  const token = req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'

  // თუ ტოკენი არ არის ან ვერ მოიძებნა
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // 2. ვერიფიცირეთ ტოკენი
    const decoded = verifyToken(token as string);
    req.user = decoded; // დაემატე მონაცემები req user-ზე
    next(); // გააგრძელე პროცესი
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
