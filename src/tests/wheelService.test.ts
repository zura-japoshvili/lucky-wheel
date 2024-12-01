import mongoose from 'mongoose';
import { ReferenceDataEnum } from '../types/enums/referenceDataEnum';
import WheelConfigModel from '../models/WheelConfigModel';
import BetModel from '../models/BetModel';
import User from '../models/UserModel';
import { generateVerificationHash } from '../utils/verificationHash';
import TransactionModel from '../models/TransactionModel';
import { spinWheel } from '../services/wheelService';

// Mock dependencies
jest.mock('../models/WheelConfigModel');
jest.mock('../models/BetModel');
jest.mock('../models/UserModel');
jest.mock('../models/TransactionModel');
jest.mock('../utils/verificationHash');
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('Wheel Service - spinWheel', () => {
  let mockWheelConfig: any;
  let mockActiveBets: any[];
  let mockUsers: any[];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock Wheel Configuration
    mockWheelConfig = {
      _id: ReferenceDataEnum.MAIN_WHEEL_CONFIG,
      sections: [
        { 
          id: '1', 
          multiplier: 2, 
          probability: 0.5 
        },
        { 
          id: '2', 
          multiplier: 5, 
          probability: 0.3 
        },
        { 
          id: '3', 
          multiplier: 10, 
          probability: 0.2 
        }
      ]
    };

    // Mock Active Bets
    mockActiveBets = [
      {
        _id: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        amount: 50,
        sectionId: 'red',
        status: 'active'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        amount: 100,
        sectionId: 'green',
        status: 'active'
      }
    ];

    // Mock Users
    mockUsers = mockActiveBets.map(bet => ({
      _id: bet.userId,
      balance: 1000,
      activeBets: [bet._id],
      save: jest.fn().mockResolvedValue(true)
    }));

    // Setup mocks
    (WheelConfigModel.findOne as jest.Mock).mockResolvedValue(mockWheelConfig);
    (BetModel.find as jest.Mock).mockResolvedValue(mockActiveBets);
    (User.updateOne as jest.Mock).mockResolvedValue(true);
    (User.updateMany as jest.Mock).mockResolvedValue(true);
    (BetModel.updateMany as jest.Mock).mockResolvedValue(true);
    (TransactionModel.prototype.save as jest.Mock).mockResolvedValue(true);
    (generateVerificationHash as jest.Mock).mockReturnValue('mockHash');
  });

  it('should successfully spin the wheel with active bets', async () => {
    // Spy to track specific user balance update
    const mockUpdateOne = User.updateOne as jest.Mock;

    const result = await spinWheel();

    // Verify wheel configuration was fetched
    expect(WheelConfigModel.findOne).toHaveBeenCalledWith({ 
      _id: ReferenceDataEnum.MAIN_WHEEL_CONFIG 
    });

    // Check return object structure
    expect(result).toHaveProperty('result');
    expect(result).toHaveProperty('verificationHash', 'mockHash');
    expect(result).toHaveProperty('animationData');

    // Verify bets were updated to inactive
    expect(BetModel.updateMany).toHaveBeenCalledWith(
      expect.anything(),
      { $set: { status: 'inactive' } }
    );
  });

  it('should throw error when no wheel configuration found', async () => {
    (WheelConfigModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(spinWheel()).rejects.toThrow('Wheel configuration not found');
  });

  it('should handle scenario with no active bets', async () => {
    (BetModel.find as jest.Mock).mockResolvedValue([]);

    await expect(spinWheel()).rejects.toThrow('No active bets');
  });
});