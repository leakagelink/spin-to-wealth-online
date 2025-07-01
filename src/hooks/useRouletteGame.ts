
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { BetOption, GameHistoryEntry } from "@/types/roulette";
import { useAuth } from "@/components/AuthContext";
import { WalletService } from "@/services/walletService";
import { RouletteGameService } from "@/services/rouletteGameService";
import { RouletteBettingService } from "@/services/rouletteBettingService";
import { RouletteAnimationService } from "@/services/rouletteAnimationService";

export const useRouletteGame = () => {
  const { user } = useAuth();
  const [betAmount, setBetAmount] = useState("");
  const [selectedBet, setSelectedBet] = useState<string>("");
  const [balance, setBalance] = useState(1000);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [ballPosition, setBallPosition] = useState(0);
  const { toast } = useToast();

  const betOptions: BetOption[] = [
    { name: "Red", value: "red", multiplier: 2, color: "bg-red-500 hover:bg-red-600", icon: "🔴" },
    { name: "Black", value: "black", multiplier: 2, color: "bg-gray-900 hover:bg-gray-800", icon: "⚫" },
    { name: "Even", value: "even", multiplier: 2, color: "bg-blue-500 hover:bg-blue-600", icon: "2️⃣" },
    { name: "Odd", value: "odd", multiplier: 2, color: "bg-purple-500 hover:bg-purple-600", icon: "1️⃣" },
    { name: "1-18", value: "low", multiplier: 2, color: "bg-green-500 hover:bg-green-600", icon: "📉" },
    { name: "19-36", value: "high", multiplier: 2, color: "bg-orange-500 hover:bg-orange-600", icon: "📈" },
  ];

  // Fetch initial wallet balance
  useEffect(() => {
    if (user) {
      fetchWalletBalance();
    }
  }, [user]);

  const fetchWalletBalance = async () => {
    if (!user) return;
    
    const walletBalance = await WalletService.fetchWalletBalance(user.id);
    if (walletBalance !== null) {
      setBalance(walletBalance);
    }
  };

  const spinWheel = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place a bet",
        variant: "destructive",
      });
      return;
    }

    const result = await RouletteBettingService.placeBet(betAmount, balance, user.id, selectedBet);
    
    if (!result.success) {
      toast({
        title: result.error?.includes("bet type") ? "No bet selected" : "Invalid bet",
        description: result.error,
        variant: "destructive",
      });
      return;
    }
    
    setBalance(result.newBalance!);
    setSpinning(true);
    setResult(null);
    
    const resultNumber = RouletteGameService.generateRandomNumber();
    const bet = result.bet!;
    
    RouletteAnimationService.startBallAnimation(
      resultNumber,
      setBallPosition,
      async () => {
        setResult(resultNumber);
        setSpinning(false);
        
        const selectedBetOption = betOptions.find(option => option.value === selectedBet);
        const isWin = RouletteGameService.checkWin(resultNumber, selectedBet);
        
        if (isWin && selectedBetOption) {
          const winResult = await RouletteBettingService.processWin(
            bet,
            selectedBetOption.multiplier,
            result.newBalance!,
            user.id,
            resultNumber
          );
          
          if (winResult.success) {
            setBalance(winResult.newBalance!);
            if (winResult.historyEntry) {
              setGameHistory(prev => [winResult.historyEntry!, ...prev]);
            }
            
            toast({
              title: "🎉 Congratulations! You Won!",
              description: `Number ${resultNumber} (${RouletteGameService.getNumberColor(resultNumber)}) - Won ₹${winResult.winnings! - bet}`,
            });
          }
        } else {
          const historyEntry = RouletteBettingService.createLossHistoryEntry(bet, resultNumber);
          setGameHistory(prev => [historyEntry, ...prev]);
          
          toast({
            title: "Better luck next time!",
            description: `Number ${resultNumber} (${RouletteGameService.getNumberColor(resultNumber)}) - Lost ₹${bet}`,
            variant: "destructive",
          });
        }
        
        // Auto-clear after showing result
        setTimeout(() => {
          setBetAmount("");
          setSelectedBet("");
          setResult(null);
        }, 5000);
      }
    );
  };

  return {
    // State
    betAmount,
    setBetAmount,
    selectedBet,
    setSelectedBet,
    balance,
    spinning,
    result,
    gameHistory,
    ballPosition,
    
    // Constants
    numbers: RouletteGameService.numbers,
    redNumbers: RouletteGameService.redNumbers,
    blackNumbers: RouletteGameService.blackNumbers,
    betOptions,
    
    // Functions
    getNumberColor: RouletteGameService.getNumberColor,
    checkWin: RouletteGameService.checkWin,
    spinWheel,
  };
};
