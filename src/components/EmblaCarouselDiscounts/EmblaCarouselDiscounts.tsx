'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { DiscountType } from '@/utils/allModelTypes'
import Image from 'next/image'
import './_embla_carousel_discounts.scss'
import { discountStatus, isDiscountValid } from '@/utils/discountManagement'
import { useRouter } from 'next/navigation'

type PropType = {
  discounts: DiscountType[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { discounts, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter();

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const validDiscounts = discounts.filter(isDiscountValid)

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {validDiscounts.map((discount, index) => (
            <div className={`embla__slide ${index === selectedIndex ? 'is-selected' : ''}`} key={discount.id}>
              <div className='image_title_button_container'>
                <h1 className='offer_name playfair_shadow_title'>{discount.name}</h1>
                <Image className='offer_image' src={discount.imageUrl ?? ""} alt={discount.name} title={discount.description ?? ""} layout="fill" objectFit="cover" />
                <button className='shop_offers_button border_button' onClick={()=>{router.push(`/offer/${discount.id}`)}}>{discountStatus(discount) === "Active" ? "SHOP NOW" : "LEARN MORE"}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel