'use client'
import { useState, useEffect } from 'react';
import { User } from '@/utils/allModelTypes';
import { parseJwt } from '@/utils/userManagement';
import { useRouter } from 'next/navigation';

export function useAuth() {
  // Initializing state variables for use data and its data loading
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Declaring the router variable function
  const router = useRouter()

  // A function to load a user from the login token 
  async function loadUserFromToken() {
    if (typeof window !== 'undefined') {
      // Getting the token from the local storage
      const token = localStorage.getItem('token');
      if (token) {
        // Decoding the token 
        const decodedToken: any = parseJwt(token);
        // If the token hasn't expired 
        if (decodedToken && Date.now() < decodedToken.exp * 1000) {
          // Get the user data 
          try {
            const response = await fetch('/api/users/', {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
              // If the data was fetched successfully
              const userData = await response.json();
              setUser(userData);
            } else {
              // If not successful clear the token 
              localStorage.removeItem('token');
              setUser(null);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          // If the token has expired
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        // if the token doesn't exist in localstorage
        setUser(null);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    // Getting the user data
    loadUserFromToken();
  }, []);

  // A function to handle user login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        // If the login was successful
        const { user, token } = await response.json();
        localStorage.setItem('token', token);
        setUser(user);
        return user;
      } else {
        // If the login was unsuccessful
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // A function to handle user logout
  const logout = () => {
    // Removing the login token from the localStorage and setting user data to null
    localStorage.removeItem('token');
    setUser(null);
    // Navigating to the store page 
    router.push("/store")
    
  };
  
  return { user, loading, login, logout, loadUserFromToken };
}