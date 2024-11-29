import express from 'express';
import { getWheelConfig, spin } from '../controllers/wheelControllers';
import logger from '../utils/logger';

const router = express.Router();

/**
 * @swagger
 * /api/wheel/config:
 *   get:
 *     summary: Get the wheel configuration
 *     description: Returns the current configuration of the wheel with sections and their multipliers.
 *     tags:
 *       - wheel
 *     responses:
 *       200:
 *         description: Wheel configuration successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sections:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       multiplier:
 *                         type: integer
 *       404:
 *         description: Configuration not found
 *       500:
 *         description: Internal server error
 */
router.get('/config', async (req, res) => {
    try {
        const config = await getWheelConfig(req, res); // Get wheel config logic
        res.status(200).json(config); // Return the response with the retrieved configuration
    } catch (error) {
        logger.error('Error fetching configuration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/wheel/spin:
 *   post:
 *     summary: Spin the wheel
 *     description: Spins the wheel and determines the winning section. Updates user balances for active bets.
 *     tags:
 *       - wheel
 *     responses:
 *       200:
 *         description: Wheel spun successfully, and the winning section is returned
 *       404:
 *         description: Wheel configuration not found
 *       500:
 *         description: Internal server error
 */
router.post('/spin', async (req, res) => {
    try {
        const result = await spin(req, res); // Logic for spinning the wheel
        res.status(200).json(result); // Send winning section as response
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
