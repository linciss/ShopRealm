import prisma from './db';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrdersFromSession = async (session: any) => {
  const cartId = session.metadata.cartId;
  const userId = session.client_reference_id;

  try {
    //   creeates the respective orde r
    const order = await prisma.order.create({
      data: {
        userId: userId as string,
        stripeSessionId: session.id,
        paymentStatus: 'paid',
        paymentIntentId: session.payment_intent,
        amount: session.amount_total / 100,
      },
    });

    //   finds user cart
    const cart = await prisma.cart.findUnique({
      where: { id: session.metadata.cartId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart) return { error: 'Cart not found' };

    // calcualtes the payment date
    const transferScheduleDate = new Date();
    // for testing purposes
    transferScheduleDate.setDate(transferScheduleDate.getDate());
    // transferScheduleDate.setDate(transferScheduleDate.getDate() + 14);

    // creates an orderitem
    await Promise.all(
      cart.cartItems.map(async (item) => {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            storeId: item.product.storeId,
            quantity: item.quantity,
            priceAtOrder: parseFloat(item.product.price),
            total: parseFloat(item.product.price) * item.quantity,
            status: 'pending',
            escrowStatus: 'holding',
            transferScheduledFor: transferScheduleDate,
          },
        });
      }),
    );

    // updates quantity of product
    await Promise.all(
      cart.cartItems.map((item) => {
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
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: 'Kluda!' };
  }
};
