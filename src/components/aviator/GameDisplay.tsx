
import { Card, CardContent } from "@/components/ui/card";
import { Plane, TrendingUp } from "lucide-react";

interface GameDisplayProps {
  multiplier: number;
  isFlying: boolean;
  gameStarted: boolean;
  cashedOut: boolean;
  currentBet: number;
}

const GameDisplay = ({ multiplier, isFlying, gameStarted, cashedOut, currentBet }: GameDisplayProps) => {
  return (
    <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl shadow-2xl">
      <CardContent className="p-0">
        <div className="relative h-96 bg-gradient-to-b from-sky-900/40 to-blue-800/40 rounded-lg overflow-hidden">
          {/* Stars background */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          
          {/* Plane with enhanced animations */}
          {gameStarted && (
            <div className={`absolute transition-all duration-1000 ease-out ${
              isFlying 
                ? 'bottom-32 left-1/2 transform -translate-x-1/2' 
                : 'bottom-20 left-10'
            }`}>
              <div className={`relative ${isFlying ? 'animate-bounce' : ''}`}>
                <Plane className={`w-16 h-16 text-white ${
                  isFlying ? 'rotate-45' : 'rotate-12'
                } transition-transform duration-1000 drop-shadow-2xl`} />
                
                {/* Enhanced plane trail effect */}
                {isFlying && (
                  <>
                    <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 rounded-full blur-lg animate-ping"></div>
                    
                    {/* Trail particles */}
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-300/60 rounded-full animate-pulse"
                        style={{
                          bottom: `${-10 - i * 5}px`,
                          right: `${-5 - i * 3}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Enhanced multiplier display */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`text-7xl font-bold transition-all duration-200 ${
              gameStarted 
                ? 'text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text scale-110 animate-pulse' 
                : 'text-white'
            } drop-shadow-2xl`}>
              {multiplier.toFixed(2)}x
            </div>
            {gameStarted && !cashedOut && (
              <div className="text-center mt-4">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-400 animate-bounce" />
                  <span className="text-green-400 font-semibold animate-pulse">Rising!</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced bottom status */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            {gameStarted ? (
              <div className="text-center">
                <div className="text-green-400 font-semibold text-lg mb-2 animate-pulse bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                  🚀 Plane is soaring! Cash out before it crashes!
                </div>
                {currentBet > 0 && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-yellow-400/30">
                    <span className="text-yellow-400 font-bold">Potential Win: ₹{Math.floor(currentBet * multiplier)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-center bg-black/30 px-6 py-3 rounded-lg backdrop-blur-sm border border-gray-600/30">
                Place your bet and watch the plane take off!
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameDisplay;
