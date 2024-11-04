'use client'
import React, { useEffect, useState } from 'react'
import { Badge, Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'
import { IconContext, IconType } from 'react-icons'
import { AiFillDashboard } from 'react-icons/ai'
import { FaClipboardUser } from 'react-icons/fa6'
import { RiRefund2Fill } from "react-icons/ri";
import { MdReviews } from 'react-icons/md'
import "./_layout.scss"
import { NavBar } from '@/components'
import { ServiceDashboardData } from '@/utils/serviceProviderDashboardTypes'

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


  const navLinks: NavLinkType[] = [
    { title: "Dashboard", icon: AiFillDashboard, route: "/service-professional/dashboard", badgeContent: '!' },
    { title: "Refunds Management", icon: RiRefund2Fill, route: "/service-professional/refunds", badgeContent: 0 },
    { title: "Order Management", icon: MdReviews, route: "/service-professional/orders", badgeContent: 0 },
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