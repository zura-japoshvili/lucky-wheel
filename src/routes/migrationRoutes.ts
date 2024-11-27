import { Router } from 'express';
import { runMigration } from '../controllers/migrationController';

const router = Router();

/**
 * @swagger
 * /api/migration/run:
 *   post:
 *     summary: Run the migration to initialize data
 *     description: This endpoint triggers the migration process to initialize the data in the database.
 *     tags:
 *       - Migration
 *     responses:
 *       200:
 *         description: Migration successfully executed and data initialized
 *       500:
 *         description: Error occurred while running the migration
 */
router.post('/run', runMigration);

export default router;
