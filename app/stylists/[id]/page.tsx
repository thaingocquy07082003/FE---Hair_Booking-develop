"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { toast } from "sonner";

// Dữ liệu mẫu cho đánh giá
const reviews = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    rating: 5,
    comment:
      "Thợ cắt tóc rất chuyên nghiệp, tôi rất hài lòng với kiểu tóc mới!",
    date: "2024-03-15",
  },
  {
    id: 2,
    user: "Trần Thị B",
    rating: 4,
    comment: "Dịch vụ tốt, nhân viên thân thiện. Sẽ quay lại!",
    date: "2024-03-10",
  },
  {
    id: 3,
    user: "Lê Văn C",
    rating: 5,
    comment: "Kiểu tóc đẹp, giá cả hợp lý. Rất đáng để thử!",
    date: "2024-03-05",
  },
];

// Dữ liệu mẫu cho lịch làm việc
const workingHours = [
  { day: "Thứ 2", hours: "09:00 - 18:00" },
  { day: "Thứ 3", hours: "09:00 - 18:00" },
  { day: "Thứ 4", hours: "09:00 - 18:00" },
  { day: "Thứ 5", hours: "09:00 - 18:00" },
  { day: "Thứ 6", hours: "09:00 - 18:00" },
  { day: "Thứ 7", hours: "09:00 - 17:00" },
  { day: "Chủ nhật", hours: "Nghỉ" },
];

// Dữ liệu mẫu cho lịch hẹn đã hoàn thành
const completedAppointments = [
  {
    id: "1",
    date: "2024-03-15",
    stylistId: "1",
    userId: "user1",
  },
  {
    id: "2",
    date: "2024-03-10",
    stylistId: "1",
    userId: "user2",
  },
];

export default function StylistDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Kiểm tra xem người dùng có thể đánh giá không
  useEffect(() => {
    if (user) {
      const userAppointments = completedAppointments.filter(
        (app) => app.userId === user.id && app.stylistId === params.id
      );

      if (userAppointments.length > 0) {
        const lastAppointment = userAppointments[0];
        const appointmentDate = new Date(lastAppointment.date);
        const threeDaysAgo = subDays(new Date(), 3);

        if (appointmentDate >= threeDaysAgo) {
          setCanReview(true);
        }
      }
    }
  }, [user, params.id]);

  const handleSubmitReview = () => {
    if (!rating) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    // TODO: Gửi đánh giá lên server
    console.log({ rating, comment });
    setShowReviewForm(false);
    setHasReviewed(true);
    toast.success("Đánh giá của bạn đã được gửi thành công!");
  };

  // Dữ liệu mẫu cho thợ cắt tóc
  const stylist = {
    id: params.id,
    name: "Nguyễn Văn A",
    role: "Senior Stylist",
    rating: 4.8,
    reviews: 128,
    experience: "5 năm",
    specialties: ["Cắt tóc nam", "Tạo kiểu", "Nhuộm tóc"],
    image: "/images/stylist-1.jpg",
    location: "Quận 1, TP.HCM",
    phone: "0123 456 789",
    email: "nguyenvana@example.com",
    bio: "Với hơn 5 năm kinh nghiệm trong ngành làm đẹp, tôi luôn cố gắng mang đến cho khách hàng những trải nghiệm tốt nhất và kiểu tóc phù hợp nhất với khuôn mặt và phong cách của họ.",
  };

  const availableTimes = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/stylists")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tighter">
          Thông tin thợ cắt tóc
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Thông tin cơ bản */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="relative h-64">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img
                src={stylist.image}
                alt={stylist.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-xl font-bold text-white">{stylist.name}</h3>
                <p className="text-sm text-white/80">{stylist.role}</p>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{stylist.rating}</span>
                  <span className="text-gray-500">({stylist.reviews})</span>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{stylist.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>{stylist.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{stylist.email}</span>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">
                    Kinh nghiệm: {stylist.experience}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stylist.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{stylist.bio}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thông tin chi tiết và đặt lịch */}
        <div className="md:col-span-2">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              <TabsTrigger value="booking">Đặt lịch</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="space-y-4">
              {user && canReview && !hasReviewed && (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Đánh giá của bạn:</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  star <= rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <Textarea
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Hủy
                        </Button>
                        <Button onClick={handleSubmitReview}>
                          <Send className="mr-2 h-4 w-4" />
                          Gửi đánh giá
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {!user && (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500">
                      Vui lòng đăng nhập để xem và đánh giá
                    </p>
                  </CardContent>
                </Card>
              )}
              {user && !canReview && !hasReviewed && (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500">
                      Bạn chỉ có thể đánh giá sau khi đã sử dụng dịch vụ và
                      trong vòng 3 ngày kể từ ngày cắt tóc
                    </p>
                  </CardContent>
                </Card>
              )}
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={`/images/avatar-${review.id}.jpg`} />
                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{review.user}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(review.date), "dd/MM/yyyy", {
                                locale: vi,
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{review.rating}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="booking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch làm việc</CardTitle>
                  <CardDescription>
                    Chọn ngày và giờ phù hợp để đặt lịch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={vi}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Giờ làm việc</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              onClick={() => setSelectedTime(time)}
                              className="w-full"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">
                          Lịch làm việc hàng tuần
                        </h3>
                        <div className="space-y-2">
                          {workingHours.map((day) => (
                            <div
                              key={day.day}
                              className="flex items-center justify-between text-sm"
                            >
                              <span>{day.day}</span>
                              <span className="text-gray-500">{day.hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {selectedTime && (
                <Button className="w-full">
                  Đặt lịch cho {format(date!, "dd/MM/yyyy", { locale: vi })} lúc{" "}
                  {selectedTime}
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
