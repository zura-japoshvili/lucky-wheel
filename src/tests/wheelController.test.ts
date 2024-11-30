import { getWheelConfig, spin } from "../controllers/wheelControllers";
import WheelConfigModel from "../models/WheelConfigModel";
import { spinWheel } from "../services/wheelService";
import { ReferenceDataEnum } from "../types/enums/referenceDataEnum";

// Mock dependencies
jest.mock('../models/WheelConfigModel');
jest.mock('../services/wheelService');
jest.mock('../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn()
}));

describe('Wheel Controller', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock Request object
    mockReq = {};

    // Mock Response object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getWheelConfig', () => {
    it('should return wheel configuration successfully', async () => {
      const mockConfig = {
        _id: ReferenceDataEnum.MAIN_WHEEL_CONFIG,
        sections: [
          { id: '1', multiplier: 2 },
          { id: '2', multiplier: 5 }
        ]
      };

      (WheelConfigModel.findOne as jest.Mock).mockResolvedValue(mockConfig);

      await getWheelConfig(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockConfig);
    });

    it('should return 404 when configuration not found', async () => {
      (WheelConfigModel.findOne as jest.Mock).mockResolvedValue(null);

      await getWheelConfig(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Configuration not found' });
    });

    it('should return 500 on server error', async () => {
      (WheelConfigModel.findOne as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await getWheelConfig(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('spin', () => {
    it('should successfully spin the wheel', async () => {
      const mockSpinResult = {
        winningSection: {
          id: '2',
          multiplier: 2
        }
      };

      (spinWheel as jest.Mock).mockResolvedValue({
        result: { id: '2' }
      });

      await spin(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        winningSection: '2'
      });
    });

    it('should return 500 on spin error', async () => {
      (spinWheel as jest.Mock).mockRejectedValue(new Error('Spin failed'));

      await spin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error spinning the wheel' });
    });
  });
});