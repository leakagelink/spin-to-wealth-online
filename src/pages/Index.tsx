
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GamesGrid from "@/components/GamesGrid";
import WalletSection from "@/components/WalletSection";
import AuthDialog from "@/components/AuthDialog";
import { Plane, Bomb, Palette, Grid3X3, Spade, Circle } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();

  const games = [
    {
      id: "aviator",
      name: "Aviator",
      icon: Plane,
      description: "Watch the plane fly and cash out before it crashes!",
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: "mines",
      name: "Bomb/Mines",
      icon: Bomb,
      description: "Navigate through the minefield and win big!",
      color: "from-red-500 to-orange-400"
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

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Simulate login
    console.log("Login attempt:", credentials);
    setIsLoggedIn(true);
    setUserBalance(1000); // Demo balance
    setShowAuthDialog(false);
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
  };

  const handleRegister = (userData: { name: string; email: string; password: string; phone: string }) => {
    // Simulate registration
    console.log("Registration attempt:", userData);
    setIsLoggedIn(true);
    setUserBalance(0);
    setShowAuthDialog(false);
    toast({
      title: "Registration successful!",
      description: "Welcome to the platform!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header 
        isLoggedIn={isLoggedIn} 
        userBalance={userBalance}
        onAuthClick={() => setShowAuthDialog(true)}
        onLogout={() => {
          setIsLoggedIn(false);
          setUserBalance(0);
          toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
          });
        }}
      />
      
      <Hero onGetStarted={() => setShowAuthDialog(true)} />
      
      <div className="container mx-auto px-4 py-12">
        <GamesGrid games={games} isLoggedIn={isLoggedIn} />
        
        {isLoggedIn && (
          <WalletSection 
            balance={userBalance} 
            onBalanceUpdate={setUserBalance}
          />
        )}
      </div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default Index;
