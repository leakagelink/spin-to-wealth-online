
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
      {/* Realistic Roulette Wheel */}
      <div className="relative w-80 h-80 mx-auto">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-8 border-yellow-500 bg-gradient-to-br from-yellow-600 to-yellow-800 shadow-2xl">
          {/* Inner wheel */}
          <div className={`absolute inset-4 rounded-full bg-gradient-to-br from-red-800 via-black to-red-800 transition-transform duration-3000 ${spinning ? 'animate-spin' : ''}`}>
            {/* Number segments */}
            {numbers.map((num, index) => {
              const angle = (index * 360) / 37;
              const color = getNumberColor(num);
              return (
                <div
                  key={num}
                  className={`absolute w-6 h-6 flex items-center justify-center text-xs font-bold text-white rounded-full ${
                    color === 'red' ? 'bg-red-600' : 
                    color === 'black' ? 'bg-gray-900' : 'bg-green-600'
                  }`}
                  style={{
                    transform: `rotate(${angle}deg) translateY(-120px) rotate(-${angle}deg)`,
                    transformOrigin: 'center 120px',
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
          
          {/* Ball */}
          <div 
            className="absolute w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-100"
            style={{
              transform: `rotate(${ballPosition}deg) translateY(-140px)`,
              transformOrigin: 'center 140px',
              top: '50%',
              left: '50%',
              marginTop: '-8px',
              marginLeft: '-8px',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Result Display */}
      <div className="mt-8">
        {spinning ? (
          <div className="text-3xl font-bold text-yellow-400 animate-pulse flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 animate-spin" />
            Spinning...
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
        ) : result !== null ? (
          <div className="space-y-4">
            <div className="text-6xl font-bold text-yellow-400 animate-bounce">{result}</div>
            <div className={`text-2xl font-bold px-6 py-3 rounded-full inline-block ${
              getNumberColor(result) === 'red' ? 'bg-red-500/30 text-red-300 border border-red-400' : 
              getNumberColor(result) === 'black' ? 'bg-gray-800/50 text-gray-300 border border-gray-400' : 
              'bg-green-500/30 text-green-300 border border-green-400'
            }`}>
              {getNumberColor(result).toUpperCase()}
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-xl">Place your bet and spin the wheel!</div>
        )}
      </div>
    </div>
  );
};

export default RouletteWheel;
