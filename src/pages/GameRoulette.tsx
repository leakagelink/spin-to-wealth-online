
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GameHistory from "@/components/GameHistory";

const GameRoulette = () => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedBet, setSelectedBet] = useState<string>("");
  const [balance, setBalance] = useState(1000);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [ballPosition, setBallPosition] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const numbers = Array.from({ length: 37 }, (_, i) => i);
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  const betOptions = [
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
    
    // Animate ball spinning
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setBallPosition((prev) => (prev + 10) % 360);
      spinCount++;
      if (spinCount > 30) {
        clearInterval(spinInterval);
      }
    }, 100);
    
    setTimeout(() => {
      const resultNumber = Math.floor(Math.random() * 37);
      setResult(resultNumber);
      setSpinning(false);
      setBallPosition(resultNumber * (360 / 37));
      
      const selectedBetOption = betOptions.find(option => option.value === selectedBet);
      const isWin = checkWin(resultNumber, selectedBet);
      
      const historyEntry = {
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
          title: "🎉 You won!",
          description: `Number ${resultNumber} (${getNumberColor(resultNumber)}) - Won ₹${winnings - bet}`,
        });
      } else {
        toast({
          title: "Better luck next time!",
          description: `Number ${resultNumber} (${getNumberColor(resultNumber)}) - Lost ₹${bet}`,
          variant: "destructive",
        });
      }
      
      setTimeout(() => {
        setBetAmount("");
        setSelectedBet("");
        setResult(null);
      }, 3000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-black text-white p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-gray-600 hover:bg-gray-700 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-red-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              Premium Roulette
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Enhanced Game Area */}
          <div className="xl:col-span-2">
            <Card className="bg-gradient-to-br from-gray-800/50 via-red-900/20 to-gray-800/50 border-red-500/30 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  {/* Realistic Roulette Wheel */}
                  <div className="relative w-80 h-80 mx-auto">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-8 border-yellow-500 bg-gradient-to-br from-yellow-600 to-yellow-800 shadow-2xl">
                      {/* Inner wheel */}
                      <div className={`absolute inset-4 rounded-full bg-gradient-to-br from-red-800 via-black to-red-800 transition-transform duration-3000 ${spinning ? 'animate-spin' : ''}`}>
                        {/* Number segments */}
                        {numbers.map((num, index) => {
                          const angle = (index * 360) / 37;
                          const color = getNumberColor(num);
                          return (
                            <div
                              key={num}
                              className={`absolute w-6 h-6 flex items-center justify-center text-xs font-bold text-white rounded-full ${
                                color === 'red' ? 'bg-red-600' : 
                                color === 'black' ? 'bg-gray-900' : 'bg-green-600'
                              }`}
                              style={{
                                transform: `rotate(${angle}deg) translateY(-120px) rotate(-${angle}deg)`,
                                transformOrigin: 'center 120px',
                              }}
                            >
                              {num}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Ball */}
                      <div 
                        className="absolute w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-100"
                        style={{
                          transform: `rotate(${ballPosition}deg) translateY(-140px)`,
                          transformOrigin: 'center 140px',
                          top: '50%',
                          left: '50%',
                          marginTop: '-8px',
                          marginLeft: '-8px',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-300 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Result Display */}
                  <div className="mt-8">
                    {spinning ? (
                      <div className="text-3xl font-bold text-yellow-400 animate-pulse flex items-center justify-center gap-2">
                        <Sparkles className="w-8 h-8 animate-spin" />
                        Spinning...
                        <Sparkles className="w-8 h-8 animate-spin" />
                      </div>
                    ) : result !== null ? (
                      <div className="space-y-4">
                        <div className="text-6xl font-bold text-yellow-400 animate-bounce">{result}</div>
                        <div className={`text-2xl font-bold px-6 py-3 rounded-full inline-block ${
                          getNumberColor(result) === 'red' ? 'bg-red-500/30 text-red-300 border border-red-400' : 
                          getNumberColor(result) === 'black' ? 'bg-gray-800/50 text-gray-300 border border-gray-400' : 
                          'bg-green-500/30 text-green-300 border border-green-400'
                        }`}>
                          {getNumberColor(result).toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-xl">Place your bet and spin the wheel!</div>
                    )}
                  </div>
                </div>

                {/* Enhanced Betting Options */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {betOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedBet(option.value)}
                      disabled={spinning}
                      className={`${option.color} h-16 rounded-xl border-2 ${
                        selectedBet === option.value ? "border-yellow-400 ring-4 ring-yellow-400/30" : "border-gray-600"
                      } hover:scale-105 transform transition-all duration-200 flex items-center justify-center text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="mr-2 text-xl">{option.icon}</span>
                      {option.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Control Panel */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800/50 to-green-900/20 border-green-500/30 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
                  <Coins className="w-6 h-6 text-green-400" />
                  <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                    Balance: ₹{balance.toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-blue-900/20 border-blue-500/30 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Place Your Bet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter bet amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 h-12 text-lg"
                  disabled={spinning}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  {[100, 500, 1000, 2000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setBetAmount(amount.toString())}
                      className="border-gray-600 hover:bg-gray-700 hover:border-blue-400 h-12 font-semibold transition-all duration-200"
                      disabled={spinning}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>

                {selectedBet && (
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30">
                    <div className="text-sm text-gray-300">Selected Bet</div>
                    <div className="font-bold text-xl text-yellow-400">
                      {betOptions.find(opt => opt.value === selectedBet)?.icon} {betOptions.find(opt => opt.value === selectedBet)?.name}
                    </div>
                    <div className="text-sm text-gray-300">Multiplier: {betOptions.find(opt => opt.value === selectedBet)?.multiplier}x</div>
                  </div>
                )}

                <Button
                  onClick={spinWheel}
                  className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 hover:from-red-600 hover:via-yellow-600 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
                  disabled={spinning}
                >
                  {spinning ? (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Spinning...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      🎲 Spin Wheel
                    </div>
                  )}
                </Button>
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

export default GameRoulette;
