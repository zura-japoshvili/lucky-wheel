import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export const generateToken = (userId: string | mongoose.Types.ObjectId): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
};


export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, 'your-secret-key') as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
