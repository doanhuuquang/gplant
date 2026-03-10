import { LightningSaleItemResponse } from "@/lib/schemas/lightning-sale/lightning-sale-item-response";

export interface LightningSaleResponse {
  id: string;
  name: string;
  description: string;
  startDateUtc: string;
  endDateUtc: string;
  isActive: boolean;
  isUpcoming: boolean;
  isOngoing: boolean;
  isExpired: boolean;
  timeRemaining: string | null;
  items: LightningSaleItemResponse[];
  totalItems: number;
  activeItems: number;
  createdAtUtc: string;
  updatedAtUtc: string;
}
