"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useLightningSales } from "@/lib/hooks/use-lightning-sale";
import { useMemo, useState } from "react";
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
  const { data, isLoading } = useLightningSales();
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
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
        </InputGroup>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-12! rounded-sm shadow-none">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUS}>Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang bật</SelectItem>
            <SelectItem value="inactive">Đang tắt</SelectItem>
            <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
            <SelectItem value="ongoing">Đang diễn ra</SelectItem>
            <SelectItem value="expired">Đã kết thúc</SelectItem>
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
        data={data?.data || []}
        isLoading={isLoading}
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
