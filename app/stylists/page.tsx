"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Star,
  CalendarRange,
  Scissors,
  CheckCircle2,
  XCircle,
  Search,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllStylists, Stylist } from "@/services/stylist/stylist.api";

// ── Avatar ────────────────────────────────────────────────────────────────────
function StylistAvatar({
  avatarUrl,
  fullName,
}: {
  avatarUrl: string | null;
  fullName: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        className="h-20 w-20 rounded-full object-cover ring-4 ring-background"
      />
    );
  }
  return (
    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center ring-4 ring-background">
      <User className="h-9 w-9 text-muted-foreground" />
    </div>
  );
}

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill={star <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke={star <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
          strokeWidth="1.5"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        {rating > 0 ? rating.toFixed(1) : "Chưa có"}
      </span>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-card p-6 animate-pulse space-y-4">
      <div className="flex flex-col items-center gap-3">
        <div className="h-20 w-20 rounded-full bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-3 w-20 rounded bg-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-3/4 rounded bg-muted" />
      </div>
      <div className="h-9 rounded-lg bg-muted" />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function StylistsPage() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [filtered, setFiltered] = useState<Stylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterAvailable, setFilterAvailable] = useState<
    "all" | "available" | "unavailable"
  >("all");

  useEffect(() => {
    getAllStylists()
      .then((data) => {
        setStylists(data);
        setFiltered(data);
      })
      .catch(() => setError("Không thể tải danh sách thợ cắt tóc"))
      .finally(() => setIsLoading(false));
  }, []);

  // ── Filter logic ──────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...stylists];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.specialties.some((sp) => sp.toLowerCase().includes(q))
      );
    }

    if (filterAvailable === "available") {
      result = result.filter((s) => s.isAvailable);
    } else if (filterAvailable === "unavailable") {
      result = result.filter((s) => !s.isAvailable);
    }

    setFiltered(result);
  }, [search, filterAvailable, stylists]);

  return (
    <div className="container py-12 px-4 md:px-6">
      {/* ── Header ── */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Đội ngũ thợ cắt tóc
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Gặp gỡ những nghệ nhân tài năng của chúng tôi — mỗi người đều mang
          phong cách riêng và nhiều năm kinh nghiệm.
        </p>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc chuyên môn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(
            [
              { key: "all", label: "Tất cả" },
              { key: "available", label: "Đang rảnh" },
              { key: "unavailable", label: "Bận" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterAvailable(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                filterAvailable === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="text-center py-16 text-muted-foreground">{error}</div>
      )}

      {/* ── Grid ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((stylist) => (
              <StylistCard key={stylist.id} stylist={stylist} />
            ))}
      </div>

      {/* ── Empty state ── */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-20 space-y-3">
          <Scissors className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Không tìm thấy thợ cắt tóc phù hợp
          </p>
          <button
            onClick={() => {
              setSearch("");
              setFilterAvailable("all");
            }}
            className="text-sm text-primary underline underline-offset-2"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* ── Count ── */}
      {!isLoading && !error && filtered.length > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-8">
          Hiển thị {filtered.length} / {stylists.length} thợ cắt tóc
        </p>
      )}
    </div>
  );
}

// ── Stylist card ──────────────────────────────────────────────────────────────
function StylistCard({ stylist }: { stylist: Stylist }) {
  return (
    <div className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
      {/* Top colored band */}
      <div className="h-16 bg-gradient-to-r from-muted to-muted/60 relative">
        {/* Available badge */}
        <div className="absolute top-3 right-3">
          {stylist.isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" />
              Đang rảnh
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
              <XCircle className="h-3 w-3" />
              Đang bận
            </span>
          )}
        </div>
        {/* Avatar overlapping */}
        <div className="absolute -bottom-10 left-6">
          <StylistAvatar avatarUrl={stylist.avatarUrl} fullName={stylist.fullName} />
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 pb-5 px-6 flex flex-col flex-1 gap-4">
        {/* Name + rating */}
        <div>
          <h3 className="font-semibold text-base leading-tight">
            {stylist.fullName}
          </h3>
          <div className="mt-1">
            <StarRating rating={stylist.rating} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>
              {stylist.experience > 0
                ? `${stylist.experience} năm KN`
                : "Mới vào nghề"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarRange className="h-3.5 w-3.5 shrink-0" />
            <span>{stylist.totalBookings} lịch</span>
          </div>
        </div>

        {/* Specialties */}
        {stylist.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {stylist.specialties.map((sp) => (
              <span
                key={sp}
                className="px-2.5 py-0.5 rounded-full text-xs bg-muted text-muted-foreground border border-border"
              >
                {sp}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-1">
          <Button className="w-full" size="sm" asChild disabled={!stylist.isAvailable}>
            <Link
              href={`/booking?stylistId=${stylist.id}`}
              aria-disabled={!stylist.isAvailable}
              onClick={(e) => !stylist.isAvailable && e.preventDefault()}
            >
              <CalendarRange className="mr-1.5 h-3.5 w-3.5" />
              {stylist.isAvailable ? "Đặt lịch ngay" : "Hiện không nhận lịch"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}