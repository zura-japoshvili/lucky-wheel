import BetModel from '../models/Bets';
import Transaction from '../models/Transaction'; // Transaction model
import WheelConfigModel from '../models/WheelConfigModel';
import { getRandomInt } from '../utils/rng';
import { updateUserBalance } from './userService';

// Main function for spinning the wheel
export const spinWheel = async (userId: string) => {
  // Fetch the wheel configuration
  const wheelConfig = await WheelConfigModel.findOne({ _id: 'MAIN_WHEEL_CONFIG' });

  // If the configuration is not found, it is insufficient
  if (!wheelConfig) {
    throw new Error('Wheel configuration not found');
  }

  // Select a random section
  const randomIndex = getRandomInt(0, wheelConfig.sections.length);
  const winningSection = wheelConfig.sections[randomIndex];

  // Fetch active bets
  const activeBets = await BetModel.find({ userId, status: 'active' });

  // If the user's bet matches the winning section
  for (const bet of activeBets) {
    if (bet.sectionId === winningSection.id) {
      // Update user's balance
      await updateUserBalance(userId, bet.amount * winningSection.multiplier);

      // Record the transaction
      const transaction = new Transaction({
        userId,
        betId: bet._id,
        amount: bet.amount * winningSection.multiplier,
        type: 'win',
        status: 'completed',
      });
      await transaction.save();
    }
  }

  // Update bets to inactive
  await BetModel.updateMany({ userId, status: 'active' }, { status: 'inactive' });

  // Return the result of the wheel
  return winningSection;
};
