export type AddressLabel = 'HOME' | 'OFFICE' | 'BUILDING';

export interface IMyAddress {
  addressId: number;
  customerId: number;
  recipientName: string;
  recipientPhone: string;
  addressLine: string;
  ward: string;
  city: string;
  isDefault: boolean;
  label: AddressLabel;
  fullAddress: string;
  createdAt: string;
  updatedAt: string;
}
