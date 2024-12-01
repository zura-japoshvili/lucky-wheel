import WheelConfigModel from "../models/WheelConfigModel";
import { ReferenceDataEnum } from "../types/enums/referenceDataEnum";
import logger from "../utils/logger";

const initialWheelConfig = [
  { id: '1', name: 'Section 1', multiplier: 1, probability: 0.255 },
  { id: '2', name: 'Section 2', multiplier: 2, probability: 0.13 },
  { id: '3', name: 'Section 3', multiplier: 3, probability: 0.085 },
  { id: '4', name: 'Section 4', multiplier: 5, probability: 0.030 },
  { id: '5', name: 'Section 5', multiplier: 1, probability: 0.255 },
  { id: '6', name: 'Section 6', multiplier: 2, probability: 0.13 },
  { id: '7', name: 'Section 7', multiplier: 3, probability: 0.085 },
  { id: '8', name: 'Section 8', multiplier: 5, probability: 0.030 }
]



const createInitialConfig = async () => {
  try {
    const existingConfig = await WheelConfigModel.findOne({_id: ReferenceDataEnum.MAIN_WHEEL_CONFIG }); 
    
    if (!existingConfig) {
      // If no config exists, create it with a predefined ID
      await WheelConfigModel.create({
        _id: ReferenceDataEnum.MAIN_WHEEL_CONFIG,  // Use predefined ID from Enum
        sections: initialWheelConfig
      });

      logger.info('Wheel configuration initialized:', initialWheelConfig)

    } else {
      logger.warn("Configuration already exists")
    }
  } catch (err) {
    logger.error('Error initializing configuration:', err);
  }
};

export { createInitialConfig };