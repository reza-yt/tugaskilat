-- ============================================================
-- TugasKilat Database Schema
-- ============================================================

-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INT NOT NULL DEFAULT 3,
  total_credits_purchased INT DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'free'
    CHECK (tier IN ('free','basic','pro')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TASKS (hasil generate tugas)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  task_type TEXT NOT NULL,
  subject TEXT,
  education_level TEXT NOT NULL
    CHECK (education_level IN ('sma','kuliah')),
  major TEXT,
  instructions TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','generating','completed','failed')),
  credits_used INT NOT NULL DEFAULT 1,
  word_count INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CREDIT TRANSACTIONS
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  type TEXT NOT NULL
    CHECK (type IN ('purchase','use','bonus','refund')),
  description TEXT,
  task_id UUID REFERENCES tasks(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CREDIT PACKAGES
CREATE TABLE credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  credits INT NOT NULL,
  price_idr INT NOT NULL,
  bonus_credits INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  package_id UUID REFERENCES credit_packages(id),
  amount_idr INT NOT NULL,
  credits_granted INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','failed')),
  payment_ref TEXT UNIQUE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Atomic credit deduction (service role only)
CREATE OR REPLACE FUNCTION deduct_credit_atomic(
  p_user_id UUID,
  p_task_id UUID,
  p_amount INT,
  p_description TEXT
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  current_credits INT;
BEGIN
  SELECT credits INTO current_credits
  FROM profiles WHERE id = p_user_id FOR UPDATE;

  IF current_credits < p_amount THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS';
  END IF;

  UPDATE profiles
  SET credits = credits - p_amount, updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, type, description, task_id)
  VALUES (p_user_id, -p_amount, 'use', p_description, p_task_id);
END;
$$;

REVOKE ALL ON FUNCTION deduct_credit_atomic FROM PUBLIC, anon, authenticated;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 3, 'bonus', 'Kredit selamat datang');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO credit_packages (name, credits, price_idr, bonus_credits) VALUES
  ('Starter',   10,  15000,  0),
  ('Basic',     30,  40000,  5),
  ('Pro',       100, 120000, 20),
  ('Ultimate',  300, 300000, 70);
