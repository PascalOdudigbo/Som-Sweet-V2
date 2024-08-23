'use client'
import React, { useEffect, useState } from 'react'
import "./_wishlist.scss"
import { Loading, NavChildFooterLayout, Product, Recommendations } from '@/components';
import { useParams, useRouter } from 'next/navigation';
import { UserWishlistType } from '@/utils/allModelTypes';
import { showToast } from '@/utils/toast';
import Image from 'next/image';
import { getWishlist } from '@/utils/wishlistManagement';
import { useAuth } from '@/components/contexts/AuthProvider';
import { wishlistBg } from '@/assets';
import { isInWishlist } from '@/utils/productsManagement';
import Link from 'next/link';



function Wishlist() {
    // Declaring the router for navigation
    const router = useRouter();
    // Getting the user data
    const { user } = useAuth()
    // Get the route params
    const params = useParams()
    const [wishlist, setWishlist] = useState<UserWishlistType[] | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchWishlist = async () => {
            setIsLoading(true);
            try {
                if (params.id && (parseInt(params.id.toString()) === user?.id)) {
                    // Fetching the discount data
                    const wishlistData = await getWishlist(parseInt(params.id.toString()));
                    // Addigning the data to the relevant state variables
                    setWishlist(wishlistData);
                }
            } catch (error) {
                console.error('Failed to fetch wishlist:', error);
                showToast('error', 'Failed to load wishlist. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        // Getting the wishlist data
        fetchWishlist()

    }, [params.id, user, setIsLoading]);

    if (!wishlist && !user) {
        return <Loading />
    }

    if (wishlist?.length === 0) {
        return (
            <NavChildFooterLayout>
                <main className='wishlist_main_container page_container'>
                    <Image className='wishlist_image' src={wishlistBg} alt={"Your wishlist"} title={"Your wishlist"} height={450} width={1200} quality={100} />

                    <div className='flex_row_center'>
                        <h1 className='section_title'>YOUR WISHLIST</h1>
                    </div>

                    <p className='empty_wishlist_text'>Your wishlist is empty, <Link className={"empty_wishlist_link"} href={"/store"}>start wishlisting treats</Link></p>

                </main>

            </NavChildFooterLayout>

        )
    }

    return (
        <NavChildFooterLayout>
            <main className='wishlist_main_container page_container'>
                <Image className='wishlist_image' src={wishlistBg} alt={"Your wishlist"} title={"Your wishlist"} height={450} width={1200} quality={100} />

                <div className='flex_row_center'>
                    <h1 className='section_title'>YOUR WISHLIST</h1>
                </div>

                <section className='products_container'>
                    {wishlist?.map(row => (
                        row?.product?.active && <Product
                            key={row?.product?.id}
                            product={row?.product}
                        />
                    ))}
                </section>

                {
                    (wishlist && wishlist?.length > 0) && wishlist[0]?.product &&
                    <Recommendations product={wishlist[(Math.floor(Math.random() * wishlist.length))]?.product ?? wishlist[0]?.product} />
                }

            </main>

        </NavChildFooterLayout>

    )
}

export default Wishlist;