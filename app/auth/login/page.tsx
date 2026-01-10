"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, UserPlus } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/lib/store/slices/authSlice";
import { login } from "@/services/auth.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    dispatch(loginStart());

    try {
      const response = await login({ email, password });
      if (response.statusCode === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            user: response.data,
            access_token: response?.data?.accessToken,
          })
        );
        dispatch(
          loginSuccess({
            user: response.data,
            token: response.data.accessToken,
          })
        );
        router.push("/");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Email hoặc mật khẩu không đúng";
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
          <CardDescription className="text-center">
            Nhập thông tin đăng nhập của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-500">Chưa có tài khoản? </span>
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
