import mongoose, { Schema, Document } from 'mongoose';
import logger from '../utils/logger';

interface WheelConfig extends Document {
  sections: {
    id: string;
    name: string;
    multiplier: number;
    probability: number;
  }[];
}

const WheelConfigSchema = new Schema<WheelConfig>({
  sections: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      multiplier: { type: Number, required: true },
      probability: {
        type: Number,
        required: true,
        validate: {
          validator: (value: number) => value >= 0 && value <= 1,
          message: 'Probability must be between 0 and 1',
        },
      },

    },
  ],
});


// Ensure that total probability of all sections equals 1 before saving
WheelConfigSchema.pre('save', function (next) {
  const totalProbability = this.sections.reduce((sum, section) => sum + section.probability, 0);
  logger.info(`Total probability of all sections equals ${totalProbability}`);
  if (totalProbability !== 1) {
    return next(new Error('Total probability must equal 1'));
  }
  next();
});

const WheelConfigModel = mongoose.model<WheelConfig>('WheelConfig', WheelConfigSchema);

export default WheelConfigModel;