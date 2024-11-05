// utils/socialMediaManagement.ts
import { SocialMediaType } from './allModelTypes';
import { showToast } from './toast';

// Fetch social media links
export async function getSocialLinks(): Promise<SocialMediaType[]> {
  try {
    const response = await fetch('/api/admin/socials', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch social links');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching social links:', error);
    showToast('error', 'Failed to fetch social media links');
    return [];
  }
}

// Update social media links
export async function updateSocialLinks(socialsData: SocialMediaType[]): Promise<SocialMediaType[] | null> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/admin/socials', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ socialsData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update social links');
    }

    showToast('success', 'Social media links updated successfully');
    return response.json();
  } catch (error) {
    console.error('Error updating social links:', error);
    showToast('error', 'Failed to update social media links');
    return null;
  }
}

// Validate social media URL
export function validateSocialMediaUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Format social media data for update
export function formatSocialMediaData(data: Partial<SocialMediaType>[]): SocialMediaType[] {
  return data.map(social => ({
    ...social,
    name: social.name?.trim() || '',
    url: social.url?.trim() || '',
  })) as SocialMediaType[];
}