-- Execute this entire script in your Supabase SQL Editor

-- 1. Create Categories Table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  "limit" numeric NOT NULL,
  icon text DEFAULT 'circle',
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Create Transactions Table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  date timestamp with time zone DEFAULT now(),
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Disable Row Level Security (RLS) for seamless prototyping
-- Note: If you plan to add User Login later, you will want to enable RLS and add policies.
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- 4. Insert Default Categories (Optional)
INSERT INTO categories (id, name, "limit", icon) VALUES 
  (gen_random_uuid(), 'Groceries', 600, 'shopping-cart'),
  (gen_random_uuid(), 'Dining Out', 300, 'utensils'),
  (gen_random_uuid(), 'Fun Money', 150, 'coffee');
