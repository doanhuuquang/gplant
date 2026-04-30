"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { EditOrderDialog } from "../edit-order-dialog";
import { useOrderByOrderNumber } from "@/lib/hooks/use-order";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  Edit3,
  FileText,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusTone(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("hủy") || normalized.includes("cancel")) {
    return "destructive";
  }
  if (normalized.includes("giao") || normalized.includes("paid")) {
    return "default";
  }
  if (normalized.includes("xác") || normalized.includes("processing")) {
    return "secondary";
  }
  return "outline";
}

function InfoBlock({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-sm border bg-muted/20 p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 wrap-break-word text-sm font-medium",
          !value && "text-muted-foreground",
        )}
      >
        {value || "-"}
      </p>
    </div>
  );
}

function DetailLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex gap-3 rounded-sm border bg-muted/20 p-4">
      <div className="mt-0.5 rounded-sm bg-primary/10 p-2 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 wrap-break-word text-sm font-medium">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{formatCurrency(value)}</span>
    </div>
  );
}

export default function Page() {
  const params = useParams();
  const orderNumber = params.number as string;
  const [editOpen, setEditOpen] = useState(false);

  const { data: orderByOrderNumberResponse, isLoading } =
    useOrderByOrderNumber(orderNumber);

  const order = orderByOrderNumberResponse?.data;
  const items = useMemo(() => order?.items ?? [], [order?.items]);

  if (isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-40 w-full rounded-sm" />
        <div className="grid gap-6 xl:grid-cols-3">
          <Skeleton className="h-80 w-full rounded-sm xl:col-span-2" />
          <Skeleton className="h-80 w-full rounded-sm" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-xl border-dashed">
          <CardHeader>
            <CardTitle>Không tìm thấy đơn hàng</CardTitle>
            <CardDescription>
              Không có dữ liệu cho đơn hàng {orderNumber}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="..">
                <ArrowLeft className="mr-2 size-4" />
                Quay lại
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-2">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64" />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between bg-background p-4 rounded-sm border">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              Đơn hàng #{order.orderNumber}
            </h1>
            <Badge variant={getStatusTone(order.statusDisplay) as never}>
              {order.statusDisplay}
            </Badge>
            <Badge variant="outline">{order.paymentStatusDisplay}</Badge>
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Xem đầy đủ thông tin đơn hàng, tình trạng thanh toán và danh sách
            sản phẩm.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Edit3 className="size-4" />
            Cập nhật trạng thái
          </Button>
        </div>
      </div>

      <section className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-sm bg-primary/10 p-3 text-primary">
              <Package className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
              <p className="text-xl font-semibold">{order.totalItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-sm bg-primary/10 p-3 text-primary">
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng tiền</p>
              <p className="text-xl font-semibold">
                {formatCurrency(order.total)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-sm bg-primary/10 p-3 text-primary">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thanh toán</p>
              <p className="text-xl font-semibold">
                {order.paymentMethodDisplay}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-sm bg-primary/10 p-3 text-primary">
              <CalendarClock className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày tạo</p>
              <p className="text-xl font-semibold">
                {formatDate(order.createdAtUtc)}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-2 xl:grid-cols-3">
        <div className="space-y-2 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
              <CardDescription>
                Mã đơn, trạng thái và các mốc thanh toán.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <InfoBlock label="Mã đơn hàng" value={order.orderNumber} />
              <InfoBlock label="Trạng thái" value={order.statusDisplay} />
              <InfoBlock
                label="Trạng thái thanh toán"
                value={order.paymentStatusDisplay}
              />
              <InfoBlock
                label="Phương thức thanh toán"
                value={order.paymentMethodDisplay}
              />
              <InfoBlock
                label="Thanh toán lúc"
                value={formatDate(order.paidAtUtc)}
              />
              <InfoBlock
                label="Cập nhật lúc"
                value={formatDate(order.updatedAtUtc)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <CardDescription>
                Các mặt hàng có trong đơn và thông tin giá.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">SL</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div>{item.PlantName}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.plant?.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.variantSKU}</TableCell>
                      <TableCell>{item.variantSize}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.finalPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.subTotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-muted-foreground"
                      >
                        Không có sản phẩm trong đơn hàng.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Khách hàng</CardTitle>
              <CardDescription>
                Người nhận và địa chỉ giao hàng.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailLine
                icon={User}
                label="Người nhận"
                value={order.shippingName}
              />
              <DetailLine
                icon={Phone}
                label="Số điện thoại"
                value={order.shippingPhone}
              />
              <DetailLine icon={MapPin} label="Địa chỉ" value={order.address} />
              <DetailLine
                icon={Truck}
                label="Tòa nhà / Số nhà"
                value={order.buildingName}
              />
              <DetailLine
                icon={FileText}
                label="Ghi chú giao hàng"
                value={order.shippingNote || "-"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tổng kết</CardTitle>
              <CardDescription>Chi tiết số tiền của đơn hàng.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <SummaryRow label="Tạm tính" value={order.subTotal} />
              <SummaryRow label="Giảm giá" value={order.discountAmount} />
              <SummaryRow label="Phí ship" value={order.shippingFee} />
              <Separator />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Tổng cộng</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mốc thời gian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailLine
                icon={CalendarClock}
                label="Tạo lúc"
                value={formatDate(order.createdAtUtc)}
              />
              <DetailLine
                icon={CalendarClock}
                label="Cập nhật lúc"
                value={formatDate(order.updatedAtUtc)}
              />
              <DetailLine
                icon={CalendarClock}
                label="Hủy lúc"
                value={formatDate(order.cancelledAtUtc)}
              />
              {order.cancellationReason ? (
                <DetailLine
                  icon={FileText}
                  label="Lý do hủy"
                  value={order.cancellationReason}
                />
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>

      <EditOrderDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        order={order}
        onSuccess={() => setEditOpen(false)}
      />
    </main>
  );
}
