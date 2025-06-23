
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bomb, Diamond } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameMines = () => {
  const [betAmount, setBetAmount] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [grid, setGrid] = useState<Array<Array<{ revealed: boolean; isMine: boolean; isDiamond: boolean }>>>([]);
  const [currentBet, setCurrentBet] = useState(0);
  const [minesCount, setMinesCount] = useState(3);
  const navigate = useNavigate();
  const { toast } = useToast();

  const initializeGrid = () => {
    const newGrid = Array(5).fill(null).map(() =>
      Array(5).fill(null).map(() => ({ revealed: false, isMine: false, isDiamond: false }))
    );
    
    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
      const row = Math.floor(Math.random() * 5);
      const col = Math.floor(Math.random() * 5);
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }
    
    // Place diamonds in remaining cells
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (!newGrid[i][j].isMine) {
          newGrid[i][j].isDiamond = true;
        }
      }
    }
    
    setGrid(newGrid);
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

    setCurrentBet(bet);
    setBalance(balance - bet);
    setGameStarted(true);
    setBetAmount("");
    initializeGrid();
    
    toast({
      title: "Game started!",
      description: `You bet ₹${bet}. Find the diamonds!`,
    });
  };

  const revealCell = (row: number, col: number) => {
    if (!gameStarted || grid[row][col].revealed) return;

    const newGrid = [...grid];
    newGrid[row][col].revealed = true;
    setGrid(newGrid);

    if (newGrid[row][col].isMine) {
      // Game over
      setGameStarted(false);
      toast({
        title: "Boom! Mine hit!",
        description: `You lost ₹${currentBet}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Diamond found!",
        description: "Keep going or cash out!",
      });
    }
  };

  const cashOut = () => {
    const revealedDiamonds = grid.flat().filter(cell => cell.revealed && cell.isDiamond).length;
    const multiplier = 1 + (revealedDiamonds * 0.5);
    const winnings = Math.floor(currentBet * multiplier);
    
    setBalance(balance + winnings);
    setGameStarted(false);
    
    toast({
      title: "Cashed out!",
      description: `You won ₹${winnings} with ${revealedDiamonds} diamonds!`,
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent">
            Mines Game
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => revealCell(rowIndex, colIndex)}
                        disabled={!gameStarted || cell.revealed}
                        className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                          cell.revealed
                            ? cell.isMine
                              ? "bg-red-500 border-red-400"
                              : "bg-green-500 border-green-400"
                            : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                        }`}
                      >
                        {cell.revealed && (
                          <>
                            {cell.isMine && <Bomb className="w-6 h-6 text-white" />}
                            {cell.isDiamond && <Diamond className="w-6 h-6 text-white" />}
                          </>
                        )}
                      </button>
                    ))
                  )}
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
                <CardTitle>Game Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Mines Count</label>
                  <select
                    value={minesCount}
                    onChange={(e) => setMinesCount(Number(e.target.value))}
                    disabled={gameStarted}
                    className="w-full bg-gray-700 border-gray-600 rounded px-3 py-2"
                  >
                    <option value={1}>1 Mine</option>
                    <option value={3}>3 Mines</option>
                    <option value={5}>5 Mines</option>
                  </select>
                </div>
                
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

                {!gameStarted ? (
                  <Button
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500"
                  >
                    Start Game
                  </Button>
                ) : (
                  <Button
                    onClick={cashOut}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500"
                  >
                    Cash Out
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMines;
