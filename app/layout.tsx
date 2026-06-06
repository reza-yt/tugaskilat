import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    <html lang="id" className={plusJakarta.variable} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6d28d9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TugasKilat" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TugasKilat",
              "url": "https://tugaskilat.web.id",
              "description": "Generator tugas otomatis untuk SMA & Kuliah menggunakan AI.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "IDR",
                "description": "3 kredit gratis saat daftar"
              },
              "creator": {
                "@type": "Organization",
                "name": "TugasKilat",
                "url": "https://tugaskilat.web.id"
              }
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased scroll-smooth">
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
