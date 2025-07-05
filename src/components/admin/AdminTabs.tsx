
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, CreditCard, Gamepad2, Settings } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminTransactions from "@/components/admin/AdminTransactions";
import AdminGames from "@/components/admin/AdminGames";
import AdminPayments from "@/components/admin/AdminPayments";
import AdminSystemSettings from "@/components/admin/AdminSystemSettings";

const AdminTabs = () => {
  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 backdrop-blur-xl">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Users
        </TabsTrigger>
        <TabsTrigger value="transactions" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Transactions
        </TabsTrigger>
        <TabsTrigger value="games" className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" />
          Games
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payments
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <AdminDashboard />
      </TabsContent>

      <TabsContent value="users">
        <AdminUsers />
      </TabsContent>

      <TabsContent value="transactions">
        <AdminTransactions />
      </TabsContent>

      <TabsContent value="games">
        <AdminGames />
      </TabsContent>

      <TabsContent value="payments">
        <AdminPayments />
      </TabsContent>

      <TabsContent value="settings">
        <AdminSystemSettings />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
