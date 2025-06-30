
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, Plus, Minus, Smartphone, QrCode, CreditCard } from "lucide-react";

interface WalletSectionProps {
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

const WalletSection = ({ balance, onBalanceUpdate }: WalletSectionProps) => {
  const { user } = useAuth();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [wallet, setWallet] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user]);

  const fetchWallet = async () => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setWallet(data);
        onBalanceUpdate(Number(data.balance));
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const handleDeposit = async (method: string) => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: parseFloat(depositAmount),
          method: method,
          transaction_id: transactionId || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Deposit request submitted",
        description: `Your ${method} deposit request for ₹${depositAmount} has been submitted for admin approval.`,
      });

      setDepositAmount("");
      setTransactionId("");
      setShowDepositDialog(false);
    } catch (error) {
      console.error('Error submitting deposit:', error);
      toast({
        title: "Error",
        description: "Failed to submit deposit request",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(withdrawAmount) > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: parseFloat(withdrawAmount),
          method: 'Bank Transfer',
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Withdrawal request submitted",
        description: `Your withdrawal request for ₹${withdrawAmount} has been submitted for admin approval.`,
      });

      setWithdrawAmount("");
      setShowWithdrawDialog(false);
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request",
        variant: "destructive",
      });
    }
  };

  const displayBalance = wallet?.balance ? Number(wallet.balance) : balance;

  return (
    <section className="py-12">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Wallet className="w-6 h-6 text-green-400" />
            Your Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-green-400 mb-2">₹{displayBalance.toLocaleString()}</div>
            <p className="text-gray-400">Available Balance</p>
            {wallet?.bonus_balance && Number(wallet.bonus_balance) > 0 && (
              <p className="text-yellow-400 text-sm mt-2">
                Bonus: ₹{Number(wallet.bonus_balance).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Money to Wallet</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="upi" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                    <TabsTrigger value="upi">UPI</TabsTrigger>
                    <TabsTrigger value="qr">QR Code</TabsTrigger>
                    <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upi" className="space-y-4">
                    <div className="text-center p-4">
                      <Smartphone className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                      <p className="text-sm text-gray-400 mb-4">Pay via UPI</p>
                    </div>
                    <div>
                      <Label htmlFor="upi-amount">Amount</Label>
                      <Input
                        id="upi-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <Button onClick={() => handleDeposit("UPI")} className="w-full">
                      Pay with UPI
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="qr" className="space-y-4">
                    <div className="text-center p-4">
                      <QrCode className="w-12 h-12 mx-auto mb-4 text-green-400" />
                      <p className="text-sm text-gray-400 mb-4">Scan QR Code to Pay</p>
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          QR Code Here
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="qr-amount">Amount</Label>
                      <Input
                        id="qr-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="qr-txn">Transaction ID</Label>
                      <Input
                        id="qr-txn"
                        placeholder="Enter transaction ID after payment"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <Button onClick={() => handleDeposit("QR Code")} className="w-full">
                      Submit Transaction
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="netbanking" className="space-y-4">
                    <div className="text-center p-4">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                      <p className="text-sm text-gray-400 mb-4">Net Banking Details</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg space-y-2 text-sm">
                      <div><strong>Bank:</strong> State Bank of India</div>
                      <div><strong>Account Name:</strong> GameZone Pvt Ltd</div>
                      <div><strong>Account No:</strong> 123456789012</div>
                      <div><strong>IFSC:</strong> SBIN0001234</div>
                    </div>
                    <div>
                      <Label htmlFor="bank-amount">Amount</Label>
                      <Input
                        id="bank-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank-txn">Transaction ID</Label>
                      <Input
                        id="bank-txn"
                        placeholder="Enter transaction ID after payment"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <Button onClick={() => handleDeposit("Net Banking")} className="w-full">
                      Submit Transaction
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-600 hover:bg-gray-700">
                  <Minus className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Withdraw Money</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="withdraw-amount">Amount</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="Enter withdrawal amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    Available balance: ₹{displayBalance.toLocaleString()}
                  </p>
                  <Button onClick={handleWithdraw} className="w-full">
                    Submit Withdrawal Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WalletSection;
