"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Search, FileText, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/lib/types";
import { motion } from "framer-motion";

export default function AdminTasksPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter]);

  async function fetchTasks() {
    setLoading(true);
    let query = supabase
      .from("tasks")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, count } = await query;
    if (data) setTasks(data as Task[]);
    if (count !== null) setTotal(count);
    setLoading(false);
  }

  const totalPages = Math.ceil(total / pageSize);

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500",
    generating: "bg-blue-500",
    completed: "bg-emerald-500",
    failed: "bg-red-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            <FileText className="inline h-4 w-4 mr-1" />
            {total} tugas total
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari judul..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 h-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val ?? "all"); setPage(0); }}>
            <SelectTrigger className="w-[130px] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="generating">Generating</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 skeleton-shimmer rounded-xl" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-12 text-muted-foreground">
            {search || statusFilter !== "all" ? "Tidak ada task yang cocok." : "Belum ada task."}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left font-semibold p-4">Tugas</th>
                    <th className="text-left font-semibold p-4 hidden sm:table-cell">Tipe</th>
                    <th className="text-center font-semibold p-4">Status</th>
                    <th className="text-center font-semibold p-4 hidden md:table-cell">Kata</th>
                    <th className="text-right font-semibold p-4 hidden md:table-cell">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, i) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[250px]">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {task.education_level === "sma" ? "SMA" : "Kuliah"}
                            {task.subject && ` · ${task.subject}`}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <Badge variant="secondary" className="text-xs font-medium">
                          {task.task_type}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${statusColors[task.status]}`} />
                          <span className="text-xs font-medium capitalize">{task.status}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center hidden md:table-cell text-muted-foreground">
                        {task.word_count ? task.word_count.toLocaleString() : "—"}
                      </td>
                      <td className="p-4 text-right hidden md:table-cell">
                        <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(task.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page + 1} dari {totalPages}
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
    </div>
  );
}
