/*
  # Add created_at to profiles table

  ## Query Description:
  This operation adds a `created_at` timestamp column to the `profiles` table.
  It defaults to the current timestamp for existing rows. This fixes the "column does not exist" error on the Users dashboard.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Table: public.profiles
  - Column: created_at (timestamptz, default now())
*/

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
