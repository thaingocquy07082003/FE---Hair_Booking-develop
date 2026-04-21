"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Scissors,
  Sparkles,
  Star,
  Droplets,
  Crown,
  WandSparkles,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getServiceList } from "@/services/service/get-service-list.api";

type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

// Map category to icon
const getCategoryIcon = (category: string | null): LucideIcon => {
  switch (category?.toLowerCase()) {
    case "cắt tóc":
      return Scissors;
    case "nhuộm":
      return WandSparkles;
    case "uốn/duỗi":
      return Sparkles;
    case "chăm sóc":
      return Droplets;
    default:
      return Crown;
  }
};

const serviceHighlights = [
  {
    title: "Đặt lịch nhanh",
    description: "Chọn gói, chọn thợ và giữ khung giờ đẹp chỉ trong vài phút.",
  },
  {
    title: "Tư vấn riêng",
    description: "Thợ cắt sẽ gợi ý kiểu tóc phù hợp với chất tóc và khuôn mặt.",
  },
  {
    title: "Hoàn thiện kỹ",
    description: "Sấy, chỉnh form và hướng dẫn cách tự giữ nếp sau khi rời salon.",
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await getServiceList();
        if (response.data) {
          setServices(response.data);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f3ed]">
      <section className="relative overflow-hidden bg-zinc-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-0 h-full w-px bg-white/20" />
          <div className="absolute left-2/4 top-0 h-full w-px bg-white/20" />
          <div className="absolute left-3/4 top-0 h-full w-px bg-white/20" />
        </div>
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-amber-300">
              <Scissors className="h-3.5 w-3.5" />
              Dịch vụ & tiện ích đi kèm
            </p>
            <h1
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Cắt tóc chuẩn form, kèm dịch vụ chăm sóc đầy đủ
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc tóc chuyên nghiệp từ
              cắt tóc, nhuộm, đến chăm sóc da đầu.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-amber-400 text-zinc-950 hover:bg-amber-300">
                <Link href="/booking">
                  Đặt lịch ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/gallery">Xem kiểu tóc gợi ý</Link>
              </Button>
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {serviceHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <CheckCircle2 className="h-5 w-5 text-amber-300" />
                <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
              Dịch vụ nổi bật
            </p>
            <h2
              className="mt-2 text-3xl font-bold text-zinc-950 sm:text-4xl"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Danh sách dịch vụ
            </h2>
          </div>
        </div>

        {loading && (
          <div className="mt-8 flex justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              <p className="text-zinc-600">Đang tải danh sách dịch vụ...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-zinc-600">Không có dịch vụ nào.</p>
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const Icon = getCategoryIcon(service.category);

              return (
                <Card
                  key={service.id}
                  className="group overflow-hidden border-zinc-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardHeader className="space-y-4 border-b border-zinc-100 pb-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-950/10">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-zinc-950">
                            {service.name}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-2 text-sm">
                            <Clock3 className="h-3.5 w-3.5" />
                            {service.duration} phút
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {service.category && (
                          <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            {service.category}
                          </div>
                        )}
                        {service.isAvailable ? (
                          <div className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                            Có sẵn
                          </div>
                        ) : (
                          <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                            Hết
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 py-5">
                    <p className="text-sm leading-6 text-zinc-600">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                          Giá từ
                        </p>
                        <p className="mt-1 text-xl font-bold text-zinc-950">
                          {formatCurrency(service.price)}đ
                        </p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>

                  <div className="px-6 pb-6">
                    <Button asChild className="w-full bg-zinc-950 text-white hover:bg-zinc-800" disabled={!service.isAvailable}>
                      <Link href={`/booking?service=${service.id}&step=info`}>
                        Đặt lịch ngay
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
