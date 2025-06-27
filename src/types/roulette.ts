
export interface BetOption {
  name: string;
  value: string;
  multiplier: number;
  color: string;
  icon: string;
}

export interface GameHistoryEntry {
  id: string;
  game: string;
  bet: number;
  result: string;
  payout: number;
  timestamp: Date;
  status: 'win' | 'loss';
}

export interface RouletteGameState {
  betAmount: string;
  selectedBet: string;
  balance: number;
  spinning: boolean;
  result: number | null;
  gameHistory: GameHistoryEntry[];
  ballPosition: number;
}
