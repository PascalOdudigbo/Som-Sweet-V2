'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { NavChildFooterLayout, Loading } from '@/components'
import { getUserOrders } from '@/utils/orderManagement'
import { useAuth } from '@/components/contexts/AuthProvider'
import { OrderType } from '@/utils/allModelTypes'
import './_orders.scss'
import { ordersBg } from '@/assets'
import Image from 'next/image'

function MyOrders() {
  // Initializing the state variables for dynamic data management
  const [orders, setOrders] = useState<OrderType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // Getting the user data from the auth provider
  const { user } = useAuth()

  useEffect(() => {
    // A function for fetching the orders data 
    const fetchOrders = async () => {
      if (user) {
        try {
          // Getting the data using the util function
          const fetchedOrders = await getUserOrders(user.id)
          setOrders(fetchedOrders)
        } catch (error) {
          // In the eventuality of an error occuring
          console.error('Failed to fetch orders:', error)
        }
      }
      setIsLoading(false)
    }
    // Calling the function
    fetchOrders()
  }, [user])

  if (isLoading) return <Loading />

  return (
    <NavChildFooterLayout>
      <main className='my_orders_container page_container'>
      <Image className='orders_image' src={ordersBg} alt={"Your wishlist"} title={"Your wishlist"} height={450} width={1200} quality={100} />

        <h1 className='page_title'>Your Orders</h1>
        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className='order_card'>
              <h2>Order #{order.id}</h2>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Status: {order.status}</p>
              <p>Total: £{order.total.toFixed(2)}</p>
              <Link href={`/order-confirmation/${order.id}`} className='view_details_button'>View Details</Link>
              {order.status !== 'Refunded' && (
                <Link href={`/request-refund/${order.id}`} className='request_refund_button'>Request Refund</Link>
              )}
            </div>
          ))
        )}
      </main>
    </NavChildFooterLayout>
  )
}

export default MyOrders