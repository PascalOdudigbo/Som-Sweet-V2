import { ProductType, ProductVariationType, CartType } from './allModelTypes';
import { showToast } from './toast';

// A function to get the user's cart
export async function getCart(userId: number): Promise<CartType | null> {
  try {
    // Verify user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Getting the user's cart
    const response = await fetch(`/api/cart/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 0 }
    });
    // If there was an error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch cart');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    showToast('error', 'Failed to fetch cart');
    return null;
  }
}

// A function for addting an item to cart
export async function addToCart(
  product: ProductType,
  variation: ProductVariationType | null,
  quantity: number,
  customText: string,
  userId: number
): Promise<CartType | null> {
  try {
    // Verify the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Sending item data to the backend
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ product, variation, quantity, customText, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add item to cart');
    }

    const updatedCart: CartType = await response.json();
    return updatedCart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error; // Re-throw the error to be handled by the component
  }
}

// A function to calculate the cart total
export function calculateTotal(cart: CartType): number {
  return cart.items.reduce((total, item) => {
    // Getting the price based on variation selected or not
    const price = item.variation ? item.variation.price : item.product.basePrice;
    return total + item.quantity * price;
  }, 0);
}

// A function to remove an item from the cart
export async function removeFromCart(userId: number, itemId: number): Promise<CartType | null> {
  try {
    // Verify the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Removing the item from the cart
    const response = await fetch(`/api/cart/${userId}?itemId=${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // If an error occurs
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove item from cart');
    }

    return response.json();
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
}

// A function to update the cart item's quantity
export async function updateCartItemQuantity(userId: number, itemId: number, newQuantity: number): Promise<CartType | null> {
  try {
     // Verify the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Sending the updated quantity to the backend
    const response = await fetch(`/api/cart/${userId}?itemId=${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    // If the update fails
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update item quantity');
    }

    const updatedCart: CartType = await response.json();
    showToast('success', 'Quantity updated!');
    return updatedCart;
  } catch (error) {
    console.error('Error updating item quantity:', error);
    showToast('error', 'Failed to update cart!');
    throw error;
  }
}
