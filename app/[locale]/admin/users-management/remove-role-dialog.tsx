"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { useRemoveRole } from "@/hooks/user/use-remove-role";
import UserResponse from "@/lib/schemas/user/user-response";

interface RemoveRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse;
}

export function RemoveRoleDialog({
  open,
  onOpenChange,
  user,
}: RemoveRoleDialogProps) {
  const { handleRemoveRole, isLoading } = useRemoveRole();
  const [selectedRole, setSelectedRole] = useState<string>("");

  const onConfirm = async () => {
    if (!selectedRole) return;
    const success = await handleRemoveRole(user.id, selectedRole);
    if (success) {
      setSelectedRole("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Remove Role</DialogTitle>
          <DialogDescription>
            Remove a role from <strong>{user.email}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
            <SelectValue placeholder="Select a role to remove" />
          </SelectTrigger>
          <SelectContent>
            {user.roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {user.roles.length === 0 && (
          <p className="text-sm text-muted-foreground">
            This user has no roles to remove.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || !selectedRole}
            variant="destructive"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="animate-spin" />
                Removing...
              </>
            ) : (
              "Remove"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
