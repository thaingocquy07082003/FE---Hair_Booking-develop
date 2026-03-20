"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Clock, Scissors, ChevronRight, Star, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface HairStyle {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  stylistIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: "Tất cả",
  men_short: "Nam ngắn",
  women_short: "Nữ ngắn",
  women_long: "Nữ dài",
  kids: "Trẻ em",
  beard: "Râu",
  coloring: "Nhuộm",
  perm: "Uốn / Duỗi",
};

const DIFFICULTY_CONFIG = {
  easy: { label: "Đơn giản", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  medium: { label: "Trung bình", color: "text-amber-600 bg-amber-50 border-amber-200" },
  hard: { label: "Phức tạp", color: "text-rose-600 bg-rose-50 border-rose-200" },
};

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "đ";
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}g ${m}p` : `${h} giờ`;
}

export default function GalleryPage() {
  const [hairstyles, setHairstyles] = useState<HairStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState<HairStyle | null>(null);

  useEffect(() => {
    const fetchHairstyles = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("http://localhost:3002/api/v1/hairstyles");
        const data = response.data?.data ?? response.data;
        setHairstyles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Không thể tải danh sách kiểu tóc. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHairstyles();
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(hairstyles.map((h) => h.category))),
  ];

  const filtered =
    activeCategory === "all"
      ? hairstyles
      : hairstyles.filter((h) => h.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-zinc-900 py-20 px-4">
        {/* decorative */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-white" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-white" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-white" />
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-400/5 blur-3xl" />

        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-400 text-sm tracking-[0.3em] uppercase font-medium mb-4">
              HairStyle Studio
            </p>
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-5 tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Bộ Sưu Tập
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
              Khám phá các kiểu tóc thời thượng được tuyển chọn bởi đội ngũ thợ
              chuyên nghiệp của chúng tôi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter Bar ───────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-[#f9f7f4]/95 backdrop-blur border-b border-zinc-200">
        <div className="container">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <Filter className="h-4 w-4 text-zinc-400 mr-1 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                  activeCategory === cat
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                )}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="container py-10">
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-white animate-pulse"
              >
                <div className="aspect-[3/4] bg-zinc-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <p className="text-sm text-zinc-500 mb-6">
              {filtered.length} kiểu tóc
            </p>
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              <AnimatePresence>
                {filtered.map((style, i) => (
                  <motion.div
                    key={style.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    onClick={() => setSelectedStyle(style)}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100"
                  >
                    {/* image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                      <img
                        src={style.imageUrl}
                        alt={style.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* price badge */}
                      <div className="absolute top-3 right-3 bg-amber-400 text-zinc-900 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        {formatPrice(style.price)}
                      </div>
                      {/* hover cta */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="bg-white text-zinc-900 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5">
                          Xem chi tiết <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-zinc-900 truncate text-sm">
                        {style.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="h-3 w-3" />
                          {formatDuration(style.duration)}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full border font-medium",
                            DIFFICULTY_CONFIG[style.difficulty]?.color
                          )}
                        >
                          {DIFFICULTY_CONFIG[style.difficulty]?.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-zinc-400">
                <Scissors className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>Không có kiểu tóc nào trong danh mục này.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedStyle && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStyle(null)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />

            {/* panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl overflow-hidden md:w-[680px] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex flex-col md:flex-row">
                {/* image */}
                <div className="relative md:w-64 h-72 md:h-auto shrink-0 bg-zinc-100">
                  <img
                    src={selectedStyle.imageUrl}
                    alt={selectedStyle.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* content */}
                <div className="flex-1 p-6 flex flex-col">
                  {/* close */}
                  <button
                    onClick={() => setSelectedStyle(null)}
                    className="self-end -mt-1 -mr-1 mb-3 p-1.5 rounded-full hover:bg-zinc-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-zinc-500" />
                  </button>

                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-xs text-zinc-400 uppercase tracking-wider">
                        {CATEGORY_LABELS[selectedStyle.category] ?? selectedStyle.category}
                      </span>
                      <h2
                        className="text-2xl font-bold text-zinc-900 mt-0.5"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {selectedStyle.name}
                      </h2>
                    </div>
                    <span className="shrink-0 bg-amber-400 text-zinc-900 font-bold px-3 py-1.5 rounded-xl text-sm">
                      {formatPrice(selectedStyle.price)}
                    </span>
                  </div>

                  <p className="text-zinc-600 text-sm leading-relaxed mb-5">
                    {selectedStyle.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
                      <Clock className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm text-zinc-700 font-medium">
                        {formatDuration(selectedStyle.duration)}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 border rounded-xl px-3 py-2 text-sm font-medium",
                        DIFFICULTY_CONFIG[selectedStyle.difficulty]?.color
                      )}
                    >
                      <Scissors className="h-4 w-4" />
                      {DIFFICULTY_CONFIG[selectedStyle.difficulty]?.label}
                    </div>
                    {selectedStyle.stylistIds.length > 0 && (
                      <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-3 py-2 text-sm font-medium">
                        <Star className="h-4 w-4" />
                        {selectedStyle.stylistIds.length} thợ chuyên
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <Link
                      href="/booking"
                      className="block w-full bg-zinc-900 hover:bg-zinc-800 text-white text-center font-semibold py-3 rounded-2xl transition-colors text-sm"
                    >
                      Đặt lịch ngay →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}