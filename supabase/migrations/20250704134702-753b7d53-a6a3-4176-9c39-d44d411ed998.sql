
-- Create user_roles table for admin permissions
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create game_settings table
CREATE TABLE public.game_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_name TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  min_bet_amount NUMERIC NOT NULL DEFAULT 10,
  max_bet_amount NUMERIC NOT NULL DEFAULT 10000,
  game_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on game_settings
ALTER TABLE public.game_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for game_settings (readable by all authenticated users)
CREATE POLICY "Authenticated users can view game settings"
  ON public.game_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Create system_settings table
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for system_settings (readable by all authenticated users)
CREATE POLICY "Authenticated users can view system settings"
  ON public.system_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default game settings
INSERT INTO public.game_settings (game_name, is_enabled, min_bet_amount, max_bet_amount, game_config) VALUES
('aviator', true, 10, 5000, '{}'),
('roulette', true, 10, 5000, '{}'),
('color-prediction', true, 10, 2000, '{}'),
('mines', true, 10, 3000, '{}'),
('car-racing', true, 10, 4000, '{}'),
('teen-patti', true, 25, 5000, '{}'),
('bingo', true, 10, 1000, '{}'),
('chicken', true, 10, 2000, '{}'),
('jetx', true, 10, 5000, '{}');

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
('site_settings', '{"maintenance_mode": false, "registration_enabled": true, "min_withdrawal": 100, "max_withdrawal": 50000}', 'General site settings'),
('referral_settings', '{"bonus_amount": 50, "referral_commission": 0.05, "min_referrals_for_bonus": 1}', 'Referral program settings'),
('payment_methods', '{"upi_id": "", "qr_code_url": "", "bank_details": {"account_number": "", "ifsc": "", "bank_name": "", "account_holder": ""}}', 'Payment configuration');

-- Create admin logging function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  _action TEXT,
  _target_type TEXT DEFAULT NULL,
  _target_id UUID DEFAULT NULL,
  _details JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This is a placeholder function for logging admin actions
  -- You can extend this to insert into an admin_logs table if needed
  RAISE NOTICE 'Admin action logged: % on % (%) with details: %', _action, _target_type, _target_id, _details;
END;
$$;

-- Add foreign key relationship between transactions and profiles
-- This is done by ensuring we have the user_id field which can be used to join
-- The relationship already exists conceptually through user_id field
