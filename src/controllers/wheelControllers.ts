import { Request, Response } from 'express';
import Wheel from '../models/Wheel';
import { ReferenceDataEnum } from '../types/enums/referenceDataEnum';
// import { generateRandomNumber } from '../utils/randomGenerator';

import WheelConfigModel from '../models/WheelConfigModel';

const getWheelConfig = async (req: Request, res: Response) => {
  try {
    const config = await WheelConfigModel.findOne({ _id: ReferenceDataEnum.MAIN_WHEEL_CONFIG});
    if (!config) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    return res.status(200).json(config); 
  } catch (err) {
    console.error('Error fetching configuration:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export { getWheelConfig };