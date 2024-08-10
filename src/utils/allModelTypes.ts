import { StaticImageData } from "next/image";

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  role?: Role;
  addresses?: Address[];
  orders?: Order[];
  reviews?: ProductReview[];
  wishlist?: Product[];
  stripeCustomerId?: string | null;
  cart?: Cart | null;
}

export type Role = {
  id: number;
  name: string;
  users?: User[];
}

export type Address = {
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
  user?: User;
  orders?: Order[];
}

export type Category = {
  id: number;
  name: string;
  image: string;
  imagePublicId: string;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  basePrice: number;
  categoryId: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  variations?: ProductVariation[];
  images?: ProductImage[];
  reviews?: ProductReview[];
  orderItems?: OrderItem[];
  discounts?: DiscountProduct[];
  cartItems?: CartItem[];
  wishlistedBy?: User[];
}

export type ProductVariation = {
  id: number;
  productId: number;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
}

export type ProductImage = {
  id: number;
  productId: number;
  imageUrl: string | StaticImageData;
  imagePublicId: string;
  createdAt: Date;
  product?: Product;
}

export type Discount = {
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
  products?: DiscountProduct[];
}

export type DiscountProduct = {
  productId: number;
  discountId: number;
  product?: Product;
  discount?: Discount;
}

export type ProductReview = {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  review?: string | null;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
  user?: User;
}

export type Cart = {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  items: CartItem[];
}

export type CartItem = {
  id: number;
  cartId: number;
  productId: number;
  variationId?: number | null;
  quantity: number;
  customText?: string | null;
  cart?: Cart;
  product: Product;
  variation?: ProductVariation | null;
}

export type Order = {
  id: number;
  userId: number;
  total: number;
  status: string;
  shippingAddressId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  shippingAddress?: Address;
  orderItems?: OrderItem[];
  payment?: Payment | null;
  refunds?: Refund[];
}

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  variationId?: number | null;
  quantity: number;
  price: number;
  customText?: string | null;
  createdAt: Date;
  updatedAt: Date;
  order?: Order;
  product?: Product;
  variation?: ProductVariation | null;
}

export type Payment = {
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
  order?: Order;
}

export type Business = {
  id: number;
  name: string;
  description?: string | null;
  refundsPolicy?: string | null;
  phone: string;
  email: string;
  address: string;
  socialLinks?: SocialMedia[];
  policies?: Policy[];
}

export type SocialMedia = {
  id: number;
  businessId: number;
  name: string;
  url: string;
  business?: Business;
}

export type Policy = {
  id: number;
  businessId: number;
  name: string;
  business?: Business;
}

export type Refund = {
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
  order?: Order;
}