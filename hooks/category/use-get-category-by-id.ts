"use client";
import * as React from "react";
import CategoryResponse from "@/lib/schemas/category/category-response";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { getCategoryById } from "@/services/category-service";
import { useTranslations } from "next-intl";

export function useGetCategoryById(id?: string) {
  const t = useTranslations("Errors");

  const [isLoadingCategoryById, setIsLoadingCategoryById] =
    React.useState<boolean>(false);
  const [getCategoryByIdError, setGetCategoryByIdError] = React.useState<
    string | null
  >(null);
  const [categoryById, setCategoryById] =
    React.useState<CategoryResponse | null>(null);

  React.useEffect(() => {
    const handleGetCategoryBySlug = async () => {
      if (!id) return;

      try {
        setIsLoadingCategoryById(true);
        setGetCategoryByIdError(null);

        const response = await getCategoryById(id);
        setCategoryById(response.data as CategoryResponse);
      } catch (e) {
        const err = e as ApiErrorResponse;
        setGetCategoryByIdError(t(err.error));
      } finally {
        setIsLoadingCategoryById(false);
      }
    };

    handleGetCategoryBySlug();
  }, [id, t]);

  return {
    categoryById,
    isLoadingCategoryById,
    getCategoryByIdError,
  };
}
