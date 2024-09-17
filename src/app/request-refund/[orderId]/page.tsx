'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavChildFooterLayout, Loading, FormInput, TextArea } from '@/components'
import { getOrderById, updateOrderStatus } from '@/utils/orderManagement'
import { OrderType, RefundType, UserType } from '@/utils/allModelTypes'
import { showToast } from '@/utils/toast'
import './_request_refund.scss'
import { useAuth } from '@/components/contexts/AuthProvider'
import { requestRefund } from '@/utils/refundManagement'
import { EmailDetails, sendEmail } from '@/utils/emailJS'
import Link from 'next/link'

function RequestRefund({ params }: { params: { orderId: string } }) {
  // Initializing state variables for dynamic data management
  const [order, setOrder] = useState<OrderType | null>(null)
  const [refundAmount, setRefundAmount] = useState<string>('')
  const [refundReason, setRefundReason] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Getting the user data through the AuthProvider
  const { user } = useAuth()
  // Initializing the router navigation function
  const router = useRouter()

  useEffect(() => {
    // A function to handle fetching the target order
    const fetchOrder = async () => {
      // If the user is logged in
      if (user) {
        try {
          // Getting the order from the database using teh util function
          const fetchedOrder = await getOrderById(user.id, parseInt(params.orderId))
          setOrder(fetchedOrder)
          setRefundAmount(fetchedOrder.total.toString())
        } catch (error) {
          // If fetching the order fails
          console.error('Failed to fetch order:', error)
          showToast('error', 'Failed to fetch order details')
          router.push('/orders')
        }
      }
      setIsLoading(false)
    }

    fetchOrder()
  }, [user, params.orderId, router])

  // A function to handle sending refund confirmation and notification emails:
  const sendRefundEmails: (user: UserType, order: OrderType, refundRequest: RefundType) => void = async (user, order, refundRequest) => {

    // Setting up the customer confirmation email
    const customerRefundEmailDetails: EmailDetails = {
      emailTitle: `Som' Sweet: Refund Request Confirmation #${refundRequest.id}`,
      username: user.username,
      emailTo: user.email,
      notice: `This email was intended for ${user.username}. If you're not the intended recipient, please disregard or delete it.`,
      emailBody: `Dear ${user.username.split(" ")[0]},
    
    Thank you for contacting Som' Sweet regarding your refund request. We have received your request and it is being processed.
    
    Refund Request Details:
    Request Number: #${refundRequest.id}
    Original Order Number: #${order.id}
    Request Date: ${new Date(refundRequest.createdAt).toLocaleString()}
    Refund Amount Requested: £${refundRequest.amount.toFixed(2)}
    
    Reason for Refund: ${refundRequest.reason}
    
    Order Details:
    Order Date: ${new Date(order.createdAt).toLocaleString()}
    Total Order Amount: £${order.total.toFixed(2)}
    
    Items in Original Order:
    ${order?.orderItems?.map(item =>
        `- ${item?.product?.name} ${item.variation ? `(${item.variation.name})` : ''} x ${item.quantity} - £${(item.price * item.quantity).toFixed(2)}`
      ).join('\n')}
    
    Our team will review your refund request as soon as possible. Please allow 3 - 10 business days for this process. We will notify you once a decision has been made regarding your refund request.
    
    If you have any questions about your refund request, please don't hesitate to contact our customer service team.
    
    Thank you for your patience and for choosing Som' Sweet.
    
    Best regards,
    The Som' Sweet Team`,
    };

       // Setting up the store's notification email
       const storeRefundNotificationDetails: EmailDetails = {
        emailTitle: `New Refund Request Alert: Request #${refundRequest.id}`,
        username: "Som' Sweet Team",
        emailTo: "oinkoinkbakeryke@gmail.com",
        notice: "This is an automated refund request notification. Please process this request according to our standard procedures.",
        emailBody: `Dear Som' Sweet Team,
      
      A new refund request has been submitted and requires your attention.
      
      Refund Request Details:
      Request Number: #${refundRequest.id}
      Original Order Number: #${order.id}
      Request Date: ${new Date(refundRequest.createdAt).toLocaleString()}
      Refund Amount Requested: £${refundRequest.amount.toFixed(2)}
      
      Customer Information:
      Name: ${user.username}
      Email: ${user.email}
      
      Reason for Refund: ${refundRequest.reason}
      
      Original Order Details:
      Order Date: ${new Date(order.createdAt).toLocaleString()}
      Total Order Amount: £${order.total.toFixed(2)}
      
      Items in Original Order:
      ${order?.orderItems?.map(item =>
        `- ${item?.product?.name} ${item.variation ? `(${item.variation.name})` : ''} x ${item.quantity} - £${(item.price * item.quantity).toFixed(2)}`
      ).join('\n')}
      
      ${order?.orderItems?.some(item => item.customText) ? `
      Custom Text Instructions from Original Order:
      ${order.orderItems.filter(item => item.customText).map(item =>
        `- ${item?.product?.name}: "${item.customText}"`
      ).join('\n')}
      ` : ''}
      
      Shipping Address from Original Order:
      ${order?.shippingAddress?.addressLine1}
      ${order?.shippingAddress?.addressLine2 ? order?.shippingAddress?.addressLine2 + '\n' : ''}
      ${order?.shippingAddress?.city}, ${order?.shippingAddress?.state} ${order?.shippingAddress?.postalCode}
      ${order?.shippingAddress?.country}
      
      Please review this refund request promptly and take appropriate action according to our refund policy.
      
      If you have any questions or concerns about this refund request, please contact the customer service team.
      
      Best regards,
      Som' Sweet Automated Refund Request System`,
        buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/refund-requests/${refundRequest.id}`,
        buttonText: "View Refund Request Details"
      };
      

    // Sending the refund request confirmation email to the customer
    await sendEmail(customerRefundEmailDetails, "success", "Refund request confirmation email sent!");
    await sendEmail(storeRefundNotificationDetails, "info", "The store has been notified of your refund request!");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // If the order or user data can't be found throw an error
      if (!order) throw new Error('Order not found')
      if (!user) throw new Error('Unauthorized, user not logged in!')
      const refundAmountFloat = parseFloat(refundAmount)
      // If the refund amount is invalid then throw an error
      if (isNaN(refundAmountFloat) || refundAmountFloat <= 0 || refundAmountFloat > order.total) {
        throw new Error('Invalid refund amount')
      }
      // Calling the util function to request a refund
      const refundRequest = await requestRefund(order.id, refundAmountFloat, refundReason)
      // Calling the util function to update the order status
      await updateOrderStatus(user?.id, order.id, "Cancelled")
      showToast('success', 'Refund request submitted successfully')
      sendRefundEmails(user, order, refundRequest);

      router.push('/orders')
    } catch (error) {
      console.error('Failed to submit refund request:', error)
      showToast('error', 'Failed to submit refund request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <Loading />
  if (user && !order) return <div>Order not found</div>

  return (
    <NavChildFooterLayout>
      <main className='request_refund_container page_container'>
        <h1 className='page_title section_title'>Request Refund</h1>
        <div className='order_summary'>
          <h2 className='section_title'>Order Summary</h2>
          <p>Order #: {order?.id}</p>
          <p>Date: {new Date(order?.createdAt ?? "").toLocaleDateString()}</p>
          <p>Total: £{order?.total.toFixed(2)}</p>
        </div>
        <form onSubmit={handleSubmit} className='refund_form'>
          <FormInput
            label='Refund Amount (£)'
            inputType='number'
            inputValue={refundAmount}
            required={true}
            readonly={false}
            onChangeFunction={(e) => setRefundAmount(e.target.value)}
          />
          <TextArea
            label='Reason for Refund'
            inputValue={refundReason}
            required={true}
            rows={5}
            cols={50}
            onChangeFunction={(e) => setRefundReason(e.target.value)}
          />
          <button type='submit' className='submit_button custom_large_button' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Refund Request'}
          </button>
        </form>
        <div className='refund_policy'>
          <h3>Refund Policy</h3>
          <p>You can request a refund prior to receiving your order. Please read our full refund policy for more details.</p>
          <Link href="/store-policies/#refunds" className='refund_policy_link'>Read Full Refund Policy</Link>
        </div>
      </main>
    </NavChildFooterLayout>
  )
}

export default RequestRefund