
import { supabase } from "@/integrations/supabase/client";

export class WalletService {
  static async fetchWalletBalance(userId: string): Promise<number | null> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching wallet balance:', error);
        // If wallet doesn't exist, create it
        if (error.code === 'PGRST116') {
          return await this.createWalletRecord(userId);
        }
        return null;
      }
      
      if (data) {
        console.log('Fetched wallet balance:', data.balance);
        return Number(data.balance);
      }
      return null;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return null;
    }
  }

  static async createWalletRecord(userId: string): Promise<number | null> {
    try {
      console.log('Creating wallet for user:', userId);
      const { data, error } = await supabase
        .from('wallets')
        .insert({
          user_id: userId,
          balance: 1000.00,
          total_deposited: 0.00,
          total_withdrawn: 0.00,
          bonus_balance: 0.00
        })
        .select('balance')
        .single();

      if (error) {
        console.error('Error creating wallet record:', error);
        return null;
      }

      if (data) {
        console.log('Created wallet with balance:', data.balance);
        return Number(data.balance);
      }
      return null;
    } catch (error) {
      console.error('Error creating wallet record:', error);
      return null;
    }
  }

  static async updateWalletBalance(userId: string, newBalance: number): Promise<boolean> {
    try {
      console.log('Updating wallet balance for user:', userId, 'to:', newBalance);
      
      // First ensure wallet exists
      const currentBalance = await this.fetchWalletBalance(userId);
      if (currentBalance === null) {
        console.log('Wallet not found, creating new wallet');
        await this.createWalletRecord(userId);
      }

      const { error } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating wallet balance:', error);
        return false;
      }
      
      console.log('Successfully updated wallet balance to:', newBalance);
      return true;
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      return false;
    }
  }

  static async ensureWalletExists(userId: string): Promise<boolean> {
    try {
      const balance = await this.fetchWalletBalance(userId);
      return balance !== null;
    } catch (error) {
      console.error('Error ensuring wallet exists:', error);
      return false;
    }
  }
}
