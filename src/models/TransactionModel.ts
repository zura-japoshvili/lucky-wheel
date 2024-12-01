import mongoose, { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;            
  amount: number;            
  type: 'win' | 'loss' | 'bet';  
  sectionId: string;         
  createdAt: Date;       
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['win', 'loss', 'bet'], required: true },
  sectionId: { type: String, required: true },
}, { timestamps: true });

const TransactionModel = model<ITransaction>('Transaction', transactionSchema);

export default TransactionModel;
