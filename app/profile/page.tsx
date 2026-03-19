"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  User,
  Shield,
  CheckCircle2,
  XCircle,
  Pencil,
  X,
  Save,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCookie, setCookie } from "@/lib/cookie";
import { getMyProfile, updateMyProfile, UserProfile } from "@/services/profile/profile.api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// ── Role badge ────────────────────────────────────────────────────────────────
const ROLE_LABELS: Record<string, string> = {
  customer: "Khách hàng",
  admin: "Quản trị viên",
  manager: "Quản lý",
  receptionist: "Lễ tân",
  hairstylist: "Thợ cắt tóc",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
      <Shield className="h-3 w-3" />
      {ROLE_LABELS[role?.toLowerCase()] ?? role}
    </span>
  );
}

// ── Avatar display ────────────────────────────────────────────────────────────
function AvatarDisplay({
  avatarUrl,
  preview,
  fullName,
  size = "lg",
}: {
  avatarUrl: string | null;
  preview: string | null;
  fullName: string;
  size?: "sm" | "lg";
}) {
  const src = preview ?? avatarUrl;
  const dim = size === "lg" ? "h-28 w-28" : "h-16 w-16";
  const iconDim = size === "lg" ? "h-12 w-12" : "h-6 w-6";

  if (src) {
    return (
      <img
        src={src}
        alt={fullName}
        className={`${dim} rounded-full object-cover ring-4 ring-background shadow-lg`}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full bg-muted flex items-center justify-center ring-4 ring-background shadow-lg`}
    >
      <User className={`${iconDim} text-muted-foreground`} />
    </div>
  );
}

// ── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // ── Load profile: ưu tiên cookie, sau đó fetch API ──────────────────────
  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Hiển thị từ cookie ngay lập tức
    const cached: UserProfile = {
      id: getCookie("userId") ?? "",
      email: getCookie("userEmail") ?? "",
      fullName: getCookie("userFullName") ?? "",
      phone: getCookie("userPhone") ?? "",
      role: getCookie("userRole") ?? "",
      verified: true,
      avatarUrl:
        getCookie("userAvatarUrl") && getCookie("userAvatarUrl") !== "null"
          ? getCookie("userAvatarUrl")
          : null,
      createdAt: "",
      updatedAt: "",
    };

    if (cached.email) {
      setProfile(cached);
      setIsLoading(false);
    }

    // Fetch mới nhất từ API
    getMyProfile()
      .then((data) => {
        setProfile(data);
        // Cập nhật lại cookie
        setCookie("userFullName", data.fullName, 7);
        setCookie("userPhone", data.phone ?? "", 7);
        setCookie("userAvatarUrl", data.avatarUrl ?? "null", 7);
        setCookie("userEmail", data.email, 7);
      })
      .catch(() => {
        if (!cached.email) {
          toast.error("Không thể tải thông tin profile");
        }
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  // ── Mở form chỉnh sửa ────────────────────────────────────────────────────
  const handleStartEdit = () => {
    if (!profile) return;
    setEditFullName(profile.fullName);
    setEditPhone(profile.phone ?? "");
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  // ── Chọn ảnh ─────────────────────────────────────────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── Lưu chỉnh sửa ────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!editFullName.trim()) {
      toast.error("Họ tên không được để trống");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateMyProfile({
        fullName: editFullName.trim(),
        phone: editPhone.trim(),
        avatar: avatarFile,
      });

      // Cập nhật state và cookie
      setProfile(updated);
      setCookie("userFullName", updated.fullName, 7);
      setCookie("userPhone", updated.phone ?? "", 7);
      setCookie("userAvatarUrl", updated.avatarUrl ?? "null", 7);

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading && !profile) {
    return (
      <div className="container mx-auto py-10 max-w-3xl px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const joinedDate = profile.createdAt
    ? format(new Date(profile.createdAt), "dd MMMM yyyy", { locale: vi })
    : null;

  return (
    <div className="container mx-auto py-10 max-w-3xl px-4">
      {/* ── Page title ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Thông tin cá nhân</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Quản lý hồ sơ và thông tin tài khoản của bạn
        </p>
      </div>

      <div className="space-y-6">
        {/* ── Card: Avatar + tên + role ── */}
        <div className="rounded-2xl border bg-card shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <AvatarDisplay
                avatarUrl={profile.avatarUrl}
                preview={isEditing ? avatarPreview : null}
                fullName={profile.fullName}
              />
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </>
              )}
            </div>

            {/* Name + role + verified */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h2 className="text-xl font-bold">{profile.fullName}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <RoleBadge role={profile.role} />
                {profile.verified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Đã xác thực
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-200">
                    <XCircle className="h-3 w-3" />
                    Chưa xác thực
                  </span>
                )}
              </div>
              {joinedDate && (
                <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                  <CalendarDays className="h-3 w-3" />
                  Tham gia từ {joinedDate}
                </p>
              )}
            </div>

            {/* Edit button */}
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartEdit}
                className="shrink-0 gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>

        {/* ── Card: Thông tin chi tiết / Form chỉnh sửa ── */}
        <div className="rounded-2xl border bg-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              {isEditing ? "Chỉnh sửa thông tin" : "Thông tin liên hệ"}
            </h3>
            {isEditing && (
              <span className="text-xs text-muted-foreground">
                * Bắt buộc
              </span>
            )}
          </div>

          {isEditing ? (
            /* ── Edit form ── */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={editPhone}
                  onChange={(e) =>
                    setEditPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  placeholder="0901234567"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  value={profile.email}
                  disabled
                  className="h-10 bg-muted/50 text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email không thể thay đổi
                </p>
              </div>

              {/* Avatar preview khi đã chọn */}
              {avatarPreview && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border">
                  <img
                    src={avatarPreview}
                    alt="preview"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {avatarFile?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {avatarFile
                        ? (avatarFile.size / 1024).toFixed(0) + " KB"
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  <X className="mr-1.5 h-4 w-4" />
                  Hủy
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-1.5 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* ── Read-only view ── */
            <div>
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={profile.email}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Số điện thoại"
                value={profile.phone || "Chưa cập nhật"}
              />
              <InfoRow
                icon={<User className="h-4 w-4" />}
                label="Họ và tên"
                value={profile.fullName}
              />
            </div>
          )}
        </div>

        {/* ── Card: Thống kê ── */}
        <div className="rounded-2xl border bg-card shadow-sm p-6">
          <h3 className="font-semibold mb-4">Thống kê hoạt động</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Lịch hẹn", value: "—" },
              { label: "Dịch vụ đã dùng", value: "—" },
              { label: "Đánh giá", value: "—" },
              { label: "Điểm tích lũy", value: "—" },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-4 rounded-xl bg-muted/40 space-y-1"
              >
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}