
import { WalletService } from "./walletService";
import { GameHistoryEntry } from "@/types/roulette";
import { RouletteGameService } from "./rouletteGameService";

export class RouletteBettingService {
  static async placeBet(
    betAmount: string,
    balance: number,
    userId: string,
    selectedBet: string
  ): Promise<{ success: boolean; newBalance?: number; bet?: number; error?: string }> {
    const bet = parseFloat(betAmount);
    if (!bet || bet <= 0 || bet > balance) {
      return { 
        success: false, 
        error: "Please enter a valid bet amount" 
      };
    }

    if (!selectedBet) {
      return { 
        success: false, 
        error: "Please select a bet type" 
      };
    }

    // Ensure wallet exists first
    await WalletService.ensureWalletExists(userId);

    const newBalance = balance - bet;
    console.log('Placing roulette bet:', bet, 'New balance should be:', newBalance);
    
    const updateSuccess = await WalletService.updateWalletBalance(userId, newBalance);
    if (!updateSuccess) {
      return { 
        success: false, 
        error: "Failed to update wallet balance" 
      };
    }

    return { 
      success: true, 
      newBalance, 
      bet 
    };
  }

  static async processWin(
    bet: number,
    multiplier: number,
    balance: number,
    userId: string,
    resultNumber: number
  ): Promise<{ success: boolean; newBalance?: number; winnings?: number; historyEntry?: GameHistoryEntry; error?: string }> {
    const winnings = RouletteGameService.calculateWinnings(bet, multiplier);
    const finalBalance = balance + winnings;
    console.log('Roulette win! Bet:', bet, 'Winnings:', winnings, 'Final balance should be:', finalBalance);
    
    const updateSuccess = await WalletService.updateWalletBalance(userId, finalBalance);
    if (!updateSuccess) {
      return { 
        success: false, 
        error: "Failed to update wallet balance after win" 
      };
    }
    
    const historyEntry: GameHistoryEntry = {
      id: Date.now().toString(),
      game: "Roulette",
      bet: bet,
      result: `${resultNumber} (${RouletteGameService.getNumberColor(resultNumber)})`,
      payout: winnings - bet,
      timestamp: new Date(),
      status: 'win'
    };
    
    return { 
      success: true, 
      newBalance: finalBalance, 
      winnings,
      historyEntry
    };
  }

  static createLossHistoryEntry(bet: number, resultNumber: number): GameHistoryEntry {
    return {
      id: Date.now().toString(),
      game: "Roulette",
      bet: bet,
      result: `${resultNumber} (${RouletteGameService.getNumberColor(resultNumber)})`,
      payout: -bet,
      timestamp: new Date(),
      status: 'loss'
    };
  }
}
