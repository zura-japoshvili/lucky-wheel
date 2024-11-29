import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import logger from "./logger";

export const generateToken = (userId: string | mongoose.Types.ObjectId): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
};


export const verifyToken = (token: string): JwtPayload => {
  try {
    const jwtSecret = process.env.JWT_SECRET

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    logger.warn("Invalid Token" + error)
    throw new Error('Invalid token');
  }
};
