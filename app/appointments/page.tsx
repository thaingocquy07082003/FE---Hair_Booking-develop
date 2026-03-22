"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock, Scissors, User, Phone, Mail,
  ChevronRight, X, AlertTriangle, CheckCircle2,
  XCircle, Loader2, RefreshCw, Eye, Ban, Hourglass,
  DollarSign, FileText, ArrowLeft,
} from "lucide-react";
import { getCookie } from "@/lib/cookie";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Appointment {
  id: string;
  customerId: string;
  stylistId: string;
  hairstyleId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string | null;
  cancellationReason: string | null;
  price: number;
  depositAmount: number;
  depositPaid: boolean;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
  stylistName: string;
  stylistAvatar: string | null;
  hairstyleName: string;
  hairstyleImage: string;
  customerFullName: string;
  customerUserEmail: string;
  customerUserPhone: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const STATUS_CONFIG: Record<string, {
  label: string;
  icon: React.ReactNode;
  badge: string;
  dot: string;
}> = {
  pending: {
    label: "Chờ xác nhận",
    icon: <Hourglass className="h-3.5 w-3.5" />,
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  confirmed: {
    label: "Đã xác nhận",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  completed: {
    label: "Hoàn thành",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Đã hủy",
    icon: <XCircle className="h-3.5 w-3.5" />,
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-400",
  },
  no_show: {
    label: "Vắng mặt",
    icon: <Ban className="h-3.5 w-3.5" />,
    badge: "bg-zinc-100 text-zinc-500 border-zinc-200",
    dot: "bg-zinc-400",
  },
};

// ─── API calls ────────────────────────────────────────────────────────────────
async function fetchAppointments(): Promise<Appointment[]> {
  const token = getCookie("accessToken");
  const res = await fetch("http://localhost:3003/api/v1/appointments/my-appointments", {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Không thể tải danh sách lịch hẹn");
  const json = await res.json();
  return json.data ?? [];
}

async function cancelAppointment(appointmentId: string, cancellationReason: string): Promise<void> {
  const token = getCookie("accessToken");
  const res = await fetch(
    `http://localhost:3003/api/v1/appointments/${appointmentId}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ cancellationReason }),
    }
  );
  if (!res.ok) throw new Error("Không thể hủy lịch hẹn");
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.badge}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Appointment Card ─────────────────────────────────────────────────────────
function AppointmentCard({
  appt,
  onViewDetail,
  onCancel,
}: {
  appt: Appointment;
  onViewDetail: (a: Appointment) => void;
  onCancel: (a: Appointment) => void;
}) {
  const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.pending;
  const canCancel = appt.status === "pending" || appt.status === "confirmed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all duration-200 overflow-hidden"
    >
      {/* Top color stripe */}
      <div className={`h-1 w-full ${cfg.dot}`} />

      <div className="p-5">
        <div className="flex gap-4">
          {/* Hairstyle image */}
          <div className="relative shrink-0">
            <div className="w-16 h-20 rounded-xl overflow-hidden bg-zinc-100 shadow-sm">
              <img
                src={appt.hairstyleImage}
                alt={appt.hairstyleName}
                className="w-full h-full object-cover"
              />
            </div>
            {appt.depositPaid && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow border-2 border-white">
                <CheckCircle2 className="h-2.5 w-2.5 text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-900 truncate text-sm">{appt.hairstyleName}</h3>
                <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {appt.stylistName}
                </p>
              </div>
              <StatusBadge status={appt.status} />
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
                <span>{formatDate(appt.appointmentDate)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span>{appt.startTime} – {appt.endTime} ({appt.duration} phút)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
                <span className="font-medium text-zinc-700">{formatPrice(appt.price)}</span>
                {appt.depositAmount > 0 && (
                  <span className="text-zinc-400">
                    · Cọc: <span className={appt.depositPaid ? "text-emerald-600 font-medium" : "text-amber-600"}>
                      {formatPrice(appt.depositAmount)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-50">
          <button
            onClick={() => onViewDetail(appt)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-zinc-200 text-zinc-600 text-xs font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all"
          >
            <Eye className="h-3.5 w-3.5" />
            Xem chi tiết
          </button>
          {canCancel && (
            <button
              onClick={() => onCancel(appt)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-medium hover:bg-rose-50 transition-all"
            >
              <Ban className="h-3.5 w-3.5" />
              Hủy lịch
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({
  appt,
  onClose,
  onCancel,
}: {
  appt: Appointment;
  onClose: () => void;
  onCancel: (a: Appointment) => void;
}) {
  const canCancel = appt.status === "pending" || appt.status === "confirmed";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Hero */}
        <div className="relative h-44 bg-zinc-100">
          <img
            src={appt.hairstyleImage}
            alt={appt.hairstyleName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-lg font-bold text-white">{appt.hairstyleName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={appt.status} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Stylist */}
          <section>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Thợ cắt tóc</p>
            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center">
                {appt.stylistAvatar
                  ? <img src={appt.stylistAvatar} className="w-full h-full rounded-full object-cover" />
                  : <User className="h-5 w-5 text-zinc-400" />
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800">{appt.stylistName}</p>
                <p className="text-xs text-zinc-400">Thợ cắt tóc</p>
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Thời gian</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-zinc-50 rounded-xl">
                <p className="text-[10px] text-zinc-400 mb-1">Ngày hẹn</p>
                <p className="text-xs font-semibold text-zinc-800 leading-tight">
                  {new Date(appt.appointmentDate).toLocaleDateString("vi-VN", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                  })}
                </p>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl">
                <p className="text-[10px] text-zinc-400 mb-1">Khung giờ</p>
                <p className="text-xs font-semibold text-zinc-800">{appt.startTime} – {appt.endTime}</p>
                <p className="text-[10px] text-zinc-400">{appt.duration} phút</p>
              </div>
            </div>
          </section>

          {/* Customer */}
          <section>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Thông tin khách hàng</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 p-3 bg-zinc-50 rounded-xl">
                <User className="h-4 w-4 text-zinc-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400">Họ tên</p>
                  <p className="text-xs font-medium text-zinc-800">{appt.customerFullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-zinc-50 rounded-xl">
                <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400">Số điện thoại</p>
                  <p className="text-xs font-medium text-zinc-800">{appt.customerUserPhone || appt.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-zinc-50 rounded-xl">
                <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400">Email</p>
                  <p className="text-xs font-medium text-zinc-800 break-all">{appt.customerUserEmail || appt.customerEmail}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Thanh toán</p>
            <div className="p-3 bg-zinc-50 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Giá dịch vụ</span>
                <span className="font-semibold text-zinc-800">{formatPrice(appt.price)}</span>
              </div>
              {appt.depositAmount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Tiền cọc</span>
                  <span className={`font-semibold ${appt.depositPaid ? "text-emerald-600" : "text-amber-600"}`}>
                    {formatPrice(appt.depositAmount)} {appt.depositPaid ? "✓" : "(chưa cọc)"}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          {appt.notes && (
            <section>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Ghi chú</p>
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <FileText className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">{appt.notes}</p>
              </div>
            </section>
          )}

          {/* Cancellation reason */}
          {appt.cancellationReason && (
            <section>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Lý do hủy</p>
              <div className="flex gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-800">{appt.cancellationReason}</p>
              </div>
            </section>
          )}

          {/* Timestamps */}
          <section>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Lịch sử</p>
            <div className="space-y-1.5 text-xs text-zinc-500">
              <div className="flex justify-between">
                <span>Đặt lịch lúc</span>
                <span className="font-medium text-zinc-700">{formatDateTime(appt.createdAt)}</span>
              </div>
              {appt.confirmedAt && (
                <div className="flex justify-between">
                  <span>Xác nhận lúc</span>
                  <span className="font-medium text-zinc-700">{formatDateTime(appt.confirmedAt)}</span>
                </div>
              )}
              {appt.completedAt && (
                <div className="flex justify-between">
                  <span>Hoàn thành lúc</span>
                  <span className="font-medium text-zinc-700">{formatDateTime(appt.completedAt)}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-sm font-medium hover:bg-zinc-50 transition-colors"
          >
            Đóng
          </button>
          {canCancel && (
            <button
              onClick={() => { onClose(); onCancel(appt); }}
              className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Ban className="h-4 w-4" />
              Hủy lịch hẹn
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Cancel Confirm Dialog ─────────────────────────────────────────────────────
function CancelDialog({
  appt,
  onClose,
  onConfirm,
  loading,
}: {
  appt: Appointment;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-7 w-7 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 text-center mb-1">Xác nhận hủy lịch</h3>
        <p className="text-sm text-zinc-500 text-center mb-1">Bạn sắp hủy lịch hẹn</p>
        <p className="text-sm font-semibold text-zinc-800 text-center mb-1">{appt.hairstyleName}</p>
        <p className="text-xs text-zinc-400 text-center mb-4">
          {new Date(appt.appointmentDate).toLocaleDateString("vi-VN")} · {appt.startTime}
        </p>

        {/* Reason input */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-zinc-600 mb-1.5 block">
            Lý do hủy <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ví dụ: Có lịch hẹn với đối tác..."
            rows={3}
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-300 outline-none focus:border-zinc-400 transition-colors resize-none"
          />
        </div>

        {appt.depositPaid && appt.depositAmount > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
            <p className="text-xs text-amber-700 text-center">
              ⚠️ Lưu ý: Tiền cọc <strong>{formatPrice(appt.depositAmount)}</strong> có thể không được hoàn trả.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-sm font-medium hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            Không, giữ lại
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading || !reason.trim()}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
            {loading ? "Đang hủy..." : "Hủy lịch"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAppointments();
      setAppointments([...data].reverse());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleCancel = async (reason: string) => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelAppointment(cancelTarget.id, reason);
      toast.success("Hủy lịch hẹn thành công");
      setCancelTarget(null);
      await loadAppointments();
    } catch {
      toast.error("Không thể hủy lịch hẹn. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
    }
  };

  const filtered = activeFilter === "all"
    ? appointments
    : appointments.filter((a) => a.status === activeFilter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === "all"
      ? appointments.length
      : appointments.filter((a) => a.status === f.key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      {/* Header */}
      <div className="bg-zinc-900 pt-10 pb-6 px-4">
        <div className="container max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => router.push("/")}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Georgia', serif" }}>
              Lịch hẹn của tôi
            </h1>
          </div>
          <p className="text-zinc-400 text-sm ml-11">
            {appointments.length > 0
              ? `${appointments.length} lịch hẹn`
              : "Quản lý các lịch hẹn cắt tóc"}
          </p>

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 mt-5 scrollbar-hide">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.key;
              const count = counts[f.key];
              if (count === 0 && f.key !== "all") return null;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    isActive
                      ? "bg-amber-400 text-zinc-900 border-amber-400"
                      : "bg-white/10 text-zinc-300 border-white/10 hover:bg-white/20"
                  }`}
                >
                  {f.label}
                  {count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-zinc-900/20" : "bg-white/20"
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-2xl py-6 px-4">

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative w-12 h-12">
              <Loader2 className="w-12 h-12 text-zinc-300 animate-spin" />
              <Scissors className="w-5 h-5 text-zinc-500 absolute inset-0 m-auto" />
            </div>
            <p className="text-sm text-zinc-400">Đang tải lịch hẹn...</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-rose-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-700">{error}</p>
              <p className="text-xs text-zinc-400 mt-1">Kiểm tra kết nối và thử lại</p>
            </div>
            <button
              onClick={loadAppointments}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-zinc-100 flex items-center justify-center">
              <CalendarDays className="h-8 w-8 text-zinc-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-600">
                {activeFilter === "all" ? "Bạn chưa có lịch hẹn nào" : "Không có lịch hẹn nào"}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                {activeFilter === "all"
                  ? "Đặt lịch ngay để trải nghiệm dịch vụ"
                  : `Không có lịch hẹn với trạng thái "${FILTERS.find(f => f.key === activeFilter)?.label}"`}
              </p>
            </div>
            {activeFilter === "all" && (
              <button
                onClick={() => router.push("/booking")}
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
              >
                <Scissors className="h-4 w-4" />
                Đặt lịch ngay
              </button>
            )}
          </div>
        )}

        {/* List */}
        {!isLoading && !error && filtered.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-3">
              {filtered.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appt={appt}
                  onViewDetail={setSelectedAppt}
                  onCancel={setCancelTarget}
                />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Book new CTA */}
        {!isLoading && !error && (
          <div className="mt-6">
            <button
              onClick={() => router.push("/booking")}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400 text-sm font-medium hover:border-zinc-300 hover:text-zinc-500 hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <Scissors className="h-4 w-4" />
              Đặt lịch mới
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAppt && (
          <DetailModal
            appt={selectedAppt}
            onClose={() => setSelectedAppt(null)}
            onCancel={(a) => { setSelectedAppt(null); setCancelTarget(a); }}
          />
        )}
      </AnimatePresence>

      {/* Cancel Confirm */}
      <AnimatePresence>
        {cancelTarget && (
          <CancelDialog
            appt={cancelTarget}
            onClose={() => setCancelTarget(null)}
            onConfirm={handleCancel}
            loading={cancelling}
          />
        )}
      </AnimatePresence>
    </div>
  );
}