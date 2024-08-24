'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { NavChildFooterLayout, Loading } from '@/components'
import { deleteAddress, getUserAddresses } from '@/utils/addressManagement'
import { useAuth } from '@/components/contexts/AuthProvider'
import { AddressType } from '@/utils/allModelTypes'
import './_addresses.scss'
import { addressesBg } from '@/assets'
import Image from 'next/image'
import { showToast } from '@/utils/toast'

function Addresses() {
  // State variables for addresses and loading status
  const [addresses, setAddresses] = useState<AddressType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // Get user data from auth provider
  const { user } = useAuth()

  useEffect(() => {
    // Function to fetch user addresses
    const fetchAddresses = async () => {
      if (user) {
        try {
          const fetchedAddresses = await getUserAddresses(user.id)
          setAddresses(fetchedAddresses)
        } catch (error) {
          console.error('Failed to fetch addresses:', error)
        }
      }
      setIsLoading(false)
    }
    // Call the fetch function
    fetchAddresses()
  }, [user])

  // A function to handle deleting an address
  const handleDeleteAddress = async (addressId: number) => {
    if (user) {
      try {
        await deleteAddress(user.id, addressId)
        setAddresses(addresses.filter(address => address.id !== addressId))
        showToast('success', 'Address deleted successfully')
      } catch (error) {
        console.error('Failed to delete address:', error)
        showToast('error', 'Failed to delete address')
      }
    }
  }

  if (isLoading) return <Loading />

  return (
    <NavChildFooterLayout>
      <main className='addresses_container page_container'>
        <Image className='addresses_image' src={addressesBg} alt={"Your addresses"} title={"Your addresses"} height={450} width={1200} quality={100} />

        <div className='header_container'>
          <h1 className='page_title section_title'>Your Addresses</h1>
          <Link href="/addresses/add" className='add_address_button border_button_void'>Add Address</Link>
        </div>

        {addresses.length === 0 ? (
          <p className='empty_addresses_text'>You have no saved addresses.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className='address_card'>
              <h2 className='section_title'>{address.addressLine1}</h2>
              <p>{address.addressLine2}</p>
              <p>{address.city}, {address.state} {address.postalCode}</p>
              <p>{address.country}</p>
              <div className='flex_row_center buttons_container'>
                <Link href={`/edit-address/${address.id}`} className='edit_address_button'>Edit</Link>
                {address.orders && address.orders.length === 0 && (
                  <button onClick={() => { handleDeleteAddress(address.id) }} className='delete_address_button'>Delete</button>
                )}
              </div>

            </div>
          ))
        )}
      </main>
    </NavChildFooterLayout>
  )
}

export default Addresses