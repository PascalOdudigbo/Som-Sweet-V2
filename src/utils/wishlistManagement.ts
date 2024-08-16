// utils/wishlistManagement.ts

import { UserWishlistType } from './allModelTypes';
import { showToast } from './toast';

// A function to add a product to wishlist
export async function addToWishlist(userId: number, productId: number): Promise<void> {
  try {
    // Verify that the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Send the data to the backend
    const response = await fetch(`/api/wishlist/${userId}/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    // If adding failed
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add to wishlist');
    }
    // Adding successful
    showToast('success', 'Treat added to wishlist');
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    showToast('error', 'Failed to add item to wishlist');
    throw error;
  }
}
// A function to remove an item from wishlist
export async function removeFromWishlist(userId: number, productId: number): Promise<void> {
  try {
    // Varify user logged in
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Send data to backend
    const response = await fetch(`/api/wishlist/${userId}/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove from wishlist');
    }

    showToast('info', 'Treat removed from wishlist');
    
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    showToast('error', 'Failed to remove item from wishlist');
    throw error;
  }
}

// A function to get a user's wishlist
export async function getWishlist(userId: number): Promise<UserWishlistType[]> {
  try {
    // Verify that the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Fetching the data from the backend
    const response = await fetch(`/api/wishlist/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    // If fetch failed
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch wishlist');
    }
    // return wishlist data
    return response.json();
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    showToast('error', 'Failed to fetch wishlist');
    throw error;
  }
}