'use client'
import React, { useEffect } from 'react'
import { Badge, Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'
import { IconContext, IconType } from 'react-icons'
import { AiFillDashboard } from 'react-icons/ai'
import { FaUser, FaShippingFast } from 'react-icons/fa'
import { GiShoppingBag } from 'react-icons/gi'
import { FaClipboardUser } from 'react-icons/fa6'
import { MdCategory } from 'react-icons/md'
import { TbRosetteDiscountCheckFilled } from 'react-icons/tb'
import "./_layout.scss"
import { Loading, NavBar } from '@/components'
import { useAuth } from '@/components/contexts/AuthProvider'

interface NavLinkType {
  title: string;
  icon: IconType;
  route: string;
  badgeContent: number | string;
}

const navLinks: NavLinkType[] = [
  { title: "Dashboard", icon: AiFillDashboard, route: "/admin/dashboard", badgeContent: '!' },
  { title: "Staff Management", icon: FaClipboardUser, route: "/admin/staff", badgeContent: 0 },
  { title: "Customers Management", icon: FaUser, route: "/admin/customers", badgeContent: 3 },
  { title: "Categories Management", icon: MdCategory, route: "/admin/categories", badgeContent: 0 },
  { title: "Products Management", icon: GiShoppingBag, route: "/admin/products", badgeContent: 0 },
  { title: "Offers Management", icon: TbRosetteDiscountCheckFilled, route: "/admin/offers", badgeContent: 0 },
  { title: "Order Management", icon: FaShippingFast, route: "/admin/orders", badgeContent: 0 },
];

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

  if(!user){
    return <Loading/>
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