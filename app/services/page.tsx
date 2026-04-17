import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  Clock3,
  Crown,
  Droplets,
  MapPin,
  Scissors,
  Sparkles,
  Star,
  WandSparkles,
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

type ServiceItem = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  icon: LucideIcon;
  highlight: string;
  includes: string[];
};

const serviceList: ServiceItem[] = [
  {
    id: "cut-basic",
    name: "Cắt tóc cơ bản",
    description:
      "Tư vấn nhanh, cắt gọn gàng theo khuôn mặt, làm sạch viền và hoàn thiện kiểu tóc tự nhiên.",
    duration: 30,
    price: 120000,
    icon: Scissors,
    highlight: "Phù hợp đi làm mỗi ngày",
    includes: ["Tư vấn kiểu tóc", "Cắt tạo form", "Sấy hoàn thiện"],
  },
  {
    id: "cut-styling",
    name: "Cắt + tạo kiểu",
    description:
      "Dành cho khách muốn chỉn chu hơn với phần tạo phồng, vuốt texture hoặc dựng form hiện đại.",
    duration: 45,
    price: 180000,
    icon: Sparkles,
    highlight: "Kiểu tóc lên form đẹp",
    includes: ["Cắt theo mặt", "Tạo kiểu bằng sáp", "Hướng dẫn tự styling"],
  },
  {
    id: "beard-trim",
    name: "Tỉa râu & chân tóc",
    description:
      "Làm sạch đường viền râu, chỉnh chân tóc và cân đối tổng thể khuôn mặt để gọn gàng hơn.",
    duration: 20,
    price: 90000,
    icon: Crown,
    highlight: "Gọn mặt, sáng nét hơn",
    includes: ["Tỉa râu", "Tạo viền cổ", "Xử lý tóc mai"],
  },
  {
    id: "wash-head-massage",
    name: "Gội đầu & massage",
    description:
      "Dịch vụ đi kèm giúp thư giãn da đầu, làm sạch tóc và mang lại cảm giác thoải mái sau khi cắt.",
    duration: 25,
    price: 80000,
    icon: Droplets,
    highlight: "Thư giãn sau giờ làm",
    includes: ["Gội sạch da đầu", "Massage vai gáy", "Sấy nhẹ tóc"],
  },
  {
    id: "color-refresh",
    name: "Nhuộm phủ bạc",
    description:
      "Giải pháp tinh gọn cho khách muốn che tóc bạc, giữ vẻ ngoài trẻ trung và màu tóc tự nhiên.",
    duration: 60,
    price: 350000,
    icon: WandSparkles,
    highlight: "Lên màu tự nhiên",
    includes: ["Tư vấn màu", "Nhuộm phủ bạc", "Chăm sóc sau nhuộm"],
  },
];

const addOnServices = [
  "Cạo mặt & làm sạch viền tóc",
  "Hot towel thư giãn",
  "Vuốt sáp tạo kiểu",
  "Tư vấn kiểu tóc theo khuôn mặt",
  "Chăm sóc da đầu cơ bản",
  "Chụp ảnh kiểu tóc sau hoàn thiện",
];

const comboPackages = [
  {
    name: "Combo đi làm",
    price: 220000,
    duration: 50,
    note: "Cắt cơ bản + gội đầu + vuốt sáp",
  },
  {
    name: "Combo chỉnh chu",
    price: 280000,
    duration: 70,
    note: "Cắt tạo kiểu + tỉa râu + massage vai gáy",
  },
  {
    name: "Combo premium",
    price: 420000,
    duration: 90,
    note: "Cắt + tạo kiểu + chăm sóc da đầu + hot towel",
  },
];

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
              Đây là bản mock cho trang dịch vụ: tập trung vào các gói cắt tóc,
              tạo kiểu, tỉa râu, gội đầu và chăm sóc da đầu để khách dễ chọn
              ngay từ đầu.
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
              Một số dịch vụ đi kèm
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {serviceList.map((service, index) => {
            const Icon = service.icon;

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
                    <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Gói {index + 1}
                    </div>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    {service.highlight}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 py-5">
                  <p className="text-sm leading-6 text-zinc-600">
                    {service.description}
                  </p>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      Bao gồm
                    </p>
                    <ul className="space-y-2">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

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
                  <Button asChild className="w-full bg-zinc-950 text-white hover:bg-zinc-800">
                    <Link href={`/booking?service=${service.id}&step=info`}>
                      Cắt tóc ngay
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
