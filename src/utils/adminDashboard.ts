import db from '../db/db';

// Staff data
export async function getStaffStats() {
  const staffRoles = await db.role.findMany({
    where: {
      name: {
        not: 'Customer' // Customer is the role name for non-staff users
      }
    },
    select: { id: true }
  });

  const staffRoleIds = staffRoles.map(role => role.id);

  const [totalStaff, activeStaff] = await Promise.all([
    db.user.count({
      where: {
        roleId: { in: staffRoleIds }
      }
    }),
    db.user.count({
      where: {
        roleId: { in: staffRoleIds },
        active: true
      }
    })
  ]);

  const inactiveStaff = totalStaff - activeStaff;

  return { totalStaff, activeStaff, inactiveStaff };
}

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
  const pendingApprovals = await db.user.count({
    where: { role: { name: 'Customer' }, active: false }
  });

  return { totalCustomers, newThisMonth, pendingApprovals };
}

// Product data
export async function getProductStats() {
  const totalProducts = await db.product.count();
  const activeProducts = await db.product.count({ where: { active: true } });
  const inactiveProducts = totalProducts - activeProducts;

  return { totalProducts, activeProducts, inactiveProducts };
}

// Offer data
export async function getOfferStats() {
  const now = new Date();
  const activeOffers = await db.discount.count({
    where: {
      validFrom: { lte: now },
      validUntil: { gte: now }
    }
  });
  const upcomingOffers = await db.discount.count({
    where: { validFrom: { gt: now } }
  });
  const expiredOffers = await db.discount.count({
    where: { validUntil: { lt: now } }
  });

  return { activeOffers, upcomingOffers, expiredOffers };
}

// Order data
export async function getOrderStats() {
  const totalOrders = await db.order.count();
  const pendingOrders = await db.order.count({ where: { status: 'Paid' } });
  const shippedOrders = await db.order.count({ where: { status: 'Shipped' } });

  return { totalOrders, pendingOrders, shippedOrders };
}

// Recent activity data
export async function getRecentActivity() {
  const recentCustomer = await db.user.findFirst({
    where: { role: { name: 'customer' } },
    orderBy: { createdAt: 'desc' },
    select: { username: true }
  });

  const recentOrder = await db.order.findFirst({
    where: { status: 'Pending' },
    orderBy: { updatedAt: 'desc' },
    select: { id: true }
  });

  const recentProduct = await db.product.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { name: true }
  });

  return {
    recentCustomer: recentCustomer?.username || 'N/A',
    recentOrder: recentOrder?.id.toString() || 'N/A',
    recentProduct: recentProduct?.name || 'N/A'
  };
}

// Sales overview data (for chart)
export async function getSalesOverview() {
  try {
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    const salesData = await db.$queryRaw<Array<{ month: Date; total: number }>>`
      SELECT DATE_TRUNC('month', "createdAt") as month, SUM(total) as total
      FROM "Order"
      WHERE "createdAt" >= ${sixMonthsAgo} AND "createdAt" < ${new Date(today.getFullYear(), today.getMonth() + 1, 1)}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const salesOverview = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
      const monthData = salesData.find(
        (data) => data.month.getMonth() === date.getMonth() &&
                  data.month.getFullYear() === date.getFullYear()
      );

      return {
        month: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
        sales: monthData ? Number(monthData.total) : 0,
      };
    });

    return salesOverview;
  } catch (error) {
    console.error('Error in getSalesOverview:', error);
    // Return fallback data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        month: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        sales: 0
      };
    }).reverse();
  }
}