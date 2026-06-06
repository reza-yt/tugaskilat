"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Cpu,
  DollarSign,
  Zap as ZapIcon,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

interface LlmRecord {
  id: string;
  task_id: string | null;
  user_id: string | null;
  model: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost_usd: number;
  duration_ms: number;
  created_at: string;
  // joined
  profiles?: { email: string; full_name: string | null } | null;
  tasks?: { title: string; task_type: string } | null;
}

interface AggregatedStats {
  totalRequests: number;
  totalTokens: number;
  totalCostUsd: number;
  avgDurationMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
}

interface UserUsage {
  user_id: string;
  email: string;
  full_name: string | null;
  total_tokens: number;
  total_cost: number;
  request_count: number;
}

export default function AdminLlmPage() {
  const supabase = createClient();
  const [records, setRecords] = useState<LlmRecord[]>([]);
  const [stats, setStats] = useState<AggregatedStats>({
    totalRequests: 0,
    totalTokens: 0,
    totalCostUsd: 0,
    avgDurationMs: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
  });
  const [userUsage, setUserUsage] = useState<UserUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "logs" | "users">("overview");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const pageSize = 20;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === "logs") fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, tab]);

  async function fetchData() {
    // Fetch all LLM usage for stats
    const { data: allUsage } = await supabase
      .from("llm_usage")
      .select("input_tokens, output_tokens, total_tokens, cost_usd, duration_ms, user_id");

    if (allUsage && allUsage.length > 0) {
      const totalRequests = allUsage.length;
      const totalTokens = allUsage.reduce((a, r) => a + (r.total_tokens || 0), 0);
      const totalCostUsd = allUsage.reduce((a, r) => a + (Number(r.cost_usd) || 0), 0);
      const avgDurationMs = Math.round(
        allUsage.reduce((a, r) => a + (r.duration_ms || 0), 0) / totalRequests
      );
      const totalInputTokens = allUsage.reduce((a, r) => a + (r.input_tokens || 0), 0);
      const totalOutputTokens = allUsage.reduce((a, r) => a + (r.output_tokens || 0), 0);

      setStats({ totalRequests, totalTokens, totalCostUsd, avgDurationMs, totalInputTokens, totalOutputTokens });

      // Aggregate per user
      const userMap = new Map<string, { tokens: number; cost: number; count: number }>();
      for (const r of allUsage) {
        if (!r.user_id) continue;
        const existing = userMap.get(r.user_id) || { tokens: 0, cost: 0, count: 0 };
        existing.tokens += r.total_tokens || 0;
        existing.cost += Number(r.cost_usd) || 0;
        existing.count += 1;
        userMap.set(r.user_id, existing);
      }

      // Fetch user info for top users
      const userIds = Array.from(userMap.keys());
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", userIds);

        const userUsageList: UserUsage[] = userIds
          .map((uid) => {
            const profile = profiles?.find((p) => p.id === uid);
            const usage = userMap.get(uid)!;
            return {
              user_id: uid,
              email: profile?.email || "unknown",
              full_name: profile?.full_name || null,
              total_tokens: usage.tokens,
              total_cost: usage.cost,
              request_count: usage.count,
            };
          })
          .sort((a, b) => b.total_tokens - a.total_tokens);

        setUserUsage(userUsageList);
      }
    }

    setLoading(false);
  }

  async function fetchLogs() {
    const { data, count } = await supabase
      .from("llm_usage")
      .select("*, profiles(email, full_name), tasks(title, task_type)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (data) setRecords(data as LlmRecord[]);
    if (count !== null) setTotal(count);
  }

  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-48 skeleton-shimmer rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 skeleton-shimmer rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">LLM Usage & Cost</h1>
        <p className="text-muted-foreground mt-1">Monitor penggunaan AI dan biaya token</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Requests", value: stats.totalRequests.toLocaleString(), icon: ZapIcon, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Tokens", value: stats.totalTokens.toLocaleString(), icon: Cpu, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
          { label: "Total Cost", value: `$${stats.totalCostUsd.toFixed(4)}`, icon: DollarSign, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10" },
          { label: "Input Tokens", value: stats.totalInputTokens.toLocaleString(), icon: TrendingUp, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
          { label: "Output Tokens", value: stats.totalOutputTokens.toLocaleString(), icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Avg Duration", value: `${(stats.avgDurationMs / 1000).toFixed(1)}s`, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-lg font-bold tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-lg w-fit">
        {(["overview", "users", "logs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(0); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === t ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "overview" ? "Overview" : t === "users" ? "Per User" : "Request Logs"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Cost Breakdown</CardTitle>
            <CardDescription>Model: Gemini 2.5 Flash</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground font-medium">Input Cost</p>
                  <p className="text-lg font-bold mt-1">
                    ${(stats.totalInputTokens * 0.00000015).toFixed(6)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    @ $0.15 / 1M tokens
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground font-medium">Output Cost</p>
                  <p className="text-lg font-bold mt-1">
                    ${(stats.totalOutputTokens * 0.0000006).toFixed(6)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    @ $0.60 / 1M tokens
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Total Estimated Cost</p>
                  <p className="text-2xl font-bold text-primary">${stats.totalCostUsd.toFixed(4)}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg ${stats.totalRequests > 0 ? (stats.totalCostUsd / stats.totalRequests).toFixed(6) : "0"} per request
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per User Tab */}
      {tab === "users" && (
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">Usage Per User</CardTitle>
            <CardDescription>Sorted by total tokens (descending)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {userUsage.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Belum ada data usage
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left font-semibold p-4">User</th>
                      <th className="text-center font-semibold p-4">Requests</th>
                      <th className="text-center font-semibold p-4">Total Tokens</th>
                      <th className="text-right font-semibold p-4">Cost (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userUsage.map((u, i) => (
                      <motion.tr
                        key={u.user_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{u.full_name || u.email}</p>
                              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="secondary" className="font-bold">{u.request_count}</Badge>
                        </td>
                        <td className="p-4 text-center font-medium">
                          {u.total_tokens.toLocaleString()}
                        </td>
                        <td className="p-4 text-right font-bold text-rose-600 dark:text-rose-400">
                          ${u.total_cost.toFixed(4)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Logs Tab */}
      {tab === "logs" && (
        <>
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {records.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Belum ada log request
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left font-semibold p-4">Task</th>
                        <th className="text-center font-semibold p-4">Model</th>
                        <th className="text-center font-semibold p-4">Tokens</th>
                        <th className="text-center font-semibold p-4">Duration</th>
                        <th className="text-right font-semibold p-4">Cost</th>
                        <th className="text-right font-semibold p-4">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r, i) => (
                        <motion.tr
                          key={r.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-4">
                            <div className="min-w-0">
                              <p className="font-medium truncate max-w-[200px]">
                                {r.tasks?.title || "—"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {r.profiles?.email || r.user_id?.slice(0, 8)}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className="text-xs font-mono">
                              {r.model}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <div className="text-xs">
                              <span className="text-blue-600 dark:text-blue-400">{r.input_tokens.toLocaleString()}</span>
                              {" / "}
                              <span className="text-emerald-600 dark:text-emerald-400">{r.output_tokens.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{r.total_tokens.toLocaleString()} total</p>
                          </td>
                          <td className="p-4 text-center text-muted-foreground">
                            {(r.duration_ms / 1000).toFixed(1)}s
                          </td>
                          <td className="p-4 text-right font-medium text-rose-600 dark:text-rose-400">
                            ${Number(r.cost_usd).toFixed(5)}
                          </td>
                          <td className="p-4 text-right text-xs text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Halaman {page + 1} dari {totalPages} ({total} records)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
