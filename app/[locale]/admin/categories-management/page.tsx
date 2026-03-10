"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { columns } from "./columns";
import { CreateCategoryDialog } from "./create-category-dialog";
import { DataTable } from "@/components/ui/data-table";
import { useGetCategories } from "@/hooks/category/use-get-categories";
import { useMemo, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAdminHeader } from "@/hooks/use-admin-header";

export default function CategoriesManagementPage() {
  const { categories } = useGetCategories();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const headerActions = useMemo(
    () => (
      <>
        <div className="w-full max-w-xl flex items-center justify-between gap-2">
          <InputGroup className="w-full border-none bg-muted dark:bg-background">
            <InputGroupInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>

          <Button
            variant={"outline"}
            className="w-12 h-12 bg-background dark:bg-background"
            onClick={() => setCreateDialogOpen(true)}
          >
            <CirclePlus className="size-5" />
          </Button>
        </div>
      </>
    ),
    [searchQuery],
  );

  useAdminHeader(headerActions);

  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        globalFilter={searchQuery}
      />

      <CreateCategoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
