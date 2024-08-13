// A file containing test data for the development process
import { BusinessType, CategoryType, DiscountType, ProductType } from "./allModelTypes";

export const testProducts: ProductType[] = [
    {
        id: 1,
        name: "Strawberry Cake",
        description: "Savor our Strawberry Bliss Cake: moist vanilla layers filled with fresh strawberry compote, wrapped in velvety strawberry frosting. Topped with glazed berries, it's a perfect blend of sweet and tart. Ideal for any celebration or indulgent treat.",
        basePrice: 55.00,
        categoryId: 1,
        active: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-07-15T00:00:00Z"),
        variations: [
            {
                id: 1,
                productId: 1,
                name: "1kg",
                price: 30.0,
                createdAt: new Date("2023-01-01T00:00:00Z"),
                updatedAt: new Date("2023-01-01T00:00:00Z"),
            },
            {
                id: 2,
                productId: 1,
                name: "1.5kg",
                price: 45.0,
                createdAt: new Date("2023-01-01T00:00:00Z"),
                updatedAt: new Date("2023-01-01T00:00:00Z"),
            },
            {
                id: 3,
                productId: 1,
                name: "2kg",
                price: 60.0,
                createdAt: new Date("2023-01-01T00:00:00Z"),
                updatedAt: new Date("2023-01-01T00:00:00Z"),
            },
            {
                id: 4,
                productId: 1,
                name: "2.5kg",
                price: 75.0,
                createdAt: new Date("2023-01-01T00:00:00Z"),
                updatedAt: new Date("2023-01-01T00:00:00Z"),
            },
            {
                id: 5,
                productId: 1,
                name: "3kg",
                price: 90.0,
                createdAt: new Date("2023-01-01T00:00:00Z"),
                updatedAt: new Date("2023-01-01T00:00:00Z"),
            },
        ],
        images: [
            {
                id: 1,
                productId: 1,
                imageUrl: "https://res.cloudinary.com/db7dgsxy2/image/upload/v1688305640/Oink_Oink_Product_Images/iracfbditfhp51whf0ss.jpg",
                imagePublicId: "strawberry-cake-whole",
                createdAt: new Date("2023-01-01T00:00:00Z"),
            },
            {
                id: 2,
                productId: 1,
                imageUrl: "https://res.cloudinary.com/db7dgsxy2/image/upload/v1688305644/Oink_Oink_Product_Images/nhovtinwmhezeltsvxnq.jpg",
                imagePublicId: "strawberry-cake-slice",
                createdAt: new Date("2023-01-01T00:00:00Z"),
            },
            {
                id: 3,
                productId: 1,
                imageUrl: "https://res.cloudinary.com/db7dgsxy2/image/upload/v1688305644/Oink_Oink_Product_Images/gosnk1yyj8fsiy6miyay.jpg",
                imagePublicId: "strawberry-cake-closeup",
                createdAt: new Date("2023-01-01T00:00:00Z"),
            },
        ],
    },
    {
        id: 2,
        name: "Glazed Donut",
        description: "A classic glazed donut.",
        basePrice: 4.5,
        categoryId: 2,
        active: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-06-01T00:00:00Z"),
        images: [
            {
                id: 2,
                productId: 2,
                imageUrl: "https://images.pexels.com/photos/4686958/pexels-photo-4686958.jpeg",
                imagePublicId: "glazed-donut",
                createdAt: new Date("2023-01-01T00:00:00Z"),
            },
        ],
    },
    {
        id: 3,
        name: "Chocolate Fudge",
        description: "A light and airy chocolate fudge shortcake.",
        basePrice: 40.0,
        categoryId: 1,
        active: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-06-01T00:00:00Z"),
        images: [
            {
                id: 3,
                productId: 3,
                imageUrl: "https://res.cloudinary.com/db7dgsxy2/image/upload/v1688247897/Oink_Oink_Product_Images/jvzs5cdwoqmqlhviow93.jpg",
                imagePublicId: "chocolate-fudge",
                createdAt: new Date("2023-01-01T00:00:00Z"),
            },
        ],
    },
    {
        id: 4,
        name: "Orange Cake",
        description: "A flavourful cake packed with fresh orange goodness.",
        basePrice: 52.0,
        categoryId: 3,
        active: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-06-01T00:00:00Z"),
        images: [
            {
                id: 4,
                productId: 4,
                imageUrl: "https://res.cloudinary.com/db7dgsxy2/image/upload/v1688248167/Oink_Oink_Product_Images/qaqhuomrewtskkbymycp.jpg",
                imagePublicId: "blueberry-muffin",
                createdAt: new Date("2023-01-01T00:00:00Z"),
            },
        ],
    },
    {
        id: 5,
        name: "French Baguette",
        description: "A classic French baguette with a crispy crust.",
        basePrice: 3.5,
        categoryId: 4,
        active: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-06-01T00:00:00Z"),
        images: [
            {
                id: 5,
                productId: 5,
                imageUrl: "https://cdn.pixabay.com/photo/2017/06/23/23/57/bread-2436370_1280.jpg",
                imagePublicId: "french-baguette",
                createdAt: new Date("2023-01-01T00:00:00Z"),
            },
        ],
    },
    {
        id: 6,
        name: "Cinnamon Roll",
        description: "A sweet roll with cinnamon and icing.",
        basePrice: 4.0,
        categoryId: 5,
        active: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-06-01T00:00:00Z"),
        images: [
            {
                id: 6,
                productId: 6,
                imageUrl: "https://cdn.pixabay.com/photo/2020/02/29/18/17/cinnamon-roll-4890783_1280.jpg",
                imagePublicId: "cinnamon-roll",
                createdAt: new Date("2023-01-01T00:00:00Z"),
            },
        ],
    },
];


export const testStrawberryCake: ProductType = {
    id: 1,
    name: "Strawberry Cake",
    description: "Savor our Strawberry Bliss Cake: moist vanilla layers filled with fresh strawberry compote, wrapped in velvety strawberry frosting. Topped with glazed berries, it's a perfect blend of sweet and tart. Ideal for any celebration or indulgent treat.",
    basePrice: 55.00,
    categoryId: 1,
    active: true,
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-07-15T00:00:00Z"),
    variations: [
        {
            id: 1,
            productId: 1,
            name: "1kg",
            price: 30.0,
            createdAt: new Date("2023-01-01T00:00:00Z"),
            updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
        {
            id: 2,
            productId: 1,
            name: "1.5kg",
            price: 45.0,
            createdAt: new Date("2023-01-01T00:00:00Z"),
            updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
        {
            id: 3,
            productId: 1,
            name: "2kg",
            price: 60.0,
            createdAt: new Date("2023-01-01T00:00:00Z"),
            updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
        {
            id: 4,
            productId: 1,
            name: "2.5kg",
            price: 75.0,
            createdAt: new Date("2023-01-01T00:00:00Z"),
            updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
        {
            id: 5,
            productId: 1,
            name: "3kg",
            price: 90.0,
            createdAt: new Date("2023-01-01T00:00:00Z"),
            updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
    ],
    images: [
        {
            id: 1,
            productId: 1,
            imageUrl: "https://res.cloudinary.com/db7dgsxy2/image/upload/v1688305640/Oink_Oink_Product_Images/iracfbditfhp51whf0ss.jpg",
            imagePublicId: "strawberry-cake-whole",
            createdAt: new Date("2023-01-01T00:00:00Z"),
        },
        {
            id: 2,
            productId: 1,
            imageUrl: "https://res.cloudinary.com/db7dgsxy2/image/upload/v1688305644/Oink_Oink_Product_Images/nhovtinwmhezeltsvxnq.jpg",
            imagePublicId: "strawberry-cake-slice",
            createdAt: new Date("2023-01-01T00:00:00Z"),
        },
        {
            id: 3,
            productId: 1,
            imageUrl: "https://res.cloudinary.com/db7dgsxy2/image/upload/v1688305644/Oink_Oink_Product_Images/gosnk1yyj8fsiy6miyay.jpg",
            imagePublicId: "strawberry-cake-closeup",
            createdAt: new Date("2023-01-01T00:00:00Z"),
        },
    ],
};

export const testBusiness: BusinessType = {
    id: 1,
    name: "Som' Sweet",
    description: "INDULGE IN THE SWEETEST MOMENTS",
    refundsPolicy: `At Som' Sweet, we take pride in our delicious cakes and pastries. We want you to be completely satisfied with your purchase. However, due to the perishable nature of our products, we have a specific refund policy to ensure fairness and food safety.
  
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
  
  We're committed to your satisfaction. If you have any questions or concerns about our refund policy, please don't hesitate to contact us.`,
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
            name: "Twitter",
            url: "https://www.twitter.com/somsweet"
        }
    ]
};
