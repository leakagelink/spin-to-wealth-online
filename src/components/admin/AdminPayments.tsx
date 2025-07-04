
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Save, Upload } from "lucide-react";
import { toast } from "sonner";

interface PaymentSettings {
  upi_id: string;
  qr_code_url: string;
  bank_details: {
    account_number: string;
    ifsc: string;
    bank_name: string;
    account_holder: string;
  };
}

const AdminPayments = () => {
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    upi_id: "",
    qr_code_url: "",
    bank_details: {
      account_number: "",
      ifsc: "",
      bank_name: "",
      account_holder: ""
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings' as any)
        .select('setting_value')
        .eq('setting_key', 'payment_methods')
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setPaymentSettings(data.setting_value as PaymentSettings);
      }
    } catch (error) {
      console.error("Error fetching payment settings:", error);
      toast.error("Failed to fetch payment settings");
    } finally {
      setLoading(false);
    }
  };

  const savePaymentSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings' as any)
        .upsert({
          setting_key: "payment_methods",
          setting_value: paymentSettings,
          description: "Payment configuration"
        });

      if (error) throw error;

      // Log admin action
      try {
        await supabase.rpc('log_admin_action' as any, {
          _action: "Payment settings updated",
          _target_type: "system",
          _details: { updated_fields: Object.keys(paymentSettings) }
        });
      } catch (logError) {
        console.warn("Failed to log admin action:", logError);
      }

      toast.success("Payment settings saved successfully");
    } catch (error) {
      console.error("Error saving payment settings:", error);
      toast.error("Failed to save payment settings");
    } finally {
      setSaving(false);
    }
  };

  const handleBankDetailsChange = (field: string, value: string) => {
    setPaymentSettings(prev => ({
      ...prev,
      bank_details: {
        ...prev.bank_details,
        [field]: value
      }
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading payment settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* UPI Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">UPI Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="upi_id" className="text-gray-300">UPI ID</Label>
                <Input
                  id="upi_id"
                  value={paymentSettings.upi_id}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, upi_id: e.target.value }))}
                  placeholder="your-upi@paytm"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qr_code_url" className="text-gray-300">QR Code URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="qr_code_url"
                    value={paymentSettings.qr_code_url}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, qr_code_url: e.target.value }))}
                    placeholder="https://example.com/qr-code.png"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button variant="outline" className="border-gray-600 hover:bg-gray-700">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Bank Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account_holder" className="text-gray-300">Account Holder Name</Label>
                <Input
                  id="account_holder"
                  value={paymentSettings.bank_details.account_holder}
                  onChange={(e) => handleBankDetailsChange("account_holder", e.target.value)}
                  placeholder="John Doe"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_number" className="text-gray-300">Account Number</Label>
                <Input
                  id="account_number"
                  value={paymentSettings.bank_details.account_number}
                  onChange={(e) => handleBankDetailsChange("account_number", e.target.value)}
                  placeholder="1234567890"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc" className="text-gray-300">IFSC Code</Label>
                <Input
                  id="ifsc"
                  value={paymentSettings.bank_details.ifsc}
                  onChange={(e) => handleBankDetailsChange("ifsc", e.target.value)}
                  placeholder="SBIN0001234"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_name" className="text-gray-300">Bank Name</Label>
                <Input
                  id="bank_name"
                  value={paymentSettings.bank_details.bank_name}
                  onChange={(e) => handleBankDetailsChange("bank_name", e.target.value)}
                  placeholder="State Bank of India"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* QR Code Preview */}
          {paymentSettings.qr_code_url && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">QR Code Preview</h3>
              <div className="flex justify-center">
                <img
                  src={paymentSettings.qr_code_url}
                  alt="Payment QR Code"
                  className="w-48 h-48 object-contain bg-white rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={savePaymentSettings}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Payment Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
