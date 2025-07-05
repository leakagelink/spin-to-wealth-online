
-- First, let's create a policy that allows users to insert their own admin role
-- This will enable the AdminSetup functionality to work properly
CREATE POLICY "Users can create admin role for themselves"
  ON public.user_roles
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND 
    role = 'admin'
  );

-- Create a function to safely assign admin role
CREATE OR REPLACE FUNCTION public.assign_admin_role(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert admin role for the specified user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Admin role assigned to user: %', target_user_id;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.assign_admin_role(UUID) TO authenticated;

-- Create a default admin user if none exists (using the first user in auth.users)
DO $$
DECLARE
  first_user_id UUID;
BEGIN
  -- Get the first user from auth.users
  SELECT id INTO first_user_id 
  FROM auth.users 
  ORDER BY created_at ASC 
  LIMIT 1;
  
  -- If a user exists and no admin exists, make them admin
  IF first_user_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (first_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;
