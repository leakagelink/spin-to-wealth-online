
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { GameHistoryEntry } from "@/types/aviator";
import { useAuth } from "@/components/AuthContext";
import { WalletService } from "@/services/walletService";
import { GameStateManager } from "@/services/gameStateManager";
import { BettingService } from "@/services/bettingService";

export const useAviatorGame = () => {
  const { user } = useAuth();
  const [betAmount, setBetAmount] = useState("");
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [highestMultiplier, setHighestMultiplier] = useState(1.00);
  const { toast } = useToast();

  // Fetch initial wallet balance
  useEffect(() => {
    if (user) {
      fetchWalletBalance();
    }
  }, [user]);

  const fetchWalletBalance = async () => {
    if (!user) return;
    
    console.log('Fetching wallet balance for aviator user:', user.id);
    const walletBalance = await WalletService.fetchWalletBalance(user.id);
    if (walletBalance !== null) {
      console.log('Setting aviator balance to:', walletBalance);
      setBalance(walletBalance);
    } else {
      console.log('Failed to fetch aviator wallet balance, keeping default');
    }
  };

  // Game loop effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !cashedOut) {
      interval = setInterval(() => {
        setMultiplier((prev) => {
          const increase = GameStateManager.calculateMultiplierIncrease(prev);
          const newMultiplier = prev + increase;
          
          if (newMultiplier > highestMultiplier) {
            setHighestMultiplier(newMultiplier);
          }
          
          if (GameStateManager.shouldCrash(newMultiplier)) {
            setGameStarted(false);
            setIsFlying(false);
            
            const historyEntry = GameStateManager.createHistoryEntry(
              currentBet,
              newMultiplier,
              cashedOut,
              cashedOut ? 'win' : 'loss'
            );
            setGameHistory(prev => [historyEntry, ...prev]);
            
            if (!cashedOut && currentBet > 0) {
              console.log('Aviator crashed - player lost bet:', currentBet);
              toast({
                title: "💥 Plane Crashed!",
                description: `Crashed at ${newMultiplier.toFixed(2)}x - Lost ₹${currentBet}`,
                variant: "destructive",
              });
            }
            
            setTimeout(() => {
              setMultiplier(1.00);
              setCurrentBet(0);
              setCashedOut(false);
            }, 3000);
          }
          return newMultiplier;
        });
      }, 80);
    }

    return () => clearInterval(interval);
  }, [gameStarted, cashedOut, currentBet, toast, highestMultiplier]);

  const placeBet = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place a bet",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting aviator bet with amount:', betAmount);
    
    const result = await BettingService.placeBet(betAmount, balance, user.id);
    
    if (!result.success) {
      toast({
        title: "Invalid bet",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    console.log('Aviator bet placed successfully, updating balance to:', result.newBalance);
    setCurrentBet(result.bet!);
    setBalance(result.newBalance!);
    setGameStarted(true);
    setIsFlying(true);
    setCashedOut(false);
    setBetAmount("");
    
    toast({
      title: "🚀 Flight Started!",
      description: `You bet ₹${result.bet}. Watch the plane soar!`,
    });
  };

  const cashOut = async () => {
    if (!gameStarted || cashedOut || currentBet <= 0 || !user) return;
    
    console.log('Attempting to cash out aviator bet...');
    
    const result = await BettingService.cashOut(currentBet, multiplier, balance, user.id);
    
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      return;
    }
    
    console.log('Aviator cash out successful, new balance:', result.newBalance);
    setBalance(result.newBalance!);
    setCashedOut(true);
    setGameStarted(false);
    setIsFlying(false);
    
    if (result.historyEntry) {
      setGameHistory(prev => [result.historyEntry!, ...prev]);
    }
    
    toast({
      title: "💰 Perfect Timing!",
      description: `Cashed out at ${multiplier.toFixed(2)}x - Won ₹${result.winnings! - currentBet}`,
    });

    setTimeout(() => {
      setMultiplier(1.00);
      setCurrentBet(0);
    }, 2000);
  };

  return {
    betAmount,
    setBetAmount,
    multiplier,
    isFlying,
    gameStarted,
    cashedOut,
    balance,
    currentBet,
    gameHistory,
    highestMultiplier,
    placeBet,
    cashOut
  };
};
