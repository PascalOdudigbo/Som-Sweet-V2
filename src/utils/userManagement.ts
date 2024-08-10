import { UserType } from './allModelTypes';

// A function to sign users up 
export async function signUp(userData: { username: string; email: string; password: string }): Promise<UserType> {
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
  

export async function getUserProfile(): Promise<UserType> {
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

// A function to handle user account recovery
export const accountrecovery = async (email: string, setUser: React.Dispatch<React.SetStateAction<UserType | null>>) => {
  try {
    const response = await fetch('/api/users/account-recovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email}),
    });
    if (response.ok) {
      // If the account was found successfully
      const { user } = await response.json();
      setUser(user);
      return user;
    } else {
      // If the account recovery was unsuccessful
      throw new Error('Account recovery failed');
    }
  } catch (error) {
    console.error('Account recovery error:', error);
    throw error;
  }
};