import { UserResponse } from "@/types/user";

export interface MediaResponse {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  mimeType: string;
  uploadedBy: UserResponse;
  createdAtUtc: Date;
}

export interface MediaResponsePageResult {
  items: MediaResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
