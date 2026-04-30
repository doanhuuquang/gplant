"use client";

import Image from "next/image";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/utils/helpers";
import { ImageOff, SquarePen, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useCategoryBySlug } from "@/lib/hooks/use-category";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EditCategoryDialog } from "@/app/[locale]/admin/categories-management/edit-category-dialog";
import { DeleteCategoryDialog } from "@/app/[locale]/admin/categories-management/delete-category-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, error } = useCategoryBySlug(slug);

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
            <EditCategoryDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              category={data.data}
            />
            <DeleteCategoryDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              category={data.data}
              onSuccess={() => router.push(APP_PATHS.CATEGORIES_MANAGEMENT)}
            />
          </>
        )}
      </>
    ),
    [editOpen, deleteOpen, data, router],
  );

  useAdminHeader(headerActions);

  if (!data?.data) return;

  return (
    <div className="flex flex-1 flex-col gap-2">
      {error && (
        <div className="rounded-sm border border-destructive bg-destructive/10 p-4 text-destructive text-sm">
          {error.message}
        </div>
      )}

      {isLoading && (
        <div className="rounded-sm border bg-background p-4">
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <Skeleton className="aspect-square w-full rounded-sm" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && data.data && (
        <div className="rounded-sm border bg-background p-4">
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm border bg-muted">
              {data.data.media ? (
                <Image
                  src={getFileUrl(data.data.media.fileUrl)}
                  alt={data.data.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ImageOff className="size-12" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-semibold">{data.data.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  /{data.data.slug}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium ${
                    data.data.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {data.data.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Mô tả
                </h3>
                <p className="text-sm leading-relaxed">
                  {data.data.description || "Chưa có mô tả."}
                </p>
              </div>

              {data.data.parentId && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    ID danh mục cha
                  </h3>
                  <p className="text-sm">{data.data.parentId}</p>
                </div>
              )}

              <Separator />

              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Ngày tạo: </span>
                  {new Date(data.data.createdAtUtc).toLocaleDateString(
                    "vi-VN",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </div>
                <div>
                  <span className="font-medium">Cập nhật: </span>
                  {new Date(data.data.updatedAtUtc).toLocaleDateString(
                    "vi-VN",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Mã ID: </span>
                {data.data.id}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
