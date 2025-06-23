
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GameAviator from "./pages/GameAviator";
import GameMines from "./pages/GameMines";
import GameColorPrediction from "./pages/GameColorPrediction";
import GameTeenPatti from "./pages/GameTeenPatti";
import GameBingo from "./pages/GameBingo";
import GameRoulette from "./pages/GameRoulette";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/game/aviator" element={<GameAviator />} />
          <Route path="/game/mines" element={<GameMines />} />
          <Route path="/game/color-prediction" element={<GameColorPrediction />} />
          <Route path="/game/teen-patti" element={<GameTeenPatti />} />
          <Route path="/game/bingo" element={<GameBingo />} />
          <Route path="/game/roulette" element={<GameRoulette />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
