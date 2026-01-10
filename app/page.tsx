import Link from "next/link";
import { CalendarDays, Clock, MapPin, Scissors, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="relative h-[500px] w-full">
          <img
            src="/placeholder.svg?height=500&width=1200"
            alt="Salon background"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-lg space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl">
                Đặt lịch cắt tóc dễ dàng
              </h1>
              <p className="text-lg text-gray-200">
                Trải nghiệm dịch vụ cắt tóc chuyên nghiệp với các thợ cắt tóc
                hàng đầu. Đặt lịch ngay hôm nay!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link href="/booking">Đặt lịch ngay</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20"
                  asChild
                >
                  <Link href="/services">Xem dịch vụ</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Dịch vụ của chúng tôi
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
                Chúng tôi cung cấp nhiều dịch vụ khác nhau để đáp ứng nhu cầu
                của bạn
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Scissors className="h-8 w-8" />
                <div className="grid gap-1">
                  <CardTitle>Cắt tóc nam</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Dịch vụ cắt tóc nam chuyên nghiệp với nhiều kiểu dáng hiện đại
                  và phù hợp với khuôn mặt.
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-sm font-medium">Từ 100.000đ</p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Scissors className="h-8 w-8" />
                <div className="grid gap-1">
                  <CardTitle>Cắt tóc nữ</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Dịch vụ cắt tóc nữ với nhiều kiểu dáng thời trang, phù hợp với
                  xu hướng hiện nay.
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-sm font-medium">Từ 150.000đ</p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Scissors className="h-8 w-8" />
                <div className="grid gap-1">
                  <CardTitle>Nhuộm tóc</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Dịch vụ nhuộm tóc với nhiều màu sắc thời trang, phù hợp với xu
                  hướng hiện nay.
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-sm font-medium">Từ 300.000đ</p>
              </CardFooter>
            </Card>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/services">Xem tất cả dịch vụ</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stylists Section */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Đội ngũ thợ cắt tóc
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
                Đội ngũ thợ cắt tóc chuyên nghiệp với nhiều năm kinh nghiệm
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
            {[1, 2, 3].map((stylist) => (
              <div
                key={stylist}
                className="flex flex-col items-center space-y-4"
              >
                <img
                  src={`/placeholder.svg?height=300&width=300&text=Stylist ${stylist}`}
                  alt={`Stylist ${stylist}`}
                  className="aspect-square rounded-full object-cover object-center"
                  width={150}
                  height={150}
                />
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">Nguyễn Văn A</h3>
                  <p className="text-sm text-gray-500">Senior Stylist</p>
                  <div className="flex justify-center">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <MapPin className="h-10 w-10 text-primary" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Địa chỉ</h3>
                <p className="text-gray-500">123 Đường ABC, Quận XYZ, Hà Nội</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <Clock className="h-10 w-10 text-primary" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Giờ mở cửa</h3>
                <p className="text-gray-500">Thứ 2 - Chủ nhật: 8:00 - 20:00</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <CalendarDays className="h-10 w-10 text-primary" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Đặt lịch</h3>
                <p className="text-gray-500">
                  Đặt lịch trước để được phục vụ tốt nhất
                </p>
                <Button asChild>
                  <Link href="/booking">Đặt lịch ngay</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
