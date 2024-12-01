import { Request, Response } from 'express';
import { getUserBetValidation } from '../services/betService';
import logger from '../utils/logger';
import { addBetToActiveBets, updateUserBalanceAfterBet, validateUserBalance } from '../services/userService';
import { createBetTransaction } from '../services/transactionsService';

export const createBet = async (req: Request, res: Response) => {
   const { amount, sectionId } = req.body;
   const userId = req.user?.userId;
  logger.info("USERID" + userId);

   try {
     // 1. Check user balance
     const user = await validateUserBalance(userId, amount);

     logger.info('balance')
 
     // 2. Validate bet
     await getUserBetValidation(userId, amount, sectionId);

     logger.info('bet')
 
     // 3. Create bet and transaction
     const bet = await createBetTransaction(userId, amount, sectionId);

     logger.info('tra');
 
     // 4. Update user balance
     await updateUserBalanceAfterBet(userId, amount);
     logger.info('4');
 
     // 5. Add bet to user's active bets
     await addBetToActiveBets(user, bet._id);

      logger.info('active');
 
     res.status(201).json({
       success: true,
       message: 'Bet created successfully',
       betId: bet._id,
     });
   } catch (error) {
     logger.error('Error while creating bet', JSON.stringify(error, null, 2));
     res.status(500).json({ message: 'Error while creating bet' });
   }
 };



