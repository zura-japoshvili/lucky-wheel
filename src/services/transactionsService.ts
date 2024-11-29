import TransactionModel from '../models/Transaction';

export const getTransactionsByUser = async (userId: string) => {
  return await TransactionModel.find({ userId });
};