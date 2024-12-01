import mongoose from 'mongoose';

const wheelSchema = new mongoose.Schema({
  winningNumber: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WheelModel = mongoose.model('Wheel', wheelSchema);

export default WheelModel;