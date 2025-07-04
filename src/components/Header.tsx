
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, User, UserCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface HeaderProps {
  isLoggedIn: boolean;
  userBalance: number;
  onAuthClick: () => void;
  onLogout: () => void;
}

const Header = ({ isLoggedIn, userBalance, onAuthClick, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        setIsAdmin(!!data);
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return (
    <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            GameZone
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold">₹{userBalance.toLocaleString()}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin')} 
                className="border-orange-600 hover:bg-orange-700 text-orange-400 hover:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/profile')} 
                className="border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout} 
                className="border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={onAuthClick} className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500">
              <User className="w-4 h-4 mr-2" />
              Login / Register
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
