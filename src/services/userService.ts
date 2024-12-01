import mongoose from 'mongoose';
import UserModel, { IUser } from '../models/UserModel';

// Update the user's balance
export const updateUserBalanceAfterBet = async (userId: string, amount: number) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.balance -= amount; // Add the winning amount (or subtract if lost)
  await user.save();
};

export const validateUserBalance = async (userId: string, amount: number) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.balance < amount) {
    throw new Error('Insufficient balance');
  }
  return user;
};

export const getUserBalanceByUser = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error('User not found');
  return user.balance;
};

export const addBetToActiveBets = async (user: IUser, betId: mongoose.Types.ObjectId) => {
  if(!betId){
    throw new Error('Bet Id is required');
  }
  if(!user){
    throw new Error('User is required');
  }


  user.activeBets.push(betId);
  await user.save();
};