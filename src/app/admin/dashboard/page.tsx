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
  // Defining a state variable to hold all the dashboard analytics
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    staff: null,
    customers: null,
    products: null,
    offers: null,
    orders: null,
    recentActivity: null,
    salesOverview: null,
  });
  // State variable to handle data fetch status
  const [isLoading, setIsLoading] = useState(false);
  // State variables for holding error messages
  const [error, setError] = useState<string | null>(null);
  const [salesOverviewError, setSalesOverviewError] = useState(false);

  // Router variable function for navigation
  const router = useRouter();

  // Fetching the dashboard data from the backend
  const fetchDashboardData = useCallback(async () => {
    // Setting loading and error status 
    setIsLoading(true);
    setError(null);
    // fetching the required data
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
      // converting the data to json and initializng respective variables
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

      // If the salesOverview fetch encountered an error
      if (salesOverview.error) {
        setSalesOverviewError(true);
      } else {
        setSalesOverviewError(false);
      }
      // setting up the dashboard data
      setDashboardData({
        staff,
        customers,
        products,
        offers,
        orders,
        recentActivity,
        salesOverview: Array.isArray(salesOverview) ? salesOverview : [] // ensuring there's a default data for sames overview
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Setting the error to be displayed
      setError('Failed to load some dashboard data. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Calling the function to get all dashboard data
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
        {dashboardData.salesOverview && dashboardData.salesOverview.length > 0 ? (
          <>
            <BarChart
              className='dashboard_chart'
              xAxis={[
                {
                  id: 'barCategories',
                  data: dashboardData.salesOverview.map((item) => item.month),
                  scaleType: 'band',
                },
              ]}
              series={[
                {
                  data: dashboardData.salesOverview.map((item) => item.sales),
                },
              ]}
              width={500}
              height={300}
            />
            {salesOverviewError && (
              <p className="data-warning">Note: Using estimated data due to an error in fetching recent sales information.</p>
            )}
          </>
        ) : (
          <p>No sales data available.</p>
        )}
      </div>
      <div className="dashboard_recent_activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>New customer registered: {dashboardData?.recentActivity?.recentCustomer}</li>
          <li>Order #{dashboardData?.recentActivity?.recentOrder} shipped</li>
          <li>New product added: {dashboardData?.recentActivity?.recentProduct}</li>
        </ul>
      </div>
    </main>
  );
}

export default Dashboard;