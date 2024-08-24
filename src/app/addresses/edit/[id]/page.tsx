// app/addresses/edit/[id]/page.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavChildFooterLayout, Loading } from '@/components'
import { useAuth } from '@/components/contexts/AuthProvider'
import { getAddressById, updateAddress } from '@/utils/addressManagement'
import { showToast } from '@/utils/toast'
import './_edit_address.scss'
import Image from 'next/image'
import { addressBg } from '@/assets'
import dynamic from 'next/dynamic'
import { AddressType } from '@/utils/allModelTypes'

// Dynamically import FormInput component to prevent hydration errors
const FormInput = dynamic(
  () => import('@/components/FormInput/FormInput'),
  { ssr: false }
)

// ClientOnlyForm component to ensure form renders only on client-side
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

// Main EditAddress component
function EditAddress({ params }: { params: { id: string } }) {
  const [address, setAddress] = useState<AddressType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  // Fetch the address data when component mounts
  useEffect(() => {
    const fetchAddress = async () => {
      if (user) {
        try {
          const fetchedAddress = await getAddressById(user.id, parseInt(params.id))
          setAddress(fetchedAddress)
        } catch (error) {
          console.error('Failed to fetch address:', error)
          showToast('error', 'Failed to fetch address')
          router.push('/addresses')
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchAddress()
  }, [user, params.id, router])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (user && address) {
      try {
        await updateAddress(parseInt(params.id), address)
        router.push('/addresses')
      } catch (error) {
        console.error('Failed to update address:', error)
        showToast('error', 'Failed to update address')
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) return <Loading />

  return (
    <NavChildFooterLayout>
      <main className="edit_address_main_container page_container flex_column">
        <Image className='edit_address_image' src={addressBg} alt={"Edit Address"} title={"Edit Address"} height={450} width={1200} quality={100} priority/>
        <h1 className='section_title edit_address_heading'>Edit Address</h1>
        <div className="edit_address_content">
          <ClientOnlyForm>
            <form onSubmit={handleSubmit} className="edit_address_form">
              <FormInput
                label="Address Line 1"
                autoComplete="address-line1"
                inputValue={address?.addressLine1 || ''}
                onChangeFunction={(e)=> {setAddress({ ...address, addressLine1: e.target.value} as AddressType)}}
                inputType='text'
                readonly={false}
                required={true}
              />

              <FormInput
                label="Address Line 2"
                autoComplete="address-line2"
                inputValue={address?.addressLine2 || ''}
                onChangeFunction={(e)=> {setAddress({ ...address, addressLine2: e.target.value} as AddressType)}}
                inputType='text'
                readonly={false}
                required={false}
              />
              <FormInput
                label="City"
                autoComplete="city"
                inputValue={address?.city || ''}
                onChangeFunction={(e)=> {setAddress({ ...address, city: e.target.value} as AddressType)}}
                inputType='text'
                readonly={false}
                required={true}
              />

              <FormInput
                label="State"
                autoComplete="state"
                inputValue={address?.state || ''}
                onChangeFunction={(e)=> {setAddress({ ...address, state: e.target.value} as AddressType)}}
                inputType='text'
                readonly={false}
                required={true}
              />

              <FormInput
                label="Postal Code"
                autoComplete="postal-code"
                inputValue={address?.postalCode || ''}
                onChangeFunction={(e)=> {setAddress({ ...address, postalCode: e.target.value} as AddressType)}}
                inputType='text'
                readonly={false}
                required={true}
                
              />
              <FormInput
                label="Country"
                autoComplete="country"
                inputValue={address?.country || ''}
                onChangeFunction={(e)=> {setAddress({ ...address, country: e.target.value} as AddressType)}}
                inputType='text'
                readonly={false}
                required={true}
              />

              <button type="submit" className="custom_large_button edit_address_button" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Address'}
              </button>
            </form>
          </ClientOnlyForm>
        </div>
      </main>
    </NavChildFooterLayout>
  )
}

export default EditAddress