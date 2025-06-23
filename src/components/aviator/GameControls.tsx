
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface GameControlsProps {
  betAmount: string;
  setBetAmount: (amount: string) => void;
  gameStarted: boolean;
  cashedOut: boolean;
  placeBet: () => void;
  cashOut: () => void;
}

const GameControls = ({ betAmount, setBetAmount, gameStarted, cashedOut, placeBet, cashOut }: GameControlsProps) => {
  return (
    <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Flight Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="number"
          placeholder="Enter bet amount"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 transition-colors"
          disabled={gameStarted}
        />
        
        <div className="grid grid-cols-2 gap-3">
          {[100, 500, 1000, 2000].map((amount) => (
            <Button
              key={amount}
              variant="outline"
              onClick={() => setBetAmount(amount.toString())}
              className="border-gray-600 hover:bg-gray-700 hover:border-blue-400 transition-all duration-200"
              disabled={gameStarted}
            >
              ₹{amount}
            </Button>
          ))}
        </div>

        {!gameStarted ? (
          <Button
            onClick={placeBet}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🚀 Start Flight
          </Button>
        ) : (
          <Button
            onClick={cashOut}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
            disabled={cashedOut}
          >
            {cashedOut ? "✅ Cashed Out!" : "💰 Cash Out"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GameControls;
