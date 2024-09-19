export interface CustomerData {
    totalCustomers: number;
    newThisMonth: number;
  }
  
  export interface OrderData {
    totalOrders: number;
    pendingOrders: number;
    shippedOrders: number;
  }
  
  export interface RefundData {
    totalRefunds: number;
    pendingRefunds: number;
    approvedRefunds: number;
  }
  
  export interface RecentActivity {
    recentCustomer: string;
    recentOrder: string;
    recentRefund: string;
  }
  
  export interface ServiceDashboardData {
    customers: CustomerData | null;
    orders: OrderData | null;
    refunds: RefundData | null;
    recentActivity: RecentActivity | null;
  }