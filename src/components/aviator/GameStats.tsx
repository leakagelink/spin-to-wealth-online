
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface GameStatsProps {
  balance: number;
  currentBet: number;
  multiplier: number;
  gameStarted: boolean;
  highestMultiplier: number;
}

const GameStats = ({ balance, currentBet, multiplier, gameStarted, highestMultiplier }: GameStatsProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Balance: ₹{balance.toLocaleString()}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-4 h-4 mr-1" />
            Highest: {highestMultiplier.toFixed(2)}x
          </CardTitle>
        </CardHeader>
      </Card>

      {currentBet > 0 && (
        <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 backdrop-blur-xl shadow-2xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-300">Current Bet</div>
              <div className="text-2xl font-bold text-white">₹{currentBet}</div>
              {gameStarted && (
                <div className="text-lg text-green-400 font-semibold">
                  Win: ₹{Math.floor(currentBet * multiplier) - currentBet}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameStats;
