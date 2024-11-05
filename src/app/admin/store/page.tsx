'use client'
import React, { useState, useEffect } from 'react'
import { FormInput, Loading, TextArea } from '@/components';
import { BusinessType, PolicyType, SocialMediaType } from '@/utils/allModelTypes';
import { getBusiness, updateBusiness } from '@/utils/businessManagement';
import { getSocialLinks, updateSocialLinks, validateSocialMediaUrl, formatSocialMediaData } from '@/utils/socialMediaManagement';
import { showToast } from '@/utils/toast';
import "./_storeManagement.scss"

function StoreManagement() {
    const [business, setBusiness] = useState<BusinessType | null>({
        id: 1,
        name: "Som' Sweet",
        description: "INDULGE IN THE SWEETEST MOMENTS",
        policies: [
            {
                id: 1,
                title: "Refund Policy",
                content: `At Som' Sweet, we take pride in our delicious cakes and pastries. We want you to be completely satisfied with your purchase. However, due to the perishable nature of our products, we have a specific refund policy to ensure fairness and food safety.
      
      1. Cancellation and Refunds Before Delivery:
         * You can cancel your order for a full refund up to 24 hours before the scheduled delivery time.
         * For custom orders, cancellations must be made at least 48 hours before the scheduled delivery time for a full refund.
      
      2. Issues with Your Order:
         * If you receive the wrong item, we will replace it free of charge or provide a full refund.
         * If your order arrives damaged or of poor quality, please contact us within 2 hours of delivery with photos of the issue. We will offer a replacement or a full refund.
      
      3. Taste Preference:
         * While we can't offer refunds based on personal taste preferences, we value your feedback. Please let us know if you're unsatisfied, and we'll work to make it right for future orders.
      
      4. Delivery Issues:
         * If your order doesn't arrive at the scheduled time, please contact us immediately. We will either expedite the delivery or provide a full refund.
      
      5. Allergies and Special Dietary Requirements:
         * We take allergies seriously. If you receive a product that doesn't match your specified dietary requirements, we will provide a full refund.
      
      6. How to Request a Refund:
         * Contact our customer service team via phone or email within 2 hours of receiving your order.
         * Provide your order number and a brief explanation of the issue.
         * If applicable, include clear photos of the product.
      
      7. Refund Processing:
         * Approved refunds will be processed within 3-5 business days.
         * Refunds will be issued to the original payment method.
      
      8. Gift Orders:
         * For gift orders, refunds will be issued to the purchaser, not the recipient.
      
      We're committed to your satisfaction. If you have any questions or concerns about our refund policy, please don't hesitate to contact us.`
            },
            {
                id: 2,
                title: "Shipping Policy",
                content: `Som' Sweet is committed to delivering fresh, high-quality baked goods to our customers.
    
    1. Delivery Area:
       * We currently deliver within a 20-mile radius of our Glasgow bakery location
       * Delivery fees are calculated based on distance and order size
       * Special arrangements may be made for locations outside our standard delivery area
    
    2. Delivery Times:
       * Standard delivery requires 24-hour advance notice
       * Same-day delivery available for an additional fee (subject to availability)
       * Delivery windows are scheduled in 2-hour blocks
       * Special event deliveries are scheduled with dedicated time slots
    
    3. Shipping Methods:
       * All deliveries are made using our temperature-controlled vehicles
       * Special packaging ensures product freshness and presentation
       * Corporate and bulk orders may require special delivery arrangements
    
    4. Order Tracking:
       * Real-time tracking available for all deliveries
       * SMS updates at key delivery milestones
       * Customer notification 30 minutes before delivery`
            },
            {
                id: 3,
                title: "Privacy Policy",
                content: `At Som' Sweet, we respect and protect your privacy.
    
    1. Information Collection:
       * We collect only essential information for order processing
       * Payment information is securely processed through Stripe
       * Contact details are used solely for order communication
       * Optional marketing communications require explicit consent
    
    2. Data Protection:
       * All personal data is encrypted and securely stored
       * We never share your information with third parties for marketing
       * You can request to view or delete your data at any time
       * We comply with all GDPR requirements
    
    3. Cookie Policy:
       * Essential cookies for site functionality
       * Analytics cookies to improve our service
       * Marketing cookies are optional
       * You can manage cookie preferences at any time`
            },
            {
                id: 4,
                title: "Allergen Policy",
                content: `Som' Sweet takes food safety seriously and provides clear allergen information.
    
    1. Kitchen Environment:
       * Our kitchen handles: nuts, gluten, dairy, eggs, and soy
       * Cross-contamination prevention measures are in place
       * Dedicated equipment for allergen-free products
       * Regular staff training on allergen awareness
    
    2. Product Information:
       * Complete allergen information available for all products
       * Clear labeling of common allergens
       * Custom orders can accommodate specific allergies
       * Ingredient lists available upon request
    
    3. Customer Responsibility:
       * Please inform us of any allergies when ordering
       * Discuss severe allergies with our staff directly
       * Review ingredient lists before consuming
       * Consider cross-contamination risks`
            },
            {
                id: 5,
                title: "Custom Order Policy",
                content: `Create your perfect custom treat with Som' Sweet.
    
    1. Ordering Timeline:
       * Minimum 72-hour notice for custom orders
       * Wedding cakes require 4-week minimum notice
       * Rush orders subject to availability and additional fees
       * Holiday orders may require extended notice
    
    2. Design Process:
       * Free initial consultation
       * Design approval required before production
       * Changes accepted up to 48 hours before delivery
       * Sample tastings available for wedding cakes
    
    3. Pricing:
       * 50% deposit required to confirm order
       * Final payment due 48 hours before delivery
       * Custom design fees vary by complexity
       * Wedding cake pricing includes consultation and tasting`
            }
        ],
        phone: "+44793870248",
        email: "info@somsweet.com",
        address: "GL4 5XL, Old Rothman Road, Glasgow",
        socialLinks: [
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
        ]
    })
    const [socials, setSocials] = useState<SocialMediaType[]>([
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
    const [policies, setPolicies] = useState<PolicyType[]>([])
    const [isLoadingBusiness, setIsLoadingBusiness] = useState(false)
    const [isLoadingSocials, setIsLoadingSocials] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch initial data
    useEffect(() => {
        async function fetchData() {
            try {
                const [businessData, socialsData] = await Promise.all([
                    getBusiness(),
                    getSocialLinks()
                ]);

                if (businessData) {
                    setBusiness(businessData);
                    setPolicies(businessData.policies || []);
                }
                setSocials(socialsData || []);
            } catch (error) {
                showToast('error', 'Failed to load store data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

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

    if (isLoading || !business) {
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

            <section className='policies_table_wrapper'>

            </section>
        </main>
    )
}

export default StoreManagement