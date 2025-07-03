
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Gamepad2, Settings, Save } from "lucide-react";
import { toast } from "sonner";

interface GameSetting {
  id: string;
  game_name: string;
  is_enabled: boolean;
  min_bet_amount: number;
  max_bet_amount: number;
  game_config: any;
  updated_at: string;
}

const AdminGames = () => {
  const [games, setGames] = useState<GameSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ min_bet: number; max_bet: number }>({ min_bet: 0, max_bet: 0 });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from("game_settings")
        .select("*")
        .order("game_name");

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast.error("Failed to fetch game settings");
    } finally {
      setLoading(false);
    }
  };

  const toggleGameStatus = async (gameId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("game_settings")
        .update({ is_enabled: !currentStatus })
        .eq("id", gameId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc("log_admin_action", {
        _action: `Game ${!currentStatus ? 'enabled' : 'disabled'}`,
        _target_type: "game",
        _target_id: gameId,
        _details: { new_status: !currentStatus }
      });

      toast.success(`Game ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      fetchGames();
    } catch (error) {
      console.error("Error updating game status:", error);
      toast.error("Failed to update game status");
    }
  };

  const startEditing = (game: GameSetting) => {
    setEditingGame(game.id);
    setEditValues({
      min_bet: game.min_bet_amount,
      max_bet: game.max_bet_amount
    });
  };

  const saveGameSettings = async (gameId: string) => {
    try {
      const { error } = await supabase
        .from("game_settings")
        .update({
          min_bet_amount: editValues.min_bet,
          max_bet_amount: editValues.max_bet
        })
        .eq("id", gameId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc("log_admin_action", {
        _action: "Game settings updated",
        _target_type: "game",
        _target_id: gameId,
        _details: editValues
      });

      toast.success("Game settings updated successfully");
      setEditingGame(null);
      fetchGames();
    } catch (error) {
      console.error("Error updating game settings:", error);
      toast.error("Failed to update game settings");
    }
  };

  const getGameDisplayName = (gameName: string) => {
    return gameName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return <div className="text-center py-8">Loading games...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            Game Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Game Name</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Min Bet</TableHead>
                  <TableHead className="text-gray-300">Max Bet</TableHead>
                  <TableHead className="text-gray-300">Last Updated</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">
                      {getGameDisplayName(game.game_name)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={game.is_enabled}
                          onCheckedChange={() => toggleGameStatus(game.id, game.is_enabled)}
                        />
                        <Badge className={game.is_enabled ? "bg-green-600" : "bg-red-600"}>
                          {game.is_enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingGame === game.id ? (
                        <Input
                          type="number"
                          value={editValues.min_bet}
                          onChange={(e) => setEditValues(prev => ({ ...prev, min_bet: Number(e.target.value) }))}
                          className="w-20 bg-gray-700/50 border-gray-600 text-white"
                        />
                      ) : (
                        <span className="text-green-400">₹{game.min_bet_amount}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingGame === game.id ? (
                        <Input
                          type="number"
                          value={editValues.max_bet}
                          onChange={(e) => setEditValues(prev => ({ ...prev, max_bet: Number(e.target.value) }))}
                          className="w-24 bg-gray-700/50 border-gray-600 text-white"
                        />
                      ) : (
                        <span className="text-green-400">₹{game.max_bet_amount}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(game.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {editingGame === game.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveGameSettings(game.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingGame(null)}
                              className="border-gray-600 hover:bg-gray-700"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(game)}
                            className="border-gray-600 hover:bg-gray-700"
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGames;
