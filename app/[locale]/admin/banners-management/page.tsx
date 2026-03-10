"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { columns } from "./columns";
import { CreateBannerDialog } from "./create-banner-dialog";
import { DataTable } from "@/components/ui/data-table";
import { useGetBanners } from "@/hooks/banner/use-get-banners";
import { useMemo, useState } from "react";
import { useAdminHeader } from "@/hooks/use-admin-header";
import { BannerGroup } from "@/lib/enums/banner-group";
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

const ALL_GROUPS = "all";

export default function BannersManagementPage() {
  const { banners } = useGetBanners();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>(ALL_GROUPS);

  const columnFilters: ColumnFiltersState = useMemo(() => {
    const filters: ColumnFiltersState = [];
    if (groupFilter !== ALL_GROUPS) {
      filters.push({ id: "group", value: groupFilter });
    }
    return filters;
  }, [groupFilter]);

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

        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="h-12! rounded-sm shadow-none">
            <SelectValue placeholder="All Groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_GROUPS}>All Groups</SelectItem>
            {Object.values(BannerGroup).map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
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
    [searchQuery, groupFilter],
  );

  useAdminHeader(headerActions);

  return (
    <>
      <DataTable
        columns={columns}
        data={banners}
        globalFilter={searchQuery}
        columnFilters={columnFilters}
      />

      <CreateBannerDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
