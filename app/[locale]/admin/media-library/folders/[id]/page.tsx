"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Field, FieldLabel } from "@/components/ui/field";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useMediasByFoder } from "@/lib/hooks/use-media";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { columns } from "@/components/feature/media/columns";
import { UploadMediaDialog } from "@/components/feature/media/upload-media-dialog";

export default function Page() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const params = useParams();

  const { data, isLoading } = useMediasByFoder(params.id as string, {
    pageNumber: page,
    pageSize: pageSize,
  });

  const headerActions = useMemo(
    () => (
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => setUploadDialogOpen(true)}
        className="h-12 w-12"
      >
        <Upload className="size-5" />
      </Button>
    ),
    [],
  );

  useAdminHeader(headerActions);

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.data.items ?? []}
        isLoading={isLoading}
      />

      <div className="flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">
            Số dòng mỗi trang
          </FieldLabel>
          <Select
            defaultValue="10"
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size={"icon"}
            disabled={!data?.data.hasPreviousPage}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size={"icon"}
            disabled={!data?.data.hasNextPage}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <UploadMediaDialog
        folderId={params.id as string}
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </>
  );
}
