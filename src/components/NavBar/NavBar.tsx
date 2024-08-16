'use client'
import React, { useEffect, useState } from 'react'
import { NavDropdown, Search } from '../'
import "./_navbar.scss"
import Image from 'next/image'
import { cartIcon } from "../../assets";
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthProvider'
import { useCart } from '../contexts/CartProvider'


// Defining the NavLinks
const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'STORE', href: '/store' },
  { name: 'ABOUT US', href: '/#aboutus' },
  { name: 'CONTACT US', href: '/#contactus' },
];
// Defining Temporary Socials Links
const socialLinks = [
  { name: 'INSTAGRAM', href: '/instagram' },
  { name: 'FACEBOOK', href: '/facebook' },
  { name: 'TIKTOK', href: '/tiktok' },
  { name: 'YOUTUBE', href: '/youtube' },
];

function NavBar() {
  // Getting the path name
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // getting the user data from the useAuth hook
  const {user} = useAuth()
  const {cart} = useCart()

  // Router variable function
  const router = useRouter();

  useEffect(() => {
    // A function handle the path name hash change 
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    setCurrentHash(window.location.hash);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isLinkActive = (href: string) => {
    // If the window is undefined return false
    if (typeof window === 'undefined') return false;
    // If link is a normal
    if (href === '/') {
      return pathname === href && !currentHash;
    }
    // If the link is a page ID link
    if (href.startsWith('/#')) {
      return currentHash === href.substring(1);
    }
    return pathname?.startsWith(href) || false;
  };

  // A function to handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className='nav_main_container'>
      <section className='nav_top_sub_container'>
        <h3 className='nav_site_title' onClick={() => { router.push("/") }}>{"Som' Sweet"}</h3>

        <section className='search_container'>
          <Search />
          <section className='search_content'>

          </section>
        </section>


        <section className='nav_dropdown_cart_container'>
          <NavDropdown user={user} />

          {user?.role?.name.toLowerCase() === "customer" &&<section className='nav_badge_cart_container' onClick={() => { router.push("/cart") }}>
            <p className='nav_badge'>{cart?.items?.length ?? 0}</p>
            <Image src={cartIcon} alt='cart icon' height={24} width={24} title='Cart' />
          </section>}

          <div className='nav_mobile_menu' onClick={toggleMobileMenu}>
            ☰
          </div>
        </section>
      </section>

      <section className={`nav_bottom_sub_container ${mobileMenuOpen ? 'active' : ''}`}>
        <section className='nav_page_links_container'>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'nav_page_link',
                {
                  'active_link': isLinkActive(link.href),
                }
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </section>

        <section className='nav_socials_container'>
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'nav_socials_link',
                {
                  'active_link': isLinkActive(link.href),
                }
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </section>
      </section>

      <section className={`nav_mobile_links ${mobileMenuOpen ? 'active' : ''}`}>
        <section className='search_container'>
          <Search/>
          <section className='search_content'>

          </section>
        </section>

        {navLinks.concat(socialLinks).map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'nav_page_link',
              {
                'active_link': isLinkActive(link.href),
              }
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </section>
    </nav>
  )
}

export default NavBar