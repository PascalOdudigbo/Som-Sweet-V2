"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FormInput, Loading } from '@/components'
import { ProductVariationType } from '@/utils/allModelTypes'
import { getProductVariationById, updateProductVariation } from '@/utils/productVariationManagement'
import { showToast } from '@/utils/toast'
import './_edit_variation.scss'

function EditVariation({ params }: { params: { id: string, variationId: string } }) {
    // Initializing state variables for dynamic data and state management
    const [variation, setVariation] = useState<ProductVariationType | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    // The router variable function for navigation
    const router = useRouter()

    useEffect(() => {
        // A function for fetching the variation data from the database
        const fetchVariation = async () => {
            try {
                // Getting the variation data using the util function
                const fetchedVariation = await getProductVariationById(parseInt(params.id), parseInt(params.variationId))
                setVariation(fetchedVariation)
            } catch (error) {
                // in the eventuality of an error occuring
                console.error('Failed to fetch variation:', error)
                showToast('error', 'Failed to load variation. Please try again.')
            }
        }
        // Calling the function
        fetchVariation()
    }, [params.id, params.variationId])

    // On submit function for varriation edit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!variation) return

        setIsLoading(true)
        window.scrollTo(0, 0)

        try {
            // Using the util function to update the variation
            const updatedVariation = await updateProductVariation(
                parseInt(params.id),
                parseInt(params.variationId),
                { name: variation.name, price: variation.price }
            )
            // If the edit was successful
            showToast('success', `${updatedVariation.name} variation updated successfully!`)
            router.push(`/admin/products/edit/${params.id}`)
        } catch (error) {
            // In the eventiality of the edit failing
            console.error('Failed to update variation:', error)
            showToast('error', 'Failed to update variation. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }
    // If the variation data coundn't be fetched then displaying the loading component
    if (!variation) {
        return <Loading/>
    }

    return (
        <div className='edit_variation_wrapper'>
            <header className='edit_variation_header flex_row_center'>
                <h2 className='section_title edit_variation_header_title'>Edit Variation</h2>
                <Link href={`/admin/products/edit/${params.id}`} className='back_link border_button_void'>BACK</Link>
            </header>

            <form className='edit_variation_form' onSubmit={handleSubmit}>
                <div className='edit_variation_content flex_column_center'>
                    <section className='form_inputs_section'>
                        <FormInput
                            label='Name'
                            inputType='text'
                            inputValue={variation.name}
                            required={true}
                            readonly={false}
                            onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => setVariation({ ...variation, name: e.target.value })}
                        />
                        <FormInput
                            label='Price'
                            inputType='number'
                            inputValue={variation.price.toString()}
                            required={true}
                            readonly={false}
                            onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => setVariation({ ...variation, price: parseFloat(e.target.value) })}
                        />
                    </section>
                </div>

                <div className='submit_button_section flex_column_justify_center'>
                    <button type="submit" className='custom_button edit_variation_form_button' disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'UPDATE'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditVariation