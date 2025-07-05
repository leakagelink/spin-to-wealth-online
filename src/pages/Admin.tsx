import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, CreditCard, Settings, BarChart3, Gamepad2, UserPlus } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminTransactions from "@/components/admin/AdminTransactions";
import AdminGames from "@/components/admin/AdminGames";
import AdminPayments from "@/components/admin/AdminPayments";
import AdminSystemSettings from "@/components/admin/AdminSystemSettings";
import { toast } from "sonner";

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log("Checking admin access...", { user, loading });
      
      if (loading) {
        console.log("Still loading auth...");
        return;
      }

      if (!user) {
        console.log("No user found, redirecting to home");
        toast.error("कृपया पहले login करें");
        navigate("/");
        return;
      }

      try {
        console.log("Checking admin role for user:", user.id);
        
        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        console.log("Admin role check result:", { roleData, roleError });

        if (roleError) {
          console.error("Error checking admin role:", roleError);
          // If there's an error checking roles, show admin setup option
          setShowAdminSetup(true);
          toast.info("Admin setup की जरूरत है");
        } else if (roleData) {
          console.log("User is admin, granting access");
          setIsAdmin(true);
          toast.success("Admin Panel में आपका स्वागत है!");
        } else {
          console.log("User is not admin, showing setup option");
          setShowAdminSetup(true);
          toast.warning("आपके पास admin access नहीं है। Admin setup करें।");
        }
      } catch (error) {
        console.error("Unexpected error in admin check:", error);
        setShowAdminSetup(true);
        toast.error("Admin check में error आया");
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminAccess();
  }, [user, loading, navigate]);

  const createAdminRole = async () => {
    if (!user || !adminEmail) {
      toast.error("कृपया valid email enter करें");
      return;
    }

    setCreatingAdmin(true);
    try {
      console.log("Creating admin role for email:", adminEmail);
      
      // First check if the email matches current user
      if (adminEmail === user.email) {
        console.log("Creating admin role for current user");
        
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([
            { user_id: user.id, role: "admin" }
          ]);

        if (roleError) {
          console.error("Error creating admin role:", roleError);
          toast.error("Admin role create करने में error आया");
          return;
        }
      } else {
        // Check if user with this email exists in profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", adminEmail)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error checking profiles:", profileError);
          toast.error("User profile check करने में error आया");
          return;
        }

        if (profileData) {
          // Create admin role for the found user
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert([
              { user_id: profileData.id, role: "admin" }
            ]);

          if (roleError) {
            console.error("Error creating admin role:", roleError);
            toast.error("Admin role create करने में error आया");
            return;
          }
        } else {
          // If no user found, create admin role for current user
          console.log("User not found, creating admin role for current user");
          
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert([
              { user_id: user.id, role: "admin" }
            ]);

          if (roleError) {
            console.error("Error creating admin role:", roleError);
            toast.error("Admin role create करने में error आया");
            return;
          }
        }
      }

      toast.success("Admin role successfully created!");
      setIsAdmin(true);
      setShowAdminSetup(false);
      
    } catch (error) {
      console.error("Error in admin setup:", error);
      toast.error("Admin setup में error आया");
    } finally {
      setCreatingAdmin(false);
    }
  };

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">
          {loading ? "Loading user..." : "Admin access check कर रहे हैं..."}
        </div>
      </div>
    );
  }

  if (showAdminSetup && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800/30 border-gray-700 backdrop-blur-xl">
          <CardHeader className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <CardTitle className="text-2xl text-white">Admin Setup</CardTitle>
            <p className="text-gray-300">Admin access setup करें</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin email enter करें"
                className="bg-gray-700/50 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                अपना current email या किसी भी registered user का email डालें
              </p>
            </div>
            
            <Button 
              onClick={createAdminRole}
              disabled={creatingAdmin || !adminEmail}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {creatingAdmin ? "Admin बना रहे हैं..." : "Admin बनाएं"}
            </Button>

            <div className="text-center">
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
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-300 mb-4">आपके पास admin access नहीं है</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Home पर वापस जाएं
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Welcome, {user?.email}
            </span>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-gray-600 hover:bg-gray-700"
            >
              Back to Site
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 backdrop-blur-xl">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="transactions">
            <AdminTransactions />
          </TabsContent>

          <TabsContent value="games">
            <AdminGames />
          </TabsContent>

          <TabsContent value="payments">
            <AdminPayments />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
