import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  _id: any;              
  username: string;         
  email: string;            
  password: string;        
  balance: number;          
  activeBets: mongoose.Types.ObjectId[];
  createdAt: Date;          
  updatedAt: Date;         
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,  
  },
  activeBets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bet',   
  }],
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
