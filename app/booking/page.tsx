"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronRight, ChevronLeft, Clock, Scissors,
  User, CalendarDays, Phone, StickyNote, Star,
  Loader2, CheckCircle2, QrCode, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { createAppointment } from "@/services/appointment/appointment";
import { getAllStylists } from "@/services/stylist/stylist.api";
import { getCookie } from "@/lib/cookie";
import axios from "axios";

interface HairStyle {
  id: string; name: string; description: string; price: number;
  duration: number; imageUrl: string; category: string;
  difficulty: "easy" | "medium" | "hard"; stylistIds: string[];
}
interface Stylist {
  id: string; fullName: string; avatarUrl: string | null;
  experience: number; rating: number; totalBookings: number;
  specialties: string[]; isAvailable: boolean;
}
interface Slot { startTime: string; endTime: string; isAvailable: boolean; duration: number; }
interface StylistSlots { stylistId: string; stylistName: string; date: string; slots: Slot[]; }

const CATEGORY_LABELS: Record<string, string> = {
  all: "Tất cả", men_short: "Nam ngắn", women_short: "Nữ ngắn",
  women_long: "Nữ dài", kids: "Trẻ em", beard: "Râu", coloring: "Nhuộm", perm: "Uốn / Duỗi",
};
const DIFFICULTY_CONFIG = {
  easy:   { label: "Đơn giản",   color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  medium: { label: "Trung bình", color: "text-amber-600 bg-amber-50 border-amber-200" },
  hard:   { label: "Phức tạp",   color: "text-rose-600 bg-rose-50 border-rose-200" },
};

function formatPrice(p: number) { return p.toLocaleString("vi-VN") + "đ"; }
function formatDuration(m: number) {
  if (m < 60) return `${m} phút`;
  const h = Math.floor(m / 60); const min = m % 60;
  return min > 0 ? `${h}g ${min}p` : `${h} giờ`;
}
// ✅ Fix timezone
function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
// ✅ Generate mã thanh toán 16 ký tự
function generatePaymentCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 16 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
}

const STEPS = [
  { id: 1, label: "Kiểu tóc" }, { id: 2, label: "Thợ cắt" },
  { id: 3, label: "Lịch hẹn" }, { id: 4, label: "Xác nhận" },
];
const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  });
}

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [hairstyles, setHairstyles] = useState<HairStyle[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [availableTimes, setAvailableTimes] = useState<Slot[]>([]);
  const [loadingStyles, setLoadingStyles] = useState(true);
  const [loadingStylists, setLoadingStylists] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // ✅ QR Payment state
  const [showQR, setShowQR] = useState(false);
  const [paymentCode, setPaymentCode] = useState("");
  const [checkingPayment, setCheckingPayment] = useState(false);

  const [selectedStyle, setSelectedStyle] = useState<HairStyle | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [notes, setNotes] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // ✅ Load phone từ cookie userPhone
  useEffect(() => {
    const savedPhone = getCookie("userPhone");
    if (savedPhone && savedPhone !== "null" && savedPhone !== "") {
      setPhone(savedPhone);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingStyles(true);
      try {
        const res = await api.get("http://localhost:3002/api/v1/hairstyles");
        const data = res.data?.data ?? res.data;
        setHairstyles(Array.isArray(data) ? data : []);
      } catch { toast.error("Không thể tải danh sách kiểu tóc"); }
      finally { setLoadingStyles(false); }
    })();
  }, []);

  useEffect(() => {
    if (step !== 2) return;
    (async () => {
      setLoadingStylists(true);
      try {
        const data: Stylist[] = await getAllStylists();
        const filtered = selectedStyle && selectedStyle.stylistIds.length > 0
          ? data.filter((s) => selectedStyle.stylistIds.includes(s.id)) : data;
        setStylists(filtered);
      } catch { toast.error("Không thể tải danh sách thợ"); }
      finally { setLoadingStylists(false); }
    })();
  }, [step]);

  useEffect(() => {
    if (!selectedDate) return;
    (async () => {
      setLoadingTimes(true); setSelectedTime(null);
      try {
        const dateStr = formatLocalDate(selectedDate); // ✅ Fix timezone
        const res = await api.get(`http://localhost:3003/api/v1/availability/slots?date=${dateStr}`);
        const allStylistSlots: StylistSlots[] = res.data?.data ?? [];
        if (!selectedStylist?.id) {
          const merged = new Map<string, Slot>();
          allStylistSlots.forEach((s) => s.slots.forEach((slot) => {
            const existing = merged.get(slot.startTime);
            if (!existing || slot.isAvailable) merged.set(slot.startTime, slot);
          }));
          setAvailableTimes(Array.from(merged.values()).sort((a, b) => a.startTime.localeCompare(b.startTime)));
        } else {
          const found = allStylistSlots.find((s) => s.stylistId === selectedStylist.id);
          setAvailableTimes(found?.slots ?? []);
        }
      } catch { toast.error("Không thể tải khung giờ. Vui lòng thử lại."); setAvailableTimes([]); }
      finally { setLoadingTimes(false); }
    })();
  }, [selectedDate, selectedStylist]);

  // ✅ Tạo appointment rồi hiện QR
  const handleSubmit = async () => {
    if (!selectedStyle || !selectedDate || !selectedTime || !phone) {
      toast.error("Vui lòng điền đầy đủ thông tin"); return;
    }
    setSubmitting(true);
    try {
      const [h, m] = selectedTime.split(":").map(Number);
      const dt = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), h, m, 0, 0);
      await createAppointment({
        branchId: "", serviceId: selectedStyle.id, phone, date: dt,
        notes, username, hairStylistId: selectedStylist?.id || undefined,
      });
      const code = generatePaymentCode();
      setPaymentCode(code);
      setShowQR(true);
    } catch { toast.error("Đặt lịch thất bại. Vui lòng thử lại."); }
    finally { setSubmitting(false); }
  };

  // ✅ Kiểm tra thanh toán
  const handleCheckPayment = async () => {
    setCheckingPayment(true);
    try {
      const res = await api.get(`http://localhost:3003/api/v1/payment/check?content=${paymentCode}`);
      if (res.data?.found === true) {
        // ✅ Tạo lịch hẹn sau khi thanh toán thành công
        const token = getCookie("accessToken");
        const userId = getCookie("userId");
        const userEmail = getCookie("userEmail");
        const userName = getCookie("userFullName");

        await axios.post(
          "http://localhost:3003/api/v1/appointments",
          {
            customerId:    userId ?? "",
            stylistId:     selectedStylist?.id ?? "",
            hairstyleId:   selectedStyle?.id ?? "",
            appointmentDate: selectedDate ? formatLocalDate(selectedDate) : "",
            startTime:     selectedTime ?? "",
            duration:      selectedStyle?.duration ?? 60,
            customerName:  userName ?? username,
            customerPhone: phone,
            customerEmail: userEmail ?? "",
            notes,
            price:         selectedStyle?.price ?? 0,
            depositAmount,
            depositPaid:   true,
          },
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        setShowQR(false);
        setDone(true);
        toast.success("Thanh toán thành công!");
      } else {
        toast.error("Chưa nhận được thanh toán. Vui lòng thử lại sau.");
      }
    } catch {
      toast.error("Không thể kiểm tra thanh toán. Vui lòng thử lại.");
    } finally {
      setCheckingPayment(false);
    }
  };

  const canNext = () => {
    if (step === 1) return !!selectedStyle;
    if (step === 2) return !!selectedStylist;
    if (step === 3) return !!selectedDate && !!selectedTime;
    return true;
  };

  const categories = ["all", ...Array.from(new Set(hairstyles.map((h) => h.category)))];
  const filteredStyles = activeCategory === "all" ? hairstyles : hairstyles.filter((h) => h.category === activeCategory);
  const days = getNext7Days();
  const depositAmount = selectedStyle ? Math.round(selectedStyle.price * 0.3) : 0;
  const qrUrl = paymentCode
    ? `https://qr.sepay.vn/img?bank=VietinBank&acc=108873909069&template=compact&amount=${depositAmount}&des=SEVQR+${paymentCode}`
    : "";

  // ── Done ─────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            Đặt lịch thành công!
          </h2>
          <p className="text-zinc-500 text-sm mb-4">
            Chúng tôi sẽ liên hệ xác nhận qua số <span className="font-semibold text-zinc-800">{phone}</span>
          </p>
          <div className="bg-zinc-50 rounded-2xl p-4 mb-6 text-left space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Kiểu tóc</span>
              <span className="font-medium text-zinc-800">{selectedStyle?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Thợ cắt</span>
              <span className="font-medium text-zinc-800">{selectedStylist?.id ? selectedStylist.fullName : "Bất kỳ"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Thời gian</span>
              <span className="font-medium text-zinc-800">
                {selectedTime} — {selectedDate?.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Đã cọc</span>
              <span className="font-medium text-emerald-600">{formatPrice(depositAmount)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push("/appointments")}
              className="flex-1 bg-zinc-900 text-white py-3 rounded-2xl font-medium text-sm hover:bg-zinc-800 transition-colors">
              Xem lịch hẹn
            </button>
            <button onClick={() => router.push("/")}
              className="flex-1 border border-zinc-200 text-zinc-700 py-3 rounded-2xl font-medium text-sm hover:bg-zinc-50 transition-colors">
              Về trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      {/* Header */}
      <div className="bg-zinc-900 pt-10 pb-6 px-4">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Georgia', serif" }}>Đặt lịch</h1>
          </div>
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <button onClick={() => step > s.id && setStep(s.id)} className="flex flex-col items-center gap-1">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                    step === s.id ? "bg-amber-400 border-amber-400 text-zinc-900"
                    : step > s.id ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-transparent border-zinc-600 text-zinc-500")}>
                    {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                  </div>
                  <span className={cn("text-xs hidden sm:block", step === s.id ? "text-amber-400 font-medium" : "text-zinc-500")}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-px mx-2 transition-colors", step > s.id ? "bg-emerald-500" : "bg-zinc-700")} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8 px-4">
        <AnimatePresence mode="wait">

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <h2 className="text-xl font-bold text-zinc-900 mb-1">Chọn kiểu tóc</h2>
              <p className="text-sm text-zinc-500 mb-5">Chọn kiểu tóc bạn muốn thực hiện</p>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={cn("shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
                      activeCategory === cat ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400")}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </button>
                ))}
              </div>
              {loadingStyles ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden bg-white animate-pulse">
                      <div className="aspect-[3/4] bg-zinc-200" />
                      <div className="p-3 space-y-2"><div className="h-4 bg-zinc-200 rounded w-3/4" /><div className="h-3 bg-zinc-100 rounded w-1/2" /></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredStyles.map((style) => (
                    <div key={style.id} onClick={() => setSelectedStyle(style)}
                      className={cn("group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 transition-all duration-200 shadow-sm hover:shadow-md",
                        selectedStyle?.id === style.id ? "border-amber-400 shadow-amber-100 shadow-md" : "border-transparent hover:border-zinc-200")}>
                      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
                        <img src={style.imageUrl} alt={style.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        {selectedStyle?.id === style.id && (
                          <div className="absolute top-2 right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow">
                            <Check className="h-4 w-4 text-zinc-900" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <span className="text-white text-xs font-bold">{formatPrice(style.price)}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-zinc-900 text-sm truncate">{style.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-zinc-400"><Clock className="h-3 w-3" />{formatDuration(style.duration)}</span>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", DIFFICULTY_CONFIG[style.difficulty]?.color)}>
                            {DIFFICULTY_CONFIG[style.difficulty]?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <h2 className="text-xl font-bold text-zinc-900 mb-1">Chọn thợ cắt tóc</h2>
              <p className="text-sm text-zinc-500 mb-6">Thợ phù hợp với kiểu <span className="font-medium text-zinc-800">{selectedStyle?.name}</span></p>
              {loadingStylists ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 animate-pulse flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-zinc-200 shrink-0" />
                      <div className="flex-1 space-y-2 pt-1"><div className="h-4 bg-zinc-200 rounded w-3/4" /><div className="h-3 bg-zinc-100 rounded w-1/2" /></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div onClick={() => setSelectedStylist({ id: "", fullName: "Bất kỳ thợ nào", avatarUrl: null, experience: 0, rating: 0, totalBookings: 0, specialties: [], isAvailable: true })}
                    className={cn("cursor-pointer bg-white rounded-2xl p-4 border-2 transition-all flex items-center gap-4 shadow-sm",
                      selectedStylist?.id === "" ? "border-amber-400 shadow-amber-100 shadow-md" : "border-transparent hover:border-zinc-200")}>
                    <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center shrink-0"><User className="h-7 w-7 text-zinc-400" /></div>
                    <div className="flex-1"><p className="font-semibold text-zinc-800">Bất kỳ thợ nào</p><p className="text-xs text-zinc-400 mt-0.5">Chúng tôi sẽ sắp xếp phù hợp</p></div>
                    {selectedStylist?.id === "" && <Check className="h-5 w-5 text-amber-500 shrink-0" />}
                  </div>
                  {stylists.map((stylist) => (
                    <div key={stylist.id} onClick={() => stylist.isAvailable && setSelectedStylist(stylist)}
                      className={cn("bg-white rounded-2xl p-4 border-2 transition-all flex items-center gap-4 shadow-sm",
                        stylist.isAvailable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                        selectedStylist?.id === stylist.id ? "border-amber-400 shadow-amber-100 shadow-md" : "border-transparent hover:border-zinc-200")}>
                      <div className="relative shrink-0">
                        {stylist.avatarUrl ? (
                          <img src={stylist.avatarUrl} alt={stylist.fullName} className="w-14 h-14 rounded-full object-cover" />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center"><User className="h-7 w-7 text-zinc-400" /></div>
                        )}
                        {!stylist.isAvailable && (
                          <div className="absolute inset-0 rounded-full bg-white/60 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-zinc-500">Bận</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-zinc-800 truncate">{stylist.fullName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {stylist.rating > 0 && <span className="flex items-center gap-0.5 text-xs text-amber-500"><Star className="h-3 w-3 fill-amber-400" />{stylist.rating.toFixed(1)}</span>}
                          {stylist.experience > 0 && <span className="text-xs text-zinc-400">{stylist.experience} năm KN</span>}
                        </div>
                        {stylist.specialties?.length > 0 && <p className="text-xs text-zinc-400 truncate mt-0.5">{stylist.specialties.slice(0, 2).join(", ")}</p>}
                      </div>
                      {selectedStylist?.id === stylist.id && <Check className="h-5 w-5 text-amber-500 shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <h2 className="text-xl font-bold text-zinc-900 mb-1">Chọn thời gian</h2>
              <p className="text-sm text-zinc-500 mb-6">Chọn ngày và khung giờ phù hợp</p>
              <h3 className="text-sm font-semibold text-zinc-700 mb-3">Chọn ngày</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-7 scrollbar-hide">
                {days.map((day) => {
                  const isSelected = selectedDate?.toDateString() === day.toDateString();
                  const isToday = new Date().toDateString() === day.toDateString();
                  return (
                    <button key={day.toISOString()} onClick={() => setSelectedDate(day)}
                      className={cn("shrink-0 flex flex-col items-center py-3 px-4 rounded-2xl border-2 transition-all min-w-[64px]",
                        isSelected ? "bg-zinc-900 border-zinc-900 text-white" : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400")}>
                      <span className="text-[11px] text-zinc-400 mb-1">{isToday ? "Hôm nay" : DAY_LABELS[day.getDay()]}</span>
                      <span className="text-xl font-bold leading-none">{day.getDate()}</span>
                      <span className="text-[11px] text-zinc-400 mt-1">Th{day.getMonth() + 1}</span>
                    </button>
                  );
                })}
              </div>
              <h3 className="text-sm font-semibold text-zinc-700 mb-3">Chọn giờ</h3>
              {!selectedDate ? (
                <p className="text-sm text-zinc-400 italic">Vui lòng chọn ngày trước</p>
              ) : loadingTimes ? (
                <div className="flex items-center gap-2 text-sm text-zinc-400"><Loader2 className="h-4 w-4 animate-spin" /> Đang tải khung giờ...</div>
              ) : availableTimes.length === 0 ? (
                <p className="text-sm text-zinc-400 italic">Không có khung giờ nào cho ngày này</p>
              ) : (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableTimes.map((slot) => {
                      const isSel = selectedTime === slot.startTime;
                      const isBooked = !slot.isAvailable;
                      return (
                        <button key={slot.startTime} disabled={isBooked} onClick={() => !isBooked && setSelectedTime(slot.startTime)}
                          className={cn("relative py-2.5 px-2 rounded-xl text-sm font-medium border-2 transition-all flex flex-col items-center gap-0.5",
                            isBooked ? "bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed line-through"
                            : isSel ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                            : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:shadow-sm")}>
                          <span>{slot.startTime}</span>
                          <span className={cn("text-[10px]", isBooked ? "text-zinc-300" : "text-zinc-400")}>{slot.endTime}</span>
                          {isBooked && <span className="absolute -top-1.5 -right-1.5 bg-rose-100 text-rose-500 text-[9px] font-bold px-1 rounded-full border border-rose-200">Bận</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-zinc-400 mt-3 flex items-center gap-3">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border-2 border-zinc-200 inline-block" /> Còn trống</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-zinc-50 border-2 border-zinc-100 inline-block" /> Đã đặt</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-zinc-900 inline-block" /> Đang chọn</span>
                  </p>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.22 }}>
              <h2 className="text-xl font-bold text-zinc-900 mb-1">Xác nhận đặt lịch</h2>
              <p className="text-sm text-zinc-500 mb-6">Kiểm tra thông tin và để lại liên hệ</p>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Summary */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 space-y-4">
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Tóm tắt lịch hẹn</h3>
                  <div className="flex gap-3 items-start">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                      <img src={selectedStyle?.imageUrl} alt={selectedStyle?.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">{selectedStyle?.name}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{CATEGORY_LABELS[selectedStyle?.category ?? ""] ?? selectedStyle?.category}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm font-bold text-amber-600">{formatPrice(selectedStyle?.price ?? 0)}</span>
                        <span className="text-zinc-300">·</span>
                        <span className="text-xs text-zinc-400">{formatDuration(selectedStyle?.duration ?? 0)}</span>
                      </div>
                      {/* ✅ Hiển thị tiền cọc */}
                      <div className="mt-2 inline-flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                        <span className="text-xs text-amber-700 font-medium">Cọc 30%: {formatPrice(depositAmount)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-zinc-100 pt-3 space-y-2.5 text-sm">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-zinc-400 shrink-0" />
                      <span className="text-zinc-700">{selectedStylist?.id ? selectedStylist.fullName : "Bất kỳ thợ nào"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-zinc-400 shrink-0" />
                      <span className="text-zinc-700">
                        {selectedTime} — {selectedDate?.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Contact form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-700 mb-1.5 flex items-center gap-1.5">
                      <User className="h-4 w-4" /> Họ tên <span className="text-zinc-400 font-normal text-xs">(tùy chọn)</span>
                    </label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nguyễn Văn A"
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors bg-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="h-4 w-4" /> Số điện thoại <span className="text-red-400 text-xs">*</span>
                    </label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912 345 678"
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors bg-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700 mb-1.5 flex items-center gap-1.5">
                      <StickyNote className="h-4 w-4" /> Ghi chú <span className="text-zinc-400 font-normal text-xs">(tùy chọn)</span>
                    </label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="Yêu cầu đặc biệt, màu tóc mong muốn..." rows={4}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-900 transition-colors bg-white resize-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-zinc-200 px-4 py-4 z-20">
          <div className="container flex items-center gap-3">
            {selectedStyle && (
              <div className="hidden sm:flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-1.5 text-xs text-zinc-600 mr-auto">
                <Scissors className="h-3.5 w-3.5" />
                <span className="font-medium">{selectedStyle.name}</span>
                <span className="text-zinc-300">·</span>
                <span className="text-amber-600 font-bold">{formatPrice(selectedStyle.price)}</span>
              </div>
            )}
            <div className="flex gap-3 ml-auto">
              {step > 1 && (
                <button onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 transition-colors">
                  <ChevronLeft className="h-4 w-4" /> Quay lại
                </button>
              )}
              {step < 4 ? (
                <button disabled={!canNext()} onClick={() => setStep((s) => s + 1)}
                  className={cn("flex items-center gap-1.5 px-6 py-2.5 rounded-2xl text-sm font-medium transition-all",
                    canNext() ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg" : "bg-zinc-200 text-zinc-400 cursor-not-allowed")}>
                  Tiếp theo <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button disabled={!phone || submitting} onClick={handleSubmit}
                  className={cn("flex items-center gap-2 px-7 py-2.5 rounded-2xl text-sm font-semibold transition-all",
                    phone && !submitting ? "bg-amber-400 text-zinc-900 hover:bg-amber-500 shadow-lg" : "bg-zinc-200 text-zinc-400 cursor-not-allowed")}>
                  {submitting
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang đặt...</>
                    : <><CheckCircle2 className="h-4 w-4" /> Xác nhận đặt lịch</>}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="h-24" />
      </div>

      {/* ✅ QR Payment Modal */}
      <AnimatePresence>
        {showQR && (
          <>
            <motion.div key="qr-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
            <motion.div key="qr-modal"
              initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl p-7 max-w-sm mx-auto">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <QrCode className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900">Thanh toán đặt cọc</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Quét mã QR để cọc <span className="font-semibold text-amber-600">{formatPrice(depositAmount)}</span>
                  <span className="text-zinc-400"> (30% giá trị dịch vụ)</span>
                </p>
              </div>
              {/* QR Image */}
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <img src={qrUrl} alt="QR thanh toán" className="w-52 h-52 object-contain rounded-xl" />
                </div>
              </div>
              {/* Payment code */}
              <div className="bg-zinc-50 rounded-xl p-3 mb-5 text-center">
                <p className="text-xs text-zinc-400 mb-1">Mã thanh toán (nội dung chuyển khoản)</p>
                <p className="font-mono font-bold text-zinc-800 tracking-widest text-sm">{paymentCode}</p>
              </div>
              {/* Bank info */}
              <div className="space-y-1.5 mb-5 text-xs text-zinc-500">
                <div className="flex justify-between">
                  <span>Ngân hàng</span><span className="font-medium text-zinc-700">VietinBank</span>
                </div>
                <div className="flex justify-between">
                  <span>Số tài khoản</span><span className="font-medium text-zinc-700">108873909069</span>
                </div>
                <div className="flex justify-between">
                  <span>Số tiền cọc</span><span className="font-semibold text-amber-600">{formatPrice(depositAmount)}</span>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex gap-2">
                <button onClick={() => { setShowQR(false); setDone(true); }}
                  className="flex-1 py-3 rounded-2xl border border-zinc-200 text-zinc-600 text-sm font-medium hover:bg-zinc-50 transition-colors">
                  Bỏ qua
                </button>
                <button onClick={handleCheckPayment} disabled={checkingPayment}
                  className={cn("flex-1 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                    checkingPayment ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg")}>
                  {checkingPayment
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang kiểm tra...</>
                    : <><RefreshCw className="h-4 w-4" /> Đã thanh toán</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}