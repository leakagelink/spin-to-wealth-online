
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, CreditCard, Settings, BarChart3, Gamepad2 } from "lucide-react";
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

  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log("Checking admin access...", { user, loading });
      
      if (loading) {
        console.log("Still loading auth...");
        return;
      }

      if (!user) {
        console.log("No user found, redirecting to home");
        toast.error("Please login first");
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
          toast.error("Error checking admin permissions");
          navigate("/");
          return;
        }

        if (roleData) {
          console.log("User is admin, granting access");
          setIsAdmin(true);
          toast.success("Welcome to Admin Panel!");
        } else {
          console.log("User is not admin, denying access");
          toast.error("Access denied. Admin privileges required.");
          navigate("/");
        }
      } catch (error) {
        console.error("Unexpected error in admin check:", error);
        toast.error("Error checking admin permissions");
        navigate("/");
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminAccess();
  }, [user, loading, navigate]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">
          {loading ? "Loading user..." : "Checking admin access..."}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-300 mb-4">You don't have admin privileges</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Back to Home
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
