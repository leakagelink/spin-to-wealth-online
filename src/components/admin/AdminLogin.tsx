
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, LogIn } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("कृपया email और password दोनों enter करें");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting admin login for:", email);
      
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        toast.error("Login में error: " + error.message);
        return;
      }

      // Check if user has admin role after successful login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (roleData) {
          toast.success("Admin login successful!");
          navigate("/admin");
        } else {
          toast.error("आपके पास admin access नहीं है");
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login करने में error आया");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeAdmin = async () => {
    if (!email || !password) {
      toast.error("पहले login करें");
      return;
    }

    setIsLoading(true);
    try {
      // First login
      const { error: loginError } = await signIn(email, password);
      
      if (loginError) {
        toast.error("Login failed: " + loginError.message);
        return;
      }

      // Then make user admin
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: adminError } = await supabase.rpc('assign_admin_role', {
          target_user_id: user.id
        });

        if (adminError) {
          console.error("Admin role assignment error:", adminError);
          toast.error("Admin role assign करने में error");
        } else {
          toast.success("Admin role successfully assigned!");
          navigate("/admin");
        }
      }
    } catch (error) {
      console.error("Make admin error:", error);
      toast.error("Admin बनाने में error आया");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800/30 border-gray-700 backdrop-blur-xl">
        <CardHeader className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
          <p className="text-gray-300">Admin panel में access करने के लिए login करें</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin email enter करें"
                className="bg-gray-700/50 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password enter करें"
                className="bg-gray-700/50 border-gray-600 text-white"
                required
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoading ? "Login हो रहे हैं..." : "Admin Login"}
            </Button>
          </form>

          <div className="mt-4">
            <Button 
              onClick={handleMakeAdmin}
              disabled={isLoading}
              variant="outline"
              className="w-full border-orange-600 hover:bg-orange-700 text-orange-400 hover:text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              {isLoading ? "Admin बना रहे हैं..." : "Make Me Admin"}
            </Button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              अगर आप पहले से registered हैं तो इससे admin access मिल जाएगा
            </p>
          </div>

          <div className="text-center mt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-gray-600 hover:bg-gray-700 text-gray-200"
            >
              Home पर वापस जाएं
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
