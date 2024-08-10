import { ProductType, ProductImageType } from "./allModelTypes";

// A function to get all the products
export async function getAllProducts(): Promise<ProductType[]> {
  try {
    const response = await fetch('/api/products', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch products: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw error;
  }
}

// A function to get a product by ID
export async function getProductById(id: number): Promise<ProductType> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch product: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw error;
  }
}

// A function to get products by category
export async function getProductsByCategory(categoryId: number): Promise<ProductType[]> {
  try {
    const response = await fetch(`/api/products/category/${categoryId}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch products by category: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    throw error;
  }
}

// A function to create a product
export async function createProduct(product: Omit<ProductType, 'id' | 'createdAt' | 'updatedAt' | 'variations' | 'images' | 'reviews' | 'orderItems' | 'discounts' | 'wishlistedBy'>): Promise<ProductType> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create product: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
}

// A function to update a product
export async function updateProduct(id: number, product: Partial<Omit<ProductType, 'id' | 'createdAt' | 'updatedAt' | 'variations' | 'images' | 'reviews' | 'orderItems' | 'discounts' | 'wishlistedBy'>>): Promise<ProductType> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update product: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
}

// A function to deactivate a product
export async function deactivateProduct(id: number): Promise<ProductType> {
  return updateProduct(id, { active: false });
}

// A function to delete or deactivate a product
export async function deleteOrDeactivateProduct(id: number): Promise<{ action: 'deleted' | 'deactivated', product: ProductType }> {
  const response = await fetch(`/api/products/${id}/delete-or-deactivate`, {
    method: 'POST',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to process product');
  }
  return response.json();
}

// A function to add a product image
export async function addProductImage(productId: number, imageUrl: string, imagePublicId: string): Promise<ProductImageType> {
  try {
    const response = await fetch(`/api/products/${productId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, imagePublicId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add product image: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in addProductImage:', error);
    throw error;
  }
}

// A function to delete a products images
export async function removeProductImage(productId: number, imageId: number): Promise<void> {
  try {
    const response = await fetch(`/api/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to remove product image: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Error in removeProductImage:', error);
    throw error;
  }
}

// A function to search through products
export function searchProducts(searchTerm: string, products: ProductType[]): ProductType[] {
  if (searchTerm === "") {
    return products;
  } else {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

// A function to get all recommended products
export async function getRecommendedProducts(productId: number): Promise<ProductType[]> {
  try {
    const response = await fetch(`/api/products/${productId}/recommendations`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch recommended products: ${errorData.error || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getRecommendedProducts:', error);
    throw error;
  }
}

// A function to get the latest products
export async function getLatestProducts(): Promise<ProductType[]> {
  try {
    const response = await fetch(`/api/products/latest`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch latest products: ${errorData.error || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getLatestProducts:', error);
    throw error;
  }
}