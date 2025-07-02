
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Rocket, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameJetX = () => {
  const [betAmount, setBetAmount] = useState("");
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [jetPosition, setJetPosition] = useState({ x: 10, y: 80 });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !cashedOut) {
      interval = setInterval(() => {
        setMultiplier((prev) => {
          const increase = Math.random() * 0.06 + 0.015;
          const newMultiplier = prev + increase;
          
          // Update jet position
          const progress = Math.min((newMultiplier - 1) * 20, 80);
          setJetPosition({
            x: 10 + progress,
            y: 80 - progress
          });
          
          const crashProbability = Math.min((newMultiplier - 1) * 0.11, 0.32);
          if (Math.random() < crashProbability) {
            setGameStarted(false);
            setIsFlying(false);
            
            if (!cashedOut && currentBet > 0) {
              toast({
                title: "💥 Jet Crashed!",
                description: `Crashed at ${newMultiplier.toFixed(2)}x - Lost ₹${currentBet}`,
                variant: "destructive",
              });
            }
            setTimeout(() => {
              setMultiplier(1.00);
              setCurrentBet(0);
              setCashedOut(false);
              setJetPosition({ x: 10, y: 80 });
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
      title: "🚀 JetX Launched!",
      description: `You bet ₹${bet}. Watch the jet soar!`,
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
      title: "💰 Perfect Timing!",
      description: `Cashed out at ${multiplier.toFixed(2)}x - Won ₹${winnings - currentBet}`,
    });

    setTimeout(() => {
      setMultiplier(1.00);
      setCurrentBet(0);
      setJetPosition({ x: 10, y: 80 });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-2 sm:p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-4 sm:mb-6 px-2 sm:px-0">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-gray-600 hover:bg-gray-700 mr-3 sm:mr-4 touch-manipulation active:scale-95"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
            JetX
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-3 sm:p-6">
                <div className="relative h-48 sm:h-64 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg overflow-hidden touch-manipulation">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-800/50 to-transparent">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-4xl sm:text-6xl font-bold text-white/10">SKY</div>
                    </div>
                  </div>
                  
                  <div 
                    className="absolute transition-all duration-100 ease-linear"
                    style={{ 
                      left: `${jetPosition.x}%`, 
                      top: `${jetPosition.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Rocket className={`w-6 h-6 sm:w-8 sm:h-8 text-blue-400 ${isFlying ? 'animate-pulse' : ''}`} />
                  </div>
                  
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/50 px-3 py-2 sm:px-4 rounded">
                    <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                      {multiplier.toFixed(2)}x
                    </div>
                  </div>
                  
                  {isFlying && (
                    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs sm:text-sm text-gray-300">
                      JetX is flying...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-center text-lg sm:text-xl text-green-400">Balance: ₹{balance}</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Game Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Input
                  type="number"
                  placeholder="Enter bet amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 h-12 text-base touch-manipulation"
                  disabled={gameStarted}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount("100")}
                    className="border-gray-600 hover:bg-gray-700 h-10 sm:h-12 touch-manipulation active:scale-95"
                    disabled={gameStarted}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    ₹100
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount("500")}
                    className="border-gray-600 hover:bg-gray-700 h-10 sm:h-12 touch-manipulation active:scale-95"
                    disabled={gameStarted}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    ₹500
                  </Button>
                </div>

                {!gameStarted && currentBet === 0 ? (
                  <Button
                    onClick={placeBet}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-400 hover:from-blue-600 hover:to-purple-500 h-12 sm:h-14 text-base sm:text-lg touch-manipulation active:scale-95"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch JetX
                  </Button>
                ) : gameStarted && !cashedOut ? (
                  <Button
                    onClick={cashOut}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 h-12 sm:h-14 text-base sm:text-lg touch-manipulation active:scale-95"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
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

export default GameJetX;
