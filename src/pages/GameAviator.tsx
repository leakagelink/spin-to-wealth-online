
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAviatorGame } from "@/hooks/useAviatorGame";
import GameDisplay from "@/components/aviator/GameDisplay";
import GameControls from "@/components/aviator/GameControls";
import GameStats from "@/components/aviator/GameStats";
import GameHistory from "@/components/GameHistory";

const GameAviator = () => {
  const navigate = useNavigate();
  const {
    betAmount,
    setBetAmount,
    multiplier,
    isFlying,
    gameStarted,
    cashedOut,
    balance,
    currentBet,
    gameHistory,
    highestMultiplier,
    placeBet,
    cashOut
  } = useAviatorGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white p-2 sm:p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-4 sm:mb-8 px-2 sm:px-0">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-gray-600 hover:bg-gray-700 mr-3 sm:mr-4 touch-manipulation active:scale-95"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Aviator Game
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="xl:col-span-2 order-1">
            <GameDisplay
              multiplier={multiplier}
              isFlying={isFlying}
              gameStarted={gameStarted}
              cashedOut={cashedOut}
              currentBet={currentBet}
            />
          </div>

          <div className="order-2 xl:order-2">
            <GameStats
              balance={balance}
              currentBet={currentBet}
              multiplier={multiplier}
              gameStarted={gameStarted}
              highestMultiplier={highestMultiplier}
            />
            <div className="mt-4 sm:mt-6">
              <GameControls
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                gameStarted={gameStarted}
                cashedOut={cashedOut}
                placeBet={placeBet}
                cashOut={cashOut}
              />
            </div>
          </div>

          <div className="order-3 xl:order-3">
            <GameHistory history={gameHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameAviator;
