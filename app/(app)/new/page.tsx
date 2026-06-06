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
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const TASK_TYPES = [
  { id: "makalah", label: "Makalah", icon: FileText, desc: "Makalah akademik lengkap" },
  { id: "essay", label: "Essay", icon: PenLine, desc: "Essay argumentatif terstruktur" },
  { id: "laporan", label: "Laporan Praktikum", icon: FlaskConical, desc: "Laporan lab standar" },
  { id: "matematika", label: "Matematika", icon: Calculator, desc: "Penyelesaian soal detail" },
  { id: "presentasi", label: "Presentasi", icon: Presentation, desc: "Outline + speaker notes" },
  { id: "book-report", label: "Book Report", icon: BookOpen, desc: "Resensi buku/paper" },
  { id: "soal-jawaban", label: "Soal & Jawaban", icon: HelpCircle, desc: "Bank soal + pembahasan" },
  { id: "rangkuman", label: "Rangkuman", icon: FileSearch, desc: "Ringkasan materi padat" },
  { id: "proposal", label: "Proposal", icon: Lightbulb, desc: "Proposal akademik" },
  { id: "karya-ilmiah", label: "Karya Ilmiah", icon: GraduationCap, desc: "Format jurnal ilmiah" },
] as const;

export default function NewTaskPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

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
      <div className="flex items-center gap-3 mb-10">
        {[
          { n: 1, label: "Jenis" },
          { n: 2, label: "Detail" },
          { n: 3, label: "Generate" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  s.n < step
                    ? "bg-primary text-primary-foreground"
                    : s.n === step
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {s.n < step ? <Check className="h-4 w-4" /> : s.n}
              </div>
              <span className={cn(
                "text-sm hidden sm:inline font-medium transition-colors",
                s.n <= step ? "text-foreground" : "text-muted-foreground"
              )}>
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div className={cn(
                "flex-1 h-0.5 rounded-full transition-colors duration-300",
                s.n < step ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Choose task type */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Pilih Jenis Tugas</h1>
              <p className="text-muted-foreground mt-2">
                Apa jenis tugas yang mau kamu buat?
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TASK_TYPES.map((type) => (
                <Card
                  key={type.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    taskType === type.id
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border/50 hover:border-primary/30"
                  )}
                  onClick={() => setTaskType(type.id)}
                >
                  <CardContent className="flex items-center gap-3.5 p-4">
                    <div className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-xl transition-colors",
                      taskType === type.id ? "bg-primary/15" : "bg-muted"
                    )}>
                      <type.icon className={cn(
                        "h-5 w-5 transition-colors",
                        taskType === type.id ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.desc}</p>
                    </div>
                    {taskType === type.id && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Task details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Detail Tugas</h1>
              <p className="text-muted-foreground mt-2">
                Isi informasi untuk{" "}
                <span className="font-semibold text-foreground">{selectedType?.label}</span>
              </p>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Judul / Topik Tugas *</Label>
                  <Input
                    id="title"
                    placeholder="Contoh: Dampak Pemanasan Global terhadap Ekosistem Laut"
                    className="h-11"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Jenjang Pendidikan *</Label>
                    <Select value={educationLevel} onValueChange={(val) => setEducationLevel(val ?? "")}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Pilih jenjang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sma">SMA / SMK</SelectItem>
                        <SelectItem value="kuliah">Kuliah / Perguruan Tinggi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">Mata Pelajaran / Kuliah</Label>
                    <Input
                      id="subject"
                      placeholder="Contoh: Biologi"
                      className="h-11"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>

                {educationLevel === "kuliah" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <Label htmlFor="major" className="text-sm font-medium">Jurusan</Label>
                    <Input
                      id="major"
                      placeholder="Contoh: Teknik Informatika"
                      className="h-11"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                    />
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Panjang Output</Label>
                  <Select value={wordCount} onValueChange={(val) => setWordCount(val ?? "standar")}>
                    <SelectTrigger className="h-11">
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
                  <Label htmlFor="instructions" className="text-sm font-medium">Instruksi Tambahan</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Catatan khusus, format tertentu, atau permintaan spesifik..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Konfirmasi</h1>
              <p className="text-muted-foreground mt-2">Pastikan semua detail sudah benar</p>
            </div>

            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                <div className="flex items-center gap-3">
                  {selectedType && (
                    <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
                      <selectedType.icon className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-base font-bold">{selectedType?.label}</CardTitle>
                    <CardDescription className="text-sm mt-0.5">{title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs font-medium">Jenjang</span>
                    <p className="font-semibold mt-0.5">
                      {educationLevel === "sma" ? "SMA/SMK" : "Kuliah"}
                    </p>
                  </div>
                  {subject && (
                    <div>
                      <span className="text-muted-foreground text-xs font-medium">Mata Pelajaran</span>
                      <p className="font-semibold mt-0.5">{subject}</p>
                    </div>
                  )}
                  {major && (
                    <div>
                      <span className="text-muted-foreground text-xs font-medium">Jurusan</span>
                      <p className="font-semibold mt-0.5">{major}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground text-xs font-medium">Panjang</span>
                    <p className="font-semibold mt-0.5 capitalize">{wordCount}</p>
                  </div>
                </div>
                {instructions && (
                  <div className="text-sm pt-2 border-t">
                    <span className="text-muted-foreground text-xs font-medium">Instruksi</span>
                    <p className="mt-1 text-sm">{instructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2.5">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-sm">Biaya Generate</span>
                </div>
                <Badge className="text-sm px-3 py-1 font-bold">
                  1 Kredit
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        {step > 1 ? (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            className="gap-2 font-medium"
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
            className="gap-2 font-semibold h-11 px-6 shadow-md shadow-primary/20"
          >
            Lanjut
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="gap-2 font-semibold h-11 px-6 shadow-md shadow-primary/20"
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
