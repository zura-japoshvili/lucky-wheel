import { createBet } from '../controllers/betControllers';
import BetModel from '../models/Bets';
import TransactionModel from '../models/Transaction';
import User from '../models/User';
import { getUserBetValidation } from '../services/betService';
import mongoose from 'mongoose';

// Mock dependencies
jest.mock('../models/User');
jest.mock('../models/Bets');
jest.mock('../models/Transaction');
jest.mock('../services/betService');
jest.mock('../utils/logger', () => ({
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
}));

describe('Betting Controller', () => {
  let mockUser: any;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create mock user
    mockUser = {
      _id: new mongoose.Types.ObjectId(),
      balance: 1000,
      activeBets: [],
      save: jest.fn().mockResolvedValue(true)
    };

    // Mock Request object
    mockReq = {
      body: {
        amount: 50,
        sectionId: '1'
      },
      user: {
        userId: mockUser._id.toString()
      }
    };

    // Mock Response object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Setup User.findById mock
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    // Mock getUserBetValidation
    (getUserBetValidation as jest.Mock).mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      userId: mockUser._id,
      amount: 50,
      sectionId: '1',
      status: 'active'
    });

    // Setup BetModel.save mock
    (BetModel.prototype.save as jest.Mock).mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      userId: mockUser._id,
      amount: 50,
      sectionId: '1',
      status: 'active'
    });

    // Setup TransactionModel.save mock
    (TransactionModel.prototype.save as jest.Mock).mockResolvedValue(true);
  });

  describe('createBet', () => {
    it('should create a bet successfully', async () => {
      await createBet(mockReq as any, mockRes as any);

      // Verify service validation was called
      expect(getUserBetValidation).toHaveBeenCalledWith(
        mockUser._id.toString(), 
        50, 
        '1'
      );

      // Check user balance was reduced
      expect(mockUser.balance).toBe(950);

      // Check response
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Bet created successfully'
        })
      );

      // Verify bet was saved
      expect(BetModel.prototype.save).toHaveBeenCalled();

      // Verify transaction was saved
      expect(TransactionModel.prototype.save).toHaveBeenCalled();
    });

    it('should handle user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await createBet(mockReq as any, mockRes as any);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Error creating bet' 
      });
    });

    it('should handle bet validation errors', async () => {
      (getUserBetValidation as jest.Mock).mockRejectedValue(
        new Error('Invalid bet amount')
      );

      await createBet(mockReq as any, mockRes as any);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Error creating bet' 
      });
    });
  });
});