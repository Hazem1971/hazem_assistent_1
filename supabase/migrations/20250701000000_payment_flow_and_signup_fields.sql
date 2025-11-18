/*
          # [Feature] Add Payment Flow & Signup Fields
          This migration enhances the user profiles table with additional fields required for the new subscription and payment flow. It also updates the `handle_new_user` trigger to correctly populate these new fields upon user signup, ensuring a seamless onboarding experience.

          ## Query Description: This operation alters the `profiles` table to include new columns for job title, address, work type, phone numbers, and city. It is a structural change and is designed to be non-destructive to existing data; existing rows will have `NULL` values for the new columns. The `handle_new_user` function is replaced to map additional metadata from `auth.users` to these new columns during profile creation.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - **Table Modified**: `public.profiles`
          - **Columns Added**: `job_title`, `address`, `work_type`, `phone_number`, `whatsapp_number`, `city`
          - **Function Modified**: `public.handle_new_user()`
          
          ## Security Implications:
          - RLS Status: Unchanged. Existing RLS policies on `profiles` will apply to the new columns.
          - Policy Changes: No
          - Auth Requirements: None for the migration itself.
          
          ## Performance Impact:
          - Indexes: None added.
          - Triggers: The `on_auth_user_created` trigger's underlying function is updated.
          - Estimated Impact: Low. The change to the trigger only affects new user creation and is highly efficient.
          */

-- Add new columns to the profiles table
ALTER TABLE public.profiles
ADD COLUMN job_title TEXT,
ADD COLUMN address TEXT,
ADD COLUMN work_type TEXT,
ADD COLUMN phone_number TEXT,
ADD COLUMN whatsapp_number TEXT,
ADD COLUMN city TEXT;

-- Update the trigger function to handle new fields from signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, job_title, address, work_type, phone_number, whatsapp_number, city)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    'user', -- Default role
    new.raw_user_meta_data ->> 'job_title',
    new.raw_user_meta_data ->> 'address',
    new.raw_user_meta_data ->> 'work_type',
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'whatsapp_number',
    new.raw_user_meta_data ->> 'city'
  );
  RETURN new;
END;
$$;
