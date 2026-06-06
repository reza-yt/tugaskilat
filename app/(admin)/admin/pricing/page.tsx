"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  CreditCard,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Coins,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { CreditPackage } from "@/lib/types";

const emptyPackage: Omit<CreditPackage, "id" | "created_at"> = {
  name: "",
  credits: 0,
  price_idr: 0,
  bonus_credits: 0,
  is_active: true,
};

export default function AdminPricingPage() {
  const supabase = createClient();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<CreditPackage | (typeof emptyPackage & { id?: string }) | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPackages() {
    const { data } = await supabase
      .from("credit_packages")
      .select("*")
      .order("price_idr", { ascending: true });

    if (data) setPackages(data);
    setLoading(false);
  }

  function openCreate() {
    setEditingPkg({ ...emptyPackage });
    setIsNew(true);
    setDialogOpen(true);
  }

  function openEdit(pkg: CreditPackage) {
    setEditingPkg({ ...pkg });
    setIsNew(false);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!editingPkg || !editingPkg.name) {
      toast.error("Nama paket wajib diisi");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: editingPkg.name,
        credits: editingPkg.credits,
        price_idr: editingPkg.price_idr,
        bonus_credits: editingPkg.bonus_credits,
        is_active: editingPkg.is_active,
      };

      if (isNew) {
        const { error } = await supabase.from("credit_packages").insert(payload);
        if (error) throw error;
        toast.success("Paket berhasil ditambahkan!");
      } else if ("id" in editingPkg && editingPkg.id) {
        const { error } = await supabase
          .from("credit_packages")
          .update(payload)
          .eq("id", editingPkg.id);
        if (error) throw error;
        toast.success("Paket berhasil diupdate!");
      }

      setDialogOpen(false);
      fetchPackages();
    } catch {
      toast.error("Gagal menyimpan paket");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus paket ini? Aksi ini tidak bisa dibatalkan.")) return;

    const { error } = await supabase.from("credit_packages").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus paket");
      return;
    }
    setPackages((prev) => prev.filter((p) => p.id !== id));
    toast.success("Paket berhasil dihapus");
  }

  async function toggleActive(pkg: CreditPackage) {
    const newActive = !pkg.is_active;
    const { error } = await supabase
      .from("credit_packages")
      .update({ is_active: newActive })
      .eq("id", pkg.id);

    if (error) {
      toast.error("Gagal update status");
      return;
    }
    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, is_active: newActive } : p))
    );
    toast.success(newActive ? "Paket diaktifkan" : "Paket dinonaktifkan");
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-48 skeleton-shimmer rounded-lg" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 skeleton-shimmer rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paket Kredit</h1>
          <p className="text-muted-foreground mt-1">
            {packages.length} paket · {packages.filter((p) => p.is_active).length} aktif
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 font-semibold">
          <Plus className="h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      {/* Package Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left font-semibold p-4">Paket</th>
                  <th className="text-center font-semibold p-4">Kredit</th>
                  <th className="text-center font-semibold p-4">Bonus</th>
                  <th className="text-center font-semibold p-4">Harga</th>
                  <th className="text-center font-semibold p-4">Per Kredit</th>
                  <th className="text-center font-semibold p-4">Status</th>
                  <th className="text-right font-semibold p-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, i) => (
                  <motion.tr
                    key={pkg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${
                      !pkg.is_active ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{pkg.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Total: {pkg.credits + pkg.bonus_credits} kredit
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-medium">{pkg.credits}</td>
                    <td className="p-4 text-center">
                      {pkg.bonus_credits > 0 ? (
                        <Badge variant="secondary" className="text-xs font-bold text-primary">
                          +{pkg.bonus_credits}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center font-bold">
                      Rp {pkg.price_idr.toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 text-center text-muted-foreground text-xs">
                      Rp {Math.round(pkg.price_idr / (pkg.credits + pkg.bonus_credits)).toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 text-center">
                      <Badge
                        variant={pkg.is_active ? "default" : "secondary"}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleActive(pkg)}
                      >
                        {pkg.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => toggleActive(pkg)}
                          title={pkg.is_active ? "Nonaktifkan" : "Aktifkan"}
                        >
                          {pkg.is_active ? (
                            <ToggleRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => openEdit(pkg)}
                          title="Edit paket"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(pkg.id)}
                          title="Hapus paket"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {packages.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16">
            <Coins className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="font-semibold">Belum ada paket kredit</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Tambah paket pertama untuk mulai jualan</p>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Paket
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {isNew ? "Tambah Paket Baru" : `Edit: ${editingPkg?.name || ""}`}
            </DialogTitle>
          </DialogHeader>

          {editingPkg && (
            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nama Paket *</Label>
                <Input
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  placeholder="Contoh: Starter, Basic, Pro"
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Jumlah Kredit *</Label>
                  <Input
                    type="number"
                    value={editingPkg.credits}
                    onChange={(e) =>
                      setEditingPkg({ ...editingPkg, credits: parseInt(e.target.value) || 0 })
                    }
                    placeholder="10"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Bonus Kredit</Label>
                  <Input
                    type="number"
                    value={editingPkg.bonus_credits}
                    onChange={(e) =>
                      setEditingPkg({ ...editingPkg, bonus_credits: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Harga (Rupiah) *</Label>
                <Input
                  type="number"
                  value={editingPkg.price_idr}
                  onChange={(e) =>
                    setEditingPkg({ ...editingPkg, price_idr: parseInt(e.target.value) || 0 })
                  }
                  placeholder="15000"
                  className="h-11"
                />
                {editingPkg.credits > 0 && editingPkg.price_idr > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    = Rp {Math.round(editingPkg.price_idr / (editingPkg.credits + editingPkg.bonus_credits)).toLocaleString("id-ID")} per kredit
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <input
                  type="checkbox"
                  checked={editingPkg.is_active}
                  onChange={(e) => setEditingPkg({ ...editingPkg, is_active: e.target.checked })}
                  className="rounded border-border h-4 w-4"
                  id="pkg-active"
                />
                <Label htmlFor="pkg-active" className="text-sm font-medium cursor-pointer">
                  Paket aktif (tampil di halaman pricing)
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2 font-semibold min-w-[120px]">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isNew ? "Tambah" : "Simpan"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
