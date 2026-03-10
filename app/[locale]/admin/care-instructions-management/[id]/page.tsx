"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAdminHeader } from "@/hooks/use-admin-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import { EditCareInstructionDialog } from "../edit-care-instruction-dialog";
import { DeleteCareInstructionDialog } from "../delete-care-instruction-dialog";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { useGetCareInstructionById } from "@/hooks/care-instruction/use-get-care-instruction-by-id";

export default function CareInstructionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, loading, error } = useGetCareInstructionById(id as string);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const headerActions = useMemo(
    () => (
      <>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setEditOpen(true)}
          className="h-12 w-12"
        >
          <SquarePen className="size-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          className="h-12 w-12"
        >
          <Trash2 className="size-5" />
        </Button>
        {data && (
          <>
            <EditCareInstructionDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              careInstruction={data}
            />
            <DeleteCareInstructionDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              careInstruction={data}
              onSuccess={() =>
                router.push(APP_PATHS.CARE_INSTRUCTIONS_MANAGEMENT)
              }
            />
          </>
        )}
      </>
    ),
    [editOpen, deleteOpen, data, router],
  );
  useAdminHeader(headerActions);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-2">
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-sm" />
            <Skeleton className="h-32 w-full rounded-sm" />
          </div>
          <Skeleton className="h-40 w-full rounded-sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-sm border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="grid gap-2 lg:grid-cols-[1fr_350px]">
        {/* LEFT: Info Card */}
        <div className="flex flex-col gap-2">
          <div className="rounded-sm border bg-card p-4">
            <h2 className="mb-5 text-sm font-semibold">
              Care Instruction Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                <span className="text-muted-foreground">Light Requirement</span>
                <span>{data.lightRequirement}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                <span className="text-muted-foreground">
                  Watering Frequency
                </span>
                <span>{data.wateringFrequency}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                <span className="text-muted-foreground">Temperature</span>
                <span>{data.temperature}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                <span className="text-muted-foreground">Soil</span>
                <span>{data.soil}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                <span className="text-muted-foreground">Created At</span>
                <span>
                  {new Date(data.createdAtUtc).toLocaleString("vi-VN", {
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-4 lg:self-start">
          {/* Notes Card */}
          <div className="rounded-sm border bg-card p-4">
            <h2 className="mb-2 text-sm font-semibold">Notes</h2>
            <div
              className="text-sm whitespace-pre-line wrap-break-word max-w-full"
              title={data.notes}
            >
              {data.notes || <span className="text-muted-foreground">—</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
