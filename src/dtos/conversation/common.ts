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
  order_id: number | null;
  order_code: string;
  status: string;
  total_amount: number;
  order_date: string;
  estimated_delivery: string | null;
  delivery_method: string | null;
  delivery_address: string | null;
  item_count: number | null;
  items: {
    product_name: string;
    quantity: number;
    price: number;
  }[] | null;
}

export interface IStructuredPromotionData {
  name: string;
  type: 'BUY_X_GET_Y' | 'PRODUCT_DISCOUNT' | 'ORDER_DISCOUNT';
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  summary: string;
  end_date: string;
  start_date: string;
  description: string;
  usage_count: number;
  usage_limit: number | null;
  promotion_code: string | null;
  promotion_line_id: number;
  buy_x_get_y_detail: {
    buy_min_value: number | null;
    gift_quantity: number;
    buy_min_quantity: number;
    buy_product_name: string;
    gift_max_quantity: number;
    gift_product_name: string;
    gift_discount_type: 'FREE' | 'FIXED_AMOUNT' | 'PERCENTAGE';
    gift_discount_value: number | null;
  } | null;
  order_discount_detail: {
    max_discount: number;
    discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discount_value: number;
    min_order_value: number;
    min_order_quantity: number | null;
  } | null;
  product_discount_detail: {
    apply_to_type: 'PRODUCT' | 'CATEGORY';
    discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discount_value: number;
    min_order_value: number;
    min_promotion_value: number | null;
    apply_to_product_name: string;
    min_promotion_quantity: number;
  } | null;
}
export interface IStructuredStockData {
  product_id: number | null;
  product_name: string;
  product_code: string | null;
  quantity: number;
  status: string;
  unit: string;
  warehouse_location: string | null;
  note: string | null;
}

export interface IStructuredPolicyData {
  title: string;
  details: string[];
  conditions: string[];
  policy_type: 'DELIVERY_AND_RETURN' | 'WARRANTY' | 'REFUND' | 'GENERAL';
  contact_info: string;
}
export interface IStructuredCartData {
  cart_id: number;
  items: {
    product_unit_id: number;
    product_name: string;
    unit_name: string;
    quantity: number;
    unit_price: number;
    original_total: number;
    final_total: number;
    image_url: string | null;
    stock_quantity: number | null;
    has_promotion: boolean;
    promotion_name: string | null;
  }[];
  total_items: number;
  sub_total: number;
  line_item_discount: number;
  order_discount: number;
  total_payable: number;
  updated_at: string;
}
