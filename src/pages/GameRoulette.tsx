
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameRoulette = () => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedBet, setSelectedBet] = useState<string>("");
  const [balance, setBalance] = useState(1000);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const numbers = Array.from({ length: 37 }, (_, i) => i); // 0-36
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  const betOptions = [
    { name: "Red", value: "red", multiplier: 2, color: "bg-red-500" },
    { name: "Black", value: "black", multiplier: 2, color: "bg-black" },
    { name: "Even", value: "even", multiplier: 2, color: "bg-blue-500" },
    { name: "Odd", value: "odd", multiplier: 2, color: "bg-purple-500" },
    { name: "1-18", value: "low", multiplier: 2, color: "bg-green-500" },
    { name: "19-36", value: "high", multiplier: 2, color: "bg-orange-500" },
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
    
    setTimeout(() => {
      const resultNumber = Math.floor(Math.random() * 37);
      setResult(resultNumber);
      setSpinning(false);
      
      const selectedBetOption = betOptions.find(option => option.value === selectedBet);
      const isWin = checkWin(resultNumber, selectedBet);
      
      if (isWin && selectedBetOption) {
        const winnings = bet * selectedBetOption.multiplier;
        setBalance(balance + winnings);
        toast({
          title: "You won!",
          description: `Number ${resultNumber} (${getNumberColor(resultNumber)}) - Won ₹${winnings}`,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-gray-600 hover:bg-gray-700 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
            Roulette Game
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <div className={`w-48 h-48 mx-auto rounded-full border-8 border-yellow-500 bg-gradient-to-r from-red-800 to-black flex items-center justify-center ${spinning ? 'animate-spin' : ''}`}>
                    <Circle className="w-16 h-16 text-yellow-400" />
                  </div>
                  
                  <div className="mt-6">
                    {spinning ? (
                      <div className="text-2xl font-bold text-yellow-400">Spinning...</div>
                    ) : result !== null ? (
                      <div className="space-y-2">
                        <div className="text-4xl font-bold text-yellow-400">{result}</div>
                        <div className={`text-lg font-semibold ${
                          getNumberColor(result) === 'red' ? 'text-red-400' : 
                          getNumberColor(result) === 'black' ? 'text-gray-300' : 'text-green-400'
                        }`}>
                          {getNumberColor(result).toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">Place your bet and spin!</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {betOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedBet(option.value)}
                      disabled={spinning}
                      className={`${option.color} h-12 rounded-lg border-2 ${
                        selectedBet === option.value ? "border-white" : "border-gray-600"
                      } hover:scale-105 transition-transform duration-200 flex items-center justify-center text-white font-semibold text-sm`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-green-400">Balance: ₹{balance}</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Place Your Bet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter bet amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  disabled={spinning}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount("100")}
                    className="border-gray-600 hover:bg-gray-700"
                    disabled={spinning}
                  >
                    ₹100
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount("500")}
                    className="border-gray-600 hover:bg-gray-700"
                    disabled={spinning}
                  >
                    ₹500
                  </Button>
                </div>

                {selectedBet && (
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400">Selected Bet</div>
                    <div className="font-bold text-lg">
                      {betOptions.find(opt => opt.value === selectedBet)?.name}
                    </div>
                  </div>
                )}

                <Button
                  onClick={spinWheel}
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500"
                  disabled={spinning}
                >
                  {spinning ? "Spinning..." : "Spin Wheel"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoulette;
