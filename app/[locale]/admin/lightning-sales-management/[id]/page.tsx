"use client";

import { useParams } from "next/navigation";
import { useGetLightningSaleById } from "@/hooks/lightning-sale/use-get-lightning-sale-by-id";
import { useAdminHeader } from "@/hooks/use-admin-header";
import { useRemoveSaleItem } from "@/hooks/lightning-sale/use-remove-sale-item";
import { useUpdateSaleItem } from "@/hooks/lightning-sale/use-update-sale-item";
import { LightningSaleItemResponse } from "@/lib/schemas/lightning-sale/lightning-sale-item-response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar, CirclePlus, SquarePen, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AddSaleItemDialog } from "../add-sale-item-dialog";
import { EditSaleItemDialog } from "../edit-sale-item-dialog";
import { EditLightningSaleDialog } from "../edit-lightning-sale-dialog";
import { DeleteLightningSaleDialog } from "../delete-lightning-sale-dialog";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { useRouter } from "next/navigation";
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

function ItemActiveSwitch({ item }: { item: LightningSaleItemResponse }) {
  const { handleUpdateSaleItem } = useUpdateSaleItem();

  return (
    <Switch
      defaultChecked={item.isActive}
      onCheckedChange={(checked) =>
        handleUpdateSaleItem(item.id, { isActive: checked })
      }
    />
  );
}

function ItemActions({ item }: { item: LightningSaleItemResponse }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { handleRemoveSaleItem, isLoading } = useRemoveSaleItem();

  const onConfirmRemove = async () => {
    const success = await handleRemoveSaleItem(item.id);
    if (success) {
      setDeleteOpen(false);
    }
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
          <p>Edit</p>
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
          <p>Remove</p>
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
            <AlertDialogTitle>Remove sale item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item from the sale? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmRemove}
              disabled={isLoading}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isLoading ? "Removing..." : "Remove"}
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
  const { sale, isLoading, error } = useGetLightningSaleById(id);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
            <p>Edit</p>
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
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>

        {sale && (
          <>
            <EditLightningSaleDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              sale={sale}
            />
            <DeleteLightningSaleDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              sale={sale}
              onSuccess={() =>
                router.push(APP_PATHS.LIGHTNING_SALES_MANAGEMENT)
              }
            />
          </>
        )}
      </>
    ),
    [editOpen, deleteOpen, sale, router],
  );

  useAdminHeader(headerActions);

  const status = sale
    ? getSaleStatus(sale.startDateUtc, sale.endDateUtc)
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

  if (!sale && !isLoading && !error) return null;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      {error && (
        <div className="rounded-sm border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
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

      {!isLoading && sale && (
        <>
          {/* Sale details card */}
          <div className="overflow-hidden rounded-sm border bg-card p-4">
            <h2 className="mb-5 text-sm font-semibold">Sale Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Name</span>
                <p className="font-medium">{sale.name}</p>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Description</span>
                <p>{sale.description}</p>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-2">
                  <Badge variant={statusVariants[status] ?? "outline"}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                  {sale.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Start Date</span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(sale.startDateUtc)}
                </span>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">End Date</span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(sale.endDateUtc)}
                </span>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Total Items</span>
                <p>{sale.totalItems}</p>
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 text-sm sm:grid-cols-[120px_1fr] sm:gap-x-4">
                <span className="text-muted-foreground">Active Items</span>
                <p>{sale.activeItems}</p>
              </div>
            </div>
          </div>

          {/* Sale items card */}
          <div className="overflow-hidden rounded-sm border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Sale Items</h2>
              <Button variant="outline" onClick={() => setAddItemOpen(true)}>
                <CirclePlus />
                Add Item
              </Button>
            </div>

            {/* Table with horizontal scroll on mobile */}
            <div className="-mx-4 overflow-x-auto sm:mx-0 sm:rounded-sm sm:border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variant SKU</TableHead>
                    <TableHead>Original Price</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Sold / Limit</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.length > 0 ? (
                    sale.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.salePlantVariant?.sku ?? "N/A"}
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
                              <Badge variant="destructive">Sold Out</Badge>
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
                        No items in this sale. Click &quot;Add Item&quot; to get
                        started.
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
      {sale && (
        <AddSaleItemDialog
          open={addItemOpen}
          onOpenChange={setAddItemOpen}
          saleId={sale.id}
        />
      )}
    </div>
  );
}
