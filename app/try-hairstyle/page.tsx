"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Camera, LogIn, UserPlus } from "lucide-react";

export default function TryHairstylePage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold tracking-tighter">Thử Kiểu Tóc</h1>
          <p className="text-gray-500">
            Để sử dụng tính năng thử kiểu tóc, vui lòng đăng nhập hoặc đăng ký
            tài khoản.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/auth/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Đăng nhập
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/register" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Đăng ký
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Thử Kiểu Tóc</h1>
          <p className="text-gray-500">
            Chụp ảnh hoặc tải lên ảnh của bạn để thử các kiểu tóc khác nhau
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Chụp ảnh mới</CardTitle>
              <CardDescription>
                Chụp ảnh trực tiếp từ camera của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link
                  href="/try-hairstyle/camera"
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Mở Camera
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tải ảnh lên</CardTitle>
              <CardDescription>Tải lên ảnh từ thiết bị của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link
                  href="/try-hairstyle/upload"
                  className="flex items-center gap-2"
                >
                  Tải ảnh lên
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
