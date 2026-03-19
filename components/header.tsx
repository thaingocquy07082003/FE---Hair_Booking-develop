"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarRange,
  Menu,
  X,
  Scissors,
  Image,
  Home,
  Users,
  Phone,
  User,
  LogOut,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getCookie, clearAuthCookies, setCookie } from "@/lib/cookie";
import { getMyProfile, UserProfile } from "@/services/profile/profile.api";

const routes = [
  { href: "/", label: "Trang chủ", icon: <Home className="h-4 w-4" /> },
  { href: "/services", label: "Dịch vụ", icon: <Scissors className="h-4 w-4" /> },
  { href: "/stylists", label: "Thợ cắt tóc", icon: <Users className="h-4 w-4" /> },
  { href: "/gallery", label: "Bộ sưu tập", icon: <Image className="h-4 w-4" /> },
  { href: "/contact", label: "Liên hệ", icon: <Phone className="h-4 w-4" /> },
];

// ── Avatar tròn ──────────────────────────────────────────────────────────────
function UserAvatar({
  avatarUrl,
  fullName,
  size = 32,
}: {
  avatarUrl: string | null;
  fullName: string;
  size?: number;
}) {
  const sizeClass = size === 32 ? "h-8 w-8" : "h-10 w-10";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-primary/20`}
      />
    );
  }

  // Fallback: icon hình người
  return (
    <div
      className={`${sizeClass} rounded-full bg-muted flex items-center justify-center ring-2 ring-primary/20`}
    >
      <User className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

// ── Header component ─────────────────────────────────────────────────────────
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token) {
      setIsLoggedIn(false);
      setProfile(null);
      return;
    }

    setIsLoggedIn(true);

    // Thử đọc từ cookie trước (đã fetch lần trước)
    const cachedAvatar = getCookie("userAvatarUrl");
    const cachedFullName = getCookie("userFullName");
    const cachedEmail = getCookie("userEmail");
    const cachedPhone = getCookie("userPhone");
    const cachedRole = getCookie("userRole");
    const cachedId = getCookie("userId");

    if (cachedFullName && cachedEmail) {
      setProfile({
        id: cachedId ?? "",
        email: cachedEmail,
        fullName: cachedFullName,
        phone: cachedPhone ?? "",
        role: cachedRole ?? "",
        verified: true,
        avatarUrl: cachedAvatar && cachedAvatar !== "null" ? cachedAvatar : null,
        createdAt: "",
        updatedAt: "",
      });
    }

    // Luôn fetch mới nhất từ API để cập nhật
    getMyProfile()
      .then((data) => {
        setProfile(data);
        // Lưu đầy đủ vào cookie
        setCookie("userId", data.id, 7);
        setCookie("userEmail", data.email, 7);
        setCookie("userFullName", data.fullName, 7);
        setCookie("userRole", data.role, 7);
        setCookie("userPhone", data.phone ?? "", 7);
        setCookie("userAvatarUrl", data.avatarUrl ?? "null", 7);
      })
      .catch(() => {
        // Token hết hạn hoặc lỗi → không logout ngay, giữ cache
      });
  }, [pathname]); // re-check mỗi khi chuyển trang

  const handleLogout = () => {
    clearAuthCookies();
    localStorage.removeItem("user");
    setProfile(null);
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Scissors className="h-6 w-6" />
          <span className="text-xl font-bold">HairStyle</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="flex items-center gap-3">
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

          {/* ── Avatar / Đăng nhập ── */}
          {isLoggedIn && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
                  <UserAvatar avatarUrl={profile.avatarUrl} fullName={profile.fullName} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      avatarUrl={profile.avatarUrl}
                      fullName={profile.fullName}
                      size={40}
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold leading-none">
                        {profile.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Tài khoản</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/appointments">
                      <CalendarRange className="mr-2 h-4 w-4" />
                      <span>Lịch hẹn</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Đăng nhập</Link>
            </Button>
          )}

          {/* Mobile menu trigger */}
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
                <Button variant="outline" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Mobile user info */}
              {isLoggedIn && profile && (
                <div className="flex items-center gap-3 mt-6 px-1 pb-4 border-b">
                  <UserAvatar
                    avatarUrl={profile.avatarUrl}
                    fullName={profile.fullName}
                    size={40}
                  />
                  <div>
                    <p className="text-sm font-semibold">{profile.fullName}</p>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-4 mt-6">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-base font-medium transition-colors hover:text-primary",
                      pathname === route.href ? "text-primary" : "text-muted-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
                <Button
                  variant="outline"
                  className="mt-2"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/try-hairstyle">
                    <Image className="mr-2 h-4 w-4" />
                    Thử kiểu tóc
                  </Link>
                </Button>
                <Button className="mt-2" asChild onClick={() => setOpen(false)}>
                  <Link href="/booking">
                    <CalendarRange className="mr-2 h-4 w-4" />
                    Đặt lịch
                  </Link>
                </Button>
                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    className="mt-2 text-red-500 hover:text-red-600 justify-start px-0"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </Button>
                ) : (
                  <Button variant="outline" className="mt-2" asChild onClick={() => setOpen(false)}>
                    <Link href="/auth/login">Đăng nhập</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}