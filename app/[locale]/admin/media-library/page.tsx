"use client";

import FolderCard from "@/components/feature/folder/folder-card";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { CreateFolderDialog } from "@/components/feature/folder/create-folder-dialog";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useFolders } from "@/lib/hooks/use-folder";
import { useMemo, useState } from "react";

export default function Page() {
  const [openCreateFolderDialog, setOpenCreateFolderDialog] =
    useState<boolean>(false);

  const { data } = useFolders();

  const headerActions = useMemo(
    () => (
      <>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => setOpenCreateFolderDialog(true)}
          className="h-12 w-12"
        >
          <CirclePlus className="size-5" />
        </Button>
      </>
    ),
    [],
  );

  useAdminHeader(headerActions);

  return (
    <main className="w-full grid lg:grid-cols-4 md:grid-cols-2 gap-2">
      {data?.data.map((folder, index) => (
        <FolderCard folder={folder} key={index} />
      ))}

      <CreateFolderDialog
        open={openCreateFolderDialog}
        onOpenChange={setOpenCreateFolderDialog}
      />
    </main>
  );
}
