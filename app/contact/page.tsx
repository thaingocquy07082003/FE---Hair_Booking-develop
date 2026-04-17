import Link from "next/link";
import {
	ArrowRight,
	Clock3,
	Mail,
	MapPin,
	Phone,
	Scissors,
	ShieldCheck,
	Sparkles,
	Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactMethods = [
	{
		title: "Gọi đặt lịch nhanh",
		value: "0123 456 789",
		href: "tel:0123456789",
		icon: Phone,
		note: "Phù hợp khi cần giữ slot gấp trong ngày.",
	},
	{
		title: "Gửi email",
		value: "info@hairstyle.com",
		href: "mailto:info@hairstyle.com",
		icon: Mail,
		note: "Dùng cho báo giá, hợp tác hoặc phản hồi chi tiết.",
	},
	{
		title: "Đến salon",
		value: "123 Đường ABC, Quận XYZ, Hà Nội",
		href: "#location",
		icon: MapPin,
		note: "Có chỗ ngồi chờ, wifi và nước uống miễn phí.",
	},
];

const quickFacts = [
	"Phản hồi trong giờ làm việc",
	"Tư vấn kiểu tóc miễn phí trước khi cắt",
	"Nhận đặt lịch qua điện thoại và form",
];

const openingHours = [
	{ day: "Thứ 2 - Thứ 6", time: "09:00 - 20:30" },
	{ day: "Thứ 7", time: "08:30 - 21:00" },
	{ day: "Chủ nhật", time: "08:30 - 19:30" },
];

const supportItems = [
	"Tư vấn dịch vụ phù hợp trước khi đặt lịch",
	"Nhắc lịch trước giờ hẹn",
	"Hỗ trợ đổi lịch nếu bận đột xuất",
	"Gợi ý stylist theo phong cách mong muốn",
];

const branches = [
	{
		name: "HairStyle Central",
		address: "123 Đường ABC, Quận XYZ, Hà Nội",
		phone: "0123 456 789",
		tag: "Chi nhánh chính",
	},
	{
		name: "HairStyle Studio",
		address: "45 Nguyễn Trãi, Thanh Xuân, Hà Nội",
		phone: "0987 654 321",
		tag: "Không gian riêng tư",
	},
];

export default function ContactPage() {
	return (
		<div className="min-h-screen bg-[#f7f3ed]">
			<section className="relative overflow-hidden bg-zinc-950 px-4 py-20 text-white sm:px-6 lg:px-8">
				<div className="absolute inset-0 opacity-20">
					<div className="absolute left-1/4 top-0 h-full w-px bg-white/20" />
					<div className="absolute left-2/4 top-0 h-full w-px bg-white/20" />
					<div className="absolute left-3/4 top-0 h-full w-px bg-white/20" />
				</div>
				<div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
				<div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

				<div className="container relative">
					<div className="mx-auto max-w-4xl text-center">
						<p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-amber-300">
							<Scissors className="h-3.5 w-3.5" />
							Liên hệ salon
						</p>
						<h1
							className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
							style={{ fontFamily: "Arial, sans-serif" }}
						>
							Kết nối với chúng tôi theo cách nhanh nhất
						</h1>
						<p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
							Trang này là bản mock liên hệ, tập trung vào đặt lịch, hỏi tư vấn
							và tìm thông tin salon trong vài giây. Khách có thể gọi, gửi email
							hoặc điền form bên dưới.
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
								<Link href="/services">Xem dịch vụ</Link>
							</Button>
						</div>
					</div>

					<div className="mt-14 grid gap-4 md:grid-cols-3">
						{quickFacts.map((item) => (
							<div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
								<ShieldCheck className="h-5 w-5 text-amber-300" />
								<p className="mt-4 text-sm leading-6 text-zinc-200">{item}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="container py-14 sm:py-16">
				<div className="grid gap-5 md:grid-cols-3">
					{contactMethods.map((item) => {
						const Icon = item.icon;

						return (
							<Card key={item.title} className="border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
								<CardHeader className="space-y-4 pb-3">
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
										<Icon className="h-5 w-5" />
									</div>
									<div>
										<CardTitle className="text-xl text-zinc-950">{item.title}</CardTitle>
										<CardDescription className="mt-2 text-sm leading-6">{item.note}</CardDescription>
									</div>
								</CardHeader>
								<CardContent className="pb-6">
									<Link href={item.href} className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 hover:text-amber-600">
										<span>{item.value}</span>
										<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
									</Link>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			<section className="container pb-14 sm:pb-16">
				<div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
					<Card className="border-zinc-200/80 bg-white shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-2xl text-zinc-950">
								<Sparkles className="h-5 w-5 text-amber-500" />
								Gửi yêu cầu tư vấn
							</CardTitle>
							<CardDescription className="text-sm leading-6">
								Điền nhanh form để salon gọi lại hoặc hỗ trợ chọn dịch vụ phù hợp.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5 pb-6">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="name">Họ và tên</Label>
									<Input id="name" placeholder="Ví dụ: Nguyễn Văn A" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Số điện thoại</Label>
									<Input id="phone" placeholder="Ví dụ: 09xx xxx xxx" />
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="service">Dịch vụ quan tâm</Label>
									<Input id="service" placeholder="Cắt tóc, nhuộm, gội đầu..." />
								</div>
								<div className="space-y-2">
									<Label htmlFor="time">Thời gian mong muốn</Label>
									<Input id="time" placeholder="Sáng, chiều, tối hoặc ngày cụ thể" />
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="message">Nội dung cần hỗ trợ</Label>
								<Textarea
									id="message"
									placeholder="Mô tả kiểu tóc bạn muốn, vấn đề về tóc hoặc thời gian bạn có thể ghé salon."
									className="min-h-36"
								/>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row">
								<Button asChild className="bg-zinc-950 text-white hover:bg-zinc-800">
									<Link href="/booking">Gửi yêu cầu và đặt lịch</Link>
								</Button>
								<Button asChild variant="outline" className="border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50">
									<Link href="/gallery">Xem mẫu tóc trước</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					<div className="space-y-6">
						<Card className="border-zinc-200/80 bg-zinc-950 text-white shadow-sm">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-2xl text-white">
									<Clock3 className="h-5 w-5 text-amber-300" />
									Giờ mở cửa
								</CardTitle>
								<CardDescription className="text-zinc-300">
									Salon nhận khách trong khung giờ dưới đây.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3 pb-6">
								{openingHours.map((item) => (
									<div key={item.day} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
										<span className="text-sm text-zinc-200">{item.day}</span>
										<span className="text-sm font-semibold text-white">{item.time}</span>
									</div>
								))}
							</CardContent>
						</Card>

						<Card className="border-zinc-200/80 bg-white shadow-sm">
							<CardHeader>
								<CardTitle className="text-2xl text-zinc-950">Hỗ trợ tại salon</CardTitle>
								<CardDescription className="text-sm leading-6">
									Các hỗ trợ thường gặp khi khách ghé hoặc cần tư vấn từ xa.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3 pb-6">
								{supportItems.map((item) => (
									<div key={item} className="flex items-start gap-3 rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
										<Star className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
										<span>{item}</span>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section id="location" className="container pb-16 sm:pb-20">
				<div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
					<Card className="border-zinc-200/80 bg-white shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-2xl text-zinc-950">
								<MapPin className="h-5 w-5 text-amber-500" />
								Chi nhánh
							</CardTitle>
							<CardDescription className="text-sm leading-6">
								Một số địa điểm gợi ý để khách dễ hình dung vị trí salon.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 pb-6">
							{branches.map((branch) => (
								<div key={branch.name} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
									<div className="flex items-center justify-between gap-3">
										<h3 className="font-semibold text-zinc-950">{branch.name}</h3>
										<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{branch.tag}</span>
									</div>
									<p className="mt-3 text-sm leading-6 text-zinc-600">{branch.address}</p>
									<p className="mt-2 text-sm font-medium text-zinc-950">{branch.phone}</p>
								</div>
							))}
						</CardContent>
					</Card>

					<Card className="overflow-hidden border-zinc-200/80 bg-zinc-950 text-white shadow-sm">
						<CardHeader>
							<CardTitle className="text-2xl text-white">Bản đồ & hướng dẫn</CardTitle>
							<CardDescription className="text-zinc-300">
								Khung bản đồ giả lập để trang đầy đủ hơn trong bản mock.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 pb-6">
							<div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_35%),linear-gradient(135deg,_rgba(24,24,27,0.98),_rgba(39,39,42,0.92))] p-6">
								<div className="absolute inset-0 opacity-20">
									<div className="absolute left-10 top-10 h-24 w-24 rounded-full border border-white/20" />
									<div className="absolute right-10 top-20 h-36 w-36 rounded-full border border-white/10" />
									<div className="absolute bottom-10 left-16 h-20 w-20 rounded-full border border-white/15" />
								</div>

								<div className="relative flex h-full flex-col justify-between">
									<div>
										<p className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-amber-200">
											<MapPin className="h-3.5 w-3.5" />
											Salon central
										</p>
										<h3 className="mt-4 text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
											123 Đường ABC, Hà Nội
										</h3>
										<p className="mt-3 max-w-md text-sm leading-6 text-zinc-300">
											Đi thẳng từ mặt đường chính, có chỗ gửi xe máy ngay phía trước
											và khu vực chờ riêng cho khách.
										</p>
									</div>

									<div className="grid gap-3 sm:grid-cols-2">
										<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
											<p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Thời gian di chuyển</p>
											<p className="mt-1 text-sm font-semibold text-white">15 phút từ trung tâm quận</p>
										</div>
										<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
											<p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Tiện ích</p>
											<p className="mt-1 text-sm font-semibold text-white">Wifi, nước uống, chỗ chờ</p>
										</div>
									</div>
								</div>
							</div>

							<Button asChild className="w-full bg-amber-400 text-zinc-950 hover:bg-amber-300">
								<Link href="/booking">Đặt lịch để salon giữ chỗ</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
