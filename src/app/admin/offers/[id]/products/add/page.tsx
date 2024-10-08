"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DropdownCheckbox } from '@/components'
import { ProductType } from '@/utils/allModelTypes'
import { getAllProducts } from '@/utils/productsManagement'
import { addProductToDiscount, getDiscountById } from '@/utils/discountManagement'
import { showToast } from '@/utils/toast'
import './_add_offer_product.scss'

function AddOfferProduct({ params }: { params: { id: string } }) {
  // Initializing the state variables for dynamic data management
  const [products, setProducts] = useState<ProductType[]>([])
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Getting the products from the backend
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts()
        // Getting the discount from the database
        const discountId = parseInt(params.id)
        const discount = await getDiscountById(discountId)
        setProducts(fetchedProducts)
        // if the discount has products already then show them
        if(discount?.products) setSelectedProductIds(discount?.products?.map(product => product.productId))
        
      } catch (error) {
        console.error('Failed to fetch products:', error)
        showToast('error', 'Failed to load products. Please refresh the page.')
      }
    }
    // Calling the function
    fetchProducts()
  }, [params.id])

  // On click function to handle adding offer to the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    window.scrollTo(0, 0)
    // If no product was selected
    if (selectedProductIds.length === 0) {
      showToast('error', 'Please select at least one product.')
      setIsLoading(false)
      return
    }

    try {
      // Getting the discount ID from the path params
      const discountId = parseInt(params.id)
      for (const productId of selectedProductIds) {
        // Addingeach product to the database
        await addProductToDiscount(discountId, productId)
      }
      // Displaying success message and navigating to the offers management page
      showToast('success', `${selectedProductIds.length} product(s) added to discount successfully!`)
      router.push(`/admin/offers/edit/${params.id}`)
    } catch (error) {
      // In the eventuality of an error occuring
      console.error('Failed to add products to discount:', error)
      showToast('error', 'Failed to add products to discount. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='add_discount_product_wrapper'>
      <header className='add_discount_product_header flex_row_center'>
        <h2 className='section_title add_discount_product_header_title'>Add Products to Discount</h2>
        <Link href={`/admin/offers/edit/${params.id}`} className='back_link border_button_void'>BACK</Link>
      </header>

      <form className='add_discount_product_form' onSubmit={handleSubmit}>
        <div className='add_discount_product_content flex_column_center'>
          <section className='form_inputs_section'>
            <DropdownCheckbox
              label='Select Products'
              items={products.map(product => ({ id: product.id, name: product.name }))}
              buttonText="Select products"
              selectedItems={selectedProductIds}
              onChange={setSelectedProductIds}
              required={true}
            />
          </section>
        </div>

        <div className='submit_button_section flex_column_justify_center'>
          <button type="submit" className='custom_button add_discount_product_form_button' disabled={isLoading}>
            {isLoading ? 'Adding...' : 'ADD PRODUCTS'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddOfferProduct