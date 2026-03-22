export default interface UpdateAddressRequest {
  shippingName: string;
  shippingPhone: string;
  address: string;
  buildingName: string;
  isPrimary: boolean;
  longitude: string;
  latitude: string;
}
