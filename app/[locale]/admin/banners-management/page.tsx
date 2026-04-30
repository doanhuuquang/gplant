"use client";

import { BannerGroup } from "@/lib/enums/banner-group";
import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { columns } from "./columns";
import { CreateBannerDialog } from "./create-banner-dialog";
import { DataTable } from "@/components/ui/data-table";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useBanners } from "@/lib/hooks/use-banner";
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

const ALL_GROUPS = "all";

const getGroupLabel = (group: BannerGroup) => {
  if (group === BannerGroup.Carousel) return "Băng chuyền";
  if (group === BannerGroup.HomePopup) return "Popup trang chủ";
  return group;
};

export default function BannersManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>(ALL_GROUPS);

  const { data, isLoading } = useBanners();

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
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
        </InputGroup>

        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="h-12! rounded-sm shadow-none">
            <SelectValue placeholder="Tất cả nhóm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_GROUPS}>Tất cả nhóm</SelectItem>
            {Object.values(BannerGroup).map((group) => (
              <SelectItem key={group} value={group}>
                {getGroupLabel(group)}
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
        data={data?.data || []}
        isLoading={isLoading}
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
