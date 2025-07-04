
-- Create admin user role (you'll need to replace 'your-email@example.com' with actual admin email)
-- First, let's create a function to assign admin role to a user
CREATE OR REPLACE FUNCTION assign_admin_role(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get user ID from auth.users table
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email 
  LIMIT 1;
  
  IF user_id IS NOT NULL THEN
    -- Insert admin role for the user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role assigned to user: %', user_email;
  ELSE
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$;

-- Allow admin users to manage all tables
CREATE POLICY "Admins can manage game settings"
  ON public.game_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage system settings"
  ON public.system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create a test admin user account
-- Note: This creates a user with email 'admin@gamezone.com' and password 'admin123'
-- You should change this password after first login
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@gamezone.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Assign admin role to the test user
SELECT assign_admin_role('admin@gamezone.com');
