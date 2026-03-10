"use client";

import { LightningSaleResponse } from "@/lib/schemas/lightning-sale/lightning-sale-response";
import { LightningSaleItemResponse } from "@/lib/schemas/lightning-sale/lightning-sale-item-response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus, SquarePen, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useRemoveSaleItem } from "@/hooks/lightning-sale/use-remove-sale-item";
import { useUpdateSaleItem } from "@/hooks/lightning-sale/use-update-sale-item";

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

interface SaleDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: LightningSaleResponse;
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
                <Badge variant="default">Active</Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </DialogTitle>
            <DialogDescription>{sale.description}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {sale.totalItems} items ({sale.activeItems} active)
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddItemOpen(true)}
            >
              <CirclePlus className="mr-2 size-4" />
              Add Item
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant SKU</TableHead>
                  <TableHead>Original Price</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Sold / Limit</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.items.length > 0 ? (
                  sale.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.plantVariant?.sku ?? "N/A"}
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
                            <Badge variant="destructive">Sold Out</Badge>
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
                      No items in this sale. Click &quot;Add Item&quot; to get
                      started.
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
