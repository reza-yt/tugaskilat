"use client";

import { AppNavbar } from "@/components/dashboard/navbar";
import { motion } from "framer-motion";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <AppNavbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        className="flex-1 container mx-auto px-4 py-8 max-w-6xl"
      >
        {children}
      </motion.main>
    </div>
  );
}
