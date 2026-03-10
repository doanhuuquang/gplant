"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { columns } from "./columns";
import { CreateInventoryDialog } from "./create-inventory-dialog";
import { DataTable } from "@/components/ui/data-table";
import { useGetInventories } from "@/hooks/inventory/use-get-inventories";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_STATUS = "all";

export default function InventoryManagementPage() {
  const { inventories } = useGetInventories();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUS);

  const filteredInventories = useMemo(() => {
    if (statusFilter === ALL_STATUS) return inventories;
    if (statusFilter === "in-stock")
      return inventories.filter((i) => i.isInStock && !i.isLowStock);
    if (statusFilter === "low-stock")
      return inventories.filter((i) => i.isLowStock);
    if (statusFilter === "out-of-stock")
      return inventories.filter((i) => i.isOutOfStock);
    return inventories;
  }, [inventories, statusFilter]);

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
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
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
        data={filteredInventories}
        globalFilter={searchQuery}
      />

      <CreateInventoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
