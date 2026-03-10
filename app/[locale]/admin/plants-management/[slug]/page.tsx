"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/utils/helpers";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPlantBySlug } from "@/hooks/plant/use-get-plant-by-slug";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

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
  Tag,
  Thermometer,
  Trash2,
} from "lucide-react";
import { useAdminHeader } from "@/hooks/use-admin-header";
import { useRouter } from "next/navigation";
import { EditPlantDialog } from "@/app/[locale]/admin/plants-management/edit-plant-dialog";
import { DeletePlantDialog } from "@/app/[locale]/admin/plants-management/delete-plant-dialog";
import { APP_PATHS } from "@/lib/constants/app-paths";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PlantVariantResponse } from "@/lib/schemas/plant/plant-variant-response";
import { CreateVariantDialog } from "./create-variant-dialog";
import { EditVariantDialog } from "./edit-variant-dialog";
import { useDeletePlantVariant } from "@/hooks/plant/use-delete-plant-variant";
import { useTogglePlantVariant } from "@/hooks/plant/use-toggle-plant-variant";
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
import { Badge } from "@/components/ui/badge";

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { plant, isLoading, error, refetch } = useGetPlantBySlug(slug);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  /* ── Variant management state ─────────────── */
  const [createVariantOpen, setCreateVariantOpen] = useState(false);
  const [editingVariant, setEditingVariant] =
    useState<PlantVariantResponse | null>(null);
  const [deletingVariant, setDeletingVariant] =
    useState<PlantVariantResponse | null>(null);
  const { handleToggleVariant: toggleVariant, isLoading: toggleLoading } =
    useTogglePlantVariant();
  const { handleDeleteVariant: deleteVariant, isLoading: deleteLoading } =
    useDeletePlantVariant();
  const variantActionLoading = toggleLoading || deleteLoading;

  /* ── Gallery state ────────────────────────── */
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  /* ── Formatters ───────────────────────────── */
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

  /* ── Variant actions ──────────────────────── */
  const handleToggleVariant = async (variant: PlantVariantResponse) => {
    const success = await toggleVariant(variant.id, variant.isActive);
    if (success) refetch();
  };

  const handleDeleteVariant = async () => {
    if (!deletingVariant) return;
    const success = await deleteVariant(
      deletingVariant.id,
      deletingVariant.sku,
    );
    if (success) {
      setDeletingVariant(null);
      refetch();
    }
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

        {plant && (
          <>
            <EditPlantDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              plant={plant}
              onSuccess={refetch}
            />
            <DeletePlantDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              plant={plant}
              onSuccess={() => router.push(APP_PATHS.PLANTS_MANAGEMENT)}
            />
          </>
        )}
      </>
    ),
    [editOpen, deleteOpen, plant, refetch, router],
  );

  useAdminHeader(headerActions);

  if (!plant && !isLoading && !error) return null;

  /* ── Image helpers ────────────────────────── */
  const primaryImage = plant?.images?.find((i) => i.isPrimary);
  const sortedImages = plant?.images
    ? [
        ...(primaryImage ? [primaryImage] : []),
        ...plant.images.filter((i) => !i.isPrimary),
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
          {error}
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

      {!isLoading && plant && (
        <div className="grid gap-2 lg:grid-cols-[1fr_420px]">
          {/* ── LEFT ─────────────────────────────── */}
          <div className="flex flex-col gap-2">
            {/* Basic info card */}
            <div className="rounded-sm border bg-card p-4">
              <h2 className="text-sm font-semibold mb-5">Basic Details</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-[100px_1fr] items-start gap-x-4 text-sm">
                  <span className="text-muted-foreground">Name</span>
                  <span>{plant.name}</span>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-x-4 text-sm">
                  <span className="text-muted-foreground">Slug</span>
                  <span>/{plant.slug}</span>
                </div>

                {plant.category && (
                  <div className="grid grid-cols-[100px_1fr] items-center gap-x-4 text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span>{plant.category.name}</span>
                  </div>
                )}

                {(plant.minPrice != null || plant.maxPrice != null) && (
                  <div className="grid grid-cols-[100px_1fr] items-center gap-x-4 text-sm">
                    <span className="text-muted-foreground">Price</span>
                    <span className="text-base">
                      {plant.minPrice === plant.maxPrice
                        ? formatPrice(plant.minPrice!)
                        : `${formatPrice(plant.minPrice!)} – ${formatPrice(plant.maxPrice!)}`}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-[100px_1fr] items-start gap-x-4 text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(plant.createdAtUtc)}</span>
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-x-4 text-sm">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{formatDate(plant.updatedAtUtc)}</span>
                </div>
              </div>

              {(plant.shortDescription || plant.description) && (
                <>
                  <Separator className="my-5" />
                  {plant.shortDescription && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {plant.shortDescription}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {plant.description || (
                      <span className="italic text-muted-foreground">
                        No description provided.
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
                  <h2 className="text-sm font-semibold">Variants</h2>
                  {plant.variants && plant.variants.length > 0 && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      ({plant.variants.length})
                    </span>
                  )}
                </div>
                <Button
                  variant={"outline"}
                  onClick={() => setCreateVariantOpen(true)}
                  className="h-9"
                >
                  <CirclePlus className="size-4" />
                  Add
                </Button>
              </div>

              {plant.variants && plant.variants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-y bg-muted/50 text-xs text-muted-foreground">
                        <th className="px-4 py-2.5 text-left font-medium">
                          SKU
                        </th>
                        <th className="px-4 py-2.5 text-left font-medium">
                          Size
                        </th>
                        <th className="px-4 py-2.5 text-right font-medium">
                          Price
                        </th>
                        <th className="px-4 py-2.5 text-center font-medium">
                          Status
                        </th>
                        <th className="px-4 py-2.5 text-center font-medium w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {plant.variants.map((v, idx) => (
                        <tr
                          key={v.id}
                          className={cn(
                            "transition-colors hover:bg-muted/30",
                            idx < plant.variants.length - 1 && "border-b",
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
                              {v.isActive ? "Active" : "Inactive"}
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
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleToggleVariant(v)}
                                >
                                  <Power className="size-4 mr-2" />
                                  {v.isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeletingVariant(v)}
                                >
                                  <Trash2 className="size-4 mr-2" />
                                  Delete
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
                  No variants yet. Click &quot;Add&quot; to create one.
                </div>
              )}
            </div>

            {/* Care Instructions */}
            {plant.careInstruction && (
              <div className="rounded-sm border bg-card p-4">
                <h2 className="text-sm font-semibold mb-4">
                  Care Instructions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      icon: Sun,
                      label: "Light",
                      value: plant.careInstruction.lightRequirement,
                      color: "text-amber-500",
                      bg: "bg-amber-50 dark:bg-amber-500/10",
                    },
                    {
                      icon: Droplets,
                      label: "Water",
                      value: plant.careInstruction.wateringFrequency,
                      color: "text-sky-500",
                      bg: "bg-sky-50 dark:bg-sky-500/10",
                    },
                    {
                      icon: Thermometer,
                      label: "Temperature",
                      value: plant.careInstruction.temperature,
                      color: "text-rose-500",
                      bg: "bg-rose-50 dark:bg-rose-500/10",
                    },
                    {
                      icon: Leaf,
                      label: "Soil",
                      value: plant.careInstruction.soil,
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
                {plant.careInstruction.notes && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-sm bg-muted/60 p-3.5">
                    <StickyNote className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {plant.careInstruction.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT ────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-sm border bg-card p-4">
              <h2 className="text-sm font-semibold mb-4">Product Images</h2>

              <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-muted">
                {selectedImage?.media?.fileUrl ? (
                  <Image
                    src={getFileUrl(selectedImage.media.fileUrl)}
                    alt={plant.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageOff className="size-10 opacity-30" />
                    <span className="text-xs">No image available</span>
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
                          alt={`Thumbnail ${idx + 1}`}
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
                          Primary
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
      {plant && (
        <CreateVariantDialog
          open={createVariantOpen}
          onOpenChange={setCreateVariantOpen}
          plantId={plant.id}
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
            <AlertDialogTitle>Delete Variant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete variant{" "}
              <strong>{deletingVariant?.sku}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={variantActionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVariant}
              disabled={variantActionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
