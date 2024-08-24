'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavChildFooterLayout, FormInput, Loading, Dropdown, MinimizableLayout } from '@/components'
import { useAuth } from '@/components/contexts/AuthProvider'
import { useCart } from '@/components/contexts/CartProvider'
import { getUserAddresses, createAddress } from '@/utils/addressManagement'
import { createPaymentIntent } from '@/utils/paymentManagement'
import { showToast } from '@/utils/toast'
import { AddressType } from '@/utils/allModelTypes'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import './_checkout.scss'
import { createOrder } from '@/utils/orderManagement'
import Image from 'next/image'
import { checkoutBg } from '@/assets'
import { EmailDetails, sendEmail } from '@/utils/emailJS'

// Defining the Simple payment intent type 
type SimplePaymentIntent = {
  id: string;
  status: string;
};

// Load Stripe with the public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Define props for the CheckoutForm component
interface CheckoutFormProps {
  handlePaymentSuccess: (paymentIntent: SimplePaymentIntent) => void;
}

// CheckoutForm component for handling payment submission
function CheckoutForm({ handlePaymentSuccess }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  // Handle form submission for payment
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    // Confirm the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: 'if_required',
    })

    if (error) {
      setErrorMessage(error.message)
      showToast('error', error.message || 'An error occurred')
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      handlePaymentSuccess(paymentIntent)
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="stripe_form">
      <PaymentElement />
      {errorMessage && <div className="error_message">{errorMessage}</div>}
      <button type="submit" disabled={!stripe || isProcessing} className="custom_large_button proceed_to_payment">
        {isProcessing ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  )
}

// Main Checkout component
function Checkout() {
  // Getting the user aand cart data from their context files
  const { user } = useAuth()
  const { cart, clearCart } = useCart()
  // Setting up the router hook variable function
  const router = useRouter()
  // Setting up state variables for dynamic data management
  const [addresses, setAddresses] = useState<AddressType[]>([])
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null)
  const [newAddress, setNewAddress] = useState<Partial<AddressType>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentElementOptions, setPaymentElementOptions] = useState({});

  // Fetch user addresses on component mount
  useEffect(() => {
    setIsLoading(true)
    const fetchAddresses = async () => {
      if (user) {
        try {
          const userAddresses = await getUserAddresses(user.id)
          setAddresses(userAddresses)
          if (userAddresses.length > 0) {
            setSelectedAddress(userAddresses[0])
          }
        } catch (error) {
          showToast('error', 'Failed to fetch addresses')
        }
      }
    }
    fetchAddresses()
  }, [user])

  // Create payment intent when cart changes
  useEffect(() => {
    setIsLoading(true)
    const createIntent = async () => {
      if (cart) {
        try {
          const { clientSecret } = await createPaymentIntent(cart)
          setClientSecret(clientSecret)
        } catch (error) {
          showToast('error', 'Failed to initialize payment')
        }
      }
    }
    createIntent()
  }, [cart])

  // Set payment element options when client secret is available
  useEffect(() => {
    setIsLoading(true)

    if (clientSecret) {
      setPaymentElementOptions({
        clientSecret,
        appearance: { theme: 'stripe' },
        paymentMethodOrder: ['apple_pay', 'google_pay', 'card']
      });
      setIsLoading(false)
    }
  }, [clientSecret]);

  // Handle address selection
  const handleAddressChange = (addressData: string | number) => {
    const address = addresses.find(a => a.id === parseInt(addressData?.toString().split(",")[0]))
    setSelectedAddress(address ?? null)
  }

  // Handle adding a new address
  const handleAddNewAddress = async () => {
    if (user) {
      try {
        const createdAddress = await createAddress({ ...newAddress, userId: user.id } as AddressType)
        setAddresses([...addresses, createdAddress])
        setSelectedAddress(createdAddress)
        setNewAddress({})
      } catch (error) {
        showToast('error', 'Failed to add new address')
      }
    }
  }

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntent: SimplePaymentIntent) => {
    try {
      if (!user || !selectedAddress) {
        throw new Error('Missing required information');
      }

      const orderData = {
        paymentIntentId: paymentIntent.id,
        shippingAddressId: selectedAddress.id
      };

      const createdOrder = await createOrder(orderData);

      clearCart()
      // Setting up confirmation email
      const emailDetails: EmailDetails = {
        emailTitle: `Som' Sweet: Order Confirmation #${createdOrder.id}`,
        username: user.username,
        emailTo: user.email,
        notice: `This email was intended for ${user.username}. If you're not the intended recipient, please disregard or delete it.`,
        emailBody: `Dear ${user.username.split(" ")[0]},
      
      Thank you for your order with Som' Sweet, the best bakery in the UK! We're excited to confirm that your order has been received and is being processed.
      
      Order Details:
      Order Number: #${createdOrder.id}
      Order Date: ${new Date(createdOrder.createdAt).toLocaleString()}
      Total Amount: £${createdOrder.total.toFixed(2)}
      
      Items Ordered:
      ${cart?.items.map(item =>
          `- ${item.product.name} ${item.variation ? `(${item.variation.name})` : ''} x ${item.quantity} - £${(item.variation ? (item.variation.price * item.quantity).toFixed(2) : (item.product.basePrice * item.quantity).toFixed(2))}`
        ).join('\n')}
      
      Shipping Address:
      ${selectedAddress.addressLine1}
      ${selectedAddress.addressLine2 ? selectedAddress.addressLine2 + '\n' : ''}
      ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}
      ${selectedAddress.country}
      
      Estimated Delivery: Within 2-3 business days
      
      If you have any questions about your order, please don't hesitate to contact our customer service team.
      
      Thank you again for choosing Som' Sweet. We hope you enjoy your delicious treats!
      
      Best regards,
      The Som' Sweet Team`,
        buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${createdOrder.id}`,
        buttonText: "View Order Details"
      };
      // Sending the confirmation email to the customer
      await sendEmail(emailDetails, "success", "Order confirmation email sent!");

      // Setting up store notification email
      const storeNotificationDetails: EmailDetails = {
        emailTitle: `New Order Alert: Order #${createdOrder.id}`,
        username: "Som' Sweet Team",
        emailTo: "oinkoinkbakeryke@gmail.com",
        notice: "This is an automated order notification. Please process this order according to our standard procedures.",
        emailBody: `Dear Som' Sweet Team,

        A new order has been placed and requires your attention.

        Order Details:
        Order Number: #${createdOrder.id}
        Order Date: ${new Date(createdOrder.createdAt).toLocaleString()}
        Total Amount: £${createdOrder.total.toFixed(2)}

        Customer Information:
        Name: ${user.username}
        Email: ${user.email}

        Items Ordered:
        ${cart?.items.map(item =>
          `- ${item.product.name} ${item.variation ? `(${item.variation.name})` : ''} x ${item.quantity} - £${(item.variation ? (item.variation.price * item.quantity).toFixed(2) : (item.product.basePrice * item.quantity).toFixed(2))}`
        ).join('\n')}

        ${cart?.items.some(item => item.customText) ? `
        Custom Text Instructions:
        ${cart?.items.filter(item => item.customText).map(item =>
                  `- ${item.product.name}: "${item.customText}"`
                ).join('\n')}
        ` : ''}

        Shipping Address:
        ${selectedAddress.addressLine1}
        ${selectedAddress.addressLine2 ? selectedAddress.addressLine2 + '\n' : ''}
        ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}
        ${selectedAddress.country}

        Please process this order promptly and ensure it's prepared for shipping within our standard timeframe.

        If you have any questions or concerns about this order, please contact the customer service team.

        Best regards,
        Som' Sweet Automated Order System`,
        buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${createdOrder.id}`,
        buttonText: "View Order Details"
      };

      await sendEmail(storeNotificationDetails, "success", "Store notification email sent!");

      showToast('success', 'Order placed successfully')
      router.push(`/order-confirmation/${createdOrder.id}`)
    } catch (error) {
      console.error('Order creation failed:', error)
      showToast('error', 'Failed to create order. Please contact support.')
    }
  }

  if (isLoading) return <Loading />

  return (
    <NavChildFooterLayout>
      <main className="checkout_main_container page_container flex_column">
        <Image className='checkout_image' src={checkoutBg} alt={"Checkout"} title={"Checkout"} height={450} width={1200} quality={100} />
        <h1 className='section_title checkout_heading'>Checkout</h1>
        <div className="checkout_content">
          {/* Address Section */}
          <section className="address_section">
            {addresses.length > 0 && <h2 className='section_title'>Shipping Address</h2>}
            {addresses.length > 0 && (
              <Dropdown
                label="Select Address"
                items={addresses.map(address => `${address.id} ${address.addressLine1}, ${address.city}, ${address.state}, ${address.postalCode}`)}
                buttonText={selectedAddress ? `${selectedAddress.addressLine1}, ${selectedAddress.city}` : "Select an address"}
                clickFunction={handleAddressChange}
                required={true}
              />
            )}
            <MinimizableLayout title='Add a New Address' isActiveInit={false}>
              {/* <h3 className='section_title'></h3> */}
              {/* Address input fields */}
              <FormInput
                label="Address Line 1"
                autoComplete="address-line1"
                inputValue={newAddress.addressLine1 || ""}
                onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewAddress({ ...newAddress, addressLine1: e.target.value })
                }}
                inputType='text'
                readonly={false}
                required={true}
              />
              <FormInput
                label="Address Line 2"
                autoComplete="address-line2"
                inputValue={newAddress.addressLine2 || ""}
                onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewAddress({ ...newAddress, addressLine2: e.target.value })
                }}
                inputType='text'
                readonly={false}
                required={false}
              />
              <FormInput
                label="City"
                autoComplete="city"
                inputValue={newAddress.city || ""}
                onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewAddress({ ...newAddress, city: e.target.value })
                }}
                inputType='text'
                readonly={false}
                required={true}
              />
              <FormInput
                label="State"
                autoComplete="state"
                inputValue={newAddress.state || ""}
                onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewAddress({ ...newAddress, state: e.target.value })
                }}
                inputType='text'
                readonly={false}
                required={true}
              />
              <FormInput
                label="Postal Code"
                autoComplete="postal-code"
                inputValue={newAddress.postalCode || ""}
                onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewAddress({ ...newAddress, postalCode: e.target.value })
                }}
                inputType='text'
                readonly={false}
                required={true}
              />
              <FormInput
                label="Country"
                autoComplete="country"
                inputValue={newAddress.country || ""}
                onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewAddress({ ...newAddress, country: e.target.value })
                }}
                inputType='text'
                readonly={false}
                required={true}
              />
              <button className='custom_button' onClick={handleAddNewAddress}>Add New Address</button>
            </MinimizableLayout>
          </section>

          {/* Order Summary Section */}
          <section className="order_summary">
            <h2 className='section_title'>Order Summary</h2>
            {cart?.items.map((item) => (
              <div
                key={`${item.productId}-${item.variationId}`}
                className="cart_item"
              >
                <p>
                  {item.product.name} - {item.variation?.name}
                </p>
                <p>Quantity: {item.quantity}</p>
                <p>
                  Price: £
                  {(
                    (item.variation?.price || item.product.basePrice) *
                    item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}
            <p className='total_price'>
              Total: £
              {cart?.items
                .reduce(
                  (sum, item) =>
                    sum +
                    item.quantity *
                    (item.variation?.price || item.product.basePrice),
                  0
                )
                .toFixed(2)}
            </p>
          </section>

          {/* Stripe Payment Element */}
          {clientSecret && (
            <Elements stripe={stripePromise} options={paymentElementOptions}>
              <CheckoutForm handlePaymentSuccess={handlePaymentSuccess} />
            </Elements>
          )}
        </div>
      </main>
    </NavChildFooterLayout>
  )
}

export default Checkout