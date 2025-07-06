
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Ban, CheckCircle, Edit, Trash2, DollarSign, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import UserEditModal from "./UserEditModal";
import { useAuth } from "@/components/AuthContext";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
  referral_code: string;
  balance: number;
  total_deposited: number;
  total_withdrawn: number;
  last_sign_in: string;
  email_confirmed_at: string;
}

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users data...");
      setLoading(true);

      // First sync auth.users with profiles table
      await supabase.rpc('sync_auth_users_to_profiles');

      // Get all user data from auth.users via RPC call or direct query
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Auth users fetch error:", authError);
        // Fallback: get from profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (profilesError) throw profilesError;

        const usersWithWallets = await Promise.all(
          (profilesData || []).map(async (profile) => {
            const { data: walletData } = await supabase
              .from("wallets")
              .select("balance, total_deposited, total_withdrawn")
              .eq("user_id", profile.id)
              .single();

            return {
              id: profile.id,
              email: "N/A",
              full_name: profile.full_name || "N/A",
              phone: profile.phone || "N/A",
              created_at: profile.created_at,
              referral_code: profile.referral_code || "N/A",
              balance: walletData?.balance || 0,
              total_deposited: walletData?.total_deposited || 0,
              total_withdrawn: walletData?.total_withdrawn || 0,
              last_sign_in: "N/A",
              email_confirmed_at: "N/A",
            };
          })
        );

        setUsers(usersWithWallets);
      } else {
        // Process auth users data
        const usersWithDetails = await Promise.all(
          authData.users.map(async (authUser) => {
            // Get profile data
            const { data: profileData } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", authUser.id)
              .single();

            // Get wallet data
            const { data: walletData } = await supabase
              .from("wallets")
              .select("balance, total_deposited, total_withdrawn")
              .eq("user_id", authUser.id)
              .single();

            return {
              id: authUser.id,
              email: authUser.email || "N/A",
              full_name: profileData?.full_name || authUser.user_metadata?.full_name || "N/A",
              phone: profileData?.phone || authUser.user_metadata?.phone || "N/A",
              created_at: authUser.created_at,
              referral_code: profileData?.referral_code || "N/A",
              balance: walletData?.balance || 0,
              total_deposited: walletData?.total_deposited || 0,
              total_withdrawn: walletData?.total_withdrawn || 0,
              last_sign_in: authUser.last_sign_in_at || "Never",
              email_confirmed_at: authUser.email_confirmed_at || "Not confirmed",
            };
          })
        );

        setUsers(usersWithDetails);
      }

      console.log("Users data fetched successfully");
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Users data fetch करने में error आया");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("क्या आप इस user को delete करना चाहते हैं?")) return;

    try {
      // Delete from profiles first
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) throw profileError;

      // Delete from wallets
      const { error: walletError } = await supabase
        .from("wallets")
        .delete()
        .eq("user_id", userId);

      if (walletError) console.warn("Wallet delete warning:", walletError);

      // Note: We can't delete from auth.users via client SDK
      // Admin should use Supabase dashboard for that

      toast.success("User successfully deleted!");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("User delete करने में error आया");
    }
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUserUpdated = () => {
    fetchUsers(); // Refresh the list
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.referral_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-400 mr-2" />
        <span className="text-white">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              User Management ({users.length} users)
            </CardTitle>
            <Button 
              onClick={fetchUsers}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users by name, email, phone, or referral code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">User Info</TableHead>
                  <TableHead className="text-gray-300">Contact</TableHead>
                  <TableHead className="text-gray-300">Referral</TableHead>
                  <TableHead className="text-gray-300">Balance</TableHead>
                  <TableHead className="text-gray-300">Deposited</TableHead>
                  <TableHead className="text-gray-300">Withdrawn</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-700">
                    <TableCell>
                      <div className="text-white">
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                        <div className="text-xs text-gray-500">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{user.phone}</TableCell>
                    <TableCell className="text-gray-300">{user.referral_code}</TableCell>
                    <TableCell className="text-green-400 font-mono">₹{user.balance.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-400 font-mono">₹{user.total_deposited.toLocaleString()}</TableCell>
                    <TableCell className="text-yellow-400 font-mono">₹{user.total_withdrawn.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={user.email_confirmed_at !== "Not confirmed" ? "default" : "secondary"}>
                        {user.email_confirmed_at !== "Not confirmed" ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditUser(user)}
                          className="border-blue-600 hover:bg-blue-700 text-blue-400 hover:text-white"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteUser(user.id)}
                          className="border-red-600 hover:bg-red-700 text-red-400 hover:text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              {searchTerm ? "No users found matching your search criteria." : "No users found."}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default AdminUsers;
