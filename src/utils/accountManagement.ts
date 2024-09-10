// utils/accountManagement.ts

import { UserType } from './allModelTypes';
import { showToast } from './toast';

// Function to update user profile
export async function updateUserProfile(userId: number, firstName: string, lastName: string): Promise<UserType | null> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ username: `${firstName} ${lastName}` }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }

    const updatedUser = await response.json();
    showToast('success', 'Profile updated successfully');
    return updatedUser;
  } catch (error) {
    console.error('Error updating profile:', error);
    showToast('error', 'Failed to update profile');
    return null;
  }
}

// Function to update user password
export async function updateUserPassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/users/${userId}/update-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ password: currentPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update password');
    }

    showToast('success', 'Password updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    showToast('error', 'Failed to update password');
    return false;
  }
}