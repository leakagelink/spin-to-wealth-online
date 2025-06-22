
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface Game {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

interface GamesGridProps {
  games: Game[];
  isLoggedIn: boolean;
}

const GamesGrid = ({ games, isLoggedIn }: GamesGridProps) => {
  const navigate = useNavigate();

  const handleGameClick = (gameId: string) => {
    if (!isLoggedIn) {
      // Handle login prompt
      return;
    }
    navigate(`/game/${gameId}`);
  };

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Choose Your Game
        </h2>
        <p className="text-gray-400 text-lg">
          Select from our exciting collection of games and start winning!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card
            key={game.id}
            className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 cursor-pointer backdrop-blur-sm"
            onClick={() => handleGameClick(game.id)}
          >
            <CardHeader className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${game.color} flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
                <game.icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-white">{game.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-4">{game.description}</p>
              <Button
                className={`w-full bg-gradient-to-r ${game.color} hover:shadow-lg transition-all duration-200`}
                disabled={!isLoggedIn}
              >
                {isLoggedIn ? "Play Now" : "Login to Play"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default GamesGrid;
