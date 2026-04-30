"use client";

import Image from "next/image";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateVariantDialog } from "./create-variant-dialog";
import { EditVariantDialog } from "./edit-variant-dialog";
import { getFileUrl } from "@/utils/helpers";
import { PlantVariantResponse } from "@/types/plant";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Droplets,
  EllipsisVertical,
  ImageOff,
  Leaf,
  Pencil,
  Power,
  SquarePen,
  StickyNote,
  Sun,
  Thermometer,
  Trash2,
} from "lucide-react";
import { EditPlantDialog } from "@/app/[locale]/admin/plants-management/edit-plant-dialog";
import { DeletePlantDialog } from "@/app/[locale]/admin/plants-management/delete-plant-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  useDeletePlantVariant,
  usePlantBySlug,
  useToggleActivePlantVariant,
} from "@/lib/hooks/use-plant";

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createVariantOpen, setCreateVariantOpen] = useState(false);
  const [editingVariant, setEditingVariant] =
    useState<PlantVariantResponse | null>(null);
  const [deletingVariant, setDeletingVariant] =
    useState<PlantVariantResponse | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    data: plantBySlugResponse,
    isLoading,
    error,
    refetch,
  } = usePlantBySlug(slug);
  const { mutate: toggleVariant, isPending: toggleLoading } =
    useToggleActivePlantVariant();
  const { mutate: deleteVariant, isPending: deleteLoading } =
    useDeletePlantVariant();

  const variantActionLoading = toggleLoading || deleteLoading;

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(new Date(date));

  const formatPrice = (v: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v);

  const handleToggleVariant = async (variant: PlantVariantResponse) => {
    toggleVariant(variant.id);
  };

  const handleDeleteVariant = async () => {
    if (!deletingVariant) return;
    deleteVariant(deletingVariant.id, {
      onSuccess: () => setDeletingVariant(null),
    });
  };

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

        {plantBySlugResponse?.data && (
          <>
            <EditPlantDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              plant={plantBySlugResponse?.data}
            />

            <DeletePlantDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              plant={plantBySlugResponse?.data}
              onSuccess={() => router.push(APP_PATHS.PLANTS_MANAGEMENT)}
            />
          </>
        )}
      </>
    ),
    [editOpen, deleteOpen, plantBySlugResponse, router],
  );

  useAdminHeader(headerActions);

  if (!plantBySlugResponse && !isLoading && !error) return null;

  /* ── Image helpers ────────────────────────── */
  const primaryImage = plantBySlugResponse?.data?.images?.find(
    (i) => i.isPrimary,
  );
  const sortedImages = plantBySlugResponse?.data?.images
    ? [
        ...(primaryImage ? [primaryImage] : []),
        ...plantBySlugResponse.data.images.filter((i) => !i.isPrimary),
      ]
    : [];
  const selectedImage = sortedImages[selectedImageIndex] ?? null;

  const goPrev = () =>
    setSelectedImageIndex((i) => (i > 0 ? i - 1 : sortedImages.length - 1));
  const goNext = () =>
    setSelectedImageIndex((i) => (i < sortedImages.length - 1 ? i + 1 : 0));

  return (
    <div className="flex flex-1 flex-col gap-6">
      {error && (
        <div className="rounded-sm border border-destructive/50 bg-destructive/5 p-3 text-destructive text-sm">
          {error.message}
        </div>
      )}

      {isLoading && (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-sm" />
            <Skeleton className="h-40 w-full rounded-sm" />
          </div>
          <Skeleton className="h-125 w-full rounded-sm" />
        </div>
      )}

      {!isLoading && plantBySlugResponse && (
        <div className="grid gap-2 lg:grid-cols-[1fr_420px]">
          {/* ── LEFT ─────────────────────────────── */}
          <div className="flex flex-col gap-2">
            {/* Basic info card */}
            <div className="rounded-sm border bg-card p-4">
              <h2 className="text-sm font-semibold mb-5">Thông tin cơ bản</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-[100px_1fr] items-start gap-x-4 text-sm">
                  <span className="text-muted-foreground">Tên</span>
                  <span>{plantBySlugResponse?.data.name}</span>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-x-4 text-sm">
                  <span className="text-muted-foreground">Slug</span>
                  <span>/{plantBySlugResponse?.data.slug}</span>
                </div>

                {plantBySlugResponse?.data.category && (
                  <div className="grid grid-cols-[100px_1fr] items-center gap-x-4 text-sm">
                    <span className="text-muted-foreground">Danh mục</span>
                    <span>{plantBySlugResponse?.data.category.name}</span>
                  </div>
                )}

                {(plantBySlugResponse?.data.minPrice != null ||
                  plantBySlugResponse?.data.maxPrice != null) && (
                  <div className="grid grid-cols-[100px_1fr] items-center gap-x-4 text-sm">
                    <span className="text-muted-foreground">Giá</span>
                    <span className="text-base">
                      {plantBySlugResponse?.data.minPrice != null &&
                      plantBySlugResponse?.data.maxPrice != null ? (
                        plantBySlugResponse.data.minPrice ===
                        plantBySlugResponse.data.maxPrice ? (
                          formatPrice(plantBySlugResponse.data.minPrice)
                        ) : (
                          `${formatPrice(plantBySlugResponse.data.minPrice)} – ${formatPrice(plantBySlugResponse.data.maxPrice)}`
                        )
                      ) : (
                        <span className="italic text-muted-foreground">
                          Chưa có giá
                        </span>
                      )}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-[100px_1fr] items-start gap-x-4 text-sm">
                  <span className="text-muted-foreground">Ngày tạo</span>
                  <span>
                    {formatDate(plantBySlugResponse?.data.createdAtUtc)}
                  </span>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-x-4 text-sm">
                  <span className="text-muted-foreground">Cập nhật</span>
                  <span>
                    {formatDate(plantBySlugResponse?.data.updatedAtUtc)}
                  </span>
                </div>
              </div>

              {(plantBySlugResponse?.data.shortDescription ||
                plantBySlugResponse?.data.description) && (
                <>
                  <Separator className="my-5" />
                  {plantBySlugResponse?.data.shortDescription && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {plantBySlugResponse?.data.shortDescription}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {plantBySlugResponse?.data.description || (
                      <span className="italic text-muted-foreground">
                        Chưa có mô tả.
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>

            {/* Variants */}
            <div className="rounded-sm border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">Biến thể</h2>
                  {plantBySlugResponse?.data.variants &&
                    plantBySlugResponse?.data.variants.length > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        ({plantBySlugResponse?.data.variants.length})
                      </span>
                    )}
                </div>
                <Button
                  variant={"outline"}
                  onClick={() => setCreateVariantOpen(true)}
                  className="h-9"
                >
                  <CirclePlus className="size-4" />
                  Thêm
                </Button>
              </div>

              {plantBySlugResponse?.data.variants &&
              plantBySlugResponse?.data.variants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-y bg-muted/50 text-xs text-muted-foreground">
                        <th className="px-4 py-2.5 text-left font-medium">
                          SKU
                        </th>
                        <th className="px-4 py-2.5 text-left font-medium">
                          Kích thước
                        </th>
                        <th className="px-4 py-2.5 text-right font-medium">
                          Giá
                        </th>
                        <th className="px-4 py-2.5 text-center font-medium">
                          Trạng thái
                        </th>
                        <th className="px-4 py-2.5 text-center font-medium w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {plantBySlugResponse?.data.variants.map((v, idx) => (
                        <tr
                          key={v.id}
                          className={cn(
                            "transition-colors hover:bg-muted/30",
                            idx <
                              plantBySlugResponse?.data.variants.length - 1 &&
                              "border-b",
                          )}
                        >
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5">
                              <p>{v.sku}</p>
                            </span>
                          </td>
                          <td className="px-4 py-3">{v.size} cm</td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {formatPrice(v.price)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-medium",
                                v.isActive
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400",
                              )}
                            >
                              {v.isActive ? "Đang bật" : "Đang tắt"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7"
                                  disabled={variantActionLoading}
                                >
                                  <EllipsisVertical className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditingVariant(v)}
                                >
                                  <Pencil className="size-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleToggleVariant(v)}
                                >
                                  <Power className="size-4 mr-2" />
                                  {v.isActive ? "Tắt" : "Bật"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeletingVariant(v)}
                                >
                                  <Trash2 className="size-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-4 pb-4 text-center text-sm text-muted-foreground">
                  Chưa có biến thể nào. Nhấn &quot;Thêm&quot; để tạo.
                </div>
              )}
            </div>

            {/* Care Instructions */}
            {plantBySlugResponse?.data.careInstruction && (
              <div className="rounded-sm border bg-card p-4">
                <h2 className="text-sm font-semibold mb-4">
                  Hướng dẫn chăm sóc
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      icon: Sun,
                      label: "Ánh sáng",
                      value:
                        plantBySlugResponse?.data.careInstruction
                          .lightRequirement,
                      color: "text-amber-500",
                      bg: "bg-amber-50 dark:bg-amber-500/10",
                    },
                    {
                      icon: Droplets,
                      label: "Nước",
                      value:
                        plantBySlugResponse?.data.careInstruction
                          .wateringFrequency,
                      color: "text-sky-500",
                      bg: "bg-sky-50 dark:bg-sky-500/10",
                    },
                    {
                      icon: Thermometer,
                      label: "Nhiệt độ",
                      value:
                        plantBySlugResponse?.data.careInstruction.temperature,
                      color: "text-rose-500",
                      bg: "bg-rose-50 dark:bg-rose-500/10",
                    },
                    {
                      icon: Leaf,
                      label: "Đất",
                      value: plantBySlugResponse?.data.careInstruction.soil,
                      color: "text-emerald-500",
                      bg: "bg-emerald-50 dark:bg-emerald-500/10",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={cn("rounded-sm p-3.5", item.bg)}
                    >
                      <item.icon className={cn("size-5 mb-2", item.color)} />
                      <p className="text-[11px] text-muted-foreground mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-xs font-semibold leading-snug">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                {plantBySlugResponse?.data.careInstruction.notes && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-sm bg-muted/60 p-3.5">
                    <StickyNote className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {plantBySlugResponse?.data.careInstruction.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT ────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-sm border bg-card p-4">
              <h2 className="text-sm font-semibold mb-4">Hình ảnh sản phẩm</h2>

              <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-muted">
                {selectedImage?.media?.fileUrl ? (
                  <Image
                    src={getFileUrl(selectedImage.media.fileUrl)}
                    alt={plantBySlugResponse?.data.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageOff className="size-10 opacity-30" />
                    <span className="text-xs">Không có hình ảnh</span>
                  </div>
                )}

                {sortedImages.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-background/80 border backdrop-blur-sm transition hover:bg-background"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-background/80 shadow-sm border backdrop-blur-sm transition hover:bg-background"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/80 border shadow-sm px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-sm tabular-nums">
                      {selectedImageIndex + 1} / {sortedImages.length}
                    </span>
                  </>
                )}
              </div>

              {sortedImages.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {sortedImages.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={cn(
                        "relative size-16 shrink-0 overflow-hidden rounded-sm border-2 transition-all",
                        idx === selectedImageIndex
                          ? "border-primary"
                          : "border-transparent opacity-50 hover:opacity-100",
                      )}
                    >
                      {img.media?.fileUrl ? (
                        <Image
                          src={getFileUrl(img.media.fileUrl)}
                          alt={`Ảnh thu nhỏ ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <ImageOff className="size-3 text-muted-foreground" />
                        </div>
                      )}
                      {idx === 0 && primaryImage && (
                        <span className="absolute inset-x-0 bottom-0 bg-primary text-primary-foreground text-[7px] font-semibold text-center py-px uppercase tracking-wider">
                          Chính
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Variant dialogs ──────────────────── */}
      {plantBySlugResponse?.data && (
        <CreateVariantDialog
          open={createVariantOpen}
          onOpenChange={setCreateVariantOpen}
          plantId={plantBySlugResponse?.data.id}
          onSuccess={refetch}
        />
      )}

      {editingVariant && (
        <EditVariantDialog
          open={!!editingVariant}
          onOpenChange={(open) => !open && setEditingVariant(null)}
          variant={editingVariant}
          onSuccess={refetch}
        />
      )}

      <AlertDialog
        open={!!deletingVariant}
        onOpenChange={(open) => !open && setDeletingVariant(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa biến thể</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa biến thể{" "}
              <strong>{deletingVariant?.sku}</strong>? Thao tác này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={variantActionLoading}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVariant}
              disabled={variantActionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
