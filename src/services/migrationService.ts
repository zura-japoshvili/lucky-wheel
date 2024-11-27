import WheelConfigModel from "../models/WheelConfigModel";
import { ReferenceDataEnum } from "../types/enums/referenceDataEnum";

const initialWheelConfig = [
  {id: '1', name: 'Section 1', multiplier: 1 },
  {id: '2', name: 'Section 2', multiplier: 2 },
  {id: '3', name: 'Section 3', multiplier: 3 },
  {id: '4', name: 'Section 4', multiplier: 5 },
  {id: '5', name: 'Section 5', multiplier: 1 },
  {id: '6', name: 'Section 6', multiplier: 2 },
  {id: '7', name: 'Section 7', multiplier: 3 },
  {id: '8', name: 'Section 8', multiplier: 5 }
];

const createInitialConfig = async () => {
  try {
    const existingConfig = await WheelConfigModel.findOne({_id: ReferenceDataEnum.MAIN_WHEEL_CONFIG }); 
    
    if (!existingConfig) {
      // If no config exists, create it with a predefined ID
      const config = await WheelConfigModel.create({
        _id: ReferenceDataEnum.MAIN_WHEEL_CONFIG,  // Use predefined ID from Enum
        sections: initialWheelConfig
      });

      console.log('Wheel configuration initialized:', config);
    } else {
      console.log('Configuration already exists.');
    }
  } catch (err) {
    console.error('Error initializing configuration:', err);
  }
};

export { createInitialConfig };