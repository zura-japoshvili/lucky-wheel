import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';



export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword} = req.body;

  if (password!== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    balance: 100 // ALERT: it's not right, but we need to test it
  });

  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({
    message: "User registered successfully",
    token,
  });
};



export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;


  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // JWT token generation
  const token = generateToken(user._id);


  res.status(200).json({
    message: "Authentication successful",
    token, 
  });

};