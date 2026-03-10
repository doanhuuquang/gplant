import { Role } from "@/lib/enums/role";

export default interface UserResponse {
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
