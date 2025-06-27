
import { Card, CardContent } from "@/components/ui/card";
import RouletteWheel from "./RouletteWheel";
import BettingOptions from "./BettingOptions";
import { BetOption } from "@/types/roulette";

interface RouletteGameAreaProps {
  numbers: number[];
  getNumberColor: (num: number) => string;
  spinning: boolean;
  result: number | null;
  ballPosition: number;
  betOptions: BetOption[];
  selectedBet: string;
  setSelectedBet: (bet: string) => void;
}

const RouletteGameArea = ({ 
  numbers, 
  getNumberColor, 
  spinning, 
  result, 
  ballPosition, 
  betOptions, 
  selectedBet, 
  setSelectedBet 
}: RouletteGameAreaProps) => {
  return (
    <Card className="bg-gradient-to-br from-gray-800/50 via-red-900/20 to-gray-800/50 border-red-500/30 backdrop-blur-xl shadow-2xl">
      <CardContent className="p-8 text-center">
        <RouletteWheel
          numbers={numbers}
          getNumberColor={getNumberColor}
          spinning={spinning}
          result={result}
          ballPosition={ballPosition}
        />
        
        <BettingOptions
          betOptions={betOptions}
          selectedBet={selectedBet}
          setSelectedBet={setSelectedBet}
          spinning={spinning}
        />
      </CardContent>
    </Card>
  );
};

export default RouletteGameArea;
