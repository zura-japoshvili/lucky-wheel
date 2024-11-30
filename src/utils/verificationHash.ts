import crypto from 'crypto';

export function generateVerificationHash(segment: any): string {
  const data = JSON.stringify(segment); // Serialize the winning segment
  return crypto.createHash('sha256').update(data).digest('hex'); // Create hash
}