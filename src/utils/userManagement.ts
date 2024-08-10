import { User } from './allModelTypes';

// A function to sign users up 
export async function signUp(userData: { username: string; email: string; password: string }): Promise<User> {
    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      // If the signup fails 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to sign up: ${errorData.error || response.statusText}`);
      }
      // return the response if the signup is successful
      return response.json();
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  }
  

export async function getUserProfile(): Promise<User> {
  try {
    const response = await fetch('/api/users/profile');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch user profile: ${errorData.error || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};