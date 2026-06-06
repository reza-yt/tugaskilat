"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Loader2, ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { resetPassword } from "@/lib/auth/actions";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
});

type ForgotForm = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: ForgotForm) {
    setLoading(true);
    try {
      const result = await resetPassword(data.email);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        setSent(true);
      }
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-xl shadow-black/5 dark:shadow-black/20">
      <CardHeader className="text-center space-y-1.5 pb-4">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription className="text-sm">
          {sent
            ? "Cek email kamu untuk link reset"
            : "Masukkan email untuk menerima link reset password"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {sent ? (
          <div className="text-center space-y-5 py-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 mx-auto">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Email terkirim!</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Link reset password sudah dikirim. Cek inbox atau folder spam kamu.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Cek email kamu</span>
            </div>
            <Link href="/login">
              <Button variant="outline" className="gap-2 font-medium">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="h-11"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-11 font-semibold shadow-md shadow-primary/20" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Kirim Link Reset
              </Button>
            </form>

            <p className="text-center">
              <Link
                href="/login"
                className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali ke Login
              </Link>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
