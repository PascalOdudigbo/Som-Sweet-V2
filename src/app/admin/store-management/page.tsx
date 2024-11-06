'use client'
import React, { useState, useEffect } from 'react'
import { FormInput, Loading, TextArea } from '@/components';
import { BusinessType, PolicyType, SocialMediaType } from '@/utils/allModelTypes';
import { getBusiness, updateBusiness } from '@/utils/businessManagement';
import { getSocialLinks, updateSocialLinks, validateSocialMediaUrl, formatSocialMediaData } from '@/utils/socialMediaManagement';
import { showToast } from '@/utils/toast';
import "./_storeManagement.scss"
import PolicyManagement from '../policies/page';
import { useBusiness } from '@/components/contexts/BusinessProvider';

function StoreManagement() {
    // Getting the business data from the context provider
    const {business, setBusiness} = useBusiness()
    const [socials, setSocials] = useState<SocialMediaType[]>(business?.socialLinks ?? [
        {
            id: 1,
            businessId: 1,
            name: "Facebook",
            url: "https://www.facebook.com/somsweet"
        },
        {
            id: 2,
            businessId: 1,
            name: "Instagram",
            url: "https://www.instagram.com/somsweet"
        },
        {
            id: 3,
            businessId: 1,
            name: "TikTok",
            url: "https://www.tiktok.com/somsweet"
        },
        {
            id: 3,
            businessId: 1,
            name: "Youtube",
            url: "https://www.youtube.com/somsweet"
        }
    ])
    const [isLoadingBusiness, setIsLoadingBusiness] = useState(false)
    const [isLoadingSocials, setIsLoadingSocials] = useState(false)

    // Handle business form submission
    const handleBusinessSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!business) return;

        setIsLoadingBusiness(true);
        try {
            const updatedBusiness = await updateBusiness(business);
            if (updatedBusiness) {
                setBusiness(updatedBusiness);
            }
        } catch (error) {
            showToast('error', 'Failed to update business information');
        } finally {
            setIsLoadingBusiness(false);
        }
    };

    // Handle socials form submission
    const handleSocialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoadingSocials(true);

        // Validate URLs
        const invalidUrls = socials.filter(social => !validateSocialMediaUrl(social.url));
        if (invalidUrls.length > 0) {
            showToast('error', 'Please enter valid URLs for all social media links');
            setIsLoadingSocials(false);
            return;
        }

        try {
            // Format and update social media data
            const formattedSocials = formatSocialMediaData(socials);
            const updatedSocials = await updateSocialLinks(formattedSocials);
            
            if (updatedSocials) {
                setSocials(updatedSocials);
            }
        } catch (error) {
            showToast('error', 'Failed to update social media links');
        } finally {
            setIsLoadingSocials(false);
        }
    };

    // Helper function to update social media URL
    const updateSocialUrl = (platform: string, url: string) => {
        setSocials(prevSocials => {
            const existingSocialIndex = prevSocials.findIndex(
                social => social.name.toLowerCase() === platform.toLowerCase()
            );

            if (existingSocialIndex >= 0) {
                // Update existing social media entry
                const updatedSocials = [...prevSocials];
                updatedSocials[existingSocialIndex] = {
                    ...updatedSocials[existingSocialIndex],
                    url
                };
                return updatedSocials;
            } else {
                // Add new social media entry
                return [...prevSocials, {
                    id: Math.max(0, ...prevSocials.map(s => s.id)) + 1,
                    businessId: business?.id || 0,
                    name: platform,
                    url
                }];
            }
        });
    };

    if (!business) {
        return <Loading />;
    }

    return (
        <main className='store_management_wrapper flex_column'>
            <header className='store_management_header flex_row_center'>
                <h2 className='section_title discounts_header_title'>Store Management</h2>
            </header>

            <section className='business_and_socials_form_wrapper'>
                <div className='business_management_form_wrapper flex_column_center'>
                    <form className='business_management_form' onSubmit={handleBusinessSubmit}>
                        <h3 className='signIn_form_title form_title'>Business</h3>

                        <FormInput
                            label='Name'
                            inputType='text'
                            inputValue={business?.name}
                            required={true}
                            readonly={false}
                            onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => 
                                setBusiness(prev => prev ? { ...prev, name: e.target.value } : null)}
                        />

                        <TextArea
                            label='Description'
                            inputValue={business.description || ''}
                            required={false}
                            onChangeFunction={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                                setBusiness(prev => prev ? { ...prev, description: e.target.value } : null)}
                            rows={5}
                            cols={45}
                            maxLength={34}
                        />
                        <FormInput
                            label='Phone'
                            inputType='phone'
                            inputValue={business.phone}
                            required={true}
                            readonly={false}
                            onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => 
                                setBusiness(prev => prev ? { ...prev, phone: e.target.value } : null)}
                        />
                        <FormInput
                            label='Email'
                            inputType='email'
                            inputValue={business.email}
                            required={true}
                            readonly={false}
                            onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => 
                                setBusiness(prev => prev ? { ...prev, email: e.target.value } : null)}
                        />
                        <FormInput
                            label='Address'
                            inputType='text'
                            inputValue={business.address}
                            required={true}
                            readonly={false}
                            onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => 
                                setBusiness(prev => prev ? { ...prev, address: e.target.value } : null)}
                        />

                        <button type="submit" className='custom_button edit_product_form_button' 
                            disabled={isLoadingBusiness}>
                            {isLoadingBusiness ? 'Saving...' : 'SAVE CHANGES'}
                        </button>
                    </form>
                </div>

                <div className='socials_management_form_wrapper flex_column_justify_center'>
                    <form className='socials_management_form' onSubmit={handleSocialsSubmit}>
                        <h3 className='signIn_form_title form_title'>Socials</h3>

                        {['Instagram', 'Facebook', 'TikTok', 'Youtube'].map((platform) => (
                            <FormInput
                                key={platform}
                                label={platform}
                                inputType='text'
                                inputValue={socials.find(social => 
                                    social.name.toLowerCase() === platform.toLowerCase())?.url ?? ""}
                                required={true}
                                readonly={false}
                                onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) => 
                                    updateSocialUrl(platform, e.target.value)}
                            />
                        ))}

                        <button type="submit" className='custom_button edit_product_form_button' 
                            disabled={isLoadingSocials}>
                            {isLoadingSocials ? 'Saving...' : 'SAVE CHANGES'}
                        </button>
                    </form>
                </div>
            </section>

           <PolicyManagement/>
        </main>
    )
}

export default StoreManagement