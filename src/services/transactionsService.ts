import BetModel from '../models/BetModel';
import TransactionModel from '../models/TransactionModel';

export const getTransactionsByUser = async (userId: string) => {
  return await TransactionModel.find({ userId });
};

export const createBetTransaction = async (userId: string, amount: number, sectionId: string) => {
  const bet = new BetModel({
    userId: userId,
    amount,
    sectionId,
    status: 'active',
  });
  await bet.save();

  const transaction = new TransactionModel({
    userId: userId,
    amount,
    type: 'bet',
    sectionId,
  });
  await transaction.save();

  return bet;
};