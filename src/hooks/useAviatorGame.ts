import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { GameHistoryEntry, AviatorGameState } from "@/types/aviator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthContext";

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
    
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching wallet balance:', error);
        // If wallet doesn't exist, create it
        if (error.code === 'PGRST116') {
          await createWalletRecord();
        }
        return;
      }
      
      if (data) {
        console.log('Fetched wallet balance:', data.balance);
        setBalance(Number(data.balance));
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const createWalletRecord = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wallets')
        .insert({
          user_id: user.id,
          balance: 1000.00,
          total_deposited: 0.00,
          total_withdrawn: 0.00,
          bonus_balance: 0.00
        })
        .select('balance')
        .single();

      if (error) {
        console.error('Error creating wallet record:', error);
        return;
      }

      if (data) {
        console.log('Created wallet with balance:', data.balance);
        setBalance(Number(data.balance));
      }
    } catch (error) {
      console.error('Error creating wallet record:', error);
    }
  };

  const updateWalletBalance = async (newBalance: number) => {
    if (!user) return;
    
    try {
      console.log('Updating wallet balance to:', newBalance);
      const { error } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating wallet balance:', error);
        return false;
      }
      
      console.log('Successfully updated wallet balance');
      return true;
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      return false;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !cashedOut) {
      interval = setInterval(() => {
        setMultiplier((prev) => {
          // More realistic multiplier increase - slower at start, faster as it goes higher
          const baseIncrease = 0.01;
          const accelerationFactor = Math.pow((prev - 1) * 0.5 + 1, 1.2);
          const randomVariation = Math.random() * 0.02 + 0.005;
          const increase = baseIncrease * accelerationFactor + randomVariation;
          
          const newMultiplier = prev + increase;
          
          if (newMultiplier > highestMultiplier) {
            setHighestMultiplier(newMultiplier);
          }
          
          // More realistic crash probability - increases exponentially
          let crashProbability;
          if (newMultiplier < 1.5) {
            crashProbability = 0.001; // Very low chance early on
          } else if (newMultiplier < 2.0) {
            crashProbability = 0.005;
          } else if (newMultiplier < 3.0) {
            crashProbability = 0.015;
          } else if (newMultiplier < 5.0) {
            crashProbability = 0.03;
          } else if (newMultiplier < 10.0) {
            crashProbability = 0.06;
          } else {
            crashProbability = 0.12; // Higher chance at very high multipliers
          }
          
          // Add some randomness to make it less predictable
          crashProbability += Math.random() * 0.01;
          
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
                title: "💥 Plane Crashed!",
                description: `Crashed at ${newMultiplier.toFixed(2)}x - Lost ₹${currentBet}`,
                variant: "destructive",
              });
            }
            setTimeout(() => {
              setMultiplier(1.00);
              setCurrentBet(0);
              setCashedOut(false);
            }, 3000); // Longer delay to show crash effect
          }
          return newMultiplier;
        });
      }, 80); // Slightly faster updates for smoother animation
    }

    return () => clearInterval(interval);
  }, [gameStarted, cashedOut, currentBet, toast, multiplier, highestMultiplier]);

  const placeBet = async () => {
    const bet = parseFloat(betAmount);
    if (!bet || bet <= 0 || bet > balance) {
      toast({
        title: "Invalid bet",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    const newBalance = balance - bet;
    console.log('Placing bet:', bet, 'New balance should be:', newBalance);
    
    const updateSuccess = await updateWalletBalance(newBalance);
    if (!updateSuccess) {
      toast({
        title: "Error",
        description: "Failed to update wallet balance",
        variant: "destructive",
      });
      return;
    }

    setCurrentBet(bet);
    setBalance(newBalance);
    
    setGameStarted(true);
    setIsFlying(true);
    setCashedOut(false);
    setBetAmount("");
    
    toast({
      title: "🚀 Flight Started!",
      description: `You bet ₹${bet}. Watch the plane soar!`,
    });
  };

  const cashOut = async () => {
    if (!gameStarted || cashedOut || currentBet <= 0) return;
    
    const winnings = Math.floor(currentBet * multiplier);
    const newBalance = balance + winnings;
    console.log('Cashing out:', winnings, 'New balance should be:', newBalance);
    
    const updateSuccess = await updateWalletBalance(newBalance);
    if (!updateSuccess) {
      toast({
        title: "Error",
        description: "Failed to update wallet balance",
        variant: "destructive",
      });
      return;
    }
    
    setBalance(newBalance);
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
