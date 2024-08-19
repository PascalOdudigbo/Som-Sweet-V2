'use client'
import React, { useEffect, useState } from 'react'
import { VariationRow, Search, Loading } from '@/components'
import Link from 'next/link'
import { ProductVariationType } from '@/utils/allModelTypes';
import "./_variations.scss"
import { showToast } from '@/utils/toast'
import { getProductVariations } from '@/utils/productVariationManagement';
import { useParams } from 'next/navigation';

function Variations() {
    // State variables to handle dynamic data  
    const [variations, setVariations] = useState<ProductVariationType[]>([]);
    const [filteredVariations, setFilteredVariations] = useState<ProductVariationType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const routeParams = useParams()
    // Getting the product ID from the route params 
    const productId = routeParams.id
    
    useEffect(() => {
        // A function to handle getting the variation data from the database
        async function fetchVariations() {
            try {
                setIsLoading(true);
                const fetchedVariations = await getProductVariations(parseInt(productId.toString()));
                setVariations(fetchedVariations);
                setFilteredVariations(fetchedVariations);
            } catch (error) {
                // In the eventuality of an error occuring
                console.error('Failed to fetch variations:', error);
                showToast('error', 'Failed to load variations. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
        // Calling the function
        fetchVariations();
    }, [productId]);

    // Using the hook to implement the search functionality
    useEffect(() => {
        const filtered = variations.filter(variation => 
            variation.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredVariations(filtered);
    }, [searchTerm, variations]);

    // On chanhe function to implement the search component functionality
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    if (isLoading) {
        // Display the loading component when the data is still being fetched
        return <Loading/>;
    }

    return (
        <main className='variations_wrapper'>
            <section className='add_variation_link_wrapper flex_row_center'>
                <h2 className='section_title'>Variations</h2>
                <Link href={`/admin/products/${productId}/variations/add`} className='add_variation_link border_button_void'>ADD</Link>
            </section>
            <div className="search_wrapper">
                <Search onSearch={handleSearch}/>
            </div>

            <table className="variations_table">
                <thead>
                    <tr className="table_headers_wrapper">
                        <th className="p__inter table_header">NAME</th>
                        <th className="p__inter table_header">PRICE</th>
                        <th className="p__inter table_header">CREATED AT</th>
                        <th className="p__inter table_header">UPDATED AT</th>
                        <th className="p__inter table_header">ACTION</th>
                    </tr>
                </thead>

                <tbody className='table_body'>
                    {filteredVariations.map((variation) => (
                        <VariationRow
                            key={variation.id}
                            variation={variation}
                            setVariations={setVariations}
                            productId={parseInt(productId.toString())}
                        />
                    ))}
                </tbody>
            </table>

            {filteredVariations.length < 1 && <h3 className="p__inter no_variations_text">NO VARIATIONS FOUND</h3>}
        </main>
    )
}

export default Variations