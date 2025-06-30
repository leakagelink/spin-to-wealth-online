
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, History, Users } from "lucide-react";

interface ProfileStatsProps {
  wallet: any;
  profile: any;
}

const ProfileStats = ({ wallet, profile }: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-400" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">
            ₹{wallet?.balance?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Bonus: ₹{wallet?.bonus_balance?.toLocaleString() || '0'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Total Deposited
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400">
            ₹{wallet?.total_deposited?.toLocaleString() || '0'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-mono text-purple-400">
            {profile?.referral_code || 'Loading...'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;
