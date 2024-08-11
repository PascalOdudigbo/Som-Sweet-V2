'use client'
import { Loading, NavChildFooterLayout, Product, Search } from '@/components'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import "./_store.scss"
import { CategoryType, DiscountType, ProductType } from '../../utils/allModelTypes'
import Category from '@/components/Category/Category'
import { filterIcon } from '@/assets'
import { getAllProducts, searchProducts } from '@/utils/productsManagement'
import { getAllCategories } from '@/utils/categoryManagement'
import { showToast } from '@/utils/toast'
import { getAllDiscounts } from '@/utils/discountManagement'

function Store() {
  // Setting up the state variables for data and process status management
  const [discounts, setDiscounts] = useState<DiscountType[]>([])
  const [targetDiscount, setTargetDiscount] = useState<DiscountType | null>(null)
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [products, setProducts] = useState<ProductType[]>([])
  const [viewAllCategories, setViewAllCategories] = useState<boolean>(false)
  const [targetCategory, setTargetCategory] = useState<CategoryType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // A function to handle fetching all required data for the page
    const fetchData = async () => {
      try {
        const [fetchedProducts, fetchedCategories, fetchedDiscounts] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getAllDiscounts()
        ]);
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setCategories(fetchedCategories);
        setDiscounts(fetchedDiscounts);
        // If offers exist then display the first one
        if (fetchedDiscounts.length > 0) {
          setTargetDiscount(fetchedDiscounts[0]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        showToast('error', 'Failed to load store data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (discounts.length === 0) return;

    const intervalId = setInterval(() => {
      setTargetDiscount(targetDiscount => {
        const currentIndex = discounts.indexOf(targetDiscount!);
        const nextIndex = (currentIndex + 1) % discounts.length;
        return discounts[nextIndex];
      });
    }, 6000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [discounts]);

  useEffect(() => {
    // Handling product search through util function
    const filtered = searchProducts(searchTerm, products);
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    // Handling product filter through category
    if (targetCategory) {
      const filteredProducts = products.filter(product => product?.category?.id === targetCategory?.id)
      setFilteredProducts(filteredProducts)
    }
  }, [products, targetCategory, categories])

  // An event function
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // An event function
  const handleCategoryFilter = (category: CategoryType) => {
    setTargetCategory(category)
  }

  // Display loading component if page is still loading
  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavChildFooterLayout>
      <main className='shop_main_container page_container flex_column_center'>
        {discounts.length > 0 && <section className='shop_offers_container flex_column'>
          <h1 className='section_title'>OFFERS</h1>
          {targetDiscount && (
            <div className='image_title_button_container flex_column_center'>
              <h1 className='offer_name playfair_shadow_title'>{targetDiscount.name}</h1>
              <Image className='offer_image' src={targetDiscount.imageUrl ?? ""} alt={targetDiscount.name} title={targetDiscount.description ?? ""} height={400} width={1024} />
              <button className='shop_offers_button border_button'>SHOP NOW</button>
            </div>
          )}
        </section>}

        <section className='shop_categories_container flex_column_center'>
          <div className='section_title_button_container flex_row_center'>
            <h1 className='section_title'>CATEGORIES</h1>
            {categories.length > 4 && <button className='shop_categories_button border_button_void'
              onClick={() => setViewAllCategories(prev => !prev)}>
              {!viewAllCategories ? "VIEW ALL" : "MINIMIZE"}
            </button>}
          </div>

          <div className='categories_container'>
            {categories.map((category, index) => (
              (!viewAllCategories && index < 4 || viewAllCategories) && (
                <Category key={category.id} category={category} onClick={() => { handleCategoryFilter(category) }} />
              )
            ))}
          </div>
        </section>

        <section id='products' className='shop_products_container flex_column_center'>
          <div className='section_title_dropdown_container flex_row_center'>
            <h1 className='section_title'>EXPLORE OUR TASTY TREATS</h1>
            <Image className='filter_icon' src={filterIcon} alt='filter icon' title='Filter' />
          </div>

          <div className="search_wrapper">
            <Search onSearch={handleSearch} />
          </div>

          <div className='products_container'>
            {filteredProducts.map(product => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </NavChildFooterLayout>
  )
}

export default Store