'use client'
import { Loading, MinimizableLayout, NavChildFooterLayout } from '@/components'
import Image from 'next/image'
import React from 'react'
import { testBusiness } from '@/utils/allTestData'
import { policiesBg } from '@/assets'
import "./_storePolicies.scss"
import { useBusiness } from '@/components/contexts/BusinessProvider'

function StorePolicies() {
    // getting the business data from the business context provider
    const {business} = useBusiness()

    if (!business?.policies) {
        return <Loading />
    }

    if (business?.policies?.length === 0) {
        return (
            <NavChildFooterLayout>
                <main className='policies_main_container page_container'>
                <Image className='policies_image' src={policiesBg} alt={"Store Policies"} title={"Store Policies"} height={450} width={1200} quality={100} />

                    <div className='flex_row_center'>
                        <h1 className='section_title'>BUSINESS POLICIES</h1>
                    </div>

                    <p className='empty_policies_text'>No Business policies.</p>

                </main>

            </NavChildFooterLayout>

        )
    }

    return (
        <NavChildFooterLayout>
            <main className='policies_main_container page_container'>
                <Image className='policies_image' src={policiesBg} alt={"Store Policies"} title={"Store Policies"} height={450} width={1200} quality={100} />

                <div className='flex_row_center'>
                    <h1 className='section_title'>BUSINESS POLICIES</h1>
                </div>

                {
                    business?.policies?.map(policy => 
                    <MinimizableLayout 
                        key={policy?.id}
                        title={policy?.title.toUpperCase()}
                        isActiveInit={false}
                    >
                         <pre className='preformatted_text'>{policy?.content}</pre>

                    </MinimizableLayout>)
                }

            </main>

        </NavChildFooterLayout>


    )
}

export default StorePolicies
