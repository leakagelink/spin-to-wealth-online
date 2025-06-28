
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Car, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameCarRacing = () => {
  const [betAmount, setBetAmount] = useState("");
  const [multiplier, setMultiplier] = useState(1.00);
  const [isRacing, setIsRacing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [carPosition, setCarPosition] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !cashedOut) {
      interval = setInterval(() => {
        setMultiplier((prev) => {
          const increase = Math.random() * 0.08 + 0.02;
          const newMultiplier = prev + increase;
          
          setCarPosition((newMultiplier - 1) * 100);
          
          const crashProbability = Math.min((newMultiplier - 1) * 0.12, 0.35);
          if (Math.random() < crashProbability) {
            setGameStarted(false);
            setIsRacing(false);
            
            if (!cashedOut && currentBet > 0) {
              toast({
                title: "💥 Car Crashed!",
                description: `Crashed at ${newMultiplier.toFixed(2)}x - Lost ₹${currentBet}`,
                variant: "destructive",
              });
            }
            setTimeout(() => {
              setMultiplier(1.00);
              setCurrentBet(0);
              setCashedOut(false);
              setCarPosition(0);
            }, 2000);
          }
          return newMultiplier;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [gameStarted, cashedOut, currentBet, toast]);

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
    setIsRacing(true);
    setCashedOut(false);
    setBetAmount("");
    
    toast({
      title: "🏎️ Race Started!",
      description: `You bet ₹${bet}. Watch the car race!`,
    });
  };

  const cashOut = () => {
    if (!gameStarted || cashedOut || currentBet <= 0) return;
    
    const winnings = Math.floor(currentBet * multiplier);
    setBalance(balance + winnings);
    setCashedOut(true);
    setGameStarted(false);
    setIsRacing(false);
    
    toast({
      title: "💰 Perfect Timing!",
      description: `Cashed out at ${multiplier.toFixed(2)}x - Won ₹${winnings - currentBet}`,
    });

    setTimeout(() => {
      setMultiplier(1.00);
      setCurrentBet(0);
      setCarPosition(0);
    }, 2000);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent">
            Car Racing
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="relative h-64 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-6xl font-bold text-white/20">RACE TRACK</div>
                    </div>
                  </div>
                  
                  <div 
                    className="absolute bottom-4 transition-all duration-100 ease-linear"
                    style={{ left: `${Math.min(carPosition, 85)}%` }}
                  >
                    <Car className={`w-8 h-8 text-red-500 ${isRacing ? 'animate-bounce' : ''}`} />
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded">
                    <div className="text-2xl font-bold text-yellow-400">
                      {multiplier.toFixed(2)}x
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-green-400">Balance: ₹{balance}</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Game Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter bet amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  disabled={gameStarted}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount("100")}
                    className="border-gray-600 hover:bg-gray-700"
                    disabled={gameStarted}
                  >
                    ₹100
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount("500")}
                    className="border-gray-600 hover:bg-gray-700"
                    disabled={gameStarted}
                  >
                    ₹500
                  </Button>
                </div>

                {!gameStarted && currentBet === 0 ? (
                  <Button
                    onClick={placeBet}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Start Race
                  </Button>
                ) : gameStarted && !cashedOut ? (
                  <Button
                    onClick={cashOut}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Cash Out {multiplier.toFixed(2)}x
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCarRacing;
