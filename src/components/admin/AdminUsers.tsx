
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
  referral_code: string;
  balance: number;
  total_deposited: number;
  total_withdrawn: number;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          phone,
          created_at,
          referral_code,
          wallets (
            balance,
            total_deposited,
            total_withdrawn
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedUsers = data.map(user => ({
        id: user.id,
        full_name: user.full_name || "N/A",
        phone: user.phone || "N/A",
        created_at: user.created_at,
        referral_code: user.referral_code || "N/A",
        balance: user.wallets?.[0]?.balance || 0,
        total_deposited: user.wallets?.[0]?.total_deposited || 0,
        total_withdrawn: user.wallets?.[0]?.total_withdrawn || 0,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.referral_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users by name, phone, or referral code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Phone</TableHead>
                  <TableHead className="text-gray-300">Referral Code</TableHead>
                  <TableHead className="text-gray-300">Balance</TableHead>
                  <TableHead className="text-gray-300">Deposited</TableHead>
                  <TableHead className="text-gray-300">Withdrawn</TableHead>
                  <TableHead className="text-gray-300">Joined</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-700">
                    <TableCell className="text-white">{user.full_name}</TableCell>
                    <TableCell className="text-gray-300">{user.phone}</TableCell>
                    <TableCell className="text-gray-300">{user.referral_code}</TableCell>
                    <TableCell className="text-green-400">₹{user.balance.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-400">₹{user.total_deposited.toLocaleString()}</TableCell>
                    <TableCell className="text-yellow-400">₹{user.total_withdrawn.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 hover:bg-red-700">
                          <Ban className="w-3 h-3" />
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
              No users found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
