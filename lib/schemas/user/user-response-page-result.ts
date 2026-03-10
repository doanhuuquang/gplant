import UserResponse from "@/lib/schemas/user/user-response";

export default interface UserResponsePageResult {
  items: UserResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
