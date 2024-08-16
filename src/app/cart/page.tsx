'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CartItem, Loading, NavChildFooterLayout } from '@/components'
import { getCart, calculateTotal, removeFromCart, updateCartItemQuantity } from '@/utils/cartManagement'
import { CartType, CartItemType } from '@/utils/allModelTypes'
import './_cart.scss'
import { useAuth } from '@/components/contexts/AuthProvider'
import { useCart } from '@/components/contexts/CartProvider'

function CartPage() {
    // Defining state variables to handle data and process status
    // Getting the user data from the auth provider 
    const { user } = useAuth()
    const {cart, setCart} = useCart()
    const router = useRouter()

    useEffect(() => {
        // fetching the cart if the user is logged in
        async function fetchCart() {
            if (user) {
                const fetchedCart = await getCart(user.id)
                setCart(fetchedCart)
            }
            // setIsLoading(false)
        }
        fetchCart()
    }, [user, setCart])
    // A function to handle the remove item button onClick event
    const handleRemoveItem = async (itemId: number) => {
        if (user && cart) {
            const updatedCart = await removeFromCart(user.id, itemId)
            setCart(updatedCart)
        }
    }
    // A function to handle updating the quantity of 
    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (user && cart) {
            const updatedCart = await updateCartItemQuantity(user.id, itemId, newQuantity)
            setCart(updatedCart)
        }
    }

    const handleCheckout = () => {
        router.push('/checkout')
    }

    if (!user && !cart) {
        return <Loading />
    }

    if (!cart || cart.items.length === 0) {
        return (
            <NavChildFooterLayout>
                <main className='cart_container page_container flex_column_center'>
                    <h1 className='cart_heading section_title'>Your Cart</h1>
                    <p className='empty_cart_text'>Your cart is empty</p>
                </main>
            </NavChildFooterLayout>

        )
    }

    return (
        <NavChildFooterLayout>
            <main className='cart_container page_container flex_column'>
                <h1 className='cart_heading'>Your Cart</h1>
                <section className='cart_items_container'>
                    {cart.items.map((item: CartItemType) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onRemove={() => handleRemoveItem(item.id)}
                            onUpdateQuantity={(newQuantity) => handleUpdateQuantity(item.id, newQuantity)}
                        />
                    ))}
                </section>
                <section className='cart_summary'>
                    <h3 className='cart_subtotal'>Subtotal: £{calculateTotal(cart).toFixed(2)}</h3>
                    <button className='checkout_button border_button' onClick={handleCheckout}>
                        Checkout
                    </button>
                </section>
            </main>

        </NavChildFooterLayout>
    )
}

export default CartPage