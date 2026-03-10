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
import { useAssignRole } from "@/hooks/user/use-assign-role";
import { Role } from "@/lib/enums/role";
import UserResponse from "@/lib/schemas/user/user-response";

interface AssignRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse;
}

export function AssignRoleDialog({
  open,
  onOpenChange,
  user,
}: AssignRoleDialogProps) {
  const { handleAssignRole, isLoading } = useAssignRole();
  const [selectedRole, setSelectedRole] = useState<string>("");

  const availableRoles = Object.values(Role).filter(
    (role) => !user.roles.includes(role),
  );

  const onConfirm = async () => {
    if (!selectedRole) return;
    const success = await handleAssignRole(user.id, selectedRole);
    if (success) {
      setSelectedRole("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
          <DialogDescription>
            Assign a new role to <strong>{user.email}</strong>.
            <br />
            Current roles:{" "}
            {user.roles.length > 0 ? user.roles.join(", ") : "None"}
          </DialogDescription>
        </DialogHeader>

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
            <SelectValue placeholder="Select a role" />
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
            This user already has all available roles.
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
          <Button onClick={onConfirm} disabled={isLoading || !selectedRole}>
            {isLoading ? (
              <>
                <LoaderCircle className="animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
