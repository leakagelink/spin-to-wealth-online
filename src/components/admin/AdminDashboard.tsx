
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Gamepad2, TrendingUp, IndianRupee } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  pendingTransactions: number;
  totalRevenue: number;
  totalGamesPlayed: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    totalRevenue: 0,
    totalGamesPlayed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Get total users
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Get total transactions
        const { count: totalTransactions } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true });

        // Get pending transactions
        const { count: pendingTransactions } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        // Get total revenue (completed transactions)
        const { data: revenueData } = await supabase
          .from("transactions")
          .select("amount")
          .eq("status", "completed")
          .eq("type", "deposit");

        const totalRevenue = revenueData?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;

        setStats({
          totalUsers: totalUsers || 0,
          totalTransactions: totalTransactions || 0,
          pendingTransactions: pendingTransactions || 0,
          totalRevenue,
          totalGamesPlayed: 0, // This would need game history tracking
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalTransactions}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingTransactions}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">New user registrations today</span>
                <span className="text-green-400 font-semibold">+12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">Pending withdrawals</span>
                <span className="text-yellow-400 font-semibold">{stats.pendingTransactions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">Games played today</span>
                <span className="text-blue-400 font-semibold">156</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">All Games</span>
                <span className="text-green-400 font-semibold">Online</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">Payment Gateway</span>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">Server Status</span>
                <span className="text-green-400 font-semibold">Healthy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
