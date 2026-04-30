import { OrderStatus } from "@/lib/enums/order-status";
import { PaymentMethod } from "@/lib/enums/payment-method";
import { PaymentStatus } from "@/lib/enums/payment-status";

export interface DashboardOverviewResponse {
  revenue: {
    today: number;
  };
  orders: {
    today: number;
    pending: number;
    delivering: number;
  };
  users: {
    total: number;
    active: number;
    locked: number;
  };
}

export interface DashboardRevenueChartResponse {
  labels: string[];
  data: number[];
}

export interface DashboardRecentOrdersResponse {
  id: string;
  orderNumber: string;
  shippingName: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: Date;
}

export interface DashboardLowStockAlertsResponse {
  outOfStock: {
    sku: string;
    plantVariantId: string;
    quantityAvailable: number;
  }[];
  lowStock: {
    sku: string;
    plantVariantId: string;
    quantityAvailable: number;
  }[];
  totalAlerts: number;
}
