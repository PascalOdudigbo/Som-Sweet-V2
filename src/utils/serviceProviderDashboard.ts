import db from '../db/db';

// Customer data
export async function getCustomerStats() {
  const totalCustomers = await db.user.count({
    where: { role: { name: 'Customer' } }
  });
  const newThisMonth = await db.user.count({
    where: {
      role: { name: 'Customer' },
      createdAt: { gte: new Date(new Date().setDate(1)) } // First day of current month
    }
  });

  return { totalCustomers, newThisMonth };
}

// Order data
export async function getOrderStats() {
  const totalOrders = await db.order.count();
  const pendingOrders = await db.order.count({ where: { status: 'Paid' } });
  const shippedOrders = await db.order.count({ where: { status: 'Shipped' } });

  return { totalOrders, pendingOrders, shippedOrders };
}

// Refund data
export async function getRefundStats() {
  const totalRefunds = await db.refund.count();
  const pendingRefunds = await db.refund.count({ where: { status: 'Pending' } });
  const approvedRefunds = await db.refund.count({ where: { status: 'Approved' } });

  return { totalRefunds, pendingRefunds, approvedRefunds };
}

// Recent activity data
export async function getRecentActivity() {
  const recentCustomer = await db.user.findFirst({
    where: { role: { name: 'Customer' } },
    orderBy: { createdAt: 'desc' },
    select: { username: true }
  });

  const recentOrder = await db.order.findFirst({
    where: { status: 'Shipped' },
    orderBy: { updatedAt: 'desc' },
    select: { id: true }
  });

  const recentRefund = await db.refund.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { id: true }
  });

  return {
    recentCustomer: recentCustomer?.username || 'N/A',
    recentOrder: recentOrder?.id.toString() || 'N/A',
    recentRefund: recentRefund?.id.toString() || 'N/A'
  };
}