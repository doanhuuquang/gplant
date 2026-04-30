"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDashboardLowStockAlerts,
  useDashboardOverview,
  useDashboardRecentOrders,
  useDashboardRevenueChart,
} from "@/lib/hooks/use-dashboard";
import { OrderStatus } from "@/lib/enums/order-status";
import { PaymentMethod } from "@/lib/enums/payment-method";
import { PaymentStatus } from "@/lib/enums/payment-status";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CircleDollarSign,
  PackageCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const ORDER_STATUS_LABELS: Record<string, string> = {
  Pending: "Chờ xử lý",
  Confirmed: "Đã xác nhận",
  Processing: "Đang xử lý",
  Shipped: "Đã gửi",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
  Refunded: "Đã hoàn tiền",
};

const normalizeOrderStatus = (status: OrderStatus | string) =>
  typeof status === "string" ? status : OrderStatus[status];

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "Chờ thanh toán",
  [PaymentStatus.AwaitingPayment]: "Đang chờ",
  [PaymentStatus.Paid]: "Đã thanh toán",
  [PaymentStatus.Failed]: "Thất bại",
  [PaymentStatus.Refunded]: "Hoàn tiền",
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.COD]: "COD",
  [PaymentMethod.BankTransfer]: "Chuyển khoản",
  [PaymentMethod.VNPay]: "VNPay",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value);

const SUMMARY_COLORS = [
  { bg: "bg-blue-600/10", border: "border-blue-600", text: "text-blue-600" },
  { bg: "bg-sky-600/10", border: "border-sky-600", text: "text-sky-600" },
  { bg: "bg-cyan-600/10", border: "border-cyan-600", text: "text-cyan-600" },
  { bg: "bg-teal-600/10", border: "border-teal-600", text: "text-teal-600" },
  {
    bg: "bg-emerald-600/10",
    border: "border-emerald-600",
    text: "text-emerald-600",
  },
  { bg: "bg-green-600/10", border: "border-green-600", text: "text-green-600" },
  { bg: "bg-lime-600/10", border: "border-lime-600", text: "text-lime-600" },
  {
    bg: "bg-yellow-600/10",
    border: "border-yellow-600",
    text: "text-yellow-600",
  },
  { bg: "bg-amber-600/10", border: "border-amber-600", text: "text-amber-600" },
  {
    bg: "bg-orange-600/10",
    border: "border-orange-600",
    text: "text-orange-600",
  },
  { bg: "bg-red-600/10", border: "border-red-600", text: "text-red-600" },
  { bg: "bg-rose-600/10", border: "border-rose-600", text: "text-rose-600" },
  { bg: "bg-pink-600/10", border: "border-pink-600", text: "text-pink-600" },
  {
    bg: "bg-fuchsia-600/10",
    border: "border-fuchsia-600",
    text: "text-fuchsia-600",
  },
  {
    bg: "bg-purple-600/10",
    border: "border-purple-600",
    text: "text-purple-600",
  },
  {
    bg: "bg-violet-600/10",
    border: "border-violet-600",
    text: "text-violet-600",
  },
  {
    bg: "bg-indigo-600/10",
    border: "border-indigo-600",
    text: "text-indigo-600",
  },
  { bg: "bg-slate-600/10", border: "border-slate-600", text: "text-slate-600" },
] as const;

export default function Page() {
  const overviewQuery = useDashboardOverview();
  const revenueQuery = useDashboardRevenueChart(7);
  const recentOrdersQuery = useDashboardRecentOrders(6);
  const lowStockQuery = useDashboardLowStockAlerts(10);

  const overview = overviewQuery.data?.data;
  const revenueChart = revenueQuery.data?.data;
  const recentOrders = recentOrdersQuery.data?.data ?? [];
  const lowStockAlerts = lowStockQuery.data?.data;
  const revenueSeries = revenueChart
    ? revenueChart.labels.map((label, index) => ({
        label,
        revenue: revenueChart.data[index] ?? 0,
      }))
    : [];

  return (
    <main className="flex flex-col gap-2">
      <section className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          colorIndex={0}
          icon={CircleDollarSign}
          label="Doanh thu hôm nay"
          value={
            overviewQuery.isLoading
              ? ""
              : formatCurrency(overview?.revenue.today ?? 0)
          }
          loading={overviewQuery.isLoading}
        />
        <SummaryCard
          colorIndex={1}
          icon={ShoppingBag}
          label="Đơn hàng hôm nay"
          value={
            overviewQuery.isLoading
              ? ""
              : formatNumber(overview?.orders.today ?? 0)
          }
          loading={overviewQuery.isLoading}
        />
        <SummaryCard
          colorIndex={2}
          icon={PackageCheck}
          label="Đơn đang giao"
          value={
            overviewQuery.isLoading
              ? ""
              : formatNumber(overview?.orders.delivering ?? 0)
          }
          loading={overviewQuery.isLoading}
        />
        <SummaryCard
          colorIndex={3}
          icon={Users}
          label="Người dùng hoạt động"
          value={
            overviewQuery.isLoading
              ? ""
              : formatNumber(overview?.users.active ?? 0)
          }
          loading={overviewQuery.isLoading}
        />
      </section>

      <section className="grid gap-2 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày</CardTitle>
            <CardDescription>
              Tổng quan doanh thu theo từng ngày gần nhất.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              // <RevenueChart
              //   labels={revenueChart?.labels ?? []}
              //   data={revenueChart?.data ?? []}
              // />

              <ChartContainer
                config={{
                  revenue: {
                    label: "Doanh thu",
                    color: "var(--chart-2)",
                  },
                }}
              >
                <BarChart accessibilityLayer data={revenueSeries}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 6)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelKey="label"
                        formatter={(value) =>
                          formatCurrency(typeof value === "number" ? value : 0)
                        }
                      />
                    }
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={8}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cảnh báo tồn kho</CardTitle>
            <CardDescription>
              Các biến thể sắp hết hàng hoặc đã hết.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowStockQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 rounded-sm border bg-muted/20 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tổng cảnh báo</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(lowStockAlerts?.totalAlerts ?? 0)} mục
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <StockList
                    title="Hết hàng"
                    items={lowStockAlerts?.outOfStock ?? []}
                  />
                  <StockList
                    title="Sắp hết"
                    items={lowStockAlerts?.lowStock ?? []}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="mt-0">
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
          <CardDescription>Danh sách 6 đơn hàng mới nhất.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrdersQuery.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.shippingName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          normalizeOrderStatus(order.status) === "Cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {ORDER_STATUS_LABELS[
                          normalizeOrderStatus(order.status)
                        ] ?? normalizeOrderStatus(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                  </TableRow>
                ))}
                {recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Chưa có đơn hàng gần đây.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function SummaryCard({
  colorIndex,
  icon: Icon,
  label,
  value,
  loading,
}: {
  colorIndex: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  loading?: boolean;
}) {
  const color = SUMMARY_COLORS[colorIndex % SUMMARY_COLORS.length];
  return (
    <div className={cn("w-full rounded-sm border p-4", color.bg, color.border)}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-sm", color.text)}>{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-7 w-24" />
          ) : (
            <p
              className={cn(
                "text-2xl font-bold",
                color.text,
                !value && "text-muted-foreground",
              )}
            >
              {value || "-"}
            </p>
          )}
        </div>
        <Icon className={cn("size-6", color.text)} />
      </div>
    </div>
  );
}

function StockList({
  title,
  items,
}: {
  title: string;
  items: { sku: string; plantVariantId: string; quantityAvailable: number }[];
}) {
  return (
    <div className="rounded-sm border bg-muted/20 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{title}</span>
        <span>{items.length} mục</span>
      </div>
      <div className="space-y-2">
        {items.slice(0, 4).map((item) => (
          <div
            key={item.plantVariantId}
            className="flex items-center justify-between text-sm"
          >
            <span className="truncate">{item.sku}</span>
            <Badge variant="outline">{item.quantityAvailable}</Badge>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-xs text-muted-foreground">Không có dữ liệu</div>
        )}
      </div>
    </div>
  );
}
