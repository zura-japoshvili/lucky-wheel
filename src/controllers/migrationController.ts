import { Request, Response } from 'express';
import { createInitialConfig } from '../services/migrationService';

export const runMigration = async (req: Request, res: Response) => {
  try {
    await createInitialConfig();
    res.status(200).json({ message: 'Migration completed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error during migration' });
  }
};