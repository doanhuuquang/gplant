import { apiClient } from "@/lib/api/client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  DashboardLowStockAlertsResponse,
  DashboardOverviewResponse,
  DashboardRecentOrdersResponse,
  DashboardRevenueChartResponse,
} from "@/types/dashboard";

export const getDashboardOverview = async () => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<DashboardOverviewResponse>
    >("/dashboard/overview");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getDashboardRevenueChart = async (days: number) => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<DashboardRevenueChartResponse>
    >("/dashboard/revenue-chart", {
      params: { days },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getDashboardRecentOrders = async (limit: number) => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<DashboardRecentOrdersResponse[]>
    >("/dashboard/recent-orders", {
      params: { limit },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getDashboardLowStockAlerts = async (threshold: number) => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<DashboardLowStockAlertsResponse>
    >("/dashboard/low-stock-alerts", {
      params: { threshold },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
