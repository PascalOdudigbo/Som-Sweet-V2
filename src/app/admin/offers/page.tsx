"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { DiscountType } from '@/utils/allModelTypes'
import { getAllDiscounts, deleteDiscount, searchDiscounts } from '@/utils/discountManagement'
import { showToast } from '@/utils/toast'
import "./_offers.scss"
import { Loading, OfferRow, Search } from '@/components'

function Offers() {
    // Setting up state variables to handle dynamic data
    const [discounts, setDiscounts] = useState<DiscountType[]>([])
    const [filteredDiscounts, setFilteredDiscounts] = useState<DiscountType[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Calling the function to fetch discounts
        fetchDiscounts()
    }, [])

    useEffect(() => {
        // Utilizing the hook to implement search functionality
        const filtered = discounts.filter(discount =>
            discount.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredDiscounts(filtered)
    }, [searchTerm, discounts])

    // A function to get discounts data
    const fetchDiscounts = async () => {
        setIsLoading(true)
        try {
            // Fetching the duscount data using the util function
            const fetchedDiscounts = await getAllDiscounts()
            setDiscounts(fetchedDiscounts)
            setFilteredDiscounts(fetchedDiscounts)
        } catch (error) {
            // In the eventuality of an error occuring
            console.error('Failed to fetch discounts:', error)
            showToast('error', 'Failed to fetch discounts')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // Using the hook to implement search functionality
        const filtered = searchDiscounts(searchTerm, discounts);
        setFilteredDiscounts(filtered);
    }, [searchTerm, discounts]);

    // OnChange handler for search functionality
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Display loading component when data is loading
    if (isLoading) {
        return <Loading/>;
    }

    return (
        <main className='discounts_wrapper'>
            <header className='discounts_header flex_row_center'>
                <h2 className='section_title discounts_header_title'>Offers</h2>
                <Link href={"/admin/offers/add"} className='add_discount_link border_button_void'>ADD</Link>
            </header>

            <div className="search_wrapper">
                <Search onSearch={handleSearch}/>
            </div>

            {filteredDiscounts.length > 0 ? (
                <table className="discounts_table">
                    <thead>
                        <tr className="table_headers_wrapper">
                            <th className="p__inter table_header">IMAGE</th>
                            <th className="p__inter table_header">NAME</th>
                            <th className="p__inter table_header">DISCOUNT PERCENT</th>
                            <th className="p__inter table_header">VALID FROM</th>
                            <th className="p__inter table_header">VALID UNTIL</th>
                            <th className="p__inter table_header">PRODUCTS</th>
                            <th className="p__inter table_header">ACTION</th>
                        </tr>
                    </thead>

                    <tbody className='table_body'>
                        {filteredDiscounts.map((discount) => (
                            <OfferRow
                                key={discount.id}
                                discount={discount}
                                setDiscounts={setDiscounts}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <h3 className="p__inter no_discounts_text">NO DISCOUNTS FOUND</h3>
            )}
        </main>
    )
}

export default Offers