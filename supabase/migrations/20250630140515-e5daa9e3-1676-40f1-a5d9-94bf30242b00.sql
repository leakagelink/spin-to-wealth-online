
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table for deposit/withdrawal history
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  method TEXT NOT NULL,
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table to track referral earnings
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  earning_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- Create wallets table to track user balances
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 1000.00,
  bonus_balance DECIMAL(10,2) DEFAULT 0.00,
  total_deposited DECIMAL(10,2) DEFAULT 0.00,
  total_withdrawn DECIMAL(10,2) DEFAULT 0.00,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for referrals
CREATE POLICY "Users can view referrals where they are referrer" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can view referrals where they are referred" ON public.referrals
  FOR SELECT USING (auth.uid() = referred_id);

-- RLS policies for wallets
CREATE POLICY "Users can view own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON public.wallets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON public.wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := 'REF' || LPAD(floor(random() * 999999)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, referral_code)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    generate_referral_code()
  );
  
  INSERT INTO public.wallets (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile and wallet when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
