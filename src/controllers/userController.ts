import { Request, Response } from 'express';

import { getBettingHistoryByUser } from "../services/betService";
import { getTransactionsByUser } from "../services/transactionsService";
import { getUserBalanceByUser } from '../services/userService';
import logger from '../utils/logger';

export const getUserHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
    
        // Retrieve transaction history
        const transactions = await getTransactionsByUser(userId);
        // Retrieve betting history
        const bettingHistory = await getBettingHistoryByUser(userId);
    
        // Combine transactions and betting history into a single history array
        const history = [
            ...transactions.map(transaction => ({
              type: 'transaction',
              id: transaction._id,
              userId: transaction.userId,
              amount: transaction.amount,
              sectionId: transaction.sectionId,
              createdAt: transaction.createdAt,
            })),
            ...bettingHistory.map(bet => ({
              type: 'bet',
              id: bet._id,
              userId: bet.userId,
              amount: bet.amount,
              status: bet.status,
              sectionId: bet.sectionId,
              createdAt: bet.createdAt,
            }))
          ];
          
    
        res.status(200).json({
            history,
        });
    } catch (error) {
    
        logger.error('Error retrieving user history:', error);
        res.status(500).json({ message: 'Error retrieving user history' });
    }
  };
  
  
  // Controller for user balance
  export const getUserBalance = async (req: Request, res: Response) => {
    try {
        // Retrieve user balance
        const userId = req.user.userId;

        const balance = await getUserBalanceByUser(userId);
    
        res.status(200).json({
            balance,
        });
    } catch (error) {
        logger.error('Error fetching user balance:', error);
        res.status(500).json({ message: 'Error retrieving user balance' });
    }
  };