export interface ModifierCategory {
  id: number
  is_mandatory: 0 | 1
  is_single_select: 0 | 1
  modifier_category: string
  seq_no: number
  status: 0 | 1
}

export interface FormattedModifers {
  modifier_name: string
  id: string
  price: number
  category: ModifierCategory
}

export enum AMOUNT_TYPES {
  Flat = 1,
  Percent = 2
}


export interface Product_Tag {
  id: string
  tag: string
}

export interface DeliveryAddress {
  alternate_phone: string | null
  city: string
  country: string
  created_at: string // ISO date string
  created_by: string // User ID as a string
  id: string
  is_default: number // 0 or 1, could also be a boolean if that's more appropriate
  latitude: number | null
  longitude: number | null
  module_id: number
  module_type: number
  phone: string
  postcode: string
  province: string
  street_name: string
  unit_number: string
  updated_at: string | null // ISO date string or null
  updated_by: string | null // User ID as a string or null
}

export interface OrderType {
  id: number
  status: number
  type:
    | 'Dine In'
    | 'Takeaway'
    | 'Delivery'
    | 'Dine In and Takeaway'
    | 'Delivery, Dine In, Takeaway'
    | 'Delivery, Dine In'
}


export interface CartCustomer {
  id: number
  name: string
  email: string
  phone_no: string
}

export interface CartModifier extends FormattedModifers {
  quantity: number
}

export interface CartLineItem {
  /**
   * Unique lineItem Id
   */
  readonly id: string
  /**
   * TOtal price of lineItem `productPrice * quantity + allModifiers`
   */
  line_item_total: number
  quantity: number
  /**
   * Price of 1 product
   */
  price: number
  /**
   * list of selected modifiers
   */
  modifiers: CartModifier[]
  table_id: number | null
  /**
   * product id
   */
  product_id: number
  /**
   * Product Name
   */
  name: string
  /**
   * @deprecated there is no such use of category_id in the system for now
   */
  category_id?: number
  tag?: string | null
  notes?: string
  /**
   * name of the misc product
   */
  misc_product_name?: string
  restaurant_product_tags: Product_Tag[]
  restaurant_product_id: number | null
}

export interface CartOrderPayment {
  payment_method_id: number
  paymentMethodName: string
  amount_paid: number
  status: number
  tag?: string
}
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
  restaurant_id: number
  full_order_id?: string
  order_type: OrderType
  /**
   * this is unique id usefull for crud operations
   */
  readonly orderId: string
  daily_order_number: string
  created_at?: Date | string

  orderList: CartLineItem[]
  delivery_charge?: number | null
  surcharge_amount?: number
  surcharge_type: number;
  discount?: number
  isFlatDiscount?: AMOUNT_TYPES
  discount_type?: number
  discount_reason?: string

  orderPayments: CartOrderPayment[]
  customer: CartCustomer | null
  guestCustomerName?: string
  attendant?: {
    name: string
    id: string
  }

  subTotal: number
  totalAmount: number
  totalPaidAmount: number
  outstandingAmount: number
  pickup_time?: string | null

  delivery_time: number | null
  waiting_time: number | null
  note: string
  is_online_order: 0 | 1
  linkly_transaction_number?: string
  table?: {
    name: string
    id: number
  }
  addresses?: DeliveryAddress | null // NOTE: used only for receipt print
  // local properties
  isDaySurchargeApplied?: boolean
}

export interface EmitOrderCartData extends OrderCart {
  paid?: boolean
}
