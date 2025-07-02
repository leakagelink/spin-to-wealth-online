
import { WalletService } from "./walletService";
import { GameStateManager } from "./gameStateManager";
import { GameHistoryEntry } from "@/types/aviator";

export class BettingService {
  static async placeBet(
    betAmount: string,
    balance: number,
    userId: string
  ): Promise<{ success: boolean; newBalance?: number; bet?: number; error?: string }> {
    const bet = parseFloat(betAmount);
    if (!bet || bet <= 0 || bet > balance) {
      return { 
        success: false, 
        error: "Please enter a valid bet amount" 
      };
    }

    // Ensure wallet exists first
    await WalletService.ensureWalletExists(userId);

    const newBalance = balance - bet;
    console.log('Placing aviator bet:', bet, 'New balance should be:', newBalance);
    
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

  static async cashOut(
    currentBet: number,
    multiplier: number,
    balance: number,
    userId: string
  ): Promise<{ success: boolean; newBalance?: number; winnings?: number; historyEntry?: GameHistoryEntry; error?: string }> {
    if (currentBet <= 0) {
      return { 
        success: false, 
        error: "No active bet to cash out" 
      };
    }
    
    const winnings = Math.floor(currentBet * multiplier);
    const newBalance = balance + winnings;
    console.log('Aviator cash out - Bet:', currentBet, 'Multiplier:', multiplier, 'Winnings:', winnings, 'New balance should be:', newBalance);
    
    const updateSuccess = await WalletService.updateWalletBalance(userId, newBalance);
    if (!updateSuccess) {
      return { 
        success: false, 
        error: "Failed to update wallet balance" 
      };
    }
    
    const historyEntry = GameStateManager.createHistoryEntry(
      currentBet,
      multiplier,
      true,
      'win'
    );
    
    return { 
      success: true, 
      newBalance, 
      winnings,
      historyEntry
    };
  }
}
