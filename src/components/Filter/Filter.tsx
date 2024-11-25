// components/Filter/Filter.tsx
'use client'
import React from 'react'
import { CategoryType } from '@/utils/allModelTypes'
import { Checkbox } from '@/components'
import './_filter.scss'

type FilterProps = {
    categories: CategoryType[];
    selectedCategories: number[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;
    priceRange: { min: number; max: number };
    setPriceRange: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
    
}

function Filter({
    categories,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
}: FilterProps) {

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategories(prev => {
            // If category is already selected, remove it
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                // If category isn't selected, add it
                return [...prev, categoryId];
            }
        });
    };

    const handlePriceChange = (type: 'min' | 'max', value: string) => {
        // Convert empty string to 0, otherwise parse the string to float
        const numValue = value === '' ? 0 : parseFloat(value);
        // Update either min or max while preserving the other value
        setPriceRange(prev => ({
            ...prev,
            [type]: numValue
        }));
    };

    return (
        <aside className='filter_container'>
            <h2 className='filter_title'>Filters</h2>

            {/* Categories Filter */}
            <section className='filter_section'>
                <h3 className='filter_section_title'>Categories</h3>
                <div className='categories_list'>
                    {categories.map(category => (
                        <Checkbox
                            key={category.id}
                            label={category.name}
                            isChecked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                        />
                    ))}
                </div>
            </section>

            {/* Price Range Filter */}
            <section className='filter_section'>
                <h3 className='filter_section_title'>Price Range</h3>
                <div className='price_range_inputs'>
                    <div className='price_input_group'>
                        <label htmlFor="minPrice">Min (£)</label>
                        <input
                            type="text"
                            id="minPrice"
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                            min={0}
                        />
                    </div>
                    <div className='price_input_group'>
                        <label htmlFor="maxPrice">Max (£)</label>
                        <input
                            type="text"
                            id="maxPrice"
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                            min={0}
                        />
                    </div>
                </div>
            </section>

            {/* Clear Filters Button */}
            <button
                className='clear_filters_button border_button_void'
                onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange({ min: 0, max: 0 });
                }}
            >
                Clear Filters
            </button>
        </aside>
    )
}

export default Filter