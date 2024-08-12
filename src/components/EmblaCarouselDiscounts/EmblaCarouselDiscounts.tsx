import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { DiscountType } from '@/utils/allModelTypes'
import Image from 'next/image'
import './_embla_carousel_discounts.scss'

type PropType = {
  discounts: DiscountType[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { discounts, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {discounts.map((discount) => (
            <div className='embla__slide image_title_button_container flex_column_center'>
              <h1 className='offer_name playfair_shadow_title'>{discount.name}</h1>
              <Image className='offer_image' src={discount.imageUrl ?? ""} alt={discount.name} title={discount.description ?? ""} height={400} width={1024} />
              <button className='shop_offers_button border_button'>SHOP NOW</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
