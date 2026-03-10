"use client";

import Image from "next/image";
import { ImageOff, SquarePen, Trash2 } from "lucide-react";
import { getFileUrl } from "@/utils/helpers";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetCategoryBySlug } from "@/hooks/category/use-get-category-by-slug";
import { useAdminHeader } from "@/hooks/use-admin-header";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EditCategoryDialog } from "@/app/[locale]/admin/categories-management/edit-category-dialog";
import { DeleteCategoryDialog } from "@/app/[locale]/admin/categories-management/delete-category-dialog";
import { APP_PATHS } from "@/lib/constants/app-paths";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { categoryBySlug, getCategoryBySlugError, isLoadingCategoryBySlug } =
    useGetCategoryBySlug(slug);

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

        {categoryBySlug && (
          <>
            <EditCategoryDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              category={categoryBySlug}
            />
            <DeleteCategoryDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              category={categoryBySlug}
              onSuccess={() => router.push(APP_PATHS.CATEGORIES_MANAGEMENT)}
            />
          </>
        )}
      </>
    ),
    [editOpen, deleteOpen, categoryBySlug, router],
  );

  useAdminHeader(headerActions);

  if (!categoryBySlug) return;

  return (
    <div className="flex flex-1 flex-col gap-2">
      {getCategoryBySlugError && (
        <div className="rounded-sm border border-destructive bg-destructive/10 p-4 text-destructive text-sm">
          {getCategoryBySlugError}
        </div>
      )}

      {isLoadingCategoryBySlug && (
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

      {!isLoadingCategoryBySlug && categoryBySlug && (
        <div className="rounded-sm border bg-background p-4">
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm border bg-muted">
              {categoryBySlug.media ? (
                <Image
                  src={getFileUrl(categoryBySlug.media.fileUrl)}
                  alt={categoryBySlug.name}
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
                <h1 className="text-2xl font-semibold">
                  {categoryBySlug.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  /{categoryBySlug.slug}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium ${
                    categoryBySlug.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {categoryBySlug.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </h3>
                <p className="text-sm leading-relaxed">
                  {categoryBySlug.description || "No description provided."}
                </p>
              </div>

              {categoryBySlug.parentId && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Parent ID
                  </h3>
                  <p className="text-sm">{categoryBySlug.parentId}</p>
                </div>
              )}

              <Separator />

              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Created: </span>
                  {new Date(categoryBySlug.createdAtUtc).toLocaleDateString(
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
                  <span className="font-medium">Updated: </span>
                  {new Date(categoryBySlug.updatedAtUtc).toLocaleDateString(
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
                <span className="font-medium">ID: </span>
                {categoryBySlug.id}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
