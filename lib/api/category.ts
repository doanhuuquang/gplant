import { apiClient } from "@/lib/api/client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";

export const getCategories = async () => {
  try {
    const { data } =
      await apiClient.get<SuccessResponse<CategoryResponse[]>>("/categories");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getActiveCategories = async () => {
  try {
    const { data } =
      await apiClient.get<SuccessResponse<CategoryResponse[]>>(
        "/categories/active",
      );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getCategoryById = async (id: string) => {
  try {
    if (!id || id === "") return;

    const { data } = await apiClient.get<SuccessResponse<CategoryResponse>>(
      `/categories/id/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getCategoryBySlug = async (slug: string) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<CategoryResponse>>(
      `/categories/slug/${slug}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const toggleActiveCategory = async (id: string) => {
  try {
    const { data } = await apiClient.patch<SuccessResponse<null>>(
      `/categories/${id}/toggle-active`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createCategory = async (request: CreateCategoryRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<null>>(
      `/categories`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCategory = async (
  id: string,
  request: UpdateCategoryRequest,
) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<null>>(
      `/categories/${id}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/categories/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
