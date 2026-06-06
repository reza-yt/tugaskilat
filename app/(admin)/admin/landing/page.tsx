"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface HeroContent {
  badge_text: string;
  headline: string;
  headline_highlight: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
  microcopy: string;
  stats: { value: string; label: string }[];
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar_url: string;
  is_published: boolean;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

export default function AdminLandingPage() {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Hero state
  const [hero, setHero] = useState<HeroContent>({
    badge_text: "Gratis 3 kredit saat daftar",
    headline: "Semua Tugasmu",
    headline_highlight: "Selesai dalam Menit",
    subheadline: "Generator tugas otomatis untuk SMA & Kuliah. Makalah, essay, laporan, matematika, presentasi — semua jurusan, semua mata pelajaran.",
    cta_primary: "Mulai Gratis",
    cta_secondary: "Lihat Cara Kerja",
    microcopy: "Tanpa kartu kredit · Langsung pakai",
    stats: [
      { value: "10+", label: "Jenis Tugas" },
      { value: "2", label: "Jenjang" },
      { value: "<60s", label: "Generate" },
    ],
  });

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // FAQ state
  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    { id: "1", question: "Apa itu TugasKilat?", answer: "TugasKilat adalah platform AI yang membantu siswa SMA dan mahasiswa mengerjakan berbagai jenis tugas akademik secara otomatis.", order_index: 0 },
    { id: "2", question: "Apakah hasilnya unik?", answer: "Ya! Setiap hasil generate bersifat unik karena dibuat secara real-time oleh AI.", order_index: 1 },
    { id: "3", question: "Berapa kredit per tugas?", answer: "1 kredit per generate, tidak peduli jenis atau panjang tugasnya.", order_index: 2 },
    { id: "4", question: "Apakah ada langganan bulanan?", answer: "Tidak! Sistem bayar-sekali-pakai. Tidak ada biaya berlangganan.", order_index: 3 },
  ]);

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchContent() {
    try {
      // Fetch hero content
      const { data: heroData } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "hero")
        .single();

      if (heroData?.content) {
        setHero(heroData.content as HeroContent);
      }

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (testimonialsData) {
        setTestimonials(testimonialsData);
      }

      // Fetch FAQ
      const { data: faqData } = await supabase
        .from("site_content")
        .select("*")
        .eq("section", "faq")
        .single();

      if (faqData?.content) {
        setFaqItems(faqData.content as FaqItem[]);
      }
    } catch {
      // Use defaults if tables don't exist yet
    }
    setLoadingData(false);
  }

  async function saveHero() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({
          section: "hero",
          content: hero,
          updated_at: new Date().toISOString(),
        }, { onConflict: "section" });

      if (error) throw error;
      toast.success("Hero section berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan. Pastikan tabel site_content sudah ada.");
    }
    setSaving(false);
  }

  async function saveFaq() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({
          section: "faq",
          content: faqItems,
          updated_at: new Date().toISOString(),
        }, { onConflict: "section" });

      if (error) throw error;
      toast.success("FAQ berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan. Pastikan tabel site_content sudah ada.");
    }
    setSaving(false);
  }

  async function saveTestimonial(testimonial: Testimonial) {
    try {
      if (testimonial.id.startsWith("new-")) {
        const { data, error } = await supabase
          .from("testimonials")
          .insert({
            name: testimonial.name,
            role: testimonial.role,
            content: testimonial.content,
            avatar_url: testimonial.avatar_url,
            is_published: testimonial.is_published,
          })
          .select()
          .single();

        if (error) throw error;
        setTestimonials((prev) =>
          prev.map((t) => (t.id === testimonial.id ? data : t))
        );
      } else {
        const { error } = await supabase
          .from("testimonials")
          .update({
            name: testimonial.name,
            role: testimonial.role,
            content: testimonial.content,
            avatar_url: testimonial.avatar_url,
            is_published: testimonial.is_published,
          })
          .eq("id", testimonial.id);

        if (error) throw error;
      }
      toast.success("Testimonial disimpan!");
    } catch {
      toast.error("Gagal menyimpan testimonial.");
    }
  }

  async function deleteTestimonial(id: string) {
    if (id.startsWith("new-")) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus");
      return;
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    toast.success("Testimonial dihapus");
  }

  if (loadingData) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-48 skeleton-shimmer rounded-lg" />
        <div className="h-[400px] skeleton-shimmer rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Landing Page</h1>
        <p className="text-muted-foreground mt-1">Kelola konten halaman utama website</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonial</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Hero Section</CardTitle>
              <CardDescription>Konten utama yang dilihat pengunjung pertama kali</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Badge Text</Label>
                <Input
                  value={hero.badge_text}
                  onChange={(e) => setHero({ ...hero, badge_text: e.target.value })}
                  placeholder="Gratis 3 kredit saat daftar"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Headline</Label>
                  <Input
                    value={hero.headline}
                    onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                    placeholder="Semua Tugasmu"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Headline (highlight/gradient)</Label>
                  <Input
                    value={hero.headline_highlight}
                    onChange={(e) => setHero({ ...hero, headline_highlight: e.target.value })}
                    placeholder="Selesai dalam Menit"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Sub-headline</Label>
                <Textarea
                  value={hero.subheadline}
                  onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">CTA Primary</Label>
                  <Input
                    value={hero.cta_primary}
                    onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">CTA Secondary</Label>
                  <Input
                    value={hero.cta_secondary}
                    onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Microcopy</Label>
                <Input
                  value={hero.microcopy}
                  onChange={(e) => setHero({ ...hero, microcopy: e.target.value })}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Stats (3 items)</Label>
                <div className="grid grid-cols-3 gap-3">
                  {hero.stats.map((stat, i) => (
                    <div key={i} className="space-y-2 p-3 rounded-lg bg-muted/50">
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...hero.stats];
                          newStats[i] = { ...newStats[i], value: e.target.value };
                          setHero({ ...hero, stats: newStats });
                        }}
                        placeholder="10+"
                        className="text-center font-bold"
                      />
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...hero.stats];
                          newStats[i] = { ...newStats[i], label: e.target.value };
                          setHero({ ...hero, stats: newStats });
                        }}
                        placeholder="Label"
                        className="text-center text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={saveHero} disabled={saving} className="gap-2 font-semibold">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan Hero
          </Button>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Testimonial</h3>
              <p className="text-sm text-muted-foreground">Kelola testimoni dari pengguna</p>
            </div>
            <Button
              size="sm"
              className="gap-2 font-medium"
              onClick={() => {
                setTestimonials([
                  ...testimonials,
                  {
                    id: `new-${Date.now()}`,
                    name: "",
                    role: "",
                    content: "",
                    avatar_url: "",
                    is_published: false,
                  },
                ]);
              }}
            >
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          </div>

          {testimonials.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="text-center py-12 text-muted-foreground">
                Belum ada testimonial. Klik &quot;Tambah&quot; untuk membuat.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <Badge variant={testimonial.is_published ? "default" : "secondary"}>
                            {testimonial.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const updated = { ...testimonial, is_published: !testimonial.is_published };
                              setTestimonials(prev => prev.map(t => t.id === testimonial.id ? updated : t));
                            }}
                          >
                            {testimonial.is_published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => saveTestimonial(testimonial)}
                          >
                            <Save className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => deleteTestimonial(testimonial.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Nama</Label>
                          <Input
                            value={testimonial.name}
                            onChange={(e) =>
                              setTestimonials(prev =>
                                prev.map(t => t.id === testimonial.id ? { ...t, name: e.target.value } : t)
                              )
                            }
                            placeholder="Ahmad Fauzi"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">Role</Label>
                          <Input
                            value={testimonial.role}
                            onChange={(e) =>
                              setTestimonials(prev =>
                                prev.map(t => t.id === testimonial.id ? { ...t, role: e.target.value } : t)
                              )
                            }
                            placeholder="Mahasiswa Teknik, UI"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Konten</Label>
                        <Textarea
                          value={testimonial.content}
                          onChange={(e) =>
                            setTestimonials(prev =>
                              prev.map(t => t.id === testimonial.id ? { ...t, content: e.target.value } : t)
                            )
                          }
                          placeholder="Testimonial dari pengguna..."
                          rows={2}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">FAQ</h3>
              <p className="text-sm text-muted-foreground">Pertanyaan yang sering diajukan</p>
            </div>
            <Button
              size="sm"
              className="gap-2 font-medium"
              onClick={() => {
                setFaqItems([
                  ...faqItems,
                  { id: `new-${Date.now()}`, question: "", answer: "", order_index: faqItems.length },
                ]);
              }}
            >
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3">
                        <Input
                          value={item.question}
                          onChange={(e) =>
                            setFaqItems(prev =>
                              prev.map(f => f.id === item.id ? { ...f, question: e.target.value } : f)
                            )
                          }
                          placeholder="Pertanyaan..."
                          className="font-medium"
                        />
                        <Textarea
                          value={item.answer}
                          onChange={(e) =>
                            setFaqItems(prev =>
                              prev.map(f => f.id === item.id ? { ...f, answer: e.target.value } : f)
                            )
                          }
                          placeholder="Jawaban..."
                          rows={2}
                          className="resize-none"
                        />
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive shrink-0 h-8 w-8"
                        onClick={() => setFaqItems(prev => prev.filter(f => f.id !== item.id))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Button onClick={saveFaq} disabled={saving} className="gap-2 font-semibold">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan FAQ
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
