
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const AdminAccessDenied = () => {
  const navigate = useNavigate();

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
};

export default AdminAccessDenied;
