import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const CREDIT_PACKAGES = [
  {
    name: "Starter",
    credits: 10,
    price: 15000,
    bonus: 0,
    features: [
      "10 kredit",
      "Semua jenis tugas",
      "Download .txt",
      "Tidak ada expired",
    ],
  },
  {
    name: "Basic",
    credits: 30,
    price: 40000,
    bonus: 5,
    popular: true,
    features: [
      "30 + 5 bonus kredit",
      "Semua jenis tugas",
      "Download .txt & .docx",
      "Tidak ada expired",
      "Priority support",
    ],
  },
  {
    name: "Pro",
    credits: 100,
    price: 120000,
    bonus: 20,
    features: [
      "100 + 20 bonus kredit",
      "Semua jenis tugas",
      "Download .txt & .docx",
      "Tidak ada expired",
      "Priority support",
      "Akses fitur beta",
    ],
  },
  {
    name: "Ultimate",
    credits: 300,
    price: 300000,
    bonus: 70,
    features: [
      "300 + 70 bonus kredit",
      "Semua jenis tugas",
      "Download semua format",
      "Tidak ada expired",
      "Dedicated support",
      "Akses fitur beta",
      "Custom request",
    ],
  },
];

const PRICING_FAQ = [
  {
    q: "Apakah kredit bisa expired?",
    a: "Tidak! Kredit yang sudah dibeli tidak memiliki masa berlaku. Kamu bisa gunakan kapanpun.",
  },
  {
    q: "Berapa kredit yang dipakai per tugas?",
    a: "1 kredit per generate, tidak peduli jenis atau panjang tugasnya.",
  },
  {
    q: "Metode pembayaran apa yang tersedia?",
    a: "Kami menerima transfer bank (BCA, BNI, BRI, Mandiri), e-wallet (GoPay, OVO, Dana), dan QRIS.",
  },
  {
    q: "Apakah bisa refund?",
    a: "Kredit yang sudah dibeli tidak dapat di-refund. Namun jika generate gagal, kredit kamu akan otomatis dikembalikan.",
  },
  {
    q: "Apakah ada diskon untuk pembelian banyak?",
    a: "Ya! Semakin besar paket yang dibeli, semakin murah harga per kreditnya. Paket Ultimate paling hemat.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-6xl">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">TugasKilat</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold">Pilih Paket Kredit</h1>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Bayar sekali, pakai kapanpun. Tidak ada biaya berlangganan atau biaya tersembunyi.
            </p>
          </div>

          {/* Packages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {CREDIT_PACKAGES.map((pkg) => (
              <Card
                key={pkg.name}
                className={
                  pkg.popular
                    ? "border-primary ring-2 ring-primary/20 relative"
                    : ""
                }
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    Paling Populer
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>
                    {pkg.credits + pkg.bonus} total kredit
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <p className="text-3xl font-bold">
                      Rp {pkg.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rp{" "}
                      {Math.round(
                        pkg.price / (pkg.credits + pkg.bonus)
                      ).toLocaleString("id-ID")}
                      /kredit
                    </p>
                  </div>

                  <Separator />

                  <ul className="space-y-2 text-left text-sm">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register">
                    <Button
                      className="w-full"
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      Pilih {pkg.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              FAQ Pembayaran
            </h2>
            <div className="space-y-4">
              {PRICING_FAQ.map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{item.q}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {item.a}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold">TugasKilat</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TugasKilat. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
