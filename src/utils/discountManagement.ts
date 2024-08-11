import { DiscountType, ProductType } from './allModelTypes';

// A function to handle fetching all offers data
export async function getAllDiscounts(): Promise<DiscountType[]> {
  try {
    const response = await fetch('/api/discounts', {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch discounts: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getAllDiscounts:', error);
    throw error;
  }
}

// A function to handle fetching an offer by ID
export async function getDiscountById(id: number): Promise<DiscountType> {
  try {
    const response = await fetch(`/api/discounts/${id}`, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch discount: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error in getDiscountById for id ${id}:`, error);
    throw error;
  }
}

// A function to handle creating an offer
export async function createDiscount(discount: Omit<DiscountType, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiscountType> {
  try {
    const response = await fetch('/api/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discount),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create discount: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in createDiscount:', error);
    throw error;
  }
}

// A function to handle updating an offer
export async function updateDiscount(id: number, discount: Partial<Omit<DiscountType, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DiscountType> {
  try {
    const response = await fetch(`/api/discounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discount),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update discount: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in updateDiscount for id ${id}:`, error.message);
      throw error;
    } else {
      console.error(`Unknown error in updateDiscount for id ${id}:`, error);
      throw new Error('An unknown error occurred while updating the discount');
    }
  }
}

// A function to handle deleting an offer
export async function deleteDiscount(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/discounts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete discount: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error(`Error in deleteDiscount for id ${id}:`, error);
    throw error;
  }
}

// A function to handle adding a product to an offer
export async function addProductToDiscount(discountId: number, productId: number): Promise<void> {
  try {
    const response = await fetch(`/api/discounts/${discountId}/products/${productId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add product to discount: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error(`Error in addProductToDiscount for discountId ${discountId} and productId ${productId}:`, error);
    throw error;
  }
}

// A function to handle removing a product from an offer
export async function removeProductFromDiscount(discountId: number, productId: number): Promise<void> {
  try {
    const response = await fetch(`/api/discounts/${discountId}/products/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to remove product from discount: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error(`Error in removeProductFromDiscount for discountId ${discountId} and productId ${productId}:`, error);
    throw error;
  }
}

// A function to handle getting a discounts products
export async function getProductsForDiscount(discountId: number): Promise<ProductType[]> {
  try {
    const response = await fetch(`/api/discounts/${discountId}/products`, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch products for discount: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error in getProductsForDiscount for discountId ${discountId}:`, error);
    throw error;
  }
}

// A function to handle selecting an offer image file
export const handleImageFileChangeAddDiscount = (
  event: React.ChangeEvent<HTMLInputElement>,
  setSelectedImageFile: React.Dispatch<React.SetStateAction<File | null | undefined>>,
  discount: Omit<DiscountType, 'id' | 'products' | 'createdAt' | 'updatedAt'>,
  setDiscount: React.Dispatch<React.SetStateAction<Omit<DiscountType, 'id' | 'products' | 'createdAt' | 'updatedAt'>>>
) => {
  const file = event.target.files?.[0];
  if (file) {
    setSelectedImageFile(file);
    setDiscount(prevDiscount => ({
      ...prevDiscount,
      imageUrl: URL.createObjectURL(file)
    }));
  }
};

// A function to handle changing the discount image during edit
export const handleImageFileChangeEditDiscount = (
  event: React.ChangeEvent<HTMLInputElement>,
  setSelectedImageFile: React.Dispatch<React.SetStateAction<File | null | undefined>>,
  discount: DiscountType | null,
  setDiscount: React.Dispatch<React.SetStateAction<DiscountType | null>>
) => {
  const file = event.target.files?.[0];
  if (file && discount) {
    setSelectedImageFile(file);
    setDiscount({
      ...discount,
      imageUrl: URL.createObjectURL(file)
    });
  }
};

// A function to handle searching through discounts
export function searchDiscounts(searchTerm: string, discounts: DiscountType[]): DiscountType[] {
  if (searchTerm === "") {
    return discounts;
  } else {
    return discounts.filter(discount => 
      discount.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
