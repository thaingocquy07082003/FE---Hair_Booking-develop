"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarIcon,
  Check,
  Clock,
  MoreHorizontal,
  Scissors,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Dữ liệu mẫu cho lịch làm việc
const appointments = [
  {
    id: "app-1",
    customer: "Nguyễn Văn A",
    service: "Cắt tóc nam",
    hairstyle: "Undercut",
    date: new Date(),
    time: "09:00",
    status: "pending",
    phone: "0123456789",
    notes: "Tóc ngắn hai bên, để dài phía trên",
  },
  {
    id: "app-2",
    customer: "Trần Thị B",
    service: "Cắt tóc nữ",
    hairstyle: "Bob",
    date: new Date(),
    time: "10:30",
    status: "pending",
    phone: "0987654321",
    notes: "",
  },
  {
    id: "app-3",
    customer: "Lê Văn C",
    service: "Nhuộm tóc",
    hairstyle: "Highlight",
    date: new Date(),
    time: "13:00",
    status: "pending",
    phone: "0369852147",
    notes: "Màu nâu đỏ, highlight vàng nhạt",
  },
  {
    id: "app-4",
    customer: "Phạm Thị D",
    service: "Combo VIP Nữ",
    hairstyle: "Long Layers",
    date: new Date(),
    time: "15:30",
    status: "completed",
    phone: "0123789456",
    notes: "",
  },
];

export default function StaffPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null
  );
  const [completionNotes, setCompletionNotes] = useState("");

  const handleComplete = (id: string) => {
    console.log("Hoàn thành lịch hẹn:", id, "Ghi chú:", completionNotes);
    setSelectedAppointment(null);
    setCompletionNotes("");
  };

  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">
              Lịch làm việc
            </h1>
            <p className="text-gray-500">
              Quản lý lịch hẹn và khách hàng của bạn
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: vi })
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tổng quan</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Tổng số lịch hẹn</div>
                <div>{appointments.length}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Đã hoàn thành</div>
                <div>
                  {appointments.filter((a) => a.status === "completed").length}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Đang chờ</div>
                <div>
                  {appointments.filter((a) => a.status === "pending").length}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Đã hủy</div>
                <div>
                  {appointments.filter((a) => a.status === "cancelled").length}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Lịch hẹn hôm nay</CardTitle>
              <CardDescription>
                {format(date || new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="timeline">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="timeline">Dòng thời gian</TabsTrigger>
                  <TabsTrigger value="list">Danh sách</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline" className="mt-6">
                  <div className="relative">
                    <div className="absolute left-9 top-0 bottom-0 w-px bg-gray-200"></div>
                    <div className="space-y-6">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="flex gap-4">
                          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border bg-background">
                            <Clock className="h-4 w-4" />
                            <span className="sr-only">Thời gian</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-medium">
                              {appointment.time}
                            </div>
                            <div
                              className={cn(
                                "rounded-lg border p-4",
                                appointment.status === "completed" &&
                                  "border-green-200 bg-green-50",
                                appointment.status === "pending" &&
                                  "border-blue-200 bg-blue-50",
                                appointment.status === "cancelled" &&
                                  "border-red-200 bg-red-50"
                              )}
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <p className="font-medium">
                                      {appointment.customer}
                                    </p>
                                    <span
                                      className={cn(
                                        "ml-2 rounded-full px-2 py-0.5 text-xs",
                                        appointment.status === "completed" &&
                                          "bg-green-100 text-green-700",
                                        appointment.status === "pending" &&
                                          "bg-blue-100 text-blue-700",
                                        appointment.status === "cancelled" &&
                                          "bg-red-100 text-red-700"
                                      )}
                                    >
                                      {appointment.status === "completed" &&
                                        "Hoàn thành"}
                                      {appointment.status === "pending" &&
                                        "Đang chờ"}
                                      {appointment.status === "cancelled" &&
                                        "Đã hủy"}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Scissors className="h-4 w-4" />
                                      <span>{appointment.service}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span>•</span>
                                      <span>{appointment.hairstyle}</span>
                                    </div>
                                  </div>
                                  {appointment.notes && (
                                    <div className="text-sm text-gray-500 mt-2">
                                      <p className="font-medium">Ghi chú:</p>
                                      <p>{appointment.notes}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 self-end md:self-center">
                                  {appointment.status === "pending" && (
                                    <>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button size="sm">
                                            <Check className="mr-2 h-4 w-4" />
                                            Hoàn thành
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>
                                              Xác nhận hoàn thành
                                            </DialogTitle>
                                            <DialogDescription>
                                              Xác nhận hoàn thành lịch hẹn của
                                              khách hàng {appointment.customer}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                              <p className="text-sm font-medium">
                                                Ghi chú hoàn thành (tùy chọn)
                                              </p>
                                              <Textarea
                                                placeholder="Nhập ghi chú về dịch vụ đã thực hiện"
                                                value={completionNotes}
                                                onChange={(e) =>
                                                  setCompletionNotes(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                          <DialogFooter>
                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                setCompletionNotes("")
                                              }
                                            >
                                              Hủy
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                handleComplete(appointment.id)
                                              }
                                            >
                                              Xác nhận hoàn thành
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            <X className="mr-2 h-4 w-4" />
                                            Hủy
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>
                                              Xác nhận hủy lịch
                                            </DialogTitle>
                                            <DialogDescription>
                                              Bạn có chắc chắn muốn hủy lịch hẹn
                                              của khách hàng{" "}
                                              {appointment.customer}?
                                            </DialogDescription>
                                          </DialogHeader>
                                          <DialogFooter>
                                            <Button variant="outline">
                                              Không
                                            </Button>
                                            <Button variant="destructive">
                                              Có, hủy lịch
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    </>
                                  )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          Tùy chọn
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        Xem chi tiết
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Gọi khách hàng
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Gửi tin nhắn
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="list" className="mt-6">
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={cn(
                          "flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg border p-4",
                          appointment.status === "completed" &&
                            "border-green-200 bg-green-50",
                          appointment.status === "pending" &&
                            "border-blue-200 bg-blue-50",
                          appointment.status === "cancelled" &&
                            "border-red-200 bg-red-50"
                        )}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <p className="font-medium">{appointment.time}</p>
                            <span
                              className={cn(
                                "ml-2 rounded-full px-2 py-0.5 text-xs",
                                appointment.status === "completed" &&
                                  "bg-green-100 text-green-700",
                                appointment.status === "pending" &&
                                  "bg-blue-100 text-blue-700",
                                appointment.status === "cancelled" &&
                                  "bg-red-100 text-red-700"
                              )}
                            >
                              {appointment.status === "completed" &&
                                "Hoàn thành"}
                              {appointment.status === "pending" && "Đang chờ"}
                              {appointment.status === "cancelled" && "Đã hủy"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-gray-500" />
                              <span>{appointment.customer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Scissors className="h-4 w-4 text-gray-500" />
                              <span>{appointment.service}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 self-end md:self-center">
                          {appointment.status === "pending" && (
                            <>
                              <Button size="sm">
                                <Check className="mr-2 h-4 w-4" />
                                Hoàn thành
                              </Button>
                              <Button variant="outline" size="sm">
                                <X className="mr-2 h-4 w-4" />
                                Hủy
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/staff/appointments/${appointment.id}`}
                            >
                              Chi tiết
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
