import Link from "next/link";
import { notFound } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowLeft, Calendar, User, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  author: string;
  tags: string[];
  published_at: string;
  meta_title: string | null;
  meta_description: string | null;
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServiceRoleClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, meta_title, meta_description, slug")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || "",
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      url: `https://tugaskilat.web.id/blog/${post.slug}`,
      type: "article",
    },
    alternates: {
      canonical: `https://tugaskilat.web.id/blog/${post.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const supabase = createServiceRoleClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);

  return (posts || []).map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServiceRoleClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const blogPost = post as BlogPost;
  const wordCount = blogPost.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blogPost.title,
    description: blogPost.excerpt || blogPost.meta_description || "",
    author: { "@type": "Person", name: blogPost.author },
    datePublished: blogPost.published_at,
    publisher: {
      "@type": "Organization",
      name: "TugasKilat",
      url: "https://tugaskilat.web.id",
    },
    mainEntityOfPage: `https://tugaskilat.web.id/blog/${blogPost.slug}`,
  };

  return (
    <div className="min-h-screen">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="font-medium">Blog</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-semibold">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-12">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Blog
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="capitalize font-medium">
                {blogPost.category}
              </Badge>
              {blogPost.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              {blogPost.title}
            </h1>

            {blogPost.excerpt && (
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                {blogPost.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground border-t pt-4">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {blogPost.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(blogPost.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readTime} menit baca
              </span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown>{blogPost.content}</ReactMarkdown>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-16 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
          <h3 className="font-bold text-lg">Butuh bantuan mengerjakan tugas?</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            TugasKilat bisa membantu generate makalah, essay, laporan, dan banyak lagi dalam hitungan menit.
          </p>
          <Link href="/register">
            <Button className="mt-4 font-semibold gap-2 shadow-md shadow-primary/20">
              <Zap className="h-4 w-4" />
              Coba Gratis — 3 Kredit
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-10 px-4 bg-muted/20 mt-16">
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
