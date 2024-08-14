'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { CartItemType } from '@/utils/allModelTypes'
import './_cart_item.scss'

type CartItemProps = {
  item: CartItemType;
  onRemove: () => void;
  onUpdateQuantity: (newQuantity: number) => void;
}

function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  // onClick function to handle cart item quantity change
  const handleQuantityChange = async (change: number) => {
    const newQuantity = item.quantity + change
    if (newQuantity < 1) {
      // Remove if the quantity is less than one
      onRemove()
    } else {
      // updating the product quantity
      onUpdateQuantity(newQuantity)
    }
  }

   // Defining a function to dynamially process the product description
   const productDescription = useMemo(() => {
    const description = (item?.product?.description?.length !== undefined) && (item?.product?.description?.length < 80) ? item?.product?.description : item?.product?.description?.slice(0, 100) + "..."
    return description
}, [item?.product?.description]);

  const totalPrice = item.variation 
    ? item.variation.price * item.quantity 
    : item.product.basePrice * item.quantity

  return (
    <div className='cart_item_wrapper flex_column'>
      <Image 
        className='product_image' 
        src={item?.product?.images && item?.product?.images[0]?.imageUrl || ''}
        alt={item.product.name}
        width={400}
        height={225}
      />
      <div className='item_details flex_column'>
        <div className='name_and_price_wrapper flex_column'>
          <h3 className='item_name'>{item.product.name}</h3>
          <p className='item_custom_text'>{productDescription}</p>
          <p className='item_price'>£{totalPrice.toFixed(2)}</p>
         
        </div>
        {item.variation && (
          <p className='item_variation'>Variation: {item.variation.name}</p>
        )}
        {item.customText && (
          <p className='item_custom_text'>Custom: {item.customText}</p>
        )}
        <div className='quantity_and_remove_wrapper flex_row_center'>
          <div className='quantity_wrapper flex_row_center'>
            <button className='quantity_btn' onClick={() => handleQuantityChange(-1)}>-</button>
            <span className='quantity'>{item.quantity}</span>
            <button className='quantity_btn' onClick={() => handleQuantityChange(1)}>+</button>
          </div>
          <button className='remove_btn border_button' onClick={onRemove}>Remove</button>
        </div>
      </div>
    </div>
  )
}

export default CartItem