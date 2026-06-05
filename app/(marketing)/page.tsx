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
  Zap,
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
  ArrowRight,
  CheckCircle,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";

const TASK_TYPES = [
  { label: "Makalah", icon: FileText, desc: "Lengkap dengan daftar pustaka" },
  { label: "Essay", icon: PenLine, desc: "Argumentatif & kohesif" },
  { label: "Laporan Praktikum", icon: FlaskConical, desc: "Format standar lab" },
  { label: "Matematika", icon: Calculator, desc: "Langkah penyelesaian detail" },
  { label: "Presentasi", icon: Presentation, desc: "Outline + speaker notes" },
  { label: "Book Report", icon: BookOpen, desc: "Resensi buku & paper" },
  { label: "Soal & Jawaban", icon: HelpCircle, desc: "Bank soal + pembahasan" },
  { label: "Rangkuman", icon: FileSearch, desc: "Ringkasan materi padat" },
  { label: "Proposal", icon: Lightbulb, desc: "Proposal akademik" },
  { label: "Karya Ilmiah", icon: GraduationCap, desc: "Format jurnal" },
];

const STEPS = [
  {
    step: "1",
    title: "Pilih Jenis Tugas",
    desc: "Pilih dari 10+ jenis tugas yang tersedia",
  },
  {
    step: "2",
    title: "Isi Detail",
    desc: "Masukkan topik, mata pelajaran, dan instruksi tambahan",
  },
  {
    step: "3",
    title: "Hasil Siap Download",
    desc: "Tugas selesai dalam hitungan detik, langsung download",
  },
];

const CREDIT_PACKAGES = [
  { name: "Starter", credits: 10, price: 15000, bonus: 0 },
  { name: "Basic", credits: 30, price: 40000, bonus: 5, popular: true },
  { name: "Pro", credits: 100, price: 120000, bonus: 20 },
  { name: "Ultimate", credits: 300, price: 300000, bonus: 70 },
];

const FAQ = [
  {
    q: "Apa itu TugasKilat?",
    a: "TugasKilat adalah platform AI yang membantu siswa SMA dan mahasiswa mengerjakan berbagai jenis tugas akademik secara otomatis. Mulai dari makalah, essay, laporan, hingga soal matematika.",
  },
  {
    q: "Apakah hasilnya unik dan tidak plagiat?",
    a: "Ya! Setiap hasil generate bersifat unik karena dibuat secara real-time oleh AI. Namun, kami tetap menyarankan untuk me-review dan menyesuaikan hasil sesuai kebutuhan kamu.",
  },
  {
    q: "Berapa kredit yang dibutuhkan per tugas?",
    a: "Setiap generate tugas membutuhkan 1 kredit, tidak peduli jenis atau panjang tugasnya.",
  },
  {
    q: "Bagaimana cara beli kredit?",
    a: "Setelah mendaftar, kamu bisa beli kredit melalui dashboard. Kami menyediakan berbagai paket mulai dari Rp 15.000.",
  },
  {
    q: "Apakah ada langganan bulanan?",
    a: "Tidak! TugasKilat menggunakan sistem kredit bayar-sekali-pakai. Tidak ada biaya berlangganan atau biaya tersembunyi.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-6xl">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">TugasKilat</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#fitur" className="text-muted-foreground hover:text-foreground transition-colors">Fitur</a>
            <a href="#harga" className="text-muted-foreground hover:text-foreground transition-colors">Harga</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            Gratis 3 kredit saat daftar
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Semua Tugasmu{" "}
            <span className="text-primary">Selesai dalam Menit</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Generator tugas otomatis untuk SMA & Kuliah. Makalah, essay, laporan,
            matematika, presentasi — semua jurusan.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base">
                Coba Gratis — 3 Kredit Langsung
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#cara-kerja">
              <Button variant="outline" size="lg" className="text-base">
                Lihat Cara Kerja
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Gratis 3 kredit · Tidak perlu kartu kredit
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">10+</p>
              <p className="text-xs text-muted-foreground">Jenis Tugas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">2</p>
              <p className="text-xs text-muted-foreground">Jenjang Pendidikan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">&lt;60s</p>
              <p className="text-xs text-muted-foreground">Waktu Generate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Task Types */}
      <section id="fitur" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Semua Jenis Tugas</h2>
            <p className="text-muted-foreground mt-2">
              Apapun tugasmu, TugasKilat bisa bantu
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TASK_TYPES.map((type) => (
              <Card key={type.label} className="text-center hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <type.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">{type.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cara-kerja" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Cara Kerja</h2>
            <p className="text-muted-foreground mt-2">
              3 langkah mudah, tugas selesai
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold">Super Cepat</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Hasil dalam hitungan detik, bukan jam
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold">AI Terkini</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Powered by Google Gemini, hasil berkualitas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold">Aman & Privat</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Data tugasmu aman, hanya kamu yang bisa akses
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Harga Kredit</h2>
            <p className="text-muted-foreground mt-2">
              Bayar sekali pakai, tidak ada langganan
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREDIT_PACKAGES.map((pkg) => (
              <Card
                key={pkg.name}
                className={pkg.popular ? "border-primary ring-2 ring-primary/20 relative" : ""}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    Best Value
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <CardDescription>
                    {pkg.credits} kredit
                    {pkg.bonus > 0 && ` + ${pkg.bonus} bonus`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-bold">
                    Rp {pkg.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rp{" "}
                    {Math.round(
                      pkg.price / (pkg.credits + pkg.bonus)
                    ).toLocaleString("id-ID")}
                    /kredit
                  </p>
                  <Link href="/register">
                    <Button
                      className="w-full mt-4"
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      Pilih Paket
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">FAQ</h2>
            <p className="text-muted-foreground mt-2">
              Pertanyaan yang sering ditanyakan
            </p>
          </div>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <h3 className="font-semibold flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    {item.q}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 ml-7">
                    {item.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Siap Menyelesaikan Tugasmu?</h2>
          <p className="text-muted-foreground mt-3">
            Daftar sekarang dan dapatkan 3 kredit gratis. Tanpa kartu kredit.
          </p>
          <Link href="/register">
            <Button size="lg" className="mt-6 gap-2">
              <Zap className="h-4 w-4" />
              Mulai Gratis Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold">TugasKilat</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TugasKilat. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Kebijakan Privasi</a>
            <a href="#" className="hover:text-foreground">Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
