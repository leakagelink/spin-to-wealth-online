
import { BetOption } from "@/types/roulette";

interface BettingOptionsProps {
  betOptions: BetOption[];
  selectedBet: string;
  setSelectedBet: (bet: string) => void;
  spinning: boolean;
}

const BettingOptions = ({ betOptions, selectedBet, setSelectedBet, spinning }: BettingOptionsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto px-4 sm:px-0">
      {betOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setSelectedBet(option.value)}
          disabled={spinning}
          className={`${option.color} h-14 sm:h-16 rounded-lg sm:rounded-xl border-2 ${
            selectedBet === option.value ? "border-yellow-400 ring-2 sm:ring-4 ring-yellow-400/30 scale-105" : "border-gray-600"
          } hover:scale-105 active:scale-95 transform transition-all duration-200 flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation`}
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none'
          }}
        >
          <span className="mr-1 sm:mr-2 text-lg sm:text-xl">{option.icon}</span>
          <span className="text-xs sm:text-base font-semibold">{option.name}</span>
        </button>
      ))}
    </div>
  );
};

export default BettingOptions;
