import { Request, Response } from 'express';
import User from '../models/User';
import BetModel from '../models/Bets';
import { getUserBetValidation } from '../services/betService';
import logger from '../utils/logger';
import TransactionModel from '../models/Transaction';

export const createBet = async (req: Request, res: Response) => {
  const { amount, sectionId } = req.body;
  const userId = req.user?.userId;

  try {
     // 1. check, if user has enough balance
     const user = await User.findById(userId);

     logger.warn(user)
     logger.info(userId, "user has enough balance")

     if (!user) {
        throw new Error('User not found');
     }

     if (user.balance < amount) {
        throw new Error('Insufficient balance');
     }

     // 2. validate bet
     await getUserBetValidation(userId, amount, sectionId);

     // 3. create transaction
     const bet = new BetModel({
        userId: user._id,
        amount,
        sectionId,
        status: 'active',
     });

     // 4. save bet
     await bet.save();

     // 5. update user balance
     user.balance -= amount;
     await user.save();


      // 6. Create a transaction entry for the bet
      const transaction = new TransactionModel({
         userId: user._id,
         amount,
         type: 'bet',
         sectionId,
      });

      await transaction.save();


     // 7. add bet to user's active bets
     user.activeBets.push(bet._id);
     await user.save();

     res.status(201).json({
        success: true,
        message: 'Bet created successfully',
        betId: bet._id,
     });
  } catch (error) {
      logger.error("error while creating bet", JSON.stringify(error, null, 2));

     res.status(500).json({ message: 'Error creating bet' });
  }
};

