
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Wallet, History, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TransactionHistory from "@/components/TransactionHistory";
import ReferralSection from "@/components/ReferralSection";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: ""
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch wallet
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError && walletError.code !== 'PGRST116') {
        throw walletError;
      }

      setProfile(profileData);
      setWallet(walletData);
      
      if (profileData) {
        setFormData({
          full_name: profileData.full_name || "",
          phone: profileData.phone || ""
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      
      fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="mr-4 border-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
            <TabsTrigger value="referrals">Refer & Earn</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={updating}
                    className="bg-gradient-to-r from-blue-500 to-cyan-400"
                  >
                    {updating ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralSection referralCode={profile?.referral_code} wallet={wallet} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
