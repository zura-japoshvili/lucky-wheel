import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const generateToken = (userId: string | mongoose.Types.ObjectId): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
