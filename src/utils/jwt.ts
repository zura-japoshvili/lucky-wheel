import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import logger from "./logger";
import config from "../config/config";

export const generateToken = (userId: string | mongoose.Types.ObjectId): string => {
  return jwt.sign({ userId }, config.jwtSecret as string, { expiresIn: "30d" });
};


export const verifyToken = (token: string): JwtPayload => {
  try {
    const jwtSecret = config.jwtSecret

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    logger.warn("Invalid Token" + error)
    throw new Error('Invalid token');
  }
};
