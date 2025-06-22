
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plane, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameAviator = () => {
  const [betAmount, setBetAmount] = useState("");
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !cashedOut) {
      interval = setInterval(() => {
        setMultiplier((prev) => {
          const increase = Math.random() * 0.05 + 0.01;
          const newMultiplier = prev + increase;
          
          // Random crash probability increases with multiplier
          const crashProbability = Math.min((newMultiplier - 1) * 0.1, 0.3);
          if (Math.random() < crashProbability) {
            setGameStarted(false);
            setIsFlying(false);
            if (!cashedOut && currentBet > 0) {
              toast({
                title: "Plane Crashed!",
                description: `You lost ₹${currentBet}`,
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
    setIsFlying(true);
    setCashedOut(false);
    setBetAmount("");
    
    toast({
      title: "Bet placed!",
      description: `You bet ₹${bet}. Watch the plane fly!`,
    });
  };

  const cashOut = () => {
    if (!gameStarted || cashedOut || currentBet <= 0) return;
    
    const winnings = Math.floor(currentBet * multiplier);
    setBalance(balance + winnings);
    setCashedOut(true);
    setGameStarted(false);
    setIsFlying(false);
    
    toast({
      title: "Cashed out!",
      description: `You won ₹${winnings} at ${multiplier.toFixed(2)}x`,
    });

    setTimeout(() => {
      setMultiplier(1.00);
      setCurrentBet(0);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Aviator Game
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative h-96 bg-gradient-to-b from-blue-900/30 to-blue-800/30 rounded-lg overflow-hidden">
                  {/* Sky background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 to-blue-600/20"></div>
                  
                  {/* Plane */}
                  <div className={`absolute transition-all duration-1000 ${isFlying ? 'transform translate-x-full -translate-y-32 scale-150' : 'bottom-20 left-10'}`}>
                    <Plane className={`w-12 h-12 text-white ${isFlying ? 'rotate-45' : 'rotate-12'} transition-transform duration-1000`} />
                  </div>
                  
                  {/* Multiplier Display */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`text-6xl font-bold transition-all duration-200 ${gameStarted ? 'text-green-400 scale-110' : 'text-white'}`}>
                      {multiplier.toFixed(2)}x
                    </div>
                    {gameStarted && !cashedOut && (
                      <div className="text-center mt-2">
                        <TrendingUp className="w-6 h-6 mx-auto text-green-400 animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  {/* Status Message */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    {gameStarted ? (
                      <div className="text-green-400 font-semibold">Plane is flying! Cash out before it crashes!</div>
                    ) : (
                      <div className="text-gray-400">Place your bet and watch the plane take off!</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Balance */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-green-400">Balance: ₹{balance}</CardTitle>
              </CardHeader>
            </Card>

            {/* Bet Controls */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Place Your Bet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Enter bet amount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                    disabled={gameStarted}
                  />
                </div>
                
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

                {!gameStarted ? (
                  <Button
                    onClick={placeBet}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
                  >
                    Place Bet
                  </Button>
                ) : (
                  <Button
                    onClick={cashOut}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500"
                    disabled={cashedOut}
                  >
                    {cashedOut ? "Cashed Out!" : "Cash Out"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Current Bet Info */}
            {currentBet > 0 && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Current Bet</div>
                    <div className="text-lg font-bold">₹{currentBet}</div>
                    {gameStarted && (
                      <div className="text-sm text-green-400">
                        Potential Win: ₹{Math.floor(currentBet * multiplier)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameAviator;
