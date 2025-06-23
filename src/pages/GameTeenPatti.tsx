
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Spade } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameTeenPatti = () => {
  const [betAmount, setBetAmount] = useState("");
  const [balance, setBalance] = useState(1000);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [gameResult, setGameResult] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const generateCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return `${rank}${suit}`;
  };

  const generateHand = () => {
    return [generateCard(), generateCard(), generateCard()];
  };

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
    
    const playerHand = generateHand();
    const dealerHand = generateHand();
    
    setPlayerCards(playerHand);
    setDealerCards(dealerHand);
    
    // Simple win/lose logic (random for demo)
    const playerWins = Math.random() > 0.5;
    
    setTimeout(() => {
      if (playerWins) {
        const winnings = bet * 2;
        setBalance(balance + winnings);
        setGameResult("win");
        toast({
          title: "You won!",
          description: `Won ₹${winnings}`,
        });
      } else {
        setGameResult("lose");
        toast({
          title: "Dealer wins!",
          description: `Lost ₹${bet}`,
          variant: "destructive",
        });
      }
      
      setTimeout(() => {
        setGameStarted(false);
        setPlayerCards([]);
        setDealerCards([]);
        setGameResult("");
        setBetAmount("");
      }, 3000);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
            Teen Patti
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Dealer Cards */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4">Dealer</h3>
                    <div className="flex justify-center space-x-2">
                      {dealerCards.length > 0 ? (
                        dealerCards.map((card, index) => (
                          <div
                            key={index}
                            className="w-16 h-24 bg-white text-black rounded-lg flex items-center justify-center font-bold text-sm border-2 border-gray-300"
                          >
                            {card}
                          </div>
                        ))
                      ) : (
                        <div className="flex space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-16 h-24 bg-gray-600 rounded-lg flex items-center justify-center border-2 border-gray-500"
                            >
                              <Spade className="w-6 h-6" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Game Status */}
                  <div className="text-center py-4">
                    {gameStarted ? (
                      <div className="text-xl font-bold text-yellow-400">
                        {gameResult ? (gameResult === "win" ? "You Win!" : "Dealer Wins!") : "Cards Dealt!"}
                      </div>
                    ) : (
                      <div className="text-gray-400">Place your bet to start</div>
                    )}
                  </div>

                  {/* Player Cards */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4">Your Cards</h3>
                    <div className="flex justify-center space-x-2">
                      {playerCards.length > 0 ? (
                        playerCards.map((card, index) => (
                          <div
                            key={index}
                            className="w-16 h-24 bg-white text-black rounded-lg flex items-center justify-center font-bold text-sm border-2 border-gray-300"
                          >
                            {card}
                          </div>
                        ))
                      ) : (
                        <div className="flex space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-16 h-24 bg-gray-600 rounded-lg flex items-center justify-center border-2 border-gray-500"
                            >
                              <Spade className="w-6 h-6" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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

                <Button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-600 hover:to-amber-500"
                  disabled={gameStarted}
                >
                  {gameStarted ? "Game in Progress..." : "Deal Cards"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTeenPatti;
