"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { columns } from "./columns";
import { CreateInventoryDialog } from "./create-inventory-dialog";
import { DataTable } from "@/components/ui/data-table";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useInventories } from "@/lib/hooks/use-inventory";
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

const ALL_STATUS = "all";

export default function InventoryManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUS);

  const { data, isLoading } = useInventories();

  const filteredInventories = useMemo(() => {
    if (statusFilter === ALL_STATUS) return data?.data;
    if (statusFilter === "in-stock")
      return data?.data.filter((i) => i.isInStock && !i.isLowStock);
    if (statusFilter === "low-stock")
      return data?.data.filter((i) => i.isLowStock);
    if (statusFilter === "out-of-stock")
      return data?.data.filter((i) => i.isOutOfStock);
    return data?.data;
  }, [data, statusFilter]);

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
            <SelectItem value="in-stock">Còn hàng</SelectItem>
            <SelectItem value="low-stock">Sắp hết hàng</SelectItem>
            <SelectItem value="out-of-stock">Hết hàng</SelectItem>
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
        data={filteredInventories ?? []}
        isLoading={isLoading}
        globalFilter={searchQuery}
      />

      <CreateInventoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
