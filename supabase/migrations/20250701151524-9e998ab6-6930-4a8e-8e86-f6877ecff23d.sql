
-- First, let's check if there are any users without wallets and create them
INSERT INTO public.wallets (user_id, balance, total_deposited, total_withdrawn, bonus_balance)
SELECT 
  p.id,
  1000.00,
  0.00,
  0.00,
  0.00
FROM public.profiles p
LEFT JOIN public.wallets w ON p.id = w.user_id
WHERE w.user_id IS NULL;

-- Also ensure the trigger is working properly by recreating it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, phone, referral_code)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    generate_referral_code()
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert into wallets table
  INSERT INTO public.wallets (user_id, balance, total_deposited, total_withdrawn, bonus_balance)
  VALUES (new.id, 1000.00, 0.00, 0.00, 0.00)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
