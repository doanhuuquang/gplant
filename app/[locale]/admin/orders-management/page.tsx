"use client";

import { Button } from "@/components/ui/button";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  ListTodo,
  Receipt,
  Search,
  Van,
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useMemo, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePlantDialog } from "@/app/[locale]/admin/plants-management/create-plant-dialog";
import { columns } from "@/app/[locale]/admin/orders-management/columns";
import { useOrders } from "@/lib/hooks/use-order";

export const OrderStatusLabel: { value: string; label: string }[] = [
  { value: "Pending", label: "Chờ xác nhận" },
  { value: "Confirmed", label: "Đã xác nhận" },
  { value: "Processing", label: "Đang xử lý" },
  { value: "Shipped", label: "Đang giao" },
  { value: "Delivered", label: "Đã giao" },
  { value: "Cancelled", label: "Đã huỷ" },
  { value: "Refunded", label: "Đã hoàn tiền" },
];

export const PaymentStatusLabel: { value: string; label: string }[] = [
  { value: "Pending", label: "Chờ thanh toán" },
  { value: "AwaitingPayment", label: "Đang chờ thanh toán" },
  { value: "Paid", label: "Đã thanh toán" },
  { value: "Failed", label: "Thanh toán thất bại" },
  { value: "Refunded", label: "Đã hoàn tiền" },
];

export const PaymentMethodLabel: { value: string; label: string }[] = [
  { value: "COD", label: "COD" },
  { value: "BankTransfer", label: "Chuyển khoản" },
  { value: "VNPay", label: "VNPay" },
];

export default function OrdersManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const queryParams = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : undefined;
    const to = toDate ? new Date(toDate) : undefined;

    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    return {
      pageNumber: page,
      pageSize,
      fromDate: from,
      toDate: to,
    };
  }, [fromDate, page, pageSize, toDate]);

  const { data, isLoading } = useOrders(queryParams);

  const filteredOrders = useMemo(() => {
    return data?.data.items.filter((order) => {
      const matchStatus =
        orderStatusFilter === "all" ||
        orderStatusFilter === "" ||
        (order.status as unknown as string) === orderStatusFilter;

      const matchPayment =
        paymentStatusFilter === "all" ||
        paymentStatusFilter === "" ||
        (order.paymentStatus as unknown as string) === paymentStatusFilter;

      const matchPaymentMethod =
        paymentMethodFilter === "all" ||
        paymentMethodFilter === "" ||
        (order.paymentMethod as unknown as string) === paymentMethodFilter;

      const createdAt = new Date(order.createdAtUtc);
      const matchFromDate = !fromDate || createdAt >= new Date(fromDate);
      const matchToDate =
        !toDate ||
        createdAt <= new Date(new Date(toDate).setHours(23, 59, 59, 999));

      return (
        matchStatus &&
        matchPayment &&
        matchPaymentMethod &&
        matchFromDate &&
        matchToDate
      );
    });
  }, [
    data,
    fromDate,
    orderStatusFilter,
    paymentMethodFilter,
    paymentStatusFilter,
    toDate,
  ]);

  const headerActions = useMemo(
    () => (
      <>
        <InputGroup className="w-full max-w-xl border-transparent bg-muted dark:bg-background">
          <InputGroupInput
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
        </InputGroup>
      </>
    ),
    [searchQuery],
  );

  useAdminHeader(headerActions);

  return (
    <>
      <div className="w-full grid lg:grid-cols-4 grid-cols-1 gap-2 bg-background p-4 border rounded-sm">
        <div className="w-full bg-blue-600/10 p-4 border border-blue-600 rounded-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Đơn mới trong tuần</p>
              <p className="text-2xl font-bold text-blue-600">
                {data?.data.todayOrderCount || 0}
              </p>
            </div>
            <Box className="size-6 text-blue-600" />
          </div>
        </div>

        <div className="w-full bg-green-600/10 p-4 border border-green-600 rounded-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Doanh thu hôm nay</p>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(data?.data.todayRevenue || 0)}
              </p>
            </div>
            <Receipt className="size-6 text-green-600" />
          </div>
        </div>

        <div className="w-full bg-yellow-600/10 p-4 border border-yellow-600 rounded-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Đơn chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">
                {data?.data.pendingOrderCount || 0}
              </p>
            </div>
            <ListTodo className="size-6 text-yellow-600" />
          </div>
        </div>

        <div className="w-full bg-purple-600/10 p-4 border border-purple-600 rounded-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Đơn đang giao</p>
              <p className="text-2xl font-bold text-purple-600">
                {data?.data.deliveringOrderCount || 0}
              </p>
            </div>
            <Van className="size-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="w-full flex gap-2 justify-end flex-wrap bg-background p-4 border rounded-sm">
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-12 bg-background border-border"
          />
          <p className="text-xs text-muted-foreground">đến</p>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-12 bg-background border-border"
          />
        </div>

        <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
          <SelectTrigger className="h-12! rounded-sm shadow-none bg-background">
            <SelectValue placeholder="Trạng thái đơn hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>Tất cả</SelectItem>
            {OrderStatusLabel.map((status, index) => (
              <SelectItem key={index} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={paymentStatusFilter}
          onValueChange={setPaymentStatusFilter}
        >
          <SelectTrigger className="h-12! rounded-sm shadow-none bg-background">
            <SelectValue placeholder="Trạng thái thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>Tất cả</SelectItem>
            {PaymentStatusLabel.map((status, index) => (
              <SelectItem key={index} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={paymentMethodFilter}
          onValueChange={setPaymentMethodFilter}
        >
          <SelectTrigger className="h-12! rounded-sm shadow-none bg-background">
            <SelectValue placeholder="Phương thức thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>Tất cả</SelectItem>
            {PaymentMethodLabel.map((status, index) => (
              <SelectItem key={index} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders || []}
        isLoading={isLoading}
        globalFilter={searchQuery}
      />

      <div className="flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">
            Số dòng mỗi trang
          </FieldLabel>
          <Select
            defaultValue="10"
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size={"icon"}
            disabled={!data?.data.hasPreviousPage}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size={"icon"}
            disabled={!data?.data.hasNextPage}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <CreatePlantDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
