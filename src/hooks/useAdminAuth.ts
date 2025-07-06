
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminAuth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log("Checking admin access...", { user, loading });
      
      if (loading) {
        console.log("Still loading auth...");
        return;
      }

      if (!user) {
        console.log("No user found, showing admin login");
        setShowAdminLogin(true);
        setCheckingAdmin(false);
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
          toast.error("Admin access check करने में error आया");
          setShowAdminLogin(true);
        } else if (roleData) {
          console.log("User is admin, granting access");
          setIsAdmin(true);
          setShowAdminLogin(false);
          toast.success("Admin Panel में आपका स्वागत है!");
        } else {
          console.log("User is not admin, showing login");
          setShowAdminLogin(true);
          toast.warning("Admin access के लिए proper credentials की जरूरत है");
        }
      } catch (error) {
        console.error("Unexpected error in admin check:", error);
        setShowAdminLogin(true);
        toast.error("Admin check में error आया");
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminAccess();
  }, [user, loading, navigate]);

  const handleAdminCreated = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
    toast.success("Admin access successfully granted!");
  };

  return {
    isAdmin,
    checkingAdmin,
    showAdminLogin,
    loading,
    handleAdminCreated
  };
};
