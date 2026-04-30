export const APP_NAME = "GPlant";
export const APP_DESCRIPTION = "Next.js Application";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const ENVIRONMENT = process.env.NODE_ENV || "development";

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};
