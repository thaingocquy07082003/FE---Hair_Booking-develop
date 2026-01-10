"use client";

import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarIcon,
  Check,
  Clock,
  LogIn,
  Scissors,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getServiceList } from "@/services/service/get-service-list.api";
import {
  getAllStylists,
  getAvailableBooking,
  getBranchsList,
} from "@/services/service/get-branchs-list.api";
import { toast } from "sonner";
import { createAppointment } from "@/services/appointment/appointment";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

// Utility function to format price
const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US")}`;
};

// Dữ liệu mẫu cho dịch vụ
const services = await getServiceList();
const branchs = await getBranchsList();
const allStylists = await getAllStylists();
// Dữ liệu mẫu cho nhân viên

// Dữ liệu mẫu cho khung giờ
const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

// Schema cho form đặt lịch
const formSchema = z.object({
  service: z.string({ required_error: "Vui lòng chọn dịch vụ" }),
  branch: z.string({ required_error: "Vui lòng chọn Branch" }),
  stylist: z.string({ required_error: "Vui lòng chọn thợ cắt tóc" }),
  date: z.date({ required_error: "Vui lòng chọn ngày" }),
  time: z.string({ required_error: "Vui lòng chọn giờ" }),
  name: z.string().min(2, { message: "Vui lòng nhập tên của bạn" }),
  phone: z.string().min(10, { message: "Vui lòng nhập số điện thoại hợp lệ" }),
  notes: z.string().optional(),
});

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [stylists, setStylists] = useState<any[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>(timeSlots);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      notes: "",
      stylist: "",
    },
  });

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    form.setValue("service", serviceId);
    setStep(2);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const hour = values.time.split(":")[0];
    const minute = values.time.split(":")[1];
    const date = new Date(values.date);
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
    date.setSeconds(0);
    date.setMilliseconds(0);

    try {
      const response = await createAppointment({
        branchId: values.branch,
        serviceId: values.service,
        date: date,
        phone: values.phone,
        notes: values.notes,
        username: values.name,
        hairStylistId: form.getValues("stylist"),
      });

      console.log("==========================================", response);
      if (response.status === 201) {
        toast.success("Đặt lịch thành công");
        setIsBookingComplete(true);
      } else {
        toast.error("Xin lỗi, khung giờ bạn chọn hiện không còn trống.");
      }
    } catch (error) {
      toast.error("Xin lỗi, khung giờ bạn chọn hiện không còn trống.");
    }
  }

  // Mock API function (replace with real API call)
  async function getAvailableTimes(stylistId: string, date: Date) {
    const dataAvaiableBooking = await getAvailableBooking(stylistId, date);
    return dataAvaiableBooking;
  }

  // useEffect to fetch available times when stylist and date are selected
  useEffect(() => {
    const stylistId = form.getValues("stylist");
    const date = form.getValues("date");
    if (stylistId && date) {
      getAvailableTimes(stylistId, date).then(setAvailableTimes);
    } else {
      setAvailableTimes(timeSlots);
    }
  }, [form.watch("stylist"), form.watch("date")]);

  if (isBookingComplete) {
    return (
      <div className="container py-12 px-4 md:px-6">
        <div className="mx-auto max-w-md space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Đặt lịch thành công!</CardTitle>
              <CardDescription>
                Cảm ơn bạn đã đặt lịch với chúng tôi. Chúng tôi đã gửi email xác
                nhận đến địa chỉ email của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="grid gap-2">
                  <div className="font-medium">Thông tin đặt lịch</div>
                  <div className="grid gap-1 text-sm">
                    {/* <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Mã đặt lịch:
                      </span>
                      <span className="font-medium">
                        BK-
                        {Math.floor(Math.random() * 10000)
                          .toString()
                          .padStart(4, "0")}
                      </span>
                    </div> */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dịch vụ:</span>
                      <span>
                        {
                          services.find(
                            (s: any) => s._id === form.getValues("service")
                          )?.name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ngày:</span>
                      <span>
                        {form.getValues("date") &&
                          format(form.getValues("date"), "PPP", { locale: vi })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giờ:</span>
                      <span>{form.getValues("time")}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="grid gap-2">
                  <div className="font-medium">Thông tin liên hệ</div>
                  <div className="grid gap-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Họ và tên:</span>
                      <span>{form.getValues("name")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Số điện thoại:
                      </span>
                      <span>{form.getValues("phone")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" asChild>
                <Link href="/appointments">Xem lịch hẹn của tôi</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Quay lại trang chủ</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

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
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Đặt lịch cắt tóc
          </h1>
          <p className="text-gray-500">
            Chọn dịch vụ và thời gian phù hợp với bạn
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center">
          <ol className="flex items-center w-full max-w-md">
            <li
              className={cn(
                "flex items-center text-blue-600 dark:text-blue-500 space-x-2.5",
                step > 1 && "text-green-600 dark:text-green-500"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-8 h-8 border rounded-full shrink-0",
                  step === 1 && "border-blue-600 dark:border-blue-500",
                  step > 1 && "border-green-600 dark:border-green-500"
                )}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </span>
              <span>
                <h3 className="font-medium leading-tight">Chọn dịch vụ</h3>
              </span>
            </li>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700 mx-2.5"></div>
            <li
              className={cn(
                "flex items-center space-x-2.5",
                step === 2 && "text-blue-600 dark:text-blue-500",
                step > 2 && "text-green-600 dark:text-green-500",
                step < 2 && "text-gray-500 dark:text-gray-400"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-8 h-8 border rounded-full shrink-0",
                  step === 2 && "border-blue-600 dark:border-blue-500",
                  step > 2 && "border-green-600 dark:border-green-500",
                  step < 2 && "border-gray-500 dark:border-gray-400"
                )}
              >
                {step > 2 ? <Check className="w-4 h-4" /> : "2"}
              </span>
              <span>
                <h3 className="font-medium leading-tight">
                  Thông tin đặt lịch
                </h3>
              </span>
            </li>
          </ol>
        </div>

        {/* Step 1: Chọn dịch vụ */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service: any) => (
                <Card
                  key={service.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    selectedService === service.id && "border-primary"
                  )}
                  onClick={() => handleServiceSelect(service._id)}
                >
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {service.duration} phút.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {formatPrice(service.price)} VND.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={
                        selectedService === service.id ? "default" : "outline"
                      }
                      className="w-full"
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      {selectedService === service.id ? "Đã chọn" : "Chọn"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Thông tin đặt lịch */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đặt lịch</CardTitle>
              <CardDescription>
                Vui lòng điền đầy đủ thông tin để hoàn tất đặt lịch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Scissors className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Dịch vụ đã chọn</h3>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {
                              services.find(
                                (s: any) => s._id === selectedService
                              )?.name
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {services.find(
                              (s: any) => s._id === selectedService
                            )?.duration + " phút"}{" "}
                            •{" "}
                            {formatPrice(
                              services.find(
                                (s: any) => s._id === selectedService
                              )?.price
                            ) + " VND"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStep(1)}
                        >
                          Thay đổi
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="branch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chọn Branch</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedBranch(value);
                                setStylists(
                                  allStylists.filter(
                                    (stylist: any) => stylist.branchId === value
                                  )
                                );
                                form.setValue("stylist", ""); // reset stylist when branch changes
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn Branch" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {branchs.map((branch: any) => (
                                  <SelectItem
                                    key={branch._id}
                                    value={branch._id}
                                  >
                                    {branch.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Show stylist select only if a branch is selected */}
                      {selectedBranch && (
                        <FormField
                          control={form.control}
                          name="stylist"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chọn thợ cắt tóc</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value as string}
                                disabled={!selectedBranch}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        !selectedBranch
                                          ? "Vui lòng chọn chi nhánh trước"
                                          : "Chọn thợ cắt tóc"
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {!selectedBranch ? (
                                    <SelectItem
                                      key="no-branch"
                                      value=""
                                      disabled
                                    >
                                      Vui lòng chọn chi nhánh trước
                                    </SelectItem>
                                  ) : stylists.length === 0 ? (
                                    <SelectItem
                                      key="no-stylist"
                                      value=""
                                      disabled
                                    >
                                      Không có thợ nào cho chi nhánh này
                                    </SelectItem>
                                  ) : (
                                    stylists.map((stylist: any) => (
                                      <SelectItem
                                        key={stylist._id}
                                        value={stylist._id}
                                      >
                                        {stylist.username}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Ngày</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: vi })
                                    ) : (
                                      <span>Chọn ngày</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giờ</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-4 gap-2 md:grid-cols-8"
                            >
                              {availableTimes.map((time) => (
                                <div key={time}>
                                  <RadioGroupItem
                                    value={time}
                                    id={`time-${time}`}
                                    className="peer sr-only"
                                  />
                                  <Label
                                    htmlFor={`time-${time}`}
                                    className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                  >
                                    {time}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                              <Input placeholder="Nguyễn Văn A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input placeholder="0123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (nếu có)"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Quay lại
                    </Button>
                    <Button type="submit">Xác nhận đặt lịch</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
