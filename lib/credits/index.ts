import { createServiceRoleClient } from "@/lib/supabase/server";

export async function getUserCredits(userId: string): Promise<number> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (error) throw new Error("Failed to get user credits");
  return data.credits;
}

export async function addCredits(
  userId: string,
  amount: number,
  description: string
): Promise<void> {
  const supabase = createServiceRoleClient();

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      credits: amount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) throw new Error("Failed to add credits");

  const { error: txError } = await supabase
    .from("credit_transactions")
    .insert({
      user_id: userId,
      amount,
      type: "purchase",
      description,
    });

  if (txError) throw new Error("Failed to record credit transaction");
}

export async function deductCredits(
  userId: string,
  taskId: string,
  amount: number
): Promise<void> {
  const supabase = createServiceRoleClient();

  const { error } = await supabase.rpc("deduct_credit_atomic", {
    p_user_id: userId,
    p_task_id: taskId,
    p_amount: amount,
    p_description: `Kredit digunakan untuk generate tugas`,
  });

  if (error) {
    if (error.message.includes("INSUFFICIENT_CREDITS")) {
      throw new Error("INSUFFICIENT_CREDITS");
    }
    throw new Error("Failed to deduct credits");
  }
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "purchase" | "use" | "bonus" | "refund";
  description: string | null;
  task_id: string | null;
  created_at: string;
}

export async function getCreditHistory(
  userId: string
): Promise<CreditTransaction[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error("Failed to get credit history");
  return data as CreditTransaction[];
}
