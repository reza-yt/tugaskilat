export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  total_credits_purchased: number;
  tier: "free" | "basic" | "pro";
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  task_type: string;
  subject: string | null;
  education_level: "sma" | "kuliah";
  major: string | null;
  instructions: string | null;
  content: string | null;
  status: "pending" | "generating" | "completed" | "failed";
  credits_used: number;
  word_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_idr: number;
  bonus_credits: number;
  is_active: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  package_id: string | null;
  amount_idr: number;
  credits_granted: number;
  status: "pending" | "paid" | "failed";
  payment_ref: string | null;
  paid_at: string | null;
  created_at: string;
}
