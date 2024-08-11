'use client'
import React, { useEffect, useState } from 'react'
import "./_latestTreats.scss"
import { Product } from '@/components';
import { useRouter } from 'next/navigation';
import { ProductType } from '@/utils/allModelTypes';
import { getLatestProducts } from '@/utils/productsManagement';
import { showToast } from '@/utils/toast';

function LatestTreats({ setIsLoading }: {setIsLoading: (value: boolean) => void}) {
    const router = useRouter();
    const [latestProducts, setLatestProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            setIsLoading(true);
            try {
                const products = await getLatestProducts(); // Fetch 6 latest products
                setLatestProducts(products);
            } catch (error) {
                console.error('Failed to fetch latest products:', error);
                showToast('error', 'Failed to load latest products. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestProducts();
    }, [setIsLoading]);

    return (
        <main className='latestTreats_main_container'>
            <h2 className='latestTreats_page_title'>OUR LATEST TREATS</h2>
            <p className='latestTreats_page_text'>Follow us on your preferred social media platform for the latest updates, behind-the-scenes content, and more sweet delights.</p>

            <section className='products_container'>
                {latestProducts.map(product => (
                    product.active && <Product
                        key={product.id}
                        product={product}
                    />
                ))}
            </section>

            <button className='view_all_button border_button' onClick={() => { router.push("/store/#products") }}>VIEW ALL TREATS</button>
        </main>
    )
}

export default LatestTreats;