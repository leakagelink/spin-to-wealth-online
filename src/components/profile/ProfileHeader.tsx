
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/')}
        className="mr-4 border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      <h1 className="text-3xl font-bold">My Profile</h1>
    </div>
  );
};

export default ProfileHeader;
