
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Coins } from "lucide-react";
import { BetOption } from "@/types/roulette";

interface RouletteControlsProps {
  balance: number;
  betAmount: string;
  setBetAmount: (amount: string) => void;
  selectedBet: string;
  betOptions: BetOption[];
  spinning: boolean;
  spinWheel: () => void;
}

const RouletteControls = ({ 
  balance, 
  betAmount, 
  setBetAmount, 
  selectedBet, 
  betOptions, 
  spinning, 
  spinWheel 
}: RouletteControlsProps) => {
  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <Card className="bg-gradient-to-br from-gray-800/50 to-green-900/20 border-green-500/30 backdrop-blur-xl shadow-2xl">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-center text-lg sm:text-2xl flex items-center justify-center gap-2">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Balance: ₹{balance.toLocaleString()}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-br from-gray-800/50 to-blue-900/20 border-blue-500/30 backdrop-blur-xl shadow-2xl">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            Place Your Bet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <Input
            type="number"
            placeholder="Enter bet amount"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 h-12 text-base sm:text-lg touch-manipulation"
            disabled={spinning}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          />
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {[100, 500, 1000, 2000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => setBetAmount(amount.toString())}
                className="border-gray-600 hover:bg-gray-700 hover:border-blue-400 h-10 sm:h-12 font-semibold transition-all duration-200 text-sm sm:text-base touch-manipulation active:scale-95"
                disabled={spinning}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                ₹{amount}
              </Button>
            ))}
          </div>

          {selectedBet && (
            <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg sm:rounded-xl border border-yellow-400/30">
              <div className="text-xs sm:text-sm text-gray-300">Selected Bet</div>
              <div className="font-bold text-lg sm:text-xl text-yellow-400">
                {betOptions.find(opt => opt.value === selectedBet)?.icon} {betOptions.find(opt => opt.value === selectedBet)?.name}
              </div>
              <div className="text-xs sm:text-sm text-gray-300">Multiplier: {betOptions.find(opt => opt.value === selectedBet)?.multiplier}x</div>
            </div>
          )}

          <Button
            onClick={spinWheel}
            className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 hover:from-red-600 hover:via-yellow-600 hover:to-red-600 text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 text-base sm:text-lg touch-manipulation"
            disabled={spinning}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {spinning ? (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Spinning...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                🎲 Spin Wheel
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouletteControls;
