import { StaticImageData } from "next/image";

export type UserType = {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  role?: RoleType;
  addresses?: AddressType[];
  orders?: OrderType[];
  reviews?: ProductReviewType[];
  wishlist?: UserWishlistType[];
  stripeCustomerId?: string | null;
  cart?: CartType | null;
}

export type RoleType = {
  id: number;
  name: string;
  users?: UserType[];
}

export type AddressType = {
  id: number;
  userId: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  user?: UserType;
  orders?: OrderType[];
}

export type CategoryType = {
  id: number;
  name: string;
  image: string;
  imagePublicId: string;
  createdAt: Date;
  updatedAt: Date;
  products?: ProductType[];
}

export type ProductType = {
  id: number;
  name: string;
  description?: string | null;
  basePrice: number;
  categoryId: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: CategoryType;
  variations?: ProductVariationType[];
  images?: ProductImageType[];
  reviews?: ProductReviewType[];
  orderItems?: OrderItemType[];
  discounts?: DiscountProductType[];
  cartItems?: CartItemType[];
  wishlistedBy?: UserWishlistType[];
}

export type ProductVariationType = {
  id: number;
  productId: number;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  product?: ProductType;
  cartItems?: CartItemType[];
  orderItems?: OrderItemType[];
}

export type ProductImageType = {
  id: number;
  productId: number;
  imageUrl: string | StaticImageData;
  imagePublicId: string;
  createdAt: Date;
  product?: ProductType;
}

export type DiscountType = {
  id: number;
  name: string;
  description?: string | null;
  discountPercent: number;
  validFrom: Date;
  validUntil: Date;
  imageUrl?: string | null | StaticImageData;
  imagePublicId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  products?: DiscountProductType[];
}

export type DiscountProductType = {
  productId: number;
  discountId: number;
  product?: ProductType;
  discount?: DiscountType;
}

export type ProductReviewType = {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  review?: string | null;
  createdAt: Date;
  updatedAt: Date;
  product?: ProductType;
  user?: UserType;
}

export type CartType = {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: UserType;
  items: CartItemType[];
}

export type CartItemType = {
  id: number;
  cartId: number;
  productId: number;
  variationId?: number | null;
  quantity: number;
  customText?: string | null;
  cart?: CartType;
  product: ProductType;
  variation?: ProductVariationType | null;
}

export type OrderType = {
  id: number;
  userId: number;
  total: number;
  status: string;
  shippingAddressId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: UserType;
  shippingAddress?: AddressType;
  orderItems?: OrderItemType[];
  payment?: PaymentType | null;
  refunds?: RefundType[];
}

export type OrderItemType = {
  id: number;
  orderId: number;
  productId: number;
  variationId?: number | null;
  quantity: number;
  price: number;
  customText?: string | null;
  createdAt: Date;
  updatedAt: Date;
  order?: OrderType;
  product?: ProductType;
  variation?: ProductVariationType | null;
}

export type PaymentType = {
  id: number;
  orderId: number;
  stripePaymentId: string;
  stripeCustomerId?: string | null;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  order?: OrderType;
}

export type BusinessType = {
  id: number;
  name: string;
  description?: string | null;
  refundsPolicy?: string | null;
  phone: string;
  email: string;
  address: string;
  socialLinks?: SocialMediaType[];
  policies?: PolicyType[];
}

export type SocialMediaType = {
  id: number;
  businessId: number;
  name: string;
  url: string;
  business?: BusinessType;
}

export type PolicyType = {
  id: number;
  businessId: number;
  name: string;
  business?: BusinessType;
}

export type RefundType = {
  id: number;
  orderId: number;
  amount: number;
  reason: string;
  status: string;
  stripeRefundId: string | null;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: number | null;
  approvedAt?: Date | null;
  order?: OrderType;
}

export type UserWishlistType = {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
  user?: UserType;
  product?: ProductType;
}