
import { Sparkles } from "lucide-react";

interface RouletteWheelProps {
  numbers: number[];
  getNumberColor: (num: number) => string;
  spinning: boolean;
  result: number | null;
  ballPosition: number;
}

const RouletteWheel = ({ numbers, getNumberColor, spinning, result, ballPosition }: RouletteWheelProps) => {
  return (
    <div className="mb-4 sm:mb-8">
      {/* Mobile-optimized Roulette Wheel */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto">
        {/* Outer decorative ring */}
        <div className="absolute inset-0 rounded-full border-4 sm:border-8 border-yellow-500 bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 shadow-2xl">
          {/* Middle ring with numbers */}
          <div className="absolute inset-2 sm:inset-3 rounded-full bg-gradient-to-br from-green-800 via-green-900 to-black border-2 sm:border-4 border-yellow-500 overflow-hidden">
            {/* Inner spinning wheel */}
            <div 
              className="absolute inset-4 sm:inset-6 rounded-full bg-gradient-to-br from-red-900 via-black to-red-900 overflow-visible transition-transform duration-[4000ms] ease-out"
              style={{
                transform: spinning 
                  ? 'rotate(1800deg)' 
                  : `rotate(${result ? result * (360 / 37) : 0}deg)`
              }}
            >
              {/* Number segments positioned around the wheel */}
              {numbers.map((num, index) => {
                const angle = (index * 360) / 37;
                const color = getNumberColor(num);
                const radius = 110; // Increased radius for better visibility
                
                return (
                  <div
                    key={num}
                    className="absolute top-1/2 left-1/2 z-20"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                      transformOrigin: 'center',
                    }}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base font-bold text-white rounded-full border-2 border-yellow-300 shadow-xl ${
                        color === 'red' ? 'bg-gradient-to-br from-red-500 to-red-700' : 
                        color === 'black' ? 'bg-gradient-to-br from-gray-800 to-black' : 
                        'bg-gradient-to-br from-green-500 to-green-700'
                      }`}
                      style={{
                        transform: `rotate(-${angle}deg)`,
                        zIndex: 30
                      }}
                    >
                      {num}
                    </div>
                  </div>
                );
              })}
              
              {/* Center hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-yellow-300 shadow-xl flex items-center justify-center z-40">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Ball - spins independently on the outer track */}
            <div 
              className={`absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-xl transition-all duration-100 z-50 ${
                spinning ? 'animate-pulse' : ''
              }`}
              style={{
                background: 'radial-gradient(circle at 30% 30%, #ffffff, #e5e5e5, #cccccc)',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${ballPosition}deg) translateY(-120px)`,
                boxShadow: spinning 
                  ? '0 0 15px rgba(255, 255, 255, 0.9), inset 0 1px 3px rgba(0, 0, 0, 0.4)' 
                  : '0 2px 6px rgba(0, 0, 0, 0.5), inset 0 1px 3px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-gray-100 to-gray-300 shadow-inner"></div>
            </div>
          </div>
          
          {/* Wheel pointer */}
          <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-6 sm:border-l-4 sm:border-r-4 sm:border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 z-50 drop-shadow-lg"></div>
        </div>
      </div>
      
      {/* Mobile-optimized Result Display */}
      <div className="mt-6 sm:mt-12">
        {spinning ? (
          <div className="text-2xl sm:text-4xl font-bold text-yellow-400 flex items-center justify-center gap-2 sm:gap-3">
            <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 animate-spin text-yellow-300" />
            <span className="animate-pulse bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Spinning...
            </span>
            <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 animate-spin text-yellow-300" />
          </div>
        ) : result !== null ? (
          <div className="space-y-3 sm:space-y-6 animate-fade-in">
            <div className="text-4xl sm:text-8xl font-bold text-yellow-400 animate-bounce drop-shadow-2xl">
              {result}
            </div>
            <div className={`text-lg sm:text-3xl font-bold px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl inline-block shadow-2xl border-2 transition-all duration-300 ${
              getNumberColor(result) === 'red' 
                ? 'bg-gradient-to-br from-red-500/40 to-red-600/40 text-red-200 border-red-400 shadow-red-500/50' : 
              getNumberColor(result) === 'black' 
                ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 text-gray-200 border-gray-400 shadow-gray-500/50' : 
                'bg-gradient-to-br from-green-500/40 to-green-600/40 text-green-200 border-green-400 shadow-green-500/50'
            }`}>
              {getNumberColor(result).toUpperCase()}
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-lg sm:text-2xl font-medium text-center px-4">
            🎰 Place your bet and spin!
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteWheel;
