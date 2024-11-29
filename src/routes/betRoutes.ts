import express from 'express';
import { createBet } from '../controllers/betControllers';
import { validateDto } from '../middlewares/validateDto';
import { PlaceBetDto } from '../types/dtos/placeBetDto';
import logger from '../utils/logger';

const router = express.Router();


/**
 * @swagger
 * /api/bet/place:
 *   post:
 *     summary: Place a bet
 *     description: Allows a user to place a bet on a specific section of the wheel.
 *     tags:
 *       - Bet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount of money being bet
 *               sectionId:
 *                 type: string
 *                 description: The ID of the section on the wheel
 *             example:
 *               amount: 10
 *               sectionId: "1"
 *     responses:
 *       201:
 *         description: Bet placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the operation was successful
 *                 message:
 *                   type: string
 *                   description: A success message
 *                 betId:
 *                   type: string
 *                   description: The ID of the created bet
 *               example:
 *                 success: true
 *                 message: "Bet created successfully"
 *                 betId: "123456789"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 message: "Insufficient balance"
 *       500:
 *         description: Internal server error
 */


router.post('/place', validateDto(PlaceBetDto) ,async (req, res) => {
    try {
        await createBet(req, res);
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;