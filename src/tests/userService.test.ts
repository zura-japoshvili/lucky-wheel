import mongoose from 'mongoose';
import UserModel, { IUser } from '../models/UserModel';
import {
  updateUserBalanceAfterBet,
  validateUserBalance,
  getUserBalanceByUser,
  addBetToActiveBets,
} from '../services/userService';

jest.mock('../models/UserModel'); // Mock the UserModel

describe('User Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

    // Create a utility function to mock a Mongoose document
  const createMockUserDocument = (userData: Partial<IUser>): IUser => {
    return {
      ...userData,
      _id: userData._id || new mongoose.Types.ObjectId(),
      username: userData.username || 'testUser',
      email: userData.email || 'test@example.com',
      password: userData.password || 'hashedPassword',
      balance: userData.balance !== undefined ? userData.balance : 100,
      activeBets: userData.activeBets || [],
      createdAt: userData.createdAt || new Date(),
      updatedAt: userData.updatedAt || new Date(),
      
      // Add Mongoose document methods
      $assertPopulated: jest.fn(),
      $clearModifiedPaths: jest.fn(),
      $clone: jest.fn(),
      $createModifiedPathsSnapshot: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
      toObject: jest.fn().mockReturnValue(userData),
    } as unknown as IUser;
  };

  describe('updateUserBalance', () => {
    it('should update the user balance', async () => {
      const mockUser = {
        _id: 'userId',
        balance: 100,
        save: jest.fn(),
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      await updateUserBalanceAfterBet('userId', 50);

      expect(mockUser.balance).toBe(50);
      expect(mockUser.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user is not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(updateUserBalanceAfterBet('userId', 50)).rejects.toThrow('User not found');
    });
  });

  describe('validateUserBalance', () => {
    it('should validate user balance successfully', async () => {
      const mockUser = {
        _id: 'userId',
        balance: 100,
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await validateUserBalance('userId', 50);

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(validateUserBalance('userId', 50)).rejects.toThrow('User not found');
    });

    it('should throw an error if balance is insufficient', async () => {
      const mockUser = {
        _id: 'userId',
        balance: 40,
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      await expect(validateUserBalance('userId', 50)).rejects.toThrow('Insufficient balance');
    });
  });

  describe('getUserBalanceByUser', () => {
    it('should return the user balance', async () => {
      const mockUser = {
        _id: 'userId',
        balance: 100,
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserBalanceByUser('userId');

      expect(result).toBe(100);
    });

    it('should throw an error if user is not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(getUserBalanceByUser('userId')).rejects.toThrow('User not found');
    });
  });

describe('addBetToActiveBets', () => {
  it('should add a bet to activeBets', async () => {
    // Create a mock bet ID
    const mockBetId = new mongoose.Types.ObjectId();

    // Create a mock user document
    const mockUser = createMockUserDocument({
      activeBets: []
    });

    // Call the function to add bet to active bets
    await addBetToActiveBets(mockUser, mockBetId);

    // Verify the bet was added to activeBets
    expect(mockUser.activeBets).toContain(mockBetId);
    
    // Verify save was called
    expect(mockUser.save).toHaveBeenCalledTimes(1);
  });

  it('should not add duplicate bet to activeBets', async () => {
    // Create a mock bet ID
    const mockBetId = new mongoose.Types.ObjectId();

    // Create a mock user document with an existing bet
    const mockUser = createMockUserDocument({
      activeBets: [mockBetId]
    });

    // Call the function to add bet to active bets
    await addBetToActiveBets(mockUser, mockBetId);

    // Verify the bet was not added again
    expect(mockUser.activeBets[0]).toEqual(mockBetId);
    
  });

  it('should throw error if user is undefined', async () => {
    const mockBetId = new mongoose.Types.ObjectId();

    await expect(addBetToActiveBets(undefined, mockBetId))
      .rejects.toThrow('User is required');
  });

  it('should throw error if bet ID is undefined', async () => {
    const mockUser = createMockUserDocument({});

    await expect(addBetToActiveBets(mockUser, undefined))
      .rejects.toThrow('Bet Id is required');
  });
});
});
