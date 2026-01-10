import Link from "next/link";
import { Scissors, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServiceList } from "@/services/service/get-service-list.api";
import { formatCurrency } from "@/lib/utils";

export default async function ServicesPage() {
  const serviceList = await getServiceList();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container py-16 px-4 md:px-6">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Dịch vụ cắt tóc nam
            </h1>
            <p className="text-gray-600 max-w-[700px] mx-auto text-lg">
              Chúng tôi cung cấp các dịch vụ cắt tóc nam chuyên nghiệp với đội
              ngũ thợ cắt tóc giàu kinh nghiệm.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {serviceList.map((service: any) => (
              <Card
                key={service.id}
                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 relative"
              >
                <CardHeader className="flex flex-col items-start gap-2 pb-2">
                  <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded-full">
                      <Scissors className="h-3 w-3 text-primary" />
                    </div>
                    <div className="grid gap-0.5">
                      <CardTitle className="text-sm">{service.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {service.duration} phút.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2 pb-12">
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </CardContent>
                <CardFooter className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm">
                  <p className="text-sm font-bold text-primary flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(service.price)} VND
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="bg-primary hover:bg-primary/90 transition-colors"
                  >
                    <Link href={`/booking?service=${service._id}&step=info`}>
                      Đặt lịch
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-10 mt-16">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Bạn không chắc chắn về kiểu tóc nào phù hợp?
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Đừng lo lắng, các thợ cắt tóc của chúng tôi sẽ tư vấn cho bạn
                  kiểu tóc phù hợp nhất với khuôn mặt và phong cách của bạn. Hãy
                  đặt lịch tư vấn miễn phí ngay hôm nay!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 transition-colors"
                >
                  <Link href="/booking">Đặt lịch tư vấn</Link>
                </Button>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Salon consultation"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
