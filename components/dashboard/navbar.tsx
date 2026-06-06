"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  LayoutDashboard,
  Plus,
  User,
  LogOut,
  Menu,
  Coins,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/new", label: "Buat Tugas", icon: Plus },
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center px-4 max-w-6xl">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 mr-8">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline">TugasKilat</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 font-medium transition-all",
                  pathname === item.href
                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Credit badge */}
        <Link href="/pricing">
          <Badge
            variant="secondary"
            className="hidden sm:flex items-center gap-1.5 mr-4 px-3 py-1.5 cursor-pointer hover:bg-secondary/80 transition-colors border border-border/50"
          >
            <Coins className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold text-sm">--</span>
            <span className="text-muted-foreground text-xs font-medium">kredit</span>
          </Badge>
        </Link>

        {/* User menu - desktop */}
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden md:flex">
            <Avatar className="h-9 w-9 border-2 border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => { window.location.href = "/profile"; }}
              className="gap-2 cursor-pointer"
            >
              <User className="h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => { await signOut(); }}
              className="gap-2 text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="p-5 border-b">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-lg">TugasKilat</span>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-2">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 w-fit px-3 py-1.5 mb-4 border border-border/50"
                >
                  <Coins className="h-3.5 w-3.5 text-primary" />
                  <span className="font-bold">--</span>
                  <span className="text-muted-foreground text-xs">kredit</span>
                </Badge>

                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 font-medium",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full justify-start gap-3 font-medium text-muted-foreground">
                      <User className="h-4 w-4" />
                      Profil
                    </Button>
                  </Link>
                </nav>
              </div>

              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive font-medium"
                  onClick={async () => { await signOut(); }}
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
