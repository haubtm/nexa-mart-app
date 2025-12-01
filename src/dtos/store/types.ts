export interface IStore {
  storeId: number;
  storeCode: string;
  storeName: string;
  address: string;
  phone: string | null;
  openingTime: string | null;
  closingTime: string | null;
  isActive: boolean;
}
