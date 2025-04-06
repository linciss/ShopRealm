import prisma from './db';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrdersFromSession = async (session: any) => {
  const cartId = session.metadata.cartId;
  const userId = session.client_reference_id;

  //   creeates the respective orde r
  const order = await prisma.order.create({
    data: {
      userId: userId as string,
      stripeSessionId: session.id,
      paymentStatus: 'paid',
      amount: session.amount_total / 100,
      status: 'processing',
    },
  });

  //   finds user cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId },
    include: { product: true },
  });

  //   makes orderitems for order
  await Promise.all(
    cartItems.map((item) =>
      prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          storeId: item.product.storeId,
          quantity: item.quantity,
          priceAtOrder: parseFloat(item.product.price),
        },
      }),
    ),
  );

  //   updates the quantity for product
  await Promise.all(
    cartItems.map((item) => {
      const newQuantity = Math.max(0, item.product.quantity - item.quantity);
      const isOutOfStock = newQuantity === 0;

      return prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: newQuantity,
          ...(isOutOfStock ? { isActive: false } : {}),
        },
      });
    }),
  );

  //   delte cart items
  await prisma.cartItem.deleteMany({
    where: { cartId },
  });

  return order;
};
