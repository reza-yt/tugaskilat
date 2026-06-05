"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  PenLine,
  FlaskConical,
  Calculator,
  Presentation,
  BookOpen,
  HelpCircle,
  FileSearch,
  Lightbulb,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Coins,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TASK_TYPES = [
  {
    id: "makalah",
    label: "Makalah",
    icon: FileText,
    desc: "Makalah akademik lengkap dengan daftar pustaka",
  },
  {
    id: "essay",
    label: "Essay",
    icon: PenLine,
    desc: "Essay argumentatif yang kohesif dan terstruktur",
  },
  {
    id: "laporan",
    label: "Laporan Praktikum",
    icon: FlaskConical,
    desc: "Laporan lab dengan format standar",
  },
  {
    id: "matematika",
    label: "Matematika & Kalkulus",
    icon: Calculator,
    desc: "Penyelesaian soal dengan langkah detail",
  },
  {
    id: "presentasi",
    label: "Bahan Presentasi",
    icon: Presentation,
    desc: "Outline slide + speaker notes",
  },
  {
    id: "book-report",
    label: "Book Report",
    icon: BookOpen,
    desc: "Resensi buku/review paper akademik",
  },
  {
    id: "soal-jawaban",
    label: "Soal & Jawaban",
    icon: HelpCircle,
    desc: "Bank soal lengkap dengan pembahasan",
  },
  {
    id: "rangkuman",
    label: "Rangkuman",
    icon: FileSearch,
    desc: "Ringkasan materi padat dan terstruktur",
  },
  {
    id: "proposal",
    label: "Proposal",
    icon: Lightbulb,
    desc: "Proposal penelitian/kegiatan akademik",
  },
  {
    id: "karya-ilmiah",
    label: "Karya Ilmiah",
    icon: GraduationCap,
    desc: "Paper ilmiah dengan format jurnal",
  },
] as const;

export default function NewTaskPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [taskType, setTaskType] = useState("");
  const [title, setTitle] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [major, setMajor] = useState("");
  const [wordCount, setWordCount] = useState("standar");
  const [instructions, setInstructions] = useState("");

  const selectedType = TASK_TYPES.find((t) => t.id === taskType);

  function canProceed(): boolean {
    if (step === 1) return !!taskType;
    if (step === 2) return !!title && !!educationLevel;
    return true;
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType,
          title,
          educationLevel,
          subject: subject || undefined,
          major: major || undefined,
          wordCount,
          instructions: instructions || undefined,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Gagal generate tugas");
        setLoading(false);
        return;
      }

      const { taskId } = await res.json();
      router.push(`/tasks/${taskId}`);
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                s <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {s}
            </div>
            <span className="text-sm hidden sm:inline text-muted-foreground">
              {s === 1
                ? "Jenis Tugas"
                : s === 2
                ? "Detail"
                : "Konfirmasi"}
            </span>
            {s < 3 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Choose task type */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Pilih Jenis Tugas</h1>
            <p className="text-muted-foreground">
              Apa jenis tugas yang mau kamu buat?
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TASK_TYPES.map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  taskType === type.id && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => setTaskType(type.id)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <type.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Task details */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Detail Tugas</h1>
            <p className="text-muted-foreground">
              Isi informasi tentang tugas{" "}
              <span className="font-medium text-foreground">
                {selectedType?.label}
              </span>{" "}
              kamu
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul / Topik Tugas *</Label>
              <Input
                id="title"
                placeholder="Contoh: Dampak Pemanasan Global terhadap Ekosistem Laut"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenjang Pendidikan *</Label>
                <Select
                  value={educationLevel}
                  onValueChange={(val) => setEducationLevel(val ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenjang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sma">SMA / SMK</SelectItem>
                    <SelectItem value="kuliah">Kuliah / Perguruan Tinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Mata Pelajaran / Kuliah</Label>
                <Input
                  id="subject"
                  placeholder="Contoh: Biologi, Ekonomi"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>

            {educationLevel === "kuliah" && (
              <div className="space-y-2">
                <Label htmlFor="major">Jurusan</Label>
                <Input
                  id="major"
                  placeholder="Contoh: Teknik Informatika, Kedokteran"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Panjang Output</Label>
              <Select value={wordCount} onValueChange={(val) => setWordCount(val ?? "standar")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="singkat">Singkat (~500 kata)</SelectItem>
                  <SelectItem value="standar">Standar (~1000 kata)</SelectItem>
                  <SelectItem value="panjang">Panjang (~2000 kata)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">
                Instruksi Tambahan (opsional)
              </Label>
              <Textarea
                id="instructions"
                placeholder="Catatan khusus, format tertentu, atau permintaan spesifik..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Konfirmasi & Generate</h1>
            <p className="text-muted-foreground">
              Pastikan semua detail sudah benar
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {selectedType && (
                  <selectedType.icon className="h-5 w-5 text-primary" />
                )}
                {selectedType?.label}
              </CardTitle>
              <CardDescription>{title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Jenjang:</span>
                  <p className="font-medium">
                    {educationLevel === "sma" ? "SMA/SMK" : "Kuliah"}
                  </p>
                </div>
                {subject && (
                  <div>
                    <span className="text-muted-foreground">Mata Pelajaran:</span>
                    <p className="font-medium">{subject}</p>
                  </div>
                )}
                {major && (
                  <div>
                    <span className="text-muted-foreground">Jurusan:</span>
                    <p className="font-medium">{major}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Panjang:</span>
                  <p className="font-medium capitalize">{wordCount}</p>
                </div>
              </div>
              {instructions && (
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    Instruksi tambahan:
                  </span>
                  <p className="mt-1">{instructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                <span className="font-medium">Biaya:</span>
              </div>
              <Badge variant="secondary" className="text-base px-3 py-1">
                1 Kredit
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="gap-2"
          >
            Lanjut
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            Generate Sekarang
          </Button>
        )}
      </div>
    </div>
  );
}
