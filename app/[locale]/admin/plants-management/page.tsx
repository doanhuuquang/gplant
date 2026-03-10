"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CirclePlus, Search } from "lucide-react";
import { columns } from "./columns";
import { CreatePlantDialog } from "./create-plant-dialog";
import { DataTable } from "@/components/ui/data-table";
import { useGetPlants } from "@/hooks/plant/use-get-plants";
import { useMemo, useState } from "react";
import { useAdminHeader } from "@/hooks/use-admin-header";

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
import { Field, FieldLabel } from "@/components/ui/field";

export default function PlantsManagementPage() {
  const {
    plants,
    hasNextPage,
    hasPreviousPage,
    setPageNumber,
    setPageSize,
    pageNumber,
  } = useGetPlants();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const headerActions = useMemo(
    () => (
      <>
        <InputGroup className="w-full max-w-xl border-transparent bg-muted dark:bg-background">
          <InputGroupInput
            placeholder="Search..."
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
      <DataTable columns={columns} data={plants} globalFilter={searchQuery} />

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

      <CreatePlantDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
