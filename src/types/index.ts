export interface Modifier {
  modifier_name: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  name: string;
  modifiers: Modifier[];
}
type NewType = string;

export interface Customer {
  name: string;
  email: string;
  phone_no: string;
  customer: unknown;
  id: NewType;
  modifiers: Modifier[];
}

export interface OrderCart {
  customer: string;
  subTotal: number;
  totalAmount: number;
  surcharge_amount: number;
  discount: number;
  orderList: OrderItem[];
}
