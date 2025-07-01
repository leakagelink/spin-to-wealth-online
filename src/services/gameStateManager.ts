
import { GameHistoryEntry } from "@/types/aviator";

export class GameStateManager {
  static calculateMultiplierIncrease(currentMultiplier: number): number {
    // More realistic multiplier increase - slower at start, faster as it goes higher
    const baseIncrease = 0.01;
    const accelerationFactor = Math.pow((currentMultiplier - 1) * 0.5 + 1, 1.2);
    const randomVariation = Math.random() * 0.02 + 0.005;
    return baseIncrease * accelerationFactor + randomVariation;
  }

  static calculateCrashProbability(multiplier: number): number {
    let crashProbability;
    if (multiplier < 1.5) {
      crashProbability = 0.001; // Very low chance early on
    } else if (multiplier < 2.0) {
      crashProbability = 0.005;
    } else if (multiplier < 3.0) {
      crashProbability = 0.015;
    } else if (multiplier < 5.0) {
      crashProbability = 0.03;
    } else if (multiplier < 10.0) {
      crashProbability = 0.06;
    } else {
      crashProbability = 0.12; // Higher chance at very high multipliers
    }
    
    // Add some randomness to make it less predictable
    return crashProbability + Math.random() * 0.01;
  }

  static shouldCrash(multiplier: number): boolean {
    const crashProbability = this.calculateCrashProbability(multiplier);
    return Math.random() < crashProbability;
  }

  static createHistoryEntry(
    currentBet: number,
    multiplier: number,
    cashedOut: boolean,
    status: 'win' | 'loss'
  ): GameHistoryEntry {
    const result = cashedOut 
      ? `Cashed out at ${multiplier.toFixed(2)}x`
      : `Crashed at ${multiplier.toFixed(2)}x`;
    
    const payout = cashedOut 
      ? Math.floor(currentBet * multiplier) - currentBet
      : -currentBet;

    return {
      id: Date.now().toString(),
      game: "Aviator",
      bet: currentBet,
      result,
      payout,
      timestamp: new Date(),
      status
    };
  }
}
