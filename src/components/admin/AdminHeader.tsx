
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface AdminHeaderProps {
  userEmail?: string;
}

const AdminHeader = ({ userEmail }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Admin Panel
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          Welcome, {userEmail}
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
  );
};

export default AdminHeader;
