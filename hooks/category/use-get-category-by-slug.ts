"use client";
import * as React from "react";
import CategoryResponse from "@/lib/schemas/category/category-response";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { getCategoryBySlug } from "@/services/category-service";
import { useTranslations } from "next-intl";

export function useGetCategoryBySlug(slug: string) {
  const t = useTranslations("Errors");

  const [isLoadingCategoryBySlug, setIsLoadingCategoryBySlug] =
    React.useState<boolean>(false);
  const [getCategoryBySlugError, setGetCategoryBySlugError] = React.useState<
    string | null
  >(null);
  const [categoryBySlug, setCategoryBySlug] =
    React.useState<CategoryResponse | null>(null);

  React.useEffect(() => {
    const handleGetCategoryBySlug = async () => {
      try {
        setIsLoadingCategoryBySlug(true);
        setGetCategoryBySlugError(null);

        const response = await getCategoryBySlug(slug);
        setCategoryBySlug(response.data as CategoryResponse);
      } catch (e) {
        const err = e as ApiErrorResponse;
        setGetCategoryBySlugError(t(err.error));
      } finally {
        setIsLoadingCategoryBySlug(false);
      }
    };

    handleGetCategoryBySlug();
  }, [slug, t]);

  return {
    categoryBySlug,
    isLoadingCategoryBySlug,
    getCategoryBySlugError,
  };
}
