'use client';
import React, { useEffect, useState } from 'react';
import { IconContext } from 'react-icons'
import { FaUser } from 'react-icons/fa'
import { GiShoppingBag } from 'react-icons/gi'
import { MdReviews } from 'react-icons/md'
import "./_service_professional_dashboard.scss"
import { ServiceDashboardData } from '@/utils/serviceProviderDashboardTypes';

function ServiceDashboard() {
  // State to hold all the dashboard data
  const [dashboardData, setDashboardData] = useState<ServiceDashboardData>({
    customers: null,
    orders: null,
    refunds: null,
    recentActivity: null,
  });

  useEffect(() => {
    // Function to fetch all the data 
    async function fetchDashboardData() {
      try {
        // Fetch data from API endpoints
        const [
          customersResponse,
          ordersResponse,
          refundsResponse,
          recentActivityResponse
        ] = await Promise.all([
          fetch('/api/service/dashboard/customer'),
          fetch('/api/service/dashboard/order'),
          fetch('/api/service/dashboard/refund'),
          fetch('/api/service/dashboard/recentActivity')
        ]);

        // Parse JSON responses
        const [
          customers,
          orders,
          refunds,
          recentActivity
        ] = await Promise.all([
          customersResponse.json(),
          ordersResponse.json(),
          refundsResponse.json(),
          recentActivityResponse.json()
        ]);

        // Update state with fetched data
        setDashboardData({
          customers,
          orders,
          refunds,
          recentActivity
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Handle error (show error message to user)
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <main className='service_dashboard_content'>
      <h2 className='dashboard_title section_title'>Service Dashboard</h2>

      <div className="dashboard_grid">
        <div className="dashboard_card">
          <IconContext.Provider value={{ className: "dashboard_icon" }}>
            <FaUser />
          </IconContext.Provider>
          <h2>Customers</h2>
          <p>Total: {dashboardData?.customers?.totalCustomers}</p>
          <p>New this month: {dashboardData?.customers?.newThisMonth}</p>
        </div>

        <div className="dashboard_card">
          <IconContext.Provider value={{ className: "dashboard_icon" }}>
            <GiShoppingBag />
          </IconContext.Provider>
          <h2>Orders</h2>
          <p>Total: {dashboardData?.orders?.totalOrders}</p>
          <p>Pending: {dashboardData?.orders?.pendingOrders}</p>
          <p>Shipped: {dashboardData?.orders?.shippedOrders}</p>
        </div>

        <div className="dashboard_card">
          <IconContext.Provider value={{ className: "dashboard_icon" }}>
            <MdReviews />
          </IconContext.Provider>
          <h2>Refund Requests</h2>
          <p>Total: {dashboardData?.refunds?.totalRefunds}</p>
          <p>Pending: {dashboardData?.refunds?.pendingRefunds}</p>
          <p>Approved: {dashboardData?.refunds?.approvedRefunds}</p>
        </div>
      </div>

      <div className="dashboard_recent_activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>New customer registered: {dashboardData?.recentActivity?.recentCustomer}</li>
          <li>Order #{dashboardData?.recentActivity?.recentOrder} shipped</li>
          <li>Refund request #{dashboardData?.recentActivity?.recentRefund} received</li>
        </ul>
      </div>
    </main>
  )
}

export default ServiceDashboard