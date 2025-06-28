
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameChicken = () => {
  const [betAmount, setBetAmount] = useState("");
  const [balance, setBalance] = useState(1000);
  const [gameStarted, setGameStarted] = useState(false);
  const [bones, setBones] = useState<number[]>([]);
  const [revealedTiles, setRevealedTiles] = useState<boolean[]>(new Array(25).fill(false));
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [chickenCount, setChickenCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startGame = () => {
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
    setGameStarted(true);
    
    // Randomly place 5 bones in the 25 tiles
    const newBones = [];
    while (newBones.length < 5) {
      const randomIndex = Math.floor(Math.random() * 25);
      if (!newBones.includes(randomIndex)) {
        newBones.push(randomIndex);
      }
    }
    setBones(newBones);
    setRevealedTiles(new Array(25).fill(false));
    setCurrentMultiplier(1);
    setChickenCount(0);
    
    toast({
      title: "🐔 Game Started!",
      description: `You bet ₹${bet}. Find chickens, avoid bones!`,
    });
  };

  const revealTile = (index: number) => {
    if (!gameStarted || revealedTiles[index]) return;

    const newRevealed = [...revealedTiles];
    newRevealed[index] = true;
    setRevealedTiles(newRevealed);

    if (bones.includes(index)) {
      // Hit a bone - game over
      setGameStarted(false);
      toast({
        title: "💀 Game Over!",
        description: `You hit a bone! Lost your bet.`,
        variant: "destructive",
      });
      setTimeout(() => {
        setBones([]);
        setRevealedTiles(new Array(25).fill(false));
        setCurrentMultiplier(1);
        setChickenCount(0);
      }, 2000);
    } else {
      // Found a chicken
      const newChickenCount = chickenCount + 1;
      setChickenCount(newChickenCount);
      const newMultiplier = 1 + (newChickenCount * 0.3);
      setCurrentMultiplier(newMultiplier);
      
      toast({
        title: "🐔 Chicken Found!",
        description: `Multiplier: ${newMultiplier.toFixed(2)}x`,
      });
    }
  };

  const cashOut = () => {
    if (!gameStarted) return;
    
    const bet = parseFloat(betAmount);
    const winnings = Math.floor(bet * currentMultiplier);
    setBalance(balance + winnings);
    setGameStarted(false);
    
    toast({
      title: "💰 Cashed Out!",
      description: `Won ₹${winnings - bet} with ${currentMultiplier.toFixed(2)}x multiplier!`,
    });

    setTimeout(() => {
      setBones([]);
      setRevealedTiles(new Array(25).fill(false));
      setCurrentMultiplier(1);
      setChickenCount(0);
    }, 1000);
  };

  const getTileContent = (index: number) => {
    if (!revealedTiles[index]) return "?";
    if (bones.includes(index)) return "💀";
    return "🐔";
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-300 bg-clip-text text-transparent">
            Chicken Game
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                  {Array.from({ length: 25 }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => revealTile(index)}
                      disabled={!gameStarted || revealedTiles[index]}
                      className={`w-12 h-12 rounded border-2 flex items-center justify-center text-lg font-bold transition-all ${
                        revealedTiles[index]
                          ? bones.includes(index)
                            ? "bg-red-500 border-red-400"
                            : "bg-green-500 border-green-400"
                          : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                      }`}
                    >
                      {getTileContent(index)}
                    </button>
                  ))}
                </div>
                
                {gameStarted && (
                  <div className="text-center mt-4">
                    <div className="text-2xl font-bold text-yellow-400">
                      Multiplier: {currentMultiplier.toFixed(2)}x
                    </div>
                    <div className="text-sm text-gray-400">
                      Chickens found: {chickenCount}
                    </div>
                  </div>
                )}
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

                {!gameStarted ? (
                  <Button
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500"
                  >
                    Start Game
                  </Button>
                ) : (
                  <Button
                    onClick={cashOut}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Cash Out {currentMultiplier.toFixed(2)}x
                  </Button>
                )}
                
                <div className="text-xs text-gray-400 text-center">
                  Find chickens to increase multiplier. Avoid bones!
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameChicken;
