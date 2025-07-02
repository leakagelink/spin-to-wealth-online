
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GameHistory from "@/components/GameHistory";
import { useRouletteGame } from "@/hooks/useRouletteGame";
import RouletteGameArea from "@/components/roulette/RouletteGameArea";
import RouletteControls from "@/components/roulette/RouletteControls";

const GameRoulette = () => {
  const navigate = useNavigate();
  const {
    betAmount,
    setBetAmount,
    selectedBet,
    setSelectedBet,
    balance,
    spinning,
    result,
    gameHistory,
    ballPosition,
    numbers,
    betOptions,
    getNumberColor,
    spinWheel,
  } = useRouletteGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-black text-white p-2 sm:p-4">
      <div className="container mx-auto max-w-7xl">
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
          <div className="flex items-center gap-2 sm:gap-3">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              Premium Roulette
            </h1>
          </div>
        </div>

        {/* Mobile-first responsive grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Game Area - Full width on mobile */}
          <div className="xl:col-span-2 order-1">
            <RouletteGameArea
              numbers={numbers}
              getNumberColor={getNumberColor}
              spinning={spinning}
              result={result}
              ballPosition={ballPosition}
              betOptions={betOptions}
              selectedBet={selectedBet}
              setSelectedBet={setSelectedBet}
            />
          </div>

          {/* Control Panel - Full width on mobile, appears second */}
          <div className="order-2 xl:order-2">
            <RouletteControls
              balance={balance}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              selectedBet={selectedBet}
              betOptions={betOptions}
              spinning={spinning}
              spinWheel={spinWheel}
            />
          </div>

          {/* Game History - Full width on mobile, appears last */}
          <div className="order-3 xl:order-3">
            <GameHistory history={gameHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoulette;
