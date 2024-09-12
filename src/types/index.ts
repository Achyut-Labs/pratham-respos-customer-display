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

export interface OrderCart {
  subTotal: number;
  totalAmount: number;
  surcharge_amount: number;
  discount: number;
  orderList: OrderItem[];
}
