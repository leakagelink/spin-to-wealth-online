
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
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
          Flight Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <Input
          type="number"
          placeholder="Enter bet amount"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 transition-colors h-12 text-base touch-manipulation"
          disabled={gameStarted}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        />
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[100, 500, 1000, 2000].map((amount) => (
            <Button
              key={amount}
              variant="outline"
              onClick={() => setBetAmount(amount.toString())}
              className="border-gray-600 hover:bg-gray-700 hover:border-blue-400 transition-all duration-200 h-10 sm:h-12 text-sm sm:text-base font-semibold touch-manipulation active:scale-95"
              disabled={gameStarted}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              ₹{amount}
            </Button>
          ))}
        </div>

        {!gameStarted ? (
          <Button
            onClick={placeBet}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 text-base sm:text-lg touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            🚀 Start Flight
          </Button>
        ) : (
          <Button
            onClick={cashOut}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 animate-pulse text-base sm:text-lg touch-manipulation"
            disabled={cashedOut}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {cashedOut ? "✅ Cashed Out!" : "💰 Cash Out"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GameControls;
