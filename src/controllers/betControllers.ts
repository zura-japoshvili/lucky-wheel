import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import BetModel from '../models/Bets';
import { getUserBetValidation } from '../services/betService';

export const createBet = async (req: Request, res: Response) => {
  const { amount, sectionId } = req.body;
  const userID = '1'

  const session = await mongoose.startSession(); // start the session

  try {
    session.startTransaction(); // start the transaction

    // 1. check, if user has enough balance
    const user = await User.findById(userID).session(session);  // find the user with season
    if (!user) {
      throw new Error('User not found');
    }

    if (user.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // 2. validate bet
    await getUserBetValidation(userID,amount, sectionId);
 

    // 3. create transaction
    const bet = new BetModel({
      userId: user._id,
      amount,
      sectionId,
      status: 'active',  // active bet
    });

    // 4. 
    await bet.save({ session });

    // 5. 
    user.balance -= amount;
    await user.save({ session });

    // 6. 
    user.activeBets.push(bet._id);
    await user.save({ session });

    await session.commitTransaction(); // if everything is completed

    res.status(201).json({
      success: true,
      message: 'Bet created successfully',
      betId: bet._id,
    });
  } catch (error) {
    await session.abortTransaction(); // if something is wrong, cancel the transaction

    console.error(error);
    res.status(500).json({ message: 'Error creating bet' });
  } finally {
    session.endSession(); // end season
  }
};

