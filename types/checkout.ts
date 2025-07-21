export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  category: string
  deliveryType: "shipping" | "pickup"
}

export interface Address {
  street: string
  apt?: string
  city: string
  state: string
  postalCode: string
  recipient: string
}

export interface UserInfo {
  email: string
  fullName: string
  phone: string
}

export interface PromoCode {
  code: string
  discount: number
  isValid: boolean
}

export interface CheckoutState {
  step: "cart" | "shipping" | "pickup" | "payment" | "success"
  deliveryMode: "shipping" | "pickup" | "mixed"
  items: CartItem[]
  userInfo: UserInfo
  shippingAddress: Address
  pickupStore: string
  pickupDate: string
  giftCardEnabled: boolean
  giftCardCode: string
  paymentMethod: "credit" | "pix" | "khipu" | "boleto" | "paypal"
  orderNumber: string
  promoCode: PromoCode
  expressDelivery: boolean // NEW: Entrega expressa
}
