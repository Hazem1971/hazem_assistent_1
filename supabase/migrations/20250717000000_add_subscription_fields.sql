/*
  # Add Subscription Fields
  Adds columns to track detailed subscription status and payment info.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - profiles: Adds subscription_status, plan_id, payment_date
*/

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS plan_id uuid REFERENCES public.plans(id),
ADD COLUMN IF NOT EXISTS payment_date timestamptz;

-- Update existing rows to have a default status if needed
UPDATE public.profiles SET subscription_status = 'active' WHERE subscription_status IS NULL;
