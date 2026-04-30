import z from "zod";
import { CreateFolderRequestValidation } from "@/validations/folder";

export interface FolderResponse {
  id: string;
  slug: string;
  name: string;
  createdAtUtc: Date;
  mediaCount: number;
}

export type CreateFolderRequest = z.infer<typeof CreateFolderRequestValidation>;
