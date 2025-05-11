import { redirect } from 'next/navigation';
import { auth } from '../auth';
import prisma from '@/lib/db';

// checks if user has a store
export const checkHasStore = async (withRedirect: boolean = true) => {
  const session = await auth();

  if (!session?.user.id) return;

  let hasStore: boolean = false;
  try {
    const storeData = await prisma?.user.findUnique({
      where: { id: session?.user.id, hasStore: true },
    });

    if (!storeData) return;

    hasStore = storeData?.hasStore ?? false;
  } catch (err) {
    console.log('Error: ', err);
  }

  if (withRedirect) {
    if (!hasStore) return redirect('/create-store');
    if (hasStore) return redirect('/store/edit');
    return;
  }

  return hasStore;
};

// gets store name
export const getStoreName = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  const userId = session?.user.id;

  try {
    const storeData = await prisma?.store.findUnique({
      where: { userId },
    });

    if (!storeData) return;

    return {
      name: storeData.name,
      isStripeConnected: storeData.stripeAccountId ? true : false,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

// gets store data
export const getStoreData = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  const userId = session?.user.id;

  try {
    const storeData = await prisma?.store.findUnique({
      where: { userId },
    });

    if (!storeData) return;

    return storeData;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

// gets store id
export const getStoreId = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  const userId = session?.user.id;

  try {
    const storeData = await prisma?.store.findUnique({
      where: { userId },
    });

    if (!storeData) return;

    return storeData?.id;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

// gets all products for the store
export const getProducts = async () => {
  const session = await auth();
  if (!session?.user.id) return;

  const userId = session?.user.id;

  try {
    const storeData = await prisma?.store.findUnique({
      where: { userId },
      select: {
        products: {
          select: {
            id: true,
            name: true,
            isActive: true,
            image: true,
            price: true,
            quantity: true,
            slug: true,
            sale: true,
            salePrice: true,
          },
        },
      },
    });

    if (!storeData) return;

    return storeData?.products;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

// checks if store has the selected product and retursn the product for store preview
export const getFullStoreProductData = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const userId = session.user.id;

    const isStoreProduct = await prisma?.store.findUnique({
      where: { userId },
      select: {
        products: {
          where: {
            id: productId,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            quantity: true,
            isActive: true,
            image: true,
            slug: true,
            storeId: true,
            category: true,
            createdAt: true,
            updatedAt: true,
            reviews: {
              select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            details: true,
            specifications: true,
            sale: true,
            salePrice: true,
          },
        },
      },
    });

    if (!isStoreProduct) return;

    return isStoreProduct.products[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

// gets just product data for correspodnign productid
export const getStoreProductData = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const userId = session.user.id;

    const isStoreProduct = await prisma?.store.findUnique({
      where: { userId },
      select: {
        products: {
          where: {
            id: productId,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            quantity: true,
            isActive: true,
            image: true,
            category: true,
            details: true,
            specifications: true,
            sale: true,
            salePrice: true,
          },
        },
      },
    });

    if (!isStoreProduct) return;

    return isStoreProduct.products[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getStoreNameById = async (storeId: string) => {
  const session = await auth();
  if (!session?.user.id) return;
  try {
    return await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        name: true,
        description: true,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};

export const getStoreDataById = async (storeId: string) => {
  const session = await auth();
  if (!session?.user.id) return;
  try {
    return await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        name: true,
        description: true,
        products: {
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
            slug: true,
            reviews: {
              select: {
                rating: true,
              },
            },
            quantity: true,
            sale: true,
            salePrice: true,
          },
        },
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};

export const getAllDashboardStats = async () => {
  const session = await auth();
  if (!session?.user.id) return;

  try {
    const id = await getStoreId();

    if (!id) return;

    const store = await prisma.store.findUnique({
      where: { id },
      select: {
        products: {
          include: {
            reviews: {
              include: {
                user: {
                  select: {
                    name: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const allOrderItems = await prisma.orderItem.findMany({
      where: { storeId: id },
      include: {
        order: true,
      },
    });

    const currentDate = new Date();
    const lastWeekDate = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000,
    );

    // get order this week for a chart and recent order section
    const orderThisWeek = allOrderItems.filter(
      (order) =>
        order.createdAt >= lastWeekDate && order.createdAt <= currentDate,
    );

    const salesCount: Record<string, number> = {};

    allOrderItems.forEach((order) => {
      salesCount[order.productId] = (salesCount[order.productId] || 0) + 1;
    });

    const topProductIds = Object.entries(salesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([productId]) => productId);

    // top 3 selling products
    const topSelling = store?.products
      .filter((product) => topProductIds.includes(product.id))
      .map((product) => {
        const unitsSold = allOrderItems
          .filter((order) => order.productId === product.id)
          .reduce((acc, curr) => acc + curr.quantity, 0);

        return {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          sold: unitsSold,
        };
      })
      .sort((a, b) => b.sold - a.sold);

    // store product count
    const productCount = store?.products.length;

    // items that need attention aka the quantity is less than 5
    const attentionItems = store?.products
      .filter((product) => product.quantity < 5)
      .map((product) => {
        return {
          id: product.id,
          name: product.name,
          image: product.image,
          quantity: product.quantity,
        };
      });

    const allReviews =
      store?.products.flatMap((product) =>
        product.reviews.map((review) => ({
          ...review,
          productName: product.name,
        })),
      ) || [];

    const recentReviews = allReviews
      .sort(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
      )
      .slice(0, 5)
      .map((review) => {
        return {
          id: review.id,
          rating: review.rating,
          productName: review.productName,
          userName: review.user.name + ' ' + review.user.lastName,
        };
      });

    return {
      orderThisWeek,
      topSelling,
      productCount,
      attentionItems,
      recentReviews,
      allOrderItems,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};

export const getAnalytics = async () => {
  const session = await auth();
  if (!session?.user.id) return;

  try {
    const id = await getStoreId();

    if (!id) return;

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    const orders = await prisma.orderItem.findMany({
      where: { storeId: id },
      include: {
        order: true,
      },
    });

    // 1st stat toatl revenue
    const totalRevenue = orders
      .filter(
        (order) =>
          order.status === 'complete' || order.escrowStatus === 'released',
      )
      .reduce((accumulator, currVal) => accumulator + currVal.total, 0);

    const totalViews =
      store?.products.reduce(
        (accumulator, currVal) => accumulator + currVal.views,
        0,
      ) || 0;

    // 2nd stat conversion erate
    const conversionRate = (orders.length / totalViews) * 100 || 0;

    // 3rd stat avg order value
    const pendingRevenue =
      orders
        .filter(
          (order) => order.status !== 'complete' && order.status !== 'refunded',
        )
        .reduce((accumulator, currVal) => accumulator + currVal.total, 0) || 0;

    const totalOrders = orders.length;

    const totalCustomers: Record<string, number> = {};

    orders.forEach((order) => {
      totalCustomers[order.order.userId] =
        (totalCustomers[order.order.userId] || 0) + 1;
    });

    const revenuePerDay: Record<string, number> = {};

    // gets orders past 30 days so cna calculate monthly revenue
    const ordersPerMonth = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      return (
        orderDate.getTime() >= today.getTime() - 30 * 24 * 60 * 60 * 1000 &&
        orderDate.getTime() <= today.getTime()
      );
    });

    ordersPerMonth.forEach((order) => {
      const dayIndex = new Date(order.createdAt).toISOString().split('T')[0];

      revenuePerDay[dayIndex] = (revenuePerDay[dayIndex] || 0) + order.total;
    });

    const salesCount: Record<string, number> = {};

    orders.forEach((order) => {
      salesCount[order.productId] = (salesCount[order.productId] || 0) + 1;
    });

    const topProductIds = Object.entries(salesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productId]) => productId);

    // top 5 selling products
    const topSelling = store?.products
      .filter((product) => topProductIds.includes(product.id))
      .map((product) => {
        const convRate =
          (orders.filter((order) => order.productId === product.id).length /
            product.views) *
            100 || 0;

        const unitsSold = orders
          .filter((order) => order.productId === product.id)
          .reduce((acc, curr) => acc + curr.quantity, 0);

        const revenue = orders
          .filter((order) => order.productId === product.id)
          .reduce((acc, curr) => acc + curr.total, 0);

        return {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.sale
            ? product.salePrice || product.price
            : product.price,
          sold: unitsSold,
          views: product.views,
          convRate,
          revenue,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    return {
      totalRevenue,
      conversionRate,
      pendingRevenue,
      totalOrders,
      totalCustomers: Object.keys(totalCustomers).length,
      totalViews,
      revenuePerDay,
      topSelling,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};

export const aboutUsData = async () => {
  try {
    const openStores = await prisma.store.count({});
    const totalProducts = await prisma.product.count();
    const totalCustomers = await prisma.user.count({
      where: {
        hasStore: false,
      },
    });

    return {
      openStores,
      totalProducts,
      totalCustomers,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};

export const hasBeenApproved = async () => {
  const session = await auth();
  if (!session?.user.id) return;
  try {
    const userId = session.user.id;

    const store = await prisma.store.findUnique({
      where: { userId: userId },
      select: {
        approved: true,
      },
    });

    return store?.approved;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};
