'use client'
import React, { useState } from 'react'
import { OrderType } from '@/utils/allModelTypes'
import { OrderStatusDropdown } from '@/components'
import './_order_row.scss'
import { EmailDetails, sendEmail } from '@/utils/emailJS'

// Defining the order row props
interface OrderRowProps {
  order: OrderType
  onStatusChange: (orderId: number, newStatus: string) => void
}

function OrderRow({ order, onStatusChange }: OrderRowProps) {
  // State variable to manage order details view
  const [isExpanded, setIsExpanded] = useState(false)

  const handleStatusChange = async (newStatus: string | number) => {
    await onStatusChange(order.id, newStatus.toString())

    if (order.user) {
      const emailDetails: EmailDetails = {
        emailTitle: `Som' Sweet: Order Update!`,
        username: order.user.username,
        emailTo: order.user.email,
        notice: `This email was intended for ${order.user.username}, if you're not the intended recipient please disregard or delete it`,
        emailBody: `We're thrilled to have you patronize us ${order.user.username.split("")[0]}! 
        
        Your order #${order.id} has been updated to a new status: ${newStatus}.`,
      }

      await sendEmail(emailDetails, "info", "Update email sent!")
    }
  }

  return (
    <>
      <tr className="order_row">
        <td>{order.id}</td>
        <td>{order.user?.username}</td>
        <td>£{order.total.toFixed(2)}</td>
        <td>
          <OrderStatusDropdown
            currentStatus={order.status}
            onStatusChange={(newStatus: string | number) => handleStatusChange(newStatus)}
          />
        </td>
        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
        <td>
          <button onClick={() => setIsExpanded(!isExpanded)} className="view_details_button">
            {isExpanded ? 'Hide Details' : 'View Details'}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr className="order_details_row">
          <td colSpan={6}>
            <h4>Order Items:</h4>
            <ul>
              {order.orderItems?.map((item) => (
                <li key={item.id}>
                  {item.product?.name} - Quantity: {item.quantity} - Price: £{item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p>Shipping Address: {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
          </td>
        </tr>
      )}
    </>
  )
}

export default OrderRow