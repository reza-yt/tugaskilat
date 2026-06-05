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
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/new", label: "Buat Tugas", icon: Plus },
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4 max-w-6xl">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 mr-6">
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">TugasKilat</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "gap-2",
                  pathname === item.href && "bg-secondary"
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
        <Badge
          variant="secondary"
          className="hidden sm:flex items-center gap-1 mr-3 px-3 py-1"
        >
          <Coins className="h-3.5 w-3.5" />
          <span className="font-semibold">--</span>
          <span className="text-muted-foreground text-xs">kredit</span>
        </Badge>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                window.location.href = "/profile";
              }}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await signOut();
              }}
              className="gap-2 text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-4 mt-8">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 w-fit px-3 py-1"
              >
                <Coins className="h-3.5 w-3.5" />
                <span className="font-semibold">--</span>
                <span className="text-muted-foreground text-xs">kredit</span>
              </Badge>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Link href="/profile">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Profil
                  </Button>
                </Link>
              </nav>
              <Button
                variant="ghost"
                className="justify-start gap-2 text-destructive"
                onClick={async () => {
                  await signOut();
                }}
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
