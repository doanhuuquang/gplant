export default interface ShippingAddressResponse {
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
