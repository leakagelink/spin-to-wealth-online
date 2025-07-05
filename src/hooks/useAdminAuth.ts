
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
  const [showAdminSetup, setShowAdminSetup] = useState(false);

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

  const handleAdminCreated = () => {
    setIsAdmin(true);
    setShowAdminSetup(false);
  };

  return {
    isAdmin,
    checkingAdmin,
    showAdminSetup,
    loading,
    handleAdminCreated
  };
};
