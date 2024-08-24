'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavChildFooterLayout } from '@/components'
import { useAuth } from '@/components/contexts/AuthProvider'
import { createAddress } from '@/utils/addressManagement'
import { showToast } from '@/utils/toast'
import './_add_address.scss'
import Image from 'next/image'
import { addressBg } from '@/assets'
import dynamic from 'next/dynamic'
import { AddressType } from '@/utils/allModelTypes'

const FormInput = dynamic(
  () => import('@/components/FormInput/FormInput'),
  { ssr: false }
)

function ClientOnlyForm({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}

function AddAddress() {
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (user) {
      try {
        await createAddress({ ...newAddress, userId: user.id } as AddressType)
        router.push('/addresses')
      } catch (error) {
        console.error('Failed to add address:', error)
        showToast('error', 'Failed to add address')
      }
    }

    setIsLoading(false)
  }

  return (
    <NavChildFooterLayout>
      <main className="add_address_main_container page_container flex_column">
        <Image className='add_address_image' src={addressBg} alt={"Add Address"} title={"Add Address"} height={450} width={1200} quality={100} priority/>
        <h1 className='section_title add_address_heading'>Add New Address</h1>
        <div className="add_address_content">
          <ClientOnlyForm>
            <form onSubmit={handleSubmit} className="add_address_form">
              <FormInput
                label="Address Line 1"
                autoComplete="address-line1"
                inputValue={newAddress.addressLine1}
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
                inputValue={newAddress.addressLine2}
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
                inputValue={newAddress.city}
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
                inputValue={newAddress.state}
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
                inputValue={newAddress.postalCode}
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
                inputValue={newAddress.country}
                onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewAddress({ ...newAddress, country: e.target.value })
                }}
                inputType='text'
                readonly={false}
                required={true}
              />
              <button type="submit" className="custom_large_button add_address_button" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Address'}
              </button>
            </form>
          </ClientOnlyForm>
        </div>
      </main>
    </NavChildFooterLayout>
  )
}

export default AddAddress