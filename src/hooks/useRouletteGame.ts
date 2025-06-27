
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BetOption, GameHistoryEntry, RouletteGameState } from "@/types/roulette";

export const useRouletteGame = () => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedBet, setSelectedBet] = useState<string>("");
  const [balance, setBalance] = useState(1000);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [ballPosition, setBallPosition] = useState(0);
  const { toast } = useToast();

  const numbers = Array.from({ length: 37 }, (_, i) => i);
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  const betOptions: BetOption[] = [
    { name: "Red", value: "red", multiplier: 2, color: "bg-red-500 hover:bg-red-600", icon: "🔴" },
    { name: "Black", value: "black", multiplier: 2, color: "bg-gray-900 hover:bg-gray-800", icon: "⚫" },
    { name: "Even", value: "even", multiplier: 2, color: "bg-blue-500 hover:bg-blue-600", icon: "2️⃣" },
    { name: "Odd", value: "odd", multiplier: 2, color: "bg-purple-500 hover:bg-purple-600", icon: "1️⃣" },
    { name: "1-18", value: "low", multiplier: 2, color: "bg-green-500 hover:bg-green-600", icon: "📉" },
    { name: "19-36", value: "high", multiplier: 2, color: "bg-orange-500 hover:bg-orange-600", icon: "📈" },
  ];

  const getNumberColor = (num: number) => {
    if (num === 0) return "green";
    if (redNumbers.includes(num)) return "red";
    if (blackNumbers.includes(num)) return "black";
    return "black";
  };

  const checkWin = (resultNumber: number, bet: string) => {
    if (bet === "red" && redNumbers.includes(resultNumber)) return true;
    if (bet === "black" && blackNumbers.includes(resultNumber)) return true;
    if (bet === "even" && resultNumber !== 0 && resultNumber % 2 === 0) return true;
    if (bet === "odd" && resultNumber % 2 === 1) return true;
    if (bet === "low" && resultNumber >= 1 && resultNumber <= 18) return true;
    if (bet === "high" && resultNumber >= 19 && resultNumber <= 36) return true;
    return false;
  };

  const spinWheel = () => {
    const bet = parseFloat(betAmount);
    if (!bet || bet <= 0 || bet > balance) {
      toast({
        title: "Invalid bet",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    if (!selectedBet) {
      toast({
        title: "No bet selected",
        description: "Please select a bet type",
        variant: "destructive",
      });
      return;
    }

    setBalance(balance - bet);
    setSpinning(true);
    setResult(null);
    
    // Generate result first
    const resultNumber = Math.floor(Math.random() * 37);
    
    // Calculate final ball position based on result
    const finalBallPosition = (resultNumber * (360 / 37)) + Math.random() * 8 - 4; // Small random offset
    
    // Realistic ball spinning animation - multiple full rotations before settling
    let currentPosition = 0;
    let speed = 15; // Initial speed
    const deceleration = 0.985; // Gradual slowdown
    let spinCount = 0;
    const maxSpins = 180; // About 4.5 seconds of spinning
    
    const ballSpinInterval = setInterval(() => {
      currentPosition = (currentPosition + speed) % 360;
      setBallPosition(currentPosition);
      speed *= deceleration;
      spinCount++;
      
      // Stop when we've done enough spins and speed is low
      if (spinCount >= maxSpins || speed < 0.5) {
        clearInterval(ballSpinInterval);
        
        // Set final position
        setBallPosition(finalBallPosition);
        setResult(resultNumber);
        setSpinning(false);
        
        const selectedBetOption = betOptions.find(option => option.value === selectedBet);
        const isWin = checkWin(resultNumber, selectedBet);
        
        const historyEntry: GameHistoryEntry = {
          id: Date.now().toString(),
          game: "Roulette",
          bet: bet,
          result: `${resultNumber} (${getNumberColor(resultNumber)})`,
          payout: isWin && selectedBetOption ? (bet * selectedBetOption.multiplier) - bet : -bet,
          timestamp: new Date(),
          status: isWin ? 'win' : 'loss'
        };
        
        setGameHistory(prev => [historyEntry, ...prev]);
        
        if (isWin && selectedBetOption) {
          const winnings = bet * selectedBetOption.multiplier;
          setBalance(balance + winnings);
          toast({
            title: "🎉 Congratulations! You Won!",
            description: `Number ${resultNumber} (${getNumberColor(resultNumber)}) - Won ₹${winnings - bet}`,
          });
        } else {
          toast({
            title: "Better luck next time!",
            description: `Number ${resultNumber} (${getNumberColor(resultNumber)}) - Lost ₹${bet}`,
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
    }, 30); // Smoother 33fps animation
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
    numbers,
    redNumbers,
    blackNumbers,
    betOptions,
    
    // Functions
    getNumberColor,
    checkWin,
    spinWheel,
  };
};
