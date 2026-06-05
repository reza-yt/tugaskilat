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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Task } from "@/lib/types";
import { toast } from "sonner";

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
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Halo, {profile?.full_name || "Kamu"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Siap kerjakan tugas hari ini?
          </p>
        </div>
        <Link href="/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Buat Tugas Baru
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalTasks}</p>
              <p className="text-xs text-muted-foreground">Total Tugas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Coins className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{profile?.credits ?? 0}</p>
              <p className="text-xs text-muted-foreground">Kredit Tersisa</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{creditsUsed}</p>
              <p className="text-xs text-muted-foreground">Kredit Digunakan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Tugas</CardTitle>
          <CardDescription>10 tugas terakhir yang kamu buat</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="mt-4 font-medium">Belum ada tugas</p>
              <p className="text-sm text-muted-foreground mb-4">
                Buat tugas pertamamu sekarang!
              </p>
              <Link href="/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Buat Tugas
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Link
                    href={`/tasks/${task.id}`}
                    className="flex-1 flex items-center gap-3 min-w-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-xs">
                          {task.task_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(task.created_at).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                    <StatusDot status={task.status} />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 ml-2"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusDot({ status }: { status: Task["status"] }) {
  const colors = {
    pending: "bg-yellow-500",
    generating: "bg-blue-500 animate-pulse",
    completed: "bg-green-500",
    failed: "bg-red-500",
  };

  return <div className={`h-2.5 w-2.5 rounded-full ${colors[status]}`} />;
}
