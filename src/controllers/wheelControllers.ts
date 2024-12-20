import { Request, Response } from 'express';
import { ReferenceDataEnum } from '../types/enums/referenceDataEnum';

import WheelConfigModel from '../models/WheelConfigModel';
import { spinWheel } from '../services/wheelService';
import logger from '../utils/logger';

const getWheelConfig = async (req: Request, res: Response) => {
  try {
    const config = await WheelConfigModel.findOne({ _id: ReferenceDataEnum.MAIN_WHEEL_CONFIG});
    if (!config) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    return res.status(200).json(config); 
  } catch (err) {
    logger.error('Error fetching configuration:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const spin = async (req: Request, res: Response) => {
  try {

    const results = await spinWheel();
    res.json({
      ...results
    });
  } catch (error) {
    logger.error('Error spinning the wheel:', error);
    res.status(500).json({ message: 'Error spinning the wheel' });
  }
};


export { getWheelConfig };