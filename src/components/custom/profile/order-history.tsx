interface OrderHistoryProps {
  orderItems:
    | {
        id: string;
        orderId: string;
        productId: string;
        storeId: string;
        quantity: number;
        priceAtOrder: number;
        status: string;
        escrowStatus: string;
        total: number;
        transferScheduledFor: Date | null;
        transferId: string | null;
      }[]
    | undefined
    | null;
}

export const OrderHistory = ({ orderItems }: OrderHistoryProps) => {
  return <>{JSON.stringify(orderItems)}</>;
};
