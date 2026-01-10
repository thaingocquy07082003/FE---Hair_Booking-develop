"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Facebook, Github, Scissors } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập đăng nhập
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập đăng ký
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 py-8 px-4 md:px-6">
        <div className="flex flex-col space-y-6 text-center md:text-left md:w-1/2">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <Scissors className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              HairStyle
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Đặt lịch cắt tóc chưa bao giờ dễ dàng đến thế
          </h1>
          <p className="text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-2xl">
            Đặt lịch nhanh chóng, theo dõi lịch sử và thử kiểu tóc mới với công
            nghệ AI tiên tiến.
          </p>
          <div className="hidden md:block relative w-full h-[400px]">
            <Image
              src="/salon-illustration.svg"
              alt="Salon illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Đăng ký
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    Đăng nhập
                  </CardTitle>
                  <CardDescription>
                    Đăng nhập để đặt lịch cắt tóc hoặc xem lịch sử của bạn.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@example.com"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Mật khẩu
                        </Label>
                        <Link
                          href="/auth/forgot-password"
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          className="h-11"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 bg-primary hover:bg-primary/90 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                  </form>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Hoặc tiếp tục với
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="w-full h-11 hover:bg-gray-100 transition-colors"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Github
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-11 hover:bg-gray-100 transition-colors"
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="register">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Đăng ký</CardTitle>
                  <CardDescription>
                    Tạo tài khoản mới để sử dụng dịch vụ của chúng tôi.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="first-name"
                          className="text-sm font-medium"
                        >
                          Họ
                        </Label>
                        <Input
                          id="first-name"
                          placeholder="Nguyễn"
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="last-name"
                          className="text-sm font-medium"
                        >
                          Tên
                        </Label>
                        <Input
                          id="last-name"
                          placeholder="Văn A"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@example.com"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0123456789"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="new-password"
                        className="text-sm font-medium"
                      >
                        Mật khẩu
                      </Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          className="h-11"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 bg-primary hover:bg-primary/90 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                  </form>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Hoặc tiếp tục với
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="w-full h-11 hover:bg-gray-100 transition-colors"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Github
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-11 hover:bg-gray-100 transition-colors"
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
                  <p className="text-xs text-center text-gray-500">
                    Bằng cách đăng ký, bạn đồng ý với{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Chính sách bảo mật
                    </Link>{" "}
                    của chúng tôi.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
