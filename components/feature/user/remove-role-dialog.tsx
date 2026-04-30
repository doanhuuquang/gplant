"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { Role } from "@/lib/enums/role";
import { useRemoveRole } from "@/lib/hooks/use-user";
import { UserResponse } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RemoveRoleDialogProps {
  open: boolean;
  user: UserResponse;
  onOpenChange: (open: boolean) => void;
  role: Role;
}

export function RemoveRoleDialog({
  open,
  onOpenChange,
  user,
  role,
}: RemoveRoleDialogProps) {
  const { mutate: removeRole, isPending } = useRemoveRole();

  const onRemoveRole = async () => {
    if (!role) return;
    removeRole(
      {
        userId: user.id,
        roleName: role,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Gỡ vai trò</DialogTitle>
          <DialogDescription>
            Gỡ vai trò <strong>{role}</strong> khỏi{" "}
            <strong>{user.email}</strong>.
          </DialogDescription>
        </DialogHeader>

        {user.roles.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Người dùng này không có vai trò nào để gỡ.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={onRemoveRole}
            disabled={isPending || !role}
            variant="destructive"
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                Đang gỡ...
              </>
            ) : (
              "Gỡ vai trò"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
