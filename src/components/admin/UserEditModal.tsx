
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, DollarSign, User, Phone, Mail } from "lucide-react";

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

interface UserEditModalProps {
  user: UserData;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

const UserEditModal = ({ user, isOpen, onClose, onUserUpdated }: UserEditModalProps) => {
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    phone: user.phone,
    balance: user.balance.toString(),
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update profile data
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update wallet balance
      const newBalance = parseFloat(formData.balance) || 0;
      const { error: walletError } = await supabase
        .from("wallets")
        .update({
          balance: newBalance,
        })
        .eq("user_id", user.id);

      if (walletError) throw walletError;

      // Log the admin action
      const { error: logError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "admin_update",
          amount: newBalance - user.balance,
          method: "admin",
          status: "completed",
          notes: `Admin updated user data. Balance changed from ₹${user.balance} to ₹${newBalance}`,
        });

      if (logError) console.warn("Log error:", logError);

      toast.success("User data successfully updated!");
      onUserUpdated();
    } catch (error) {
      console.error("Update user error:", error);
      toast.error("User data update करने में error आया");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Edit User: {user.full_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <span>Email: {user.email}</span>
            </div>
            <div className="text-sm text-gray-400">
              User ID: {user.id.substring(0, 8)}...
            </div>
            <div className="text-sm text-gray-400">
              Referral Code: {user.referral_code}
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <Label htmlFor="balance" className="text-gray-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Wallet Balance (₹)
              </Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => handleInputChange('balance', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter balance amount"
              />
              <div className="text-sm text-gray-400 mt-1">
                Current: ₹{user.balance.toLocaleString()}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* Account Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-700/50 p-3 rounded">
              <div className="text-gray-400">Total Deposited</div>
              <div className="text-blue-400 font-mono">₹{user.total_deposited.toLocaleString()}</div>
            </div>
            <div className="bg-gray-700/50 p-3 rounded">
              <div className="text-gray-400">Total Withdrawn</div>
              <div className="text-yellow-400 font-mono">₹{user.total_withdrawn.toLocaleString()}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
