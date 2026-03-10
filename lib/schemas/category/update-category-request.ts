export interface UpdateCategoryRequest {
  name: string;
  description: string;
  mediaId?: string;
  parentId?: string;
  isActive: boolean;
}
