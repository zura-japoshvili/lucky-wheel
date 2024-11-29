import express from 'express';
import { getUserBalance, getUserHistory } from '../controllers/userController';
import logger from '../utils/logger';

const router = express.Router();


/**
 * @swagger
 * /api/user/history:
 *   get:
 *     summary: Get user history
 *     description: Retrieves the user's transaction history and betting history.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User history successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: The type of history entry (e.g., 'transaction' or 'bet')
 *                       data:
 *                         type: object
 *                         description: The data of the history entry (details of the transaction or bet)
 *       500:
 *         description: Internal server error
 */
router.get('/history', async (req, res) => {
    try {
        const history = await getUserHistory(req, res); // Get user history logic
        res.status(200).json({ history }); // Return the response with the retrieved history
    } catch (error) {
        logger.error('Error fetching user history:', error);
        res.status(500).json({ message: 'Error fetching user history' });
    }
});

/**
 * @swagger
 * /api/user/balance:
 *   get:
 *     summary: Get user balance
 *     description: Retrieves the current balance of the user.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User balance successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: The current balance of the user
 *       500:
 *         description: Internal server error
 */
router.get('/balance', async (req, res) => {
    try {
        // Retrieve user balance
        const balance = await getUserBalance(req, res); // Get user balance logic
        res.status(200).json({ balance }); // Return the response with the retrieved balance
    } catch (error) {
        logger.error('Error fetching user balance:', error);
        res.status(500).json({ message: 'Error fetching user balance' });
    }
});


export default router;