'use client'
import { PolicyType, ProductType } from '@/utils/allModelTypes'
import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/navigation' // Changed from 'next/router'
import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react'
import { useBusiness } from '../contexts/BusinessProvider'
import { getAllProducts, searchProducts } from '@/utils/productsManagement'
import { showToast } from '@/utils/toast'
import { searchPolicies } from '@/utils/policyManagement'
import { policiesBg } from '@/assets'
import "./_site_wide_search_component.scss"

interface PolicyItemProps {
    policy: PolicyType;
    imageSrc: StaticImageData;
}

const PolicyItem: React.FC<PolicyItemProps> = ({ policy, imageSrc }) => {
    const router = useRouter();

    const policyContent = useMemo(() => {
        if (!policy.content) return '';
        return policy.content.length > 60 ? `${policy.content.slice(0, 60)}...` : policy.content;
    }, [policy.content]);

    return (
        <section className='search_item_wrapper flex_row_center' onClick={() => router.push(`/store-policies/#${policy.title.split(" ")[0].toLowerCase()}`)}>
            <Image
                className='search_item_image'
                src={imageSrc}
                title={policy.title}
                alt={policy.title}
                width={400}
                height={225}
                onClick={() => router.push('/store-policies')}
            />

            <section className='search_item_text flex_column'>
                <h3 className='search_item_name'>{policy.title}</h3>
                <p className='search_item_description'>{policyContent}</p>
            </section>
        </section>
    );
};

interface ProductItemProps {
    product: ProductType;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    const router = useRouter();

    const productDescription = useMemo(() => {
        if (!product.description) return '';
        return product.description.length > 60
            ? `${product.description.slice(0, 60)}...`
            : product.description;
    }, [product.description]);

    return (
        <section className='search_item_wrapper flex_row_center' onClick={() => router.push(`/product/${product.id}`)}>
            {product.images && product.images[0] && (
                <Image
                    className='search_item_image'
                    src={product.images[0].imageUrl.toString()}
                    title={product.name}
                    alt={product.name}
                    width={400}
                    height={225}
                />
            )}

            <section className='search_item_text flex_column'>
                <h3 className='search_item_name'>{product.name}</h3>
                <p className='search_item_description'>{productDescription}</p>
                <p className='search_item_price'>£{product.basePrice.toFixed(2)}</p>
            </section>
        </section>
    );
};

interface SiteWideSearchComponentProps {
    searchTerm: string;
}

function SiteWideSearchComponent({ searchTerm }: SiteWideSearchComponentProps) {
    const router = useRouter();
    const { business } = useBusiness();
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [filteredPolicies, setFilteredPolicies] = useState<PolicyType[]>(
        business?.policies || []
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedProducts = await getAllProducts();
                setProducts(fetchedProducts);
                setFilteredProducts(fetchedProducts);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                showToast('error', 'Failed to load site wide search data. Please try again.');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = searchProducts(searchTerm, products);
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    useEffect(() => {
        const filtered = searchPolicies(searchTerm, business?.policies || []);
        setFilteredPolicies(filtered);
    }, [searchTerm, business?.policies]);

    return (
        <main className='SWSC_wrapper'>
            {filteredProducts?.length > 0 && <p className='search_section_title'>Treats</p>}
            {filteredProducts.map(product => (
                <ProductItem
                    key={product.id}
                    product={product}
                />
            ))}

            {filteredPolicies.length > 0 && <p className='search_section_title'>Policies</p>}
            {filteredPolicies.map(policy => (
                <PolicyItem
                    key={policy.id}
                    policy={policy}
                    imageSrc={policiesBg}
                />
            ))}

            {filteredProducts?.length < 1 && filteredPolicies.length < 1 && <p className='no_data_text'>NO DATA FOUND</p>}
        </main>
    );
}

export default SiteWideSearchComponent;