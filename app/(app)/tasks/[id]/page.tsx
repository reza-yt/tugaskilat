"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Download,
  RefreshCw,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (task?.status === "generating" || task?.status === "pending") {
      const interval = setInterval(fetchTask, 3000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.status]);

  async function fetchTask() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", params.id as string)
      .single();

    if (error || !data) {
      toast.error("Tugas tidak ditemukan");
      router.push("/dashboard");
      return;
    }

    setTask(data as Task);
    setLoading(false);
  }

  async function handleCopy() {
    if (!task?.content) return;
    await navigator.clipboard.writeText(task.content);
    setCopied(true);
    toast.success("Berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadTxt() {
    if (!task?.content) return;
    const blob = new Blob([task.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${task.title.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleRegenerate() {
    if (!task) return;
    router.push(`/new?regen=true&type=${task.task_type}&title=${encodeURIComponent(task.title)}`);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-12 w-72 skeleton-shimmer rounded-lg" />
        <div className="h-6 w-48 skeleton-shimmer rounded-lg" />
        <div className="h-[500px] skeleton-shimmer rounded-xl" />
      </div>
    );
  }

  if (!task) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
          className="h-9 w-9 shrink-0 mt-0.5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{task.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="secondary" className="font-medium">{task.task_type}</Badge>
            <Badge variant="outline" className="font-medium">
              {task.education_level === "sma" ? "SMA" : "Kuliah"}
            </Badge>
            {task.subject && <Badge variant="outline" className="font-medium">{task.subject}</Badge>}
            <StatusBadge status={task.status} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Content */}
      {(task.status === "generating" || task.status === "pending") && (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">Sedang mengerjakan tugasmu...</p>
              <p className="text-sm text-muted-foreground mt-1.5">
                AI sedang menulis. Biasanya selesai dalam 30-60 detik.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {task.status === "completed" && (
        <>
          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2 font-medium">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Disalin!" : "Salin"}
            </Button>
            <Button onClick={handleDownloadTxt} variant="outline" size="sm" className="gap-2 font-medium">
              <Download className="h-4 w-4" />
              Download .txt
            </Button>
            <Button onClick={handleRegenerate} variant="outline" size="sm" className="gap-2 font-medium">
              <RefreshCw className="h-4 w-4" />
              Generate Ulang
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {task.word_count?.toLocaleString()} kata
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {new Date(task.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Content */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Hasil Tugas</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed">
              <ReactMarkdown>{task.content || ""}</ReactMarkdown>
            </CardContent>
          </Card>
        </>
      )}

      {task.status === "failed" && (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">Gagal generate tugas</p>
              <p className="text-sm text-muted-foreground mt-1.5">
                Terjadi kesalahan saat memproses. Kredit kamu akan dikembalikan.
              </p>
            </div>
            <Button onClick={handleRegenerate} className="gap-2 font-semibold">
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const config = {
    pending: { label: "Menunggu", icon: Clock, variant: "secondary" as const },
    generating: { label: "Proses", icon: Loader2, variant: "secondary" as const },
    completed: { label: "Selesai", icon: CheckCircle, variant: "default" as const },
    failed: { label: "Gagal", icon: XCircle, variant: "destructive" as const },
  };

  const { label, icon: Icon, variant } = config[status];

  return (
    <Badge variant={variant} className="gap-1 font-medium">
      <Icon className={`h-3 w-3 ${status === "generating" ? "animate-spin" : ""}`} />
      {label}
    </Badge>
  );
}
