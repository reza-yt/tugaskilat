"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-chart-5/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <FadeIn delay={0} className="mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Zap className="h-5 w-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight">TugasKilat</span>
        </Link>
      </FadeIn>

      <FadeIn delay={0.1} className="w-full max-w-md">
        {children}
      </FadeIn>
    </div>
  );
}
