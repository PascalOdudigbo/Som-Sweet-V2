'use client'
import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { breadBg, brownieBg, cakeBg, donutsBg } from '../assets'
import Link from 'next/link';

import { NavChildFooterLayout } from '@/components';

export default function Home() {

  function Welcome() {
    // Setting up state variables for display images
    const images = useMemo(()=>[cakeBg, brownieBg, donutsBg, breadBg], []);
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      // Setting up the interval function for changing displayed images
      const intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 5000);
  
      return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [images]);
  
  
    return (
      <main className='welcome_main_container page_container flex_column_justify_center'>
        <section className='welcome_text_and_image_container flex_row_center'>
          <section className='welcome_text_button_container flex_column'>
            <h1 className='welcome_text kavoon_shadow_title'>{"Som' Sweet"}</h1>
            <h2 className='welcome_subtext'>INDULGE IN THE SWEETEST MOMENTS</h2>
            <Link className='welcome_shop_button border_button' href="/store">PLACE ORDER</Link>
          </section>
  
          <Image className='welcome_image' src={images[currentIndex]} alt='welcome' />
        </section>
  
      </main>
    )
  }

  return (
      <NavChildFooterLayout>
        <Welcome />
      </NavChildFooterLayout>
  );
}