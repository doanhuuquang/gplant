import { useQuery } from "@tanstack/react-query";
import {
  getDashboardOverview,
  getDashboardRevenueChart,
  getDashboardRecentOrders,
  getDashboardLowStockAlerts,
} from "@/lib/api/dashboard";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: ["dashboard", "overview"] as const,
  revenue: (days: number) => ["dashboard", "revenue", days] as const,
  recent: (limit: number) => ["dashboard", "recent", limit] as const,
  lowStock: (threshold: number) =>
    ["dashboard", "low-stock", threshold] as const,
};

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: dashboardKeys.overview,
    queryFn: () => getDashboardOverview(),
  });
};

export const useDashboardRevenueChart = (days: number, enabled = true) => {
  return useQuery({
    queryKey: dashboardKeys.revenue(days),
    queryFn: () => getDashboardRevenueChart(days),
    enabled: !!days && enabled,
  });
};

export const useDashboardRecentOrders = (limit: number, enabled = true) => {
  return useQuery({
    queryKey: dashboardKeys.recent(limit),
    queryFn: () => getDashboardRecentOrders(limit),
    enabled: !!limit && enabled,
  });
};

export const useDashboardLowStockAlerts = (
  threshold: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: dashboardKeys.lowStock(threshold),
    queryFn: () => getDashboardLowStockAlerts(threshold),
    enabled: !!threshold && enabled,
  });
};
