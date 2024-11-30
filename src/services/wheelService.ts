import BetModel from '../models/Bets';
import WheelConfigModel from '../models/WheelConfigModel';
import User from '../models/User';
import { ReferenceDataEnum } from '../types/enums/referenceDataEnum';
import TransactionModel from '../models/Transaction';
import logger from '../utils/logger';
import { generateVerificationHash } from '../utils/verificationHash';
import { spinWheelRNG } from '../utils/rng';

// Main function for spinning the wheel
export const spinWheel = async () => {
  const wheelConfig = await WheelConfigModel.findOne({ _id: ReferenceDataEnum.MAIN_WHEEL_CONFIG });
  if (!wheelConfig) throw new Error('Wheel configuration not found');

  const winningSection = spinWheelRNG(wheelConfig.sections);


  try {
    // Find active bets for the winning section
    const activeBets = await BetModel.find({
      status: 'active',
    });
    if (activeBets.length === 0) throw new Error('No active bets');

    const betIds = activeBets.map((bet) => bet._id);
    const winningBets = betIds.filter((bet) => bet.sectionId === winningSection.id);

    // Update users' balances and transactions for winning bets
    if (winningBets.length > 0) {
      const userIds = [];

      for (const bet of winningBets) {
        betIds.push(bet._id);

        // Update user balance
        await User.updateOne(
          { _id: bet.userId },
          {
            $inc: { balance: bet.amount * winningSection.multiplier }
          }
        );

        // Save transaction
        const transaction = new TransactionModel({
          userId: bet.userId,
          amount: bet.amount * winningSection.multiplier,
          type: 'win',
          sectionId: bet.sectionId,
          createdAt: new Date(),  
        });

        await transaction.save(); 

        // Collect user IDs to update activeBets field later
        userIds.push(bet.userId);
      }

      // Remove winning bets from activeBets field for users
      await User.updateMany(
        { _id: { $in: userIds } },
        { $pull: { activeBets: { $in: activeBets.map(bet => bet._id) } } }
      );
    }

    // Update all collected active bets to 'inactive' status
    await BetModel.updateMany(
      { _id: { $in: betIds } }, 
      { $set: { status: 'inactive' } } 
    );

    const data = {
      result: {...winningSection},
      verificationHash: generateVerificationHash(winningSection),
      animationData: {
        startDelay: 300, // 300ms second delay before spin starts
        spinDuration: 5000, // 4 seconds spin duration
        revolutions: 10, // 10 revolutions
      }
    };


    logger.info("Wheel spin results:" + JSON.stringify(data, null, 2));

    return data;
  } catch (error: any) {
    if (error.message === 'No active bets') {
      logger.error('No active bets error occurred:', error);
      throw new Error(error.message); 
    }

    logger.error('Error occurred while spinning the wheel:', error);
    throw new Error('Error occurred while spinning the wheel');
  }
};


