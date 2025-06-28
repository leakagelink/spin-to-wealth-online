
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
  // Calculate plane position based on multiplier for curved trajectory
  const getPlanePosition = () => {
    if (!gameStarted) return { x: 10, y: 80 };
    
    const progress = Math.min((multiplier - 1) * 20, 80);
    const x = 10 + progress;
    const y = 80 - (progress * 0.8) - Math.sin(progress * 0.05) * 10; // Curved upward path
    
    return { x: Math.min(x, 85), y: Math.max(y, 15) };
  };

  const planePos = getPlanePosition();
  
  return (
    <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl shadow-2xl">
      <CardContent className="p-0">
        <div className="relative h-96 bg-gradient-to-b from-sky-900/40 to-blue-800/40 rounded-lg overflow-hidden">
          {/* Grid background for more realistic look */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Stars background */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
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
          
          {/* Clouds for atmosphere */}
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-8 bg-white/10 rounded-full blur-sm animate-pulse"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          
          {/* Flight trajectory line */}
          {gameStarted && (
            <svg className="absolute inset-0 w-full h-full">
              <path
                d={`M 40 320 Q ${planePos.x * 4} ${planePos.y * 4} ${planePos.x * 4 + 50} ${planePos.y * 4 - 20}`}
                stroke="rgba(34, 197, 94, 0.6)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          )}
          
          {/* Enhanced plane with realistic movement */}
          <div 
            className="absolute transition-all duration-200 ease-out transform"
            style={{
              left: `${planePos.x}%`,
              top: `${planePos.y}%`,
              transform: `translate(-50%, -50%) rotate(${gameStarted ? Math.min(multiplier * 2, 45) : 0}deg)`
            }}
          >
            <div className={`relative ${isFlying ? 'animate-bounce' : ''}`}>
              <Plane className={`w-12 h-12 text-yellow-400 transition-all duration-200 drop-shadow-2xl ${
                gameStarted ? 'scale-110' : 'scale-100'
              }`} />
              
              {/* Enhanced plane effects */}
              {isFlying && (
                <>
                  {/* Engine glow */}
                  <div className="absolute -bottom-1 -left-1 w-14 h-14 bg-gradient-to-r from-orange-400/40 to-red-400/40 rounded-full blur-xl animate-pulse"></div>
                  
                  {/* Contrail effect */}
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse"
                        style={{
                          left: `${-5 - i * 4}px`,
                          top: `${Math.sin(i * 0.5) * 3}px`,
                          animationDelay: `${i * 0.1}s`,
                          opacity: 1 - (i * 0.12)
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Wing tip effects */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-md animate-ping"></div>
                </>
              )}
            </div>
          </div>
          
          {/* Enhanced multiplier display */}
          <div className="absolute top-8 left-8">
            <div className={`text-6xl font-bold transition-all duration-300 ${
              gameStarted 
                ? 'text-transparent bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text animate-pulse' 
                : 'text-white/80'
            } drop-shadow-2xl`}>
              {multiplier.toFixed(2)}x
            </div>
            {gameStarted && !cashedOut && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400 animate-bounce" />
                  <span className="text-green-400 font-semibold text-lg animate-pulse">
                    Flying High!
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Speed indicator */}
          {gameStarted && (
            <div className="absolute top-8 right-8 bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-600/30">
              <div className="text-sm text-gray-300">Speed</div>
              <div className="text-xl font-bold text-cyan-400">
                {(multiplier * 100).toFixed(0)} km/h
              </div>
            </div>
          )}
          
          {/* Enhanced bottom status */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            {gameStarted ? (
              <div className="text-center">
                <div className="text-green-400 font-semibold text-lg mb-2 animate-pulse bg-black/40 px-6 py-3 rounded-xl backdrop-blur-sm border border-green-400/30">
                  ✈️ Plane is ascending! Cash out before it crashes!
                </div>
                {currentBet > 0 && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-6 py-3 rounded-xl backdrop-blur-sm border border-yellow-400/30">
                    <span className="text-yellow-400 font-bold text-lg">
                      Potential Win: ₹{Math.floor(currentBet * multiplier).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-center bg-black/40 px-8 py-4 rounded-xl backdrop-blur-sm border border-gray-600/30">
                <div className="text-lg font-semibold mb-1">Ready for takeoff!</div>
                <div className="text-sm">Place your bet and watch the plane soar to new heights</div>
              </div>
            )}
          </div>
          
          {/* Altitude indicator */}
          {gameStarted && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <div className="bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-600/30 rotate-90">
                <div className="text-xs text-gray-300 -rotate-90">ALT</div>
                <div className="text-sm font-bold text-blue-400 -rotate-90">
                  {Math.floor(multiplier * 1000)}ft
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameDisplay;
