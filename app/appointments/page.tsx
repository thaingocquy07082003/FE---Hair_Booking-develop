"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  cancelAppointment,
  getAppointments,
} from "@/services/appointment/appointment";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getInvoicesListByUser } from "@/services/invoices/invoice.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createReview, updateReview } from "@/services/review/review.api";

type Appointment = {
  id: number;
  _id: string;
  service: string;
  date: Date;
  username: string;
  phone: string;
  notes: string;
  branch: string;
  status: "accepted" | "cancelled";
};

type ServiceHistory = {
  id: string;
  _id: string;
  date: string;
  service: string;
  stylist: string;
  total: string;
  phone: string;
  branchId: string;
  branch: string;
  username: string;
  stylistId: string;
  serviceId: string;
  rating?: number;
  review?: string;
  reviewId?: string;
};

export default function AppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "appointments";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [serviceHistoryData, setServiceHistoryData] = useState<
    ServiceHistory[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceHistory | null>(
    null
  );
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId);
      toast.success("Hủy lịch thành công");
      // Refresh appointments data
      const appointmentsResponse = await getAppointments();
      const updatedAppointments = appointmentsResponse.map(
        (appointment: any, index: number) => ({
          id: index + 1,
          _id: appointment._id,
          service: appointment.service,
          date: new Date(appointment.date).toLocaleString("vi-VN"),
          username: appointment.username,
          branch: appointment.branch,
          phone: appointment.phone,
          notes: appointment.notes,
          status: appointment.status,
        })
      );
      setAppointmentsData(updatedAppointments);
      setShowCancelDialog(false);
      setSelectedAppointmentId(null);
    } catch (error) {
      toast.error("Không thể hủy lịch. Vui lòng thử lại sau.");
    }
  };

  // Hàm tạo dữ liệu giả cho historyResponse
  const getDataHistory = async (): Promise<ServiceHistory[]> => {
    try {
      const invoicesResponse = await getInvoicesListByUser();
      console.log(invoicesResponse);
      return invoicesResponse.map((invoice: any, index: number) => ({
        id: index + 1,
        _id: invoice.id,
        date: new Date(invoice.date).toLocaleString("vi-VN"),
        service: invoice.service,
        stylist: invoice.stylist,
        total: invoice.total,
        phone: invoice.phone,
        branchId: invoice.branchId,
        branch: invoice.branch,
        username: invoice.username,
        stylistId: invoice.stylistId,
        serviceId: invoice.serviceId,
        reviewId: invoice.reviewId,
        rating: invoice.rating,
        review: invoice.review,
      }));
    } catch (error) {
      console.error("Get fake history data error:", error);
      return [];
    }
  };
  // Gọi API và sử dụng dữ liệu giả cho historyResponse
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Gọi API cho appointments (giữ nguyên nếu bạn muốn gọi API thật)
        const appointmentsResponse = await getAppointments();
        // const appointments = await appointmentsResponse.json();

        const appointmentsData = appointmentsResponse.map(
          (appointment: any, index: number) => ({
            id: index + 1,
            _id: appointment._id,
            service: appointment.service,
            date: new Date(appointment.date).toLocaleString("vi-VN"),
            username: appointment.username,
            branch: appointment.branch,
            phone: appointment.phone,
            notes: appointment.notes,
            status: appointment.status,
          })
        );

        setAppointmentsData(appointmentsData);

        // Sử dụng dữ liệu giả cho historyResponse thay vì gọi API
        const history = await getDataHistory();
        setServiceHistoryData(history);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi get data ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cập nhật tab khi search params thay đổi
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    router.replace(`?tab=${newTab}`, { scroll: false });
  };

  const appointmentColumnHelper = createColumnHelper<Appointment>();
  const appointmentColumns = useMemo(
    () => [
      appointmentColumnHelper.accessor("id", { header: "STT" }),
      appointmentColumnHelper.accessor("service", { header: "Dịch vụ" }),
      appointmentColumnHelper.accessor("date", { header: "Thời gian đặt" }),
      appointmentColumnHelper.accessor("username", { header: "Họ tên" }),
      appointmentColumnHelper.accessor("phone", { header: "Số điện thoại" }),
      appointmentColumnHelper.accessor("notes", { header: "Ghi chú" }),
      appointmentColumnHelper.accessor("branch", { header: "Chi nhánh" }),
      appointmentColumnHelper.accessor("status", {
        header: "Trạng thái",
        cell: (info) => {
          const status = info.getValue();
          const isAccepted = status === "accepted";
          const appointmentDate = new Date(info.row.original.date);

          return (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isAccepted
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isAccepted ? "Xác nhận" : "Đã hủy"}
              </span>
              {isAccepted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedAppointmentId(info.row.original._id);
                        setShowCancelDialog(true);
                      }}
                      className="text-red-600"
                    >
                      Hủy lịch
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        },
      }),
    ],
    []
  );

  const historyColumnHelper = createColumnHelper<ServiceHistory>();
  const serviceHistoryColumns = useMemo(
    () => [
      historyColumnHelper.accessor("id", { header: "STT" }),
      historyColumnHelper.accessor("service", { header: "Dịch vụ" }),
      historyColumnHelper.accessor("branch", { header: "Chi nhánh" }),
      historyColumnHelper.accessor("stylist", { header: "Tên thợ cắt tóc" }),
      historyColumnHelper.accessor("date", { header: "Ngày cắt tóc" }),
      historyColumnHelper.accessor("total", { header: "Tổng tiền" }),
      historyColumnHelper.display({
        id: "actions",
        header: "Đánh giá",
        cell: (info) => {
          const service = info.row.original;
          return (
            <div className="flex items-center gap-2">
              {service.rating ? (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= service.rating!
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openRatingDialog(service)}
                  >
                    Sửa
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openRatingDialog(service)}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Đánh giá
                </Button>
              )}
            </div>
          );
        },
      }),
    ],
    []
  );

  const appointmentsTable = useReactTable({
    data: appointmentsData,
    columns: appointmentColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const serviceHistoryTable = useReactTable({
    data: serviceHistoryData,
    columns: serviceHistoryColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRating = async () => {
    if (!selectedService) return;
    try {
      if (isEditing) {
        if (!selectedService.reviewId) {
          toast.error("Không tìm thấy đánh giá để cập nhật");
          return;
        }
        await updateReview({
          rating,
          review,
          reviewId: selectedService.reviewId,
        });
        toast.success("Cập nhật đánh giá thành công!");
      } else {
        // Thêm đánh giá mới
        console.log(
          "==========================================",
          selectedService
        );
        await createReview({
          rating,
          review,
          invoiceId: selectedService._id,
        });
        toast.success("Cảm ơn bạn đã đánh giá!");
      }

      // Refresh data
      const history = await getDataHistory();
      setServiceHistoryData(history);

      setShowRatingDialog(false);
      setRating(0);
      setReview("");
      setIsEditing(false);
    } catch (error) {
      toast.error("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    }
  };

  const openRatingDialog = (service: ServiceHistory) => {
    setSelectedService(service);
    if (service.rating) {
      // Nếu đã có đánh giá, set giá trị hiện tại
      setRating(service.rating);
      setReview(service.review || "");
      setIsEditing(true);
    } else {
      // Nếu chưa có đánh giá, reset form
      setRating(0);
      setReview("");
      setIsEditing(false);
    }
    setShowRatingDialog(true);
  };

  if (isLoading) {
    return <div className="container py-12">Đang tải...</div>;
  }

  if (error) {
    return <div className="container py-12">Lỗi: {error}</div>;
  }

  return (
    <div className="container py-12">
      <div className="flex mb-8 border-b">
        <a
          href="?tab=appointments"
          onClick={(e) => {
            e.preventDefault();
            handleTabChange("appointments");
          }}
          className={`px-6 py-3 font-medium text-lg cursor-pointer relative ${
            activeTab === "appointments"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Lịch hẹn
          {activeTab === "appointments" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              initial={false}
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
        </a>
        <a
          href="?tab=history"
          onClick={(e) => {
            e.preventDefault();
            handleTabChange("history");
          }}
          className={`px-6 py-3 font-medium text-lg cursor-pointer relative ${
            activeTab === "history"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Lịch sử
          {activeTab === "history" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              initial={false}
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
        </a>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "appointments" ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      {appointmentsTable
                        .getHeaderGroups()
                        .map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th
                                key={header.id}
                                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </th>
                            ))}
                          </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointmentsTable.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      {serviceHistoryTable
                        .getHeaderGroups()
                        .map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th
                                key={header.id}
                                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </th>
                            ))}
                          </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {serviceHistoryTable.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy lịch</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy lịch hẹn này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedAppointmentId &&
                handleCancelAppointment(selectedAppointmentId)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Có, hủy lịch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Sửa đánh giá" : "Đánh giá dịch vụ"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Cập nhật đánh giá của bạn về dịch vụ này"
                : "Chia sẻ trải nghiệm của bạn về dịch vụ này"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Nhập đánh giá của bạn..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRatingDialog(false);
                  setRating(0);
                  setReview("");
                  setIsEditing(false);
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleRating}>
                {isEditing ? "Cập nhật" : "Gửi đánh giá"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết dịch vụ</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Dịch vụ</p>
                  <p className="mt-1">{selectedService.service}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Thợ cắt tóc
                  </p>
                  <p className="mt-1">{selectedService.stylist}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Ngày thực hiện
                  </p>
                  <p className="mt-1">{selectedService.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng tiền</p>
                  <p className="mt-1">{selectedService.total}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Chi nhánh</p>
                  <p className="mt-1">{selectedService.branchId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Số điện thoại
                  </p>
                  <p className="mt-1">{selectedService.phone}</p>
                </div>
              </div>
              {selectedService.rating && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Đánh giá</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= selectedService.rating!
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {selectedService.review && (
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedService.review}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
