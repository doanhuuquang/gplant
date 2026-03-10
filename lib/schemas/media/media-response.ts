import UserResponse from "@/lib/schemas/user/user-response";

export default interface MediaResponse {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  mimeType: string;
  uploadedBy: UserResponse;
  createdAtUtc: Date;
}
