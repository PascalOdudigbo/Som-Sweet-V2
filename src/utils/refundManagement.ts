import { RefundType } from './allModelTypes';
import { showToast } from './toast';

// A function to handle getting refunds by order ID
export async function getRefundsByOrderId(orderId: number): Promise<RefundType[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/refunds/order/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch refunds');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching refunds:', error);
    showToast('error', 'Failed to fetch refunds');
    throw error;
  }
}

// A function to handle requesting a refund
export async function requestRefund(orderId: number, amount: number, reason: string): Promise<RefundType> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/refunds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId, amount, reason }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to request refund');
    }

    return response.json();
  } catch (error) {
    console.error('Error requesting refund:', error);
    throw error;
  }
}

// A function to handle getting all refunds
export async function getAllRefunds(): Promise<RefundType[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/refunds', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch refunds');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching refunds:', error);
    showToast('error', 'Failed to fetch refunds');
    throw error;
  }
}

// A function to handle approving a refund
export async function approveRefund(refundId: number): Promise<RefundType> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/refunds/${refundId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to approve refund');
    }

    showToast('success', 'Refund approved successfully');
    return data;
  } catch (error) {
    console.error('Error approving refund:', error);
    showToast('error', 'Failed to approve refund');
    throw error;
  }
}

// A function to handle denying a refund request
export async function denyRefund(refundId: number): Promise<RefundType> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/refunds/${refundId}/deny`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to deny refund');
    }

    showToast('info', 'Refund request denied');
    return response.json();
  } catch (error) {
    console.error('Error denying refund:', error);
    showToast('error', 'Failed to deny refund');
    throw error;
  }
}