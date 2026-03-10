"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { columns } from "./columns";
import { CreateCareInstructionDialog } from "./create-care-instruction-dialog";
import { DataTable } from "@/components/ui/data-table";
import { useGetCareInstructions } from "@/hooks/care-instruction/use-get-care-instructions";
import { useMemo, useState } from "react";
import { useAdminHeader } from "@/hooks/use-admin-header";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function CareInstructionsManagementPage() {
  const { careInstructions } = useGetCareInstructions();
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
      <DataTable
        columns={columns}
        data={careInstructions}
        globalFilter={searchQuery}
      />

      <CreateCareInstructionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
