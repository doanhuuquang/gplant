"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { Role } from "@/lib/enums/role";
import { useAssignRole } from "@/lib/hooks/use-user";
import { UserResponse } from "@/types/user";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssignRoleDialogProps {
  open: boolean;
  user: UserResponse;
  onOpenChange: (open: boolean) => void;
}

export function AssignRoleDialog({
  open,
  onOpenChange,
  user,
}: AssignRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { mutate: assignRole, isPending } = useAssignRole();

  const availableRoles = Object.values(Role).filter(
    (role) => !user.roles.includes(role),
  );

  const onConfirm = async () => {
    if (!selectedRole) return;
    assignRole(
      { userId: user.id, roleName: selectedRole },
      {
        onSuccess: () => {
          setSelectedRole("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Gán vai trò</DialogTitle>
          <DialogDescription>
            Gán vai trò mới cho <strong>{user.email}</strong>.
            <br />
            Vai trò hiện tại:{" "}
            {user.roles.length > 0 ? user.roles.join(", ") : "Không có"}
          </DialogDescription>
        </DialogHeader>

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {availableRoles.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Người dùng này đã có tất cả vai trò khả dụng.
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
          <Button onClick={onConfirm} disabled={isPending || !selectedRole}>
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                Đang gán...
              </>
            ) : (
              "Gán vai trò"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
