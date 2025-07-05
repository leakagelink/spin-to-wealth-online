
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface AdminSetupProps {
  onAdminCreated: () => void;
}

const AdminSetup = ({ onAdminCreated }: AdminSetupProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState(user?.email || "");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const createAdminRole = async () => {
    if (!user) {
      toast.error("कृपया पहले login करें");
      return;
    }

    setCreatingAdmin(true);
    try {
      console.log("Creating admin role for current user:", user.id);
      
      const { error: roleError } = await supabase.rpc('assign_admin_role', {
        target_user_id: user.id
      });

      if (roleError) {
        console.error("Error creating admin role:", roleError);
        toast.error("Admin role create करने में error आया");
        return;
      }

      toast.success("Admin role successfully created!");
      onAdminCreated();
      
    } catch (error) {
      console.error("Error in admin setup:", error);
      toast.error("Admin setup में error आया");
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800/30 border-gray-700 backdrop-blur-xl">
        <CardHeader className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <CardTitle className="text-2xl text-white">Admin Setup</CardTitle>
          <p className="text-gray-300">Current user को admin बनाएं</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Email
            </label>
            <Input
              type="email"
              value={adminEmail}
              readOnly
              className="bg-gray-700/50 border-gray-600 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              इस email को admin बनाया जाएगा
            </p>
          </div>
          
          <Button 
            onClick={createAdminRole}
            disabled={creatingAdmin || !user}
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
};

export default AdminSetup;
