"use client";

import { useState } from "react";
import { Search, Star, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

// Dữ liệu mẫu cho thợ cắt tóc
const stylists = [
  {
    id: "1",
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
  },
  {
    id: "2",
    name: "Trần Thị B",
    role: "Stylist",
    rating: 4.6,
    reviews: 95,
    experience: "3 năm",
    specialties: ["Cắt tóc nữ", "Uốn tóc", "Phục hồi tóc"],
    image: "/images/stylist-2.jpg",
    location: "Quận 3, TP.HCM",
    phone: "0987 654 321",
    email: "tranthib@example.com",
  },
  {
    id: "3",
    name: "Lê Văn C",
    role: "Junior Stylist",
    rating: 4.5,
    reviews: 76,
    experience: "2 năm",
    specialties: ["Cắt tóc nam", "Tạo kiểu"],
    image:
      "https://media.istockphoto.com/id/640274128/vi/anh/th%E1%BB%A3-c%E1%BA%AFt-t%C3%B3c-s%E1%BB%AD-d%E1%BB%A5ng-k%C3%A9o-v%C3%A0-l%C6%B0%E1%BB%A3c.jpg?s=612x612&w=0&k=20&c=o82ARZnhqPdFAqU6WOWLnnP-Z7dGi22crXtevsOguAU=",
    location: "Quận 5, TP.HCM",
    phone: "0369 852 147",
    email: "levanc@example.com",
  },
  {
    id: "4",
    name: "Nguyễn Văn D",
    role: "Junior Stylist",
    rating: 4.5,
    reviews: 76,
    experience: "2 năm",
    specialties: ["Cắt tóc nam", "Tạo kiểu"],
    image: "/images/stylist-3.jpg",
    location: "Quận 5, TP.HCM",
    phone: "0369 852 147",
    email: "nguyenvand@example.com",
  },
];

export default function StylistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const router = useRouter();

  const filteredStylists = stylists.filter((stylist) =>
    stylist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStylists = [...filteredStylists].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "reviews") {
      return b.reviews - a.reviews;
    }
    return 0;
  });

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Thợ cắt tóc</h1>
          <p className="text-gray-500">
            Tìm kiếm và đặt lịch với thợ cắt tóc phù hợp
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Tìm kiếm thợ cắt tóc..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              <SelectItem value="reviews">Nhiều đánh giá nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedStylists.map((stylist) => (
          <Card
            key={stylist.id}
            className="overflow-hidden group hover:shadow-lg transition-shadow duration-300"
          >
            <div
              className="relative h-64 cursor-pointer"
              onClick={() => router.push(`/stylists/${stylist.id}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img
                src={stylist.image}
                alt={stylist.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200">
                  Đặt lịch
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
