import mongoose, { Schema, model, Document } from 'mongoose';

export interface IBet extends Document {
  _id: mongoose.Types.ObjectId;             
  userId: string;            
  sectionId: string;        
  amount: number;            
  status: 'active' | 'inactive'; 
  createdAt: Date;          
  updatedAt: Date;           
}

const betSchema = new Schema<IBet>({
  userId: { type: String, required: true },
  sectionId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

const BetModel = model<IBet>('Bet', betSchema);

export default BetModel;
