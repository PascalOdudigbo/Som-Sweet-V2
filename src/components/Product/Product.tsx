'use client'
import { ProductType } from '@/utils/allModelTypes';
import Image from 'next/image';
import React, { useMemo } from 'react'
import { likeIconActive, likeIconInctive } from '@/assets';
import "./_product.scss";
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthProvider';
import { isInWishlist } from '@/utils/productsManagement';
import { addToWishlist, removeFromWishlist } from '@/utils/wishlistManagement';


type Props = {
    product: ProductType;
}

function Product({ product }: Props) {
    // Defining a function to dynamially process the product description
    const productDescription = useMemo(() => {
        const description = (product?.description?.length !== undefined) && (product?.description?.length < 80) ? product?.description : product?.description?.slice(0, 100) + "..."
        return description
    }, [product?.description]);

    const router = useRouter();
    // Getting the user data 
    const {user, loadUserFromToken} = useAuth()
    console.log(product)

    return (
        <div className='product_main_container'>
            {
                user?.wishlist && <Image
                className={`wishlist_icon`}
                src={isInWishlist(user?.wishlist, product.id) ? likeIconActive : likeIconInctive}
                alt={product?.name}
                width={35}
                height={35}
                onClick={()=>{
                    if (user.wishlist && isInWishlist(user?.wishlist, product.id)){
                        removeFromWishlist(user.id, product.id)
                        loadUserFromToken()
                    }
                    else{
                        addToWishlist(user.id, product.id)
                        loadUserFromToken()
                    }

                }}
            />
            }
            
            <Image
                className='product_image'
                src={product?.images ? product?.images[0]?.imageUrl : ""}
                alt={product?.name}
                width={400}
                height={225}
                onClick={() => { router.push(`/product/${product.id}`) }}
            />
            <div className='product_content'>
                <h3 className='product_name'>{product?.name}</h3>
                <p className='product_description'>{productDescription}</p>
                <p className='product_price'>£{(parseFloat(product?.basePrice.toString())).toFixed(2)}</p>
            </div>
        </div>
    )
}

export default Product