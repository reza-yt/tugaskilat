import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Calendar, User, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — TugasKilat | Tips Akademik & Panduan Tugas",
  description:
    "Baca artikel tips menulis makalah, essay, laporan praktikum, dan panduan akademik lainnya. Gratis untuk semua siswa SMA dan mahasiswa.",
  openGraph: {
    title: "Blog — TugasKilat",
    description: "Tips akademik, panduan tugas, dan strategi belajar untuk siswa SMA & mahasiswa.",
  },
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  author: string;
  tags: string[];
  published_at: string;
}

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const supabase = createServiceRoleClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, category, author, tags, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const blogPosts = (posts || []) as BlogPost[];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-bold text-xl tracking-tight">TugasKilat</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-semibold">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Tips akademik, panduan tugas, dan strategi belajar
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>Belum ada artikel. Cek kembali nanti!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs font-medium capitalize">
                            {post.category}
                          </Badge>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-muted-foreground mt-2 text-sm leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.published_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-10 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary text-primary-foreground">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold">TugasKilat</span>
          </div>
          <p className="text-sm text-muted-foreground">&copy; 2026 TugasKilat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
