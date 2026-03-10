"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useGetLightningSales } from "@/hooks/lightning-sale/use-get-lightning-sales";
import { useMemo, useState } from "react";
import { useAdminHeader } from "@/hooks/use-admin-header";
import { ColumnFiltersState } from "@tanstack/react-table";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { columns } from "@/app/[locale]/admin/lightning-sales-management/columns";
import { CreateLightningSaleDialog } from "@/app/[locale]/admin/lightning-sales-management/create-lightning-sale-dialog";

const ALL_STATUS = "all";

export default function LightningSalesManagementPage() {
  const { lightningSales } = useGetLightningSales();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUS);

  const columnFilters: ColumnFiltersState = useMemo(() => {
    const filters: ColumnFiltersState = [];
    if (statusFilter !== ALL_STATUS) {
      filters.push({ id: "status", value: statusFilter });
    }
    return filters;
  }, [statusFilter]);

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

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-12! rounded-sm shadow-none">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUS}>All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

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
    [searchQuery, statusFilter],
  );

  useAdminHeader(headerActions);

  return (
    <>
      <DataTable
        columns={columns}
        data={lightningSales}
        globalFilter={searchQuery}
        columnFilters={columnFilters}
      />

      <CreateLightningSaleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
