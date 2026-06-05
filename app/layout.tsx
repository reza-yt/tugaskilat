import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TugasKilat — Generator Tugas Otomatis SMA & Kuliah",
  description:
    "Buat makalah, essay, laporan praktikum, soal matematika, dan semua jenis tugas otomatis dengan AI. Gratis 3 kredit.",
  keywords: [
    "generator tugas",
    "tugas otomatis",
    "makalah",
    "essay",
    "laporan praktikum",
    "AI",
    "SMA",
    "kuliah",
  ],
  openGraph: {
    title: "TugasKilat — Generator Tugas Otomatis SMA & Kuliah",
    description:
      "Buat makalah, essay, laporan praktikum, soal matematika, dan semua jenis tugas otomatis dengan AI. Gratis 3 kredit.",
    url: "https://tugaskilat.web.id",
    siteName: "TugasKilat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TugasKilat — Generator Tugas Otomatis SMA & Kuliah",
    description:
      "Buat makalah, essay, laporan praktikum, soal matematika, dan semua jenis tugas otomatis dengan AI.",
  },
  metadataBase: new URL("https://tugaskilat.web.id"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
