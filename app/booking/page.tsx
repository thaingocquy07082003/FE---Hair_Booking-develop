"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogIn,
  Scissors,
  UserPlus,
  User,
  Star,
  Banknote,
  CreditCard,
  CalendarDays,
  Phone,
  Mail,
  StickyNote,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { getCookie } from "@/lib/cookie";

// ── Mock data (thay bằng API call sau) ────────────────────────────────────────
const MOCK_STYLISTS = [
  {
    id: "54c2bf65-bc83-4b55-bbcc-da9ab2b1d368",
    name: "Thợ cắt tóc 01",
    rating: 4.5,
    experience: 3,
    specialties: ["Cắt tóc nam", "Uốn tóc"],
    avatarUrl: null,
  },
  {
    id: "e8c3abd5-7e7c-49f0-b249-93d09238af98",
    name: "Thợ cắt tóc 02",
    rating: 4.2,
    experience: 2,
    specialties: ["Cắt tóc nữ", "Nhuộm tóc"],
    avatarUrl: null,
  },
  {
    id: "587424f6-a936-47ea-a2ed-918b1c4d0883",
    name: "Thợ cắt tóc 03",
    rating: 0,
    experience: 0,
    specialties: ["Cắt tóc trẻ em"],
    avatarUrl: null,
  },
];

const MOCK_HAIRSTYLES = [
  {
    id: "5d2be747-b893-432d-a25b-48c7584b2148",
    name: "Cắt ngắn undercut",
    duration: 45,
    price: 150000,
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Uốn xoăn tự nhiên",
    duration: 90,
    price: 350000,
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    name: "Nhuộm highlight",
    duration: 120,
    price: 500000,
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    name: "Duỗi phục hồi",
    duration: 150,
    price: 600000,
  },
];

const TIME_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

function StylistAvatar({ avatarUrl, name }: { avatarUrl: string | null; name: string }) {
  if (avatarUrl)
    return <img src={avatarUrl} alt={name} className="h-12 w-12 rounded-full object-cover" />;
  return (
    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
      <User className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  if (rating === 0) return <span className="text-xs text-muted-foreground">Chưa có đánh giá</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star
          key={s}
          className="h-3 w-3"
          fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

// ── Inline mini-calendar ──────────────────────────────────────────────────────
function MiniCalendar({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="rounded-xl border bg-card p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold">
          {format(viewMonth, "MMMM yyyy", { locale: vi })}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const isPast = isBefore(date, today);
          const isSelected =
            selected && format(date, "yyyy-MM-dd") === format(selected, "yyyy-MM-dd");
          const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(date)}
              className={cn(
                "h-8 w-full rounded-lg text-sm transition-colors",
                isPast && "text-muted-foreground/40 cursor-not-allowed",
                !isPast && !isSelected && "hover:bg-muted",
                isToday && !isSelected && "font-semibold text-primary",
                isSelected && "bg-primary text-primary-foreground font-semibold"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = ["Kiểu tóc", "Thợ & Ngày giờ", "Thông tin", "Xác nhận"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 w-full max-w-lg mx-auto mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all",
                  done && "bg-primary border-primary text-primary-foreground",
                  active && "border-primary text-primary bg-background",
                  !done && !active && "border-muted text-muted-foreground bg-background"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium whitespace-nowrap",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-1 mb-4 transition-all",
                  done ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Form state
  const [selectedHairstyle, setSelectedHairstyle] = useState<(typeof MOCK_HAIRSTYLES)[0] | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<(typeof MOCK_STYLISTS)[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState(getCookie("userFullName") ?? "");
  const [customerPhone, setCustomerPhone] = useState(getCookie("userPhone") ?? "");
  const [customerEmail, setCustomerEmail] = useState(getCookie("userEmail") ?? "");
  const [notes, setNotes] = useState("");
  const [depositPaid, setDepositPaid] = useState(false);

  const depositAmount = selectedHairstyle ? Math.round(selectedHairstyle.price * 0.25) : 0;

  const canNextStep0 = !!selectedHairstyle;
  const canNextStep1 = !!selectedStylist && !!selectedDate && !!selectedTime;
  const canNextStep2 = customerName.trim().length >= 2 && customerPhone.trim().length >= 10;

  // ── Not logged in ──
  if (!isAuthenticated) {
    return (
      <div className="container py-20 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Đặt lịch cắt tóc</h1>
            <p className="text-muted-foreground mt-2">
              Vui lòng đăng nhập để tiếp tục đặt lịch
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/auth/login">
                <LogIn className="h-4 w-4 mr-2" />
                Đăng nhập
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Đăng ký
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Booking complete ──
  if (isComplete) {
    return (
      <div className="container py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Đặt lịch thành công!</h1>
            <p className="text-muted-foreground mt-2">
              Chúng tôi đã nhận yêu cầu và sẽ xác nhận qua email sớm nhất.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5 text-left space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kiểu tóc</span>
              <span className="font-medium">{selectedHairstyle?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thợ cắt</span>
              <span className="font-medium">{selectedStylist?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày</span>
              <span className="font-medium">
                {selectedDate && format(selectedDate, "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giờ</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-muted-foreground">Tổng tiền</span>
              <span className="font-semibold">{formatVND(selectedHairstyle?.price ?? 0)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="flex-1" asChild>
              <Link href="/appointments">Xem lịch hẹn</Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/">Trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Đặt lịch cắt tóc</h1>
          <p className="text-muted-foreground mt-2">Chọn kiểu tóc, thợ và thời gian phù hợp</p>
        </div>

        <StepBar current={step} />

        {/* ── Step 0: Chọn kiểu tóc ── */}
        {step === 0 && (
          <div className="space-y-6">
            <Section title="Chọn kiểu tóc">
              <div className="grid gap-3 sm:grid-cols-2">
                {MOCK_HAIRSTYLES.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setSelectedHairstyle(h)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all hover:border-primary/60 hover:bg-muted/30",
                      selectedHairstyle?.id === h.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Scissors className="h-4 w-4 text-primary shrink-0" />
                          <p className="font-semibold text-sm">{h.name}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {h.duration} phút
                          </span>
                          <span className="flex items-center gap-1">
                            <Banknote className="h-3 w-3" />
                            {formatVND(h.price)}
                          </span>
                        </div>
                      </div>
                      {selectedHairstyle?.id === h.id && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Section>

            <div className="flex justify-end">
              <Button onClick={() => setStep(1)} disabled={!canNextStep0} className="min-w-32">
                Tiếp theo
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 1: Thợ & Ngày giờ ── */}
        {step === 1 && (
          <div className="space-y-6">
            <Section title="Chọn thợ cắt tóc">
              <div className="grid gap-3 sm:grid-cols-3">
                {MOCK_STYLISTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedStylist(s)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all hover:border-primary/60",
                      selectedStylist?.id === s.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <StylistAvatar avatarUrl={s.avatarUrl} name={s.name} />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{s.name}</p>
                        <StarRow rating={s.rating} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.specialties.map((sp) => (
                        <span
                          key={sp}
                          className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Chọn ngày">
              <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} />
            </Section>

            <Section title="Chọn giờ">
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={cn(
                      "rounded-lg border py-2 text-sm font-medium transition-all",
                      selectedTime === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border bg-card hover:border-primary/60 hover:bg-muted/30"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Section>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Quay lại
              </Button>
              <Button onClick={() => setStep(2)} disabled={!canNextStep1} className="min-w-32">
                Tiếp theo
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Thông tin khách hàng ── */}
        {step === 2 && (
          <div className="space-y-6">
            <Section title="Thông tin liên hệ">
              <div className="rounded-xl border bg-card p-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="cname" className="text-sm">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cname"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cphone" className="text-sm">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cphone"
                        value={customerPhone}
                        onChange={(e) =>
                          setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                        }
                        placeholder="0912345678"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cemail" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cemail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-sm">Ghi chú</Label>
                  <div className="relative">
                    <StickyNote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ví dụ: Khách muốn cắt ngắn hai bên..."
                      className="pl-9 resize-none min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Đặt cọc">
              <div className="rounded-xl border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tổng tiền dịch vụ</span>
                  <span className="font-semibold">{formatVND(selectedHairstyle?.price ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tiền cọc (25%)</span>
                  <span className="font-semibold text-amber-600">{formatVND(depositAmount)}</span>
                </div>
                <div className="border-t pt-3">
                  <button
                    type="button"
                    onClick={() => setDepositPaid((v) => !v)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg border p-3 text-sm transition-all",
                      depositPaid
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-border hover:border-primary/60"
                    )}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded flex items-center justify-center shrink-0 border-2 transition-all",
                        depositPaid
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-muted-foreground"
                      )}
                    >
                      {depositPaid && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <CreditCard className="h-4 w-4 shrink-0" />
                    <span className="font-medium">Tôi đồng ý đặt cọc {formatVND(depositAmount)}</span>
                  </button>
                </div>
              </div>
            </Section>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Quay lại
              </Button>
              <Button onClick={() => setStep(3)} disabled={!canNextStep2} className="min-w-32">
                Xem lại
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Xác nhận ── */}
        {step === 3 && (
          <div className="space-y-6">
            <Section title="Xác nhận thông tin đặt lịch">
              <div className="rounded-xl border bg-card divide-y">
                {/* Kiểu tóc */}
                <div className="flex items-start gap-3 p-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Scissors className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Kiểu tóc</p>
                    <p className="font-semibold text-sm">{selectedHairstyle?.name}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span>{selectedHairstyle?.duration} phút</span>
                      <span>{formatVND(selectedHairstyle?.price ?? 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Thợ */}
                <div className="flex items-start gap-3 p-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Thợ cắt tóc</p>
                    <p className="font-semibold text-sm">{selectedStylist?.name}</p>
                  </div>
                </div>

                {/* Ngày giờ */}
                <div className="flex items-start gap-3 p-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Ngày & Giờ</p>
                    <p className="font-semibold text-sm">
                      {selectedDate && format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
                      {" · "}
                      {selectedTime}
                    </p>
                  </div>
                </div>

                {/* Khách hàng */}
                <div className="flex items-start gap-3 p-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Thông tin liên hệ</p>
                    <p className="font-semibold text-sm">{customerName}</p>
                    <p className="text-xs text-muted-foreground">{customerPhone}</p>
                    {customerEmail && (
                      <p className="text-xs text-muted-foreground">{customerEmail}</p>
                    )}
                  </div>
                </div>

                {/* Ghi chú */}
                {notes && (
                  <div className="flex items-start gap-3 p-4">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <StickyNote className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Ghi chú</p>
                      <p className="text-sm">{notes}</p>
                    </div>
                  </div>
                )}

                {/* Thanh toán */}
                <div className="p-4 bg-muted/30">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Tổng tiền</span>
                    <span className="font-semibold">{formatVND(selectedHairstyle?.price ?? 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Đặt cọc</span>
                    <span
                      className={cn(
                        "font-semibold",
                        depositPaid ? "text-emerald-600" : "text-muted-foreground"
                      )}
                    >
                      {depositPaid ? `${formatVND(depositAmount)} ✓` : "Không đặt cọc"}
                    </span>
                  </div>
                </div>
              </div>
            </Section>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Quay lại
              </Button>
              <Button
                onClick={() => {
                  // TODO: gọi API tại đây
                  setIsComplete(true);
                }}
                className="min-w-40"
              >
                <Check className="mr-1.5 h-4 w-4" />
                Xác nhận đặt lịch
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}