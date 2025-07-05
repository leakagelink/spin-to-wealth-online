
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAuth } from "@/components/AuthContext";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabs from "@/components/admin/AdminTabs";

const Admin = () => {
  const { user } = useAuth();
  const { 
    isAdmin, 
    checkingAdmin, 
    showAdminLogin, 
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

  if (showAdminLogin) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-300 mb-4">आपके पास admin access नहीं है</p>
        </div>
      </div>
    );
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
