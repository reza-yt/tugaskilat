"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Plus, Trash2, Save, Loader2, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { CreditPackage } from "@/lib/types";

export default function AdminPricingPage() {
  const supabase = createClient();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

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

  async function handleSave(pkg: CreditPackage) {
    setSaving(pkg.id);
    try {
      if (pkg.id.startsWith("new-")) {
        const { data, error } = await supabase
          .from("credit_packages")
          .insert({
            name: pkg.name,
            credits: pkg.credits,
            price_idr: pkg.price_idr,
            bonus_credits: pkg.bonus_credits,
            is_active: pkg.is_active,
          })
          .select()
          .single();

        if (error) throw error;
        setPackages((prev) => prev.map((p) => (p.id === pkg.id ? data : p)));
        toast.success("Paket berhasil dibuat!");
      } else {
        const { error } = await supabase
          .from("credit_packages")
          .update({
            name: pkg.name,
            credits: pkg.credits,
            price_idr: pkg.price_idr,
            bonus_credits: pkg.bonus_credits,
            is_active: pkg.is_active,
          })
          .eq("id", pkg.id);

        if (error) throw error;
        toast.success("Paket berhasil diupdate!");
      }
    } catch {
      toast.error("Gagal menyimpan paket");
    }
    setSaving(null);
  }

  async function handleDelete(id: string) {
    if (id.startsWith("new-")) {
      setPackages((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    if (!confirm("Yakin ingin menghapus paket ini?")) return;

    const { error } = await supabase.from("credit_packages").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus paket");
      return;
    }
    setPackages((prev) => prev.filter((p) => p.id !== id));
    toast.success("Paket dihapus");
  }

  function addNewPackage() {
    setPackages([
      ...packages,
      {
        id: `new-${Date.now()}`,
        name: "",
        credits: 0,
        price_idr: 0,
        bonus_credits: 0,
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ]);
  }

  function updatePackage(id: string, field: keyof CreditPackage, value: string | number | boolean) {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-48 skeleton-shimmer rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 skeleton-shimmer rounded-xl" />
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
          <p className="text-muted-foreground mt-1">Kelola paket harga kredit</p>
        </div>
        <Button onClick={addNewPackage} className="gap-2 font-semibold">
          <Plus className="h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className={`border-0 shadow-sm ${!pkg.is_active ? "opacity-60" : ""}`}>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold">
                    {pkg.name || "Paket Baru"}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={pkg.is_active ? "default" : "secondary"} className="text-[10px]">
                    {pkg.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Nama Paket</Label>
                    <Input
                      value={pkg.name}
                      onChange={(e) => updatePackage(pkg.id, "name", e.target.value)}
                      placeholder="Starter"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Kredit</Label>
                    <Input
                      type="number"
                      value={pkg.credits}
                      onChange={(e) => updatePackage(pkg.id, "credits", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Harga (Rp)</Label>
                    <Input
                      type="number"
                      value={pkg.price_idr}
                      onChange={(e) => updatePackage(pkg.id, "price_idr", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Bonus Kredit</Label>
                    <Input
                      type="number"
                      value={pkg.bonus_credits}
                      onChange={(e) => updatePackage(pkg.id, "bonus_credits", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {pkg.credits > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Harga per kredit: Rp {Math.round(pkg.price_idr / (pkg.credits + pkg.bonus_credits)).toLocaleString("id-ID")}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pkg.is_active}
                      onChange={(e) => updatePackage(pkg.id, "is_active", e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-xs font-medium">Aktif</span>
                  </label>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive h-8"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5 h-8 font-medium"
                      onClick={() => handleSave(pkg)}
                      disabled={saving === pkg.id}
                    >
                      {saving === pkg.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      Simpan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
