
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameColorPrediction = () => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentColor, setCurrentColor] = useState<string>("gray");
  const [gameActive, setGameActive] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();
  const { toast } = useToast();

  const colors = [
    { name: "Red", value: "red", bg: "bg-red-500", multiplier: 2 },
    { name: "Green", value: "green", bg: "bg-green-500", multiplier: 2 },
    { name: "Blue", value: "blue", bg: "bg-blue-500", multiplier: 2 },
    { name: "Yellow", value: "yellow", bg: "bg-yellow-500", multiplier: 3 },
    { name: "Purple", value: "purple", bg: "bg-purple-500", multiplier: 5 },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Game ends, show result
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setCurrentColor(randomColor.value);
      setGameActive(false);
      
      if (selectedColor === randomColor.value) {
        const winnings = parseFloat(betAmount) * randomColor.multiplier;
        setBalance(balance + winnings);
        toast({
          title: "You won!",
          description: `Correct prediction! Won ₹${winnings}`,
        });
      } else {
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
  }, [gameActive, countdown, selectedColor, betAmount, balance, toast]);

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
      title: "Bet placed!",
      description: `You bet ₹${bet} on ${color}`,
    });
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Color Prediction
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <div className={`w-32 h-32 mx-auto rounded-full border-4 border-gray-600 bg-${currentColor}-500 flex items-center justify-center`}>
                    <Palette className="w-12 h-12 text-white" />
                  </div>
                  <div className="mt-4 text-2xl font-bold">
                    {gameActive ? `${countdown}s` : "Next Round Starting..."}
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => placeBet(color.value)}
                      disabled={gameActive || !betAmount}
                      className={`${color.bg} h-16 rounded-lg border-2 ${
                        selectedColor === color.value ? "border-white" : "border-gray-600"
                      } hover:scale-105 transition-transform duration-200 flex flex-col items-center justify-center text-white font-semibold`}
                    >
                      <div className="text-xs">{color.name}</div>
                      <div className="text-xs">{color.multiplier}x</div>
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
                  disabled={gameActive}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount("100")}
                    className="border-gray-600 hover:bg-gray-700"
                    disabled={gameActive}
                  >
                    ₹100
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount("500")}
                    className="border-gray-600 hover:bg-gray-700"
                    disabled={gameActive}
                  >
                    ₹500
                  </Button>
                </div>

                {selectedColor && (
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400">Selected Color</div>
                    <div className="font-bold text-lg capitalize">{selectedColor}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameColorPrediction;
