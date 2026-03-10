import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { CreateCategoryRequest } from "@/lib/schemas/category/create-category-request";
import { UpdateCategoryRequest } from "@/lib/schemas/category/update-category-request";

const GET_CATEGORIES_URL = "/api/categories";
const GET_ACTIVE_CATEGORIES_URL = "/api/categories/active";
const GET_CATEGORY_BY_ID_URL = "/api/categories/id";
const GET_CATEGORY_BY_SLUG_URL = "/api/categories/slug";

const getCategories = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(GET_CATEGORIES_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getActiveCategories = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(GET_ACTIVE_CATEGORIES_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getCategoryById = async (id: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${GET_CATEGORY_BY_ID_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getCategoryBySlug = async (slug: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(
      `${GET_CATEGORY_BY_SLUG_URL}/${slug}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const toggleActiveCategoryApi = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${GET_CATEGORIES_URL}/${id}/toggle-active`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const createCategoryApi = async (
  request: CreateCategoryRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(GET_CATEGORIES_URL, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateCategoryApi = async (
  id: string,
  request: UpdateCategoryRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(
      `${GET_CATEGORIES_URL}/${id}`,
      request,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deleteCategoryApi = async (id: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(`${GET_CATEGORIES_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  getCategories,
  getActiveCategories,
  getCategoryById,
  getCategoryBySlug,
  toggleActiveCategoryApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
};
