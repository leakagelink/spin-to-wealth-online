
import { BetOption } from "@/types/roulette";

interface BettingOptionsProps {
  betOptions: BetOption[];
  selectedBet: string;
  setSelectedBet: (bet: string) => void;
  spinning: boolean;
}

const BettingOptions = ({ betOptions, selectedBet, setSelectedBet, spinning }: BettingOptionsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
      {betOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setSelectedBet(option.value)}
          disabled={spinning}
          className={`${option.color} h-16 rounded-xl border-2 ${
            selectedBet === option.value ? "border-yellow-400 ring-4 ring-yellow-400/30" : "border-gray-600"
          } hover:scale-105 transform transition-all duration-200 flex items-center justify-center text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="mr-2 text-xl">{option.icon}</span>
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default BettingOptions;
