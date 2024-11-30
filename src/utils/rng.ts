import crypto from 'crypto';
interface WheelSection {
    id: string;
    name: string;
    multiplier: number;
    probability: number;
  }

/**
 * Spinning a wheel and selecting a random section based on probability weights.
 * 
 * This function takes an array of wheel sections and uses cryptographic randomness to 
 * pick a section based on the provided probability weights. The sum of all probabilities 
 * must equal 1, and an error is thrown if this is not the case.
 * 
 * @param {WheelSection[]} wheelSections - An array of wheel sections, each with an `id`, `name`, `multiplier`, and `probability`.
 * @returns {WheelSection} - The randomly selected wheel section.
 * @throws {Error} - Throws an error if the sum of probabilities is not equal to 1.
 */
export function spinWheelRNG(wheelSections: WheelSection[]): WheelSection {
    // First, check that the sum of probabilities is approximately 1.
    const totalProbability = wheelSections.reduce((sum, section) => sum + section.probability, 0);
    if (Math.abs(totalProbability - 1) > 0.001) {
      throw new Error('The sum of probabilities must equal 1.');
    }
  
    // Generate a cryptographically secure random number between 0 and 1.
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32LE(0) / 0xFFFFFFFF;
  
    // Select a section based on the cumulative probability.
    let cumulativeProbability = 0;
    for (const section of wheelSections) {
      cumulativeProbability += section.probability;
      if (randomNumber <= cumulativeProbability) {
        return section;
      }
    }
  
    // Fallback to the last section in case of floating-point errors.
    return wheelSections[wheelSections.length - 1];
  }
  