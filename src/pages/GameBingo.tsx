
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Grid3X3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameBingo = () => {
  const [betAmount, setBetAmount] = useState("");
  const [balance, setBalance] = useState(1000);
  const [gameStarted, setGameStarted] = useState(false);
  const [bingoCard, setBingoCard] = useState<Array<Array<{ number: number; marked: boolean }>>>([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateBingoCard = () => {
    const card = [];
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        if (i === 2 && j === 2) {
          row.push({ number: 0, marked: true });
        } else {
          const min = j * 15 + 1;
          const max = j * 15 + 15;
          let number;
          do {
            number = Math.floor(Math.random() * (max - min + 1)) + min;
          } while (card.flat().some(cell => cell && cell.number === number));
          row.push({ number, marked: false });
        }
      }
      card.push(row);
    }
    return card;
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
    setBingoCard(generateBingoCard());
    setCalledNumbers([]);
    setCurrentNumber(null);
    
    toast({
      title: "Bingo started!",
      description: `You bet ₹${bet}. Good luck!`,
    });
  };

  const callNumber = () => {
    if (!gameStarted) return;
    
    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
      .filter(num => !calledNumbers.includes(num));
    
    if (availableNumbers.length === 0) return;
    
    const newNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    setCurrentNumber(newNumber);
    const newCalledNumbers = [...calledNumbers, newNumber];
    setCalledNumbers(newCalledNumbers);
    
    const newCard = bingoCard.map(row =>
      row.map(cell =>
        cell.number === newNumber ? { ...cell, marked: true } : cell
      )
    );
    setBingoCard(newCard);
    
    checkForBingo(newCard, newCalledNumbers);
  };

  const checkForBingo = (card: Array<Array<{ number: number; marked: boolean }>>, called: number[]) => {
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (card[i].every(cell => cell.marked)) {
        winGame(called.length);
        return;
      }
    }
    
    // Check columns
    for (let j = 0; j < 5; j++) {
      if (card.every(row => row[j].marked)) {
        winGame(called.length);
        return;
      }
    }
    
    // Check diagonals
    if (card.every((row, i) => row[i].marked) || 
        card.every((row, i) => row[4 - i].marked)) {
      winGame(called.length);
      return;
    }
  };

  const winGame = (numbersUsed: number) => {
    const bet = parseFloat(betAmount);
    const multiplier = Math.max(1, 5 - (numbersUsed / 15));
    const winnings = Math.floor(bet * multiplier);
    setBalance(balance + winnings);
    setGameStarted(false);
    setAutoPlay(false);
    
    toast({
      title: "BINGO!",
      description: `You won ₹${winnings - bet} with ${multiplier.toFixed(2)}x multiplier!`,
    });
  };

  const toggleAutoPlay = () => {
    if (!gameStarted) return;
    
    if (!autoPlay) {
      setAutoPlay(true);
      const interval = setInterval(() => {
        if (gameStarted && autoPlay) {
          callNumber();
        } else {
          clearInterval(interval);
        }
      }, 1000);
    } else {
      setAutoPlay(false);
    }
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            Bingo Game
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {currentNumber && (
                    <div className="text-4xl font-bold text-yellow-400 mb-2">
                      {currentNumber}
                    </div>
                  )}
                  <div className="text-sm text-gray-400">
                    Numbers called: {calledNumbers.length}
                  </div>
                </div>
                
                {bingoCard.length > 0 && (
                  <div className="max-w-md mx-auto">
                    <div className="grid grid-cols-5 gap-1 mb-2">
                      <div className="text-center font-bold text-green-400">B</div>
                      <div className="text-center font-bold text-green-400">I</div>
                      <div className="text-center font-bold text-green-400">N</div>
                      <div className="text-center font-bold text-green-400">G</div>
                      <div className="text-center font-bold text-green-400">O</div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-1">
                      {bingoCard.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-12 h-12 rounded border-2 flex items-center justify-center text-sm font-bold ${
                              cell.marked
                                ? "bg-green-500 border-green-400 text-white"
                                : "bg-gray-700 border-gray-600"
                            }`}
                          >
                            {cell.number === 0 ? "★" : cell.number}
                          </div>
                        ))
                      )}
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
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Start Bingo
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={callNumber}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
                      disabled={autoPlay}
                    >
                      Call Next Number
                    </Button>
                    <Button
                      onClick={toggleAutoPlay}
                      variant="outline"
                      className="w-full border-gray-600 hover:bg-gray-700"
                    >
                      {autoPlay ? "Stop Auto Play" : "Start Auto Play"}
                    </Button>
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

export default GameBingo;
