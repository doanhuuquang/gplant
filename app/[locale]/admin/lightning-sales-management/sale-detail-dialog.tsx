"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus, SquarePen, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import {
  useDeleteLightningSaleItem,
  useUpdateLightningSaleItem,
} from "@/lib/hooks/use-lightning-sale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { EditSaleItemDialog } from "@/app/[locale]/admin/lightning-sales-management/edit-sale-item-dialog";
import { AddSaleItemDialog } from "@/app/[locale]/admin/lightning-sales-management/add-sale-item-dialog";
import {
  LightningSaleItemResponse,
  LightningSaleResponse,
  UpdateLightningSaleItemRequest,
} from "@/types/lightning-sale";

interface SaleDetailDialogProps {
  open: boolean;
  sale: LightningSaleResponse;
  onOpenChange: (open: boolean) => void;
}

function ItemActiveSwitch({ item }: { item: LightningSaleItemResponse }) {
  const { mutate: updateSaleItem } = useUpdateLightningSaleItem();

  return (
    <Switch
      defaultChecked={item.isActive}
      onCheckedChange={(checked) =>
        updateSaleItem({
          lightningSaleItemId: item.id,
          data: { isActive: checked } as UpdateLightningSaleItemRequest,
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
      onSuccess: (response) => {
        setDeleteOpen(false);

        toast.success("Thành công", {
          description: response?.message,
        });
      },
      onError: (error) =>
        toast.success("Thông báo", {
          description: error?.message,
        }),
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export function SaleDetailDialog({
  open,
  onOpenChange,
  sale,
}: SaleDetailDialogProps) {
  const [addItemOpen, setAddItemOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {sale.name}
              {sale.isActive ? (
                <Badge variant="default">Đang bật</Badge>
              ) : (
                <Badge variant="secondary">Đang tắt</Badge>
              )}
            </DialogTitle>
            <DialogDescription>{sale.description}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {sale.totalItems} sản phẩm ({sale.activeItems} đang bật)
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddItemOpen(true)}
            >
              <CirclePlus className="mr-2 size-4" />
              Thêm sản phẩm
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Biến thể SKU</TableHead>
                  <TableHead>Giá gốc</TableHead>
                  <TableHead>Giá sale</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Đã bán / Giới hạn</TableHead>
                  <TableHead>Kích hoạt</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.items.length > 0 ? (
                  sale.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.salePlantVariant?.sku ?? "Không có"}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.originalPrice)}
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
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
                      colSpan={7}
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
        </DialogContent>
      </Dialog>

      <AddSaleItemDialog
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
        saleId={sale.id}
      />
    </>
  );
}
