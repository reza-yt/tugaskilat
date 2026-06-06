"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Loader2 } from "lucide-react";

const ADMIN_EMAILS = [
  "dracprem@gmail.com",
  // Tambahkan email admin di sini
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user is admin (by email or by role in profiles)
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, tier")
        .eq("id", user.id)
        .single();

      const isAdmin =
        ADMIN_EMAILS.includes(user.email || "") ||
        ADMIN_EMAILS.includes(profile?.email || "") ||
        profile?.tier === "admin";

      if (!isAdmin) {
        router.push("/dashboard");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    }

    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen flex bg-muted/20">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
