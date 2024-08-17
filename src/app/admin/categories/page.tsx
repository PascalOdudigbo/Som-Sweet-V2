'use client'
import React, { useEffect, useState } from 'react'
import { CategoryRow, Search } from '@/components'
import Link from 'next/link'
import { CategoryType } from '@/utils/allModelTypes';
import "./_categories.scss"

function Categories() {
    // State variables for handling categories data
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // A function to handle fetching categories from API
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
                setFilteredCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }

        // calling the function
        fetchCategories();
    }, []);

    useEffect(() => {
        // Handling the category search functionality
        const filtered = categories.filter(category => 
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    // The search component onChange event handler
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    return (
        <main className='categories_wrapper'>
            <section className='add_category_link_wrapper flex_row_center'>
                <h2 className='section_title'>Categories</h2>
                <Link href={"/admin/categories/add"} className='add_category_link border_button_void'>ADD</Link>
            </section>
            <div className="search_wrapper">
                <Search onSearch={handleSearch}/>
            </div>

            <table className="categories_table">
                <thead>
                    <tr className="table_headers_wrapper">
                        <th className="p__inter table_header">IMAGE</th>
                        <th className="p__inter table_header">NAME</th>
                        <th className="p__inter table_header">PRODUCT COUNT</th>
                        <th className="p__inter table_header">CREATED AT</th>
                        <th className="p__inter table_header">UPDATED AT</th>
                        <th className="p__inter table_header">ACTION</th>
                    </tr>
                </thead>

                <tbody className='table_body'>
                    {filteredCategories.map((category, index) => (
                        <CategoryRow
                            key={category.id}
                            index={index}
                            category={category}
                            setCategories={setCategories}
                        />
                    ))}
                </tbody>
            </table>

            {filteredCategories.length < 1 && <h3 className="no_categories_text">NO CATEGORIES FOUND</h3>}

        </main>
    )
}

export default Categories