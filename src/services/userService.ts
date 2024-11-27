import User from '../models/User';

// Update the user's balance
export const updateUserBalance = async (userId: string, amount: number) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.balance += amount; // Add the winning amount (or subtract if lost)
  await user.save();
};
