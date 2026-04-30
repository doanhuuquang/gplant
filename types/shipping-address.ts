import z from "zod";
import {
  CreateShippingAddressRequestValidation,
  UpdateShippingAddressRequestValidation,
} from "@/validations/shipping-address";

export interface ShippingAddressResponse {
  id: string;
  userId: string;
  shippingName: string;
  shippingPhone: string;
  address: string;
  buildingName: string;
  isPrimary: boolean;
  longitude: string;
  latitude: string;
}

export type CreateShippingAddressRequest = z.infer<
  typeof CreateShippingAddressRequestValidation
>;
export type UpdateShippingAddressRequest = z.infer<
  typeof UpdateShippingAddressRequestValidation
>;
