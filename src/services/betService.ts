import BetModel from '../models/Bets';
import User from '../models/User';

export const getUserBetValidation = async (userId: string, amount: number, sectionId: string) => {
  // 1. validate user and balance
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.balance < amount) {
    throw new Error('Insufficient balance');
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



