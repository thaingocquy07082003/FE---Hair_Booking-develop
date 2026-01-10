"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Mail, Phone, MapPin, Calendar, Clock } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  const handleProfileUpdate = async () => {
    try {
      // TODO: Implement profile update logic
      toast.success("Cập nhật thông tin thành công");
      setIsEditing(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // TODO: Implement image upload logic
        toast.success("Cập nhật ảnh đại diện thành công");
      } catch (error) {
        toast.error("Có lỗi xảy ra khi cập nhật ảnh");
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Information Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>
              Quản lý thông tin cá nhân và ảnh đại diện
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user?.imgAvt} alt={user?.username} />
                  <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{user?.username}</h3>
                <p className="text-sm text-muted-foreground">Khách hàng</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên người dùng</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData({ ...profileData, username: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) =>
                    setProfileData({ ...profileData, address: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleProfileUpdate}>Lưu thay đổi</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Chỉnh sửa thông tin
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
              <CardDescription>Tổng quan về hoạt động của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Tổng số lịch hẹn
                  </div>
                  <div className="text-2xl font-bold">12</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Dịch vụ đã sử dụng
                  </div>
                  <div className="text-2xl font-bold">8</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Đánh giá đã gửi
                  </div>
                  <div className="text-2xl font-bold">5</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Điểm tích lũy
                  </div>
                  <div className="text-2xl font-bold">250</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
