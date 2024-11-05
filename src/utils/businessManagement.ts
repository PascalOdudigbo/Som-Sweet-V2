// utils/businessManagement.ts
import { BusinessType } from './allModelTypes';
import { showToast } from './toast';

// Fetch business data
export async function getBusiness(): Promise<BusinessType | null> {
  try {
    const response = await fetch('/api/admin/business', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch business data');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching business data:', error);
    showToast('error', 'Failed to fetch business data');
    return null;
  }
}

// Update business data
export async function updateBusiness(businessData: Partial<BusinessType>): Promise<BusinessType | null> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/admin/business', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(businessData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update business data');
    }

    showToast('success', 'Business information updated successfully');
    return response.json();
  } catch (error) {
    console.error('Error updating business data:', error);
    showToast('error', 'Failed to update business information');
    return null;
  }
}