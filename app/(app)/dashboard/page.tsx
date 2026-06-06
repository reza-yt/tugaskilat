"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  Coins,
  TrendingUp,
  Clock,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Task } from "@/lib/types";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, tasksRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (tasksRes.data) setTasks(tasksRes.data as Task[]);
      setLoading(false);
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(taskId: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      toast.error("Gagal menghapus tugas");
      return;
    }
    setTasks(tasks.filter((t) => t.id !== taskId));
    toast.success("Tugas berhasil dihapus");
  }

  const totalTasks = tasks.length;
  const creditsUsed = tasks.reduce((acc, t) => acc + t.credits_used, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-72 skeleton-shimmer rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 skeleton-shimmer rounded-xl" />
          ))}
        </div>
        <div className="h-80 skeleton-shimmer rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Halo, {profile?.full_name?.split(" ")[0] || "Kamu"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Siap kerjakan tugas hari ini?
          </p>
        </div>
        <Link href="/new">
          <Button className="gap-2 font-semibold shadow-md shadow-primary/20 h-11">
            <Plus className="h-4 w-4" />
            Buat Tugas Baru
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Tugas",
            value: totalTasks,
            icon: FileText,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Kredit Tersisa",
            value: profile?.credits ?? 0,
            icon: Coins,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Kredit Digunakan",
            value: creditsUsed,
            icon: TrendingUp,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Riwayat Tugas</CardTitle>
                <CardDescription className="text-sm mt-0.5">Tugas terakhir yang kamu buat</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 mb-4">
                  <Sparkles className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="font-semibold text-lg">Belum ada tugas</p>
                <p className="text-sm text-muted-foreground mt-1 mb-6">
                  Buat tugas pertamamu sekarang, gratis!
                </p>
                <Link href="/new">
                  <Button className="gap-2 font-semibold">
                    <Plus className="h-4 w-4" />
                    Buat Tugas Pertama
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.25 }}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 hover:bg-muted/50 hover:border-border transition-all duration-200 group"
                  >
                    <Link
                      href={`/tasks/${task.id}`}
                      className="flex-1 flex items-center gap-3 min-w-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0">
                            {task.task_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(task.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusDot status={task.status} />
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function StatusDot({ status }: { status: Task["status"] }) {
  const config = {
    pending: { color: "bg-amber-500", pulse: false },
    generating: { color: "bg-blue-500", pulse: true },
    completed: { color: "bg-emerald-500", pulse: false },
    failed: { color: "bg-red-500", pulse: false },
  };

  const { color, pulse } = config[status];

  return (
    <span className="relative flex h-2.5 w-2.5">
      {pulse && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  );
}
