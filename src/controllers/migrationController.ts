import { Request, Response } from 'express';
import { createInitialConfig } from '../services/migrationService';
import logger from '../utils/logger';

export const runMigration = async (req: Request, res: Response) => {
  try {
    await createInitialConfig();
    res.status(200).json({ message: 'Migration completed successfully' });
  } catch (err: any) {
    logger.error("Migration failed " + err.message)
    res.status(500).json({ message: 'Error during migration' });
  }
};