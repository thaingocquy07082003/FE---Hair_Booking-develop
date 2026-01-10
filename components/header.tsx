"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarRange,
  Menu,
  X,
  Scissors,
  Image,
  Home,
  Users,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/user-nav";

const routes = [
  {
    href: "/",
    label: "Trang chủ",
    icon: <Home className="h-4 w-4" />,
  },
  {
    href: "/services",
    label: "Dịch vụ",
    icon: <Scissors className="h-4 w-4" />,
  },
  {
    href: "/stylists",
    label: "Thợ cắt tóc",
    icon: <Users className="h-4 w-4" />,
  },
  {
    href: "/gallery",
    label: "Bộ sưu tập",
    icon: <Image className="h-4 w-4" />,
  },
  {
    href: "/contact",
    label: "Liên hệ",
    icon: <Phone className="h-4 w-4" />,
  },
];

const mobileRoutes = [
  ...routes,
  {
    href: "/try-hairstyle",
    label: "Thử kiểu tóc",
    icon: <Image className="h-4 w-4" />,
  },
  {
    href: "/booking",
    label: "Đặt lịch",
    icon: <CalendarRange className="h-4 w-4" />,
  },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 ml-8">
          <Scissors className="h-6 w-6" />
          <span className="text-xl font-bold">HairStyle</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex" asChild>
            <Link href="/try-hairstyle">
              <Image className="mr-2 h-4 w-4" />
              Thử kiểu tóc
            </Link>
          </Button>
          <Button className="hidden md:flex" asChild>
            <Link href="/booking">
              <CalendarRange className="mr-2 h-4 w-4" />
              Đặt lịch
            </Link>
          </Button>
          <UserNav />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setOpen(false)}
                >
                  <Scissors className="h-6 w-6" />
                  <span className="text-xl font-bold">HairStyle</span>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-base font-medium transition-colors hover:text-primary",
                      pathname === route.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
                <Button
                  variant="outline"
                  className="mt-4"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/try-hairstyle">
                    <Image className="mr-2 h-4 w-4" />
                    Thử kiểu tóc
                  </Link>
                </Button>
                <Button className="mt-4" asChild onClick={() => setOpen(false)}>
                  <Link href="/booking">
                    <CalendarRange className="mr-2 h-4 w-4" />
                    Đặt lịch
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
