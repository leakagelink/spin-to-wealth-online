
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Palette, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GameHistory from "@/components/GameHistory";

interface GameHistoryEntry {
  id: string;
  game: string;
  bet: number;
  result: string;
  payout: number;
  timestamp: Date;
  status: 'win' | 'loss';
}

const GameColorPrediction = () => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentColor, setCurrentColor] = useState<string>("gray");
  const [gameActive, setGameActive] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [countdown, setCountdown] = useState(30);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [winStreak, setWinStreak] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const colors = [
    { name: "Red", value: "red", bg: "bg-gradient-to-br from-red-500 to-red-600", multiplier: 2, glow: "shadow-red-500/50" },
    { name: "Green", value: "green", bg: "bg-gradient-to-br from-green-500 to-green-600", multiplier: 2, glow: "shadow-green-500/50" },
    { name: "Blue", value: "blue", bg: "bg-gradient-to-br from-blue-500 to-blue-600", multiplier: 2, glow: "shadow-blue-500/50" },
    { name: "Yellow", value: "yellow", bg: "bg-gradient-to-br from-yellow-500 to-yellow-600", multiplier: 3, glow: "shadow-yellow-500/50" },
    { name: "Purple", value: "purple", bg: "bg-gradient-to-br from-purple-500 to-purple-600", multiplier: 5, glow: "shadow-purple-500/50" },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setCurrentColor(randomColor.value);
      setGameActive(false);
      
      const bet = parseFloat(betAmount);
      const isWin = selectedColor === randomColor.value;
      
      if (isWin) {
        const winnings = bet * randomColor.multiplier;
        setBalance(balance + winnings);
        setWinStreak(prev => prev + 1);
        
        const historyEntry: GameHistoryEntry = {
          id: Date.now().toString(),
          game: "Color Prediction",
          bet,
          result: `${randomColor.name} (WIN)`,
          payout: winnings,
          timestamp: new Date(),
          status: 'win'
        };
        setGameHistory(prev => [historyEntry, ...prev]);
        
        toast({
          title: "🎉 Amazing Win!",
          description: `Streak: ${winStreak + 1} | Won ₹${winnings}`,
        });
      } else {
        setWinStreak(0);
        
        const historyEntry: GameHistoryEntry = {
          id: Date.now().toString(),
          game: "Color Prediction",
          bet,
          result: `${randomColor.name} (LOSS)`,
          payout: -bet,
          timestamp: new Date(),
          status: 'loss'
        };
        setGameHistory(prev => [historyEntry, ...prev]);
        
        toast({
          title: "Better luck next time!",
          description: `The color was ${randomColor.name}`,
          variant: "destructive",
        });
      }
      
      setTimeout(() => {
        setCountdown(30);
        setSelectedColor("");
        setCurrentColor("gray");
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [gameActive, countdown, selectedColor, betAmount, balance, toast, winStreak]);

  const placeBet = (color: string) => {
    const bet = parseFloat(betAmount);
    if (!bet || bet <= 0 || bet > balance) {
      toast({
        title: "Invalid bet",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    setBalance(balance - bet);
    setSelectedColor(color);
    setGameActive(true);
    
    toast({
      title: "🎯 Bet Placed!",
      description: `You bet ₹${bet} on ${color}`,
    });
  };

  const getColorGradient = (colorValue: string) => {
    const colorMap: { [key: string]: string } = {
      red: "from-red-400 via-red-500 to-red-600",
      green: "from-green-400 via-green-500 to-green-600",
      blue: "from-blue-400 via-blue-500 to-blue-600",
      yellow: "from-yellow-400 via-yellow-500 to-yellow-600",
      purple: "from-purple-400 via-purple-500 to-purple-600",
      gray: "from-gray-400 via-gray-500 to-gray-600"
    };
    return colorMap[colorValue] || colorMap.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-gray-600 hover:bg-gray-700 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                Color Prediction
              </h1>
              {winStreak > 0 && (
                <div className="flex items-center mt-2">
                  <Sparkles className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-yellow-400 font-semibold">Win Streak: {winStreak}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Game Area */}
          <div className="xl:col-span-2">
            <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <div className={`w-40 h-40 mx-auto rounded-full border-4 border-gray-600 bg-gradient-to-br ${getColorGradient(currentColor)} flex items-center justify-center shadow-2xl relative overflow-hidden transform transition-all duration-500 ${gameActive ? 'animate-pulse scale-110' : 'scale-100'}`}>
                    {gameActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    )}
                    <Palette className="w-16 h-16 text-white drop-shadow-lg" />
                  </div>
                  
                  <div className="mt-6">
                    {gameActive ? (
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-cyan-400 animate-bounce">
                          {countdown}s
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                          <span className="text-yellow-400">Spinning Colors...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-300">
                        Next Round Starting...
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => placeBet(color.value)}
                      disabled={gameActive || !betAmount}
                      className={`${color.bg} h-20 rounded-xl border-3 ${
                        selectedColor === color.value 
                          ? "border-white shadow-xl scale-105" 
                          : "border-gray-600 hover:border-gray-400"
                      } hover:scale-110 transition-all duration-300 flex flex-col items-center justify-center text-white font-bold shadow-lg ${color.glow} hover:shadow-xl relative overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10"></div>
                      <div className="relative z-10">
                        <div className="text-xs mb-1">{color.name}</div>
                        <div className="text-sm bg-black/30 px-2 py-1 rounded-full">
                          {color.multiplier}x
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                    Balance: ₹{balance.toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Place Your Bet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter bet amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 transition-colors"
                  disabled={gameActive}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  {[100, 500, 1000, 2000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setBetAmount(amount.toString())}
                      className="border-gray-600 hover:bg-gray-700 hover:border-purple-400 transition-all duration-200"
                      disabled={gameActive}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>

                {selectedColor && (
                  <div className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                    <div className="text-sm text-gray-300">Selected Color</div>
                    <div className="font-bold text-xl capitalize bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {selectedColor}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Game History */}
          <div>
            <GameHistory history={gameHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameColorPrediction;
