export interface OrderModifier {
  modifier_name: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  line_item_total: number;
  notes?: string;
  modifiers: OrderModifier[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone_no: string;
}

export interface OrderCart {
  customer: Customer | null;
  subTotal: number;
  totalAmount: number;
  surcharge_amount: number;
  surcharge_type: number;
  discount: number;
  discount_type: number;
  orderId: string;
  daily_order_number: string;
  orderList: OrderItem[];
}
