
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Bomb, Palette, Grid3X3, Spade, Circle, Car, Zap, Rocket } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GamesGrid from "@/components/GamesGrid";
import WalletSection from "@/components/WalletSection";
import AuthDialog from "@/components/AuthDialog";
import { useAuth } from "@/components/AuthContext";
import { useState } from "react";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [userBalance, setUserBalance] = useState(1000);

  const games = [
    {
      id: "aviator",
      name: "Aviator",
      icon: Plane,
      description: "Watch the plane fly and cash out before it crashes!",
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: "car-racing",
      name: "Car Racing",
      icon: Car,
      description: "Race the car and cash out before it crashes!",
      color: "from-red-500 to-orange-400"
    },
    {
      id: "jetx",
      name: "JetX",
      icon: Rocket,
      description: "Launch the jet and multiply your winnings!",
      color: "from-blue-500 to-purple-400"
    },
    {
      id: "mines",
      name: "Bomb/Mines",
      icon: Bomb,
      description: "Navigate through the minefield and win big!",
      color: "from-red-500 to-orange-400"
    },
    {
      id: "chicken",
      name: "Chicken Game",
      icon: Zap,
      description: "Find chickens, avoid bones, multiply your bet!",
      color: "from-yellow-500 to-orange-400"
    },
    {
      id: "color-prediction",
      name: "Color Trading",
      icon: Palette,
      description: "Predict the next color and multiply your earnings!",
      color: "from-purple-500 to-pink-400"
    },
    {
      id: "bingo",
      name: "Bingo",
      icon: Grid3X3,
      description: "Classic bingo with modern twists and big rewards!",
      color: "from-green-500 to-emerald-400"
    },
    {
      id: "teen-patti",
      name: "Teen Patti",
      icon: Spade,
      description: "Play the classic Indian card game online!",
      color: "from-yellow-500 to-amber-400"
    },
    {
      id: "roulette",
      name: "Roulette",
      icon: Circle,
      description: "Spin the wheel and test your luck!",
      color: "from-indigo-500 to-blue-400"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header 
        isLoggedIn={!!user} 
        userBalance={userBalance}
        onAuthClick={() => setShowAuthDialog(true)}
        onLogout={signOut}
      />
      
      <Hero onGetStarted={() => setShowAuthDialog(true)} />
      
      <div className="container mx-auto px-4 py-12">
        <GamesGrid games={games} isLoggedIn={!!user} />
        
        {user && (
          <WalletSection 
            balance={userBalance} 
            onBalanceUpdate={setUserBalance}
          />
        )}
      </div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </div>
  );
};

export default Index;
