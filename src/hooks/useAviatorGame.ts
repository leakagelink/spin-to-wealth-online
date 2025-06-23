
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { GameHistoryEntry, AviatorGameState } from "@/types/aviator";

export const useAviatorGame = () => {
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !cashedOut) {
      interval = setInterval(() => {
        setMultiplier((prev) => {
          const increase = Math.random() * 0.05 + 0.01;
          const newMultiplier = prev + increase;
          
          if (newMultiplier > highestMultiplier) {
            setHighestMultiplier(newMultiplier);
          }
          
          const crashProbability = Math.min((newMultiplier - 1) * 0.1, 0.3);
          if (Math.random() < crashProbability) {
            setGameStarted(false);
            setIsFlying(false);
            
            const historyEntry: GameHistoryEntry = {
              id: Date.now().toString(),
              game: "Aviator",
              bet: currentBet,
              result: `Crashed at ${newMultiplier.toFixed(2)}x`,
              payout: cashedOut ? Math.floor(currentBet * multiplier) - currentBet : -currentBet,
              timestamp: new Date(),
              status: cashedOut ? 'win' : 'loss'
            };
            setGameHistory(prev => [historyEntry, ...prev]);
            
            if (!cashedOut && currentBet > 0) {
              toast({
                title: "✈️ Plane Crashed!",
                description: `Crashed at ${newMultiplier.toFixed(2)}x - Lost ₹${currentBet}`,
                variant: "destructive",
              });
            }
            setTimeout(() => {
              setMultiplier(1.00);
              setCurrentBet(0);
              setCashedOut(false);
            }, 2000);
          }
          return newMultiplier;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [gameStarted, cashedOut, currentBet, toast, multiplier, highestMultiplier]);

  const placeBet = () => {
    const bet = parseFloat(betAmount);
    if (!bet || bet <= 0 || bet > balance) {
      toast({
        title: "Invalid bet",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    setCurrentBet(bet);
    setBalance(balance - bet);
    setGameStarted(true);
    setIsFlying(true);
    setCashedOut(false);
    setBetAmount("");
    
    toast({
      title: "🚀 Flight Started!",
      description: `You bet ₹${bet}. Watch the plane soar!`,
    });
  };

  const cashOut = () => {
    if (!gameStarted || cashedOut || currentBet <= 0) return;
    
    const winnings = Math.floor(currentBet * multiplier);
    setBalance(balance + winnings);
    setCashedOut(true);
    setGameStarted(false);
    setIsFlying(false);
    
    const historyEntry: GameHistoryEntry = {
      id: Date.now().toString(),
      game: "Aviator",
      bet: currentBet,
      result: `Cashed out at ${multiplier.toFixed(2)}x`,
      payout: winnings - currentBet,
      timestamp: new Date(),
      status: 'win'
    };
    setGameHistory(prev => [historyEntry, ...prev]);
    
    toast({
      title: "💰 Perfect Timing!",
      description: `Cashed out at ${multiplier.toFixed(2)}x - Won ₹${winnings - currentBet}`,
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
