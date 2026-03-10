"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useGetMedias } from "@/hooks/media/use-get-medias";
import { useMemo, useState } from "react";
import { useAdminHeader } from "@/hooks/use-admin-header";

import { columns } from "@/app/[locale]/admin/media-library/columns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { UploadMediaDialog } from "@/app/[locale]/admin/media-library/upload-media-dialog";

export default function Page() {
  const {
    medias,
    hasNextPage,
    hasPreviousPage,
    setPageNumber,
    setPageSize,
    pageNumber,
  } = useGetMedias();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

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
      <DataTable columns={columns} data={medias} />

      <div className="flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
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
            disabled={!hasPreviousPage}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size={"icon"}
            disabled={!hasNextPage}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <UploadMediaDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </>
  );
}
