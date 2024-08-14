import Image from 'next/image'
import React, { FC } from 'react'
import { profileIcon, upIcon } from "../../../assets";
import "./_navDropdown.scss";
import Link from 'next/link';
import { UserType } from '@/utils/allModelTypes';
import { useCart } from '@/components/contexts/CartProvider';
import { useAuth } from '@/components/contexts/AuthProvider';

// Defining the DropdownItem prop
type DropdownItemProps = {
  text: string;
  path?: string;
  onClick?: () => void;
}

// Defining the NavDropdown prop type
type DropdownProps = {
  user: UserType | null;
}

const NavDropdown: FC<DropdownProps> = ({user}) => {
  // Defining the users nav links
  const navLinksUser = [
    { name: 'My Wishlist', href: `/wishlist/${user?.id}` },
    { name: 'My Orders', href: `/orders/${user?.id}` },
    { name: 'My Addresses', href: `/addresses/${user?.id}` },
    { name: 'My Account', href: `/account/${user?.id}` }
  ];

  // Defining the admin nav links
  const navLinksAdmin = [
    { name: 'Dashboard', href: '/admin/dashboard' },
  ];

  // Defining the default nav links
  const navLinks = [
    { name: 'Sign In', href: '/signin' },
    { name: 'Sign Up', href: `/signup` },
  ];

  // Getting the logout function from the useAuth hook
  const {logout} = useAuth();
  // Getting setCart from the cartProvider
  const {setCart} = useCart()

  // Defining the Dropdown item component  
  const DropdownItem: FC<DropdownItemProps> = ({ text, path }) => (
    <Link className='nav_dropdown_item flex_row_center' href={path ?? ""}>
      {text}
    </Link>
  );

  // Defining the Dropdown logout item component  
  const DropdownLogoutItem: FC<DropdownItemProps> = ({ text, onClick }) => (
    <p className='nav_dropdown_logout_item flex_row_center' onClick={onClick}>
      {text}
    </p>
  );

  return (
    <div className='nav_dropdown_main_container flex_column_center'>
      <section className='images_container flex_row_center'>
        <Image src={profileIcon} alt='profile icon' height={24} width={24} />
        <Image className="navArrowImage" src={upIcon} alt='arrow icon' height={24} width={24} />
      </section>
      <section className='nav_content_container flex_column_center'>
        {user?.role?.name.toLowerCase() === "customer" && navLinksUser.map((link, index) => (
          <DropdownItem key={index} text={link.name} path={link.href} />
        ))}
        {user?.role?.name.toLowerCase() === "administrator" && navLinksAdmin.map((link, index) => (
          <DropdownItem key={index} text={link.name} path={link.href} />
        ))}
        <section className='nav_content_login_container flex_column_center'>
          {!user?.id && navLinks.map((link, index) => 
            link.name.toLowerCase() !== "logout" 
              ? <DropdownItem key={index} text={link.name} path={link.href} />
              : <DropdownLogoutItem key={index} text={link.name} path={link.href} onClick={()=>{
                setCart(null)
                logout()
              }}/>
          )}
          {user?.id && <DropdownLogoutItem text={"Logout"} onClick={()=>{logout()}}/>}
        </section>
      </section>
    </div>
  )
}

export default NavDropdown