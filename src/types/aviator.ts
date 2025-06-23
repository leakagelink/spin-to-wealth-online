
export interface GameHistoryEntry {
  id: string;
  game: string;
  bet: number;
  result: string;
  payout: number;
  timestamp: Date;
  status: 'win' | 'loss';
}

export interface AviatorGameState {
  betAmount: string;
  multiplier: number;
  isFlying: boolean;
  gameStarted: boolean;
  cashedOut: boolean;
  balance: number;
  currentBet: number;
  gameHistory: GameHistoryEntry[];
  highestMultiplier: number;
}
