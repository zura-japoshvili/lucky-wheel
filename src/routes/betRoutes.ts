import express from 'express';
import { createBet } from '../controllers/betControllers';

const router = express.Router();

router.post('/bet', async (req, res) => {
    try {
        await createBet(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;