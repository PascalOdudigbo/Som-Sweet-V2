'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { IconContext } from 'react-icons'
import { FaUser } from 'react-icons/fa'
import { GiShoppingBag } from 'react-icons/gi'
import { MdReviews } from 'react-icons/md'
import { TbRosetteDiscountCheckFilled } from 'react-icons/tb'
import { MdRefresh } from 'react-icons/md';
import "./_dashboard.scss"
import { DashboardData } from '@/utils/adminDashboardTypes'
import { useRouter } from 'next/navigation';
import { Loading } from '@/components';
import { BarChart } from '@mui/x-charts/BarChart';
import { FaClipboardUser } from 'react-icons/fa6';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    staff: null,
    customers: null,
    products: null,
    offers: null,
    orders: null,
    recentActivity: null,
    salesOverview: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        staffResponse,
        customersResponse,
        productsResponse,
        offersResponse,
        ordersResponse,
        recentActivityResponse,
        salesOverviewResponse
      ] = await Promise.all([
        fetch('/api/admin/dashboard/staff'),
        fetch('/api/admin/dashboard/customer'),
        fetch('/api/admin/dashboard/product'),
        fetch('/api/admin/dashboard/offer'),
        fetch('/api/admin/dashboard/order'),
        fetch('/api/admin/dashboard/recentActivity'),
        fetch('/api/admin/dashboard/salesOverview')
      ]);

      const [
        staff,
        customers,
        products,
        offers,
        orders,
        recentActivity,
        salesOverview
      ] = await Promise.all([
        staffResponse.json(),
        customersResponse.json(),
        productsResponse.json(),
        offersResponse.json(),
        ordersResponse.json(),
        recentActivityResponse.json(),
        salesOverviewResponse.json()
      ]);

      setDashboardData({
        staff,
        customers,
        products,
        offers,
        orders,
        recentActivity,
        salesOverview
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r') fetchDashboardData();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [fetchDashboardData]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className='dashboard_content'>
      <div className="dashboard_header flex_row_center">
        <h2 className='dashboard_title section_title'>Dashboard</h2>
        <button onClick={fetchDashboardData} className="refresh-button" aria-label="Refresh dashboard">
          <MdRefresh />
          Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard_grid">
        <div className="dashboard_card" onClick={() => { router.push("/admin/staff") }} aria-label="Staff information">
          <IconContext.Provider value={{ className: "dashboard_icon" }}>
            <FaClipboardUser />
          </IconContext.Provider>
          <h2>Staff</h2>
          <p title="Total number of staff members">Total: {dashboardData?.staff?.totalStaff}</p>
          <p title="Number of active staff members">Active: {dashboardData?.staff?.activeStaff}</p>
          <p title="Number of inactive staff members">Inactive: {dashboardData?.staff?.inactiveStaff}</p>
        </div>

        <div className="dashboard_card" onClick={() => { router.push("/admin/customers") }} aria-label="Customer information">
          <IconContext.Provider value={{ className: "dashboard_icon" }}>
            <FaUser />
          </IconContext.Provider>
          <h2>Customers</h2>
          <p title="Total number of customers">Total: {dashboardData?.customers?.totalCustomers}</p>
          <p title="New customers this month">New this month: {dashboardData?.customers?.newThisMonth}</p>
          <p title="Customers pending approval">Pending approvals: {dashboardData?.customers?.pendingApprovals}</p>
        </div>

        <div className="dashboard_card" onClick={() => { router.push("/admin/products") }} aria-label="Product information">
          <IconContext.Provider value={{ className: "dashboard_icon" }}>
            <GiShoppingBag />
          </IconContext.Provider>
          <h2>Products</h2>
          <p title="Total number of products">Total: {dashboardData?.products?.totalProducts}</p>
          <p title="Number of active products">Active: {dashboardData?.products?.activeProducts}</p>
          <p title="Number of inactive products">Inactive: {dashboardData?.products?.inactiveProducts}</p>
        </div>

        <div className="dashboard_card" onClick={() => { router.push("/admin/offers") }} aria-label="Offer information">
          <IconContext.Provider value={{ className: "dashboard_icon" }}>
            <TbRosetteDiscountCheckFilled />
          </IconContext.Provider>
          <h2>Offers</h2>
          <p title="Number of active offers">Active: {dashboardData?.offers?.activeOffers}</p>
          <p title="Number of upcoming offers">Upcoming: {dashboardData?.offers?.upcomingOffers}</p>
          <p title="Number of expired offers">Expired: {dashboardData?.offers?.expiredOffers}</p>
        </div>

        <div className="dashboard_card" onClick={() => { router.push("/admin/orders") }} aria-label="Order information">
          <IconContext.Provider value={{ className: "dashboard_icon" }}>
            <MdReviews />
          </IconContext.Provider>
          <h2>Orders</h2>
          <p title="Total number of orders">Total: {dashboardData?.orders?.totalOrders}</p>
          <p title="Number of pending orders">Pending: {dashboardData?.orders?.pendingOrders}</p>
          <p title="Number of shipped orders">Shipped: {dashboardData?.orders?.shippedOrders}</p>
        </div>
      </div>

      <div className="dashboard_chart_container flex_column_justify_center">
        <h2>Sales Overview</h2>
        <p>An overview of the sales for the last six months.</p>

        <BarChart
          className='dashboard_chart'
          xAxis={[
            {
              id: 'barCategories',
              data: dashboardData?.salesOverview?.map((item) => item?.month) ?? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              scaleType: 'band',
            },
          ]}
          series={[
            {
              data: dashboardData?.salesOverview?.map((item) => item?.sales) ?? [0, 0, 0, 0, 0, 0],
            },
          ]}
          width={500}
          height={300}
        />
      </div>

      <div className="dashboard_recent_activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>New customer registered: {dashboardData?.recentActivity?.recentCustomer || 'Loading...'}</li>
          <li>Order #{dashboardData?.recentActivity?.recentOrder || 'Loading...'} shipped</li>
          <li>New product added: {dashboardData?.recentActivity?.recentProduct || 'Loading...'}</li>
        </ul>
      </div>
    </main>
  );
}

export default Dashboard;