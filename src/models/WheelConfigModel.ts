import mongoose, { Schema, Document } from 'mongoose';

interface WheelConfig extends Document {
  sections: {
    name: string;
    multiplier: number;
  }[];
}

const WheelConfigSchema = new Schema<WheelConfig>({
  sections: [
    {
      name: { type: String, required: true },
      multiplier: { type: Number, required: true },
    },
  ],
});

const WheelConfigModel = mongoose.model<WheelConfig>('WheelConfig', WheelConfigSchema);

export default WheelConfigModel;