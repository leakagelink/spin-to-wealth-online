
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, TrendingDown } from "lucide-react";

interface GameHistoryEntry {
  id: string;
  game: string;
  bet: number;
  result: string;
  payout: number;
  timestamp: Date;
  status: 'win' | 'loss';
}

interface GameHistoryProps {
  history: GameHistoryEntry[];
}

const GameHistory = ({ history }: GameHistoryProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Game History
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-64 overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No game history yet
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {entry.status === 'win' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{entry.result}</div>
                    <div className="text-xs text-gray-400">
                      {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={entry.status === 'win' ? 'default' : 'destructive'}>
                    {entry.status === 'win' ? '+' : '-'}₹{Math.abs(entry.payout)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameHistory;
