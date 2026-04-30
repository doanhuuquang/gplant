"use client";

import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { DeleteFolderDialog } from "@/components/feature/folder/delete-folder-dialog";
import { Folder, Trash } from "lucide-react";
import { FolderResponse } from "@/types/folder";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function FolderCard({ folder }: { folder: FolderResponse }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Link
            href={`${APP_PATHS.MEDIA_LIBRARY_FOLDERS}/${folder.id}`}
            className="bg-background p-4 rounded-sm border flex gap-4"
          >
            <div className="relative">
              <Folder className="size-12 fill-muted text-muted" />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-xs text-muted-foreground">
                {folder.mediaCount}
              </p>
            </div>
            <div>
              <p>{folder.name}</p>
              <p className="text-xs text-muted-foreground">
                {Intl.DateTimeFormat("vi-VN", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "Asia/Ho_Chi_Minh",
                }).format(new Date(folder.createdAtUtc))}
              </p>
            </div>
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="flex items-center justify-between"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <p>Xóa</p>
            <Trash className="size-4 text-destructive" />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DeleteFolderDialog
        folder={folder}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </>
  );
}
