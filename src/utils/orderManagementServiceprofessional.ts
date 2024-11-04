import { OrderType } from "./allModelTypes";
import { showToast } from "./toast";

// A function to get all the orders
export async function getAllOrders(): Promise<OrderType[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/service/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch orders');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching all orders:', error);
    showToast('error', 'Failed to fetch orders');
    throw error;
  }
}

// A function for admins to update the status of an order
export async function updateOrderStatusAdmin(orderId: number, newStatus: string): Promise<OrderType> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/service/orders`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId, status: newStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update order status');
    }

    const updatedOrder = await response.json();
    showToast('success', `Order #${orderId} status updated to ${newStatus}`);
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    showToast('error', 'Failed to update order status');
    throw error;
  }
}