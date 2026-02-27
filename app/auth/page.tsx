"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle2, Mail, Scissors, ArrowLeft, Timer } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, "Tên người dùng phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"register" | "otp">("register");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (step === "otp" && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [step, countdown]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      // TODO: Call register API here
      // await registerUser(values);
      setUserEmail(values.email);
      setStep("otp");
      setCountdown(120);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      toast.success("Mã OTP đã được gửi đến email của bạn!");
    } catch (error) {
      toast.error("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const newOtp = [...otp];
      pasted.split("").forEach((char, i) => { newOtp[i] = char; });
      setOtp(newOtp);
      otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleConfirmOtp = () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Vui lòng nhập đầy đủ 6 chữ số OTP");
      return;   
    }
    // TODO: Call verify OTP API here
    toast.success("Xác thực thành công! Chuyển đến trang đăng nhập...");
    setTimeout(() => router.push("/auth/login"), 1200);
  };

  const handleResend = () => {
    setCountdown(120);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    toast.success("Đã gửi lại mã OTP!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-zinc-50 to-stone-100 px-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-amber-100/60 to-orange-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-zinc-200/60 to-slate-100/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-zinc-900 rounded-xl">
            <Scissors className="h-5 w-5 text-amber-400" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900" style={{ fontFamily: "'Georgia', serif" }}>
            HairStyle
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40 overflow-hidden">
          {step === "register" ? (
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                  Tạo tài khoản
                </h1>
                <p className="text-sm text-zinc-500 mt-1">Điền thông tin bên dưới để bắt đầu</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 text-sm font-medium">Tên người dùng</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nguyễn Văn A"
                            className="h-10 border-zinc-200 rounded-xl bg-zinc-50/50 focus-visible:ring-amber-400/30 focus-visible:border-amber-400 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 text-sm font-medium">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="example@email.com"
                            type="email"
                            className="h-10 border-zinc-200 rounded-xl bg-zinc-50/50 focus-visible:ring-amber-400/30 focus-visible:border-amber-400 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 text-sm font-medium">Mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tối thiểu 6 ký tự"
                            type="password"
                            className="h-10 border-zinc-200 rounded-xl bg-zinc-50/50 focus-visible:ring-amber-400/30 focus-visible:border-amber-400 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-700 text-sm font-medium">Số điện thoại</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0123456789"
                              className="h-10 border-zinc-200 rounded-xl bg-zinc-50/50 focus-visible:ring-amber-400/30 focus-visible:border-amber-400 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-700 text-sm font-medium">Địa chỉ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Địa chỉ"
                              className="h-10 border-zinc-200 rounded-xl bg-zinc-50/50 focus-visible:ring-amber-400/30 focus-visible:border-amber-400 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 mt-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/20 hover:shadow-zinc-900/30 active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Đăng ký"
                    )}
                  </button>
                </form>
              </Form>

              <p className="text-center text-sm text-zinc-500 mt-5">
                Đã có tài khoản?{" "}
                <Link href="/auth/login" className="text-zinc-900 font-semibold hover:text-amber-600 transition-colors underline underline-offset-2">
                  Đăng nhập
                </Link>
              </p>
            </div>
          ) : (
            <div className="p-8">
              {/* Back button */}
              <button
                onClick={() => setStep("register")}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-800 text-sm mb-6 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Quay lại
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                    <Mail className="h-7 w-7 text-amber-500" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1" style={{ fontFamily: "'Georgia', serif" }}>
                  Xác thực email
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Chúng tôi đã gửi mã xác thực đến
                </p>
                <p className="text-sm font-semibold text-zinc-800 mt-0.5">{userEmail}</p>
                <p className="text-xs text-zinc-400 mt-1">Vui lòng kiểm tra hộp thư đến (hoặc thư rác)</p>
              </div>

              {/* OTP inputs */}
              <div className="flex justify-center gap-2.5 mb-5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className={`w-11 h-13 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-150 bg-zinc-50
                      ${digit ? "border-amber-400 bg-amber-50 text-zinc-900 shadow-sm shadow-amber-100" : "border-zinc-200 text-zinc-900"}
                      focus:border-amber-400 focus:bg-amber-50/50 focus:shadow-sm focus:shadow-amber-100
                    `}
                    style={{ height: "52px" }}
                  />
                ))}
              </div>

              {/* Countdown */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <Timer className={`h-4 w-4 ${countdown > 0 ? "text-amber-500" : "text-zinc-400"}`} />
                {countdown > 0 ? (
                  <span className="text-sm text-zinc-600">
                    Mã hết hạn sau{" "}
                    <span className="font-bold text-amber-600 tabular-nums">{formatTime(countdown)}</span>
                  </span>
                ) : (
                  <span className="text-sm text-zinc-400">Mã đã hết hạn</span>
                )}
              </div>

              {/* Confirm button */}
              <button
                onClick={handleConfirmOtp}
                disabled={otp.join("").length < 6}
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/20 hover:shadow-zinc-900/30 active:scale-[0.98] mb-3"
              >
                Xác nhận
              </button>

              {/* Resend */}
              <p className="text-center text-sm text-zinc-500">
                Không nhận được mã?{" "}
                <button
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`font-semibold transition-colors ${canResend ? "text-zinc-900 hover:text-amber-600 underline underline-offset-2 cursor-pointer" : "text-zinc-300 cursor-not-allowed"}`}
                >
                  Gửi lại
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mt-5">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === "register" ? "w-8 bg-zinc-900" : "w-3 bg-zinc-300"}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === "otp" ? "w-8 bg-zinc-900" : "w-3 bg-zinc-300"}`} />
        </div>
      </div>
    </div>
  );
}