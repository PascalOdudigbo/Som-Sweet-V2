// /utils/policyManagement
import { PolicyType } from './allModelTypes';

// Function to get all policies
export async function getAllPolicies(): Promise<PolicyType[]> {
  try {
    const response = await fetch('/api/policies');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch policies: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getAllPolicies:', error);
    throw error;
  }
}

// Function to get a policy by ID
export async function getPolicyById(id: number): Promise<PolicyType> {
  try {
    const response = await fetch(`/api/policies/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch policy: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error in getPolicyById for id ${id}:`, error);
    throw error;
  }
}

// Function to create a new policy
export async function createPolicy(policy: Omit<PolicyType, 'id' | 'businessId'>): Promise<PolicyType> {
  try {
    const response = await fetch('/api/policies', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Added auth token
      },
      body: JSON.stringify(policy),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create policy: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in createPolicy:', error);
    throw error;
  }
}

// Function to update an existing policy
export async function updatePolicy(
  id: number, 
  policy: Partial<Omit<PolicyType, 'id' | 'businessId'>>
): Promise<PolicyType> {
  try {
    const response = await fetch(`/api/policies/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Added auth token
      },
      body: JSON.stringify(policy),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update policy: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error in updatePolicy for id ${id}:`, error);
    throw error;
  }
}

// Function to delete a policy
export async function deletePolicy(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/policies/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Added auth token
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete policy: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error(`Error in deletePolicy for id ${id}:`, error);
    throw error;
  }
}

// Function to get policies by business ID
export async function getPoliciesByBusiness(businessId: number): Promise<PolicyType[]> {
  try {
    const response = await fetch(`/api/policies/business/${businessId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch business policies: ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error in getPoliciesByBusiness for businessId ${businessId}:`, error);
    throw error;
  }
}

// Function to validate policy content
export function validatePolicyContent(content: string): string | null {
  if (!content.trim()) {
    return 'Policy content cannot be empty';
  }
  if (content.length < 50) {
    return 'Policy content must be at least 50 characters long';
  }
  return null;
}