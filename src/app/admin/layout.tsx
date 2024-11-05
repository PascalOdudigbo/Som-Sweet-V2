'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Badge, Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'
import { IconContext, IconType } from 'react-icons'
import { AiFillDashboard } from 'react-icons/ai'
import { FaUser, FaShippingFast } from 'react-icons/fa'
import { GiShoppingBag } from 'react-icons/gi'
import { FaClipboardUser } from 'react-icons/fa6'
import { MdCategory } from 'react-icons/md'
import { RiDiscountPercentFill } from 'react-icons/ri'
import { HiBuildingStorefront } from "react-icons/hi2";
import "./_layout.scss"
import { Loading, NavBar } from '@/components'
import { useAuth } from '@/components/contexts/AuthProvider'
import { DashboardData } from '@/utils/adminDashboardTypes'

interface NavLinkType {
  title: string;
  icon: IconType;
  route: string;
  badgeContent: number | string;
}

interface NavLinkProps extends NavLinkType {
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ title, icon: Icon, route, badgeContent, onClick }) => (
  <Tooltip title={title} arrow>
    <Badge color="primary" badgeContent={badgeContent} onClick={onClick}>
      <IconContext.Provider value={{ className: "portal_navigation_icon" }}>
        <Icon />
      </IconContext.Provider>
    </Badge>
  </Tooltip>
);

interface NavigationMenuProps {
  className: string;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ className }) => {
  const navigate = useRouter();
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

  // State variables for holding error messages
  const [error, setError] = useState<string | null>(null);
  const [salesOverviewError, setSalesOverviewError] = useState(false);
  // State variable to handle data fetch status
  const [isLoading, setIsLoading] = useState(false);

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


  const navLinks: NavLinkType[] = [
    { title: "Dashboard", icon: AiFillDashboard, route: "/admin/dashboard", badgeContent: '!' },
    { title: "Store Management", icon: HiBuildingStorefront, route: "/admin/store", badgeContent: "*"},
    { title: "Staff Management", icon: FaClipboardUser, route: "/admin/staff", badgeContent: dashboardData?.staff?.inactiveStaff ?? 0 },
    { title: "Customers Management", icon: FaUser, route: "/admin/customers", badgeContent: (dashboardData?.customers?.newThisMonth) ?? 0},
    { title: "Categories Management", icon: MdCategory, route: "/admin/categories", badgeContent: 0 },
    { title: "Products Management", icon: GiShoppingBag, route: "/admin/products", badgeContent: dashboardData?.products?.inactiveProducts ?? 0 },
    { title: "Offers Management", icon: RiDiscountPercentFill, route: "/admin/offers", badgeContent: dashboardData?.offers?.expiredOffers ?? 0 },
    { title: "Order Management", icon: FaShippingFast, route: "/admin/orders", badgeContent: dashboardData?.orders?.pendingOrders ?? 0 },
  ];

  return (
    <section className={className}>
      {navLinks.map((link, index) => (
        <NavLink
          key={index}
          {...link}
          onClick={() => link.route && navigate.push(link.route)}
        />
      ))}
    </section>
  );
};

interface PortalProps {
  children: React.ReactNode;
}

function Portal({ children }: PortalProps) {
  // getting the user data from context provider
  const { user } = useAuth()
  useEffect(() => { }, [user])

  if (!user) {
    return <Loading />
  }

  if (user?.role?.name?.toLowerCase() !== "administrator") {
    return <div className='page_container flex_column_justify_center'>
      <h1 className='playfair_shadow_title_black'>404 Not Found</h1>
    </div>
  }
  return (
    <>
      <NavBar />
      <main className='portal_wrapper page_container flex_row_center'>
        <NavigationMenu className='portal_navigation_menu' />
        <section className='sub_pages_wrapper'>
          {children}
        </section>
        <NavigationMenu className='portal_navigation_menu_mobile' />
      </main>
    </>
  );
}

export default Portal;