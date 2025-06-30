
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Gift, TrendingUp } from "lucide-react";

const ReferralSection = ({ referralCode, wallet }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState([]);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    activeReferrals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferrals();
    }
  }, [user]);

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          profiles!referrals_referred_id_fkey(full_name, phone)
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReferrals(data || []);
      
      // Calculate stats
      const stats = {
        totalReferrals: data?.length || 0,
        totalEarnings: data?.reduce((sum, ref) => sum + Number(ref.earning_amount || 0), 0) || 0,
        activeReferrals: data?.filter(ref => ref.status === 'active').length || 0
      };
      setReferralStats(stats);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-blue-400" />
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {referralStats.totalReferrals}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Gift className="w-4 h-4 text-green-400" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ₹{referralStats.totalEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Active Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {referralStats.activeReferrals}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Tools */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle>Share Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Your Referral Code</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={referralCode || ''}
                readOnly
                className="bg-gray-700 border-gray-600 font-mono"
              />
              <Button onClick={copyReferralCode} size="sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={shareReferralLink}
              className="bg-gradient-to-r from-green-500 to-emerald-400"
            >
              Share Referral Link
            </Button>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-green-400">How it works:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Share your referral code with friends</li>
              <li>• They get bonus credits when they sign up</li>
              <li>• You earn 10% of their first deposit</li>
              <li>• No limit on referrals!</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading referrals...</div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No referrals yet. Start sharing your code!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        {referral.profiles?.full_name || 'Unknown User'}
                      </TableCell>
                      <TableCell>
                        {referral.profiles?.phone || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={referral.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                          {referral.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-400">
                        ₹{Number(referral.earning_amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>{formatDate(referral.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralSection;
