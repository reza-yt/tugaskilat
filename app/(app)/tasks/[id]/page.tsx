"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/lib/types";
import ReactMarkdown from "react-markdown";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchTask();
    // Poll if generating
    const interval = setInterval(() => {
      if (task?.status === "generating" || task?.status === "pending") {
        fetchTask();
      }
    }, 3000);
    return () => clearInterval(interval);
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
    toast.success("Konten berhasil disalin!");
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
    router.push(
      `/new?regen=true&type=${task.task_type}&title=${encodeURIComponent(task.title)}`
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{task.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{task.task_type}</Badge>
            <Badge variant="outline">
              {task.education_level === "sma" ? "SMA" : "Kuliah"}
            </Badge>
            {task.subject && (
              <Badge variant="outline">{task.subject}</Badge>
            )}
          </div>
        </div>
        <StatusBadge status={task.status} />
      </div>

      <Separator />

      {/* Content */}
      {task.status === "generating" || task.status === "pending" ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <p className="font-medium">Sedang mengerjakan tugasmu...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Biasanya selesai dalam 30-60 detik
              </p>
            </div>
          </CardContent>
        </Card>
      ) : task.status === "completed" ? (
        <>
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCopy} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Salin
            </Button>
            <Button
              onClick={handleDownloadTxt}
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download .txt
            </Button>
            <Button
              onClick={handleRegenerate}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Generate Ulang
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {task.word_count?.toLocaleString()} kata
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(task.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Content display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hasil</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{task.content || ""}</ReactMarkdown>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <XCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <p className="font-medium">Gagal generate tugas</p>
              <p className="text-sm text-muted-foreground mt-1">
                Terjadi kesalahan saat memproses. Kredit kamu akan dikembalikan.
              </p>
            </div>
            <Button onClick={handleRegenerate} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const config = {
    pending: { label: "Menunggu", icon: Clock, variant: "secondary" as const },
    generating: {
      label: "Proses",
      icon: Loader2,
      variant: "secondary" as const,
    },
    completed: {
      label: "Selesai",
      icon: CheckCircle,
      variant: "default" as const,
    },
    failed: { label: "Gagal", icon: XCircle, variant: "destructive" as const },
  };

  const { label, icon: Icon, variant } = config[status];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon
        className={`h-3 w-3 ${status === "generating" ? "animate-spin" : ""}`}
      />
      {label}
    </Badge>
  );
}
