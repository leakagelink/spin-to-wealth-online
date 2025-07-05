
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAuth } from "@/components/AuthContext";
import AdminSetup from "@/components/admin/AdminSetup";
import AdminAccessDenied from "@/components/admin/AdminAccessDenied";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabs from "@/components/admin/AdminTabs";

const Admin = () => {
  const { user } = useAuth();
  const { 
    isAdmin, 
    checkingAdmin, 
    showAdminSetup, 
    loading, 
    handleAdminCreated 
  } = useAdminAuth();

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
    return <AdminSetup onAdminCreated={handleAdminCreated} />;
  }

  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <AdminHeader userEmail={user?.email} />
        <AdminTabs />
      </div>
    </div>
  );
};

export default Admin;
