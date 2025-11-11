export interface IConversationResponseData {
  id: string;
  customerId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
}

export interface IStructuredProductData {
  product_id: number;
  name: string;
  code: string;
  price: number;
  unit: string;
  brand: string;
  stock_status: string;
  image_url: string;
  description: string;
  has_promotion: boolean;
  promotion_price: number;
}

export interface IStructuredOrderData {
  order_id: number;
  order_code: string;
  status: string;
  total_amount: number;
  order_date: string;
  estimated_delivery: string;
  delivery_method: string;
  delivery_address: string;
  item_count: number;
  items: {
    product_name: string;
    quantity: number;
    price: number;
  }[];
}

export interface IStructuredPromotionData {
  promotion_id: number;
  name: string;
  description: string;
  type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  conditions: string;
  applicable_to: string;
  is_active: boolean;
}
export interface IStructuredStockData {
  product_id: number;
  product_name: string;
  product_code: string;
  quantity: number;
  status: string;
  unit: string;
  warehouse_location: string;
  note: string;
}

export interface IStructuredPolicyData {
  policy_type: string;
  title: string;
  details: string[];
  conditions: string[];
  contact_info: string;
}
