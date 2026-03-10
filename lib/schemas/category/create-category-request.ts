export interface CreateCategoryRequest {
  name: string;
  description: string;
  mediaId?: string;
  parentId?: string;
}
