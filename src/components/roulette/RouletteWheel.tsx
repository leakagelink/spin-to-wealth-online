
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
    <div className="mb-8">
      {/* Professional Roulette Wheel */}
      <div className="relative w-96 h-96 mx-auto">
        {/* Outer decorative ring */}
        <div className="absolute inset-0 rounded-full border-8 border-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 shadow-2xl">
          {/* Middle ring with numbers */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-green-800 via-green-900 to-black border-4 border-yellow-500 overflow-hidden">
            {/* Inner spinning wheel */}
            <div 
              className="absolute inset-6 rounded-full bg-gradient-to-br from-red-900 via-black to-red-900 transition-all duration-[4000ms] ease-out overflow-hidden"
              style={{
                transform: spinning 
                  ? 'rotate(1800deg)' 
                  : `rotate(${result ? result * (360 / 37) : 0}deg)`
              }}
            >
              {/* Number segments positioned inside the wheel */}
              {numbers.map((num, index) => {
                const angle = (index * 360) / 37;
                const color = getNumberColor(num);
                return (
                  <div
                    key={num}
                    className={`absolute w-7 h-7 flex items-center justify-center text-xs font-bold text-white rounded-full border border-yellow-300 shadow-md ${
                      color === 'red' ? 'bg-gradient-to-br from-red-500 to-red-700' : 
                      color === 'black' ? 'bg-gradient-to-br from-gray-800 to-black' : 
                      'bg-gradient-to-br from-green-500 to-green-700'
                    }`}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-80px) rotate(-${angle}deg)`,
                    }}
                  >
                    {num}
                  </div>
                );
              })}
              
              {/* Center hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-yellow-300 shadow-xl flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Ball positioned inside the wheel track */}
            <div 
              className={`absolute w-4 h-4 rounded-full shadow-xl transition-all duration-100 ${
                spinning ? 'animate-pulse' : ''
              }`}
              style={{
                background: 'radial-gradient(circle at 30% 30%, #ffffff, #e5e5e5, #cccccc)',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${ballPosition}deg) translateY(-110px)`,
                boxShadow: spinning 
                  ? '0 0 15px rgba(255, 255, 255, 0.9), inset 0 1px 3px rgba(0, 0, 0, 0.4)' 
                  : '0 2px 6px rgba(0, 0, 0, 0.5), inset 0 1px 3px rgba(0, 0, 0, 0.4)',
                zIndex: 10,
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-gray-100 to-gray-300 shadow-inner"></div>
            </div>
          </div>
          
          {/* Wheel pointer */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 z-10 drop-shadow-lg"></div>
        </div>
      </div>
      
      {/* Enhanced Result Display */}
      <div className="mt-12">
        {spinning ? (
          <div className="text-4xl font-bold text-yellow-400 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 animate-spin text-yellow-300" />
            <span className="animate-pulse bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Spinning the Wheel...
            </span>
            <Sparkles className="w-10 h-10 animate-spin text-yellow-300" />
          </div>
        ) : result !== null ? (
          <div className="space-y-6 animate-fade-in">
            <div className="text-8xl font-bold text-yellow-400 animate-bounce drop-shadow-2xl">
              {result}
            </div>
            <div className={`text-3xl font-bold px-8 py-4 rounded-2xl inline-block shadow-2xl border-2 transition-all duration-300 ${
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
          <div className="text-gray-400 text-2xl font-medium">
            🎰 Place your bet and spin the wheel!
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteWheel;
