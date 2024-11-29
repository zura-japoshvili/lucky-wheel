import BetModel from '../models/Bets';
import WheelConfigModel from '../models/WheelConfigModel';
import User from '../models/User';
import { ReferenceDataEnum } from '../types/enums/referenceDataEnum';
import TransactionModel from '../models/Transaction';
import logger from '../utils/logger';

// Main function for spinning the wheel
export const spinWheel = async () => {
  const wheelConfig = await WheelConfigModel.findOne({ _id: ReferenceDataEnum.MAIN_WHEEL_CONFIG });
  if (!wheelConfig) throw new Error('Wheel configuration not found');

  // const randomIndex = getRandomInt(0, wheelConfig.sections.length);
  const randomIndex = 1;
  const winningSection = wheelConfig.sections[randomIndex];

  try {
    // Find active bets for the winning section
    const activeBets = await BetModel.find({
      status: 'active',
      sectionId: winningSection.id
    });

    const betIds = [];

    // Update users' balances and transactions for winning bets
    if (activeBets.length > 0) {
      const userIds = [];

      for (const bet of activeBets) {
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


    return winningSection;
  } catch (error) {
    logger.error('Error occurred while spinning the wheel:', error);
    throw new Error('Error occurred while spinning the wheel');
  }
};


