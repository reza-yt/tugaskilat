"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Save, Loader2, Pencil, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  author: string;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
}

const emptyPost: Omit<BlogPost, "id" | "created_at"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  category: "tips",
  author: "TugasKilat Team",
  tags: [],
  is_published: false,
  published_at: null,
  meta_title: "",
  meta_description: "",
};

export default function AdminBlogPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | (typeof emptyPost & { id?: string }) | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }

  function openNewPost() {
    setEditingPost({ ...emptyPost });
    setTagsInput("");
    setDialogOpen(true);
  }

  function openEditPost(post: BlogPost) {
    setEditingPost(post);
    setTagsInput(post.tags.join(", "));
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!editingPost) return;
    if (!editingPost.title || !editingPost.slug || !editingPost.content) {
      toast.error("Title, slug, dan content wajib diisi");
      return;
    }

    setSaving(true);
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      slug: editingPost.slug,
      title: editingPost.title,
      excerpt: editingPost.excerpt || null,
      content: editingPost.content,
      category: editingPost.category,
      author: editingPost.author,
      tags,
      is_published: editingPost.is_published,
      published_at: editingPost.is_published ? (editingPost.published_at || new Date().toISOString()) : null,
      meta_title: editingPost.meta_title || null,
      meta_description: editingPost.meta_description || null,
      updated_at: new Date().toISOString(),
    };

    try {
      if ("id" in editingPost && editingPost.id) {
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", editingPost.id);
        if (error) throw error;
        toast.success("Artikel berhasil diupdate!");
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
        toast.success("Artikel berhasil dibuat!");
      }
      setDialogOpen(false);
      fetchPosts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan";
      toast.error(msg);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin hapus artikel ini?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus");
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Artikel dihapus");
  }

  async function togglePublish(post: BlogPost) {
    const newPublished = !post.is_published;
    const { error } = await supabase
      .from("blog_posts")
      .update({
        is_published: newPublished,
        published_at: newPublished ? new Date().toISOString() : null,
      })
      .eq("id", post.id);

    if (error) {
      toast.error("Gagal update status");
      return;
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, is_published: newPublished, published_at: newPublished ? new Date().toISOString() : null }
          : p
      )
    );
    toast.success(newPublished ? "Artikel dipublish!" : "Artikel di-unpublish");
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-48 skeleton-shimmer rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 skeleton-shimmer rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground mt-1">{posts.length} artikel</p>
        </div>
        <Button onClick={openNewPost} className="gap-2 font-semibold">
          <Plus className="h-4 w-4" />
          Artikel Baru
        </Button>
      </div>

      {/* Post list */}
      <div className="space-y-3">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={post.is_published ? "default" : "secondary"} className="text-[10px]">
                      {post.is_published ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] capitalize">{post.category}</Badge>
                  </div>
                  <p className="font-semibold text-sm truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">/blog/{post.slug}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => togglePublish(post)}>
                    {post.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditPost(post)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost && "id" in editingPost ? "Edit Artikel" : "Artikel Baru"}
            </DialogTitle>
          </DialogHeader>

          {editingPost && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Judul *</Label>
                  <Input
                    value={editingPost.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setEditingPost({
                        ...editingPost,
                        title: newTitle,
                        slug: editingPost.slug || generateSlug(newTitle),
                      });
                    }}
                    placeholder="Judul artikel"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Slug *</Label>
                  <Input
                    value={editingPost.slug}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    placeholder="url-slug-artikel"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Excerpt</Label>
                <Textarea
                  value={editingPost.excerpt || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat artikel..."
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Content (Markdown) *</Label>
                <Textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Tulis konten dalam format Markdown..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Kategori</Label>
                  <Input
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    placeholder="tips"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Author</Label>
                  <Input
                    value={editingPost.author}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags (comma-separated)</Label>
                  <Input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="tips, makalah, akademik"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Meta Title (SEO)</Label>
                  <Input
                    value={editingPost.meta_title || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, meta_title: e.target.value })}
                    placeholder="Custom title untuk search engine"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Meta Description (SEO)</Label>
                  <Input
                    value={editingPost.meta_description || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, meta_description: e.target.value })}
                    placeholder="Deskripsi untuk search engine"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingPost.is_published}
                  onChange={(e) => setEditingPost({ ...editingPost, is_published: e.target.checked })}
                  className="rounded border-border"
                  id="published"
                />
                <Label htmlFor="published" className="text-sm font-medium cursor-pointer">
                  Publish sekarang
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2 font-semibold">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
