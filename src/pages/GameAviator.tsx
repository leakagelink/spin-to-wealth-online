
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plane, TrendingUp, Zap, Target } from "lucide-react";
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

const GameAviator = () => {
  const [betAmount, setBetAmount] = useState("");
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [highestMultiplier, setHighestMultiplier] = useState(1.00);
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white p-4">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Aviator Game
              </h1>
              <div className="flex items-center mt-2 text-sm text-gray-400">
                <Target className="w-4 h-4 mr-1" />
                Highest: {highestMultiplier.toFixed(2)}x
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Game Area */}
          <div className="xl:col-span-2">
            <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-0">
                <div className="relative h-96 bg-gradient-to-b from-sky-900/40 to-blue-800/40 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
                  
                  <div className={`absolute transition-all duration-1000 ${isFlying ? 'transform translate-x-full -translate-y-32 scale-150' : 'bottom-20 left-10'}`}>
                    <div className={`relative ${isFlying ? 'animate-pulse' : ''}`}>
                      <Plane className={`w-16 h-16 text-white ${isFlying ? 'rotate-45' : 'rotate-12'} transition-transform duration-1000 drop-shadow-2xl`} />
                      {isFlying && (
                        <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-xl animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`text-7xl font-bold transition-all duration-200 ${gameStarted ? 'text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text scale-110 animate-pulse' : 'text-white'} drop-shadow-2xl`}>
                      {multiplier.toFixed(2)}x
                    </div>
                    {gameStarted && !cashedOut && (
                      <div className="text-center mt-4">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="w-6 h-6 text-green-400 animate-bounce" />
                          <span className="text-green-400 font-semibold animate-pulse">Rising!</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    {gameStarted ? (
                      <div className="text-center">
                        <div className="text-green-400 font-semibold text-lg mb-2 animate-pulse">
                          🚀 Plane is soaring! Cash out before it crashes!
                        </div>
                        {currentBet > 0 && (
                          <div className="bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                            <span className="text-yellow-400">Potential Win: ₹{Math.floor(currentBet * multiplier)}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center bg-black/30 px-6 py-3 rounded-lg backdrop-blur-sm">
                        Place your bet and watch the plane take off!
                      </div>
                    )}
                  </div>
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
                  Flight Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter bet amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 transition-colors"
                  disabled={gameStarted}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  {[100, 500, 1000, 2000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setBetAmount(amount.toString())}
                      className="border-gray-600 hover:bg-gray-700 hover:border-blue-400 transition-all duration-200"
                      disabled={gameStarted}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>

                {!gameStarted ? (
                  <Button
                    onClick={placeBet}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🚀 Start Flight
                  </Button>
                ) : (
                  <Button
                    onClick={cashOut}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
                    disabled={cashedOut}
                  >
                    {cashedOut ? "✅ Cashed Out!" : "💰 Cash Out"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {currentBet > 0 && (
              <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 backdrop-blur-xl shadow-2xl">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-sm text-gray-300">Current Bet</div>
                    <div className="text-2xl font-bold text-white">₹{currentBet}</div>
                    {gameStarted && (
                      <div className="text-lg text-green-400 font-semibold">
                        Win: ₹{Math.floor(currentBet * multiplier) - currentBet}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
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

export default GameAviator;
