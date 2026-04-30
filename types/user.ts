import z from "zod";
import { Role } from "@/lib/enums/role";
import { UpdateUserRequestValidation } from "@/validations/user";

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  roles: Role[];
  isLocked: boolean;
  lockoutEnd?: string | null;
}

export interface UserResponsePageResult {
  items: UserResponse[];
  totalCount: number;
  activeUsersCount: number;
  lockedUsersCount: number;
  newUsersThisWeek: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestValidation>;
