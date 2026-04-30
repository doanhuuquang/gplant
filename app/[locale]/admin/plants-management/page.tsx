"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CirclePlus, Search } from "lucide-react";
import { columns } from "./columns";
import { CreatePlantDialog } from "./create-plant-dialog";
import { DataTable } from "@/components/ui/data-table";
import { Field, FieldLabel } from "@/components/ui/field";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useMemo, useState } from "react";
import { usePlants } from "@/lib/hooks/use-plant";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PlantsManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = usePlants({
    pageNumber: page,
    pageSize: pageSize,
  });

  const headerActions = useMemo(
    () => (
      <>
        <InputGroup className="w-full max-w-xl border-transparent bg-muted dark:bg-background">
          <InputGroupInput
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
        </InputGroup>

        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => setCreateDialogOpen(true)}
          className="h-12 w-12"
        >
          <CirclePlus className="size-5" />
        </Button>
      </>
    ),
    [searchQuery],
  );

  useAdminHeader(headerActions);

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.data.items || []}
        isLoading={isLoading}
        globalFilter={searchQuery}
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

      <CreatePlantDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
