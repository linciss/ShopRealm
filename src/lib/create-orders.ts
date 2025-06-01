import prisma from './db';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrdersFromSession = async (session: any) => {
  const cartId = session.metadata.cartId;

  const shippingName = session.metadata.name;
  const shippingLastName = session.metadata.lastName;
  const shippingEmail = session.metadata.email;
  const shippingPhone = session.metadata.phone;
  const shippingStreet = session.metadata.street;
  const shippingCity = session.metadata.city;
  const shippingCountry = session.metadata.country;
  const shippingPostalCode = session.metadata.postalCode;
  const productData = JSON.parse(session.metadata.productData) || [];

  if (!productData) {
    return { error: 'error' };
  }

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

    if (!cart) return { error: 'Grozs nav atrasts' };

    // calcualtes the payment date
    const transferScheduleDate = new Date();
    // for testing purposes
    transferScheduleDate.setDate(transferScheduleDate.getDate());
    // at first set 90 days but when the status of order is complete then set 14 days grace period
    // transferScheduleDate.setDate(transferScheduleDate.getDate() + 90);

    // creates an orderitem
    const products = await prisma.product.findMany({
      where: { id: { in: productData.map((p: { id: string }) => p.id) } },
      include: { store: true },
    });

    if (products.length === 0) {
      return { error: 'error' };
    }

    const cartProducts = products.map((product) => {
      const cartItem = productData.find(
        (item: { id: string }) => item.id === product.id,
      );

      const quantity = cartItem?.quantity || 0;
      const storeName = cartItem?.storeName || '';
      const storeEmail = cartItem?.storeEmail || '';
      const storePhone = cartItem?.storePhone || '';

      return {
        ...product,
        storePhone,
        storeEmail,
        storeName,
        quantity: quantity || 0,
      };
    });

    await Promise.all(
      cartProducts.map(async (item) => {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.id,
            storeId: item.storeId || '',
            quantity: item.quantity,
            priceAtOrder: parseFloat(
              item.sale ? item.salePrice || item.price : item.price,
            ),
            total:
              parseFloat(
                item.sale ? item.salePrice || item.price : item.price,
              ) * item.quantity,
            status: 'pending',
            escrowStatus: 'holding',
            transferScheduledFor: transferScheduleDate,
            shippingName: shippingName || '',
            shippingLastName: shippingLastName || '',
            shippingCity: shippingCity || '',
            shippingCountry: shippingCountry || '',
            shippingEmail: shippingEmail || '',
            shippingPhone: shippingPhone || '',
            shippingPostalCode: shippingPostalCode || '',
            shippingStreet: shippingStreet || '',
            storeName: item.storeName || '',
            storeEmail: item.storeEmail || '',
            storePhone: item.storePhone || '',
          },
        });
      }),
    );

    // updates quantity of product
    const purchasedCartItems = cart.cartItems.filter((item) => {
      return products.some((p: { id: string }) => p.id === item.productId);
    });

    await Promise.all(
      purchasedCartItems.map((item) => {
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

    return { success: 'success' };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      return { error: 'error' };
    }
    return { error: 'error' };
  }
};
