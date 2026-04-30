"use client";

import { AddSaleItemDialog } from "../add-sale-item-dialog";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CirclePlus, SquarePen, Trash2 } from "lucide-react";
import { DeleteLightningSaleDialog } from "../delete-lightning-sale-dialog";
import { EditLightningSaleDialog } from "../edit-lightning-sale-dialog";
import { EditSaleItemDialog } from "../edit-sale-item-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  LightningSaleItemResponse,
  UpdateLightningSaleItemRequest,
} from "@/types/lightning-sale";
import {
  useDeleteLightningSaleItem,
  useLightningSaleById,
  useUpdateLightningSaleItem,
} from "@/lib/hooks/use-lightning-sale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(dateStr));
}

function getSaleStatus(startDateUtc: string, endDateUtc: string) {
  const now = new Date();
  const start = new Date(startDateUtc);
  const end = new Date(endDateUtc);

  if (now > end) return "expired";
  if (now >= start && now <= end) return "ongoing";
  if (now < start) return "upcoming";
  return "unknown";
}

function getSaleStatusLabel(status: string) {
  if (status === "ongoing") return "Đang diễn ra";
  if (status === "upcoming") return "Sắp diễn ra";
  if (status === "expired") return "Đã kết thúc";
  return "Không xác định";
}

function ItemActiveSwitch({ item }: { item: LightningSaleItemResponse }) {
  const { mutate: updateLightningSaleItem } = useUpdateLightningSaleItem();

  return (
    <Switch
      defaultChecked={item.isActive}
      onCheckedChange={(checked) =>
        updateLightningSaleItem({
          lightningSaleItemId: item.id,
          data: {
            isActive: checked,
          } as UpdateLightningSaleItemRequest,
        })
      }
    />
  );
}

function ItemActions({ item }: { item: LightningSaleItemResponse }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteLightningSaleItem, isPending } =
    useDeleteLightningSaleItem();

  const onConfirmRemove = async () => {
    deleteLightningSaleItem(item.id, {
      onSuccess: () => setDeleteOpen(false),
    });
  };

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
            <SquarePen className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chỉnh sửa</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Gỡ</p>
        </TooltipContent>
      </Tooltip>

      <EditSaleItemDialog
        key={item.id}
        open={editOpen}
        onOpenChange={setEditOpen}
        item={item}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gỡ sản phẩm khuyến mãi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn gỡ sản phẩm này khỏi chương trình sale? Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmRemove}
              disabled={isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isPending ? "Đang gỡ..." : "Gỡ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function LightningSaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, error } = useLightningSaleById(id);

  const headerActions = useMemo(
    () => (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditOpen(true)}
              className="h-12 w-12"
            >
              <SquarePen className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chỉnh sửa</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDeleteOpen(true)}
              className="h-12 w-12"
            >
              <Trash2 className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xóa</p>
          </TooltipContent>
        </Tooltip>

        {data?.data && (
          <>
            <EditLightningSaleDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              sale={data?.data}
            />
            <DeleteLightningSaleDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              sale={data?.data}
              onSuccess={() =>
                router.push(APP_PATHS.LIGHTNING_SALES_MANAGEMENT)
              }
            />
          </>
        )}
      </>
    ),
    [editOpen, deleteOpen, data, router],
  );

  useAdminHeader(headerActions);

  const status = data?.data
    ? getSaleStatus(data?.data.startDateUtc, data?.data.endDateUtc)
    : "unknown";
  const statusVariants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    ongoing: "default",
    upcoming: "secondary",
    expired: "destructive",
    unknown: "outline",
  };

  if (!data?.data && !isLoading && !error) return null;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      {error && (
        <div className="rounded-sm border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-40 w-full rounded-sm" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-sm" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-sm" />
        </div>
      )}

      {!isLoading && data?.data && (
        <>
          {/* Sale details card */}
          <div className="overflow-hidden rounded-sm border bg-card p-4">
            <h2 className="mb-5 text-sm font-semibold">
              Chi tiết chương trình sale
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Tên</span>
                <p className="font-medium">{data?.data.name}</p>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Mô tả</span>
                <p>{data?.data.description}</p>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Trạng thái</span>
                <span className="inline-flex items-center gap-2">
                  <Badge variant={statusVariants[status] ?? "outline"}>
                    {getSaleStatusLabel(status)}
                  </Badge>
                  {data?.data.isActive ? (
                    <Badge variant="default">Đang bật</Badge>
                  ) : (
                    <Badge variant="secondary">Đang tắt</Badge>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Ngày bắt đầu</span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(data?.data.startDateUtc)}
                </span>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Ngày kết thúc</span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(data?.data.endDateUtc)}
                </span>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Tổng sản phẩm</span>
                <p>{data?.data.totalItems}</p>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Sản phẩm đang bật</span>
                <p>{data?.data.activeItems}</p>
              </div>
            </div>
          </div>

          {/* Sale items card */}
          <div className="overflow-hidden rounded-sm border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Sản phẩm khuyến mãi</h2>
              <Button variant="outline" onClick={() => setAddItemOpen(true)}>
                <CirclePlus />
                Thêm sản phẩm
              </Button>
            </div>

            {/* Table with horizontal scroll on mobile */}
            <div className="-mx-4 overflow-x-auto sm:mx-0 sm:rounded-sm sm:border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Biến thể SKU</TableHead>
                    <TableHead>Giá gốc</TableHead>
                    <TableHead>Giá sale</TableHead>
                    <TableHead>Giảm giá</TableHead>
                    <TableHead>Đã bán / Giới hạn</TableHead>
                    <TableHead>Tiến độ</TableHead>
                    <TableHead>Kích hoạt</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.items.length > 0 ? (
                    data?.data.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.salePlantVariant?.sku ?? "Không có"}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.originalPrice)}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(item.salePrice)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            -{item.discountPercentage.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>
                              {item.quantitySold}/{item.quantityLimit}
                            </span>
                            {item.isSoldOut && (
                              <Badge variant="destructive">Đã bán hết</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                  width: `${Math.min(item.soldPercentage, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {item.soldPercentage.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ItemActiveSwitch item={item} />
                        </TableCell>
                        <TableCell>
                          <ItemActions item={item} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Chưa có sản phẩm nào trong chương trình sale này. Nhấn
                        &quot;Thêm sản phẩm&quot; để bắt đầu.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Dialogs */}
      {data?.data && (
        <AddSaleItemDialog
          open={addItemOpen}
          onOpenChange={setAddItemOpen}
          saleId={data?.data.id}
        />
      )}
    </div>
  );
}
