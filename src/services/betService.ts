import BetModel from '../models/BetModel';
import User from '../models/UserModel';

export const getUserBetValidation = async (userId: string, amount: number, sectionId: string) => {
  // 1. validate user and balance
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 2. bet validation
  const bet = new BetModel({
    userId: user._id,
    amount,
    sectionId,
    status: 'active',
  });

  if (bet.amount <= 0 || bet.amount > 100) {
    throw new Error('Invalid bet amount');
  }

  return bet;
};


export const getBettingHistoryByUser = async (userId: string) => {
  return await BetModel.find({ userId });
};

