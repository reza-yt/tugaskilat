"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Coins, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

interface Stats {
  totalUsers: number;
  totalTasks: number;
  totalCreditsUsed: number;
  totalRevenue: number;
  totalLlmCost: number;
  totalTokens: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalTasks: 0,
    totalCreditsUsed: 0,
    totalRevenue: 0,
    totalLlmCost: 0,
    totalTokens: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      const [usersRes, tasksRes, paymentsRes, llmRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("tasks").select("id, credits_used", { count: "exact" }),
        supabase.from("payments").select("amount_idr").eq("status", "paid"),
        supabase.from("llm_usage").select("cost_usd, total_tokens"),
      ]);

      const totalCreditsUsed = tasksRes.data?.reduce(
        (acc, t) => acc + (t.credits_used || 0), 0
      ) || 0;

      const totalRevenue = paymentsRes.data?.reduce(
        (acc, p) => acc + (p.amount_idr || 0), 0
      ) || 0;

      const totalLlmCost = llmRes.data?.reduce(
        (acc, l) => acc + (Number(l.cost_usd) || 0), 0
      ) || 0;

      const totalTokens = llmRes.data?.reduce(
        (acc, l) => acc + (l.total_tokens || 0), 0
      ) || 0;

      setStats({
        totalUsers: usersRes.count || 0,
        totalTasks: tasksRes.count || 0,
        totalCreditsUsed,
        totalRevenue,
        totalLlmCost,
        totalTokens,
      });
      setLoading(false);
    }

    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Tasks",
      value: stats.totalTasks,
      icon: FileText,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Kredit Digunakan",
      value: stats.totalCreditsUsed,
      icon: Coins,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Revenue (IDR)",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "LLM Cost (USD)",
      value: `$${stats.totalLlmCost.toFixed(4)}`,
      icon: TrendingUp,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      label: "Total Tokens",
      value: stats.totalTokens.toLocaleString(),
      icon: FileText,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview statistik TugasKilat</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold tracking-tight mt-0.5">
                      {loading ? (
                        <span className="inline-block h-7 w-16 skeleton-shimmer rounded" />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Selamat Datang di Admin Panel</CardTitle>
          <CardDescription>
            Kelola konten landing page, paket kredit, dan monitor pengguna dari sini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-muted/50 space-y-1">
              <p className="font-semibold">Landing Page</p>
              <p className="text-muted-foreground text-xs">Edit hero, fitur, testimonial, FAQ</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 space-y-1">
              <p className="font-semibold">Paket Kredit</p>
              <p className="text-muted-foreground text-xs">CRUD harga dan paket kredit</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 space-y-1">
              <p className="font-semibold">Users & Tasks</p>
              <p className="text-muted-foreground text-xs">Monitor pengguna dan tugas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
