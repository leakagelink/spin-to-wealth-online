
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";

interface SiteSettings {
  maintenance_mode: boolean;
  registration_enabled: boolean;
  min_withdrawal: number;
  max_withdrawal: number;
}

interface ReferralSettings {
  bonus_amount: number;
  referral_commission: number;
  min_referrals_for_bonus: number;
}

const AdminSystemSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    maintenance_mode: false,
    registration_enabled: true,
    min_withdrawal: 100,
    max_withdrawal: 50000
  });
  
  const [referralSettings, setReferralSettings] = useState<ReferralSettings>({
    bonus_amount: 50,
    referral_commission: 0.05,
    min_referrals_for_bonus: 1
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["site_settings", "referral_settings"]);

      if (error) throw error;

      data.forEach(setting => {
        if (setting.setting_key === "site_settings") {
          setSiteSettings(setting.setting_value as SiteSettings);
        } else if (setting.setting_key === "referral_settings") {
          setReferralSettings(setting.setting_value as ReferralSettings);
        }
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updates = [
        {
          setting_key: "site_settings",
          setting_value: siteSettings,
          description: "General site settings"
        },
        {
          setting_key: "referral_settings",
          setting_value: referralSettings,
          description: "Referral program settings"
        }
      ];

      const { error } = await supabase
        .from("system_settings")
        .upsert(updates);

      if (error) throw error;

      // Log admin action
      await supabase.rpc("log_admin_action", {
        _action: "System settings updated",
        _target_type: "system",
        _details: { site_settings: siteSettings, referral_settings: referralSettings }
      });

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Site Settings */}
      <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Site Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance_mode" className="text-gray-300">Maintenance Mode</Label>
                <Switch
                  id="maintenance_mode"
                  checked={siteSettings.maintenance_mode}
                  onCheckedChange={(checked) => 
                    setSiteSettings(prev => ({ ...prev, maintenance_mode: checked }))
                  }
                />
              </div>
              <p className="text-sm text-gray-400">
                Enable this to put the site in maintenance mode
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="registration_enabled" className="text-gray-300">Registration Enabled</Label>
                <Switch
                  id="registration_enabled"
                  checked={siteSettings.registration_enabled}
                  onCheckedChange={(checked) => 
                    setSiteSettings(prev => ({ ...prev, registration_enabled: checked }))
                  }
                />
              </div>
              <p className="text-sm text-gray-400">
                Allow new user registrations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="min_withdrawal" className="text-gray-300">Minimum Withdrawal (₹)</Label>
              <Input
                id="min_withdrawal"
                type="number"
                value={siteSettings.min_withdrawal}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, min_withdrawal: Number(e.target.value) }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_withdrawal" className="text-gray-300">Maximum Withdrawal (₹)</Label>
              <Input
                id="max_withdrawal"
                type="number"
                value={siteSettings.max_withdrawal}
                onChange={(e) => setSiteSettings(prev => ({ ...prev, max_withdrawal: Number(e.target.value) }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Settings */}
      <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white">Referral Program Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bonus_amount" className="text-gray-300">Referral Bonus Amount (₹)</Label>
              <Input
                id="bonus_amount"
                type="number"
                value={referralSettings.bonus_amount}
                onChange={(e) => setReferralSettings(prev => ({ ...prev, bonus_amount: Number(e.target.value) }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral_commission" className="text-gray-300">Referral Commission (%)</Label>
              <Input
                id="referral_commission"
                type="number"
                step="0.01"
                value={referralSettings.referral_commission * 100}
                onChange={(e) => setReferralSettings(prev => ({ ...prev, referral_commission: Number(e.target.value) / 100 }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_referrals" className="text-gray-300">Min Referrals for Bonus</Label>
              <Input
                id="min_referrals"
                type="number"
                value={referralSettings.min_referrals_for_bonus}
                onChange={(e) => setReferralSettings(prev => ({ ...prev, min_referrals_for_bonus: Number(e.target.value) }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSystemSettings;
