export interface StaffData {
  totalStaff: number;
  activeStaff: number;
  inactiveStaff: number;
}

export interface CustomerData {
  totalCustomers: number;
  newThisMonth: number;
  pendingApprovals: number;
}

export interface ProductData {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
}

export interface OfferData {
  activeOffers: number;
  upcomingOffers: number;
  expiredOffers: number;
}

export interface OrderData {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
}

export interface RecentActivity {
  recentCustomer: string;
  recentOrder: string;
  recentProduct: string;
}

export interface SalesOverviewData {
  month: string;
  sales: number;
  error: string;
}

export interface DashboardData {
  staff: StaffData | null;
  customers: CustomerData | null;
  products: ProductData | null;
  offers: OfferData | null;
  orders: OrderData | null;
  recentActivity: RecentActivity | null;
  salesOverview: SalesOverviewData[] | null;
}