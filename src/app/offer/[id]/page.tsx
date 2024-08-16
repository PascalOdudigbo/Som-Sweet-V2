'use client'
import React, { useEffect, useState } from 'react'
import "./_offer.scss"
import { Loading, NavChildFooterLayout, Product } from '@/components';
import { useParams, useRouter } from 'next/navigation';
import { DiscountProductType, DiscountType } from '@/utils/allModelTypes';
import { showToast } from '@/utils/toast';
import { getDiscountById } from '@/utils/discountManagement';
import Image from 'next/image';

function Offer() {
    // Declaring the router for navigation
    const router = useRouter();
    // Getting the discount ID from the route params
    const { id } = useParams();
    //
    const [discount, setDiscount] = useState<DiscountType | undefined>(undefined);
    const [discountProducts, setDiscountProducts] = useState<DiscountProductType[] | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        const fetchLatestProducts = async () => {
            setIsLoading(true);
            try {
                // Fetching the discount data
                const discountData = await getDiscountById(parseInt(id.toString()));
                // Addigning the data to the relevant state variables
                setDiscount(discountData);
                setDiscountProducts(discountData?.products)
            } catch (error) {
                console.error('Failed to fetch discount:', error);
                showToast('error', 'Failed to load discount. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestProducts();
    }, [id, setIsLoading]);

    if (isLoading) {
        return <Loading />
    }

    if (!discount) {
        return <Loading />
    }

    return (
        <NavChildFooterLayout>
            <main className='offer_main_container page_container'>
                <Image className='offer_image' src={discount.imageUrl?.toString() ?? ""} alt={discount.name} title={discount.description ?? ""} height={450} width={1200} quality={100}/>

                <h2 className='offer_page_title'>{discount?.name?.toUpperCase()}</h2>
                <p className='offer_page_text discount_duration'>{discount && new Date(discount?.validFrom).toLocaleDateString()} - {discount && new Date(discount?.validUntil).toLocaleDateString()}</p>
                <p className='offer_page_text'>{discount?.description}</p>

                <div className='flex_row_center'>
                        <h1 className='section_title'>TREATS ON OFFER</h1>
                </div>

                <section className='products_container'>
                    {discountProducts?.map(discountProduct => (
                        discountProduct?.product?.active && <Product
                            key={discountProduct?.product?.id}
                            product={discountProduct?.product}
                        />
                    ))}
                </section>

            </main>

        </NavChildFooterLayout>

    )
}

export default Offer;