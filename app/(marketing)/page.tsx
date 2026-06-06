"use client";

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
  Menu,
  X,
} from "lucide-react";
import { FadeIn, FadeInWhenVisible, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { motion } from "framer-motion";
import { useState } from "react";

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
    step: "01",
    title: "Pilih Jenis Tugas",
    desc: "Pilih dari 10+ jenis tugas akademik yang tersedia",
    color: "from-primary/20 to-primary/5",
  },
  {
    step: "02",
    title: "Isi Detail",
    desc: "Masukkan topik, mata pelajaran, dan instruksi khusus",
    color: "from-chart-2/20 to-chart-2/5",
  },
  {
    step: "03",
    title: "Download Hasil",
    desc: "Tugas selesai dalam hitungan detik, langsung download",
    color: "from-chart-3/20 to-chart-3/5",
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
    a: "TugasKilat adalah platform AI yang membantu siswa SMA dan mahasiswa mengerjakan berbagai jenis tugas akademik secara otomatis.",
  },
  {
    q: "Apakah hasilnya unik dan tidak plagiat?",
    a: "Ya! Setiap hasil generate bersifat unik karena dibuat secara real-time oleh AI. Kami tetap menyarankan untuk me-review dan menyesuaikan hasil.",
  },
  {
    q: "Berapa kredit per tugas?",
    a: "1 kredit per generate, tidak peduli jenis atau panjang tugasnya.",
  },
  {
    q: "Apakah ada langganan bulanan?",
    a: "Tidak! Sistem bayar-sekali-pakai. Tidak ada biaya berlangganan atau biaya tersembunyi.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-bold text-xl tracking-tight">TugasKilat</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#fitur" className="text-muted-foreground hover:text-foreground transition-colors">
              Fitur
            </a>
            <a href="#cara-kerja" className="text-muted-foreground hover:text-foreground transition-colors">
              Cara Kerja
            </a>
            <a href="#harga" className="text-muted-foreground hover:text-foreground transition-colors">
              Harga
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-semibold gap-1.5 shadow-md shadow-primary/20">
                Daftar Gratis
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t bg-background p-4 space-y-3"
          >
            <a href="#fitur" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Fitur</a>
            <a href="#cara-kerja" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Cara Kerja</a>
            <a href="#harga" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Harga</a>
            <a href="#faq" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full" size="sm">Masuk</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full" size="sm">Daftar</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-chart-2/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl text-center">
          <FadeIn delay={0}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium border border-primary/20 bg-primary/5">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Gratis 3 kredit saat daftar
            </Badge>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Semua Tugasmu{" "}
              <span className="bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent">
                Selesai dalam Menit
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Generator tugas otomatis untuk SMA & Kuliah. Makalah, essay, laporan,
              matematika, presentasi — semua jurusan, semua mata pelajaran.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2 text-base font-semibold h-12 px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Mulai Gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#cara-kerja">
                <Button variant="outline" size="lg" className="text-base h-12 px-8 font-medium">
                  Lihat Cara Kerja
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Tanpa kartu kredit · Langsung pakai
            </p>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.4}>
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
              {[
                { value: "10+", label: "Jenis Tugas" },
                { value: "2", label: "Jenjang" },
                { value: "<60s", label: "Generate" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-primary">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Task Types */}
      <section id="fitur" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <FadeInWhenVisible>
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4">Fitur Lengkap</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Semua Jenis Tugas Akademik
              </h2>
              <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
                Apapun tugasmu, TugasKilat bisa bantu selesaikan dengan cepat dan berkualitas
              </p>
            </div>
          </FadeInWhenVisible>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4" staggerDelay={0.05}>
            {TASK_TYPES.map((type) => (
              <StaggerItem key={type.label}>
                <Card className="text-center group hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 cursor-default h-full">
                  <CardContent className="p-4 sm:p-5">
                    <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors mb-3">
                      <type.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-semibold text-sm">{type.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{type.desc}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How it works */}
      <section id="cara-kerja" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <FadeInWhenVisible>
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4">Simpel</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                3 Langkah Mudah
              </h2>
              <p className="text-muted-foreground mt-3 text-lg">
                Dari input sampai download, semudah itu
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <FadeInWhenVisible key={s.step} delay={i * 0.15}>
                <div className="relative text-center group">
                  <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${s.color} mb-5`}>
                    <span className="text-xl font-bold text-primary">{s.step}</span>
                  </div>
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Super Cepat", desc: "Hasil dalam hitungan detik", color: "text-chart-3" },
              { icon: Sparkles, title: "AI Terkini", desc: "Powered by Google Gemini", color: "text-primary" },
              { icon: Shield, title: "Aman & Privat", desc: "Data kamu terenkripsi", color: "text-chart-2" },
            ].map((feat, i) => (
              <FadeInWhenVisible key={feat.title} delay={i * 0.1}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-muted mb-4">
                      <feat.icon className={`h-6 w-6 ${feat.color}`} />
                    </div>
                    <h3 className="font-bold">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{feat.desc}</p>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <FadeInWhenVisible>
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4">Harga</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Bayar Sekali, Pakai Kapanpun
              </h2>
              <p className="text-muted-foreground mt-3 text-lg">
                Tidak ada langganan. Kredit tidak pernah expired.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CREDIT_PACKAGES.map((pkg, i) => (
              <FadeInWhenVisible key={pkg.name} delay={i * 0.1}>
                <Card
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    pkg.popular
                      ? "border-primary shadow-md shadow-primary/10 scale-[1.02]"
                      : "hover:border-primary/30"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-chart-5" />
                  )}
                  {pkg.popular && (
                    <Badge className="absolute top-3 right-3 text-[10px]">
                      Populer
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2 pt-6">
                    <CardTitle className="text-lg font-bold">{pkg.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {pkg.credits} kredit
                      {pkg.bonus > 0 && <span className="text-primary font-medium"> +{pkg.bonus} bonus</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-6">
                    <div className="my-4">
                      <p className="text-3xl font-extrabold">
                        Rp {pkg.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Rp {Math.round(pkg.price / (pkg.credits + pkg.bonus)).toLocaleString("id-ID")}/kredit
                      </p>
                    </div>
                    <Link href="/register">
                      <Button
                        className="w-full font-semibold"
                        variant={pkg.popular ? "default" : "outline"}
                        size="sm"
                      >
                        Pilih Paket
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <FadeInWhenVisible>
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4">FAQ</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Pertanyaan Umum
              </h2>
            </div>
          </FadeInWhenVisible>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <FadeInWhenVisible key={i} delay={i * 0.08}>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="font-semibold flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      {item.q}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 ml-8 leading-relaxed">
                      {item.a}
                    </p>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <FadeInWhenVisible>
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Siap Menyelesaikan Tugasmu?
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Daftar sekarang dan dapatkan 3 kredit gratis. Tanpa kartu kredit, tanpa ribet.
            </p>
            <Link href="/register">
              <Button size="lg" className="mt-8 gap-2 font-semibold h-12 px-8 shadow-lg shadow-primary/25">
                <Zap className="h-4 w-4" />
                Mulai Gratis Sekarang
              </Button>
            </Link>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary text-primary-foreground">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold">TugasKilat</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2025 TugasKilat. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privasi</a>
            <a href="#" className="hover:text-foreground transition-colors">Syarat</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
