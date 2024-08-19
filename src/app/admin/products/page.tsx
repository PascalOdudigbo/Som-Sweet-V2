'use client'
import React, { useEffect, useState } from 'react'
import { Loading, ProductRow, Search } from '@/components'
import Link from 'next/link'
import { ProductType } from '@/utils/allModelTypes';
import "./_products.scss"
import { getAllProducts, searchProducts } from '@/utils/productsManagement'
import { showToast } from '@/utils/toast'

function Products() {
    // Initializing state variables for dynamic data management
    const [products, setProducts] = useState<ProductType[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetching all the products data from the database
        async function fetchProducts() {
            try {
                // Display the loading component
                setIsLoading(true);
                // initializing fetchedProducts with backend data 
                const fetchedProducts = await getAllProducts();
                // Storing the data in state variables
                setProducts(fetchedProducts);
                setFilteredProducts(fetchedProducts);
            } catch (error) {
                // In the eventuality of an error occuring
                console.error('Failed to fetch products:', error);
                showToast('error', 'Failed to load products. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
        // Getting the products data 
        fetchProducts();
    }, []);

    useEffect(() => {
        // Using the react hook to implement the search functionality
        const filtered = searchProducts(searchTerm, products);
        setFilteredProducts(filtered);
    }, [searchTerm, products]);
    // onChange handler for search conponent
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };
    // Displaying the loading component if the data hasn't been fetched yet
    if (isLoading) {
        return <Loading/>;
    }

    return (
        <main className='products_wrapper'>
            <section className='add_product_link_wrapper flex_row_center'>
                <h2 className='section_title'>Products</h2>
                <Link href={"/admin/products/add"} className='add_product_link border_button_void'>ADD</Link>
            </section>
            <div className="search_wrapper">
                <Search onSearch={handleSearch}/>
            </div>

            <table className="products_table">
                <thead>
                    <tr className="table_headers_wrapper">
                        <th className="p__inter table_header">IMAGE</th>
                        <th className="p__inter table_header">NAME</th>
                        <th className="p__inter table_header">DESCRIPTION</th>
                        <th className="p__inter table_header">BASE PRICE</th>
                        <th className="p__inter table_header">CATEGORY</th>
                        <th className="p__inter table_header">ACTIVE</th>
                        <th className="p__inter table_header">ACTION</th>
                    </tr>
                </thead>

                <tbody className='table_body'>
                    {filteredProducts.map((product) => (
                        <ProductRow
                            key={product.id}
                            product={product}
                            setProducts={setProducts}
                        />
                    ))}
                </tbody>
            </table>

            {filteredProducts.length < 1 && <h3 className="p__inter no_products_text">NO PRODUCTS FOUND</h3>}
        </main>
    )
}

export default Products