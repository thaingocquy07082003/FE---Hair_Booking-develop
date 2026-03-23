"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, Sparkles, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { getCookie } from "@/lib/cookie";
import api from "@/lib/axios";

// ── Types ────────────────────────────────────────────────────────────────────

interface Hairstyle {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  category: string;
  difficulty: string;
  isActive: boolean;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useHairstyles() {
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("http://localhost:3002/api/v1/hairstyles?isActive=true&limit=50")
      .then((res) => setHairstyles(res.data?.data ?? []))
      .catch(() => toast.error("Không thể tải danh sách kiểu tóc"))
      .finally(() => setLoading(false));
  }, []);

  return { hairstyles, loading };
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Glowing animated merge effect shown while waiting */
function MergeLoader({
  userPhoto,
  hairstyle,
}: {
  userPhoto: string;
  hairstyle: Hairstyle;
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-particle"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: i % 2 === 0 ? "#c8a96e" : "#e8c98a",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Two images merging */}
      <div className="relative flex items-center justify-center w-full h-full">
        {/* User photo – slides from left */}
        <div
          className="absolute w-36 h-44 rounded-2xl overflow-hidden shadow-2xl animate-slide-from-left"
          style={{ left: "10%", border: "2px solid rgba(200,169,110,0.4)" }}
        >
          <Image src={userPhoto} alt="Bạn" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(10,10,15,0.6)]" />
        </div>

        {/* Center glow orb */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-[#c8a96e]/20 border border-[#c8a96e]/40 flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-7 h-7 text-[#c8a96e] animate-spin-slow" />
          </div>
          <p className="text-[#c8a96e] text-xs font-semibold tracking-[0.2em] uppercase">
            Đang tạo...
          </p>
        </div>

        {/* Hairstyle image – slides from right */}
        <div
          className="absolute w-36 h-44 rounded-2xl overflow-hidden shadow-2xl animate-slide-from-right"
          style={{ right: "10%", border: "2px solid rgba(200,169,110,0.4)" }}
        >
          <Image
            src={hairstyle.imageUrl}
            alt={hairstyle.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[rgba(10,10,15,0.6)]" />
        </div>

        {/* Connection lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none animate-pulse"
          style={{ opacity: 0.3 }}
        >
          <line
            x1="30%"
            y1="50%"
            x2="70%"
            y2="50%"
            stroke="#c8a96e"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
    </div>
  );
}

/** Horizontal scroll hairstyle selector */
function HairstyleSelector({
  hairstyles,
  selected,
  onSelect,
  loading,
}: {
  hairstyles: Hairstyle[];
  selected: Hairstyle | null;
  onSelect: (h: Hairstyle) => void;
  loading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-36 h-48 rounded-2xl bg-[#1a1a24] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-[#1a1a24] border border-[#2a2a36] flex items-center justify-center hover:border-[#c8a96e]/50 transition-colors shadow-lg"
      >
        <ChevronLeft className="w-4 h-4 text-[#c8a96e]" />
      </button>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {hairstyles.map((h) => {
          const isSelected = selected?.id === h.id;
          return (
            <button
              key={h.id}
              onClick={() => onSelect(h)}
              className="flex-shrink-0 w-36 group relative rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                border: isSelected
                  ? "2px solid #c8a96e"
                  : "2px solid transparent",
                boxShadow: isSelected ? "0 0 20px rgba(200,169,110,0.3)" : "none",
              }}
            >
              <div className="relative h-44 w-full">
                <Image
                  src={h.imageUrl}
                  alt={h.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

                {/* Selected badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#c8a96e] flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#0a0a0f]" />
                  </div>
                )}

                {/* Name */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                    {h.name}
                  </p>
                  <p className="text-[#c8a96e] text-[10px] mt-0.5">
                    {h.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-[#1a1a24] border border-[#2a2a36] flex items-center justify-center hover:border-[#c8a96e]/50 transition-colors shadow-lg"
      >
        <ChevronRight className="w-4 h-4 text-[#c8a96e]" />
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TryHairstylePage() {
  const { hairstyles, loading: stylesLoading } = useHairstyles();
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ chấp nhận file ảnh");
      return;
    }
    setUserFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setUserPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
    setResultUrl(null); // reset result when new photo picked
  };

  const handleTryOn = async () => {
    if (!userFile) { toast.error("Vui lòng tải ảnh lên"); return; }
    if (!selectedHairstyle) { toast.error("Vui lòng chọn kiểu tóc"); return; }

    const token = getCookie("accessToken");
    if (!token) { toast.error("Vui lòng đăng nhập để sử dụng tính năng này"); return; }

    try {
      setIsProcessing(true);
      setResultUrl(null);

      const formData = new FormData();
      formData.append("hairstyleId", selectedHairstyle.id);
      formData.append("userPhoto", userFile);

      const response = await api.post(
        "http://localhost:3002/api/v1/hairstyles/try-on",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 600000, // 5 minutes – AI image processing takes time
        }
      );

      const resultImageUrl = response.data?.data?.resultImageUrl;
      if (resultImageUrl) {
        setResultUrl(resultImageUrl);
        toast.success("Hoàn tất! Kiểu tóc của bạn đã sẵn sàng ✨");
      } else {
        toast.error("Không nhận được kết quả từ máy chủ");
      }
    } catch (err: any) {
      const msg =
        err.code === "ECONNABORTED"
          ? "Yêu cầu quá lâu. Vui lòng thử lại, đảm bảo hình ảnh chất lượng cao"
          : err.response?.status === 499
          ? "Máy chủ bận. Vui lòng thử lại sau vài phút"
          : err.response?.data?.message ||
            err.response?.data?.error ||
            "Có lỗi xảy ra khi xử lý ảnh";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const canTryOn = !!userFile && !!selectedHairstyle && !isProcessing;

  return (
    <>
      {/* ── Global animation styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50%       { transform: translateY(-12px) scale(1.2); opacity: 1; }
        }
        @keyframes slide-from-left {
          0%   { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-from-right {
          0%   { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(200,169,110,0.2); }
          50%       { box-shadow: 0 0 30px rgba(200,169,110,0.6); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes result-reveal {
          0%   { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-float-particle  { animation: float-particle ease-in-out infinite; }
        .animate-slide-from-left { animation: slide-from-left 0.6s ease-out forwards; }
        .animate-slide-from-right{ animation: slide-from-right 0.6s ease-out forwards; }
        .animate-pulse-glow      { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-spin-slow       { animation: spin-slow 3s linear infinite; }
        .animate-result-reveal   { animation: result-reveal 0.5s ease-out forwards; }

        .shimmer-text {
          background: linear-gradient(90deg, #c8a96e 0%, #f5dfa0 40%, #c8a96e 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2.5s linear infinite;
        }

        .upload-zone:hover .upload-icon { transform: translateY(-4px); }
        .upload-icon { transition: transform 0.3s ease; }

        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        className="font-body min-h-screen"
        style={{ background: "#0a0a0f", color: "#e8e8f0" }}
      >
        {/* ── Header ── */}
        <div className="text-center pt-12 pb-8 px-4">
          <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase mb-3 font-semibold">
            AI-Powered
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-3">
            Thử Kiểu Tóc
          </h1>
          <p className="text-[#6b6b80] text-sm max-w-md mx-auto leading-relaxed">
            Tải ảnh của bạn lên, chọn kiểu tóc yêu thích và để AI biến đổi ngoại hình của bạn
          </p>
        </div>

        {/* ── Main layout ── */}
        <div className="max-w-5xl mx-auto px-4 pb-16">

          {/* ── Row 1: Two panels ── */}
          <div className="grid md:grid-cols-2 gap-5 mb-6">

            {/* Panel A: Upload */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: "#12121a", border: "1px solid #1e1e2a" }}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-5 rounded-full bg-[#c8a96e]" />
                  <h2 className="font-display text-lg text-white">Ảnh của bạn</h2>
                </div>

                {/* Upload area */}
                <div
                  className="upload-zone relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                  style={{
                    background: userPhoto ? "transparent" : "#0e0e18",
                    border: userPhoto
                      ? "1px solid #2a2a36"
                      : "2px dashed #2a2a36",
                  }}
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                >
                  {userPhoto ? (
                    <>
                      <Image
                        src={userPhoto}
                        alt="Ảnh của bạn"
                        fill
                        className="object-cover"
                      />
                      {/* Remove button */}
                      {!isProcessing && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserPhoto(null);
                            setUserFile(null);
                            setResultUrl(null);
                          }}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-white" />
                        </button>
                      )}
                      {/* Re-upload overlay */}
                      {!isProcessing && (
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                          <p className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                            Đổi ảnh
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div
                        className="upload-icon w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: "#1a1a24", border: "1px solid #2a2a36" }}
                      >
                        <Upload className="w-6 h-6 text-[#c8a96e]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[#a0a0b8] text-sm font-medium">
                          Nhấn để tải ảnh lên
                        </p>
                        <p className="text-[#4a4a5a] text-xs mt-1">JPG, PNG · Tối đa 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Panel B: Result */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: "#12121a", border: "1px solid #1e1e2a" }}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-5 rounded-full bg-[#c8a96e]" />
                  <h2 className="font-display text-lg text-white">Kết quả</h2>
                  {resultUrl && (
                    <span className="ml-auto text-[10px] text-[#c8a96e] tracking-widest uppercase">
                      AI Generated
                    </span>
                  )}
                </div>

                <div
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden"
                  style={{
                    background: "#0e0e18",
                    border: "1px solid #1e1e2a",
                  }}
                >
                  {isProcessing && userPhoto && selectedHairstyle ? (
                    <MergeLoader userPhoto={userPhoto} hairstyle={selectedHairstyle} />
                  ) : resultUrl ? (
                    <div className="animate-result-reveal w-full h-full relative">
                      <Image
                        src={resultUrl}
                        alt="Kết quả"
                        fill
                        className="object-cover"
                      />
                      {/* Gold glow border */}
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{ boxShadow: "inset 0 0 40px rgba(200,169,110,0.15)" }}
                      />
                      {/* Download hint */}
                      <a
                        href={resultUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                        style={{
                          background: "rgba(10,10,15,0.7)",
                          border: "1px solid rgba(200,169,110,0.3)",
                          color: "#c8a96e",
                          backdropFilter: "blur(8px)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Xem ảnh gốc ↗
                      </a>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="grid grid-cols-3 gap-1 opacity-10">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="w-4 h-4 rounded-sm bg-[#c8a96e]" />
                        ))}
                      </div>
                      <p className="text-[#3a3a4a] text-sm text-center px-8">
                        {userPhoto && selectedHairstyle
                          ? 'Nhấn "Try This Hairstyle" để bắt đầu'
                          : "Tải ảnh và chọn kiểu tóc để xem kết quả"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 2: Hairstyle selector ── */}
          <div
            className="rounded-3xl p-5 mb-6"
            style={{ background: "#12121a", border: "1px solid #1e1e2a" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-[#c8a96e]" />
                <h2 className="font-display text-lg text-white">Chọn kiểu tóc</h2>
              </div>
              {selectedHairstyle && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: "rgba(200,169,110,0.1)",
                    border: "1px solid rgba(200,169,110,0.3)",
                    color: "#c8a96e",
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  {selectedHairstyle.name}
                </div>
              )}
            </div>

            <HairstyleSelector
              hairstyles={hairstyles}
              selected={selectedHairstyle}
              onSelect={setSelectedHairstyle}
              loading={stylesLoading}
            />
          </div>

          {/* ── CTA Button ── */}
          <div className="flex justify-center">
            <button
              onClick={handleTryOn}
              disabled={!canTryOn}
              className="relative group overflow-hidden rounded-2xl px-10 py-4 font-semibold text-base transition-all duration-300"
              style={{
                background: canTryOn
                  ? "linear-gradient(135deg, #c8a96e 0%, #e8c98a 50%, #c8a96e 100%)"
                  : "#1a1a24",
                color: canTryOn ? "#0a0a0f" : "#3a3a4a",
                border: canTryOn ? "none" : "1px solid #2a2a36",
                cursor: canTryOn ? "pointer" : "not-allowed",
                boxShadow: canTryOn ? "0 8px 32px rgba(200,169,110,0.35)" : "none",
              }}
            >
              {/* Shimmer on hover */}
              {canTryOn && (
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
                  }}
                />
              )}

              <span className="relative flex items-center gap-3">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Try This Hairstyle</span>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* ── Processing note ── */}
          {isProcessing && (
            <p className="text-center text-[#4a4a5a] text-xs mt-4 animate-pulse">
              AI đang phân tích và tạo ảnh · Có thể mất 30–60 giây
            </p>
          )}

          {/* ── Conditions hint ── */}
          {!userPhoto && !selectedHairstyle && (
            <div className="flex items-center justify-center gap-6 mt-8">
              {[
                { step: "01", label: "Tải ảnh khuôn mặt" },
                { step: "02", label: "Chọn kiểu tóc" },
                { step: "03", label: "Nhận kết quả AI" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#c8a96e", opacity: 0.6 }}
                  >
                    {item.step}
                  </span>
                  <span className="text-[#3a3a4a] text-xs">{item.label}</span>
                  {i < 2 && (
                    <span className="text-[#2a2a36] text-xs ml-1">→</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}